<template>
    <div class="flex flex-col items-center w-full max-w-xl">
        <form
            v-if="!quizResult"
            class="flex flex-col items-center w-full h-56 gap-6 justify-center"
            @submit.prevent="handleSubmit"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'bg-secondary-100': isDragging }"
        >
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                @change="handleFileSelect"
                accept=".pdf,.doc,.docx,.txt"
            />

            <div
                v-if="!file"
                class="flex flex-col items-center gap-4 px-4 border-dashed border-secondary-400 border-3 w-full py-5 bg-secondary-50 rounded-3xl"
            >
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-document-text" class="text-red-600" size="32" />
                    <UIcon name="i-heroicons-document-text" class="text-blue-500" size="32" />
                    <UIcon name="i-heroicons-document-text" class="text-secondary-500" size="32" />
                </div>
                <span class="text-secondary-900">Arrastre y suelte un archivo aquí</span>
                <UButton @click.prevent="triggerFileInput" :disabled="isProcessing">
                    Seleccionar archivo
                </UButton>
            </div>

            <div v-else class="w-full px-4">
                <div
                    class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm w-full"
                >
                    <div class="flex items-center gap-2">
                        <UIcon
                            name="i-heroicons-document-text"
                            :class="getFileClassIcon(file.type)"
                            size="24"
                        />
                        <span class="text-sm text-secondary-900 truncate max-w-xs">{{
                            file.name
                        }}</span>
                        <span class="text-xs text-secondary-500">{{
                            formatFileSize(file.size)
                        }}</span>
                    </div>
                    <UButton
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        size="xs"
                        @click="removeFile"
                        :disabled="isProcessing"
                    />
                </div>

                <div v-if="!isProcessing" class="flex justify-between mt-4">
                    <UButton variant="soft" @click="triggerFileInput" :disabled="isProcessing">
                        Cambiar archivo
                    </UButton>
                    <UButton
                        type="submit"
                        color="primary"
                        :loading="isProcessing"
                        :disabled="!file"
                    >
                        {{ isProcessing ? 'Procesando...' : 'Procesar archivo' }}
                    </UButton>
                </div>
            </div>
            <div v-if="isProcessing" class="w-full">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                        ></div>
                        <span class="text-blue-800 text-sm">
                            Analizando documento y generando preguntas...
                        </span>
                    </div>
                </div>
            </div>
            <UAlert
                v-if="errorMessage"
                color="error"
                variant="soft"
                icon="i-heroicons-exclamation-triangle"
                :description="errorMessage"
                class="flex items-center"
                closable
                @close="errorMessage = null"
            />
        </form>

        <div v-if="quizResult" class="w-full">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-heroicons-check-circle" class="text-green-600" size="20" />
                    <span class="text-green-800 font-medium">¡Quiz generado exitosamente!</span>
                </div>
                <p class="text-green-700 text-sm">
                    Se han generado {{ quizResult.length }} preguntas basadas en el contenido del
                    documento.
                </p>
            </div>

            <div class="flex justify-center">
                <UButton
                    variant="outline"
                    @click="
                        () => {
                            quizResult = null
                            removeFile()
                        }
                    "
                >
                    Generar nuevo quiz
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDocumentUploader } from '~/composables/useDocumentUploader'

const {
    fileInput,
    isDragging,
    file,
    errorMessage,
    isProcessing,
    quizResult,
    triggerFileInput,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    removeFile,
    formatFileSize,
    handleSubmit,
    getFileClassIcon
} = useDocumentUploader()

const emit = defineEmits<{
    quizGenerated: [quiz: any[]]
}>()

watch(quizResult, newQuiz => {
    if (newQuiz) {
        emit('quizGenerated', newQuiz)
    }
})
</script>
