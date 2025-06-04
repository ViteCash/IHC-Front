<template>
    <header class="flex justify-between max-w-[1200px] w-full mx-auto py-6">
        <NuxtLink to="/" class="cursor-pointer">
            <img src="/EduIA.png" alt="Logo" class="hidden sm:block w-35" />
        </NuxtLink>

        <UModal>
            <div class="flex items-center gap-4">
                <UButton variant="subtle" label="Inicia sesión" @click="handleLogin" />
                <UButton label="Regístrate" @click="handleRegister" />
            </div>
            <template #content>
                <Login v-if="clickLogin" />
                <Register v-if="clickRegister" />
            </template>
        </UModal>
    </header>
</template>

<script lang="ts" setup>
import Login from '~/components/auth/login.vue'
import Register from '~/components/auth/register.vue'

const clickLogin = ref(false)
const clickRegister = ref(false)

const handleLogin = () => {
    clickLogin.value = true
    clickRegister.value = false
}

const handleRegister = () => {
    clickRegister.value = true
    clickLogin.value = false
}
</script>
