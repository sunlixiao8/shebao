# 推送到 GitHub 操作指南

## 方法1：使用 GitHub CLI (推荐)

### 步骤1：安装 GitHub CLI
```bash
# macOS
brew install gh

# Windows
scoop install gh
# 或从 https://cli.github.com/ 下载安装

# 验证安装
gh --version
```

### 步骤2：登录 GitHub
```bash
gh auth login
```
按照提示选择：
- GitHub.com
- HTTPS
- 使用网页浏览器登录（或 Token）

### 步骤3：创建并推送仓库
```bash
# 在 shebao 目录下执行
gh repo create shebao --public --source=. --remote=origin --push
```

这会自动：
- 在 GitHub 创建仓库
- 添加远程地址
- 推送代码

## 方法2：使用 GitHub 网页 + Git 命令

### 步骤1：在 GitHub 创建仓库
1. 访问 https://github.com/new
2. 填写信息：
   - Repository name: `shebao`
   - Description: `五险一金计算器 - Next.js + Supabase`
   - Public/Private: 选择 Public
   - 不要勾选 "Initialize with README"（因为本地已有）
3. 点击 "Create repository"

### 步骤2：推送代码
创建仓库后，GitHub 会显示推送命令，选择 "push an existing repository"：

```bash
git remote add origin https://github.com/YOUR_USERNAME/shebao.git
git branch -M master
git push -u origin master
```

## 方法3：使用 VS Code

1. 在 VS Code 中打开 shebao 项目
2. 点击左侧源代码管理图标（分支图标）
3. 点击 "Publish to GitHub"
4. 按照提示操作

## 验证推送成功

推送完成后，访问：
```
https://github.com/YOUR_USERNAME/shebao
```

应该能看到你的代码文件。

## 重要提醒

⚠️ **不要上传敏感文件**

确保 `.gitignore` 文件中包含：
```
.env.local
.env
.next/
node_modules/
*.log
```

如果已经上传了敏感文件：
1. 立即在 GitHub Settings 中删除仓库
2. 重新创建并推送
3. 更换 Supabase API 密钥

## 后续工作流

日常开发：
```bash
git add .
git commit -m "描述你的更改"
git push origin master
```
