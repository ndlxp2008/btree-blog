# GCC 编译器安装与配置 (Windows)

GCC (GNU Compiler Collection) 是一个强大的开源编译器套件，支持 C, C++, Objective-C, Fortran, Ada, Go 等多种语言。在 Windows 上使用 GCC 通常需要借助 MinGW (Minimalist GNU for Windows) 或其衍生版本如 MinGW-w64。

本指南介绍如何使用 MinGW-w64 在 Windows 上安装和配置 GCC。

## 1. 什么是 MinGW-w64？

*   **MinGW:** 提供了一套 GNU 工具集（包括 GCC）的原生 Windows 移植，允许开发者在 Windows 上编译生成不依赖第三方 C 运行时库（如 Cygwin 的 `cygwin1.dll`）的本地 Windows 程序。
*   **MinGW-w64:** MinGW 项目的一个分支（现已独立），提供了对 64 位 Windows 的支持，并且更新更活跃，支持更新的 Windows API 和 GCC 版本。**推荐使用 MinGW-w64。**

## 2. 下载 MinGW-w64

有多种方式获取 MinGW-w64，推荐使用以下两种：

### 方法一：通过 MSYS2 (推荐)

MSYS2 是一个独立的软件分发和构建平台，用于 Windows，提供了类 Unix 的 Shell 环境 (Bash) 和包管理器 Pacman (来自 Arch Linux)。通过 MSYS2 安装 MinGW-w64 非常方便且易于管理和更新。

1.  **下载 MSYS2 安装程序:** 访问 [MSYS2 官方网站](https://www.msys2.org/)，下载最新的 x86_64 安装程序 (`msys2-x86_64-*.exe`)。
2.  **安装 MSYS2:** 运行安装程序，按照默认设置安装即可 (建议安装在 C 盘根目录，如 `C:\msys64`)。
3.  **运行 MSYS2 MSYS Shell:** 安装完成后，从开始菜单找到并运行 "MSYS2 MSYS"。
4.  **更新核心包:** 在打开的 MSYS2 窗口中，运行以下命令更新核心包。根据提示，可能需要关闭窗口再重新打开，然后再次运行命令，直到提示没有更新为止。
    ```bash
    pacman -Syu
    ```
5.  **更新其余包:** 再次运行更新命令。
    ```bash
    pacman -Su
    ```
6.  **安装 MinGW-w64 GCC 工具链:** MSYS2 提供了不同的 MinGW-w64 环境。对于 64 位 Windows 开发，我们需要 `mingw-w64-x86_64` 工具链。
    ```bash
    # 安装 64 位 GCC 工具链 (包括 C, C++ 编译器, gdb 调试器等)
    pacman -S --needed base-devel mingw-w64-x86_64-toolchain
    ```
    *(如果需要 32 位工具链，则安装 `mingw-w64-i686-toolchain`)*
7.  **验证安装:** 关闭 MSYS2 窗口。从开始菜单找到并运行 "MSYS2 MinGW 64-bit" (注意不是之前的 "MSYS2 MSYS")。在这个新的 Shell 中输入：
    ```bash
    gcc --version
    g++ --version
    gdb --version
    ```
    如果能正确显示版本号，说明 GCC 工具链安装成功。

### 方法二：直接下载 MinGW-w64 构建版本

如果你不想安装 MSYS2，可以从 MinGW-w64 的官方网站或合作项目中下载预编译好的工具链压缩包。

1.  **访问下载页面:** 前往 [MinGW-w64 下载页面](https://www.mingw-w64.org/downloads/)，找到 "Mingw-builds" 或 "WinLibs" 等项目链接。
    *   **WinLibs (推荐):** 访问 [WinLibs 网站](https://winlibs.com/)。下载包含 GCC + LLVM/Clang + MinGW-w64 (UCRT) 的 **without LLVM/Clang/LLD/LLDB** 的 **Win64** 版本压缩包 (通常是 `.zip` 文件)。选择最新的稳定版 GCC，带有 POSIX threads 和 UCRT runtime 的版本通常兼容性较好。
2.  **解压文件:** 将下载的压缩包解压到一个你选择的目录，例如 `C:\mingw64`。确保路径中没有中文或空格。
3.  **配置环境变量:** 这是关键步骤，需要将 MinGW-w64 的 `bin` 目录添加到系统的 `PATH` 环境变量中。
    *   右键点击 "此电脑" (This PC) -> "属性" (Properties)。
    *   点击 "高级系统设置" (Advanced system settings)。
    *   点击 "环境变量" (Environment Variables) 按钮。
    *   在 "系统变量" (System variables) 或 "用户变量" (User variables for [Your Username]) 区域找到 `Path` 变量，选中并点击 "编辑" (Edit)。
    *   点击 "新建" (New)，然后添加你解压的 MinGW-w64 目录下的 `bin` 文件夹的完整路径，例如 `C:\mingw64\bin`。
    *   点击 "确定" 保存所有更改。
4.  **验证安装:** 打开**新的**命令提示符 (cmd) 或 PowerShell 窗口（注意：需要新窗口才能加载更新后的环境变量），输入以下命令：
    ```bash
    gcc --version
    g++ --version
    ```
    如果能正确显示版本号，说明安装和配置成功。

## 3. 使用 GCC

配置好环境变量后，你就可以在任何命令行窗口中使用 GCC 命令了。

*   **编译 C 文件:**
    ```bash
    # 将 hello.c 编译成可执行文件 hello.exe
    gcc hello.c -o hello.exe
    # 编译并启用优化和警告
    gcc -Wall -Wextra -O2 hello.c -o hello.exe
    ```
*   **编译 C++ 文件:**
    ```bash
    # 将 hello.cpp 编译成可执行文件 hello.exe
    g++ hello.cpp -o hello.exe
    # 使用 C++17 标准编译
    g++ -std=c++17 hello.cpp -o hello.exe
    ```
*   **链接多个文件:**
    ```bash
    gcc main.c utils.c -o myprogram.exe
    g++ main.cpp utils.cpp -o myprogram.exe
    ```
*   **链接库:**
    ```bash
    # 链接名为 mylib 的静态库 (libmylib.a) 或动态库 (libmylib.dll.a / mylib.dll)
    gcc main.c -L/path/to/lib -lmylib -o myprogram.exe
    ```
    *   `-L`: 指定库文件所在的目录。
    *   `-l`: 指定要链接的库名 (去掉 `lib` 前缀和 `.a` 或 `.dll.a` 后缀)。

现在你可以在 Windows 上使用 GCC 来编译 C/C++ 程序了。
