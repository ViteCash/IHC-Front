import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async event => {
    const { supabase, user } = await useSupabase(event)
    const materialId = getRouterParam(event, 'materialId')

    if (!materialId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID del material requerido'
        })
    }

    try {
        // Obtener información del material y verificar permisos
        const { data: material, error: materialError } = await supabase
            .from('course_materials')
            .select(`
                *,
                courses!course_materials_course_id_fkey (
                    teacher_id
                )
            `)
            .eq('id', materialId)
            .single()

        if (materialError || !material) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Material no encontrado'
            })
        }

        // Verificar que el usuario es el profesor del curso
        if (material.courses.teacher_id !== user?.id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No tienes permisos para eliminar este material'
            })
        }

        // Eliminar el archivo del storage
        const filePath = material.file_url.split('/').slice(-3).join('/')
        const { error: storageError } = await supabase.storage
            .from('course-materials')
            .remove([filePath])

        if (storageError) {
            console.warn('Error eliminando archivo del storage:', storageError)
            // Continuar con la eliminación de la DB aunque falle el storage
        }

        // Eliminar el registro de la base de datos
        const { error: deleteError } = await supabase
            .from('course_materials')
            .delete()
            .eq('id', materialId)

        if (deleteError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Error al eliminar material: ${deleteError.message}`
            })
        }

        return {
            success: true,
            message: 'Material eliminado exitosamente'
        }

    } catch (error: any) {
        console.error('Error en delete material:', error)
        
        if (error.statusCode) {
            throw error
        }
        
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor'
        })
    }
})