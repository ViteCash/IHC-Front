<script setup lang="ts">
    const router = useRouter()
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-semibold text-red-500">Acceso no autorizado</h1>
      </template>
      
      <div class="p-4 text-center">
        <UIcon name="i-heroicons-shield-exclamation" class="text-red-500 text-6xl mb-4" />
        <p>No tienes permiso para acceder a esta página.</p>
        <p class="mt-2">Por favor, inicia sesión con una cuenta que tenga los permisos necesarios.</p>
        
        <div class="mt-6 flex space-x-4 justify-center">
          <UButton @click="router.push('/auth/login')" color="primary">
            Iniciar sesión
          </UButton>
          <UButton @click="router.push('/')" color="gray">
            Ir al inicio
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

