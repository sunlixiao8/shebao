import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data: results, error, count } = await supabaseAdmin
      .from('results')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(start, end)

    if (error) {
      console.error('查询结果失败:', error)
      return NextResponse.json({ error: '无法获取结果数据' }, { status: 500 })
    }

    const { data: summary, error: summaryError } = await supabaseAdmin
      .rpc('calculate_summary')

    if (summaryError) {
      console.error('查询统计信息失败:', summaryError)
    }

    const totalPages = count ? Math.ceil(count / limit) : 1

    return NextResponse.json({
      results: results || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count || 0,
        limit
      },
      summary: summary?.[0] || null
    })

  } catch (error) {
    console.error('查询结果错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
