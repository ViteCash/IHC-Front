import { ref } from 'vue'

export const useDocumentUploader = () => {
    const fileInput = ref<HTMLInputElement | null>(null)
    const isDragging = ref(false)
    const file = ref<File | null>(null)
    const errorMessage = ref<string | null>(null)

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]

    const triggerFileInput = () => {
        if (fileInput.value) {
            fileInput.value.click()
        }
    }

    const handleDragOver = (event: DragEvent) => {
        isDragging.value = true

        if (event.dataTransfer?.items.length !== 1) {
            errorMessage.value = 'Solo se permite un archivo'
        } else {
            errorMessage.value = null
        }
    }

    const handleDrop = (event: DragEvent) => {
        isDragging.value = false
        if (!event.dataTransfer?.files) return

        if (event.dataTransfer.files.length !== 1) {
            errorMessage.value = 'Solo se permite un archivo'
            return
        }

        const newFile = event.dataTransfer.files[0]
        validateAndSetFile(newFile)
    }

    const handleFileSelect = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!target.files || target.files.length === 0) return

        const newFile = target.files[0]
        validateAndSetFile(newFile)

        target.value = ''
    }

    const validateAndSetFile = (newFile: File) => {
        const isValidType = isValidFileType(newFile)

        if (!isValidType) {
            errorMessage.value = 'Tipo de archivo no permitido. Use .pdf, .doc, .docx o .txt'
            return
        }

        file.value = newFile
        errorMessage.value = null
    }

    const isValidFileType = (file: File): boolean => {
        if (allowedTypes.includes(file.type)) {
            return true
        }

        const fileName = file.name.toLowerCase()
        return (
            fileName.endsWith('.pdf') ||
            fileName.endsWith('.doc') ||
            fileName.endsWith('.docx') ||
            fileName.endsWith('.txt')
        )
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'

        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileClassIcon = (fileType: string): string => {
        if (fileType === 'application/pdf') {
            return 'text-red-600'
        } else if (
            fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return 'text-blue-500'
        } else if (fileType === 'text/plain') {
            return 'text-secondary-500'
        }

        return 'text-secondary-500'
    }

    const handleSubmit = () => {
        if (!file.value) {
            errorMessage.value = 'Por favor, seleccione un archivo primero'
            return
        }
    }

    const removeFile = () => {
        file.value = null
    }

    const clearError = () => {
        errorMessage.value = null
    }

    return {
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
        getFileClassIcon,
        handleSubmit,
        clearError
    }
}
