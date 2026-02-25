# 五险一金计算器项目计划

## 项目概述
构建一个迷你的五险一金计算器Web应用，用于根据员工工资数据和城市社保标准，计算公司应为每位员工缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js 14 (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **Excel处理**: xlsx库

## 数据库设计 (Supabase)

### 1. cities (城市标准表)
存储各城市的社保公积金缴纳标准

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键，自增 |
| city_name | text | 城市名称 (如: "佛山") |
| year | text | 年份 (如: "2024") |
| base_min | int | 社保基数下限 (如: 4546) |
| base_max | int | 社保基数上限 (如: 22941) |
| rate | float | 综合缴纳比例 (如: 0.152，表示15.2%) |

### 2. salaries (员工工资表)
存储员工月度工资数据

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键，自增 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年份月份 (YYYYMM格式，如: "202401") |
| salary_amount | int | 该月工资金额 |
| city_name | text | 城市名称 |
| year | text | 年份 |

### 3. results (计算结果表)
存储五险一金计算结果

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键，自增 |
| employee_name | text | 员工姓名 |
| employee_id | text | 员工工号 |
| city_name | text | 城市名称 |
| year | text | 年份 |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司应缴纳金额 |
| created_at | timestamptz | 计算时间 |

## 核心业务逻辑

### 计算函数流程
1. **数据准备**: 从salaries表读取所有员工工资数据
2. **按员工分组**: 按employee_name分组，计算每位员工的年度月平均工资
   - 筛选自然年度数据（1-12月）
   - 计算公式: 年度月平均工资 = 该员工全年工资总额 / 12
3. **获取城市标准**: 从cities表获取对应城市和年份的基数标准
4. **确定缴费基数**: 根据规则确定最终缴费基数
   - 规则: `avg_salary < base_min ? base_min : (avg_salary > base_max ? base_max : avg_salary)`
5. **计算公司缴纳金额**: company_fee = contribution_base × rate
6. **存储结果**: 将结果存入results表
   - 记录计算时间(created_at)
   - 如果同一员工同一年份已存在记录，则更新

### Excel文件格式
支持上传的Excel文件格式：

**Sheet1: cities (城市标准)**
```
城市名称 | 年份 | 基数下限 | 基数上限 | 缴纳比例
佛山     | 2024 | 4546    | 22941   | 0.152
广州     | 2024 | 5284    | 26421   | 0.155
```

**Sheet2: salaries (员工工资)**
```
员工工号 | 员工姓名 | 年月   | 工资金额 | 城市
001      | 张三     | 202401 | 8000     | 佛山
001      | 张三     | 202402 | 8000     | 佛山
```

## 前端功能设计

### 页面结构

#### 1. 主页 (/) - 导航中枢
**布局**: 两个功能卡片垂直或并排排列

**功能卡片1: 数据上传**
- 标题: "数据上传"
- 说明: "上传城市社保标准和员工工资数据"
- 点击: 导航到 /upload

**功能卡片2: 结果查询**
- 标题: "结果查询"
- 说明: "查看五险一金计算结果"
- 点击: 导航到 /results

#### 2. 上传页 (/upload) - 数据控制中心
**功能模块:**

**模块1: 数据上传**
- 功能: 从本地选择Excel文件上传
- 支持格式: .xlsx
- 处理逻辑:
  - 解析Excel文件，读取cities和salaries两个sheet
  - 数据验证（必填字段、格式检查）
  - 批量插入/覆盖数据到Supabase
  - 显示上传成功/失败信息

**模块2: 执行计算**
- 按钮: "执行计算并存储结果"
- 功能: 触发五险一金计算
- 处理逻辑:
  - 调用后端计算API
  - 执行完整的计算流程
  - 实时显示计算进度
  - 计算完成后显示结果统计

#### 3. 结果页 (/results) - 结果展示
**功能:**
- 页面加载时自动从results表获取所有计算结果
- 按计算时间倒序排列
- 使用Tailwind CSS表格展示数据

**表格字段:**
- 员工工号 (employee_id)
- 员工姓名 (employee_name)
- 城市 (city_name)
- 年份 (year)
- 年度月平均工资 (avg_salary)
- 缴费基数 (contribution_base)
- 公司缴纳金额 (company_fee)
- 计算时间 (created_at)

## 开发任务清单 (TodoList)

### 阶段1: 项目初始化
- [ ] 1.1 创建Next.js项目（App Router模式）
- [ ] 1.2 配置Tailwind CSS
- [ ] 1.3 配置Supabase客户端
- [ ] 1.4 创建项目基础目录结构

### 阶段2: 数据库配置
- [ ] 2.1 创建Supabase项目
- [ ] 2.2 创建cities表及相应字段
- [ ] 2.3 创建salaries表及相应字段
- [ ] 2.4 创建results表及相应字段
- [ ] 2.5 配置RLS（Row Level Security）策略
- [ ] 2.6 准备测试数据Excel文件

### 阶段3: 后端API开发
- [ ] 3.1 创建API路由: POST /api/upload
  - [ ] 接收Excel文件上传
  - [ ] 解析Excel数据（使用xlsx库）
  - [ ] 验证数据格式
  - [ ] 批量插入/覆盖cities表
  - [ ] 批量插入/覆盖salaries表
- [ ] 3.2 创建API路由: POST /api/calculate
  - [ ] 从salaries表读取所有数据
  - [ ] 按员工分组计算年度月平均工资
  - [ ] 从cities表获取城市标准
  - [ ] 确定缴费基数
  - [ ] 计算公司缴纳金额
  - [ ] 存储结果到results表（更新或插入）
- [ ] 3.3 创建API路由: GET /api/results
  - [ ] 从results表查询所有结果
  - [ ] 按created_at倒序排列
  - [ ] 返回JSON数据

### 阶段4: 前端页面开发
- [ ] 4.1 创建布局组件 Layout.js
  - [ ] 导航栏
  - [ ] 页面结构
- [ ] 4.2 开发主页 (page.js)
  - [ ] 创建数据上传卡片
  - [ ] 创建结果查询卡片
  - [ ] 添加样式和动画效果
- [ ] 4.3 开发上传页 (upload/page.js)
  - [ ] 文件上传组件（支持拖拽）
  - [ ] Excel文件选择和验证
  - [ ] 上传进度显示
  - [ ] 计算按钮和进度显示
  - [ ] 操作结果反馈（成功/失败提示）
- [ ] 4.4 开发结果页 (results/page.js)
  - [ ] 页面加载时调用API获取数据
  - [ ] 使用Tailwind CSS创建表格
  - [ ] 表格字段对应数据库字段
  - [ ] 空状态处理（无数据时显示提示）

### 阶段5: 样式优化
- [ ] 5.1 使用Tailwind CSS统一页面风格
- [ ] 5.2 添加响应式设计（移动端适配）
- [ ] 5.3 添加加载状态和动画效果
- [ ] 5.4 优化用户交互体验

### 阶段6: 测试与优化
- [ ] 6.1 测试Excel文件上传功能
- [ ] 6.2 测试计算逻辑准确性
- [ ] 6.3 测试数据覆盖和更新逻辑
- [ ] 6.4 测试前端页面跳转和导航
- [ ] 6.5 优化错误处理和边界情况

### 阶段7: 部署与文档
- [ ] 7.1 配置环境变量（Supabase连接信息）
- [ ] 7.2 部署到Vercel
- [ ] 7.3 编写README文档
- [ ] 7.4 准备示例Excel文件

## 数据流图示
```
Excel文件
   ↓ (上传)
cities表 + salaries表（Supabase）
   ↓ (触发计算)
计算函数（分组、平均、比较、计算）
   ↓ (存储结果)
results表（Supabase）
   ↓ (查询展示)
/results页面（表格展示）
```

## 页面跳转逻辑
```
主页(/)
  ├── 点击"数据上传" → /upload
  └── 点击"结果查询" → /results

/upload
  ├── 上传Excel → 解析并存储到cities/salaries表
  └── 点击"执行计算" → 计算并存储到results表

/results
  └── 自动加载 → 显示results表所有数据
```

## 技术实现细节

### Supabase配置
- 使用@supabase/supabase-js客户端
- 环境变量: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- 开启RLS策略，允许用户读取和写入数据

### Excel处理
- 使用xlsx库解析Excel文件
- 支持.xlsx格式
- 需要处理两个sheet: cities和salaries
- 数据验证和错误处理

### 计算逻辑实现
- 在API路由中实现计算逻辑
- 使用SQL查询或JavaScript进行数据处理
- 注意处理小数精度问题
- 优化批量操作性能

### Tailwind CSS样式
- 使用默认配置
- 创建卡片、按钮、表格等组件样式
- 添加hover效果和过渡动画
- 确保响应式设计

## 项目文件结构
```
shebao/
├── app/
│   ├── layout.js              # 根布局
│   ├── page.js                # 主页
│   ├── upload/
│   │   └── page.js            # 上传页
│   ├── results/
│   │   └── page.js            # 结果页
│   └── api/
│       ├── upload/
│       │   └── route.js       # 上传API
│       ├── calculate/
│       │   └── route.js       # 计算API
│       └── results/
│           └── route.js       # 查询API
├── components/
│   ├── Layout.js              # 布局组件
│   └── ...                    # 其他组件
├── lib/
│   └── supabase.js            # Supabase客户端
├── public/
│   └── ...                    # 静态资源
├── .env.local                 # 环境变量
└── claude.md                  # 项目计划
```

## 注意事项
1. Excel文件必须包含两个sheet: cities和salaries
2. 计算时使用自然年度数据（1-12月）
3. 重复数据会被覆盖，而不是追加
4. 结果页显示最新计算结果，按计算时间倒序
5. 暂时支持多个城市数据，但计算时按实际数据中的城市分别处理
6. 需要处理异常情况：数据缺失、格式错误、计算异常等
