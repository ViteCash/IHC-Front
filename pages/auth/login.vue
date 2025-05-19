<script setup lang="ts">
    const { login, loading, error } = useAuthUser()
    const router = useRouter()

    const formState = reactive({
        email: '',
        password: '',
    })

    const handleLogin = async () => {
      const data = await login(formState.email, formState.password)
      
      if (data?.user) {
          const { userProfile } = useAuthUser()
          if (userProfile.value?.role === 'profesor') {
              router.push('/profesor/dashboard')
          } else {
              router.push('/alumno/dashboard')
          }
      }
    }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-semibold">Iniciar sesión</h1>
      </template>
      
      <UForm :state="formState" @submit="handleLogin">
        <UFormField label="Correo electrónico" name="email" class="mb-4">
          <UInput 
            v-model="formState.email" 
            type="email" 
            placeholder="correo@ejemplo.com" 
            autocomplete="email"
            class="w-full"
          />
        </UFormField>
        
        <UFormField label="Contraseña" name="password" class="mb-4">
          <UInput 
            v-model="formState.password" 
            type="password" 
            placeholder="Tu contraseña" 
            autocomplete="current-password"
            class="w-full"
          />
        </UFormField>
        
        <div class="mt-4">
          <UButton type="submit" color="primary" block :loading="loading">
            Iniciar sesión
          </UButton>
        </div>
      </UForm>
      
      <div class="mt-4 text-center">
        <p>¿No tienes una cuenta? <NuxtLink to="/auth/register" class="text-primary-500 hover:underline">Regístrate</NuxtLink></p>
      </div>
      
      <template v-if="error" #footer>
        <UAlert type="error" :title="error" />
      </template>
    </UCard>
  </div>
</template>
