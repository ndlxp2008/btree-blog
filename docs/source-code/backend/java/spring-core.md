# Spring 核心源码分析

## 1. Spring 框架概述

Spring Framework 是 Java 平台的一个开源应用框架，提供了一套完善的基础设施支持，使开发者可以专注于应用程序的开发。Spring 的核心是其控制反转(IoC)容器和面向切面编程(AOP)功能。本文将深入分析 Spring 的核心源码实现。

## 2. Spring 核心模块结构

Spring 框架的核心模块主要包括：

- **spring-core**: 基础核心工具类，Spring 其他模块都依赖于此
- **spring-beans**: Bean 工厂与 Bean 的装配
- **spring-context**: 上下文容器，扩展了 BeanFactory
- **spring-expression**: Spring 表达式语言(SpEL)
- **spring-aop**: 面向切面编程的实现

核心源代码包结构：

```
org.springframework
  ├── beans         - Bean 工厂与定义
  ├── context       - 应用上下文
  ├── core          - 核心工具类
  ├── aop           - AOP 实现
  └── expression    - 表达式语言
```

## 3. IoC 容器实现原理

### 3.1 IoC 基本概念

IoC(Inversion of Control, 控制反转)是 Spring 的核心，它将传统上由应用程序代码直接创建依赖对象的控制权，转移到容器，由容器负责创建、配置和管理对象及其依赖。

### 3.2 BeanFactory 源码分析

BeanFactory 是 Spring IoC 容器的根接口，定义了获取 Bean 的基本方法：

```java
public interface BeanFactory {
    // 根据名称获取 Bean
    Object getBean(String name) throws BeansException;
    
    // 根据类型获取 Bean
    <T> T getBean(Class<T> requiredType) throws BeansException;
    
    // 检查容器中是否包含指定名称的 Bean
    boolean containsBean(String name);
    
    // 其他方法...
}
```

DefaultListableBeanFactory 是 BeanFactory 的默认实现：

```java
public class DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory 
        implements ConfigurableListableBeanFactory, BeanDefinitionRegistry {
    
    // Bean 定义的存储
    private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
    
    // Bean 名称列表
    private volatile List<String> beanDefinitionNames = new ArrayList<>(256);
    
    // 注册 Bean 定义
    @Override
    public void registerBeanDefinition(String beanName, BeanDefinition beanDefinition) {
        // 检查是否已存在
        if (this.beanDefinitionMap.containsKey(beanName)) {
            // 处理已存在的 Bean 定义...
        } else {
            // 注册新的 Bean 定义
            this.beanDefinitionMap.put(beanName, beanDefinition);
            this.beanDefinitionNames.add(beanName);
        }
    }
    
    // 获取 Bean 实例
    @Override
    public Object getBean(String name) throws BeansException {
        return doGetBean(name, null, null, false);
    }
    
    // 实际的 Bean 获取逻辑
    protected <T> T doGetBean(String name, Class<T> requiredType, Object[] args, boolean typeCheckOnly) {
        // 获取规范化的 Bean 名称
        String beanName = transformedBeanName(name);
        Object bean;
        
        // 检查单例缓存中是否已存在
        Object sharedInstance = getSingleton(beanName);
        if (sharedInstance != null && args == null) {
            // 从缓存获取 Bean
            bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
        } else {
            // 创建 Bean 实例
            // 1. 检查是否存在父 BeanFactory
            // 2. 合并 Bean 定义
            // 3. 创建 Bean 实例
            // 4. 初始化 Bean
            // 5. 注册销毁回调
            // 6. 返回创建的 Bean
        }
        
        return (T) bean;
    }
}
```

### 3.3 ApplicationContext 源码分析

ApplicationContext 接口扩展了 BeanFactory，添加了更多企业级功能：

```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, 
        HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
    
    // 获取应用上下文的唯一标识
    String getId();
    
    // 获取上下文名称
    String getApplicationName();
    
    // 获取上下文显示名称
    String getDisplayName();
    
    // 获取上下文首次加载时间
    long getStartupDate();
    
    // 获取父上下文
    ApplicationContext getParent();
    
    // 获取 AutowireCapableBeanFactory
    AutowireCapableBeanFactory getAutowireCapableBeanFactory() throws IllegalStateException;
}
```

AnnotationConfigApplicationContext 是基于注解配置的应用上下文实现：

```java
public class AnnotationConfigApplicationContext extends GenericApplicationContext implements AnnotationConfigRegistry {
    
    private final AnnotatedBeanDefinitionReader reader;
    private final ClassPathBeanDefinitionScanner scanner;
    
    // 默认构造函数
    public AnnotationConfigApplicationContext() {
        this.reader = new AnnotatedBeanDefinitionReader(this);
        this.scanner = new ClassPathBeanDefinitionScanner(this);
    }
    
    // 基于配置类的构造函数
    public AnnotationConfigApplicationContext(Class<?>... componentClasses) {
        this();
        register(componentClasses);
        refresh();
    }
    
    // 基于包扫描的构造函数
    public AnnotationConfigApplicationContext(String... basePackages) {
        this();
        scan(basePackages);
        refresh();
    }
    
    // 注册配置类
    @Override
    public void register(Class<?>... componentClasses) {
        for (Class<?> componentClass : componentClasses) {
            registerBean(componentClass);
        }
    }
    
    // 扫描包
    @Override
    public void scan(String... basePackages) {
        this.scanner.scan(basePackages);
    }
}
```

### 3.4 Bean 的生命周期

Spring Bean 的完整生命周期包括多个阶段：

1. **实例化(Instantiation)**: 创建 Bean 实例
2. **属性赋值(Populate Properties)**: 设置 Bean 属性
3. **初始化前(Pre-Initialization)**: 调用 BeanPostProcessor 的 postProcessBeforeInitialization 方法
4. **初始化(Initialization)**: 调用初始化方法(如 @PostConstruct、InitializingBean 接口或 init-method)
5. **初始化后(Post-Initialization)**: 调用 BeanPostProcessor 的 postProcessAfterInitialization 方法
6. **使用(In Use)**: Bean 可以被应用程序使用
7. **销毁前(Pre-Destruction)**: 调用 DestructionAwareBeanPostProcessor 的方法
8. **销毁(Destruction)**: 调用销毁方法(如 @PreDestroy、DisposableBean 接口或 destroy-method)

源码中的 Bean 创建过程：

```java
// AbstractAutowireCapableBeanFactory 类
protected Object createBean(String beanName, RootBeanDefinition mbd, Object[] args) {
    // 解析 Bean 类
    Class<?> resolvedClass = resolveBeanClass(mbd, beanName);
    
    // 准备方法覆写
    try {
        mbdToUse.prepareMethodOverrides();
    } catch (BeanDefinitionValidationException ex) {
        throw new BeanDefinitionStoreException(mbdToUse.getResourceDescription(), beanName, 
                "Validation of method overrides failed", ex);
    }
    
    try {
        // 给 BeanPostProcessors 机会返回代理对象
        Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
        if (bean != null) {
            return bean;
        }
    } catch (Throwable ex) {
        throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName, 
                "BeanPostProcessor before instantiation of bean failed", ex);
    }
    
    try {
        // 创建 Bean 实例
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        return beanInstance;
    } catch (BeanCreationException | ImplicitlyAppearedSingletonException ex) {
        throw ex;
    } catch (Throwable ex) {
        throw new BeanCreationException(mbdToUse.getResourceDescription(), beanName, 
                "Unexpected exception during bean creation", ex);
    }
}

// 实际创建 Bean 的方法
protected Object doCreateBean(String beanName, RootBeanDefinition mbd, Object[] args) {
    // 实例化 Bean
    BeanWrapper instanceWrapper = createBeanInstance(beanName, mbd, args);
    
    // 初始化 Bean 实例
    Object exposedObject = instanceWrapper.getWrappedInstance();
    
    // 填充 Bean 属性
    populateBean(beanName, mbd, instanceWrapper);
    
    // 初始化 Bean
    exposedObject = initializeBean(beanName, exposedObject, mbd);
    
    // 注册 Bean 的销毁方法
    registerDisposableBeanIfNecessary(beanName, bean, mbd);
    
    return exposedObject;
}
```

## 4. 依赖注入源码分析

### 4.1 自动装配

Spring 的自动装配是通过 AutowiredAnnotationBeanPostProcessor 实现的：

```java
public class AutowiredAnnotationBeanPostProcessor extends InstantiationAwareBeanPostProcessorAdapter 
        implements MergedBeanDefinitionPostProcessor, PriorityOrdered, BeanFactoryAware {
    
    // 处理自动装配注解
    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) {
        // 查找需要注入的元数据
        InjectionMetadata metadata = findAutowiringMetadata(beanName, bean.getClass(), pvs);
        try {
            // 执行依赖注入
            metadata.inject(bean, beanName, pvs);
        } catch (BeanCreationException ex) {
            throw ex;
        } catch (Throwable ex) {
            throw new BeanCreationException(beanName, "Injection of autowired dependencies failed", ex);
        }
        return pvs;
    }
    
    // 查找自动装配元数据
    private InjectionMetadata findAutowiringMetadata(String beanName, Class<?> clazz, PropertyValues pvs) {
        // 缓存键
        String cacheKey = (StringUtils.hasLength(beanName) ? beanName : clazz.getName());
        
        // 从缓存获取
        InjectionMetadata metadata = this.injectionMetadataCache.get(cacheKey);
        if (InjectionMetadata.needsRefresh(metadata, clazz)) {
            synchronized (this.injectionMetadataCache) {
                // 双重检查
                metadata = this.injectionMetadataCache.get(cacheKey);
                if (InjectionMetadata.needsRefresh(metadata, clazz)) {
                    // 清除缓存
                    if (metadata != null) {
                        metadata.clear(pvs);
                    }
                    // 构建自动装配元数据
                    metadata = buildAutowiringMetadata(clazz);
                    // 放入缓存
                    this.injectionMetadataCache.put(cacheKey, metadata);
                }
            }
        }
        return metadata;
    }
    
    // 构建自动装配元数据
    private InjectionMetadata buildAutowiringMetadata(Class<?> clazz) {
        // 查找所有需要注入的字段和方法
        // 创建 InjectionMetadata 对象
        // 返回元数据
    }
}
```

### 4.2 依赖解析

DefaultListableBeanFactory 的 resolveDependency 方法负责解析依赖：

```java
public Object resolveDependency(DependencyDescriptor descriptor, String requestingBeanName, 
        Set<String> autowiredBeanNames, TypeConverter typeConverter) {
    
    // 获取参数类型
    Class<?> type = descriptor.getDependencyType();
    
    // 尝试使用 AutowireCandidateResolver
    Object value = getAutowireCandidateResolver().getSuggestedValue(descriptor);
    if (value != null) {
        return value;
    }
    
    // 如果是数组类型
    if (type.isArray()) {
        // 处理数组依赖
    }
    // 如果是集合类型
    else if (Collection.class.isAssignableFrom(type)) {
        // 处理集合依赖
    }
    // 如果是Map类型
    else if (Map.class == type) {
        // 处理Map依赖
    }
    // 如果是标准类型，查找并返回匹配的 Bean
    else {
        return resolveCandidate(descriptor, requestingBeanName, autowiredBeanNames);
    }
}
```

## 5. AOP 源码实现

### 5.1 AOP 基本概念

AOP(Aspect-Oriented Programming, 面向切面编程)是一种编程范式，允许你在不修改源代码的情况下向现有代码添加行为。Spring AOP 使用两种方式实现：基于 JDK 动态代理和基于 CGLIB 的字节码生成。

### 5.2 代理创建

ProxyFactory 负责创建AOP代理：

```java
public class ProxyFactory extends ProxyCreatorSupport {
    
    public Object getProxy() {
        return createAopProxy().getProxy();
    }
    
    public Object getProxy(ClassLoader classLoader) {
        return createAopProxy().getProxy(classLoader);
    }
}

// 根据配置创建合适的AOP代理
protected final synchronized AopProxy createAopProxy() {
    if (!this.active) {
        activate();
    }
    return getAopProxyFactory().createAopProxy(this);
}

// DefaultAopProxyFactory 实现
public class DefaultAopProxyFactory implements AopProxyFactory {
    
    @Override
    public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
        // 判断使用 JDK 动态代理还是 CGLIB
        if (config.isOptimize() || config.isProxyTargetClass() || 
                hasNoUserSuppliedProxyInterfaces(config)) {
            Class<?> targetClass = config.getTargetClass();
            
            // 如果目标类是接口或已经是代理，使用 JDK 动态代理
            if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
                return new JdkDynamicAopProxy(config);
            }
            // 否则使用 CGLIB
            return new ObjenesisCglibAopProxy(config);
        } else {
            // 默认使用 JDK 动态代理
            return new JdkDynamicAopProxy(config);
        }
    }
}
```

### 5.3 JDK 动态代理实现

```java
final class JdkDynamicAopProxy implements AopProxy, InvocationHandler {
    
    private final AdvisedSupport advised;
    
    public JdkDynamicAopProxy(AdvisedSupport config) {
        this.advised = config;
    }
    
    @Override
    public Object getProxy() {
        return getProxy(ClassUtils.getDefaultClassLoader());
    }
    
    @Override
    public Object getProxy(ClassLoader classLoader) {
        // 获取代理接口
        Class<?>[] proxiedInterfaces = AopProxyUtils.completeProxiedInterfaces(this.advised, true);
        
        // 创建代理对象
        return Proxy.newProxyInstance(classLoader, proxiedInterfaces, this);
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 方法调用拦截逻辑
        
        // 获取目标对象
        Object target = this.advised.getTargetSource().getTarget();
        
        // 获取拦截器链
        List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
        
        // 如果没有拦截器，直接调用目标方法
        if (chain.isEmpty()) {
            return AopUtils.invokeJoinpointUsingReflection(target, method, args);
        } else {
            // 创建方法调用对象
            MethodInvocation invocation = new ReflectiveMethodInvocation(proxy, target, method, args, 
                    targetClass, chain);
            
            // 执行拦截器链
            return invocation.proceed();
        }
    }
}
```

### 5.4 CGLIB 代理实现

```java
class CglibAopProxy implements AopProxy {
    
    protected final AdvisedSupport advised;
    
    public CglibAopProxy(AdvisedSupport config) {
        this.advised = config;
    }
    
    @Override
    public Object getProxy() {
        return getProxy(ClassUtils.getDefaultClassLoader());
    }
    
    @Override
    public Object getProxy(ClassLoader classLoader) {
        // 创建增强器
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(this.advised.getTargetClass());
        enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
        enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
        enhancer.setStrategy(new ClassLoaderAwareUndeclaredThrowableStrategy(classLoader));
        
        // 配置回调
        Callback[] callbacks = getCallbacks(rootClass);
        enhancer.setCallbacks(callbacks);
        enhancer.setCallbackFilter(new ProxyCallbackFilter(this.advised));
        
        // 创建代理对象
        return enhancer.create();
    }
    
    // 获取回调函数
    private Callback[] getCallbacks(Class<?> rootClass) {
        // 创建拦截器
        DynamicAdvisedInterceptor interceptor = new DynamicAdvisedInterceptor(this.advised);
        
        // 返回回调数组
        Callback[] callbacks = new Callback[] {
            interceptor,  // 用于拦截方法调用
            new SerializableNoOp(),  // 用于序列化方法
            new EqualsInterceptor(this.advised),  // 拦截 equals 方法
            new HashCodeInterceptor(this.advised),  // 拦截 hashCode 方法
            new MethodInterceptor() { /* ... */ }  // 拦截 advised 方法
        };
        
        return callbacks;
    }
    
    // 方法拦截器
    private static class DynamicAdvisedInterceptor implements MethodInterceptor {
        
        private final AdvisedSupport advised;
        
        public DynamicAdvisedInterceptor(AdvisedSupport advised) {
            this.advised = advised;
        }
        
        @Override
        public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
            // 获取目标对象
            Object target = this.advised.getTargetSource().getTarget();
            
            // 获取拦截器链
            List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
            
            // 如果没有拦截器，直接调用目标方法
            if (chain.isEmpty()) {
                return methodProxy.invoke(target, args);
            } else {
                // 创建方法调用对象
                MethodInvocation invocation = new CglibMethodInvocation(proxy, target, method, args, 
                        targetClass, chain, methodProxy);
                
                // 执行拦截器链
                return invocation.proceed();
            }
        }
    }
}
```

## 6. SpringBoot 如何扩展 Spring

SpringBoot 基于 Spring 框架，通过自动配置和约定优于配置的理念简化了 Spring 应用的开发。其主要扩展核心包括：

### 6.1 自动配置

SpringBoot 使用 @EnableAutoConfiguration 注解触发自动配置：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    // ...
}
```

AutoConfigurationImportSelector 负责加载自动配置类：

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector {
    
    @Override
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        // 获取自动配置条目
        List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
        
        // 移除重复项
        configurations = removeDuplicates(configurations);
        
        // 排除指定的配置
        Set<String> exclusions = getExclusions(annotationMetadata, attributes);
        configurations.removeAll(exclusions);
        
        // 过滤不符合条件的配置
        configurations = filter(configurations, autoConfigurationMetadata);
        
        // 触发自动配置导入事件
        fireAutoConfigurationImportEvents(configurations, exclusions);
        
        return StringUtils.toStringArray(configurations);
    }
    
    // 获取候选配置
    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        // 从 META-INF/spring.factories 加载配置
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
                EnableAutoConfiguration.class, getBeanClassLoader());
        return configurations;
    }
}
```

### 6.2 条件注解

SpringBoot 使用条件注解控制自动配置行为，如 @ConditionalOnClass、@ConditionalOnMissingBean 等：

```java
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(OnClassCondition.class)
public @interface ConditionalOnClass {
    Class<?>[] value() default {};
    String[] name() default {};
}

public class OnClassCondition extends SpringBootCondition {
    
    @Override
    public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 获取注解属性
        MultiValueMap<String, Object> attributes = metadata.getAllAnnotationAttributes(
                ConditionalOnClass.class.getName(), true);
        
        // 检查类是否存在
        List<String> classNames = collect(attributes, "name");
        for (String className : classNames) {
            if (!isPresent(className, context.getClassLoader())) {
                return ConditionOutcome.noMatch("Class " + className + " not found");
            }
        }
        
        return ConditionOutcome.match();
    }
    
    private boolean isPresent(String className, ClassLoader classLoader) {
        try {
            Class.forName(className, false, classLoader);
            return true;
        } catch (ClassNotFoundException ex) {
            return false;
        }
    }
}
```

## 7. 总结

通过对 Spring 核心源码的分析，我们可以看到 Spring 是如何实现 IoC 容器、依赖注入和 AOP 等核心功能的。理解这些源码实现，可以帮助我们更好地利用 Spring 框架，解决实际开发中遇到的问题，并在需要时扩展框架功能。

Spring 的设计思想值得我们学习，如：
- 面向接口编程
- 模板方法模式
- 工厂模式
- 策略模式
- 观察者模式
- 代理模式

通过分析源码，我们不仅能理解框架的工作原理，还能学习到优秀的设计思想和编程技巧，这对提升我们的架构设计和编码能力都有很大帮助。
