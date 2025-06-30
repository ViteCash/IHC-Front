import { useSupabase } from '~/server/useSupabase'

export default defineEventHandler(async event => {
    const { supabase, user } = await useSupabase(event)
    // console.log('[UPLOAD] Usuario autenticado:', user)

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
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('teacher_id')
            .eq('id', courseId)
            .single()


        if (!course || course.teacher_id !== user?.id) {
            console.log(course?.teacher_id, 'userID: ', user?.id)
            throw createError({
                statusCode: 403,
                statusMessage: `${course} userID: ${user?.id}`
            })
        }

        // Generar nombre único para el archivo
        const timestamp = new Date().getTime()
        const fileExtension = file.name.split('.').pop()
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_')
        const fileName = `${sanitizedTitle}_${timestamp}.${fileExtension}`
        const filePath = `courses/${courseId}/materials/${fileName}`

        // Subir archivo a Supabase Storage
        const arrayBuffer = await file.arrayBuffer()

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('course-materials')
            .upload(filePath, arrayBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        console.log('[UPLOAD]: ', uploadData)

        // const { data, error: uploadError } = await supabase
        //     .storage
        //     .from('course-materials')
        //     .upload('public/favicon.png', decode('base64FileData'), {
        //         contentType: 'image/png'
        //     })

        if (uploadError) {
            throw createError({
                statusCode: 500,
                statusMessage: `Error al subir archivo: ${uploadError.message}`
            })
        }

        //Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
            .from('course-materials')
            .getPublicUrl(filePath)

        //Guardar información del material en la base de datos
        const { data: materialData, error: dbError } = await supabase
            .from('course_materials')
            .insert({
                course_id: courseId,
                title,
                file_name: file.name,
                file_url: urlData.publicUrl,
                file_size: file.size,
                uploaded_by: user?.id
            })
            .select()
            .single()

        if (dbError) {
            // Si hay error en la DB, eliminar archivo subido
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
            // data: {
            //     id: materialData.id,
            //     title: materialData.title,
            //     file_url: materialData.file_url,
            //     file_name: materialData.file_name,
            //     file_size: materrialData.created_at
            // }ialData.file_size,
            //     created_at: mate
        }

    } catch (error: any) {
        console.error('[UPLOAD] Error en upload-course-material:', error)

        if (error.statusCode) throw error

        throw createError({
            statusCode: 500,
            statusMessage: 'Error interno del servidor'
        })
    }
})

