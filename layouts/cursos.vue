<template>
    <div>
        <slot />
        <USlideover>
            <UButton color="secondary" class="fixed right-4 bottom-4 rounded-2xl">
                <UIcon name="i-heroicons-chat-bubble-oval-left" size="32" />
            </UButton>
            <template #header>
                <h1 class="text-lg font-bold">Chatbot</h1>
            </template>
            <template #body>
                <div class="flex flex-col gap-3 h-full">
                    <div v-if="messages.length === 0" class="text-gray-500 text-center">
                        Escribe un mensaje para comenzar...
                    </div>
                    <div
                        v-for="(message, index) in messages"
                        :key="index"
                        class="flex"
                        :class="message.isUser ? 'justify-end' : 'justify-start'"
                    >
                        <div
                            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                            :class="
                                message.isUser
                                    ? 'bg-primary-100 text-primary-900 rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            "
                        >
                            <p class="text-sm">{{ message.text }}</p>
                            <span class="text-xs opacity-70">{{ message.timestamp }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <UForm
                    :state="formState"
                    @submit="talkToBot"
                    class="flex items-center gap-2 w-full"
                >
                    <UInput
                        ref="input"
                        class="w-full"
                        v-model="formState.message"
                        placeholder="Escribe tu mensaje..."
                        :ui="{ trailing: 'pr-0.5' }"
                    >
                        <template #trailing>
                            <UButton
                                ref="micButton"
                                variant="link"
                                size="xl"
                                :icon="
                                    isListening
                                        ? 'i-heroicons-stop-solid'
                                        : 'i-heroicons-microphone'
                                "
                                :color="isListening ? 'error' : 'primary'"
                                @click="toggleSpeechRecognition"
                            />
                        </template>
                    </UInput>
                    <UButton
                        size="xl"
                        icon="i-heroicons-paper-airplane"
                        type="submit"
                        :disabled="!formState.message.trim()"
                    />
                </UForm>
            </template>
        </USlideover>
    </div>
</template>

<script lang="ts" setup>
import { useSpeechRecognition } from '@vueuse/core'

const input = useTemplateRef('input')
const micButton = useTemplateRef('micButton')

const formState = reactive({
    message: ''
})

interface Message {
    text: string
    isUser: boolean
    timestamp: string
}

const messages = ref<Message[]>([])

const { generateFromText, geminiResponse } = useGemini()

const talkToBot = async () => {
    const messageText = formState.message.trim()
    if (!messageText) return

    const userMessage: Message = {
        text: messageText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    messages.value.push(userMessage)
    formState.message = ''

    await generateFromText(messageText)
    const botMessage: Message = {
        text: geminiResponse.value.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    messages.value.push(botMessage)
}

const { isListening, isSupported, stop, start, result } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    lang: 'es-ES'
})

watch(isListening, () => {
    if (!isListening.value && result.value) {
        talkToBot()
    }
})

watch(result, newResult => {
    if (newResult) {
        formState.message = newResult
    }
})

const toggleSpeechRecognition = () => {
    if (!isSupported.value) return

    if (isListening.value) {
        stop()
    } else {
        formState.message = ''
        start()
        nextTick(() => {
            input.value?.inputRef?.focus()
        })
    }
}

defineShortcuts({
    meta_j: () => {
        input.value?.inputRef?.focus()
    },
    meta_k: () => {
        toggleSpeechRecognition()
    }
})

onUnmounted(() => {
    if (isListening.value) {
        stop()
    }
})
</script>
