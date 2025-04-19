# Git 版本控制系统

Git 是当今最流行的分布式版本控制系统，由 Linus Torvalds 为 Linux 内核开发而创建。本文档详细介绍 Git 的核心概念、基本操作和高级用法。

## 1. Git 基础概念

### 1.1 什么是版本控制

版本控制是一种记录文件内容变化的系统，以便将来查阅特定版本的文件内容。版本控制系统不仅可以还原特定文件的特定版本，还可以记录谁在什么时候对文件进行了何种修改。

### 1.2 Git 的特点

- **分布式架构**：每个开发者都拥有完整的代码库副本，可以离线工作
- **高性能**：高效处理大型项目，快速进行分支操作
- **数据完整性**：使用 SHA-1 哈希算法确保数据完整性
- **支持非线性开发**：强大的分支功能，支持并行开发
- **灵活的工作流**：支持多种开发工作流模式

### 1.3 Git 工作区域

Git 项目有三个主要区域：

1. **工作区（Working Directory）**：你当前看到的文件系统
2. **暂存区（Staging Area/Index）**：临时存储修改的区域
3. **本地仓库（Repository）**：提交的所有版本数据

### 1.4 Git 文件状态

Git 中的文件有四种主要状态：

- **未追踪（Untracked）**：Git 不知道这个文件的存在
- **已追踪，未修改（Tracked, Unmodified）**：文件已经被追踪，但未发生变化
- **已追踪，已修改（Tracked, Modified）**：文件已被追踪，且内容有变化
- **已暂存（Staged）**：文件已放入暂存区，等待提交

## 2. 安装与配置

### 2.1 安装 Git

**Windows**：
- 下载安装包：[Git for Windows](https://git-scm.com/download/win)
- 使用包管理器：`winget install --id Git.Git`

**macOS**：
- 使用 Homebrew：`brew install git`
- 下载安装包：[Git for macOS](https://git-scm.com/download/mac)

**Linux**：
- Debian/Ubuntu：`sudo apt install git-all`
- Fedora：`sudo dnf install git-all`

### 2.2 Git 配置

Git 有三级配置：

1. **系统级配置**：`/etc/gitconfig` 文件，影响所有用户，使用 `--system` 选项设置
2. **用户级配置**：`~/.gitconfig` 文件，影响当前用户，使用 `--global` 选项设置
3. **仓库级配置**：`.git/config` 文件，仅影响当前仓库

#### 基本配置

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认编辑器
git config --global core.editor "vim"

# 查看配置
git config --list

# 设置默认分支名称
git config --global init.defaultBranch main
```

#### 配置别名

```bash
# 为常用命令创建简短别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

## 3. Git 基本操作

### 3.1 创建仓库

```bash
# 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/username/repository.git

# 克隆特定分支
git clone -b branch-name https://github.com/username/repository.git

# 浅克隆（只获取最近的历史）
git clone --depth=1 https://github.com/username/repository.git
```

### 3.2 基本工作流程

```bash
# 检查状态
git status

# 添加文件到暂存区
git add filename                # 添加单个文件
git add .                       # 添加所有文件
git add --patch                 # 交互式添加

# 提交修改
git commit -m "Commit message"  # 提交暂存文件
git commit -a -m "Message"      # 自动添加所有修改（已跟踪）并提交

# 查看提交历史
git log                         # 完整历史
git log --oneline               # 简洁历史
git log --graph --oneline       # 图形化历史
git log -p                      # 显示补丁

# 撤销修改
git restore filename            # 撤销工作区修改
git restore --staged filename   # 撤销暂存区修改
git revert commit-id            # 创建一个新提交来撤销之前的提交
git reset --hard commit-id      # 重置到特定提交（危险）
```

### 3.3 分支管理

```bash
# 列出分支
git branch                      # 本地分支
git branch -r                   # 远程分支
git branch -a                   # 所有分支

# 创建分支
git branch branch-name          # 创建分支
git checkout -b branch-name     # 创建并切换到新分支
git switch -c branch-name       # 创建并切换到新分支（新语法）

# 切换分支
git checkout branch-name        # 切换分支
git switch branch-name          # 切换分支（新语法）

# 合并分支
git merge branch-name           # 将指定分支合并到当前分支
git merge --no-ff branch-name   # 不使用快进模式合并

# 删除分支
git branch -d branch-name       # 删除已合并的分支
git branch -D branch-name       # 强制删除分支
```

### 3.4 远程操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repository.git

# 获取更新
git fetch origin               # 获取远程更新但不合并
git pull origin branch-name    # 获取远程更新并合并

# 推送修改
git push origin branch-name    # 推送本地分支到远程
git push -u origin branch-name # 设置上游分支并推送

# 删除远程分支
git push origin --delete branch-name
```

## 4. Git 高级功能

### 4.1 暂存工作区

```bash
# 暂存当前工作
git stash                       # 暂存修改
git stash save "描述信息"        # 添加描述

# 查看暂存列表
git stash list

# 应用暂存
git stash apply                 # 应用最近的暂存（不删除）
git stash apply stash@{n}       # 应用指定的暂存
git stash pop                   # 应用并删除最近的暂存

# 删除暂存
git stash drop                  # 删除最近的暂存
git stash drop stash@{n}        # 删除指定的暂存
git stash clear                 # 清空所有暂存
```

### 4.2 重写历史

```bash
# 修改最近的提交
git commit --amend

# 压缩多个提交
git rebase -i HEAD~3            # 交互式重新应用最近3次提交

# 变基操作
git rebase branch-name          # 将当前分支变基到指定分支
```

### 4.3 标签管理

```bash
# 列出标签
git tag                         # 所有标签
git tag -l "v1.8.5*"            # 带模式的标签列表

# 创建标签
git tag v1.0.0                  # 轻量标签
git tag -a v1.0.0 -m "版本1.0.0" # 附注标签

# 显示标签信息
git show v1.0.0

# 推送标签
git push origin v1.0.0          # 推送单个标签
git push origin --tags          # 推送所有标签

# 删除标签
git tag -d v1.0.0               # 删除本地标签
git push origin --delete v1.0.0 # 删除远程标签
```

### 4.4 子模块

```bash
# 添加子模块
git submodule add https://github.com/username/repository.git path/to/submodule

# 克隆带有子模块的项目
git clone --recursive https://github.com/username/repository.git

# 初始化子模块
git submodule init
git submodule update

# 更新所有子模块
git submodule update --remote
```

## 5. Git 工作流模型

### 5.1 集中式工作流

- 所有开发者在同一分支（通常是主分支）上工作
- 类似于 SVN 的工作方式
- 适合小团队或简单项目

### 5.2 功能分支工作流

- 每个新功能都在专用分支上开发
- 功能完成后，通过拉取请求合并到主分支
- 适合大多数项目和团队

### 5.3 Gitflow 工作流

- 定义严格的分支模型
- 主要分支：`master`（生产）和 `develop`（开发）
- 支持分支：`feature/*`、`release/*`、`hotfix/*`
- 适合有计划发布周期的项目

### 5.4 Forking 工作流

- 每个开发者拥有自己的服务端仓库
- 通过拉取请求将更改合并到官方仓库
- 适合开源项目或分散的团队

### 5.5 Trunk-Based 开发

- 在主干上进行小而频繁的提交
- 使用功能开关控制功能发布
- 实现持续集成和持续部署
- 适合DevOps实践的团队

## 6. Git 最佳实践

### 6.1 提交消息规范

一个好的提交消息格式：

```
类型(范围): 简短描述

详细描述（可选）

相关问题（可选）
```

**类型**:
- `feat`: 新功能
- `fix`: 修复缺陷
- `docs`: 仅文档更改
- `style`: 不影响代码含义的更改（格式等）
- `refactor`: 既不修复缺陷也不添加功能的代码更改
- `perf`: 性能改进
- `test`: 添加或修正测试
- `chore`: 对构建过程或辅助工具和库的更改

### 6.2 分支命名规范

- 使用前缀区分分支类型：
  - `feature/` 新功能
  - `bugfix/` 缺陷修复
  - `hotfix/` 紧急修复
  - `release/` 发布准备
  - `support/` 维护分支

- 在前缀后添加描述性名称或问题编号
  - `feature/user-authentication`
  - `bugfix/login-validation`
  - `hotfix/security-vulnerability`

### 6.3 代码审查

- 使用拉取请求（Pull Request）/ 合并请求（Merge Request）
- 审查前小规模提交
- 使用自动化工具进行代码质量检查
- 注重代码可读性和可维护性

### 6.4 常见问题解决方案

**1. 解决合并冲突**

```bash
git merge branch-name
# 手动解决文件中的冲突
git add resolved-file
git commit
```

**2. 找回丢失的提交**

```bash
# 查看引用日志
git reflog

# 恢复到特定引用
git reset --hard HEAD@{n}
```

**3. 在错误的分支上工作**

```bash
# 保存当前修改
git stash

# 切换到正确的分支
git switch correct-branch

# 应用修改
git stash pop
```

**4. 撤销公共提交**

```bash
# 创建一个新提交来撤销之前的提交
git revert commit-id
```

**5. 压缩推送前的多个提交**

```bash
# 交互式重新应用最近的n次提交
git rebase -i HEAD~n

# 在编辑器中，保留第一个pick，其余改为squash或s
```

## 7. Git 高级技巧

### 7.1 Git Hooks

Git hooks 是在特定事件（如提交、合并）发生时自动执行的脚本。

**客户端钩子**：
- `pre-commit`：提交前执行，用于代码检查
- `prepare-commit-msg`：生成默认提交消息后执行
- `commit-msg`：用户输入提交消息后执行，可用于验证格式
- `post-commit`：提交后执行

**服务器端钩子**：
- `pre-receive`：推送到服务器前触发
- `update`：检查要更新的每个引用
- `post-receive`：推送完成后执行，常用于通知或部署

### 7.2 Git 内部原理

- **对象类型**：
  - blob：文件内容
  - tree：目录内容
  - commit：提交信息和指向 tree 的指针
  - tag：带注释的标签对象

- **引用**：
  - 分支：指向提交对象的可变指针
  - HEAD：指向当前分支的特殊引用
  - 标签：指向特定对象的命名引用

### 7.3 高级命令与选项

```bash
# 查找引入特定代码的提交
git blame filename

# 二分法查找引入问题的提交
git bisect start
git bisect bad  # 当前版本有问题
git bisect good commit-id  # 某个旧版本正常

# 捕获文件的一部分更改
git add -p filename

# 查看两次提交之间的差异
git diff commit1..commit2
```

### 7.4 使用 Git 工作树

```bash
# 创建新的工作树
git worktree add ../path/to/new-worktree branch-name

# 列出工作树
git worktree list

# 删除工作树
git worktree remove path/to/worktree
```

## 8. 常用 Git 工具

- **GUI 客户端**：
  - [GitHub Desktop](https://desktop.github.com/) - 简洁易用的 Git 客户端
  - [GitKraken](https://www.gitkraken.com/) - 跨平台 Git 客户端
  - [SourceTree](https://www.sourcetreeapp.com/) - 免费 Git 客户端

- **扩展工具**：
  - [Git LFS](https://git-lfs.github.com/) - 大文件存储扩展
  - [Hub](https://hub.github.com/) - GitHub 命令行工具
  - [Conventional Commits](https://www.conventionalcommits.org/) - 提交消息规范

- **集成服务**：
  - [GitHub](https://github.com/) - 代码托管和协作
  - [GitLab](https://gitlab.com/) - DevOps 平台
  - [Bitbucket](https://bitbucket.org/) - 代码托管服务

## 参考资源

- [Pro Git 书籍](https://git-scm.com/book/zh/v2) - 权威的 Git 参考书
- [Git Reference](https://git-scm.com/docs) - 官方命令参考
- [GitHub Guides](https://guides.github.com/) - GitHub 上的 Git 和 GitHub 教程
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf) - 命令速查表