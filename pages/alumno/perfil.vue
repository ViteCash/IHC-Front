<script lang="ts" setup>
import { useUpdateUser } from '~/composables/useUpdateUser'

const { userProfile, logout, fetchUserProfile } = useAuthUser()
const { updateUser } = useUpdateUser()
const router = useRouter()

const formData = reactive({
  firstName: userProfile.value?.first_name || '',
  lastName: userProfile.value?.last_name || '',
  email: userProfile.value?.email || '',
})

const isEditing = ref(false)

const enableEditing = () => {
  formData.firstName = userProfile.value?.first_name || ''
  formData.lastName = userProfile.value?.last_name || ''
  formData.email = userProfile.value?.email || ''
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveChanges = async () => {
  try {
    // Aquí iría tu lógica para actualizar el perfil
    // Por ejemplo:
    // await updateUserProfile(formData)
    
    // console.log('Datos guardados:', formData)
    // console.log('ID del usuario:', userProfile.value?.id)
    
    if (!userProfile.value?.id) {
      throw new Error('ID de usuario no disponible')
    }
    
    const result = await updateUser(formData, userProfile.value.id)

    if (result.success) await refreshNuxtData('profile')

    await fetchUserProfile()

    // Simulando actualización exitosa
    isEditing.value = false
    
    // Muestra notificación de éxito
    useToast().add({
      title: 'Perfil actualizado',
      description: 'Tu información ha sido actualizada correctamente',
      color: 'tertiary'
    })
  } catch (error) {
    // Manejo de errores
    useToast().add({
      title: 'Error',
      description: 'No se pudo actualizar tu información',
      color: 'primary'
    })
  }
}

const goBack = () => {
  router.push('/alumno/dashboard')
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <UContainer>
      <div class="mb-6 flex items-center">
        <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="goBack" class="mr-2" />
        <h1 class="text-2xl font-bold">Mi Perfil</h1>
      </div>

      <UCard class="max-w-3xl mx-auto">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Información Personal</h2>
            <div v-if="!isEditing">
              <UButton color="primary" @click="enableEditing" icon="i-heroicons-pencil-square">
                Editar
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="!isEditing" class="space-y-6 py-4">
          <div class="flex justify-center mb-6">
            <UAvatar
              size="2xl"
              :text="(userProfile?.first_name?.[0].toUpperCase() || '') + (userProfile?.last_name?.[0].toLowerCase() || '')"
              color="primary"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500">Nombre</h3>
              <p class="mt-1 text-base font-medium">{{ userProfile?.first_name || 'No especificado' }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500">Apellido</h3>
              <p class="mt-1 text-base font-medium">{{ userProfile?.last_name || 'No especificado' }}</p>
            </div>

            <div class="md:col-span-2">
              <h3 class="text-sm font-medium text-gray-500">Correo electrónico</h3>
              <p class="mt-1 text-base font-medium">{{ userProfile?.email }}</p>
            </div>

            <div class="md:col-span-2">
              <h3 class="text-sm font-medium text-gray-500">Rol</h3>
              <UBadge color="primary" class="mt-1">{{ userProfile?.role === 'alumno' ? 'Estudiante' : 'Profesor' }}</UBadge>
            </div>
          </div>
        </div>

        <UForm v-else :state="formData" class="space-y-4 py-4" @submit="saveChanges">
          <div class="flex justify-center mb-6">
            <UAvatar
              size="2xl"
              :text="formData.firstName[0] + formData.lastName[0]"
              color="primary"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Nombre" name="firstName">
              <UInput v-model="formData.firstName" placeholder="Tu nombre" />
            </UFormGroup>

            <UFormGroup label="Apellido" name="lastName">
              <UInput v-model="formData.lastName" placeholder="Tu apellido" />
            </UFormGroup>

            <UFormGroup class="md:col-span-2" label="Correo electrónico" name="email">
              <UInput v-model="formData.email" type="email" placeholder="tu@email.com" disabled />
              <template #hint>
                <span class="text-gray-500 text-xs">El correo electrónico no se puede modificar</span>
              </template>
            </UFormGroup>
          </div>

          <div class="flex justify-end space-x-2 pt-4">
            <UButton variant="ghost" @click="cancelEditing">Cancelar</UButton>
            <UButton type="submit" color="primary">Guardar cambios</UButton>
          </div>
        </UForm>
      </UCard>

      <UCard class="max-w-3xl mx-auto mt-6">
        <template #header>
          <h2 class="text-xl font-semibold">Otros</h2>
        </template>

        <div class="py-4">
          <UButton block color="primary" variant="outline" class="mb-4" @click="handleLogout">
            Cerrar Sesión
          </UButton>

          <UButton block color="secondary" variant="ghost">
            Cambiar Tema
          </UButton>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>