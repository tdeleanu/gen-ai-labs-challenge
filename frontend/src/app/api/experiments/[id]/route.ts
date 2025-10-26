import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = request.headers.get('X-Session-ID')
  const { id } = await params

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'
    const response = await fetch(`${backendUrl}/api/experiments/${id}`, {
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
    console.error('Error fetching experiment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experiment' },
      { status: 500 }
    )
  }
}
