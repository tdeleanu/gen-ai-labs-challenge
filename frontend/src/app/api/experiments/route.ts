import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

export async function POST(request: NextRequest) {
  try {
    // Get session ID from request headers
    const sessionId = request.headers.get('X-Session-ID')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()

    // Proxy to backend
    const response = await fetch(`${BACKEND_URL}/api/experiments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Experiment creation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create experiment' },
      { status: 500 }
    )
  }
}
