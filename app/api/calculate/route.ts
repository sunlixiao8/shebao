import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST() {
  try {
    const { data: salaries, error: salariesError } = await supabaseAdmin
      .from('salaries')
      .select('*')
      .order('month')

    if (salariesError) {
      console.error('查询工资数据失败:', salariesError)
      return NextResponse.json({ error: '无法获取工资数据' }, { status: 500 })
    }

    if (!salaries || salaries.length === 0) {
      return NextResponse.json({ error: '没有找到工资数据' }, { status: 400 })
    }

    const employees: Record<string, any> = {}
    const uniqueCities = new Set<string>()

    salaries.forEach(salary => {
      const employeeName = salary.employee_name as string
      const month = salary.month as string
      const monthIndex = parseInt(month.substring(4))
      const year = salary.year as string

      if (monthIndex < 1 || monthIndex > 12) return

      if (!employees[employeeName]) {
        employees[employeeName] = {
          employee_id: salary.employee_id,
          employee_name: employeeName,
          city_name: salary.city_name,
          year: year,
          salaries: new Array(12).fill(0)
        }
      }

      if (employees[employeeName].year === year) {
        employees[employeeName].salaries[monthIndex - 1] = salary.salary_amount
      }

      uniqueCities.add(`${salary.city_name}_${year}`)
    })

    const cityKeys = Array.from(uniqueCities)
    const cityPromises = cityKeys.map(async key => {
      const [cityName, year] = key.split('_')
      const { data } = await supabaseAdmin
        .from('cities')
        .select('*')
        .eq('city_name', cityName)
        .eq('year', year)
        .single()
      return { key, data }
    })

    const cityResults = await Promise.all(cityPromises)
    const cityStandards: Record<string, any> = {}

    cityResults.forEach(({ key, data }) => {
      cityStandards[key] = data
    })

    const resultsToUpsert = []

    for (const employeeName in employees) {
      const employee = employees[employeeName]
      const totalSalary = employee.salaries.reduce((sum: number, salary: number) => sum + salary, 0)
      const avgSalary = totalSalary / 12

      const cityKey = `${employee.city_name}_${employee.year}`
      const cityStandard = cityStandards[cityKey]

      if (!cityStandard) {
        console.warn(`未找到城市标准: ${cityKey}`)
        continue
      }

      const { base_min, base_max, rate } = cityStandard
      let contributionBase = avgSalary

      if (avgSalary < base_min) {
        contributionBase = base_min
      } else if (avgSalary > base_max) {
        contributionBase = base_max
      }

      const companyFee = contributionBase * rate

      resultsToUpsert.push({
        employee_id: employee.employee_id,
        employee_name: employee.employee_name,
        city_name: employee.city_name,
        year: employee.year,
        avg_salary: parseFloat(avgSalary.toFixed(2)),
        contribution_base: parseFloat(contributionBase.toFixed(2)),
        company_fee: parseFloat(companyFee.toFixed(2)),
        created_at: new Date().toISOString()
      })
    }

    if (resultsToUpsert.length > 0) {
      const { error } = await supabaseAdmin
        .from('results')
        .upsert(resultsToUpsert, {
          onConflict: 'employee_id,year',
          ignoreDuplicates: false
        })

      if (error) {
        console.error('存储计算结果失败:', error)
        return NextResponse.json({ error: '计算结果存储失败' }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: '计算完成',
      stats: {
        totalEmployees: Object.keys(employees).length,
        calculatedResults: resultsToUpsert.length
      }
    })

  } catch (error) {
    console.error('计算错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
