import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
  const reference = params.reference;
  return NextResponse.json({ status: 'pending', amount: 100, destination: 'test', paymentId: '123', reference });
}