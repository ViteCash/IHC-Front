// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    modules: [
        '@nuxt/fonts',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxt/ui',
        '@vueuse/nuxt',
        '@nuxtjs/supabase',
        '@pinia/nuxt',
        '@nuxtjs/color-mode'
    ],
    supabase: {
        redirectOptions: {
            login: '/',
            callback: '/auth/confirm',
            exclude: ['/']
        }
    },
    runtimeConfig: {
        public: {
            supabase: {
                url: process.env.SUPABASE_URL,
                key: process.env.SUPABASE_SERVICE_KEY
            },
            gemini: {
                apiKey: process.env.GEMINI_API_KEY
            }
        }
    },
    ui: {
        theme: {
            colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
        }
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
        classSuffix: ''
    }
})
