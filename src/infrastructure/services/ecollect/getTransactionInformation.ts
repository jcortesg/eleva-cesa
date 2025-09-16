
import { z } from 'zod';
import { getSessionToken } from './getSessionToken';

const paymentSchema = z.object({
  PaymentSystem: z.string(),
  FICode: z.string(),
  FIName: z.string(),
  BankProcessDate: z.string(),
  TrazabilityCode: z.string(),
  TransValue: z.number(),
  TransVatValue: z.number(),
  TransCycle: z.string(),
  PayCurrency: z.string(),
  CurrencyRate: z.number(),
  AccountingDate: z.string(),
  AccountType: z.string(),
  AccountNumber: z.string(),
  MaskedCard: z.string(),
  EntityCode: z.string(),
  TicketId: z.string(),
  TranState: z.string(),
  Terms: z.number(),
  RespMessage: z.string(),
});

export const transactionInfoSchema = z.object({
  EntityCode: z.string(),
  TicketId: z.string(),
  TrazabilityCode: z.string(),
  TranState: z.string(),
  ReturnCode: z.string(),
  ReturnDesc: z.string().optional().default(""), // en tu data no venía ReturnDesc
  TransValue: z.number(),
  TransVatValue: z.number(),
  PayCurrency: z.string(),
  CurrencyRate: z.number(),
  BankProcessDate: z.string(),
  FICode: z.string(),
  FiName: z.string(),
  PaymentSystem: z.string(),
  TransCycle: z.string(),
  Invoice: z.string(),
  ReferenceArray: z.array(z.string()),
  OperationArray: z.array(z.any()),
  SrvCode: z.string(),
  PaymentDesc: z.string(),
  PaymentInfoArray: z.array(z.any()),
  PaymentsArray: z.array(paymentSchema),
  SessionToken: z.string(),
  Subscription: z.nullable(z.any()),
  SubservicesArray: z.array(z.any()),
});

export async function getTransactionInformation(ticketId: string) {
  const sessionTokenData = await getSessionToken();
  console.log("SESSION_TOKEN DATA ==> ", sessionTokenData);
  console.log("TICKET_ID ==> ", ticketId);
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
  console.log("DATA ==> ", data);
  const parsedData = transactionInfoSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Invalid transaction information response from eCollect:', parsedData.error);
    throw new Error('Invalid transaction information response from eCollect');
  }

  return parsedData.data;
}
