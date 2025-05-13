<template>
    <form
        class="flex flex-col items-center w-full max-w-xl h-56 justify-center"
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
            <UButton @click.prevent="triggerFileInput">Seleccionar archivo</UButton>
        </div>
        <div v-else class="w-full px-4">
            <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm w-full">
                <div class="flex items-center gap-2">
                    <UIcon
                        name="i-heroicons-document-text"
                        :class="getFileClassIcon(file.type)"
                        size="24"
                    />
                    <span class="text-sm text-secondary-900 truncate max-w-xs">{{
                        file.name
                    }}</span>
                    <span class="text-xs text-secondary-500">{{ formatFileSize(file.size) }}</span>
                </div>
                <UButton variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="removeFile" />
            </div>
            <div class="flex justify-between mt-4">
                <UButton variant="soft" @click="triggerFileInput">Cambiar archivo</UButton>
                <UButton type="submit" color="primary">Procesar archivo</UButton>
            </div>
        </div>

        <div v-if="errorMessage" class="w-full mt-2">
            <UAlert
                color="error"
                variant="soft"
                icon="i-heroicons-exclamation-triangle"
                close
                :description="errorMessage"
                class="flex items-center"
            >
                <template #close>
                    <UButton
                        color="error"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        size="xs"
                        @click="errorMessage = null"
                    />
                </template>
            </UAlert>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useDocumentUploader } from '~/composables/useDocumentUploader'

const {
    fileInput,
    isDragging,
    file,
    errorMessage,
    triggerFileInput,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    removeFile,
    formatFileSize,
    handleSubmit,
    getFileClassIcon
} = useDocumentUploader()
</script>
