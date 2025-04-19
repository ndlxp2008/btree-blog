# Kubernetes 入门

## 简介

Kubernetes（通常简称为K8s）是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。它最初由Google设计，现在由Cloud Native Computing Foundation（CNCF）维护。Kubernetes提供了一个框架来构建分布式系统，使应用程序可以在任何环境中可靠运行。

### 核心功能

- **自动化部署**：声明式定义和部署应用
- **自动扩展**：根据资源需求自动扩展应用
- **自愈能力**：自动替换、重新调度和重启失败的容器
- **服务发现与负载均衡**：为容器提供IP地址和DNS名称，并分配流量
- **存储编排**：自动挂载所选存储系统
- **滚动更新与回滚**：逐步更新应用，支持出错时回滚
- **配置管理**：管理和更新配置信息，不需要重建镜像
- **批处理执行**：管理批处理和CI类型的工作负载

## 架构组件

Kubernetes采用主从（Master-Worker）架构，由控制平面（Control Plane）和数据平面（Data Plane）组成。

### 控制平面组件

- **kube-apiserver**：Kubernetes API的前端，所有操作的统一入口
- **etcd**：一致且高可用的键值存储，保存所有集群数据
- **kube-scheduler**：监视新创建的Pod，并决定在哪个节点上运行
- **kube-controller-manager**：运行控制器进程，如节点控制器、副本控制器等
- **cloud-controller-manager**：与云服务提供商的API交互

### 数据平面组件

- **kubelet**：确保容器在Pod中运行
- **kube-proxy**：网络代理，维护节点上的网络规则
- **容器运行时**：负责运行容器，如Docker、containerd、CRI-O

### 架构图

```
                    +---------------+
                    |  kube-apiserver |
                    +---------------+
                        |       |
         +---------------+       +---------------+
         |                                       |
+---------------+                    +---------------+
| kube-scheduler |                   |  Controller   |
+---------------+                    |  Manager      |
                                      +---------------+
         |                                       |
         |                                       |
   +--------------------------------------------+
   |                     etcd                   |
   +--------------------------------------------+

                   控制平面
---------------------------------------------------
                   数据平面

+---------------+  +---------------+  +---------------+
|    Node 1     |  |    Node 2     |  |    Node 3     |
|  +---------+  |  |  +---------+  |  |  +---------+  |
|  | kubelet |  |  |  | kubelet |  |  |  | kubelet |  |
|  +---------+  |  |  +---------+  |  |  +---------+  |
|  +---------+  |  |  +---------+  |  |  +---------+  |
|  |kube-proxy|  |  |  |kube-proxy|  |  |  |kube-proxy|  |
|  +---------+  |  |  +---------+  |  |  +---------+  |
|               |  |               |  |               |
|  +---------+  |  |  +---------+  |  |  +---------+  |
|  | 容器运行时 |  |  |  | 容器运行时 |  |  |  | 容器运行时 |  |
|  +---------+  |  |  +---------+  |  |  +---------+  |
+---------------+  +---------------+  +---------------+
```

## 核心概念

### Pod

Pod是Kubernetes中最小的可部署单元，代表集群中运行的进程。Pod封装了一个或多个容器、存储资源、唯一的网络IP和管理容器运行的选项。

**特点**：
- 同一Pod中的容器共享网络命名空间
- 同一Pod中的容器可以使用localhost互相通信
- Pod内容器共享卷
- Pod是临时实体，不会自我修复

**示例**：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

### ReplicaSet

ReplicaSet确保指定数量的Pod副本在任何时候都在运行。通常使用Deployment来管理ReplicaSet。

**示例**：
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
```

### Deployment

Deployment提供了Pod和ReplicaSet的声明式更新能力，描述期望状态，Kubernetes会以受控速率将实际状态改变为期望状态。

**功能**：
- 创建新的ReplicaSet
- 滚动更新（逐步替换Pod）
- 回滚到之前的部署版本
- 扩展/缩容

**示例**：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Service

Service是一种抽象，定义了一组Pod的访问策略。Service使Pod之间可以相互访问，并为外部提供访问入口。

**类型**：
- **ClusterIP**：默认类型，集群内部IP，只能从集群内部访问
- **NodePort**：在每个节点上开放端口，可从外部通过节点IP访问
- **LoadBalancer**：使用外部负载均衡器（如云提供商的负载均衡器）
- **ExternalName**：将服务映射到externalName字段内容（如DNS CNAME记录）

**示例**：
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

### Namespace

Namespace提供了一种在同一物理集群上隔离资源的方法，用于多团队或多项目场景。

**内置Namespace**：
- **default**：默认命名空间，没有指定时使用
- **kube-system**：Kubernetes系统创建的对象
- **kube-public**：公开可读的资源
- **kube-node-lease**：与节点相关的租约对象

**示例**：
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: development
```

### ConfigMap 和 Secret

- **ConfigMap**：存储非敏感配置数据，键值对形式
- **Secret**：存储敏感信息，如密码、OAuth令牌和SSH密钥，Base64编码

**ConfigMap示例**：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.properties: |
    database.url=postgres://localhost:5432/db
    database.user=admin
```

**Secret示例**：
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64编码的"admin"
  password: cGFzc3dvcmQ=  # base64编码的"password"
```

### Volume

Volume允许容器访问持久化存储，解决容器重启后数据丢失的问题。

**常见类型**：
- **emptyDir**：临时存储，Pod删除时数据丢失
- **hostPath**：挂载节点文件系统上的文件或目录
- **persistentVolumeClaim (PVC)**：使用预先配置的存储
- **configMap**：提供配置数据
- **secret**：提供密钥数据

**PersistentVolume示例**：
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

**PersistentVolumeClaim示例**：
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

## kubectl 命令行

kubectl是Kubernetes的命令行工具，用于对集群进行操作。

### 基本语法

```
kubectl [command] [TYPE] [NAME] [flags]
```

- **command**：指定操作，如create、get、apply、delete
- **TYPE**：指定资源类型，如pods、deployments、services
- **NAME**：指定资源名称
- **flags**：指定可选标志

### 常用命令

**集群信息**：
```bash
# 查看集群信息
kubectl cluster-info

# 查看节点
kubectl get nodes

# 查看集群状态
kubectl get componentstatuses
```

**创建资源**：
```bash
# 从文件创建资源
kubectl create -f resource.yaml

# 应用配置
kubectl apply -f resource.yaml

# 创建命名空间
kubectl create namespace dev
```

**查看资源**：
```bash
# 获取所有Pod
kubectl get pods

# 获取所有命名空间中的Pod
kubectl get pods --all-namespaces

# 查看Pod详情
kubectl describe pod <pod-name>

# 查看Pod日志
kubectl logs <pod-name>
```

**编辑资源**：
```bash
# 编辑Deployment
kubectl edit deployment <deployment-name>

# 扩展副本
kubectl scale deployment <deployment-name> --replicas=5

# 设置镜像
kubectl set image deployment/<deployment-name> <container-name>=<new-image>
```

**删除资源**：
```bash
# 删除Pod
kubectl delete pod <pod-name>

# 删除Deployment
kubectl delete deployment <deployment-name>

# 根据配置文件删除
kubectl delete -f resource.yaml
```

**调试与故障排除**：
```bash
# 进入容器
kubectl exec -it <pod-name> -- /bin/bash

# 端口转发
kubectl port-forward <pod-name> 8080:80

# 查看资源使用情况
kubectl top nodes
kubectl top pods
```

## 实际应用场景

### 部署Web应用

使用Deployment部署Web应用，并通过Service暴露它：

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:latest
        ports:
        - containerPort: 80
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### 配置数据库

使用StatefulSet部署数据库，并使用PVC持久化数据：

```yaml
# statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  serviceName: mysql
  replicas: 1
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secrets
              key: password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: mysql-persistent-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

### 实现蓝绿部署

使用Deployment和Service实现蓝绿部署：

```yaml
# blue-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
---
# green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: myapp
        image: myapp:2.0
---
# service.yaml (初始指向blue)
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
    version: blue
  ports:
  - port: 80
    targetPort: 80
```

切换到绿色部署：
```bash
kubectl patch service myapp-service -p '{"spec":{"selector":{"version":"green"}}}'
```

## Kubernetes生态系统

### 常用工具和扩展

- **Helm**：Kubernetes的包管理器
- **Istio**：服务网格，提供流量管理、安全和观测能力
- **Prometheus**：监控和告警系统
- **Grafana**：数据可视化和监控
- **Fluentd**：日志收集和处理
- **Jaeger**：分布式追踪系统
- **Cert-Manager**：证书自动化管理
- **Knative**：构建、部署和管理无服务器工作负载
- **Argo CD**：GitOps持续交付工具

### Kubernetes发行版

- **Google Kubernetes Engine (GKE)**：Google Cloud的托管Kubernetes
- **Amazon Elastic Kubernetes Service (EKS)**：AWS的托管Kubernetes
- **Azure Kubernetes Service (AKS)**：Azure的托管Kubernetes
- **Red Hat OpenShift**：企业级Kubernetes平台
- **Rancher**：开源Kubernetes管理平台
- **k3s**：轻量级Kubernetes，适用于边缘计算
- **minikube**：本地运行Kubernetes的工具
- **kind**：使用Docker容器运行本地Kubernetes集群

## 最佳实践

### 资源管理

- **设置资源请求和限制**：为每个容器定义CPU和内存请求/限制，避免资源争用
```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

- **使用命名空间**：通过命名空间隔离不同的环境和团队
- **应用资源配额**：为命名空间设置资源配额，防止过度使用
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: namespace-quota
spec:
  hard:
    pods: "10"
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
```

### 安全性

- **使用RBAC控制访问**：限制用户和服务账户的权限
- **限制容器特权**：避免使用特权容器，设置securityContext
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  capabilities:
    drop:
      - ALL
```
- **使用NetworkPolicy**：限制Pod之间的网络通信
- **定期更新和扫描镜像**：检测和修复安全漏洞

### 高可用性

- **使用多副本**：为关键应用设置多个副本
- **配置Pod反亲和性**：确保Pod分布在不同节点上
```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchExpressions:
        - key: app
          operator: In
          values:
          - web-app
      topologyKey: "kubernetes.io/hostname"
```
- **设置健康检查**：配置liveness和readiness探针
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```
- **实施灾难恢复策略**：备份etcd数据，制定恢复计划

## 性能优化

- **使用 HorizontalPodAutoscaler**：基于CPU或自定义指标自动扩展
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```
- **优化镜像大小**：使用精简基础镜像，减少层数
- **使用本地卷提高I/O性能**：对于高I/O应用，考虑使用本地存储
- **合理设置Pod调度策略**：利用节点亲和性和污点/容忍调整Pod分布

## 常见问题与解决方案

### Pod 一直处于 Pending 状态

**可能原因**：
- 资源不足（CPU、内存）
- PVC无法绑定
- 调度约束无法满足

**解决方法**：
```bash
# 检查Pod事件
kubectl describe pod <pod-name>

# 查看集群资源状态
kubectl get nodes -o wide
kubectl describe node <node-name>
```

### Pod 崩溃循环 (CrashLoopBackOff)

**可能原因**：
- 应用程序错误
- 配置错误
- 资源限制过低

**解决方法**：
```bash
# 查看Pod日志
kubectl logs <pod-name>

# 检查最后一次终止状态
kubectl describe pod <pod-name>

# 调试进入容器
kubectl exec -it <pod-name> -- /bin/sh
```

### 服务无法访问

**可能原因**：
- Service和Pod标签选择器不匹配
- Pod不健康
- 网络策略阻止流量

**解决方法**：
```bash
# 验证Service是否选择正确的Pod
kubectl get endpoints <service-name>

# 检查Pod是否运行并就绪
kubectl get pods -l app=<app-label> -o wide

# 测试从其他Pod内部访问
kubectl exec -it <some-pod> -- curl <service-name>.<namespace>
```

## 结论

Kubernetes已成为容器编排的事实标准，为构建现代云原生应用提供了强大的基础。它提供了丰富的功能用于部署、扩展和管理容器化应用，同时也带来了一定的复杂性。通过掌握本文介绍的核心概念和最佳实践，可以更有效地利用Kubernetes构建可靠、可伸缩和高效的应用系统。

随着云原生生态系统的不断发展，Kubernetes周边工具和实践也在不断演进。持续学习和实践是掌握Kubernetes的关键。