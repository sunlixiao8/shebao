#!/bin/bash

echo "════════════════ 测试上传API ════════════════"
echo ""

# 检查文件是否存在
if [ ! -f "shebao_data_example.xlsx" ]; then
  echo "错误: shebao_data_example.xlsx 文件不存在"
  exit 1
fi

echo "1. 使用curl发送测试请求..."
echo ""

# 发送curl请求
curl -X POST http://localhost:3000/api/upload \
  -F "file=@shebao_data_example.xlsx" \
  -v 2>&1

echo ""
echo "════════════════ 测试完成 ════════════════"
