<script setup lang="ts">
const { currentCourse } = useCourseStore()
const generatedQuiz = ref()

const handleQuizGenerated = (quiz: any[]) => {
    generatedQuiz.value = quiz
}
</script>

<template>
    <div class="flex flex-col w-full h-full max-w-[1200px] mx-auto">
        <div class="flex justify-between items-center">
            <!-- Agregar header con logo y avatar para que pueda cerrar sesion  -->
            <!-- Agregar boton para volver al dashboard -->
            <h1 class="text-2xl font-semibold text-secondary-500 py-8 px-2.5">
                {{ currentCourse?.title }} | {{ currentCourse?.course_code }}
            </h1>
        </div>
        <div class="flex flex-col gap-4 rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900">
                {{ generatedQuiz ? '' : 'Instrucciones' }}
            </h2>

            <div v-if="!generatedQuiz" class="flex justify-center items-center gap-8">
                <div class="flex flex-col gap-2">
                    <div class="flex items-start gap-3">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                            1
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">Sube tu documento</h4>
                            <p class="text-sm text-gray-600">
                                Arrastra y suelta o selecciona un archivo con el contenido que
                                quieres evaluar.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                            2
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">Procesa el archivo</h4>
                            <p class="text-sm text-gray-600">
                                La IA analizará el contenido y generará preguntas relevantes
                                automáticamente.
                            </p>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div
                            class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium"
                        >
                            3
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">Obtén tu quiz</h4>
                            <p class="text-sm text-gray-600">
                                Recibirás 10 preguntas de opción múltiple listas para usar o
                                exportar.
                            </p>
                        </div>
                    </div>
                </div>

                <DocumentUploader @quiz-generated="handleQuizGenerated" />
            </div>

            <QuizDisplay v-else :questions="generatedQuiz" />
        </div>
    </div>
</template>
