import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async (event) => {
  try {
    const { supabase, user } = await useSupabase(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Verificar que sea profesor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'profesor') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los profesores pueden crear cursos'
      })
    }

    const body = await readBody(event)
    const { title, description, course_code } = body

    if (!title || !course_code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Título y código del curso son requeridos'
      })
    }

    // Verificar que el código sea único
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('course_code', course_code)
      .single()

    if (existingCourse) {
      throw createError({
        statusCode: 409,
        statusMessage: 'El código del curso ya existe'
      })
    }

    // Crear el curso
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        course_code,
        teacher_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: course
    }
  } catch (error: any) {
    console.error('Error creando curso:', error)
    throw error
  }
})