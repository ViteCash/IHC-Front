import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async (event) => {
  try {
    const { supabase, user } = await useSupabase(event)
    const courseId = getRouterParam(event, 'courseId')

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Verificar permisos
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course || course.teacher_id !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para ver este curso'
      })
    }

    // Obtener materiales
    const { data: materials, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: materials
    }
  } catch (error: any) {
    console.error('Error obteniendo materiales:', error)
    throw error
  }
})