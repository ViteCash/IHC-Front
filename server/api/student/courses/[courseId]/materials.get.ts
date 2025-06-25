import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async event => {
    const { supabase, user } = await useSupabase(event)
    const courseId = getRouterParam(event, 'courseId')

    if (!courseId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID del curso requerido'
        })
    }

    try {
        // Verificar que el estudiante está matriculado en el curso
        const { data: enrollment } = await supabase
            .from('course_enrollments')
            .select('id')
            .eq('course_id', courseId)
            .eq('student_id', user?.id)
            .single()

        if (!enrollment) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No tienes acceso a los materiales de este curso'
            })
        }

        // Obtener los materiales del curso
        const { data: materials, error } = await supabase
            .from('course_materials')
            .select(`
                id,
                title,
                file_name,
                file_url,
                file_size,
                created_at
            `)
            .eq('course_id', courseId)
            .order('created_at', { ascending: false })

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: `Error al obtener materiales: ${error.message}`
            })
        }

        return {
            success: true,
            data: materials || []
        }

    } catch (error: any) {
        console.error('Error en get student materials:', error)
        
        if (error.statusCode) {
            throw error
        }
        
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor'
        })
    }
})