# IntelliJ IDEA 技巧

IntelliJ IDEA 是由 JetBrains 开发的一款功能强大的 Java 集成开发环境，同时也支持其他多种编程语言。本文档介绍使用 IntelliJ IDEA 的核心技巧和最佳实践，帮助开发者提高工作效率。

## 目录

- [基础设置](#基础设置)
- [界面导航](#界面导航)
- [编辑器技巧](#编辑器技巧)
- [代码导航](#代码导航)
- [重构技巧](#重构技巧)
- [调试技巧](#调试技巧)
- [版本控制](#版本控制)
- [插件推荐](#插件推荐)
- [快捷键速查](#快捷键速查)
- [性能优化](#性能优化)

## 基础设置

### 调整主题和字体

```
File > Settings > Appearance & Behavior > Appearance
```

- **Theme**: Darcula 主题对眼睛更友好
- **Font**: 推荐使用等宽字体如 JetBrains Mono, Fira Code, Source Code Pro

### 自定义代码样式

```
File > Settings > Editor > Code Style
```

- 可针对每种语言自定义缩进、行宽、换行等规则
- 导入团队统一的代码风格配置文件

### 调整编辑器设置

```
File > Settings > Editor > General
```

- 启用自动保存（Save files automatically）
- 配置鼠标滚轮缩放字体大小
- 设置自动导入选项

## 界面导航

### 项目窗口

- Project 视图: 显示项目文件结构 (`Alt+1`)
- Structure 视图: 显示当前文件的结构 (`Alt+7`)
- Favorites 视图: 快速访问常用文件和位置
- Terminal 视图: 集成终端 (`Alt+F12`)

### 工具窗口

- **快速打开工具窗口**: `Ctrl+F12` 显示可用工具窗口列表
- **隐藏所有工具窗口**: `Ctrl+Shift+F12`
- **切换最近使用的工具窗口**: `F12`

### 多项目管理

- 创建项目组（Project Groups）组织多个相关项目
- 使用窗口 > 新窗口打开多个项目实例

## 编辑器技巧

### 智能代码完成

- **基本代码补全**: `Ctrl+Space`
- **智能类型感知补全**: `Ctrl+Shift+Space`
- **完成当前语句**: `Ctrl+Shift+Enter` (自动添加分号、括号等)

### 代码生成

- **生成代码** (构造函数、Getter/Setter 等): `Alt+Insert`
- **重写/实现方法**: `Ctrl+O` (Override) / `Ctrl+I` (Implement)
- **包围代码** (try/catch, if, for 等): `Ctrl+Alt+T`

### 多光标编辑

- **复制当前行**: `Ctrl+D`
- **向下添加光标**: `Alt+Shift+鼠标点击` 或 `Ctrl+Ctrl+Down`
- **选择所有出现的文本**: `Alt+J` (重复按添加下一个)

### 代码折叠

- **折叠当前代码块**: `Ctrl+-`
- **展开当前代码块**: `Ctrl+=`
- **折叠所有代码**: `Ctrl+Shift+-`
- **展开所有代码**: `Ctrl+Shift+=`

## 代码导航

### 快速跳转

- **在方法间跳转**: `Alt+Up/Down`
- **跳转到指定行**: `Ctrl+G`
- **返回上一个/下一个光标位置**: `Ctrl+Alt+Left/Right`
- **查找类**: `Ctrl+N`
- **查找文件**: `Ctrl+Shift+N`
- **查找符号** (方法、变量等): `Ctrl+Alt+Shift+N`

### 搜索功能

- **简单搜索**: `Ctrl+F`
- **全局搜索**: `Ctrl+Shift+F`
- **简单替换**: `Ctrl+R`
- **全局替换**: `Ctrl+Shift+R`
- **全局搜索类继承关系**: `Ctrl+Alt+B`

### 智能导航

- **快速定义查看**: `Ctrl+Shift+I` (不离开当前文件)
- **跳转到定义**: `Ctrl+B` 或 `Ctrl+Click`
- **跳转到实现**: `Ctrl+Alt+B`
- **查看使用处**: `Alt+F7`
- **列出方法层次结构**: `Ctrl+Shift+H`

## 重构技巧

### 常用重构

- **重命名**: `Shift+F6`
- **提取变量**: `Ctrl+Alt+V`
- **提取常量**: `Ctrl+Alt+C`
- **提取方法**: `Ctrl+Alt+M`
- **提取参数**: `Ctrl+Alt+P`
- **提取字段**: `Ctrl+Alt+F`
- **内联变量/方法**: `Ctrl+Alt+N`

### 高级重构

- **更改方法签名**: `Ctrl+F6`
- **移动类/方法**: `F6`
- **复制类**: `F5`
- **安全删除**: `Alt+Delete`
- **提取接口/超类**: `Ctrl+Alt+Shift+T` 然后选择相应选项

## 调试技巧

### 基本调试

- **设置/移除断点**: `Ctrl+F8` 或点击行号栏
- **开始调试**: `Shift+F9`
- **停止调试**: `Ctrl+F2`
- **运行程序**: `Shift+F10`
- **单步执行**: `F8`
- **步入**: `F7`
- **步出**: `Shift+F8`
- **执行到光标处**: `Alt+F9`

### 高级调试

- **条件断点**: 右键点击断点 > 设置条件
- **日志断点**: 断点上右键 > 勾选 "Log message to console"
- **表达式求值**: `Alt+F8`
- **添加观察**: 调试过程中选中变量，右键 > Add to Watches
- **强制返回**: 调试时 `Ctrl+Shift+A` 搜索 "Force Return" 并设置返回值

## 版本控制

### Git 集成

- **提交更改**: `Ctrl+K`
- **更新项目**: `Ctrl+T`
- **查看历史**: `Alt+9` 切换到 Version Control 标签，选择 Log
- **查看最近更改**: `Alt+Shift+C`
- **查看文件注释**: `Alt+`\``
- **比较与最新版本的差异**: 选中文件右键 > Git > Compare with Latest Repository Version

### 分支管理

- **新建分支**: Git 工具窗口 > 右键 > New Branch
- **切换分支**: Git 工具窗口 > 右键分支 > Checkout
- **合并分支**: Git 工具窗口 > 右键目标分支 > Merge into Current

## 插件推荐

### 必备插件

1. **Lombok**: 支持 Lombok 注解
2. **SonarLint**: 代码质量检查
3. **Maven Helper**: Maven 依赖管理优化
4. **GitToolBox**: 增强 Git 集成功能
5. **Key Promoter X**: 提示快捷键，帮助学习

### 语言与框架插件

1. **Spring Boot Assistant**: Spring Boot 开发助手
2. **Kotlin**: Kotlin 语言支持
3. **Python**: Python 开发支持
4. **Vue.js**: Vue 开发支持
5. **Database Navigator**: 数据库管理工具

### 主题与 UI 增强

1. **Material Theme UI**: 美化界面
2. **Rainbow Brackets**: 彩色括号匹配
3. **CodeGlance**: 代码小地图
4. **Presentation Assistant**: 演示时显示快捷键

## 快捷键速查

### 编辑

| 功能 | Windows/Linux | macOS |
|-----|--------------|-------|
| 基本补全 | `Ctrl+Space` | `Ctrl+Space` |
| 智能补全 | `Ctrl+Shift+Space` | `Ctrl+Shift+Space` |
| 格式化代码 | `Ctrl+Alt+L` | `Cmd+Alt+L` |
| 注释/取消注释行 | `Ctrl+/` | `Cmd+/` |
| 注释/取消注释块 | `Ctrl+Shift+/` | `Cmd+Shift+/` |
| 复制行 | `Ctrl+D` | `Cmd+D` |
| 删除行 | `Ctrl+Y` | `Cmd+Delete` |
| 移动行 | `Ctrl+Shift+Up/Down` | `Shift+Alt+Up/Down` |

### 导航

| 功能 | Windows/Linux | macOS |
|-----|--------------|-------|
| 查找类 | `Ctrl+N` | `Cmd+O` |
| 查找文件 | `Ctrl+Shift+N` | `Cmd+Shift+O` |
| 查找操作 | `Ctrl+Shift+A` | `Cmd+Shift+A` |
| 最近文件 | `Ctrl+E` | `Cmd+E` |
| 跳转到行 | `Ctrl+G` | `Cmd+L` |
| 前/后位置 | `Ctrl+Alt+Left/Right` | `Cmd+Alt+Left/Right` |

### 重构

| 功能 | Windows/Linux | macOS |
|-----|--------------|-------|
| 重命名 | `Shift+F6` | `Shift+F6` |
| 提取方法 | `Ctrl+Alt+M` | `Cmd+Alt+M` |
| 提取变量 | `Ctrl+Alt+V` | `Cmd+Alt+V` |
| 内联 | `Ctrl+Alt+N` | `Cmd+Alt+N` |
| 重构菜单 | `Ctrl+Alt+Shift+T` | `Ctrl+T` |

## 性能优化

### 提高 IDE 性能

1. **调整内存设置**:
   - 通过 `Help > Change Memory Settings` 增加分配给 IDE 的内存

2. **禁用不必要的插件**:
   - `File > Settings > Plugins` 禁用不常用的插件

3. **调整索引选项**:
   - 排除大型二进制文件和库文件夹
   - `File > Settings > Build, Execution, Deployment > Compiler > Excludes`

4. **使用 SSD**:
   - 将项目和 IDE 缓存放在 SSD 上

### 项目优化技巧

1. **使用模块**:
   - 将大型项目分解为多个模块，提高编译速度

2. **清理缓存**:
   - `File > Invalidate Caches / Restart`

3. **优化导入**:
   - 启用优化导入: `Settings > Editor > General > Auto Import > Optimize imports on the fly`

4. **限制变更范围**:
   - 使用 `Scope` 限制搜索和重构范围

## 总结

IntelliJ IDEA 提供了丰富的功能和工具，掌握这些技巧可以显著提高开发效率。关键是要养成使用快捷键的习惯，逐步减少对鼠标的依赖。通过持续学习和实践，你可以充分发挥这一强大 IDE 的潜力，使编程体验更加流畅高效。