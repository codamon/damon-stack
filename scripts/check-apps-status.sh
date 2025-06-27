#!/bin/bash

# damon-stack 应用状态检查脚本
# 检查所有三个应用的运行状态

echo "🚀 Damon Stack 应用状态检查"
echo "=================================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_app() {
    local name=$1
    local url=$2
    
    printf "%-20s" "$name:"
    
    # 使用curl检查HTTP状态
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ 运行正常${NC} ($url)"
    elif [ "$status_code" = "000" ]; then
        echo -e "${RED}❌ 连接失败${NC} ($url)"
    else
        echo -e "${YELLOW}⚠️  状态码: $status_code${NC} ($url)"
    fi
}

# 检查所有应用
check_app "Admin Dashboard" "http://localhost:3000"
check_app "Website" "http://localhost:3001"
check_app "Blog" "http://localhost:3002"

echo ""
echo "📊 端口使用情况:"
echo "--------------------------------"
if command -v lsof >/dev/null 2>&1; then
    lsof -i :3000,3001,3002 2>/dev/null | grep LISTEN | while read line; do
        port=$(echo $line | awk '{print $9}' | cut -d: -f2)
        process=$(echo $line | awk '{print $1}')
        echo "端口 $port: $process"
    done
else
    echo "lsof 命令不可用，无法检查端口状态"
fi

echo ""
echo "🔗 快速访问链接:"
echo "--------------------------------"
echo "Admin Dashboard: http://localhost:3000"
echo "Website:         http://localhost:3001"
echo "Blog:            http://localhost:3002"
echo ""
echo "💡 使用以下命令启动应用:"
echo "pnpm dev:all     # 启动所有应用"
echo "pnpm dev:admin   # 只启动管理后台"
echo "pnpm dev:website # 只启动主网站"
echo "pnpm dev:blog    # 只启动博客" 