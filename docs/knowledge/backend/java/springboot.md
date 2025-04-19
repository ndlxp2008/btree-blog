# SpringBoot 实战

Spring Boot 是由 Pivotal 团队开发的基于 Spring 框架的快速应用开发工具，它简化了 Spring 应用的初始搭建和开发过程。本文将介绍 Spring Boot 的核心概念和实战应用。

## 什么是 Spring Boot

Spring Boot 是一个基于 Spring 框架的快速开发工具，它的设计目的是简化 Spring 应用的初始搭建和开发过程。Spring Boot 提供了一种快速创建可用于生产环境的、基于 Spring 的独立应用程序的方式。

### Spring Boot 特点

- **自动配置**：Spring Boot 自动配置 Spring 应用程序，减少手动配置的需求
- **起步依赖**：简化构建配置，只需添加相应的起步依赖即可引入所需的库
- **内嵌服务器**：内置 Tomcat、Jetty 或 Undertow，无需部署 WAR 文件
- **Actuator**：提供生产环境下的监控和管理功能
- **命令行工具**：允许从命令行运行和测试 Spring Boot 应用程序
- **无需 XML 配置**：使用 Java 配置和注解，无需 XML 配置

## 环境搭建

### 安装 JDK

确保您的机器上安装了 JDK 8 或更高版本：

```bash
# 检查 Java 版本
java -version
```

### 构建工具

Spring Boot 项目通常使用 Maven 或 Gradle 构建：

#### Maven 配置

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

#### Gradle 配置

```groovy
plugins {
    id 'org.springframework.boot' version '2.7.0'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

### 创建项目

#### 使用 Spring Initializr

1. 访问 [Spring Initializr](https://start.spring.io/)
2. 选择项目类型（Maven/Gradle）
3. 选择语言（Java/Kotlin/Groovy）
4. 选择 Spring Boot 版本
5. 添加项目信息（Group, Artifact 等）
6. 添加依赖（如 Web, JPA, Security 等）
7. 生成项目并下载

#### 使用命令行

```bash
# 使用 Spring Boot CLI
spring init --dependencies=web,jpa my-project

# 使用 cURL
curl https://start.spring.io/starter.zip -d dependencies=web,jpa -o my-project.zip
```

#### 使用 IDE

- **IntelliJ IDEA**：提供 Spring Boot 项目创建向导
- **Eclipse**：安装 Spring Tool Suite (STS) 插件
- **Visual Studio Code**：安装 Spring Boot 扩展

## Spring Boot 核心概念

### 主应用类

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

`@SpringBootApplication` 注解是以下三个注解的组合：
- `@Configuration`：表明该类是一个配置类
- `@EnableAutoConfiguration`：启用 Spring Boot 的自动配置机制
- `@ComponentScan`：启用组件扫描，自动发现和注册 Bean

### 自动配置

Spring Boot 自动配置基于应用程序的类路径中的依赖项和已定义的 Bean：

```java
@Configuration
@ConditionalOnClass(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    // 数据源自动配置代码
}
```

可以通过以下方式排除特定自动配置：

```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MyApplication {
    // ...
}
```

### 配置管理

Spring Boot 支持多种配置方式：

#### application.properties

```properties
# 服务器端口
server.port=8080

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret

# 日志级别
logging.level.root=INFO
logging.level.org.springframework.web=DEBUG
```

#### application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: secret

logging:
  level:
    root: INFO
    org.springframework.web: DEBUG
```

#### 配置类

```java
@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

#### 外部配置

- **命令行参数**：`java -jar app.jar --server.port=8081`
- **系统属性**：`java -Dserver.port=8081 -jar app.jar`
- **环境变量**：`SERVER_PORT=8081 java -jar app.jar`
- **外部 application.properties**：`java -jar app.jar --spring.config.location=file:./config/`

配置优先级（从高到低）：
1. 命令行参数
2. 操作系统环境变量
3. application-{profile}.properties/yml 外部文件
4. application.properties/yml 外部文件
5. application-{profile}.properties/yml 内部文件
6. application.properties/yml 内部文件

### 起步依赖

起步依赖是一组方便的依赖项描述符，简化了依赖管理：

- **spring-boot-starter-web**：Web 应用程序开发依赖
- **spring-boot-starter-data-jpa**：JPA 数据访问依赖
- **spring-boot-starter-security**：安全功能依赖
- **spring-boot-starter-test**：测试依赖
- **spring-boot-starter-actuator**：生产监控功能依赖
- **spring-boot-starter-thymeleaf**：Thymeleaf 模板引擎依赖

## Web 应用开发

### RESTful API 开发

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.update(user);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
```

### 异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return new ResponseEntity<>("An error occurred: " + ex.getMessage(), 
                                     HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 请求参数处理

```java
@GetMapping("/search")
public List<User> searchUsers(
    @RequestParam(required = false) String name,
    @RequestParam(required = false) String email,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    
    return userService.search(name, email, page, size);
}
```

### 请求验证

```java
public class UserDto {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age should be at least 18")
    private Integer age;
    
    // getters and setters
}

@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) {
    User user = userMapper.toEntity(userDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(user));
}
```

## 数据访问

### Spring Data JPA

```java
// 实体类
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
    
    // 构造函数、getter 和 setter
}

// Repository 接口
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findByEmailDomain(@Param("domain") String domain);
}

// 服务类
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
```

### 配置数据源

```properties
# 数据库连接配置
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### 事务管理

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    // 构造函数注入
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        // 检查库存
        if (product.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Not enough stock");
        }
        
        // 减少库存
        product.setStock(product.getStock() - request.getQuantity());
        productRepository.save(product);
        
        // 创建订单
        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(request.getQuantity());
        order.setAmount(product.getPrice() * request.getQuantity());
        
        return orderRepository.save(order);
    }
}
```

## 安全

### 基本配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeRequests(auth -> auth
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 用户认证

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRoles().stream().map(Role::getName).toArray(String[]::new))
            .build();
    }
}
```

### JWT 认证

```java
@Configuration
public class JwtConfig {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
```

## 测试

### 单元测试

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    public void testFindById() {
        // 安排
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        // 执行
        Optional<User> result = userService.findById(userId);
        
        // 断言
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(userRepository).findById(userId);
    }
    
    @Test
    public void testSave() {
        // 安排
        User user = new User();
        user.setName("Jane Doe");
        
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // 执行
        User savedUser = userService.save(user);
        
        // 断言
        assertNotNull(savedUser);
        assertEquals("Jane Doe", savedUser.getName());
        verify(userRepository).save(user);
    }
}
```

### 集成测试

```java
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private UserService userService;
    
    @Test
    public void testGetUserById() throws Exception {
        // 安排
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        
        when(userService.findById(1L)).thenReturn(Optional.of(user));
        
        // 执行 & 断言
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("John Doe"));
        
        verify(userService).findById(1L);
    }
    
    @Test
    public void testCreateUser() throws Exception {
        // 安排
        User user = new User();
        user.setName("Jane Doe");
        user.setEmail("jane@example.com");
        
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Jane Doe");
        savedUser.setEmail("jane@example.com");
        
        when(userService.save(any(User.class))).thenReturn(savedUser);
        
        // 执行 & 断言
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Jane Doe"));
        
        verify(userService).save(any(User.class));
    }
}
```

## 日志

### 配置日志

```properties
# 设置日志级别
logging.level.root=INFO
logging.level.org.springframework=INFO
logging.level.com.example=DEBUG

# 设置日志文件
logging.file.name=myapp.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### 使用日志

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(User user) {
        logger.debug("Creating user: {}", user.getName());
        
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("Attempted to create user with existing email: {}", user.getEmail());
            throw new UserAlreadyExistsException("User with this email already exists");
        }
        
        User savedUser = userRepository.save(user);
        logger.info("User created successfully with id: {}", savedUser.getId());
        
        return savedUser;
    }
}
```

## 部署

### 打包为 JAR 文件

```bash
# Maven
mvn clean package

# Gradle
./gradlew build
```

### 运行应用

```bash
# 运行 JAR 文件
java -jar target/myapp-0.0.1-SNAPSHOT.jar

# 指定配置文件
java -jar target/myapp-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 指定端口
java -jar target/myapp-0.0.1-SNAPSHOT.jar --server.port=8081
```

### 使用 Docker 部署

```dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/myapp-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建和运行 Docker 容器：

```bash
# 构建镜像
docker build -t myapp .

# 运行容器
docker run -p 8080:8080 myapp
```

## 最佳实践

### 项目结构

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── demo/
│   │               ├── DemoApplication.java
│   │               ├── config/
│   │               ├── controller/
│   │               ├── dto/
│   │               ├── exception/
│   │               ├── model/
│   │               ├── repository/
│   │               └── service/
│   └── resources/
│       ├── application.properties
│       ├── application-dev.properties
│       ├── application-prod.properties
│       └── static/
├── test/
│   └── java/
│       └── com/
│           └── example/
│               └── demo/
└── pom.xml
```

### 依赖注入最佳实践

- 使用构造函数注入而不是字段注入
- 对于单一构造函数，可以省略 `@Autowired`
- 使用 final 字段确保不可变性

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    // 服务方法
}
```

### DTO 模式

使用 DTO（数据传输对象）分离 API 契约和内部模型：

```java
// DTO
public class UserDto {
    private String name;
    private String email;
    private String phone;
    
    // getters and setters
}

// Mapper
@Component
public class UserMapper {
    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        return dto;
    }
    
    public User toEntity(UserDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        return user;
    }
}

// Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }
    
    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        User user = userService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
    
    @PostMapping
    public UserDto createUser(@RequestBody UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        User savedUser = userService.save(user);
        return userMapper.toDto(savedUser);
    }
}
```

## 高级主题

### Spring Boot Actuator

Spring Boot Actuator 提供了生产就绪的监控和管理功能：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# 启用所有 actuator 端点
management.endpoints.web.exposure.include=*

# 健康检查显示详细信息
management.endpoint.health.show-details=always

# 自定义管理端点路径
management.endpoints.web.base-path=/manage
```

常用端点：
- `/actuator/health`：应用健康状态
- `/actuator/info`：应用信息
- `/actuator/metrics`：应用指标
- `/actuator/env`：环境变量
- `/actuator/loggers`：日志配置

### Spring Boot Dev Tools

Spring Boot Dev Tools 提供快速的应用开发体验：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

功能：
- 自动重启：代码更改时自动重启应用
- 浏览器自动刷新：与 LiveReload 协作
- 开发环境默认属性
- 全局设置：共享配置

### 缓存

```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("users", "products");
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(60, TimeUnit.MINUTES)
            .maximumSize(100));
        return cacheManager;
    }
}

@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Cacheable(value = "users", key = "#id")
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @CacheEvict(value = "users", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }
    
    @CacheEvict(value = "users", allEntries = true)
    public void refreshCache() {
        // 刷新缓存
    }
}
```

## 相关资源

- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot GitHub 仓库](https://github.com/spring-projects/spring-boot)
- [Spring Initializr](https://start.spring.io/)
- [Spring Boot 示例项目](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-samples)
- [Spring Boot 指南](https://spring.io/guides?q=spring%20boot)
- [Baeldung Spring Boot 教程](https://www.baeldung.com/spring-boot)
