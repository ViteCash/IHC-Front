<!-- pages/profesor/dashboard.vue -->
<script setup lang="ts">
import { useTeacherCourses } from '~/composables/useTeacherCourses'

const { userProfile, logout } = useAuthUser()
const { courses, isLoading, createCourse } = useTeacherCourses()
const router = useRouter()
const toast = useToast()
const showCreateModal = ref(false)

const courseForm = reactive({
  title: '',
  description: '',
  course_code: ''
})

const handleCreateCourse = async () => {
  try {
    await createCourse(courseForm)
    // Limpiar formulario
    Object.assign(courseForm, {
      title: '',
      description: '',
      course_code: ''
    })
    showCreateModal.value = false
    toast.add({
      title: 'Curso creado',
      description: 'El curso se ha creado exitosamente',
      color: 'primary'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Error al crear el curso',
      color: 'error'
    })
  }
}
const redirectToProfile = () => {
  router.push('/profesor/perfil')
}

const redirectToCourse = (course: any) => {
  router.push(`/profesor/cursos/${course.id}`)
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Panel de Alumno</h1>
        <UPopover class="flex flex-col gap-2 w-28 justify-end items-end">
          <div class="flex justify-center mb-6 cursor-pointer">
            <UAvatar size="xl"
              :text="(userProfile?.first_name?.[0].toUpperCase() || '') + (userProfile?.last_name?.[0].toLowerCase() || '')"
              color="primary" class="cursor-pointer" />
          </div>
          <template #content>
            <div class="flex flex-col items-center gap-2 justify-center h-full">
              <UButton @click="redirectToProfile" class="flex justify-center cursor-pointer w-full" color="secondary">
                Perfil</UButton>
              <UButton @click="handleLogout" class="cursor-pointer" color="neutral">
                Cerrar sesión
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Welcome Card -->
      <UCard class="mb-6">
        <ClientOnly>
          <h2 class="text-xl font-semibold mb-2">
            Bienvenido, {{ userProfile?.first_name || '...' }}
          </h2>
          <p class="text-gray-600">Gestiona tus cursos, estudiantes y materiales de estudio.</p>
        </ClientOnly>
      </UCard>

      <!-- Courses Section -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Mis Cursos</h3>
            <!-- Modal trigger button -->
            <UModal v-model="showCreateModal">
              <UButton icon="i-heroicons-plus">
                Crear Curso
              </UButton>
              <template #content>
                <UCard>
                  <template #header>
                    <h3 class="text-lg font-semibold">Crear Nuevo Curso</h3>
                  </template>
                  <div class="space-y-4 p-4">
                    <div class="space-y-2">
                      <label for="title" class="block text-sm font-medium text-gray-700">
                        Título del curso <span class="text-red-500">*</span>
                      </label>
                      <UInput 
                        id="title"
                        v-model="courseForm.title" 
                        placeholder="Ej: Biología Básica" 
                        required
                        class="w-full"
                      />
                    </div>
                    
                    <div class="space-y-2">
                      <label for="description" class="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <UTextarea 
                        id="description"
                        v-model="courseForm.description" 
                        placeholder="Descripción del curso..." 
                        class="w-full"
                      />
                    </div>
                    
                    <div class="space-y-2">
                      <label for="course_code" class="block text-sm font-medium text-gray-700">
                        Código del curso <span class="text-red-500">*</span>
                      </label>
                      <UInput 
                        id="course_code"
                        v-model="courseForm.course_code" 
                        placeholder="Ej: BIO101" 
                        required
                        class="w-full"
                      />
                      <p class="text-xs text-gray-500">
                        Este código será usado por los estudiantes para unirse al curso
                      </p>
                    </div>
                    
                    <div class="flex justify-end space-x-2 pt-4">
                      <!-- <UButton variant="ghost" @click="showCreateModal = false">
                        Cancelar
                      </UButton> -->
                      <UButton 
                        type="submit" 
                        color="primary"
                        @click="handleCreateCourse"
                      >
                        Crear Curso
                      </UButton>
                    </div>
                  </div>
                </UCard>
              </template>
            </UModal>
          </div>
        </template>
        <div class="p-4">
          <div v-if="isLoading" class="text-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto mb-4" />
            <p>Cargando cursos...</p>
          </div>
          <div v-else-if="courses.length === 0" class="text-center py-8">
            <UIcon name="i-heroicons-academic-cap" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">No tienes cursos creados</p>
            <!-- Segundo botón trigger para el modal -->
            <UModal v-model="showCreateModal">
              <UButton color="primary">
                Crear tu primer curso
              </UButton>
              <template #content>
                <UCard>
                  <template #header>
                    <h3 class="text-lg font-semibold">Crear Nuevo Curso</h3>
                  </template>
                  <div class="space-y-4 p-4">
                    <div class="space-y-2">
                      <label for="title2" class="block text-sm font-medium text-gray-700">
                        Título del curso <span class="text-red-500">*</span>
                      </label>
                      <UInput 
                        id="title2"
                        v-model="courseForm.title" 
                        placeholder="Ej: Biología Básica" 
                        required
                      />
                    </div>
                    
                    <div class="space-y-2">
                      <label for="description2" class="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <UTextarea 
                        id="description2"
                        v-model="courseForm.description" 
                        placeholder="Descripción del curso..." 
                      />
                    </div>
                    
                    <div class="space-y-2">
                      <label for="course_code2" class="block text-sm font-medium text-gray-700">
                        Código del curso <span class="text-red-500">*</span>
                      </label>
                      <UInput 
                        id="course_code2"
                        v-model="courseForm.course_code" 
                        placeholder="Ej: BIO101" 
                        required
                      />
                      <p class="text-xs text-gray-500">
                        Este código será usado por los estudiantes para unirse al curso
                      </p>
                    </div>
                    
                    <div class="flex justify-end space-x-2 pt-4">
                      <!-- <UButton variant="ghost" @click="showCreateModal = false">
                        Cancelar
                      </UButton> -->
                      <UButton 
                        type="submit" 
                        color="primary"
                        @click="handleCreateCourse"
                      >
                        Crear Curso
                      </UButton>
                    </div>
                  </div>
                </UCard>
              </template>
            </UModal>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard v-for="course in courses" :key="course.id" class="cursor-pointer hover:shadow-lg transition-shadow"
              @click="redirectToCourse(course)">
              <div class="p-4">
                <h4 class="font-semibold text-lg mb-2">{{ course.title }}</h4>
                <p class="text-gray-600 text-sm mb-3">{{ course.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Código: {{ course.course_code }}</span>
                  <span>{{ new Date(course.created_at).toLocaleDateString() }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>