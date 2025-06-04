<script setup lang="ts">
    const { logout } = useAuthUser()
    const route = useRouter()

    const toInitPage = () => {
        route.push('/alumno/dashboard')
    }

    const handleLogout = async () => {
        await logout()
        route.push('/')
    }

</script>

<template>
    <div>
        <UPopover>
            <div class="flex justify-around items-center mb-6 p-2">
                <img src="../../../public/EduIA.png" alt="" class="w-35 inline-block">
                <div class="flex flex-row items-center justify-center gap-4">
                    <p @click="toInitPage" class="cursor-pointer bg-primary-500 text-white p-2 border-radius">Tablón</p>
                    <p class="cursor-pointer">Personas</p>
                </div>
                <UPopover class="flex flex-col gap-2 w-28 justify-end items-end">
                    <img src="../../../public/user.ico" alt="User Avatar" class="rounded-full cursor-pointer"
                        style="width: 32px; height: 30px; cursor: pointer;" />

                    <template #content>
                        <div class="flex flex-col items-center gap-2 justify-center h-full">
                            <UButton class="flex justify-center cursor-pointer w-full" color="secondary">Perfil
                            </UButton>
                            <UButton @click="handleLogout" class="cursor-pointer" color="neutral">
                                Cerrar sesión
                            </UButton>
                        </div>
                    </template>
                </UPopover>
            </div>
        </UPopover>
    </div>
</template>

<style scoped>
    .border {
        border: 1px solid black;
    }

    .border-radius {
        border-radius: 5px;
    }
</style>
