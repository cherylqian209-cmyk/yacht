export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyDeployedPage } from '@/lib/browserVerify';

interface VerifyRequestBody {
  url?: string;
  sampleEmail?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as VerifyRequestBody | null;

  if (!body?.url) {
    return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 });
  }

  const normalizedUrl = body.url.startsWith('http')
    ? body.url
    : new URL(body.url, request.nextUrl.origin).toString();

  const result = await verifyDeployedPage(normalizedUrl, body.sampleEmail);
  return NextResponse.json(result);
}
