import { z } from 'zod';

const sessionTokenSchema = z.object({
  SessionToken: z.string(),
  LifetimeSecs: z.number(),
  ReturnCode: z.string(),
  ReturnDesc: z.string(),
});

export async function getSessionToken() {
  const response = await fetch(`${process.env.ECOLLECT_API_URL}/getSessionToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      EntityCode: process.env.ECOLLECT_ENTITY_CODE,
      ApiKey: process.env.ECOLLECT_API_KEY,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('eCollect getSessionToken failed:', errorBody);
    throw new Error(`Failed to get session token from eCollect: ${errorBody}`);
  }

  const data = await response.json();
  const parsedData = sessionTokenSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Invalid session token response from eCollect:', parsedData.error);
    throw new Error('Invalid session token response from eCollect');
  }

  return parsedData.data;
}
