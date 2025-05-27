<template>
    <UModal>
        <header class="flex justify-between max-w-[1200px] w-full mx-auto py-6">
            <div class="flex items-center">
                <h1 class="text-2xl font-bold">
                    <NuxtLink to="/" class="text-primary-500">
                        My App
                    </NuxtLink>
                </h1>
            </div>
            <div class="flex items-center gap-4">
                <UButton variant="soft" @click="handleLogin">
                    <!-- <NuxtLink to="/auth/login"> -->
                        Inicia sesión
                    <!-- </NuxtLink> -->
                </UButton>
                <UButton @click="handleRegister">
                    <!-- <NuxtLink to="/auth/register"> -->
                        Regístrate
                    <!-- </NuxtLink> -->
                </UButton>
            </div>
        </header>

            <template #content>
                <Login v-if="clickLogin"/>
                <Register v-if="clickRegister"/>
            </template>
    </UModal>
</template>

<script lang="ts" setup>
    import Login from '~/components/auth/login.vue';
    import Register from '~/components/auth/register.vue';

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
