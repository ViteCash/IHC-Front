<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-6 w-6 mx-auto mb-2" />
      <p class="text-gray-500">Cargando materiales...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="materials.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-document-text" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay materiales disponibles</h3>
      <p class="text-gray-500">El profesor aún no ha subido materiales para este curso</p>
    </div>

    <!-- Materials list -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="material in materials" :key="material.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        @click="openMaterial(material)">
        <div class="space-y-3">
          <!-- PDF Icon and title -->
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ material.title }}
              </h4>
            </div>
          </div>

          <!-- Material info -->
          <div class="space-y-1">
            <p class="text-xs text-gray-500 truncate">
              {{ material.file_name }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ formatFileSize(material.file_size) }}</span>
              <span>{{ formatDate(material.created_at) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100">
            <div class="flex items-center space-x-3">
              <UButton size="xs" variant="outline" icon="i-heroicons-eye" @click.stop="viewMaterial(material)">
                Ver
              </UButton>
              <UButton size="xs" variant="outline" icon="i-heroicons-arrow-down-tray"
                @click.stop="downloadMaterial(material)">
                Descargar
              </UButton>
            </div>

            <!-- Practice button -->
            <UModal>
              <UButton size="xs" icon="i-heroicons-academic-cap" @click.stop="startPractice(material)"
                :loading="generatingQuiz === material.id">
                {{ generatingQuiz === material.id ? 'Generando...' : 'Practicar' }}
              </UButton>

              <template #content>
                <UCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-gray-900">
                        Práctica: {{ currentPracticeMaterial?.title }}
                      </h3>
                      <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="closePracticeModal" />
                    </div>
                  </template>

                  <div class="p-4 overflow-y-auto h-120 w-full">
                    <QuizDisplay v-if="currentQuestions" :questions="currentQuestions"
                      @quiz-completed="handleQuizCompleted" />

                    <div v-else class="text-center py-8">
                      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto mb-4 text-primary-500" />
                      <p class="text-gray-600">Generando preguntas de práctica...</p>
                    </div>
                  </div>
                </UCard>
              </template>
            </UModal>
          </div>
        </div>
      </div>
    </div>

    <!-- Practice Modal -->
    <UModal v-model="showPracticeModal">
      <template #content>

      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface CourseMaterial {
  id: string
  title: string
  file_name: string
  file_url: string
  file_size: number
  created_at: string
  [key: string]: any
}

interface Props {
  courseId: string
}

const props = defineProps<Props>()

// State
const materials = ref<CourseMaterial[]>([])
const loading = ref(false)
const generatingQuiz = ref<string | null>(null)
const showPracticeModal = ref(false)
const currentPracticeMaterial = ref<CourseMaterial | null>(null)
const currentQuestions = ref<any[] | null>(null)

// Load materials
const loadMaterials = async () => {
  loading.value = true
  try {
    const { data } = await $fetch(`/api/student/courses/${props.courseId}/materials`)
    materials.value = data || []
  } catch (error) {
    console.error('Error cargando materiales:', error)
    useToast().add({
      title: 'Error',
      description: 'Error al cargar los materiales del curso',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Material actions
const openMaterial = (material: CourseMaterial) => {
  viewMaterial(material)
}

const viewMaterial = (material: CourseMaterial) => {
  console.log('Viewing material:', material)
  window.open(material.file_url, '_blank')
}

const downloadMaterial = (material: CourseMaterial) => {
  const link = document.createElement('a')
  link.href = material.file_url
  link.download = material.file_name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const startPractice = async (material: CourseMaterial) => {
  generatingQuiz.value = material.id
  currentPracticeMaterial.value = material
  currentQuestions.value = null
  showPracticeModal.value = true

  try {
    // Generate quiz questions based on the material
    const response = await fetch(material.file_url)
    const blob = await response.blob()
    const file = new File([blob], material.file_name, { type: 'application/pdf' })

    const { generateQuizFromFile } = useGemini()
    const questions = await generateQuizFromFile(file)

    currentQuestions.value = questions
  } catch (error) {
    console.error('Error generando quiz:', error)
    useToast().add({
      title: 'Error',
      description: 'Error al generar las preguntas de práctica',
      color: 'error'
    })
    showPracticeModal.value = false
  } finally {
    generatingQuiz.value = null
  }
}

const handleQuizCompleted = (results: any) => {
  // Handle quiz completion
  useToast().add({
    title: 'Práctica completada',
    description: `Has completado la práctica con ${results.correctAnswers}/${results.totalQuestions} respuestas correctas`,
    color: 'success'
  })
  closePracticeModal()
}

const closePracticeModal = () => {
  showPracticeModal.value = false
  currentPracticeMaterial.value = null
  currentQuestions.value = null
  generatingQuiz.value = null
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

// Load materials on mount
onMounted(loadMaterials)

// Expose refresh method
defineExpose({
  refresh: loadMaterials
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>