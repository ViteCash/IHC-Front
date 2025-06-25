<template>
  <!-- <UModal v-model="isOpen"> -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Subir Material del Curso {{ props.isOpen }}
          </h3>
          <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
        </div>
      </template>

      <div class="p-4">
        <UForm :state="materialForm" @submit="handleSubmit" class="space-y-4">
          <!-- Título del material -->
          <div label="Título del material" required>
            <UInput 
              v-model="materialForm.title" 
              placeholder="Ej: Semana 1 - Introducción"
              :disabled="isUploading"
              class="w-full"
            />
          </div>

          <!-- Descripción (opcional) -->
          <div label="Descripción (opcional)">
            <UTextarea 
              v-model="materialForm.description" 
              placeholder="Breve descripción del material..."
              :disabled="isUploading"
              :rows="3"
              class="w-full"
            />
          </div>

          <!-- Selección de archivo -->
          <div label="Archivo PDF" required>
            <div class="space-y-3">
              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                @change="handleFileSelect"
                :disabled="isUploading"
                class="hidden"
              />
              
              <div
                v-if="!selectedFile"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <UIcon name="i-heroicons-document-plus" class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-600">
                  Haz clic para seleccionar o arrastra un archivo PDF aquí
                </p>
                <p class="text-xs text-gray-500">Máximo 10MB</p>
              </div>

              <div v-else class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <UIcon name="i-heroicons-document-text" class="h-8 w-8 text-red-500" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  size="sm"
                  @click="removeFile"
                  :disabled="isUploading"
                />
              </div>
            </div>
          </div>

          <!-- Progreso de subida -->
          <div v-if="isUploading" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Subiendo archivo...</span>
              <span class="text-gray-600">{{ uploadProgress }}%</span>
            </div>
            <UProgress :value="uploadProgress" />
          </div>

          <!-- Error message -->
          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            :description="errorMessage"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'error', variant: 'link' }"
            @close="errorMessage = ''"
          />

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-4">
            <UButton 
              color="neutral" 
              variant="ghost" 
              @click="isOpen = false"
              :disabled="isUploading"
            >
              Cancelar
            </UButton>
            <UButton 
              type="submit" 
              :loading="isUploading"
              :disabled="!selectedFile || !materialForm.title"
            >
              {{ isUploading ? 'Subiendo...' : 'Subir Material' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  <!-- </UModal> -->
</template>

<script setup lang="ts">
interface MaterialForm {
  title: string
  description: string
}

interface Props {
  courseId: string,
    isOpen?: boolean
}

const props = defineProps<{
  courseId: string,
  isOpen?: boolean
}>()

const emit = defineEmits<{
  materialUploaded: []
}>()

// Modal state
const isOpen = computed(() => props.isOpen)

// Form state
const materialForm = reactive<MaterialForm>({
  title: '',
  description: ''
})

// File handling
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)

// Upload state
const isUploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')

// File handling methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    validateAndSetFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file: File) => {
  errorMessage.value = ''
  
  // Validar tipo de archivo
  if (file.type !== 'application/pdf') {
    errorMessage.value = 'Solo se permiten archivos PDF'
    return
  }
  
  // Validar tamaño (10MB máximo)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'El archivo no puede ser mayor a 10MB'
    return
  }
  
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Submit handler
const handleSubmit = async () => {
  if (!selectedFile.value || !materialForm.title.trim()) {
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  errorMessage.value = ''

  try {
    // Crear FormData
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('title', materialForm.title.trim())
    formData.append('description', materialForm.description.trim())
    formData.append('courseId', props.courseId)

    // Simular progreso (ya que no podemos rastrear el progreso real con $fetch)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    // Subir archivo
    await $fetch('/api/teacher/upload-course-material', {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Mostrar notificación de éxito
    useToast().add({
      title: 'Material subido',
      description: 'El material se ha subido exitosamente',
      color: 'success'
    })

    // Resetear formulario
    resetForm()
    
    // Emitir evento para recargar materiales
    emit('materialUploaded')
    
    // Cerrar modal
    // isOpen.value = false

  } catch (error: any) {
    console.error('Error subiendo material:', error)
    errorMessage.value = error.data?.statusMessage || 'Error al subir el material. Intenta nuevamente.'
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const resetForm = () => {
  materialForm.title = ''
  materialForm.description = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  errorMessage.value = ''
}

// Reset form when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>
