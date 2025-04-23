# MyBatis 源码分析

## 1. MyBatis 架构概述

MyBatis 是一个优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 的核心架构由以下几个部分组成：

1. **配置层**：负责解析配置文件，包括全局配置和映射文件
2. **核心处理层**：包括会话管理、执行器、参数处理、结果映射等
3. **SQL 解析与执行层**：负责解析 SQL 语句、处理动态 SQL 和执行数据库操作
4. **插件层**：提供插件扩展机制，允许在 SQL 执行的各个阶段进行拦截和处理

![MyBatis架构图](https://mybatis.org/images/mybatis-logo.png)

## 2. 核心组件分析

### 2.1 Configuration

`Configuration` 是 MyBatis 的核心配置类，它包含了 MyBatis 运行所需的所有配置信息。

```java
public class Configuration {
    protected Environment environment;
    protected boolean safeRowBoundsEnabled;
    protected boolean safeResultHandlerEnabled = true;
    protected boolean mapUnderscoreToCamelCase;
    protected boolean aggressiveLazyLoading;
    protected boolean multipleResultSetsEnabled = true;
    // 更多配置属性...
    
    // 各种映射注册表
    protected final Map<String, MappedStatement> mappedStatements = new StrictMap<>("Mapped Statements collection");
    protected final Map<String, Cache> caches = new StrictMap<>("Caches collection");
    protected final Map<String, ResultMap> resultMaps = new StrictMap<>("Result Maps collection");
    protected final Map<String, ParameterMap> parameterMaps = new StrictMap<>("Parameter Maps collection");
    protected final Map<String, KeyGenerator> keyGenerators = new StrictMap<>("Key Generators collection");
    // 更多映射注册表...
}
```

`Configuration` 类的主要职责：

1. 存储全局配置信息
2. 管理映射语句、结果映射、参数映射等注册表
3. 创建 SqlSession、Executor、StatementHandler 等核心组件
4. 管理类型处理器、对象工厂、对象包装工厂等

### 2.2 SqlSessionFactory

`SqlSessionFactory` 是创建 `SqlSession` 的工厂接口，其默认实现是 `DefaultSqlSessionFactory`。

```java
public interface SqlSessionFactory {
    SqlSession openSession();
    SqlSession openSession(boolean autoCommit);
    SqlSession openSession(Connection connection);
    SqlSession openSession(TransactionIsolationLevel level);
    SqlSession openSession(ExecutorType execType);
    SqlSession openSession(ExecutorType execType, boolean autoCommit);
    SqlSession openSession(ExecutorType execType, TransactionIsolationLevel level);
    SqlSession openSession(ExecutorType execType, Connection connection);
    Configuration getConfiguration();
}
```

`SqlSessionFactory` 的创建过程：

1. 通过 `SqlSessionFactoryBuilder` 创建
2. 可以从 XML 配置文件或 Java 配置类创建
3. 一旦创建后就是线程安全的，可以被多个线程共享

### 2.3 SqlSession

`SqlSession` 是 MyBatis 的核心接口，它提供了执行 SQL 命令、获取映射器和管理事务的方法。

```java
public interface SqlSession extends Closeable {
    <T> T selectOne(String statement);
    <T> T selectOne(String statement, Object parameter);
    <E> List<E> selectList(String statement);
    <E> List<E> selectList(String statement, Object parameter);
    <E> List<E> selectList(String statement, Object parameter, RowBounds rowBounds);
    // 更多查询方法...
    
    int insert(String statement);
    int insert(String statement, Object parameter);
    int update(String statement);
    int update(String statement, Object parameter);
    int delete(String statement);
    int delete(String statement, Object parameter);
    // 更多更新方法...
    
    void commit();
    void commit(boolean force);
    void rollback();
    void rollback(boolean force);
    // 更多事务方法...
    
    <T> T getMapper(Class<T> type);
    Connection getConnection();
    // 更多工具方法...
}
```

`SqlSession` 的主要职责：

1. 执行 SQL 语句（查询、更新、插入、删除）
2. 管理事务（提交、回滚）
3. 获取映射器接口的实现
4. 管理缓存

### 2.4 Executor

`Executor` 是 MyBatis 的 SQL 执行器，它负责执行 SQL 语句并返回结果。

```java
public interface Executor {
    ResultHandler NO_RESULT_HANDLER = null;
    
    int update(MappedStatement ms, Object parameter) throws SQLException;
    <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException;
    <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException;
    List<BatchResult> flushStatements() throws SQLException;
    void commit(boolean required) throws SQLException;
    void rollback(boolean required) throws SQLException;
    CacheKey createCacheKey(MappedStatement ms, Object parameterObject, RowBounds rowBounds, BoundSql boundSql);
    boolean isCached(MappedStatement ms, CacheKey key);
    void clearLocalCache();
    void deferLoad(MappedStatement ms, MetaObject resultObject, String property, CacheKey key, Class<?> targetType);
    Transaction getTransaction();
    void close(boolean forceRollback);
    boolean isClosed();
    void setExecutorWrapper(Executor executor);
}
```

MyBatis 提供了多种 `Executor` 实现：

1. **SimpleExecutor**：默认执行器，每次执行 SQL 都创建新的 Statement
2. **ReuseExecutor**：重用 Statement，将 Statement 缓存起来复用
3. **BatchExecutor**：批处理执行器，用于批量执行 SQL
4. **CachingExecutor**：二级缓存执行器，为其他执行器增加缓存功能

### 2.5 StatementHandler

`StatementHandler` 负责处理 JDBC Statement 的创建、设置参数、执行 SQL 和获取结果。

```java
public interface StatementHandler {
    Statement prepare(Connection connection, Integer transactionTimeout) throws SQLException;
    void parameterize(Statement statement) throws SQLException;
    void batch(Statement statement) throws SQLException;
    int update(Statement statement) throws SQLException;
    <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException;
    <E> Cursor<E> queryCursor(Statement statement) throws SQLException;
    BoundSql getBoundSql();
    ParameterHandler getParameterHandler();
}
```

MyBatis 提供了多种 `StatementHandler` 实现：

1. **SimpleStatementHandler**：处理 Statement，用于简单 SQL
2. **PreparedStatementHandler**：处理 PreparedStatement，用于参数化 SQL
3. **CallableStatementHandler**：处理 CallableStatement，用于存储过程
4. **RoutingStatementHandler**：根据语句类型选择合适的 StatementHandler

### 2.6 ParameterHandler

`ParameterHandler` 负责设置 SQL 参数。

```java
public interface ParameterHandler {
    Object getParameterObject();
    void setParameters(PreparedStatement ps) throws SQLException;
}
```

`DefaultParameterHandler` 是 `ParameterHandler` 的默认实现，它使用 `TypeHandler` 将 Java 类型转换为 JDBC 类型。

### 2.7 ResultSetHandler

`ResultSetHandler` 负责将 JDBC ResultSet 转换为 Java 对象。

```java
public interface ResultSetHandler {
    <E> List<E> handleResultSets(Statement stmt) throws SQLException;
    <E> Cursor<E> handleCursorResultSets(Statement stmt) throws SQLException;
    void handleOutputParameters(CallableStatement cs) throws SQLException;
}
```

`DefaultResultSetHandler` 是 `ResultSetHandler` 的默认实现，它使用 `ResultMap` 将结果集映射为 Java 对象。

## 3. 核心流程分析

### 3.1 初始化流程

MyBatis 的初始化流程主要包括以下步骤：

1. **解析配置文件**：解析 mybatis-config.xml 和映射文件
2. **创建 Configuration 对象**：加载各种配置信息
3. **注册 Mapper 接口**：解析 Mapper 接口和映射文件
4. **创建 SqlSessionFactory**：使用 Configuration 创建 SqlSessionFactory

```java
// 初始化流程示例代码
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

### 3.2 SQL 执行流程

MyBatis 的 SQL 执行流程主要包括以下步骤：

1. **创建 SqlSession**：从 SqlSessionFactory 获取 SqlSession
2. **获取 Mapper 接口**：通过 SqlSession 获取 Mapper 接口的代理对象
3. **执行 Mapper 方法**：调用 Mapper 接口的方法
4. **执行 SQL**：SqlSession 委托 Executor 执行 SQL
5. **处理结果**：将结果集映射为 Java 对象
6. **关闭 SqlSession**：释放资源

```java
// SQL 执行流程示例代码
try (SqlSession session = sqlSessionFactory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    User user = mapper.selectUser(1);
    session.commit();
}
```

### 3.3 Mapper 代理机制

MyBatis 使用 JDK 动态代理为 Mapper 接口创建代理对象，代理对象将接口方法调用转换为 SQL 执行。

```java
// MapperProxy 核心代码
public class MapperProxy<T> implements InvocationHandler, Serializable {
    private final SqlSession sqlSession;
    private final Class<T> mapperInterface;
    private final Map<Method, MapperMethod> methodCache;
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (Object.class.equals(method.getDeclaringClass())) {
            return method.invoke(this, args);
        }
        
        final MapperMethod mapperMethod = cachedMapperMethod(method);
        return mapperMethod.execute(sqlSession, args);
    }
    
    private MapperMethod cachedMapperMethod(Method method) {
        return methodCache.computeIfAbsent(method, k -> new MapperMethod(mapperInterface, method, sqlSession.getConfiguration()));
    }
}
```

Mapper 代理的工作原理：

1. 创建 MapperProxy 实例作为 InvocationHandler
2. 使用 JDK 动态代理创建 Mapper 接口的代理对象
3. 当调用 Mapper 接口方法时，代理对象将调用转发给 MapperProxy.invoke()
4. MapperProxy 将方法调用转换为 SQL 执行

### 3.4 一级缓存机制

MyBatis 的一级缓存是 SqlSession 级别的缓存，默认开启。

```java
// PerpetualCache 核心代码
public class PerpetualCache implements Cache {
    private final String id;
    private final Map<Object, Object> cache = new HashMap<>();
    
    @Override
    public String getId() {
        return id;
    }
    
    @Override
    public void putObject(Object key, Object value) {
        cache.put(key, value);
    }
    
    @Override
    public Object getObject(Object key) {
        return cache.get(key);
    }
    
    @Override
    public Object removeObject(Object key) {
        return cache.remove(key);
    }
    
    @Override
    public void clear() {
        cache.clear();
    }
    
    @Override
    public int getSize() {
        return cache.size();
    }
}
```

一级缓存的工作原理：

1. 每个 SqlSession 有自己的一级缓存
2. 执行查询时，先检查缓存是否有结果
3. 如果缓存命中，直接返回缓存结果
4. 如果缓存未命中，执行查询并将结果放入缓存
5. 执行更新操作会清空一级缓存

### 3.5 二级缓存机制

MyBatis 的二级缓存是 namespace 级别的缓存，需要手动开启。

```java
// 开启二级缓存的配置
<cache
  eviction="LRU"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```

二级缓存的工作原理：

1. 多个 SqlSession 共享同一个二级缓存
2. 执行查询时，先检查二级缓存是否有结果
3. 如果二级缓存未命中，再检查一级缓存
4. 如果一级缓存也未命中，执行查询并将结果放入一级缓存
5. 当 SqlSession 提交或关闭时，一级缓存中的数据会被写入二级缓存
6. 执行更新操作会清空相关的二级缓存

### 3.6 插件机制

MyBatis 提供了插件机制，允许在 SQL 执行的各个阶段进行拦截和处理。

```java
// 插件示例代码
@Intercepts({
    @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}),
    @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class})
})
public class ExamplePlugin implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 前置处理
        Object result = invocation.proceed();
        // 后置处理
        return result;
    }
    
    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 设置属性
    }
}
```

插件机制的工作原理：

1. 使用 JDK 动态代理为目标对象创建代理
2. 代理对象将方法调用转发给拦截器链
3. 拦截器链依次执行各个插件的 intercept 方法
4. 最后调用目标对象的原始方法

## 4. 动态 SQL 实现原理

MyBatis 的动态 SQL 功能允许根据条件动态生成 SQL 语句。

### 4.1 SqlNode 体系

MyBatis 使用 `SqlNode` 接口表示 SQL 语句的各个部分。

```java
public interface SqlNode {
    boolean apply(DynamicContext context);
}
```

MyBatis 提供了多种 `SqlNode` 实现：

1. **TextSqlNode**：表示静态文本
2. **StaticTextSqlNode**：表示不包含 ${} 的静态文本
3. **MixedSqlNode**：包含多个子 SqlNode
4. **IfSqlNode**：对应 `<if>` 标签
5. **TrimSqlNode**：对应 `<trim>` 标签
6. **WhereSqlNode**：对应 `<where>` 标签
7. **SetSqlNode**：对应 `<set>` 标签
8. **ForEachSqlNode**：对应 `<foreach>` 标签
9. **ChooseSqlNode**：对应 `<choose>` 标签

### 4.2 OGNL 表达式

MyBatis 使用 OGNL 表达式解析动态 SQL 中的条件表达式。

```java
// OgnlCache 核心代码
public final class OgnlCache {
    private static final OgnlMemberAccess MEMBER_ACCESS = new OgnlMemberAccess();
    private static final OgnlClassResolver CLASS_RESOLVER = new OgnlClassResolver();
    private static final Map<String, Object> expressionCache = new ConcurrentHashMap<>();
    
    public static Object getValue(String expression, Object root) {
        try {
            Map context = Ognl.createDefaultContext(root, MEMBER_ACCESS, CLASS_RESOLVER, null);
            return Ognl.getValue(parseExpression(expression), context, root);
        } catch (OgnlException e) {
            throw new BuilderException("Error evaluating expression '" + expression + "'. Cause: " + e, e);
        }
    }
    
    private static Object parseExpression(String expression) throws OgnlException {
        Object node = expressionCache.get(expression);
        if (node == null) {
            node = Ognl.parseExpression(expression);
            expressionCache.put(expression, node);
        }
        return node;
    }
}
```

### 4.3 动态 SQL 解析过程

动态 SQL 的解析过程主要包括以下步骤：

1. **解析 XML**：将 XML 映射文件解析为 Document 对象
2. **构建 SqlSource**：根据 XML 节点构建 SqlSource 对象
3. **构建 SqlNode 树**：根据 XML 节点构建 SqlNode 树
4. **应用 SqlNode**：执行 SQL 时，应用 SqlNode 树生成最终的 SQL 语句
5. **参数处理**：处理 SQL 中的参数占位符

## 5. 性能优化技术

### 5.1 批量操作

MyBatis 支持批量操作，可以提高大量数据操作的性能。

```java
// 批量操作示例代码
try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    for (int i = 0; i < 1000; i++) {
        User user = new User();
        user.setName("User" + i);
        mapper.insertUser(user);
    }
    session.commit();
}
```

### 5.2 延迟加载

MyBatis 支持延迟加载（懒加载），可以提高查询性能。

```xml
<!-- 全局延迟加载配置 -->
<settings>
    <setting name="lazyLoadingEnabled" value="true"/>
    <setting name="aggressiveLazyLoading" value="false"/>
</settings>

<!-- 关联查询延迟加载配置 -->
<resultMap id="userResultMap" type="User">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <association property="profile" select="selectProfile" column="id" fetchType="lazy"/>
</resultMap>
```

延迟加载的工作原理：

1. 创建代理对象，代理延迟加载的属性
2. 当首次访问延迟加载的属性时，触发查询
3. 查询结果会被缓存，后续访问不再触发查询

### 5.3 结果集缓存

MyBatis 支持结果集缓存，可以减少重复查询。

```java
// 结果集缓存相关代码
public class DefaultResultSetHandler implements ResultSetHandler {
    private final Map<CacheKey, Object> nestedResultObjects = new HashMap<>();
    
    // 处理嵌套结果映射
    private Object getRowValue(ResultSetWrapper rsw, ResultMap resultMap, String columnPrefix) throws SQLException {
        final CacheKey rowKey = createRowKey(resultMap, rsw, columnPrefix);
        Object rowValue = nestedResultObjects.get(rowKey);
        if (rowValue != null) {
            return rowValue;
        }
        
        // 创建新的结果对象
        rowValue = createResultObject(rsw, resultMap, columnPrefix);
        if (rowValue != null && !hasTypeHandlerForResultObject(rsw, resultMap.getType())) {
            nestedResultObjects.put(rowKey, rowValue);
        }
        
        return rowValue;
    }
}
```

## 6. 源码阅读心得

### 6.1 设计模式应用

MyBatis 源码中应用了多种设计模式：

1. **工厂模式**：SqlSessionFactory 创建 SqlSession
2. **建造者模式**：SqlSessionFactoryBuilder 创建 SqlSessionFactory
3. **代理模式**：Mapper 接口的动态代理
4. **装饰器模式**：CachingExecutor 为其他 Executor 增加缓存功能
5. **模板方法模式**：BaseExecutor 定义了 SQL 执行的骨架
6. **策略模式**：不同的 Executor 实现不同的执行策略
7. **责任链模式**：插件拦截器链
8. **组合模式**：SqlNode 树结构

### 6.2 代码组织技巧

MyBatis 源码的组织有以下特点：

1. **清晰的包结构**：按功能划分包，如 builder、cache、executor 等
2. **接口与实现分离**：定义接口，提供多种实现
3. **抽象类与具体类**：使用抽象类定义骨架，具体类实现细节
4. **内部类的使用**：将相关功能封装在内部类中
5. **工具类的抽象**：提供各种工具类简化代码

### 6.3 性能优化技巧

MyBatis 源码中的性能优化技巧：

1. **缓存机制**：一级缓存和二级缓存减少数据库访问
2. **对象池**：重用对象减少创建和销毁开销
3. **延迟加载**：按需加载数据减少不必要的查询
4. **批量操作**：减少数据库交互次数
5. **预编译语句**：减少 SQL 解析开销
6. **结果集处理优化**：高效处理结果集

## 7. 总结

MyBatis 是一个功能强大、设计精巧的持久层框架，它的源码体现了优秀的设计思想和实现技术。通过阅读 MyBatis 源码，我们可以学习到：

1. **灵活的配置系统**：支持 XML 和 Java 配置，提供丰富的配置选项
2. **强大的 SQL 构建能力**：动态 SQL 功能使 SQL 构建更加灵活
3. **高效的对象映射**：自动将结果集映射为 Java 对象
4. **优秀的缓存机制**：多级缓存提高性能
5. **可扩展的插件系统**：允许自定义拦截器扩展功能

MyBatis 的设计理念是"简单就是美"，它专注于 SQL 和 Java 对象的映射，不试图隐藏 SQL，而是让开发者能够充分利用 SQL 的强大功能。这种设计理念使 MyBatis 在复杂查询和性能优化方面具有优势。

通过深入理解 MyBatis 的源码，我们可以更好地使用 MyBatis，解决实际问题，并将其中的设计思想和技术应用到自己的项目中。
