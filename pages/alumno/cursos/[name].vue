<script setup lang="ts">
import HeaderDashboard from '~/components/Header/Desktop/HeaderDashboard.vue'
import CardWeek from '~/components/CardWeek.vue'
import { useCourseStore } from '~/stores/courseStore'

definePageMeta({
    layout: 'cursos'
})

const route = useRoute()
const { name } = route.params as { name: string }
const courseStore = useCourseStore()
courseStore.setCourseName(name)

const weekNumber = ref(16)
console.log('Course Name name.vue:', courseStore.currentCourseName)
</script>

<template>
    <HeaderDashboard :courseName="courseStore.currentCourseName" />
    <div class="flex flex-col gap-5 max-w-[1200px] mx-auto">
        <h1 class="text-2xl font-bold">{{ name.toUpperCase() }}</h1>

        <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-center h-100 gap-5"
        >
            <CardWeek v-for="w in weekNumber" :key="w" v-bind:number="w" />
        </div>
    </div>
</template>

<style scoped>
.borddder {
    border: 1px solid black;
}
</style>
