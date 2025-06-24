export const useDocumentUploader = () => {
    const { generateQuizFromFile } = useGemini()
    const { uploadQuizMaterial } = useTeacher()
    // Refs
    const fileInput = ref<HTMLInputElement>()
    const isDragging = ref(false)
    const file = ref<File | null>(null)
    const errorMessage = ref<string | null>(null)
    const isProcessing = ref(false)
    const quizResult = ref()

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]

    const maxFileSize = 10 * 1024 * 1024

    const validateFile = (selectedFile: File): boolean => {
        errorMessage.value = null

        if (!allowedTypes.includes(selectedFile.type)) {
            errorMessage.value =
                'Tipo de archivo no permitido. Solo se permiten archivos PDF, DOC, DOCX y TXT.'
            return false
        }

        if (selectedFile.size > maxFileSize) {
            errorMessage.value =
                'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.'
            return false
        }

        return true
    }

    const triggerFileInput = () => {
        fileInput.value?.click()
    }

    const handleFileSelect = (event: Event) => {
        const target = event.target as HTMLInputElement
        const selectedFile = target.files?.[0]

        if (selectedFile && validateFile(selectedFile)) {
            file.value = selectedFile
        }
    }

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault()
        isDragging.value = true
    }

    const handleDrop = (event: DragEvent) => {
        event.preventDefault()
        isDragging.value = false

        const droppedFile = event.dataTransfer?.files[0]
        if (droppedFile && validateFile(droppedFile)) {
            file.value = droppedFile
        }
    }

    const removeFile = () => {
        file.value = null
        quizResult.value = null
        errorMessage.value = null
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'

        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileClassIcon = (fileType: string): string => {
        switch (fileType) {
            case 'application/pdf':
                return 'text-red-600'
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'text-blue-500'
            case 'text/plain':
                return 'text-green-600'
            default:
                return 'text-secondary-500'
        }
    }

    const handleSubmit = async () => {
        if (!file.value) {
            errorMessage.value = 'Por favor selecciona un archivo antes de procesar.'
            return
        }

        isProcessing.value = true
        errorMessage.value = null

        try {
            const quiz = await generateQuizFromFile(file.value)
            quizResult.value = quiz
            await uploadQuizMaterial(file.value)
        } catch (error) {
            errorMessage.value = 'Error al procesar el archivo. Por favor intenta nuevamente.'
        } finally {
            isProcessing.value = false
        }
    }

    return {
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
        getFileClassIcon,
        validateFile
    }
}
