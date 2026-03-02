import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zmbesriyuyotqmgfonzx.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || ''

export async function GET() {
  try {
    // Get all props to extract topics
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/props?select=topics`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
        },
      }
    )
    
    const props = await response.json()
    
    // Count topics
    const topicCounts: Record<string, number> = {}
    const propArray = Array.isArray(props) ? props : []
    propArray.forEach((prop: { topics: string[] }) => {
      prop.topics?.forEach((topic: string) => {
        const normalizedTopic = topic.toLowerCase()
        topicCounts[normalizedTopic] = (topicCounts[normalizedTopic] || 0) + 1
      })
    })
    
    // Sort by count descending
    const sortedTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
    
    return NextResponse.json({ topics: sortedTopics })
  } catch (error) {
    console.error('Topics error:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}
