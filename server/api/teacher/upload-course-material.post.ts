import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async event => {
    const { supabase, user } = await useSupabase(event)

    try {
        const formData = await readFormData(event)
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const courseId = formData.get('courseId') as string

        if (!file || !title || !courseId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan parámetros requeridos: file, title, courseId'
            })
        }

        // Verificar que el usuario es el profesor del curso
        const { data: course } = await supabase
            .from('courses')
            .select('teacher_id')
            .eq('id', courseId)
            .single()

        if (!course || course.teacher_id !== user?.id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No tienes permisos para subir archivos a este curso'
            })
        }

        // Generar nombre único para el archivo
        const timestamp = new Date().getTime()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`
        const filePath = `${courseId}/materials/${fileName}`

        // Subir archivo a Supabase Storage
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('course-materials')
            .upload(filePath, uint8Array, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Error al subir archivo: ${uploadError.message}`
            })
        }

        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
            .from('course-materials')
            .getPublicUrl(filePath)

        // Guardar información del material en la base de datos
        const { data: materialData, error: dbError } = await supabase
            .from('course_materials')
            .insert({
                course_id: courseId,
                title: title,
                file_name: file.name,
                file_url: urlData.publicUrl,
                file_size: file.size,
                uploaded_by: user?.id
            })
            .select()
            .single()

        if (dbError) {
            // Si hay error en la DB, intentar eliminar el archivo subido
            await supabase.storage
                .from('course-materials')
                .remove([filePath])
            
            throw createError({
                statusCode: 500,
                statusMessage: `Error al guardar material en la base de datos: ${dbError.message}`
            })
        }

        return {
            success: true,
            data: {
                id: materialData.id,
                title: materialData.title,
                file_url: materialData.file_url,
                file_name: materialData.file_name,
                file_size: materialData.file_size,
                created_at: materialData.created_at
            }
        }

    } catch (error: any) {
        console.error('Error en upload-course-material:', error)
        
        if (error.statusCode) {
            throw error
        }
        
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor'
        })
    }
})
