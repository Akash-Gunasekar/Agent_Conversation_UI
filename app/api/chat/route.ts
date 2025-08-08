import { NextResponse } from 'next/server';

// No need for require('dotenv').config() in Next.js API routes
// Next.js automatically loads .env, .env.local, etc., at startup

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL;

    // Fail early if env var is missing
    if (!pythonBackendUrl) {
      console.error('❌ Environment variable PYTHON_BACKEND_URL is missing.');
      return NextResponse.json(
        { error: 'Server configuration error: PYTHON_BACKEND_URL is not set.' },
        { status: 500 }
      );
    }

    const response = await fetch(`${pythonBackendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Python backend error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from backend', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
