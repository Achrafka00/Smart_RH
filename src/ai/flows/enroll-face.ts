
'use server';
/**
 * @fileOverview A face enrollment flow for user signup.
 *
 * - enrollFace - A function that handles face enrollment.
 * - EnrollFaceInput - The input type for the enrollFace function.
 * - EnrollFaceOutput - The return type for the enrollFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { addEmployee } from '@/lib/services/employee.service';

const EnrollFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. "
    ),
  name: z.string().describe("The user's full name."),
  email: z.string().email().describe("The user's email address."),
});
export type EnrollFaceInput = z.infer<typeof EnrollFaceInputSchema>;

const EnrollFaceOutputSchema = z.object({
  userId: z.string().describe('The ID of the newly created user.'),
  success: z.boolean().describe('Whether the enrollment was successful.'),
});
export type EnrollFaceOutput = z.infer<typeof EnrollFaceOutputSchema>;

export async function enrollFace(input: EnrollFaceInput): Promise<EnrollFaceOutput> {
  return enrollFaceFlow(input);
}

const enrollFaceFlow = ai.defineFlow(
  {
    name: 'enrollFaceFlow',
    inputSchema: EnrollFaceInputSchema,
    outputSchema: EnrollFaceOutputSchema,
  },
  async (input) => {
    // In a real application, this flow would:
    // 1. Validate the photo to ensure it's a clear face.
    // 2. Call a Python microservice or a dedicated face recognition API 
    //    to create a biometric template from the photo.
    // 3. Store the template in a secure database.
    // 4. Create a new user record in the user database with the provided name/email
    //    and link it to the stored facial template.
    
    console.log(`Enrolling new user ${input.name} with email ${input.email}`);

    // For now, we will just create a new user in our mock service.
    const newUser = await addEmployee({
        name: input.name,
        email: input.email,
        avatar: `https://picsum.photos/seed/${input.name}/200/200`,
        role: 'Employee',
        team: 'Unassigned'
    });
    
    return {
        success: true,
        userId: newUser.id,
    };
  }
);
