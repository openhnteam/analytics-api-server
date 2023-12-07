#!/bin/bash

echo "Bootstrap ..."

# 安装 npm 包
npm install

# 编译
npm run build

# scripty授权
chmod -R +x scripts
