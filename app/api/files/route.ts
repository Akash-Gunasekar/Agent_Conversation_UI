import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL;

        // Fail early if env var is missing
        if (!pythonBackendUrl) {
          console.error('❌ Environment variable PYTHON_BACKEND_URL is missing.');
          return NextResponse.json(
            { error: 'Server configuration error: PYTHON_BACKEND_URL is not set.' },
            { status: 500 }
          );
        }

    const response = await fetch(`${pythonBackendUrl}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Python backend list files error:', errorData);
      return NextResponse.json({ error: 'Failed to get files from backend', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route list files error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
