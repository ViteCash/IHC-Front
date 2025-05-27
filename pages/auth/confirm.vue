<script setup lang="ts">
    const router = useRouter()
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-semibold">Confirma tu correo electrónico</h1>
      </template>
      
      <div class="p-4 text-center">
        <p>Se ha enviado un enlace de confirmación a tu correo electrónico.</p>
        <p class="mt-2">Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.</p>
        
        <UButton class="mt-6" @click="router.push('/')" color="primary">
          Volver al inicio de sesión
        </UButton>
      </div>
    </UCard>
  </div>
</template>
