import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('X-Session-ID')
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '20'

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const response = await fetch(`${backendUrl}/api/experiments/history?limit=${limit}`, {
      headers: {
        'X-Session-ID': sessionId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching experiment history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiment history' },
      { status: 500 }
    )
  }
}
