# Docker 基础

## Docker 简介

Docker是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的Linux或Windows系统上。Docker容器完全使用沙箱机制，相互之间不会有任何接口。

### 核心优势

- **一致的环境**：确保应用在开发、测试和生产环境中一致运行
- **轻量级**：容器共享主机系统的内核，比虚拟机更高效
- **快速部署**：容器可以在几秒内启动，显著加快部署速度
- **版本控制**：容器镜像可以版本化，方便追踪变更
- **隔离性**：应用及其依赖在容器内运行，不影响其他应用

### 与虚拟机的区别

| 特性 | Docker容器 | 虚拟机 |
|------|------------|--------|
| 启动时间 | 秒级 | 分钟级 |
| 占用磁盘空间 | MB级别 | GB级别 |
| 性能 | 接近原生 | 有一定损耗 |
| 隔离级别 | 进程级隔离 | 硬件级隔离 |
| 操作系统 | 共享宿主机内核 | 完整的客户操作系统 |

## Docker 核心概念

### 镜像 (Image)

Docker镜像是一个只读的模板，包含创建Docker容器的指令。镜像就像应用程序的安装包，可以用来创建多个容器实例。

**基本特性**：
- 分层构建，每层代表一条指令
- 共享层提高存储效率
- 可通过Dockerfile定义
- 存储在镜像仓库中

**示例**：
```
nginx:latest      # Nginx Web服务器的最新版镜像
ubuntu:20.04      # Ubuntu 20.04操作系统镜像
python:3.9-alpine # 基于Alpine的Python 3.9环境
```

### 容器 (Container)

容器是镜像的可运行实例。容器包含应用及其所有依赖，作为一个独立的单元运行。

**基本特性**：
- 可启动、停止、移动和删除
- 相互隔离，拥有自己的文件系统、网络等资源
- 默认情况下，容器与其他容器和宿主机相互隔离
- 一个镜像可以创建多个容器

**容器生命周期**：
1. 创建 (create)
2. 运行 (start)
3. 暂停 (pause/unpause)
4. 停止 (stop)
5. 重启 (restart)
6. 销毁 (rm)

### 仓库 (Repository)

仓库是存储和分发Docker镜像的地方。Docker Hub是Docker公司提供的公共仓库，还可以设置私有仓库。

**类型**：
- **公共仓库**：Docker Hub、GitHub Container Registry
- **私有仓库**：Docker Registry、Harbor、Nexus

### Dockerfile

Dockerfile是用于构建Docker镜像的文本文件，包含一系列指令和参数。

**常用指令**：

| 指令 | 用途 | 示例 |
|------|------|------|
| FROM | 指定基础镜像 | `FROM nginx:alpine` |
| WORKDIR | 设置工作目录 | `WORKDIR /app` |
| COPY | 从构建上下文复制文件 | `COPY . /app` |
| ADD | 复制文件，且支持URL和解压 | `ADD app.tar.gz /app` |
| RUN | 执行命令并创建新的镜像层 | `RUN npm install` |
| ENV | 设置环境变量 | `ENV NODE_ENV production` |
| EXPOSE | 声明容器监听的端口 | `EXPOSE 80/tcp` |
| CMD | 指定容器启动时执行的命令 | `CMD ["node", "app.js"]` |
| ENTRYPOINT | 指定容器启动时执行的入口命令 | `ENTRYPOINT ["nginx", "-g", "daemon off;"]` |
| VOLUME | 创建挂载点 | `VOLUME /data` |

**示例Dockerfile**：
```dockerfile
# 使用Node.js 14作为基础镜像
FROM node:14-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置环境变量
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

## Docker 基本操作

### 镜像管理

```bash
# 从仓库拉取镜像
docker pull nginx:latest

# 列出本地镜像
docker images

# 构建镜像
docker build -t myapp:1.0 .

# 删除镜像
docker rmi nginx:latest

# 为镜像添加标签
docker tag myapp:1.0 myregistry.com/myapp:1.0

# 推送镜像到仓库
docker push myregistry.com/myapp:1.0
```

### 容器管理

```bash
# 创建并启动容器
docker run -d -p 80:80 --name webserver nginx

# 列出运行中的容器
docker ps

# 列出所有容器(包括已停止的)
docker ps -a

# 停止容器
docker stop webserver

# 启动已停止的容器
docker start webserver

# 重启容器
docker restart webserver

# 删除容器
docker rm webserver

# 进入容器内部
docker exec -it webserver bash
```

### 数据管理

Docker提供两种主要的数据持久化方式：

1. **卷(Volumes)**：由Docker管理的数据存储，与宿主机的文件系统隔离。

```bash
# 创建卷
docker volume create mydata

# 挂载卷启动容器
docker run -d -v mydata:/data --name mycontainer nginx

# 查看卷信息
docker volume inspect mydata
```

2. **绑定挂载(Bind Mounts)**：将宿主机上的文件或目录挂载到容器内。

```bash
# 挂载宿主机目录
docker run -d -v /path/on/host:/path/in/container --name mycontainer nginx
```

### 网络管理

Docker提供多种网络模式，用于容器间通信和容器与外部世界的通信。

```bash
# 创建网络
docker network create mynetwork

# 查看网络列表
docker network ls

# 将容器连接到网络
docker run -d --name mycontainer --network mynetwork nginx

# 查看网络详情
docker network inspect mynetwork

# 从网络中断开容器
docker network disconnect mynetwork mycontainer
```

## Docker Compose

Docker Compose是一个用于定义和运行多容器Docker应用的工具。使用YAML文件配置应用的服务、网络和卷。

### docker-compose.yml

```yaml
version: '3'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - app

  app:
    build: ./app
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=example
    depends_on:
      - db

  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=example
      - MYSQL_DATABASE=myapp

volumes:
  db_data:
```

### 基本命令

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 停止所有服务
docker-compose down

# 重建特定服务
docker-compose up -d --build app
```

## Docker最佳实践

### 镜像构建优化

1. **使用.dockerignore文件**：排除不需要的文件，减小上下文大小
2. **多阶段构建**：分离构建环境和运行环境，减小最终镜像体积
3. **合并RUN指令**：减少镜像层数量
4. **使用特定标签**：避免使用`latest`标签，使用具体版本号保证稳定性

**多阶段构建示例**：
```dockerfile
# 构建阶段
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 容器安全性

1. **使用非root用户**：容器内以非特权用户运行应用
2. **设置只读文件系统**：`docker run --read-only`
3. **限制资源使用**：设置CPU和内存限制
4. **扫描镜像漏洞**：使用Trivy、Clair等工具检查安全漏洞

```dockerfile
# 在Dockerfile中添加用户
FROM nginx:alpine
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -h /home/appuser -D appuser
USER appuser
```

### 日志管理

配置合适的日志驱动，方便收集和分析容器日志。

```bash
# 启动容器时指定日志驱动
docker run --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3 nginx
```

## 常见问题与解决方案

### 容器无法连接网络

**检查步骤**：
1. 验证网络配置：`docker network inspect bridge`
2. 检查容器IP：`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name`
3. 测试容器内网络：`docker exec container_name ping 8.8.8.8`

### 数据持久化问题

**解决方法**：
1. 使用命名卷替代匿名卷
2. 确保挂载点正确
3. 检查权限设置

```bash
# 使用命名卷并设置权限
docker run -v mydata:/app/data:rw nginx
```

### 构建过程中的缓存问题

**优化策略**：
1. 合理调整Dockerfile中的命令顺序
2. 将不常变更的命令放在前面
3. 必要时使用`--no-cache`选项重新构建

## Docker生态系统

Docker相关的其他工具和技术：

- **Docker Swarm**：Docker原生的容器编排工具
- **Kubernetes**：目前最流行的容器编排平台
- **Portainer**：Docker可视化管理工具
- **Watchtower**：自动更新Docker容器
- **Traefik**：现代HTTP反向代理和负载均衡器，用于微服务

## 结论

Docker已成为现代软件开发与部署的关键工具，它简化了应用的打包和分发流程，提高了开发效率和系统可靠性。随着云原生技术的不断发展，Docker与Kubernetes等容器编排工具一起，构成了现代微服务架构的基础设施。掌握Docker的核心概念和操作，对于理解和实现现代化的应用部署至关重要。