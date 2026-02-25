'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Layout from '@/components/Layout'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ citiesUpdated: number; salariesUpdated: number } | null>(null)
  const [calculateResult, setCalculateResult] = useState<{ totalEmployees: number; calculatedResults: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setSuccess(null)
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('请先选择Excel文件')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '上传失败')
      }

      setUploadResult(data.stats)
      setSuccess(data.message)
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '计算失败')
      }

      setCalculateResult(data.stats)
      setSuccess(data.message)
    } catch (error) {
      setError(error instanceof Error ? error.message : '计算失败')
    } finally {
      setIsCalculating(false)
    }
  }

  const dropzoneActiveClasses = file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'

  return (
    <Layout>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据上传</h1>
          <p className="text-gray-600">上传包含城市社保标准和员工工资数据的Excel文件</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">上传Excel数据</h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${dropzoneActiveClasses} transition-colors cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <div className="text-lg font-medium text-gray-900">
                {file ? file.name : '点击选择Excel文件'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                支持 .xlsx, .xls 格式，文件大小不超过10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isUploading || !file
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  上传中...
                </span>
              ) : (
                '上传数据'
              )}
            </button>
          </div>

          {uploadResult && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">上传结果</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p>城市标准: {uploadResult.citiesUpdated} 条记录已更新</p>
                <p>工资数据: {uploadResult.salariesUpdated} 条记录已更新</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">执行计算</h2>
          <p className="text-gray-600 mb-6">
            点击按钮执行五险一金计算，系统将按城市标准自动计算每位员工的缴费基数和公司应缴纳金额
          </p>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isCalculating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                计算中...
              </span>
            ) : (
              '执行计算并存储结果'
            )}
          </button>

          {calculateResult && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">计算结果</h3>
              <div className="space-y-1 text-sm text-green-800">
                <p>总员工数: {calculateResult.totalEmployees} 人</p>
                <p>计算完成: {calculateResult.calculatedResults} 条记录</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
