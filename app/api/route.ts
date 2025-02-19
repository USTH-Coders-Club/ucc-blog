import { NextResponse } from 'next/server'
import { fetchBySlug, fetchPagesBlocks, searchPages, fetchPaginatedPages } from '@/lib/notion'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'listSlugs':
        const slugs = await fetchSlugsOnly()
        return NextResponse.json(slugs)
        
      case 'list':
        const pageNumber = Number(searchParams.get('page')) || 1;
        const pageSize = Number(searchParams.get('pageSize')) || 5;
        const category = searchParams.get('category') || 'All';
        const paginatedPages = await fetchPaginatedPages(pageNumber, pageSize, category);
        return NextResponse.json(paginatedPages);
      
      case 'search':
        const query = searchParams.get('q')
        if (!query) return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
        const results = await searchPages(query)
        return NextResponse.json(results)
      
      case 'getBySlug':
        const slug = searchParams.get('slug')
        if (!slug) return NextResponse.json({ error: 'Slug parameter required' }, { status: 400 })
        const pageData = await fetchBySlug(slug)
        return NextResponse.json(pageData || { error: 'Page not found' })
      
      case 'getBlocks':
        const pageId = searchParams.get('pageId')
        if (!pageId) return NextResponse.json({ error: 'PageId parameter required' }, { status: 400 })
        const blocks = await fetchPagesBlocks(pageId)
        return NextResponse.json(blocks)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
