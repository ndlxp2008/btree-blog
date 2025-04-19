# 命令行工具

命令行工具是开发者的核心工作环境，掌握常用的命令行工具可以极大提高工作效率。本文档介绍常见操作系统的命令行工具、常用命令以及高效的使用技巧。

## 目录

- [基础概念](#基础概念)
- [Windows 命令行工具](#windows-命令行工具)
- [Unix/Linux 命令行工具](#unixlinux-命令行工具)
- [macOS 命令行工具](#macos-命令行工具)
- [跨平台命令行工具](#跨平台命令行工具)
- [文件操作常用命令](#文件操作常用命令)
- [系统管理常用命令](#系统管理常用命令)
- [网络相关命令](#网络相关命令)
- [开发工具命令](#开发工具命令)
- [效率提升技巧](#效率提升技巧)
- [脚本编写基础](#脚本编写基础)
- [推荐工具](#推荐工具)

## 基础概念

### 什么是命令行

命令行界面(CLI, Command Line Interface)是一种通过输入文本命令与计算机交互的方式，相对于图形用户界面(GUI)，CLI 通常更加高效、可脚本化，特别适合开发工作。

### 终端与 Shell

- **终端(Terminal)**: 是一个程序，提供文本输入和输出的界面
- **Shell**: 是命令解释器，负责解析用户输入的命令并执行
  - Bash (Bourne Again Shell): Linux/macOS 最常用的 shell
  - Zsh: macOS Catalina+ 的默认 shell，增强版 Bash
  - PowerShell: Windows 的高级命令行 shell
  - CMD: Windows 的传统命令提示符

## Windows 命令行工具

### CMD (命令提示符)

Windows 传统的命令行界面，支持基本的文件操作和系统管理命令。

```cmd
# 打开方式
Win + R，输入 cmd，回车

# 常用命令
dir                 # 列出目录内容
cd <folder>         # 切换目录
mkdir <folder>      # 创建目录
del <file>          # 删除文件
copy <src> <dest>   # 复制文件
move <src> <dest>   # 移动文件
echo %PATH%         # 显示环境变量
ipconfig            # 显示网络配置
```

### PowerShell

Windows 的现代命令行 shell，功能更加强大，支持 .NET 对象和复杂脚本。

```powershell
# 打开方式
Win + X，选择 Windows PowerShell

# 常用命令
Get-ChildItem       # 列出目录内容 (类似 dir)
Set-Location <path> # 切换目录 (类似 cd)
New-Item -Path <p> -ItemType "directory" # 创建目录
Remove-Item <path>  # 删除文件或目录
Copy-Item <src> <dest> # 复制文件
Move-Item <src> <dest> # 移动文件
Get-Process         # 列出进程
Get-Service         # 列出服务
```

### Windows Terminal

微软的新一代终端应用，支持多标签、分割视图，可同时运行 CMD、PowerShell、WSL 等。

```
# 安装方式
从 Microsoft Store 下载安装

# 特性
- 多标签支持
- 自定义主题和配色方案
- GPU 加速渲染
- Unicode 和 UTF-8 字符支持
```

### WSL (Windows Subsystem for Linux)

在 Windows 上运行 Linux 环境，提供原生 Linux 命令行体验。

```bash
# 安装方式 (PowerShell 管理员模式)
wsl --install

# 可用发行版
wsl --list --online

# 安装特定发行版
wsl --install -d Ubuntu-20.04

# 启动
wsl 或 从开始菜单打开已安装的 Linux 发行版
```

## Unix/Linux 命令行工具

### Bash (Bourne Again Shell)

大多数 Linux 发行版的默认 shell。

```bash
# 基本操作
ls                  # 列出文件和目录
cd <directory>      # 切换目录
pwd                 # 显示当前目录
mkdir <directory>   # 创建目录
touch <file>        # 创建空文件
rm <file>           # 删除文件
rm -r <directory>   # 递归删除目录
cp <src> <dest>     # 复制文件
mv <src> <dest>     # 移动文件或重命名
cat <file>          # 查看文件内容
less <file>         # 分页查看文件内容
grep <pattern> <file> # 搜索文件内容
```

### 常用的 Linux 终端

- **GNOME Terminal**: GNOME 桌面环境默认终端
- **Konsole**: KDE 桌面环境默认终端
- **xterm**: X Window System 的标准终端模拟器
- **Terminator**: 支持多窗格布局的终端
- **Alacritty**: GPU 加速的终端模拟器

## macOS 命令行工具

### Terminal.app

macOS 自带的终端应用。

```bash
# 打开方式
Finder > 应用程序 > 实用工具 > 终端
或 Command + Space，输入"Terminal"

# 自带shell
macOS Catalina 之前: Bash
macOS Catalina 及之后: Zsh
```

### iTerm2

功能强大的第三方终端应用，是 Terminal.app 的替代品。

```
# 安装方式
从 https://iterm2.com/ 下载安装
或使用 Homebrew: brew install --cask iterm2

# 特性
- 分割窗格
- 搜索功能
- 自动补全
- 触发器和配置文件
- Hotkey Window (随时可访问的终端窗口)
```

### Zsh 与 Oh-My-Zsh

```bash
# Zsh 配置框架 Oh-My-Zsh 安装
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 常用插件
plugins=(git docker kubectl python vscode)

# 主题设置
ZSH_THEME="robbyrussell"  # 默认主题
ZSH_THEME="agnoster"      # 信息丰富的主题
```

## 跨平台命令行工具

### Git Bash

在 Windows 上提供 Git 命令和基本的 Bash 命令。

```bash
# 安装方式
作为 Git for Windows 的一部分安装

# 常用于
- Git 版本控制操作
- 基本的文件操作 (类似 Linux)
```

### Cmder

Windows 上的便携式命令行工具，基于 ConEmu 开发。

```
# 特性
- 支持多标签
- 基于 Git for Windows 提供完整 Unix 工具集
- 自定义别名和配置
- 便携式设计
```

## 文件操作常用命令

### 导航与查看

```bash
# Linux/macOS (Bash/Zsh)
cd              # 返回主目录
cd ..           # 返回上层目录
cd -            # 返回上一次的目录
ls -la          # 显示所有文件详细信息
ls -lh          # 以人类可读方式显示文件大小
find . -name "*.txt" # 查找当前目录下所有 txt 文件

# Windows (CMD)
cd              # 显示当前目录
cd ..           # 返回上层目录
cd \            # 返回驱动器根目录
dir /a          # 显示所有文件
dir /s *.txt    # 查找当前目录及子目录中所有 txt 文件
```

### 文件操作

```bash
# Linux/macOS (Bash/Zsh)
touch file.txt            # 创建空文件
cp -r folder1 folder2     # 递归复制目录
mv file1.txt file2.txt    # 重命名文件
ln -s target linkname     # 创建符号链接
chmod 755 file            # 更改文件权限
chown user:group file     # 更改文件所有者

# Windows (CMD)
copy con file.txt         # 创建文件(Ctrl+Z结束)
xcopy /E /I folder1 folder2 # 递归复制目录
ren file1.txt file2.txt   # 重命名文件
mklink /D linkname target # 创建目录符号链接
attrib +r file.txt        # 设置只读属性
```

### 文件内容操作

```bash
# Linux/macOS (Bash/Zsh)
cat file.txt              # 查看整个文件内容
head -n 10 file.txt       # 查看前10行
tail -n 10 file.txt       # 查看后10行
tail -f log.txt           # 实时查看文件更新
grep "pattern" file.txt   # 搜索文件内容
sed 's/old/new/g' file.txt # 替换文本
awk '{print $1}' file.txt # 提取第一列数据

# Windows (CMD)
type file.txt             # 查看文件内容
findstr "pattern" file.txt # 搜索文件内容
more file.txt             # 分页查看文件内容
```

### 压缩与解压

```bash
# Linux/macOS (Bash/Zsh)
tar -czvf archive.tar.gz folder/  # 创建 gzip 压缩归档
tar -xzvf archive.tar.gz          # 解压 gzip 归档
zip -r archive.zip folder/        # 创建 zip 压缩文件
unzip archive.zip                 # 解压 zip 文件

# Windows (CMD)
compact /c file.txt               # 压缩文件
compact /u file.txt               # 解压文件
# PowerShell
Compress-Archive -Path folder -DestinationPath archive.zip
Expand-Archive -Path archive.zip -DestinationPath folder
```

## 系统管理常用命令

### 进程管理

```bash
# Linux/macOS (Bash/Zsh)
ps aux                   # 显示所有进程
ps aux | grep "process"  # 查找特定进程
kill <pid>               # 终止进程
kill -9 <pid>            # 强制终止进程
top                      # 动态显示进程状态
htop                     # 增强版进程查看器

# Windows (CMD/PowerShell)
tasklist                 # 显示所有进程
tasklist | findstr "process" # 查找特定进程
taskkill /PID <pid>      # 终止进程
taskkill /F /PID <pid>   # 强制终止进程
taskmgr                  # 打开任务管理器
```

### 系统信息

```bash
# Linux (Bash)
uname -a                 # 显示系统信息
cat /etc/os-release      # 显示系统版本
lsb_release -a           # 显示发行版信息
free -h                  # 显示内存使用情况
df -h                    # 显示磁盘使用情况
du -sh <folder>          # 显示目录大小

# macOS (Bash/Zsh)
sw_vers                  # 显示 macOS 版本
system_profiler SPSoftwareDataType # 显示软件信息
top -l 1 | head -n 10    # 显示系统负载
df -h                    # 显示磁盘使用情况
du -sh <folder>          # 显示目录大小

# Windows (CMD/PowerShell)
systeminfo               # 显示详细系统信息
ver                      # 显示系统版本
wmic os get version      # 获取 OS 版本
wmic logicaldisk get size,freespace,caption # 显示磁盘信息
```

### 用户与权限管理

```bash
# Linux/macOS (Bash/Zsh)
whoami                   # 显示当前用户
id                       # 显示用户 ID 信息
sudo <command>           # 以管理员权限运行命令
su - <user>              # 切换用户
useradd <username>       # 添加用户 (Linux)
passwd <username>        # 修改用户密码

# Windows (CMD/PowerShell 管理员模式)
whoami                   # 显示当前用户
net user                 # 显示所有用户
net user <username> *    # 修改用户密码
runas /user:Administrator "<command>" # 以管理员权限运行命令
```

## 网络相关命令

### 网络状态与配置

```bash
# Linux/macOS (Bash/Zsh)
ifconfig                # 显示网络接口信息
ip addr                 # 现代 Linux 显示 IP
netstat -tuln           # 显示所有监听端口
ss -tuln                # 现代替代 netstat
lsof -i :<port>         # 查看占用指定端口的进程

# Windows (CMD/PowerShell)
ipconfig                # 显示网络配置
netstat -ano            # 显示所有连接和监听端口
netstat -ano | findstr :<port> # 查看指定端口
```

### 网络诊断

```bash
# 通用命令
ping <host>             # 测试网络连接
traceroute <host>       # 显示数据包路由 (Linux/macOS)
tracert <host>          # 显示数据包路由 (Windows)
nslookup <domain>       # 查询 DNS 记录
dig <domain>            # 高级 DNS 查询 (Linux/macOS)

# Linux/macOS (Bash/Zsh)
curl -I <url>           # 只获取 HTTP 头信息
wget <url>              # 下载文件

# Windows (PowerShell)
Invoke-WebRequest <url> # 发送 HTTP 请求
```

### 防火墙管理

```bash
# Linux (Ubuntu/Debian)
sudo ufw status         # 查看防火墙状态
sudo ufw allow <port>   # 开放端口
sudo ufw deny <port>    # 关闭端口
sudo ufw enable         # 启用防火墙

# Linux (CentOS/RHEL)
sudo firewall-cmd --list-all # 显示防火墙规则
sudo firewall-cmd --add-port=<port>/tcp --permanent # 开放 TCP 端口
sudo firewall-cmd --reload   # 重载防火墙配置

# Windows (CMD/PowerShell 管理员模式)
netsh advfirewall show allprofiles # 显示防火墙状态
netsh advfirewall firewall add rule name="Open Port" dir=in action=allow protocol=TCP localport=<port> # 开放端口
```

## 开发工具命令

### Git 命令

```bash
# 基础操作
git init                # 初始化仓库
git clone <url>         # 克隆仓库
git add <file>          # 添加文件到暂存区
git commit -m "message" # 提交更改
git status              # 查看仓库状态
git log                 # 查看提交历史

# 分支操作
git branch              # 列出分支
git branch <name>       # 创建分支
git checkout <name>     # 切换分支
git merge <branch>      # 合并分支
git pull                # 拉取并合并远程更改
git push                # 推送本地更改到远程
```

### Docker 命令

```bash
# 基础操作
docker ps               # 列出运行中的容器
docker ps -a            # 列出所有容器
docker images           # 列出所有镜像
docker pull <image>     # 拉取镜像
docker run <image>      # 运行容器
docker stop <container> # 停止容器
docker rm <container>   # 删除容器
docker rmi <image>      # 删除镜像

# 构建与网络
docker build -t <name> . # 构建镜像
docker-compose up       # 启动容器组
docker network ls       # 列出网络
```

### 包管理工具

```bash
# Node.js (npm)
npm init                # 初始化项目
npm install <package>   # 安装包
npm install -g <package> # 全局安装
npm update              # 更新包
npm run <script>        # 运行脚本

# Python (pip)
pip install <package>   # 安装包
pip install -U <package> # 更新包
pip uninstall <package> # 卸载包
pip list                # 列出已安装的包
pip freeze > requirements.txt # 导出依赖列表

# Ruby (gem)
gem install <gem>       # 安装宝石
gem list                # 列出已安装的宝石
gem update <gem>        # 更新宝石
```

## 效率提升技巧

### 命令历史与搜索

```bash
# Bash/Zsh
history                 # 显示命令历史
Ctrl + R               # 反向搜索命令历史
!!                     # 重复上一条命令
!n                     # 执行历史中第n条命令
!string                # 执行最近以string开头的命令

# PowerShell
Get-History            # 显示命令历史
F7                     # 显示命令历史列表
```

### 命令替换与管道

```bash
# Bash/Zsh
echo "Today is $(date)" # 命令替换
ls -la | grep "\.txt$"  # 管道：过滤文本文件
find . -type f | wc -l  # 管道：计算文件数量
cat file.txt | sort | uniq # 管道：排序并去重

# PowerShell
echo "Today is $(Get-Date)"  # 命令替换
Get-ChildItem | Where-Object {$_.Name -like "*.txt"} # 过滤文本文件
```

### 快捷键

```
# Bash/Zsh 常用快捷键
Ctrl + A               # 移动到行首
Ctrl + E               # 移动到行尾
Ctrl + U               # 删除光标前的所有字符
Ctrl + K               # 删除光标后的所有字符
Ctrl + W               # 删除光标前的单词
Ctrl + L               # 清屏
Tab                    # 自动补全命令或文件名

# CMD/PowerShell 常用快捷键
F7                     # 显示命令历史
Alt + F7               # 清除命令历史
Ctrl + →               # 按单词向右移动
Ctrl + ←               # 按单词向左移动
Tab                    # 自动补全命令或文件名
```

### 别名与函数

```bash
# Bash/Zsh 设置别名
alias ll='ls -la'      # 设置临时别名
# 在 ~/.bashrc 或 ~/.zshrc 中添加永久别名:
# alias ll='ls -la'

# Bash/Zsh 定义函数
mkcd() {               # 创建并进入目录
    mkdir -p "$1" && cd "$1"
}
# 在 ~/.bashrc 或 ~/.zshrc 中添加

# PowerShell 设置别名
Set-Alias -Name ll -Value Get-ChildItem
# 在 $PROFILE 中添加永久别名

# PowerShell 定义函数
function mkcd($dir) {  # 创建并进入目录
    mkdir $dir -Force; cd $dir
}
# 在 $PROFILE 中添加
```

## 脚本编写基础

### Bash 脚本基础

```bash
#!/bin/bash
# 第一行是 shebang，指定解释器

# 变量
name="World"
echo "Hello, $name!"

# 条件语句
if [ "$name" = "World" ]; then
    echo "Name is World"
else
    echo "Name is not World"
fi

# 循环
for i in {1..5}; do
    echo "Number: $i"
done

# 函数
greet() {
    echo "Hello, $1!"
}

greet "John"
```

### PowerShell 脚本基础

```powershell
# 变量
$name = "World"
Write-Output "Hello, $name!"

# 条件语句
if ($name -eq "World") {
    Write-Output "Name is World"
}
else {
    Write-Output "Name is not World"
}

# 循环
for ($i = 1; $i -le 5; $i++) {
    Write-Output "Number: $i"
}

# 函数
function Greet($person) {
    Write-Output "Hello, $person!"
}

Greet "John"
```

### 批处理脚本基础 (Windows .bat/.cmd)

```batch
@echo off
REM 这是注释

REM 变量
set name=World
echo Hello, %name%!

REM 条件语句
if "%name%"=="World" (
    echo Name is World
) else (
    echo Name is not World
)

REM 循环
for /L %%i in (1,1,5) do (
    echo Number: %%i
)

REM 函数 (标签)
call :greet John
exit /b

:greet
echo Hello, %1!
goto :eof
```

## 推荐工具

### 增强命令行工具

1. **oh-my-zsh**: Zsh 配置管理框架
2. **tmux/screen**: 终端多路复用器
3. **fzf**: 模糊查找工具
4. **ripgrep (rg)**: 比 grep 更快的搜索工具
5. **bat**: cat 的替代品，支持语法高亮
6. **exa/lsd**: ls 的现代替代品
7. **fd**: find 的简化替代品
8. **htop/glances**: 系统监控工具
9. **jq**: JSON 处理工具
10. **tldr**: 简化版命令帮助

### 终端美化

1. **Powerline**: 状态行美化工具
2. **Color themes**: 如 Solarized, Dracula, Nord
3. **Nerd Fonts**: 包含图标的编程字体
4. **Starship**: 跨 shell 的提示符自定义工具

## 总结

命令行是开发人员的强大工具，掌握命令行可以显著提高工作效率。从基本的文件操作到复杂的系统管理和开发工具，命令行提供了直接而高效的方式来控制计算机。建议从基础命令开始，逐步掌握更多高级功能，并利用别名、函数和脚本来自动化常见任务。