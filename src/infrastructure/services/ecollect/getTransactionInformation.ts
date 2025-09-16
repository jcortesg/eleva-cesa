
import { z } from 'zod';
import { getSessionToken } from './getSessionToken';

const transactionInfoSchema = z.object({
  approvalCode: z.string(),
  paymentMethod: z.string(),
  response: z.string(),
  transactionDate: z.string(),
  transactionId: z.string(),
  ReturnCode: z.string(),
  ReturnDesc: z.string(),
});

export async function getTransactionInformation(ticketId: string) {
  const sessionTokenData = await getSessionToken();

  const response = await fetch(`${process.env.ECOLLECT_API_URL}/getTransactionInformation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      SessionToken: sessionTokenData.SessionToken,
      EntityCode: process.env.ECOLLECT_ENTITY_CODE,
      TicketId: ticketId,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('eCollect getTransactionInformation failed:', errorBody);
    throw new Error(`Failed to get transaction information from eCollect: ${errorBody}`);
  }

  const data = await response.json();
  const parsedData = transactionInfoSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Invalid transaction information response from eCollect:', parsedData.error);
    throw new Error('Invalid transaction information response from eCollect');
  }

  return parsedData.data;
}
