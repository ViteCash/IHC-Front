<script setup lang="ts">
const { login, loading, error, userProfile, fetchUserProfile } = useAuthUser()
const router = useRouter()

const formState = reactive({
    email: '',
    password: ''
})

const handleLogin = async () => {
    const data = await login(formState.email, formState.password)
    if (data?.user) {
        await fetchUserProfile()

        if (userProfile.value?.role === 'profesor') {
            router.push('/profesor/dashboard')
        } else {
            router.push('/alumno/dashboard')
        }
    }
}
</script>

<template>
    <UCard class="w-full flex flex-col justify-center">
        <template #header>
            <h1 class="text-xl font-semibold">Iniciar sesión</h1>
        </template>

        <UForm :state="formState" @submit="handleLogin">
            <UFormField label="Correo electrónico" name="email" class="mb-4">
                <UInput
                    v-model="formState.email"
                    type="email"
                    placeholder="peruanito124@hotmail.com"
                    autocomplete="email"
                    class="w-full"
                />
            </UFormField>

            <UFormField label="Contraseña" name="password" class="mb-4">
                <UInput
                    v-model="formState.password"
                    type="password"
                    placeholder="*********"
                    autocomplete="current-password"
                    class="w-full"
                />
            </UFormField>

            <div class="mt-4 mb-8">
                <UButton type="submit" color="primary" block :loading="loading">
                    Iniciar sesión
                </UButton>
            </div>
        </UForm>

        <!-- <div class="mt-4 text-center">
        <p>¿No tienes una cuenta? <NuxtLink to="/auth/register" class="text-primary-500 hover:underline">Regístrate</NuxtLink></p>
      </div> -->

        <template v-if="error">
            <UAlert color="error" variant="soft" :title="error" close>
                <template #close>
                    <UButton
                        color="error"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        size="xs"
                        @click="error = null"
                    />
                </template>
            </UAlert>
        </template>
    </UCard>
</template>
