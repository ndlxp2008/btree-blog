# CMake 使用基础指南

CMake 是一个开源、跨平台的构建系统生成工具。它本身不直接编译代码，而是根据名为 `CMakeLists.txt` 的配置文件，生成特定于平台的构建文件 (例如 Makefile 或 Visual Studio 项目文件)，然后由本地的构建工具 (如 Make, Ninja, MSBuild) 使用这些文件来编译和链接项目。

使用 CMake 的主要优点是：

*   **跨平台:** 一份 `CMakeLists.txt` 文件可以在 Windows, macOS, Linux 等不同平台上生成相应的构建系统。
*   **编译器无关:** 可以轻松切换不同的编译器 (GCC, Clang, MSVC 等)。
*   **自动查找依赖:** 可以自动查找所需的库和头文件。
*   **支持复杂项目:** 易于管理包含多个子目录、库和可执行文件的复杂项目。
*   **广泛支持:** 被许多 C/C++ 项目和 IDE (包括 VS Code, Visual Studio, CLion) 广泛支持。

## 1. 安装 CMake

*   **Windows:**
    *   访问 [CMake 官方下载页面](https://cmake.org/download/)。
    *   下载最新的 Windows 安装程序 (例如 `cmake-*-windows-x86_64.msi`)。
    *   运行安装程序。**重要:** 在安装选项中，确保选择 **"Add CMake to the system PATH for all users"** 或 "Add CMake to the system PATH for the current user"，以便在命令行中直接使用 `cmake` 命令。
    *   安装完成后，打开**新的**命令行窗口，输入 `cmake --version` 验证安装。
*   **macOS:**
    *   **Homebrew (推荐):** `brew install cmake`
    *   **官方下载:** 从官网下载 macOS 安装包 (`.dmg`)。
*   **Linux (Debian/Ubuntu):**
    *   `sudo apt update && sudo apt install cmake`
*   **Linux (Fedora):**
    *   `sudo dnf install cmake`

## 2. `CMakeLists.txt` 基础语法

`CMakeLists.txt` 是 CMake 的核心配置文件，使用 CMake 自有的脚本语言编写。一个简单的 C++ 项目的 `CMakeLists.txt` 可能如下所示：

```cmake
# CMake 最低版本要求 (必需)
cmake_minimum_required(VERSION 3.10)

# 项目名称和版本 (必需)
project(MyAwesomeProject VERSION 1.0 LANGUAGES CXX)

# 设置 C++ 标准 (可选，推荐)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 添加可执行文件
# add_executable(<可执行文件名> <源文件1> <源文件2> ...)
add_executable(my_app main.cpp utils.cpp)

# 如果有头文件在子目录 (例如 include/)
# include_directories(include)

# 如果需要链接其他库 (假设有一个名为 my_lib 的库)
# add_library(my_lib utils.cpp utils.h)
# target_link_libraries(my_app PRIVATE my_lib)
```

**常用命令解释:**

*   `cmake_minimum_required(VERSION x.y)`: 指定项目所需的最低 CMake 版本。
*   `project(<项目名称> [VERSION x.y] [LANGUAGES CXX C])`: 定义项目名称、可选版本和使用的语言 (CXX 表示 C++, C 表示 C)。
*   `set(<变量名> <值>)`: 设置 CMake 变量。例如 `CMAKE_CXX_STANDARD` 用于指定 C++ 标准。
*   `add_executable(<名称> <源文件列表>)`: 定义一个可执行文件目标，指定其名称和所需的源文件。
*   `add_library(<名称> [STATIC | SHARED | MODULE] <源文件列表>)`: 定义一个库目标 (默认为静态库 STATIC)。
*   `target_link_libraries(<目标> [PRIVATE | PUBLIC | INTERFACE] <库列表>)`: 指定一个目标 (可执行文件或库) 需要链接哪些库。
    *   `PRIVATE`: 仅链接到当前目标。
    *   `PUBLIC`: 链接到当前目标，并且依赖当前目标的也会链接这个库。
    *   `INTERFACE`: 不链接到当前目标，但依赖当前目标的会链接这个库 (用于头文件库)。
*   `include_directories(<目录列表>)`: 添加头文件搜索路径。
*   `find_package(<库名> [VERSION x.y] [REQUIRED] [COMPONENTS <组件列表>])`: 查找已安装的第三方库 (例如 `find_package(Boost REQUIRED COMPONENTS filesystem system)`)。
*   `message(STATUS "一些消息")`: 打印状态信息。

## 3. 使用 CMake 构建项目 (命令行)

通常使用 **out-of-source** 构建，即将构建生成的文件放在项目源代码目录之外的一个单独目录中 (例如 `build`)，以保持源代码目录的清洁。

假设你的项目结构如下：
```
MyAwesomeProject/
├── CMakeLists.txt
├── main.cpp
└── utils.cpp
```

构建步骤：

1.  **创建构建目录:** 在项目根目录下 (与 `CMakeLists.txt` 同级) 创建一个 `build` 目录并进入该目录。
    ```bash
    cd MyAwesomeProject
    mkdir build
    cd build
    ```
2.  **配置项目 (运行 CMake):** 在 `build` 目录中运行 `cmake ..` ( `..` 表示 `CMakeLists.txt` 在上一级目录)。CMake 会检测你的系统和编译器，并生成构建文件。
    ```bash
    # 在 build 目录下运行
    cmake ..
    ```
    *   **指定生成器 (Generator):** CMake 默认会选择一个生成器。你可以使用 `-G` 参数显式指定。
        *   **MinGW/MSYS2 (推荐):** `cmake -G "MinGW Makefiles" ..` (配合 `mingw32-make` 使用)
        *   **Ninja (推荐，速度快):** `cmake -G "Ninja" ..` (需要先安装 Ninja: `pacman -S ninja` 或 `brew install ninja` 或 `sudo apt install ninja-build`)
        *   **Visual Studio:** `cmake -G "Visual Studio 17 2022" ..` (会自动检测已安装的 VS 版本)
    *   **指定工具链 (Toolchain):** 如果你有多个编译器或需要交叉编译，可以使用 `-DCMAKE_TOOLCHAIN_FILE=<文件路径>` 指定工具链文件。
    *   **指定构建类型:** `cmake -DCMAKE_BUILD_TYPE=Debug ..` 或 `cmake -DCMAKE_BUILD_TYPE=Release ..`。常用类型有 `Debug`, `Release`, `RelWithDebInfo`, `MinSizeRel`。
3.  **构建项目 (运行构建工具):** 在 `build` 目录中运行构建命令。
    *   如果生成的是 **Makefiles** (`MinGW Makefiles`, `Unix Makefiles`):
        ```bash
        # Windows (MinGW)
        mingw32-make
        # Linux/macOS
        make
        ```
    *   如果生成的是 **Ninja** 文件:
        ```bash
        ninja
        ```
    *   如果生成的是 **Visual Studio** 项目 (`.sln`):
        ```bash
        # 使用 MSBuild 构建 Debug 版本
        cmake --build . --config Debug
        # 使用 MSBuild 构建 Release 版本
        cmake --build . --config Release
        # 或者直接用 Visual Studio 打开 build 目录下的 .sln 文件构建
        ```
    *   **通用构建命令 (推荐):** CMake 提供了通用的构建命令，可以自动调用合适的本地构建工具。
        ```bash
        # 构建默认类型 (通常是 Debug 或 Release，取决于 CMake 配置)
        cmake --build .
        # 构建指定类型 (对于单配置生成器如 Makefiles/Ninja，需在配置阶段用 CMAKE_BUILD_TYPE 指定)
        # 对于多配置生成器如 Visual Studio，可以在构建阶段指定
        cmake --build . --config Release
        ```

构建成功后，生成的可执行文件或库文件通常会出现在 `build` 目录下 (或 `build/Debug`, `build/Release` 等子目录，取决于生成器和配置)。

## 4. 结合 VS Code 使用 CMake

VS Code 的 **CMake Tools** 扩展极大地简化了 CMake 项目的开发流程。

1.  **安装扩展:** 在 VS Code 扩展市场搜索并安装 "CMake Tools" (由 Microsoft 发布)。
2.  **打开项目:** 使用 VS Code 打开包含 `CMakeLists.txt` 的项目根目录。
3.  **配置 CMake Tools:**
    *   扩展通常会自动检测到 `CMakeLists.txt` 并提示你进行配置。
    *   **选择 Kit (工具包):** 按 `Ctrl+Shift+P`，输入 `CMake: Select a Kit`。CMake Tools 会扫描你的系统查找可用的编译器工具链 (Kits)，例如它应该能找到你安装的 MinGW-w64 GCC/G++。选择合适的 Kit。
    *   **选择构建变体 (Variant):** 按 `Ctrl+Shift+P`，输入 `CMake: Select Variant`。选择构建类型，如 `Debug` 或 `Release`。
    *   **配置 (Configure):** 按 `Ctrl+Shift+P`，输入 `CMake: Configure`，或者点击 VS Code 底部状态栏的 "CMake: ..." 部分中的配置按钮。CMake Tools 会在后台运行 CMake (通常在 `build` 子目录中)。
4.  **构建 (Build):**
    *   按 `Ctrl+Shift+P`，输入 `CMake: Build`，或者按 `F7` (默认快捷键)，或者点击状态栏的 "Build" 按钮。
    *   CMake Tools 会调用底层的构建工具 (Make, Ninja 等) 来编译项目。
5.  **运行和调试:**
    *   CMake Tools 会自动检测 `CMakeLists.txt` 中定义的 `add_executable` 目标。
    *   点击状态栏上的 "Debug" 或 "Run" 按钮旁边的目标选择器，选择你要运行或调试的可执行文件。
    *   点击 "Debug" (F5) 或 "Run" (Ctrl+F5) 按钮。
    *   调试配置 (`launch.json`) 通常由 CMake Tools 自动生成或管理，无需手动创建。

使用 CMake Tools 扩展，你可以在 VS Code 界面内完成 CMake 项目的配置、构建、运行和调试，无需频繁切换到命令行。

CMake 是一个功能非常丰富的工具，本指南仅涵盖了基础用法。对于更复杂的需求，如安装规则、测试、打包、交叉编译等，请查阅 [CMake 官方文档](https://cmake.org/documentation/)。
