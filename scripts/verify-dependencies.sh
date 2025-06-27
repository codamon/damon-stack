#!/bin/bash

# 🔍 damon-stack 依赖验证脚本
# 检查所有应用的关键依赖是否正确安装

echo "🚀 开始验证 damon-stack 项目依赖..."
echo "=================================="

# 检查根目录依赖
echo "📦 检查根目录依赖..."
if [ -f "package.json" ]; then
    echo "✅ 根目录 package.json 存在"
else
    echo "❌ 根目录 package.json 不存在"
    exit 1
fi

# 检查 shared 包
echo ""
echo "📦 检查 @damon-stack/shared 包..."
cd packages/shared
if [ -f "package.json" ] && [ -d "dist" ]; then
    echo "✅ shared 包已构建"
else
    echo "⚠️  shared 包需要构建，正在构建..."
    pnpm build
    if [ $? -eq 0 ]; then
        echo "✅ shared 包构建成功"
    else
        echo "❌ shared 包构建失败"
        exit 1
    fi
fi

# 检查 admin-dashboard 应用
echo ""
echo "📦 检查 admin-dashboard 应用..."
cd ../../apps/admin-dashboard
if pnpm list | grep -q "@damon-stack/shared"; then
    echo "✅ admin-dashboard: @damon-stack/shared 已安装"
else
    echo "❌ admin-dashboard: @damon-stack/shared 未安装"
fi

# 检查 website 应用
echo ""
echo "📦 检查 website 应用..."
cd ../website
dependencies_ok=true

# 检查必需依赖
if pnpm list | grep -q "@damon-stack/shared"; then
    echo "✅ website: @damon-stack/shared 已安装"
else
    echo "❌ website: @damon-stack/shared 未安装"
    dependencies_ok=false
fi

if pnpm list | grep -q "@tanstack/react-query"; then
    echo "✅ website: @tanstack/react-query 已安装"
else
    echo "❌ website: @tanstack/react-query 未安装"
    dependencies_ok=false
fi

if pnpm list | grep -q "@tanstack/react-query-devtools"; then
    echo "✅ website: @tanstack/react-query-devtools 已安装"
else
    echo "❌ website: @tanstack/react-query-devtools 未安装"
    dependencies_ok=false
fi

# 检查 blog 应用
echo ""
echo "📦 检查 blog 应用..."
cd ../blog

if pnpm list | grep -q "@damon-stack/shared"; then
    echo "✅ blog: @damon-stack/shared 已安装"
else
    echo "❌ blog: @damon-stack/shared 未安装"
    dependencies_ok=false
fi

if pnpm list | grep -q "@tanstack/react-query"; then
    echo "✅ blog: @tanstack/react-query 已安装"
else
    echo "❌ blog: @tanstack/react-query 未安装"
    dependencies_ok=false
fi

if pnpm list | grep -q "@tanstack/react-query-devtools"; then
    echo "✅ blog: @tanstack/react-query-devtools 已安装"
else
    echo "❌ blog: @tanstack/react-query-devtools 未安装"
    dependencies_ok=false
fi

# 返回根目录
cd ../..

echo ""
echo "=================================="
if [ "$dependencies_ok" = true ]; then
    echo "🎉 所有依赖验证成功！"
    echo ""
    echo "🌐 可以访问以下地址："
    echo "- Admin 后台: http://localhost:3000"
    echo "- Website 主页: http://localhost:3001"
    echo "- Blog 应用: http://localhost:3002"
    echo ""
    echo "📊 跨应用数据共享演示:"
    echo "- http://localhost:3001/blog-demo"
    echo ""
    echo "🧪 UI组件展示:"
    echo "- http://localhost:3001/components-test"
    echo ""
    echo "🚀 启动所有应用: pnpm dev"
    exit 0
else
    echo "❌ 部分依赖验证失败，请检查上述错误信息"
    exit 1
fi 