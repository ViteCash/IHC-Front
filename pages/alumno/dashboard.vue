<script setup lang="ts">
    const { userProfile, logout } = useAuthUser()
    const router = useRouter()

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
        <UButton @click="handleLogout" color="secondary">Cerrar sesión</UButton>
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
                <h3 class="text-lg font-medium">Mis tareas</h3>
              </template>
              <div class="p-4">
                <p class="text-gray-500">Aquí se mostrarán tus tareas pendientes.</p>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
