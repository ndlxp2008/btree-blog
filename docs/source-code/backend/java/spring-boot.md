# Spring Boot 源码分析

## 1. Spring Boot 简介

Spring Boot 是基于 Spring 框架的快速开发工具，它通过简化配置、约定优于配置等方式，大大减少了开发者的工作量，使得开发者能够更快地构建独立的、生产级的Spring应用程序。本文将深入分析 Spring Boot 的核心源码实现。

## 2. Spring Boot 核心模块结构

Spring Boot 的核心模块主要包括：

- **spring-boot**: 核心模块，包含自动配置支持、生命周期支持等
- **spring-boot-autoconfigure**: 提供自动配置的实现
- **spring-boot-starters**: 各种启动器模块
- **spring-boot-actuator**: 提供应用监控与管理
- **spring-boot-devtools**: 开发者工具，提供热部署等功能

## 3. 启动流程源码分析

### 3.1 启动入口

Spring Boot 应用的启动入口是 `SpringApplication.run()` 方法：

```java
public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
    return new SpringApplication(primarySources).run(args);
}
```

新建 `SpringApplication` 对象的过程：

```java
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    Assert.notNull(primarySources, "PrimarySources must not be null");
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    // 推断应用类型（SERVLET或REACTIVE）
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    // 加载ApplicationContextInitializer
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
    // 加载ApplicationListener
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    // 推断主应用类
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

### 3.2 Run 方法执行流程

`run` 方法是 Spring Boot 启动的核心：

```java
public ConfigurableApplicationContext run(String... args) {
    // 计时器
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    
    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
    
    // 配置headless模式
    configureHeadlessProperty();
    
    // 获取SpringApplicationRunListener实例
    SpringApplicationRunListeners listeners = getRunListeners(args);
    
    // 触发starting事件
    listeners.starting();
    
    try {
        // 创建应用参数对象
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        
        // 准备环境
        ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
        
        // 配置 spring.beaninfo.ignore
        configureIgnoreBeanInfo(environment);
        
        // 打印Banner
        Banner printedBanner = printBanner(environment);
        
        // 创建应用上下文
        context = createApplicationContext();
        
        // 获取异常报告器
        exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
                new Class[] { ConfigurableApplicationContext.class }, context);
                
        // 准备上下文
        prepareContext(context, environment, listeners, applicationArguments, printedBanner);
        
        // 刷新上下文
        refreshContext(context);
        
        // 刷新后回调
        afterRefresh(context, applicationArguments);
        
        // 停止计时
        stopWatch.stop();
        
        // 记录启动日志
        if (this.logStartupInfo) {
            new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
        }
        
        // 触发started事件
        listeners.started(context);
        
        // 调用ApplicationRunner和CommandLineRunner
        callRunners(context, applicationArguments);
    }
    catch (Throwable ex) {
        // 处理启动异常
        handleRunFailure(context, ex, exceptionReporters, listeners);
        throw new IllegalStateException(ex);
    }
    
    try {
        // 触发running事件
        listeners.running(context);
    }
    catch (Throwable ex) {
        // 处理运行异常
        handleRunFailure(context, ex, exceptionReporters, null);
        throw new IllegalStateException(ex);
    }
    
    return context;
}
```

### 3.3 创建 ApplicationContext

创建 ApplicationContext 的代码：

```java
protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    if (contextClass == null) {
        try {
            switch (this.webApplicationType) {
                case SERVLET:
                    contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                    break;
                case REACTIVE:
                    contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                    break;
                default:
                    contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
            }
        }
        catch (ClassNotFoundException ex) {
            throw new IllegalStateException(
                    "Unable create a default ApplicationContext, please specify an ApplicationContextClass", ex);
        }
    }
    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

### 3.4 刷新上下文

刷新上下文是 Spring Boot 启动的关键步骤，会触发 Spring 容器的初始化：

```java
private void refreshContext(ConfigurableApplicationContext context) {
    refresh(context);
    if (this.registerShutdownHook) {
        try {
            context.registerShutdownHook();
        }
        catch (AccessControlException ex) {
            // 无权限注册关闭钩子
        }
    }
}

protected void refresh(ApplicationContext applicationContext) {
    Assert.isInstanceOf(AbstractApplicationContext.class, applicationContext);
    ((AbstractApplicationContext) applicationContext).refresh();
}
```

## 4. 自动配置源码分析

### 4.1 @SpringBootApplication 注解

Spring Boot 的自动配置从 `@SpringBootApplication` 注解开始：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    // ...属性定义
}
```

### 4.2 @EnableAutoConfiguration 注解

自动配置的核心注解是 `@EnableAutoConfiguration`：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    // ...属性定义
}
```

### 4.3 AutoConfigurationImportSelector 类

`AutoConfigurationImportSelector` 负责导入自动配置类：

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware,
        ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
            
    // 获取自动配置条目
    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(),
                getBeanClassLoader());
        return configurations;
    }
    
    // 获取要加载的工厂类
    protected Class<?> getSpringFactoriesLoaderFactoryClass() {
        return EnableAutoConfiguration.class;
    }
    
    // 处理自动配置导入
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        if (!isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        }
        
        // 加载自动配置元数据
        AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader
                .loadMetadata(this.beanClassLoader);
                
        // 获取自动配置条目
        AutoConfigurationEntry autoConfigurationEntry = getAutoConfigurationEntry(autoConfigurationMetadata,
                annotationMetadata);
                
        return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
    }
    
    // 获取自动配置条目
    protected AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata,
            AnnotationMetadata annotationMetadata) {
        if (!isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        }
        
        // 获取注解属性
        AnnotationAttributes attributes = getAttributes(annotationMetadata);
        
        // 获取候选配置
        List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
        
        // 去重
        configurations = removeDuplicates(configurations);
        
        // 获取排除项
        Set<String> exclusions = getExclusions(annotationMetadata, attributes);
        
        // 检查排除类
        checkExcludedClasses(configurations, exclusions);
        
        // 移除排除项
        configurations.removeAll(exclusions);
        
        // 过滤配置
        configurations = filter(configurations, autoConfigurationMetadata);
        
        // 触发导入事件
        fireAutoConfigurationImportEvents(configurations, exclusions);
        
        return new AutoConfigurationEntry(configurations, exclusions);
    }
}
```

### 4.4 条件注解处理

Spring Boot 使用条件注解控制自动配置，主要由 `SpringBootCondition` 和子类实现：

```java
public abstract class SpringBootCondition implements Condition {

    @Override
    public final boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 获取条件结果
        ConditionOutcome outcome = getMatchOutcome(context, metadata);
        
        // 记录日志
        logOutcome(metadata, outcome);
        
        // 记录消息
        recordEvaluation(context, metadata, outcome);
        
        return outcome.isMatch();
    }
    
    // 由子类实现，获取条件匹配结果
    public abstract ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata);
}
```

常见的条件注解实现类：

1. `OnClassCondition`：对应 `@ConditionalOnClass` 和 `@ConditionalOnMissingClass`
2. `OnBeanCondition`：对应 `@ConditionalOnBean` 和 `@ConditionalOnMissingBean`
3. `OnWebApplicationCondition`：对应 `@ConditionalOnWebApplication`
4. `OnPropertyCondition`：对应 `@ConditionalOnProperty`

## 5. Starter 机制源码分析

### 5.1 Starter 的原理

Spring Boot Starter 的核心是依赖管理和自动配置：

1. 依赖管理：在 `pom.xml` 中定义依赖
2. 自动配置：在 `META-INF/spring.factories` 中声明自动配置类

以 `spring-boot-starter-web` 为例，其包含的主要依赖：

```xml
<!-- 核心 Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>

<!-- Web 相关依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-json</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
</dependency>
```

### 5.2 自动配置类

自动配置类通常使用 `@Configuration` 和条件注解：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@AutoConfigureAfter({ DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
        ValidationAutoConfiguration.class })
public class WebMvcAutoConfiguration {
    // 自动配置逻辑
}
```

### 5.3 spring.factories 机制

Spring Boot 使用 `spring.factories` 文件声明自动配置类：

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration,\
org.springframework.boot.autoconfigure.web.servlet.HttpEncodingAutoConfiguration,\
# 更多自动配置类...
```

`SpringFactoriesLoader` 负责加载这些配置：

```java
public final class SpringFactoriesLoader {
    
    // 加载工厂名称
    public static List<String> loadFactoryNames(Class<?> factoryType, @Nullable ClassLoader classLoader) {
        String factoryTypeName = factoryType.getName();
        return loadSpringFactories(classLoader).getOrDefault(factoryTypeName, Collections.emptyList());
    }
    
    // 加载spring.factories文件
    private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
        // 尝试从缓存获取
        MultiValueMap<String, String> result = cache.get(classLoader);
        if (result != null) {
            return result;
        }

        try {
            // 加载所有META-INF/spring.factories文件
            Enumeration<URL> urls = (classLoader != null ?
                    classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
                    ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
            
            result = new LinkedMultiValueMap<>();
            
            // 解析所有factories文件
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                UrlResource resource = new UrlResource(url);
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                
                // 将属性转换为Map
                for (Map.Entry<?, ?> entry : properties.entrySet()) {
                    String factoryTypeName = ((String) entry.getKey()).trim();
                    
                    // 处理逗号分隔的值
                    for (String factoryImplementationName : StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
                        result.add(factoryTypeName, factoryImplementationName.trim());
                    }
                }
            }
            
            // 放入缓存
            cache.put(classLoader, result);
            return result;
        }
        catch (IOException ex) {
            throw new IllegalArgumentException("Unable to load factories from location [" +
                    FACTORIES_RESOURCE_LOCATION + "]", ex);
        }
    }
}
```

## 6. 嵌入式容器源码分析

### 6.1 嵌入式容器启动流程

嵌入式Web容器的启动流程：

```java
// ServletWebServerApplicationContext类
@Override
protected void onRefresh() {
    super.onRefresh();
    try {
        // 创建Web服务器
        createWebServer();
    }
    catch (Throwable ex) {
        throw new ApplicationContextException("Unable to start web server", ex);
    }
}

private void createWebServer() {
    WebServer webServer = this.webServer;
    ServletContext servletContext = getServletContext();
    
    // 如果尚未创建Web服务器
    if (webServer == null && servletContext == null) {
        // 获取Web服务器工厂
        ServletWebServerFactory factory = getWebServerFactory();
        
        // 创建Web服务器
        this.webServer = factory.getWebServer(getSelfInitializer());
        
        // 发布服务器初始化事件
        getBeanFactory().registerSingleton("webServerGracefulShutdown",
                new WebServerGracefulShutdownLifecycle(this.webServer));
        getBeanFactory().registerSingleton("webServerStartStop",
                new WebServerStartStopLifecycle(this, this.webServer));
    }
    // 如果已有Web服务器但无servlet上下文
    else if (servletContext != null) {
        try {
            // 初始化上下文
            getSelfInitializer().onStartup(servletContext);
        }
        catch (ServletException ex) {
            throw new ApplicationContextException("Cannot initialize servlet context", ex);
        }
    }
    
    // 初始化属性源
    initPropertySources();
}
```

### 6.2 Tomcat 容器源码

TomcatServletWebServerFactory 创建 Tomcat 容器：

```java
public class TomcatServletWebServerFactory extends AbstractServletWebServerFactory
        implements ConfigurableTomcatWebServerFactory, ResourceLoaderAware {
            
    @Override
    public WebServer getWebServer(ServletContextInitializer... initializers) {
        // 创建和配置Tomcat实例
        Tomcat tomcat = new Tomcat();
        
        // 创建临时目录
        File baseDir = (this.baseDirectory != null) ? this.baseDirectory : createTempDir("tomcat");
        tomcat.setBaseDir(baseDir.getAbsolutePath());
        
        // 配置连接器
        Connector connector = new Connector(this.protocol);
        connector.setThrowOnFailure(true);
        tomcat.getService().addConnector(connector);
        
        // 自定义连接器
        customizeConnector(connector);
        tomcat.setConnector(connector);
        
        // 禁用自动部署
        tomcat.getHost().setAutoDeploy(false);
        
        // 配置引擎
        configureEngine(tomcat.getEngine());
        
        // 添加额外连接器
        for (Connector additionalConnector : this.additionalTomcatConnectors) {
            tomcat.getService().addConnector(additionalConnector);
        }
        
        // 准备上下文
        prepareContext(tomcat.getHost(), initializers);
        
        // 创建并返回TomcatWebServer
        return getTomcatWebServer(tomcat);
    }
    
    protected TomcatWebServer getTomcatWebServer(Tomcat tomcat) {
        return new TomcatWebServer(tomcat, getPort() >= 0, getShutdown());
    }
}
```

TomcatWebServer 启动 Tomcat：

```java
public class TomcatWebServer implements WebServer {
    
    public TomcatWebServer(Tomcat tomcat, boolean autoStart, Shutdown shutdown) {
        this.tomcat = tomcat;
        this.autoStart = autoStart;
        this.gracefulShutdown = (shutdown == Shutdown.GRACEFUL) ? new GracefulShutdown(tomcat) : null;
        
        // 初始化
        initialize();
    }
    
    private void initialize() throws WebServerException {
        try {
            // 添加关闭钩子
            addInstanceIdToEngineName();
            
            // 启动Tomcat
            this.tomcat.start();
            
            // 记录启动端口
            startDaemonAwaitThread();
            
            // 记录启动状态
            this.started = true;
            
            // 记录日志
        }
        catch (Exception ex) {
            // 抛出异常前停止Tomcat
            try {
                stopSilently();
            }
            catch (Exception stopException) {
                ex.addSuppressed(stopException);
            }
            throw new WebServerException("Unable to start embedded Tomcat", ex);
        }
    }
}
```

## 7. Spring Boot Actuator 源码分析

### 7.1 Actuator 端点实现

Actuator 端点是通过 `Endpoint` 注解实现的：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Endpoint {
    String id();
    boolean enableByDefault() default true;
}
```

### 7.2 端点注册与暴露

Actuator 使用 `EndpointDiscoverer` 发现并注册端点：

```java
public abstract class EndpointDiscoverer<E extends ExposableEndpoint<O>, O extends Operation> {
    
    // 发现端点
    public Collection<E> getEndpoints() {
        if (this.endpoints == null) {
            // 扫描端点Bean
            Map<EndpointId, EndpointBean> endpointBeans = discoverEndpointBeans();
            
            // 创建可暴露的端点
            Set<E> endpoints = new LinkedHashSet<>(endpointBeans.size());
            for (Map.Entry<EndpointId, EndpointBean> entry : endpointBeans.entrySet()) {
                EndpointId id = entry.getKey();
                EndpointBean endpointBean = entry.getValue();
                
                // 收集端点操作
                O enabledOperation = createEnabledOperation(endpointBean);
                
                // 如果有有效操作，创建可暴露的端点
                if (enabledOperation != null) {
                    endpoints.add(createEndpoint(id, endpointBean.getType(), Collections.singleton(enabledOperation)));
                }
            }
            
            // 排序并缓存
            this.endpoints = Set.copyOf(endpoints);
        }
        return this.endpoints;
    }
}
```

## 8. Spring Boot 核心设计模式与实践

1. **工厂模式**: 用于创建不同类型的对象，如 `WebServerFactory`
2. **模板方法模式**: 定义算法骨架，如 `SpringBootServletInitializer`
3. **观察者模式**: 通过事件和监听器机制实现松耦合通信
4. **策略模式**: 允许在运行时选择算法，如不同类型的 `WebServer`
5. **组合模式**: 通过组合简单对象构建复杂结构
6. **装饰器模式**: 动态添加功能，如各种 `BeanPostProcessor`

## 9. 总结

通过对 Spring Boot 源码的分析，我们可以看到它如何通过自动配置、条件注解、嵌入式容器等技术简化 Spring 应用开发。理解 Spring Boot 的源码实现，可以帮助我们更好地使用框架，解决实际开发中遇到的问题，并在需要时进行自定义扩展。

Spring Boot 的设计思想值得我们学习：
- 约定优于配置
- 开箱即用
- 可扩展性
- 优雅降级

通过分析源码，我们不仅能理解框架的工作原理，还能学习到优秀的设计思想和编程技巧，这对提升我们的架构设计和编码能力都有很大帮助。
