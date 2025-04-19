# Spring Framework

## 1. Spring框架概述

Spring Framework是一个开源的Java平台，为开发企业级应用提供全面的基础架构支持。Spring以其简单性、可测试性和松耦合性闻名，已成为Java企业级开发的事实标准。

### 1.1 核心特性

- **控制反转(IoC)**: 通过依赖注入实现对象的松耦合
- **面向切面编程(AOP)**: 分离应用的业务逻辑与系统服务
- **数据访问抽象**: 简化与各种数据库技术的集成
- **事务管理**: 提供一致的事务抽象，支持声明式和编程式事务
- **MVC Web框架**: 用于构建灵活、可扩展的Web应用
- **测试支持**: 简化单元测试和集成测试

### 1.2 Spring模块结构

Spring框架由约20个模块组成，可分为以下核心区域：

1. **核心容器**: Core, Beans, Context, SpEL
2. **AOP和Instrumentation**: AOP, Aspects, Instrumentation
3. **消息**: Messaging
4. **数据访问/集成**: JDBC, ORM, OXM, JMS, Transactions
5. **Web**: WebMVC, WebFlux, WebSocket
6. **测试**: Test

## 2. Spring IoC容器

### 2.1 IoC容器概念

IoC（Inversion of Control，控制反转）是Spring的核心，由容器管理对象的创建、配置和生命周期，而不是由应用程序代码控制。

### 2.2 Bean定义与注册

#### XML配置方式

```xml
<!-- applicationContext.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="com.example.service.UserServiceImpl">
        <property name="userRepository" ref="userRepository"/>
    </bean>

    <bean id="userRepository" class="com.example.repository.JdbcUserRepository">
        <constructor-arg ref="dataSource"/>
    </bean>

    <bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource" destroy-method="close">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
        <property name="username" value="user"/>
        <property name="password" value="password"/>
    </bean>
</beans>
```

#### Java注解方式

```java
@Configuration
public class AppConfig {

    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/mydb");
        dataSource.setUsername("user");
        dataSource.setPassword("password");
        return dataSource;
    }

    @Bean
    public UserRepository userRepository(DataSource dataSource) {
        return new JdbcUserRepository(dataSource);
    }

    @Bean
    public UserService userService(UserRepository userRepository) {
        UserServiceImpl service = new UserServiceImpl();
        service.setUserRepository(userRepository);
        return service;
    }
}
```

### 2.3 依赖注入方式

#### 构造函数注入

```java
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 方法实现...
}
```

```xml
<bean id="userService" class="com.example.service.UserServiceImpl">
    <constructor-arg ref="userRepository"/>
</bean>
```

#### Setter方法注入

```java
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 方法实现...
}
```

```xml
<bean id="userService" class="com.example.service.UserServiceImpl">
    <property name="userRepository" ref="userRepository"/>
</bean>
```

#### 字段注入(使用注解)

```java
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // 方法实现...
}
```

### 2.4 Bean生命周期

1. **实例化** - 创建Bean实例
2. **属性赋值** - 设置Bean属性
3. **初始化前** - BeanPostProcessor的postProcessBeforeInitialization方法
4. **初始化** - 调用初始化方法(@PostConstruct, InitializingBean, init-method)
5. **初始化后** - BeanPostProcessor的postProcessAfterInitialization方法
6. **使用** - Bean在应用中使用
7. **销毁前** - DestructionAwareBeanPostProcessor处理
8. **销毁** - 调用销毁方法(@PreDestroy, DisposableBean, destroy-method)

```java
public class ExampleBean implements InitializingBean, DisposableBean {

    // 构造函数
    public ExampleBean() {
        System.out.println("Bean实例化");
    }

    // 属性
    private String property;

    public void setProperty(String property) {
        this.property = property;
        System.out.println("设置属性");
    }

    // 初始化前
    @PostConstruct
    public void postConstruct() {
        System.out.println("@PostConstruct");
    }

    // InitializingBean接口
    @Override
    public void afterPropertiesSet() {
        System.out.println("InitializingBean初始化");
    }

    // 自定义初始化方法
    public void customInit() {
        System.out.println("自定义初始化方法");
    }

    // 销毁前
    @PreDestroy
    public void preDestroy() {
        System.out.println("@PreDestroy");
    }

    // DisposableBean接口
    @Override
    public void destroy() {
        System.out.println("DisposableBean销毁");
    }

    // 自定义销毁方法
    public void customDestroy() {
        System.out.println("自定义销毁方法");
    }
}
```

## 3. Spring AOP

### 3.1 AOP概念

AOP（Aspect-Oriented Programming，面向切面编程）允许将横切关注点（如日志记录、事务管理）与业务逻辑分离。

### 3.2 核心概念

- **切面(Aspect)**: 横切关注点的模块化
- **连接点(Join Point)**: 程序执行过程中的特定点
- **通知(Advice)**: 在连接点执行的动作
- **切入点(Pointcut)**: 匹配连接点的表达式
- **引入(Introduction)**: 向现有类添加方法或字段
- **目标对象(Target Object)**: 被一个或多个切面通知的对象
- **AOP代理(AOP Proxy)**: 由AOP框架创建的代理对象
- **织入(Weaving)**: 将切面与应用程序连接的过程

### 3.3 通知类型

- **前置通知(Before)**: 在连接点之前执行
- **后置通知(After)**: 在连接点之后执行，无论方法是否成功完成
- **返回通知(After-returning)**: 在连接点成功完成后执行
- **异常通知(After-throwing)**: 在连接点抛出异常时执行
- **环绕通知(Around)**: 在连接点前后执行，可以控制是否继续执行连接点

### 3.4 实现示例

#### 启用AOP

```java
@Configuration
@EnableAspectJAutoProxy  // 启用AspectJ自动代理
public class AppConfig {
    // 配置...
}
```

#### 定义切面

```java
@Aspect
@Component
public class LoggingAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    @Before("serviceMethods()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("执行方法前: {}", joinPoint.getSignature().toShortString());
    }

    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("方法返回: {}, 结果: {}", joinPoint.getSignature().toShortString(), result);
    }

    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Exception ex) {
        logger.error("方法异常: {}, 异常信息: {}", joinPoint.getSignature().toShortString(), ex.getMessage());
    }

    @Around("serviceMethods()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsedTime = System.currentTimeMillis() - start;
            logger.info("方法: {} 执行时间: {}ms", joinPoint.getSignature().toShortString(), elapsedTime);
            return result;
        } catch (Throwable throwable) {
            logger.error("环绕通知捕获异常", throwable);
            throw throwable;
        }
    }
}
```

## 4. Spring数据访问

### 4.1 JDBC抽象

Spring JDBC提供了JdbcTemplate等抽象类，简化了JDBC操作:

```java
@Repository
public class JdbcUserRepository implements UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcUserRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public User findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT id, username, email FROM users WHERE id = ?",
            new Object[]{id},
            (rs, rowNum) -> new User(
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("email")
            )
        );
    }

    @Override
    public List<User> findAll() {
        return jdbcTemplate.query(
            "SELECT id, username, email FROM users",
            (rs, rowNum) -> new User(
                rs.getLong("id"),
                rs.getString("username"),
                rs.getString("email")
            )
        );
    }

    @Override
    public void save(User user) {
        if (user.getId() == null) {
            jdbcTemplate.update(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                user.getUsername(), user.getEmail()
            );
        } else {
            jdbcTemplate.update(
                "UPDATE users SET username = ?, email = ? WHERE id = ?",
                user.getUsername(), user.getEmail(), user.getId()
            );
        }
    }

    @Override
    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM users WHERE id = ?", id);
    }
}
```

### 4.2 ORM集成

Spring无缝集成了主流ORM框架，如Hibernate, JPA:

```java
@Repository
public class JpaUserRepository implements UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User findById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public List<User> findAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    @Override
    @Transactional
    public void save(User user) {
        if (user.getId() == null) {
            entityManager.persist(user);
        } else {
            entityManager.merge(user);
        }
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        User user = findById(id);
        if (user != null) {
            entityManager.remove(user);
        }
    }
}
```

### 4.3 事务管理

Spring提供了声明式事务和编程式事务:

#### 声明式事务

```java
@Configuration
@EnableTransactionManagement
public class TransactionConfig {

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}
```

```java
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void registerUser(User user) {
        // 业务逻辑
        userRepository.save(user);
        // 如果这里抛出异常，事务会回滚
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED,
                  timeout = 30, rollbackFor = Exception.class)
    public void complexOperation() {
        // 复杂业务逻辑
    }
}
```

#### 编程式事务

```java
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PlatformTransactionManager transactionManager;

    public UserServiceImpl(UserRepository userRepository, PlatformTransactionManager transactionManager) {
        this.userRepository = userRepository;
        this.transactionManager = transactionManager;
    }

    @Override
    public void registerUserProgrammatically(User user) {
        TransactionDefinition def = new DefaultTransactionDefinition();
        TransactionStatus status = transactionManager.getTransaction(def);
        try {
            // 业务逻辑
            userRepository.save(user);
            transactionManager.commit(status);
        } catch (Exception ex) {
            transactionManager.rollback(status);
            throw ex;
        }
    }
}
```

## 5. Spring MVC

### 5.1 MVC架构概述

Spring MVC是基于Servlet API构建的Web框架，实现了MVC(Model-View-Controller)设计模式。

### 5.2 DispatcherServlet

DispatcherServlet是Spring MVC的核心，作为前端控制器处理所有HTTP请求和响应:

```xml
<!-- web.xml -->
<servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/spring-mvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

### 5.3 控制器

```java
@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.findAll());
        return "user/list";  // 视图名
    }

    @GetMapping("/{id}")
    public String getUserDetails(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        return "user/details";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "user/register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") User user,
                              BindingResult result, RedirectAttributes redirect) {
        if (result.hasErrors()) {
            return "user/register";
        }

        userService.registerUser(user);
        redirect.addFlashAttribute("message", "注册成功!");
        return "redirect:/users";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        return "user/edit";
    }

    @PostMapping("/{id}/edit")
    public String updateUser(@PathVariable Long id, @Valid @ModelAttribute("user") User user,
                            BindingResult result, RedirectAttributes redirect) {
        if (result.hasErrors()) {
            return "user/edit";
        }

        user.setId(id);
        userService.save(user);
        redirect.addFlashAttribute("message", "用户更新成功!");
        return "redirect:/users";
    }

    @GetMapping("/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirect) {
        userService.deleteById(id);
        redirect.addFlashAttribute("message", "用户删除成功!");
        return "redirect:/users";
    }
}
```

### 5.4 视图解析器

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
```

### 5.5 拦截器

```java
public class LoggingInterceptor implements HandlerInterceptor {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("请求URL: {}", request.getRequestURL().toString());
        request.setAttribute("startTime", System.currentTimeMillis());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        long duration = System.currentTimeMillis() - (Long) request.getAttribute("startTime");
        logger.info("请求处理时间: {}ms", duration);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        if (ex != null) {
            logger.error("请求处理异常", ex);
        }
    }
}

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor()).addPathPatterns("/**");
    }
}
```

## 6. Spring测试

### 6.1 单元测试

```java
public class UserServiceTest {

    private UserService userService;
    private UserRepository userRepository;

    @Before
    public void setup() {
        userRepository = mock(UserRepository.class);
        userService = new UserServiceImpl(userRepository);
    }

    @Test
    public void testFindById() {
        // 准备测试数据
        User expectedUser = new User(1L, "testuser", "test@example.com");
        when(userRepository.findById(1L)).thenReturn(expectedUser);

        // 执行测试
        User actualUser = userService.findById(1L);

        // 验证结果
        assertEquals(expectedUser, actualUser);
        verify(userRepository).findById(1L);
    }
}
```

### 6.2 集成测试

```java
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {AppConfig.class})
public class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional  // 测试后自动回滚
    public void testSaveAndFindById() {
        // 创建测试用户
        User user = new User(null, "testuser", "test@example.com");

        // 保存用户
        userRepository.save(user);
        assertNotNull(user.getId());

        // 查询用户
        User foundUser = userRepository.findById(user.getId());

        // 验证结果
        assertNotNull(foundUser);
        assertEquals(user.getUsername(), foundUser.getUsername());
        assertEquals(user.getEmail(), foundUser.getEmail());
    }
}
```

### 6.3 Web MVC测试

```java
@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void testGetUserById() throws Exception {
        User user = new User(1L, "testuser", "test@example.com");
        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/users/1"))
            .andExpect(status().isOk())
            .andExpect(view().name("user/details"))
            .andExpect(model().attributeExists("user"))
            .andExpect(model().attribute("user", user));
    }

    @Test
    public void testRegisterUser() throws Exception {
        mockMvc.perform(post("/users/register")
                .param("username", "newuser")
                .param("email", "newuser@example.com"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/users"))
            .andExpect(flash().attributeExists("message"));

        verify(userService).registerUser(any(User.class));
    }
}
```

## 7. Spring最佳实践

### 7.1 组件扫描与自动装配

```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    // 配置...
}
```

### 7.2 属性注入

```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig {

    @Value("${jdbc.url}")
    private String jdbcUrl;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }
}
```

### 7.3 条件化Bean注册

```java
@Configuration
public class AppConfig {

    @Bean
    @Profile("development")
    public DataSource devDataSource() {
        // 开发环境数据源配置
    }

    @Bean
    @Profile("production")
    public DataSource prodDataSource() {
        // 生产环境数据源配置
    }

    @Bean
    @ConditionalOnProperty(name = "cache.enabled", havingValue = "true")
    public CacheManager cacheManager() {
        // 缓存管理器配置
    }
}
```

### 7.4 事件监听

```java
// 自定义事件
public class UserRegisteredEvent extends ApplicationEvent {

    private final User user;

    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }

    public User getUser() {
        return user;
    }
}

// 事件发布
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UserServiceImpl(UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public void registerUser(User user) {
        userRepository.save(user);
        eventPublisher.publishEvent(new UserRegisteredEvent(this, user));
    }
}

// 事件监听
@Component
public class UserRegistrationListener implements ApplicationListener<UserRegisteredEvent> {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final EmailService emailService;

    public UserRegistrationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void onApplicationEvent(UserRegisteredEvent event) {
        User user = event.getUser();
        logger.info("新用户注册: {}", user.getUsername());
        emailService.sendWelcomeEmail(user);
    }
}
```

## 8. Spring与其他框架集成

### 8.1 Spring Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/", "/home", "/register").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 8.2 Spring Data

```java
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    List<User> findByEmailContaining(String email);

    @Query("SELECT u FROM User u WHERE u.lastLoginDate > :date")
    List<User> findActiveUsersSince(@Param("date") Date date);
}
```

## 9. 总结

Spring Framework提供了一个全面的编程和配置模型，用于开发现代Java应用程序。其核心特性包括依赖注入、面向切面编程、数据访问抽象和声明式事务管理等，这些特性让开发人员可以专注于业务逻辑，而不是底层技术细节。

随着微服务架构的兴起，Spring Framework继续发展，推出了Spring Boot和Spring Cloud等新框架，使构建和部署现代分布式系统变得更加简单高效。