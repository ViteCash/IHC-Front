<template>
    <div class="w-full overflow-y-auto">
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Quiz Generado</h2>
            <p class="text-gray-600">{{ questions.length }} preguntas basadas en el documento</p>
        </div>

        <div class="space-y-6">
            <div
                v-for="(question, index) in questions"
                :key="index"
                class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
                <div class="mb-4">
                    <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2"
                    >
                        Pregunta {{ index + 1 }}
                    </span>
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ question.question }}
                    </h3>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="option in question.options"
                        :key="option.value"
                        class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors"
                        :class="{
                            'border-secondary-300 bg-secondary-50':
                                userAnswers[index] === option.value
                        }"
                        @click="selectAnswer(index, option.value)"
                    >
                        <div
                            class="flex items-center justify-center w-6 h-6 border-2 border-gray-200 rounded-full mr-3"
                        >
                            <span class="text-sm font-medium text-gray-500">
                                {{ ['A', 'B', 'C', 'D'][option.value - 1] }}
                            </span>
                        </div>
                        <span
                            class="text-gray-900"
                            :class="{
                                'font-medium': showAnswers && option.value === question.correct
                            }"
                        >
                            {{ option.label }}
                        </span>
                        <UIcon
                            v-if="showAnswers && option.value === question.correct"
                            name="i-heroicons-check"
                            class="ml-auto text-green-600"
                            size="20"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Controles -->
        <div class="mt-8 flex justify-center gap-4">
            <UButton
                v-if="!showAnswers"
                @click="showAnswers = true"
                color="primary"
                :disabled="Object.keys(userAnswers).length !== questions.length"
            >
                Ver respuestas correctas
            </UButton>
            <UButton v-if="showAnswers" @click="resetQuiz" variant="outline">
                Reiniciar quiz
            </UButton>
            <UButton @click="exportQuiz" variant="soft" icon="i-heroicons-arrow-down-tray">
                Exportar JSON
            </UButton>
        </div>

        <!-- Puntuación -->
        <div v-if="showAnswers" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="text-center">
                <h3 class="text-lg font-medium text-blue-900 mb-2">Resultado</h3>
                <p class="text-2xl font-bold text-blue-600">
                    {{ calculateScore() }}/{{ questions.length }}
                </p>
                <p class="text-blue-700">
                    {{ Math.round((calculateScore() / questions.length) * 100) }}% de aciertos
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface QuizOption {
    value: number
    label: string
}

interface QuizQuestion {
    question: string
    options: QuizOption[]
    correct: number
}

const props = defineProps<{
    questions: QuizQuestion[]
}>()

const showAnswers = ref(false)
const userAnswers = ref<Record<number, number>>({})

const selectAnswer = (questionIndex: number, optionValue: number) => {
    userAnswers.value[questionIndex] = optionValue
    console.log(userAnswers.value)
}

const calculateScore = () => {
    let score = 0
    props.questions.forEach((question, index) => {
        if (userAnswers.value[index] === question.correct) {
            score++
        }
    })
    return score
}

const resetQuiz = () => {
    showAnswers.value = false
    userAnswers.value = {}
}

const exportQuiz = () => {
    const dataStr = JSON.stringify(props.questions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'quiz-generado.json'
    link.click()
    URL.revokeObjectURL(url)
}
</script>
