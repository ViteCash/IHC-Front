<script setup lang="ts">
import type { UserRole } from '~/composables/useAuthUser'

const { register, loading, error } = useAuthUser()
const router = useRouter()

const formState = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'alumno' as UserRole
})

const handleRegister = async () => {
    const data = await register(
        formState.email,
        formState.password,
        formState.role,
        formState.firstName,
        formState.lastName
    )

    if (data?.user) {
        router.push('/auth/confirm')
    }
}
</script>

<template>
    <UCard class="w-full flex flex-col justify-center">
        <template #header>
            <h1 class="text-xl font-semibold">Crear cuenta</h1>
        </template>

        <UForm :state="formState" @submit="handleRegister" class="w-full">
            <!-- <div class="grid grid-cols-2 gap-4"> -->
            <UFormField label="Nombre" name="firstName" class="mb-4">
                <UInput
                    v-model="formState.firstName"
                    placeholder="Nombre"
                    autocomplete="given-name"
                    class="w-full"
                />
            </UFormField>

            <UFormField label="Apellido" name="lastName" class="mb-4">
                <UInput
                    v-model="formState.lastName"
                    placeholder="Apellido"
                    autocomplete="family-name"
                    class="w-full"
                />
            </UFormField>
            <!-- </div> -->

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
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    autocomplete="new-password"
                    class="w-full"
                />
            </UFormField>

            <UFormField label="Tipo de cuenta" name="role" class="mb-4">
                <div class="flex gap-4 mt-2">
                    <div class="flex items-center">
                        <input
                            id="alumno-radio"
                            type="radio"
                            v-model="formState.role"
                            value="alumno"
                            class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label for="alumno-radio" class="ml-2">Alumno</label>
                    </div>
                    <div class="flex items-center">
                        <input
                            id="profesor-radio"
                            type="radio"
                            v-model="formState.role"
                            value="profesor"
                            class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label for="profesor-radio" class="ml-2">Profesor</label>
                    </div>
                </div>
            </UFormField>

            <div class="mt-4 mb-8">
                <UButton type="submit" color="primary" block :loading="loading">
                    Registrarse
                </UButton>
            </div>
        </UForm>

        <!-- <div class="mt-4 text-center">
        <p>¿Ya tienes una cuenta? 
          <NuxtLink to="/auth/login" class="text-primary-500 hover:underline">
            Inicia sesión
          </NuxtLink>
        </p>
      </div> -->

        <template v-if="error" #footer color="error">
            <UAlert type="error" :title="error" />
        </template>
    </UCard>
</template>
