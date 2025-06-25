<!-- pages/profesor/cursos/[id].vue -->
<script setup lang="ts">
import { useTeacherCourses } from '~/composables/useTeacherCourses'
import type { TabsItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id as string

const { getCourseStudents, addStudentToCourse, getCourseMaterials } = useTeacherCourses()

// Definir los tabs según la nueva sintaxis
const tabsItems = [
  {
    label: 'Estudiantes',
    // description: 'Gestiona los estudiantes matriculados en el curso',
    icon: 'i-heroicons-users',
    slot: 'students' as const
  },
  {
    label: 'Materiales',
    // description: 'Sube y gestiona los materiales del curso',
    icon: 'i-heroicons-document-text',
    slot: 'materials' as const
  }
] satisfies TabsItem[]

interface StudentEnrollment {
  enrollmentId: any;
  enrolledAt: any;
  student: {
    first_name?: string;
    last_name?: string;
    email: string;
    [key: string]: any;
  };
}

interface CourseMaterial {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  createdAt?: string;
  [key: string]: any;
}

const students = ref<StudentEnrollment[]>([])
const materials = ref<CourseMaterial[]>([])
const loading = ref(false)

const studentForm = reactive({
  email: ''
})

const generatedQuiz = ref()

const handleQuizGenerated = (quiz: any[]) => {
    generatedQuiz.value = quiz
}

// Cargar datos del curso
const loadCourseData = async () => {
  loading.value = true
  try {
    const [studentsData, materialsData] = await Promise.all([
      getCourseStudents(courseId),
      getCourseMaterials(courseId)
    ])
    
    students.value = studentsData.data.map((item: any) => ({
      enrollmentId: item.enrollmentId,
      enrolledAt: item.enrolledAt,
      student: {
        first_name: item.student?.first_name,
        last_name: item.student?.last_name,
        email: item.student?.email || '',
        ...item.student
      }
    }))
    materials.value = materialsData.data
  } catch (error) {
    console.error('Error cargando datos del curso:', error)
  } finally {
    loading.value = false
  }
}

const handleAddStudent = async () => {
  try {
    await addStudentToCourse(courseId, studentForm.email)
    studentForm.email = ''
    await loadCourseData() // Recargar estudiantes
    
    useToast().add({
      title: 'Estudiante añadido',
      description: 'El estudiante se ha añadido al curso exitosamente',
      color: 'primary'
    })
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.data?.statusMessage || 'Error al añadir estudiante',
      color: 'error'
    })
  }
}

onMounted(loadCourseData)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <!-- Header -->
      <div class="flex items-center mb-6">
        <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="router.push('/profesor/dashboard')" class="mr-4" />
        <h1 class="text-2xl font-bold">Gestión del Curso</h1>
      </div>

      <!-- Tabs usando la nueva sintaxis -->
      <UTabs :items="tabsItems" variant="link" class="gap-4 w-full" :ui="{ trigger: 'grow' }">
        
        <!-- Students Tab -->
        <template #students="{ item }">
          <div class="mt-4">
            <UCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-medium">{{ item.label }}</h3>
                    <p class="text-sm text-gray-500 mt-1">Gestiona los estudiantes matriculados en el curso</p>
                  </div>
                  <span class="text-sm text-gray-500">{{ students.length }} estudiantes</span>
                </div>
              </template>

              <!-- Add Student Form -->
              <div class="p-4 border-b">
                <UForm :state="studentForm" @submit="handleAddStudent" class="flex gap-2">
                  <UInput 
                    v-model="studentForm.email" 
                    placeholder="Email del estudiante"
                    class="flex-1"
                  />
                  <UButton type="submit" icon="i-heroicons-user-plus">
                    Añadir
                  </UButton>
                </UForm>
              </div>

              <!-- Students List -->
              <div class="p-4">
                <div v-if="loading" class="text-center py-8">
                  <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2" />
                  <p>Cargando estudiantes...</p>
                </div>

                <div v-else-if="students.length === 0" class="text-center py-8">
                  <UIcon name="i-heroicons-users" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-500">No hay estudiantes matriculados</p>
                </div>

                <div v-else class="space-y-3">
                  <div 
                    v-for="enrollment in students" 
                    :key="enrollment.enrollmentId"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <UAvatar 
                        :text="(enrollment.student.first_name?.[0] || '') + (enrollment.student.last_name?.[0] || '')"
                        size="sm"
                      />
                      <div>
                        <p class="font-medium">
                          {{ enrollment.student.first_name }} {{ enrollment.student.last_name }}
                        </p>
                        <p class="text-sm text-gray-500">{{ enrollment.student.email }}</p>
                      </div>
                    </div>
                    <div class="text-sm text-gray-500">
                      Matriculado: {{ new Date(enrollment.enrolledAt).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </template>

        <!-- Materials Tab -->
        <template #materials="{ item }">
          <div class="mt-4">
            <UCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-medium">{{ item.label }}</h3>
                    <p class="text-sm text-gray-500 mt-1">Sube y gestiona los materiales del curso</p>
                  </div>
                  <UButton icon="i-heroicons-document-plus">
                    Subir Material
                  </UButton>
                </div>
              </template>

              <div class="p-4 flex justify-center items-center" v-if="!generatedQuiz">
                <DocumentUploader @quiz-generated="handleQuizGenerated"/>
              </div>
              <QuizDisplay v-else :questions="generatedQuiz" />
            </UCard>
          </div>
        </template>
      </UTabs>
    </UContainer>
  </div>
</template>