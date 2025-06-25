import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async (event) => {
  try {
    const { supabase, user } = await useSupabase(event)
    const courseId = getRouterParam(event, 'courseId')
    const body = await readBody(event)
    const { studentEmail } = body

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Verificar que el profesor sea dueño del curso
    const { data: course } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single()

    if (!course || course.teacher_id !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para modificar este curso'
      })
    }

    // Buscar estudiante por email
    const { data: student } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', studentEmail)
      .eq('role', 'alumno')
      .single()

    if (!student) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Estudiante no encontrado'
      })
    }

    // Verificar si ya está matriculado
    const { data: existingEnrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('student_id', student.id)
      .single()

    if (existingEnrollment) {
      throw createError({
        statusCode: 409,
        statusMessage: 'El estudiante ya está matriculado en este curso'
      })
    }

    // Matricular estudiante
    const { data: enrollment, error } = await supabase
      .from('course_enrollments')
      .insert({
        course_id: courseId,
        student_id: student.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: {
        enrollment,
        student
      }
    }
  } catch (error: any) {
    console.error('Error matriculando estudiante:', error)
    throw error
  }
})