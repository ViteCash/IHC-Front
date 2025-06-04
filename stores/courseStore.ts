// stores/courseStore.ts
export const useCourseStore = defineStore('course', () => {
  const currentCourseName = ref('')
  
  function setCourseName(name: string) {
    currentCourseName.value = name
  }
  
  return {
    currentCourseName,
    setCourseName
  }
})