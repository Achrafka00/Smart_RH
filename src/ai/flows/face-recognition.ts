
'use server';
/**
 * @fileOverview A face recognition flow for user authentication.
 *
 * - recognizeFace - A function that handles face recognition.
 * - RecognizeFaceInput - The input type for the recognizeFace function.
 * - RecognizeFaceOutput - The return type for the recognizeFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getEmployees } from '@/lib/services/employee.service';

const RecognizeFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeFaceInput = z.infer<typeof RecognizeFaceInputSchema>;

const RecognizeFaceOutputSchema = z.object({
  isRecognized: z.boolean().describe('Whether the face was recognized.'),
  userId: z.string().optional().describe('The ID of the recognized user, if any.'),
});
export type RecognizeFaceOutput = z.infer<typeof RecognizeFaceOutputSchema>;

export async function recognizeFace(input: RecognizeFaceInput): Promise<RecognizeFaceOutput> {
  return recognizeFaceFlow(input);
}

const recognizeFaceFlow = ai.defineFlow(
  {
    name: 'recognizeFaceFlow',
    inputSchema: RecognizeFaceInputSchema,
    outputSchema: RecognizeFaceOutputSchema,
  },
  async (input) => {
    // In a real application, this flow would call a Python microservice 
    // or a dedicated face recognition API to compare the input face
    // with a database of registered user faces.
    
    console.log('Received face recognition request. Simulating recognition...');

    // Mock logic: randomly decide if the face is recognized. Then, if it is,
    // pick a random *existing* user to "log in" as.
    const isRecognized = Math.random() > 0.3; // Higher chance of success now
    
    if (isRecognized) {
        const employees = await getEmployees();
        if (employees.length > 0) {
            const randomUser = employees[Math.floor(Math.random() * employees.length)];
            console.log(`Recognized user: ${randomUser.name}`);
            return {
                isRecognized: true,
                userId: randomUser.id,
            };
        }
    }
    
    console.log('Face not recognized.');
    return {
        isRecognized: false,
        userId: undefined,
    };
  }
);
