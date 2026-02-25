'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          五险一金计算器
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          根据员工工资数据和城市社保标准，自动计算公司应为每位员工缴纳的五险一金费用
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          href="/upload"
          className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1"></div>
          <div className="p-8">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              数据上传
            </h2>
            <p className="text-gray-600 mb-6">
              上传Excel格式的城市社保标准和员工工资数据，系统将自动解析并存储到数据库中
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              开始上传
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          href="/results"
          className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1"></div>
          <div className="p-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
              结果查询
            </h2>
            <p className="text-gray-600 mb-6">
              查看五险一金计算结果，包括员工缴费基数、公司应缴纳金额等详细信息
            </p>
            <div className="flex items-center text-green-600 font-medium">
              查看结果
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">准备数据</h4>
                <p className="text-sm text-gray-600">准备包含城市标准和员工工资的Excel文件</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">上传数据</h4>
                <p className="text-sm text-gray-600">在数据上传页面导入Excel并验证数据</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">查看结果</h4>
                <p className="text-sm text-gray-600">执行计算后查看五险一金缴纳明细</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
