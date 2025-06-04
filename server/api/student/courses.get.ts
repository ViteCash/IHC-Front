import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Obtener el usuario autenticado
    const user = await serverSupabaseUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }
    console.log('Usuario autenticado:', user.id)
    // Verificar que sea un estudiante
    const supabase = serverSupabaseServiceRole(event)
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error al obtener el perfil del usuario'
      })
    }

    if (profile.role !== 'alumno') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los estudiantes pueden acceder a esta información'
      })
    }

    // Obtener cursos donde el estudiante está matriculado
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('course_enrollments')
      .select('course_id, enrolled_at')
      .eq('student_id', user.id)
      .order('enrolled_at', { ascending: false })

    // console.log('Matrículas obtenidas:', enrollments)

    if (enrollmentsError) {
      console.error('Error al obtener las matrículas:', enrollmentsError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener las matrículas del estudiante'
      })
    }

    if (!enrollments || enrollments.length === 0) {
      // El estudiante no está matriculado en ningún curso
      return {
        success: true,
        data: [],
        count: 0
      }
    }

    // Extraer los IDs de los cursos
    const courseIds = enrollments.map(enrollment => enrollment.course_id)

    // Obtener la información completa de los cursos
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        course_code,
        created_at,
        teacher_id,
        profiles:teacher_id (
          first_name,
          last_name,
          email
        )
      `)
      .in('id', courseIds)
      .order('created_at', { ascending: false })

      // console.log('Cursos obtenidos:', courses)
      
    if (coursesError) {
      console.error('Error al obtener los cursos:', coursesError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los detalles de los cursos'
      })
    }

    // Formatear la respuesta con la información completa
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      courseCode: course.course_code,
    }))

    console.log('Cursos formateados:', formattedCourses)

    return {
      success: true,
      data: formattedCourses,
      count: formattedCourses.length
    }

  } catch (error: any) {
    console.error('Error en /api/student/courses:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})