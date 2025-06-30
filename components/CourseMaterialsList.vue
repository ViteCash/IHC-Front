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
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay materiales</h3>
      <p class="text-gray-500 mb-6">Comienza subiendo el primer material del curso</p>
    </div>

    <!-- Materials list -->
    <div v-else class="space-y-3">
      <div v-for="material in materials" :key="material.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3 flex-1">
            <!-- PDF Icon -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-red-600" />
              </div>
            </div>

            <!-- Material info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">
                {{ material.title }}
              </h4>
              <p class="text-sm text-gray-500 mt-1">
                {{ material.file_name }}
              </p>
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>{{ formatFileSize(material.file_size) }}</span>
                <span>Subido {{ formatDate(material.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4">
            <!-- View/Download button -->
            <UButton size="sm" variant="outline" icon="i-heroicons-eye" @click="viewMaterial(material)">
              Ver
            </UButton>

            <!-- Delete button (only for teachers) -->
            <UModal>
              <UButton v-if="showDeleteButton" size="sm" color="error" variant="ghost" icon="i-heroicons-trash"
                @click="confirmDelete(material)" :loading="deletingId === material.id" />

              <template #content>
                <UCard>
                  <template #header>
                    <h3 class="text-base font-semibold text-gray-900">
                      Confirmar eliminación
                    </h3>
                  </template>

                  <div class="py-4">
                    <p class="text-sm text-gray-600">
                      ¿Estás seguro de que quieres eliminar el material
                      <strong>"{{ materialToDelete?.title }}"</strong>?
                    </p>
                    <p class="text-sm text-gray-500 mt-2">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <template #footer>
                    <div class="flex justify-end space-x-3">
                      <UButton color="error" @click="deleteMaterial" :loading="isDeleting">
                        Eliminar
                      </UButton>
                    </div>
                  </template>
                </UCard>
              </template>
            </UModal>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model="showDeleteModal">

    </UModal>
  </div>
</template>

<script setup lang="ts">
interface CourseMaterial {
  id: string
  title: string
  description: string
  file_name: string
  file_url: string
  file_size: number
  created_at: string
  [key: string]: any
}

interface Props {
  materials: CourseMaterial[]
  loading?: boolean
  showDeleteButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showDeleteButton: false
})

const emit = defineEmits<{
  materialDeleted: [materialId: string]
  refresh: []
}>()

// Delete functionality
const showDeleteModal = ref(false)
const materialToDelete = ref<CourseMaterial | null>(null)
const isDeleting = ref(false)
const deletingId = ref<string | null>(null)

const confirmDelete = (material: CourseMaterial) => {
  materialToDelete.value = material
  showDeleteModal.value = true
}

const deleteMaterial = async () => {
  if (!materialToDelete.value) return

  isDeleting.value = true
  deletingId.value = materialToDelete.value.id

  try {
    await $fetch(`/api/teacher/materials/${materialToDelete.value.id}`, {
      method: 'DELETE'
    })

    useToast().add({
      title: 'Material eliminado',
      description: 'El material se ha eliminado exitosamente',
      color: 'success'
    })

    emit('materialDeleted', materialToDelete.value.id)
    showDeleteModal.value = false
    materialToDelete.value = null

  } catch (error: any) {
    console.error('Error eliminando material:', error)
    useToast().add({
      title: 'Error',
      description: error.data?.statusMessage || 'Error al eliminar el material',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
    deletingId.value = null
  }
}

// View material
const viewMaterial = (material: CourseMaterial) => {
  // Open PDF in new tab
  window.open(material.file_url, '_blank')
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
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
