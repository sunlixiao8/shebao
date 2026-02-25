import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 确保环境变量存在
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase 环境变量未设置:', {
    url: supabaseUrl ? '已设置' : '未设置',
    key: supabaseKey ? '已设置' : '未设置'
  })
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)
