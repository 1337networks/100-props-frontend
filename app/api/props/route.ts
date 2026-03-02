import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zmbesriyuyotqmgfonzx.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || ''

export async function GET() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/props?order=day_number.asc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
        },
      }
    )
    
    const props = await response.json()
    return NextResponse.json({ props })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch props' }, { status: 500 })
  }
}
