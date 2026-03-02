import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zmbesriyuyotqmgfonzx.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || ''
const PINECONE_KEY = process.env.PINECONE_API_KEY || ''
const PINECONE_HOST = process.env.PINECONE_HOST || 'occ-props-n506n90.svc.aped-4627-b74a.pinecone.io'
const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  })
  
  const data = await response.json()
  return data.data[0].embedding
}

async function searchPinecone(embedding: number[], topK: number = 10) {
  const response = await fetch(`https://${PINECONE_HOST}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vector: embedding,
      topK,
      includeMetadata: true,
    }),
  })
  
  const data = await response.json()
  return data.matches || []
}

async function getPropsFromSupabase(dayNumbers: number[]) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/props?day_number=in.(${dayNumbers.join(',')})`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
      },
    }
  )
  
  return response.json()
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }
  
  try {
    // Get embedding for query
    const embedding = await getEmbedding(query)
    
    // Search Pinecone - get more results to filter
    const matches = await searchPinecone(embedding, 20)
    
    // Filter by minimum relevance score (0.35 threshold for semantic search)
    const MIN_SCORE = 0.35
    const relevantMatches = matches.filter((m: any) => m.score >= MIN_SCORE)
    
    // If no highly relevant matches, show top 3-5 with lower threshold
    const FALLBACK_SCORE = 0.25
    const finalMatches = relevantMatches.length > 0 
      ? relevantMatches.slice(0, 10)  // Max 10 relevant results
      : matches.filter((m: any) => m.score >= FALLBACK_SCORE).slice(0, 5)
    
    // Get day numbers from matches
    const dayNumbers = finalMatches.map((m: any) => m.metadata.day_number)
    const scores = Object.fromEntries(finalMatches.map((m: any) => [m.metadata.day_number, m.score]))
    
    if (dayNumbers.length === 0) {
      return NextResponse.json({ props: [], message: 'No relevant props found for your search.' })
    }
    
    // Fetch full prop data from Supabase
    const props = await getPropsFromSupabase(dayNumbers)
    
    // Sort by match order and add scores
    const sortedProps = dayNumbers.map((dayNum: number) => {
      const prop = props.find((p: any) => p.day_number === dayNum)
      if (prop) {
        return { ...prop, relevance_score: scores[dayNum] }
      }
      return null
    }).filter(Boolean)
    
    return NextResponse.json({ 
      props: sortedProps,
      total_matches: matches.length,
      filtered_count: finalMatches.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
