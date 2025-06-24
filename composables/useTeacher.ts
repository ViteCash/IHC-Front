export const useTeacher = () => {
    const router = useRouter()
    const courseStore = useCourseStore()

    const { data: courses, error } = useFetch('/api/teacher/courses')

    const redirectToCourse = (course: any) => {
        courseStore.setCourse(course)
        router.push(`/profesor/cursos/${course.title}`)
    }

    const uploadQuizMaterial = async (file: File) => {
        const { currentCourse } = courseStore

        if (!currentCourse) {
            throw new Error('No hay curso seleccionado')
        }

        try {
            const timestamp = new Date().getTime()
            const fileExtension = file.name.split('.').pop()
            const fileName = `quiz-material-${timestamp}.${fileExtension}`

            const filePath = `${currentCourse.id}/quiz-materials/${fileName}`

            const formData = new FormData()
            formData.append('file', file)
            formData.append('filePath', filePath)
            formData.append('courseId', currentCourse.id.toString())

            const { data } = await $fetch('/api/teacher/upload-material', {
                method: 'POST',
                body: formData
            })

            return data
        } catch (error) {
            console.error('Error al subir archivo:', error)
            throw error
        }
    }

    return {
        courses: computed(() => courses.value?.courses),
        error,
        redirectToCourse,
        uploadQuizMaterial
    }
}
