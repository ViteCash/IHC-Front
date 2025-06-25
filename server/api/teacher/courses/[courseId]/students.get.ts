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

    // Verificar que el profesor sea dueño del curso
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

    // Obtener estudiantes matriculados
    const { data: enrollments, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        enrolled_at,
        profiles:student_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('course_id', courseId)
      .order('enrolled_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: enrollments.map(enrollment => ({
        enrollmentId: enrollment.id,
        enrolledAt: enrollment.enrolled_at,
        student: enrollment.profiles
      }))
    }
  } catch (error: any) {
    console.error('Error obteniendo estudiantes:', error)
    throw error
  }
})