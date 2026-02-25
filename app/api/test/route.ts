import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    // 测试数据库连接
    console.log('测试Supabase连接...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Key 存在:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // 检查表是否存在
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .limit(1)

    if (error) {
      console.error('数据库查询错误:', error)
      return NextResponse.json({
        error: '数据库查询失败',
        details: error.message,
        hint: error.hint,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: '数据库连接正常'
    })

  } catch (error) {
    console.error('测试错误:', error)
    return NextResponse.json({ error: '测试失败' }, { status: 500 })
  }
}
