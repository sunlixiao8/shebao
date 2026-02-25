'use client'

import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">社</span>
                </div>
                <span className="font-bold text-xl text-gray-800">五险一金计算器</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/upload"
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                数据上传
              </Link>
              <Link
                href="/results"
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                结果查询
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} 五险一金计算器 - 基于 Next.js + Supabase 构建
          </div>
        </div>
      </footer>
    </div>
  )
}
