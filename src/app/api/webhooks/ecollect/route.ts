import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Webhook received from eCollect');
  return NextResponse.json({ ok: true });
}