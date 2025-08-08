import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pythonBackendUrl = 'http://10.10.10.151:5000'

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
