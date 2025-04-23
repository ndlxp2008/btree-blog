# Spring MVC 源码分析

## 1. Spring MVC 框架概述

Spring MVC 是 Spring Framework 的一部分，专注于构建 Web 应用程序。它基于模型-视图-控制器(MVC)设计模式，通过将业务逻辑、数据模型与用户界面分离，提升了代码的可维护性和可测试性。本文将深入分析 Spring MVC 的核心源码实现。

## 2. Spring MVC 核心组件

Spring MVC 的核心组件包括：

- **DispatcherServlet**: 前端控制器，负责接收请求并分发
- **HandlerMapping**: 处理器映射，根据请求查找对应的处理器
- **HandlerAdapter**: 处理器适配器，执行处理器
- **ViewResolver**: 视图解析器，解析逻辑视图名称到具体视图实现
- **Controller**: 控制器，处理请求并返回模型和视图

## 3. DispatcherServlet 源码分析

### 3.1 初始化流程

DispatcherServlet 是 Spring MVC 的核心，它继承自 HttpServlet：

```java
public class DispatcherServlet extends FrameworkServlet {
    
    // 初始化WebApplicationContext
    @Override
    protected WebApplicationContext initWebApplicationContext() {
        WebApplicationContext rootContext = WebApplicationContextUtils.getWebApplicationContext(getServletContext());
        WebApplicationContext wac = null;
        
        // 检查是否已有WebApplicationContext
        if (this.webApplicationContext != null) {
            wac = this.webApplicationContext;
            if (wac instanceof ConfigurableWebApplicationContext) {
                ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) wac;
                if (!cwac.isActive()) {
                    // 初始化ConfigurableWebApplicationContext
                    configureAndRefreshWebApplicationContext(cwac);
                }
            }
        }
        // 查找已存在的WebApplicationContext
        if (wac == null) {
            wac = findWebApplicationContext();
        }
        // 创建新的WebApplicationContext
        if (wac == null) {
            wac = createWebApplicationContext(rootContext);
        }
        
        return wac;
    }
    
    // 初始化Servlet
    @Override
    public void init() throws ServletException {
        super.init();
        initStrategies(getWebApplicationContext());
    }
    
    // 初始化各种策略
    protected void initStrategies(ApplicationContext context) {
        initMultipartResolver(context);
        initLocaleResolver(context);
        initThemeResolver(context);
        initHandlerMappings(context);
        initHandlerAdapters(context);
        initHandlerExceptionResolvers(context);
        initRequestToViewNameTranslator(context);
        initViewResolvers(context);
        initFlashMapManager(context);
    }
}
```

### 3.2 请求处理流程

DispatcherServlet 的核心方法是 `doService` 和 `doDispatch`：

```java
@Override
protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // 记录请求
    logRequest(request);
    
    // 获取当前请求属性的快照，用于恢复
    Map<String, Object> attributesSnapshot = null;
    if (WebUtils.isIncludeRequest(request)) {
        attributesSnapshot = new HashMap<>();
        Enumeration<?> attrNames = request.getAttributeNames();
        while (attrNames.hasMoreElements()) {
            String attrName = (String) attrNames.nextElement();
            if (this.cleanupAfterInclude || attrName.startsWith(DEFAULT_STRATEGIES_PREFIX)) {
                attributesSnapshot.put(attrName, request.getAttribute(attrName));
            }
        }
    }
    
    // 设置请求属性
    request.setAttribute(WEB_APPLICATION_CONTEXT_ATTRIBUTE, getWebApplicationContext());
    request.setAttribute(LOCALE_RESOLVER_ATTRIBUTE, this.localeResolver);
    request.setAttribute(THEME_RESOLVER_ATTRIBUTE, this.themeResolver);
    request.setAttribute(THEME_SOURCE_ATTRIBUTE, getThemeSource());
    
    // 设置Flash Map管理器
    if (this.flashMapManager != null) {
        FlashMap inputFlashMap = this.flashMapManager.retrieveAndUpdate(request, response);
        if (inputFlashMap != null) {
            request.setAttribute(INPUT_FLASH_MAP_ATTRIBUTE, Collections.unmodifiableMap(inputFlashMap));
        }
        request.setAttribute(OUTPUT_FLASH_MAP_ATTRIBUTE, new FlashMap());
        request.setAttribute(FLASH_MAP_MANAGER_ATTRIBUTE, this.flashMapManager);
    }
    
    try {
        // 实际分发请求
        doDispatch(request, response);
    }
    finally {
        // 恢复快照中的请求属性
        if (attributesSnapshot != null) {
            restoreAttributesAfterInclude(request, attributesSnapshot);
        }
    }
}

protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;
    
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
    
    try {
        ModelAndView mv = null;
        Exception dispatchException = null;
        
        try {
            // 检查是否是multipart请求，如果是则解析
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);
            
            // 查找对应的处理器
            mappedHandler = getHandler(processedRequest);
            if (mappedHandler == null) {
                noHandlerFound(processedRequest, response);
                return;
            }
            
            // 获取处理器适配器
            HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler());
            
            // 处理Last-Modified头
            String method = request.getMethod();
            boolean isGet = "GET".equals(method);
            if (isGet || "HEAD".equals(method)) {
                long lastModified = ha.getLastModified(request, mappedHandler.getHandler());
                if (new ServletWebRequest(request, response).checkNotModified(lastModified) && isGet) {
                    return;
                }
            }
            
            // 应用前置拦截器
            if (!mappedHandler.applyPreHandle(processedRequest, response)) {
                return;
            }
            
            // 实际执行处理器，获取ModelAndView
            mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
            
            // 处理异步请求
            if (asyncManager.isConcurrentHandlingStarted()) {
                return;
            }
            
            // 如果视图名为空，设置默认视图名
            applyDefaultViewName(processedRequest, mv);
            
            // 应用后置拦截器
            mappedHandler.applyPostHandle(processedRequest, response, mv);
        }
        catch (Exception ex) {
            dispatchException = ex;
        }
        catch (Throwable err) {
            dispatchException = new NestedServletException("Handler dispatch failed", err);
        }
        
        // 处理结果，包括渲染视图和处理异常
        processDispatchResult(processedRequest, response, mappedHandler, mv, dispatchException);
    }
    catch (Exception ex) {
        triggerAfterCompletion(processedRequest, response, mappedHandler, ex);
    }
    catch (Throwable err) {
        triggerAfterCompletion(processedRequest, response, mappedHandler,
                new NestedServletException("Handler processing failed", err));
    }
    finally {
        // 清理multipart请求
        if (multipartRequestParsed) {
            cleanupMultipart(processedRequest);
        }
    }
}
```

## 4. HandlerMapping 源码分析

HandlerMapping 负责根据请求找到对应的处理器：

```java
public interface HandlerMapping {
    // 根据请求查找处理器执行链
    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
}
```

### 4.1 RequestMappingHandlerMapping

最常用的处理器映射实现是 RequestMappingHandlerMapping，它处理 @RequestMapping 注解：

```java
public class RequestMappingHandlerMapping extends RequestMappingInfoHandlerMapping {
    
    @Override
    protected boolean isHandler(Class<?> beanType) {
        // 判断类是否含有Controller或RequestMapping注解
        return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class) ||
                AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class));
    }
    
    @Override
    protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {
        // 创建RequestMappingInfo
        RequestMappingInfo info = createRequestMappingInfo(method);
        if (info != null) {
            // 创建类级别的RequestMappingInfo
            RequestMappingInfo typeInfo = createRequestMappingInfo(handlerType);
            if (typeInfo != null) {
                // 合并类级别和方法级别的RequestMappingInfo
                info = typeInfo.combine(info);
            }
        }
        return info;
    }
    
    private RequestMappingInfo createRequestMappingInfo(AnnotatedElement element) {
        // 获取RequestMapping注解
        RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(element, RequestMapping.class);
        if (requestMapping != null) {
            // 创建RequestMappingInfo
            return RequestMappingInfo
                    .paths(resolveEmbeddedValuesInPatterns(requestMapping.path()))
                    .methods(requestMapping.method())
                    .params(requestMapping.params())
                    .headers(requestMapping.headers())
                    .consumes(requestMapping.consumes())
                    .produces(requestMapping.produces())
                    .mappingName(requestMapping.name())
                    .build();
        }
        return null;
    }
    
    // 初始化处理器方法
    @Override
    protected void initHandlerMethods() {
        // 获取容器中所有bean
        String[] beanNames = getBeanFactory().getBeanNamesForType(Object.class);
        for (String beanName : beanNames) {
            // 如果bean名不符合，跳过
            if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
                Class<?> beanType = null;
                try {
                    beanType = obtainApplicationContext().getType(beanName);
                }
                catch (Throwable ex) {
                    // 忽略异常
                }
                // 如果获取到类型且是处理器，则处理
                if (beanType != null && isHandler(beanType)) {
                    detectHandlerMethods(beanName);
                }
            }
        }
        handlerMethodsInitialized(getHandlerMethods());
    }
}
```

## 5. HandlerAdapter 源码分析

HandlerAdapter 负责执行处理器：

```java
public interface HandlerAdapter {
    // 是否支持给定的处理器
    boolean supports(Object handler);
    
    // 执行处理器，返回ModelAndView
    ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;
    
    // 获取上次修改时间
    long getLastModified(HttpServletRequest request, Object handler);
}
```

### 5.1 RequestMappingHandlerAdapter

RequestMappingHandlerAdapter 负责执行 @RequestMapping 方法：

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter {
    
    @Override
    protected ModelAndView handleInternal(HttpServletRequest request, HttpServletResponse response,
            HandlerMethod handlerMethod) throws Exception {
        
        ModelAndView mav;
        
        // 检查是否支持请求方法
        checkRequest(request);
        
        // 如果需要会话同步，则同步会话
        if (this.synchronizeOnSession) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                Object mutex = WebUtils.getSessionMutex(session);
                synchronized (mutex) {
                    mav = invokeHandlerMethod(request, response, handlerMethod);
                }
            }
            else {
                mav = invokeHandlerMethod(request, response, handlerMethod);
            }
        }
        else {
            mav = invokeHandlerMethod(request, response, handlerMethod);
        }
        
        // 设置需要解析最终视图的标志
        if (!response.isCommitted()) {
            mav.setViewName(getDefaultViewName(request));
        }
        else {
            mav = null;
        }
        
        return mav;
    }
    
    // 执行处理器方法
    protected ModelAndView invokeHandlerMethod(HttpServletRequest request, HttpServletResponse response,
            HandlerMethod handlerMethod) throws Exception {
        
        ServletWebRequest webRequest = new ServletWebRequest(request, response);
        
        try {
            // 创建WebDataBinderFactory
            WebDataBinderFactory binderFactory = getDataBinderFactory(handlerMethod);
            
            // 创建ModelFactory
            ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
            
            // 创建ServletInvocableHandlerMethod
            ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
            if (this.argumentResolvers != null) {
                invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
            }
            if (this.returnValueHandlers != null) {
                invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
            }
            invocableMethod.setDataBinderFactory(binderFactory);
            invocableMethod.setParameterNameDiscoverer(this.parameterNameDiscoverer);
            
            // 创建ModelAndViewContainer
            ModelAndViewContainer mavContainer = new ModelAndViewContainer();
            mavContainer.addAllAttributes(RequestContextUtils.getInputFlashMap(request));
            
            // 初始化模型
            modelFactory.initModel(webRequest, mavContainer, invocableMethod);
            
            // 执行方法
            invocableMethod.invokeAndHandle(webRequest, mavContainer);
            
            // 根据ModelAndViewContainer创建ModelAndView
            return getModelAndView(mavContainer, modelFactory, webRequest);
        }
        finally {
            webRequest.requestCompleted();
        }
    }
}
```

## 6. 参数解析与返回值处理

### 6.1 HandlerMethodArgumentResolver

HandlerMethodArgumentResolver 负责解析处理器方法的参数：

```java
public interface HandlerMethodArgumentResolver {
    
    // 是否支持给定的参数
    boolean supportsParameter(MethodParameter parameter);
    
    // 解析参数值
    Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception;
}
```

常见的实现包括：

1. **RequestParamMethodArgumentResolver**: 解析 @RequestParam 注解
2. **PathVariableMethodArgumentResolver**: 解析 @PathVariable 注解
3. **RequestBodyMethodArgumentResolver**: 解析 @RequestBody 注解
4. **ModelAttributeMethodArgumentResolver**: 解析 @ModelAttribute 注解

### 6.2 HandlerMethodReturnValueHandler

HandlerMethodReturnValueHandler 负责处理处理器方法的返回值：

```java
public interface HandlerMethodReturnValueHandler {
    
    // 是否支持给定的返回值类型
    boolean supportsReturnType(MethodParameter returnType);
    
    // 处理返回值
    void handleReturnValue(Object returnValue, MethodParameter returnType,
            ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception;
}
```

常见的实现包括：

1. **ModelAndViewMethodReturnValueHandler**: 处理 ModelAndView 返回值
2. **ViewMethodReturnValueHandler**: 处理 View 返回值
3. **ResponseBodyMethodReturnValueHandler**: 处理 @ResponseBody 注解
4. **ModelAttributeMethodProcessor**: 处理 @ModelAttribute 注解

## 7. ViewResolver 源码分析

ViewResolver 负责将逻辑视图名解析为具体的 View 对象：

```java
public interface ViewResolver {
    
    // 解析视图名
    View resolveViewName(String viewName, Locale locale) throws Exception;
}
```

### 7.1 InternalResourceViewResolver

InternalResourceViewResolver 是最常用的视图解析器，用于解析 JSP 视图：

```java
public class InternalResourceViewResolver extends UrlBasedViewResolver {
    
    public InternalResourceViewResolver() {
        setViewClass(InternalResourceView.class);
    }
    
    public InternalResourceViewResolver(String prefix, String suffix) {
        this();
        setPrefix(prefix);
        setSuffix(suffix);
    }
    
    @Override
    protected View createView(String viewName, Locale locale) throws Exception {
        // 对特殊视图名进行检查
        if (viewName.startsWith(REDIRECT_URL_PREFIX)) {
            String redirectUrl = viewName.substring(REDIRECT_URL_PREFIX.length());
            return new RedirectView(redirectUrl, isRedirectContextRelative(), isRedirectHttp10Compatible());
        }
        else if (viewName.startsWith(FORWARD_URL_PREFIX)) {
            String forwardUrl = viewName.substring(FORWARD_URL_PREFIX.length());
            return new InternalResourceView(forwardUrl);
        }
        
        // 默认创建InternalResourceView
        return super.createView(viewName, locale);
    }
}
```

## 8. 过滤器和拦截器的实现

### 8.1 HandlerInterceptor

HandlerInterceptor 允许在请求处理的不同阶段执行额外的逻辑：

```java
public interface HandlerInterceptor {
    
    // 处理器执行前调用
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        return true;
    }
    
    // 处理器执行后调用
    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable ModelAndView modelAndView) throws Exception {
    }
    
    // 请求完成后调用
    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable Exception ex) throws Exception {
    }
}
```

HandlerInterceptor 的执行由 HandlerExecutionChain 管理：

```java
public class HandlerExecutionChain {
    
    private final Object handler;
    private final List<HandlerInterceptor> interceptorList = new ArrayList<>();
    private int interceptorIndex = -1;
    
    public boolean applyPreHandle(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 按顺序执行所有拦截器的preHandle方法
        for (int i = 0; i < this.interceptorList.size(); i++) {
            HandlerInterceptor interceptor = this.interceptorList.get(i);
            if (!interceptor.preHandle(request, response, this.handler)) {
                // 拦截器返回false，触发afterCompletion
                triggerAfterCompletion(request, response, null);
                return false;
            }
            this.interceptorIndex = i;
        }
        return true;
    }
    
    public void applyPostHandle(HttpServletRequest request, HttpServletResponse response, ModelAndView mv)
            throws Exception {
        // 按逆序执行所有拦截器的postHandle方法
        for (int i = this.interceptorList.size() - 1; i >= 0; i--) {
            HandlerInterceptor interceptor = this.interceptorList.get(i);
            interceptor.postHandle(request, response, this.handler, mv);
        }
    }
    
    public void triggerAfterCompletion(HttpServletRequest request, HttpServletResponse response, Exception ex)
            throws Exception {
        // 按逆序执行所有已执行的拦截器的afterCompletion方法
        for (int i = this.interceptorIndex; i >= 0; i--) {
            HandlerInterceptor interceptor = this.interceptorList.get(i);
            try {
                interceptor.afterCompletion(request, response, this.handler, ex);
            }
            catch (Throwable ex2) {
                logger.error("HandlerInterceptor.afterCompletion threw exception", ex2);
            }
        }
    }
}
```

## 9. 注解驱动原理

Spring MVC 的注解驱动是通过 @EnableWebMvc 注解实现的：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(DelegatingWebMvcConfiguration.class)
public @interface EnableWebMvc {
}
```

DelegatingWebMvcConfiguration 负责导入核心配置：

```java
@Configuration(proxyBeanMethods = false)
public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
    
    private final WebMvcConfigurerComposite configurers = new WebMvcConfigurerComposite();
    
    @Autowired(required = false)
    public void setConfigurers(List<WebMvcConfigurer> configurers) {
        if (!CollectionUtils.isEmpty(configurers)) {
            this.configurers.addWebMvcConfigurers(configurers);
        }
    }
    
    // 委托方法
    @Override
    protected void configurePathMatch(PathMatchConfigurer configurer) {
        this.configurers.configurePathMatch(configurer);
    }
    
    @Override
    protected void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        this.configurers.configureContentNegotiation(configurer);
    }
    
    // 其他委托方法...
}
```

## 10. 总结

通过分析 Spring MVC 的源码，我们可以看到它是如何通过前端控制器模式、适配器模式、策略模式等设计模式，实现一个灵活、可扩展的 Web 框架。核心流程包括：

1. DispatcherServlet 接收请求
2. HandlerMapping 找到对应的处理器
3. HandlerAdapter 执行处理器
4. 处理返回值
5. ViewResolver 解析视图
6. 渲染视图返回给客户端

理解 Spring MVC 的源码实现，可以帮助我们更好地使用框架，解决实际开发中遇到的问题，并在需要时进行自定义扩展或与其他框架集成。
