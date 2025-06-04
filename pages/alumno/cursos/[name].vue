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
</script>

<template>
    <HeaderDashboard />
    <div
        class="flex justify-center items-center rounded-xl h-25 bg-primary-500 text-white text-2xl font-bold"
    >
        <h1>{{ name.toUpperCase() }}</h1>
    </div>

    <div class="flex flex-row flex-wrap justify-center items-center h-100 gap-10">
        <span v-for="w in weekNumber" :key="w">
            <CardWeek v-bind:number="w" />
        </span>
    </div>
</template>

<style scoped>
.borddder {
    border: 1px solid black;
}
</style>
