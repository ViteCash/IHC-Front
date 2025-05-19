<script setup lang="ts">
    const { userProfile, logout } = useAuthUser()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push('/auth/login')
    }
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Panel de Profesor</h1>
        <UButton @click="handleLogout" color="gray">Cerrar sesión</UButton>
      </div>
      
      <UCard>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Bienvenido, {{ userProfile?.first_name }}</h2>
          <p>Aquí podrás gestionar tus clases, alumnos y materiales didácticos.</p>
          
          <!-- Aquí iría el contenido específico del profesor -->
          <div class="mt-6 space-y-4">
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Mis clases</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500">Aquí se mostrarán tus clases asignadas.</p>
              </div>
            </UCard>
            
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Mis alumnos</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500">Aquí se mostrará la lista de tus alumnos.</p>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

