// app/api/files/upload/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';          // ensure Node runtime
export const dynamic = 'force-dynamic';   // optional, if you need it

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Use env so it works in dev/prod/containers
    const pythonBackendUrl = 'http://10.10.10.151:5000';

    const resp = await fetch(`${pythonBackendUrl}/upload`, {
      method: 'POST',
      body: formData, // DO NOT set Content-Type; let fetch set the multipart boundary
    });

    const ct = resp.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await resp.json() : await resp.text();

    if (!resp.ok) {
      console.error('Python backend upload error:', resp.status, body);
      // surface whatever we got (JSON or text) back to the client
      return NextResponse.json(
        { error: 'Failed to upload file to backend', status: resp.status, details: body },
        { status: resp.status }
      );
    }

    // ok branch: if backend sent JSON, body is object; if text, wrap
    return NextResponse.json(typeof body === 'object' ? body : { message: body });
  } catch (err) {
    console.error('API route upload error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
