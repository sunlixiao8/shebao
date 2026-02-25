import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 })
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请选择Excel文件(.xlsx或.xls)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    let citiesUpdated = 0
    let salariesUpdated = 0

    if (workbook.SheetNames.includes('cities')) {
      const citiesSheet = workbook.Sheets['cities']
      const citiesData = XLSX.utils.sheet_to_json(citiesSheet, { header: 1 })

      if (citiesData.length > 1) {
        const citiesToInsert = []

        for (let i = 1; i < citiesData.length; i++) {
          const row = citiesData[i] as any[]
          if (row && row[0]) {
            citiesToInsert.push({
              city_name: String(row[0]),
              year: String(row[1]),
              base_min: parseInt(String(row[2])),
              base_max: parseInt(String(row[3])),
              rate: parseFloat(String(row[4]))
            })
          }
        }

        if (citiesToInsert.length > 0) {
          console.log('准备上传城市数据:', citiesToInsert)

          try {
            // 直接尝试批量 upsert，让数据库返回真实错误
            const { error: upsertError, data } = await supabaseAdmin
              .from('cities')
              .upsert(citiesToInsert, {
                onConflict: 'city_name,year',
                ignoreDuplicates: false
              })

            if (upsertError) {
              console.error('上传城市数据失败:', upsertError)
              return NextResponse.json({
                error: '城市数据上传失败',
                details: upsertError.message,
                code: upsertError.code,
                hint: upsertError.code === '42P01' ? '请确认cities表已创建' :
                      upsertError.code === '42501' ? '请检查数据库访问权限' :
                      ''
              }, { status: 500 })
            }

            console.log('城市数据上传成功:', data)
            citiesUpdated = citiesToInsert.length
          } catch (error) {
            console.error('上传城市数据异常:', error)
            return NextResponse.json({
              error: '城市数据上传异常',
              details: error instanceof Error ? error.message : '未知错误',
              hint: '请检查环境变量和数据库配置'
            }, { status: 500 })
          }
        }
      }
    }

    if (workbook.SheetNames.includes('salaries')) {
      const salariesSheet = workbook.Sheets['salaries']
      const salariesData = XLSX.utils.sheet_to_json(salariesSheet, { header: 1 })

      if (salariesData.length > 1) {
        const salariesToInsert = []

        for (let i = 1; i < salariesData.length; i++) {
          const row = salariesData[i] as any[]
          if (row && row[0] && row[2]) {
            salariesToInsert.push({
              employee_id: String(row[0]),
              employee_name: String(row[1]),
              month: String(row[2]),
              salary_amount: parseInt(String(row[3])),
              city_name: String(row[4]),
              year: String(row[2]).substring(0, 4)
            })
          }
        }

        if (salariesToInsert.length > 0) {
          try {
            const { error, data } = await supabaseAdmin
              .from('salaries')
              .upsert(salariesToInsert, {
                onConflict: 'employee_id,month',
                ignoreDuplicates: false
              })

            if (error) {
              console.error('上传工资数据失败:', error)
              return NextResponse.json({
                error: '工资数据上传失败',
                details: error.message,
                code: error.code,
                hint: error.code === '42P01' ? '请确认salaries表已创建' :
                      error.code === '42501' ? '请检查数据库访问权限' :
                      ''
              }, { status: 500 })
            }

            console.log('工资数据上传成功:', data)
            salariesUpdated = salariesToInsert.length
          } catch (error) {
            console.error('上传工资数据异常:', error)
            return NextResponse.json({
              error: '工资数据上传异常',
              details: error instanceof Error ? error.message : '未知错误',
              hint: '请检查环境变量和数据库配置'
            }, { status: 500 })
          }
        }
      }
    }

    return NextResponse.json({
      message: '数据上传成功',
      stats: {
        citiesUpdated,
        salariesUpdated
      }
    })

  } catch (error) {
    console.error('上传处理错误:', error)
    console.error('错误栈:', error instanceof Error ? error.stack : '无栈信息')
    return NextResponse.json({
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误',
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 })
  }
}
