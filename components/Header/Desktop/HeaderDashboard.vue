<script setup lang="ts">
const { logout, userProfile } = useAuthUser()
const route = useRouter()

const props = defineProps({
    courseName: {
        type: String,
        required: true
    }
})

const activeTab = ref('tablon')

const toInitPage = () => {
    activeTab.value = 'tablon'
    // route.push('/alumno/dashboard')
    route.push(`/alumno/cursos/${props.courseName}`)
}

const toMembersPage = () => {
    activeTab.value = 'personas'
    console.log('courseName', props.courseName)
    route.push(`/alumno/cursos/member.${props.courseName}`)
}

const handleLogout = async () => {
    await logout()
    route.push('/')
}

const redirectToProfile = () => {
    route.push('/alumno/perfil')
}
</script>

<template>
    <div class="mt-4">
        <UPopover>
            <div class="flex justify-around items-center mb-6 p-2">
                <img src="../../../public/EduIA.png" alt="" class="w-35 inline-block">
                <div class="flex flex-row items-center justify-center gap-4">
                    <p @click="toInitPage" 
                       :class="[
                         'cursor-pointer p-2 border-radius transition-colors',
                         activeTab === 'tablon' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                       ]">
                       Tablón
                    </p>
                    <p @click="toMembersPage" 
                       :class="[
                         'cursor-pointer p-2 border-radius transition-colors',
                         activeTab === 'personas' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                       ]">
                       Personas
                    </p>
                </div>
                
                <UPopover class="flex flex-col gap-2 w-28 justify-end items-end">
                    <div class="flex justify-center mb-6 cursor-pointer">
                        <UAvatar size="2xl"
                            :text="(userProfile?.first_name?.[0].toUpperCase() || '') + (userProfile?.last_name?.[0].toLowerCase() || '')"
                            color="primary" class="cursor-pointer" />
                    </div>

                    <template #content>
                        <div class="flex flex-col items-center gap-2 justify-center h-full">
                            <UButton class="flex justify-center cursor-pointer w-full" color="secondary"
                                @click="redirectToProfile">
                                Perfil
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