<script lang="ts" setup>
    const router = useRouter()
    const route = useRoute()

    const props = defineProps({
        number: {
            type: Number,
            required: true
        }
    })

    const courseName = route.params.name

    const redirectToDetails = () => {
        let details = props.number == 1 ? 'general' : props.number - 1
        router.push(`/alumno/cursos/page.${details}`)
    }

</script>

<template>
    <div class="w-110 mt-5 cursor-pointer" @click="redirectToDetails">
        <div class="flex justify-center h-15 items-center bg-primary-500 text-white text-2xl font-bold rounded-lg">
            <h3 class="text-lg font-medium" v-if="number==1">General</h3>
            <h3 class="text-lg font-medium" v-else>Semana {{ number-1 }}</h3>
        </div>

        <div class="h-auto flex flex-col justify-center items-center p-4 bg-primary-50 rounded-lg mt-2">
            <p class="text-black-600" v-if="number==1">Aquí encuentras silabo y otros.</p>
            <p class="text-black-600" v-else>Aquí encuentras más información sobre la semana {{ number-1 }}.</p>
        </div>
    </div>
</template>

<style scoped>
    .borderblack{
        border: 1px solid black;
    }
</style>