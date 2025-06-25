<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'cursos'
})

const currentStep = ref<'upload' | 'quiz'>('upload')
interface QuizData {
  questions: any[]
}
const quizData = ref<QuizData | null>(null)
const isGenerating = ref(false)

const handleQuizGenerated = (data: any) => {
  quizData.value = data
  currentStep.value = 'quiz'
}

const resetQuiz = () => {
  currentStep.value = 'upload'
  quizData.value = null
  isGenerating.value = false
}

const handleGenerating = (generating: boolean) => {
  isGenerating.value = generating
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Back to Dashboard Button -->
            <NuxtLink 
              to="/alumno/dashboard"
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <UIcon name="i-heroicons-arrow-left" size="20" />
              <span class="font-medium">Tablón</span>
            </NuxtLink>
            
            <div class="border-l border-gray-200 h-8"></div>
            
            <div>
              <h1 class="text-3xl font-bold text-gray-900 font-sora">
                <UIcon name="i-heroicons-academic-cap" class="text-primary-600 mr-3" />
                Generador de Quizzes IA
              </h1>
              <p class="text-gray-600 mt-2">
                Sube tu documento PDF y genera quizzes automáticamente con inteligencia artificial
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div 
              class="flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="currentStep === 'upload' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'"
            >
              <UIcon name="i-heroicons-cloud-arrow-up" class="mr-1" size="16" />
              Subir
            </div>
            <UIcon name="i-heroicons-chevron-right" class="text-gray-400" size="16" />
            <div 
              class="flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="currentStep === 'quiz' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'"
            >
              <UIcon name="i-heroicons-puzzle-piece" class="mr-1" size="16" />
              Quiz
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Upload Step -->
      <div v-if="currentStep === 'upload'" class="space-y-8">
        <!-- Progress Indicator -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
            <UIcon name="i-heroicons-document-text" class="text-primary-600" size="32" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Sube tu documento</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Selecciona un archivo PDF, DOC, DOCX o TXT para generar un quiz personalizado. 
            Nuestra IA analizará el contenido y creará preguntas relevantes.
          </p>
        </div>

        <!-- Upload Component Container -->
        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <DocumentUploader 
              @quiz-generated="handleQuizGenerated"
              @generating="handleGenerating"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isGenerating" class="text-center py-8">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 text-primary-800 rounded-full">
            <UIcon name="i-heroicons-cpu-chip" class="animate-pulse" size="20" />
            <span class="font-medium">Generando quiz con IA...</span>
          </div>
          <p class="text-gray-600 mt-3">Esto puede tomar unos momentos</p>
        </div>

        <!-- Features Section -->
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-sparkles" class="text-success-600" size="24" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">IA Avanzada</h3>
            <p class="text-gray-600 text-sm">
              Análisis inteligente del contenido para generar preguntas relevantes
            </p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-clock" class="text-info-600" size="24" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Rápido</h3>
            <p class="text-gray-600 text-sm">
              Genera quizzes en segundos, ahorrando tiempo valioso
            </p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-check-badge" class="text-warning-600" size="24" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Preciso</h3>
            <p class="text-gray-600 text-sm">
              Preguntas de calidad basadas en el contenido específico
            </p>
          </div>
        </div>
      </div>

      <!-- Quiz Step -->
      <div v-else-if="currentStep === 'quiz'" class="space-y-8">
        <!-- Quiz Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mx-auto mb-4">
            <UIcon name="i-heroicons-puzzle-piece" class="text-success-600" size="32" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Quiz Generado!</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Tu quiz ha sido creado exitosamente. Responde las preguntas y obtén retroalimentación inmediata.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 mb-8">
          <UButton 
            variant="outline" 
            @click="resetQuiz"
            class="flex items-center gap-2"
          >
            <UIcon name="i-heroicons-arrow-left" size="16" />
            Nuevo Quiz
          </UButton>
        </div>

        <!-- Quiz Component Container -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <QuizDisplay 
            v-if="quizData" 
            :questions="quizData.questions || quizData"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p class="flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-light-bulb" size="16" />
            Powered by AI • Generador de Quizzes Inteligente
          </p>
        </div>
      </div>
    </div>
  </div>
</template>