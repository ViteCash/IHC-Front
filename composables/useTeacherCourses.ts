// composables/useTeacherCourses.ts
export const useTeacherCourses = () => {
  const { data: courses, pending, error, refresh } = useLazyFetch('/api/teacher/courses', {
    default: () => ({ courses: [], error: null }),
    server: false
  })

  const createCourse = async (courseData: {
    title: string
    description?: string
    course_code: string
  }) => {
    try {
      const result = await $fetch('/api/teacher/courses', {
        method: 'POST',
        body: courseData
      })
      
      await refresh()
      return result
    } catch (error) {
      throw error
    }
  }

  const getCourseStudents = async (courseId: string) => {
    try {
      return await $fetch(`/api/teacher/courses/${courseId}/students`)
    } catch (error) {
      throw error
    }
  }

  const addStudentToCourse = async (courseId: string, studentEmail: string) => {
    try {
      const result = await $fetch(`/api/teacher/courses/${courseId}/students`, {
        method: 'POST',
        body: { studentEmail }
      })
      return result
    } catch (error) {
      throw error
    }
  }

  const getCourseMaterials = async (courseId: string) => {
    try {
      return await $fetch(`/api/teacher/courses/${courseId}/materials`)
    } catch (error) {
      throw error
    }
  }

  return {
    courses: computed(() => courses.value?.courses || []),
    isLoading: pending,
    error,
    refresh,
    createCourse,
    getCourseStudents,
    addStudentToCourse,
    getCourseMaterials
  }
}