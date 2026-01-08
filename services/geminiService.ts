import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * Busca uma reflexão diária usando o modelo Gemini Flash.
 */
export const getDailyReflection = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma reflexão curta e inspiradora (máximo 280 caracteres) para um jovem católico do movimento EJC, focada no serviço e no encontro com Cristo.",
      config: {
        temperature: 0.7,
      },
    });
    const text = response.text;
    return text?.trim() || "O Cristo que nos une é o mesmo que nos envia. Seja luz no mundo!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tudo posso naquele que me fortalece. (Filipenses 4:13)";
  }
};

/**
 * Gera áudio de oração usando o modelo TTS com voz ultra-natural.
 */
export const generatePrayerAudio = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ text: `Aja como uma pessoa real em um momento de profunda oração e devoção. Sua voz deve ser calorosa, calma, extremamente natural e humana. Evite tons metálicos ou robóticos. Use pausas de respiração naturais e uma entonação que transmita paz e acolhimento. Narre o seguinte texto: ${text}` }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Zephyr é uma voz excelente para narrações devocionais e acolhedoras
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

/**
 * Gera uma pergunta de quiz complexa usando o modelo Gemini Pro.
 */
export const generateQuizQuestion = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Gere uma pergunta de múltipla escolha sobre a Bíblia ou a Igreja Católica, adequada para jovens.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          propertyOrdering: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    });
    
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};