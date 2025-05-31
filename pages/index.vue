<script setup lang="ts">
    import { useMediaQuery } from '@vueuse/core'
    import {breakpoints} from '~/utils/breakpoints'
    import Header from '~/components/Header/Desktop/Header.vue';    
    import HeaderMobbile from '~/components/Header/Mobile/Header.vue';

    const isMobile = useMediaQuery(`(max-width: ${breakpoints.md})`)
</script>


<template>
    <UModal>
        <HeaderMobbile v-if="isMobile"/>
        <Header v-else />
        <main class="flex flex-col items-center h-full p-5">
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
    </UModal>
</template>

<style scoped>
   .border {
    border: 1px solid red;
   }
</style>
