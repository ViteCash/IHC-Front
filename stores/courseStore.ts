export const useCourseStore = defineStore(
    'course',
    () => {
        const currentCourseName = ref('')
        const currentCourse = ref({
            id: '',
            title: '',
            course_code: '',
            description: '',
            teacher_id: ''
        })

        function setCourseName(name: string) {
            currentCourseName.value = name
        }

        const setCourse = (course: any) => {
            currentCourse.value = course
        }

        return {
            currentCourseName,
            setCourseName,
            currentCourse,
            setCourse
        }
    },
    {
        persist: true
    }
)
