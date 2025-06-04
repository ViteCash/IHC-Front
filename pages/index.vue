<script setup lang="ts">
import Header from '~/components/Header.vue'
</script>

<template>
    <Header />
    <main class="flex flex-col items-center justify-center h-full p-5">
        <div
            class="flex flex-col gap-10 relative items-center rounded-2xl bg-secondary-100 py-16 border-7 border-secondary-200 px-4 sm:px-24 bg-linear-to-tr from-secondary-50 to-white max-w-4xl"
        >
            <img src="/image 4.png" class="hidden sm:block absolute top-0 right-0" alt="Tools" />
            <h1 class="text-3xl font-bold text-center">
                Convierte cualquier fuente en
                <span class="text-secondary-400 font-blac">Flashcards, Tests y Resúmenes</span>
                impulsados por IA al instante!
            </h1>
            <DocumentUploader />
        </div>
    </main>
</template>
