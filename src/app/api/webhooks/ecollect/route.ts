import { NextResponse } from 'next/server';

export async function POST() {
  console.log('Webhook received from eCollect');
  return NextResponse.json({ ok: true });
}