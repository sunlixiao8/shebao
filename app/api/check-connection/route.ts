import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('=== 数据库连接检查 ===')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置')
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置')
    console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置' : '未设置')

    // 测试连接
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('连接错误:', error)
      return NextResponse.json({
        status: 'error',
        message: '数据库连接失败',
        error: error.message,
        code: error.code,
        hint: '检查Supabase URL和Key是否正确，以及Row Level Security设置'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: '数据库连接正常',
      count: data?.length || 0
    })

  } catch (error) {
    console.error('检查失败:', error)
    return NextResponse.json({
      status: 'error',
      message: '检查过程中发生错误',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
