import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async event => {
    const { supabase, user } = await useSupabase(event)

    try {
        const formData = await readFormData(event)
        const file = formData.get('file') as File
        const filePath = formData.get('filePath') as string
        const courseId = formData.get('courseId') as string

        if (!file || !filePath || !courseId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan parámetros requeridos'
            })
        }

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

        const { data: urlData } = supabase.storage.from('course-materials').getPublicUrl(filePath)

        const { data: dbData } = await supabase
            .from('course_materials')
            .insert({
                course_id: parseInt(courseId),
                file_name: file.name,
                file_path: filePath,
                file_url: urlData.publicUrl,
                file_type: file.type,
                file_size: file.size,
                uploaded_by: user?.id,
                material_type: 'quiz_source'
            })
            .select()
            .single()

        return {
            success: true,
            data: {
                file_url: urlData.publicUrl,
                file_path: filePath,
                material_id: dbData?.id
            }
        }
    } catch (error) {
        console.error('Error en upload-material:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor'
        })
    }
})
