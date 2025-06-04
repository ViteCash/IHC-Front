export const useStudentCourses = () => {
  const { data: courses, pending, error, refresh } = useLazyFetch('/api/student/courses', {
    default: () => ({ success: false, data: [], count: 0 }),
    server: false, // Solo ejecutar en el cliente para evitar problemas de hidratación
    transform: (response: any) => response
  })

  return {
    courses: computed(() => courses.value?.data || []),
    isLoading: pending,
    error,
    refresh,
    count: computed(() => courses.value?.count || 0)
  }
}