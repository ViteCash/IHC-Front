import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai'

export const useGemini = () => {
    const config = useRuntimeConfig()
    const ai = new GoogleGenAI({ apiKey: config.public.gemini.apiKey })

    const myFile = ref()
    const geminiResponse = ref()
    const quizData = ref()

    const uploadFile = async (file: File) => {
        try {
            myFile.value = await ai.files.upload({
                file: file,
                config: { mimeType: file.type }
            })
            return myFile.value
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }

    const generateQuizFromFile = async (file: File) => {
        try {
            const uploadedFile = await uploadFile(file)

            const quizPrompt = `Analiza el contenido del documento y genera exactamente 10 preguntas de opción múltiple basadas en los temas principales.

INSTRUCCIONES ESTRICTAS:
- Retorna ÚNICAMENTE un JSON válido, sin texto adicional
- Cada pregunta debe tener exactamente 4 opciones
- El valor "correct" debe corresponder al número de la opción correcta (1, 2, 3 o 4)
- Las preguntas deben cubrir los conceptos más importantes del documento
- Asegúrate de que las opciones incorrectas sean plausibles pero claramente distintas de la correcta

FORMATO REQUERIDO:
[
  {
    "question": "Pregunta aquí",
    "options": [
      {"value": 1, "label": "Opción 1"},
      {"value": 2, "label": "Opción 2"},
      {"value": 3, "label": "Opción 3"},
      {"value": 4, "label": "Opción 4"}
    ],
    "correct": 1
  }
]

Genera exactamente 10 preguntas siguiendo este formato.`

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: createUserContent([
                    createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
                    quizPrompt
                ])
            })

            const jsonMatch =
                response.candidates?.[0].content?.parts?.[0].text?.match(/\[[\s\S]*\]/)
            if (!jsonMatch) {
                throw new Error('No se pudo extraer el JSON de la respuesta')
            }

            const quizJson = JSON.parse(jsonMatch[0])

            if (!Array.isArray(quizJson) || quizJson.length !== 10) {
                throw new Error('El quiz generado no tiene el formato correcto')
            }

            quizData.value = quizJson
            return quizJson
        } catch (error) {
            console.error('Error generating quiz:', error)
            throw error
        }
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
        quizData,
        generateFromText,
        generateQuizFromFile
    }
}
