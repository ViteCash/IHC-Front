<script setup lang="ts">
    const { userProfile, logout } = useAuthUser()
    const router = useRouter()

    const courseRequest = ref('')

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
          <img
            src="../../public/user.ico"
            alt="User Avatar"
            class="rounded-full cursor-pointer"
            style="width: 32px; height: 30px; cursor: pointer;"
          />

          <template #content>
            <div class="flex flex-col items-center gap-3 justify-center h-full">
              <p class="cursor-pointer">Perfil</p>
              <UButton @click="handleLogout" color="secondary" class="cursor-pointer">
                Cerrar sesión
              </UButton>  
            </div>
          </template>
        </UPopover>
      </div>
      
      <UCard>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Bienvenido, {{ userProfile?.first_name }}</h2>
          <p>Aquí podrás ver tus clases y materiales de estudio.</p>
          
          <!-- Aquí iría el contenido específico del alumno -->
          <div class="mt-6 space-y-4">
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Mis cursos</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500">Aquí se mostrarán los cursos en los que estás inscrito.</p>
              </div>
            </UCard>
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Solicitar entrar a un curso</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500 mb-2">Ingresa el ID del curso al que deseas solicitar acceso:</p>
                <UInput
                  v-model="courseRequest"
                  placeholder="aH2ek10"
                  class="mb-4 mr-5"
                />
                <UButton 
                  color="secondary"
                  @click="() => console.log('Solicitar acceso al curso:', courseRequest)"
                >
                Solicitar acceso
              </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped>
  .boder {
    border: 1px solid red; 
  }
</style>
