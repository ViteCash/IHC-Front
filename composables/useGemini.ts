import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai'

export const useGemini = () => {
    const config = useRuntimeConfig()
    const ai = new GoogleGenAI({ apiKey: config.public.gemini.apiKey })

    const myFile = ref()
    const geminiResponse = ref()

    const readFile = async () => {
        myFile.value = await ai.files.upload({
            file: 'pdf_ejemplo.pdf',
            config: { mimeType: 'application/pdf' }
        })

        return myFile.value
    }

    const generateFromFile = async () => {
        await readFile()
        geminiResponse.value = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: createUserContent([
                createPartFromUri(myFile.value.uri, myFile.value.mimeType),
                'Genera un examen de 10 preguntas con 4 opciones de respuesta cada una, de los temas que contiene el pdf.'
            ])
        })
    }

    const generateFromText = async (text: string) => {
        const systemPrompt = `Eres un chatbot especializado en biología para un curso educativo. 

INSTRUCCIONES:
- Solo responde preguntas relacionadas con biología (células, genética, ecosistemas, evolución, anatomía, fisiología, etc.)
- Si la pregunta no es sobre biología, responde que solo puedes ayudar con temas de biología
- Responde de forma directa y objetiva, sin saludos ni introducciones
- Mantén tus respuestas concisas (máximo 2 párrafos cortos)
- Usa un lenguaje claro y técnico apropiado para estudiantes
- Ve directo al punto, sin explicaciones innecesarias
`

        geminiResponse.value = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: createUserContent([text]),
            config: {
                systemInstruction: systemPrompt
            }
        })
    }

    return {
        geminiResponse,
        generateFromFile,
        generateFromText
    }
}
