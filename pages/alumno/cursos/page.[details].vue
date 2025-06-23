<script lang="ts" setup>
definePageMeta({
  layout: 'cursos'
})

import { useCourseStore } from '~/stores/courseStore'
import HeaderDashboard from '~/components/Header/Desktop/HeaderDashboard.vue'

const route = useRoute()
const { details } = route.params as { details: string }

const courseStore = useCourseStore()
const courseName = computed(() => courseStore.currentCourseName)
// console.log('Course Name page details:', courseName.value)
</script>

<template>
    <HeaderDashboard :courseName="courseName" />
    <div
        class="flex justify-center items-center rounded-xl h-25 bg-primary-500 text-white text-2xl font-bold"
    >
        <h1>{{ courseName.toUpperCase() }}</h1>
    </div>
    <div
        class="flex flex-row h-120 items-center justify-center gap-20 p-4 bg-primary-50 mt-5 rounded-lg"
    >
        <div
            class="w-50 h-10 flex items-center justify-center rounded-lg bg-primary-500 text-white text-lg font-bold"
        >
            <h2 v-if="details === 'general'">{{ details.toUpperCase() }}</h2>
            <h2 v-else>SEMANA {{ details }}</h2>
        </div>

        <div class="flex flex-col items-center justify-center gap-4">
            <USeparator color="primary" size="xl" class="w-150" />

            <div
                class="w-150 h-10 flex items-center justify-start text-lg font-bold gap-5 cursor-pointer"
            >
                <img src="../../../public/image 4.png" class="w-8 rounded" />
                <p>Silabo_del_curso.pdf</p>
            </div>

            <USeparator color="primary" size="xl" class="w-150" />

            <div
                class="w-150 h-10 flex items-center justify-start text-lg font-bold gap-5 cursor-pointer"
            >
                <img src="../../../public/image 4.png" class="w-8 rounded" />
                <p>Silabo_dosificado_del_curso.pdf</p>
            </div>

            <USeparator color="primary" size="xl" class="w-150" />

            <div
                class="w-150 h-10 flex items-center justify-start text-lg font-bold gap-5 cursor-pointer"
            >
                <img src="../../../public/image 4.png" class="w-8 rounded" />
                <p>Libro.pdf</p>
            </div>

            <USeparator color="primary" size="xl" class="w-150" />
        </div>
    </div>
</template>

<style scoped>
.borrder {
    border: 1px solid black;
}
</style>
