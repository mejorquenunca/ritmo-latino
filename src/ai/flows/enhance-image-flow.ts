
'use server';
/**
 * @fileOverview Un flujo de Genkit para mejorar imágenes de eventos.
 *
 * - enhanceImage - Una función que toma la imagen de un evento y la mejora usando IA generativa.
 * - EnhanceImageInput - El tipo de entrada para la función enhanceImage.
 * - EnhanceImageOutput - El tipo de retorno para la función enhanceImage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "Una foto para un evento, como un data URI que debe incluir un MIME type y usar Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceImageInput = z.infer<typeof EnhanceImageInputSchema>;

const EnhanceImageOutputSchema = z.object({
    enhancedImageDataUri: z
    .string()
    .describe(
      "La imagen mejorada, devuelta como un data URI."
    ),
});
export type EnhanceImageOutput = z.infer<typeof EnhanceImageOutputSchema>;

export async function enhanceImage(input: EnhanceImageInput): Promise<EnhanceImageOutput> {
  return enhanceImageFlow(input);
}

const enhanceImageFlow = ai.defineFlow(
  {
    name: 'enhanceImageFlow',
    inputSchema: EnhanceImageInputSchema,
    outputSchema: EnhanceImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            {media: {url: input.imageDataUri}},
            {text: 'Mejora esta imagen para un póster de evento, hazla más vibrante y llamativa. Mantén las dimensiones y el sujeto principal.'},
        ],
        config: {
            responseModalities: ['IMAGE'],
        },
    });

    if (!media || !media.url) {
        throw new Error("La IA no pudo generar una imagen mejorada.");
    }
    
    return {
        enhancedImageDataUri: media.url,
    };
  }
);
