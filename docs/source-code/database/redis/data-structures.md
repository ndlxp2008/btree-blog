# Redis 数据结构源码分析

## 1. Redis 数据结构概述

Redis 是一个高性能的键值存储数据库，其卓越性能很大程度上归功于其精心设计的内部数据结构。Redis 核心数据结构包括：

1. **简单动态字符串 (SDS)**：Redis 的字符串实现
2. **链表 (Linked List)**：双向链表实现
3. **字典 (Dict)**：哈希表实现，Redis 数据库的基础
4. **跳表 (Skip List)**：有序集合的底层实现之一
5. **整数集合 (IntSet)**：存储整数值的集合
6. **压缩列表 (ZipList)**：节省内存的列表和哈希表实现
7. **快速列表 (QuickList)**：结合链表和压缩列表的优点
8. **基数树 (Radix Tree)**：用于内存优化的数据结构

这些底层数据结构支撑了 Redis 的五种主要数据类型：字符串(String)、列表(List)、哈希(Hash)、集合(Set)和有序集合(Sorted Set)。

## 2. 简单动态字符串 (SDS)

### 2.1 SDS 结构定义

SDS 是 Redis 自己实现的字符串数据结构，定义在 `sds.h` 和 `sds.c` 文件中。

```c
// Redis 5.0 之前的实现
struct sdshdr {
    int len;        // 已使用的字节数
    int free;       // 未使用的字节数
    char buf[];     // 字符数组，柔性数组成员
};

// Redis 5.0 之后的实现，根据字符串长度使用不同的结构
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags;     // 低3位存储类型，高5位存储长度
    char buf[];
};

struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len;             // 已使用长度
    uint8_t alloc;           // 总分配长度
    unsigned char flags;     // 类型标志
    char buf[];
};

// 还有 sdshdr16, sdshdr32, sdshdr64，分别用于存储不同长度范围的字符串
```

### 2.2 SDS 的优势

与 C 字符串相比，SDS 具有以下优势：

1. **常数时间获取字符串长度**：通过 `len` 字段，O(1) 时间复杂度获取长度
2. **杜绝缓冲区溢出**：自动扩容，确保安全
3. **减少内存重分配**：空间预分配和惰性空间释放策略
4. **二进制安全**：可以存储任意二进制数据，不仅限于文本
5. **兼容部分 C 字符串函数**：以 `\0` 结尾，可以复用部分 C 字符串函数

### 2.3 核心操作源码分析

#### 创建字符串

```c
// 创建一个包含给定C字符串的SDS
sds sdsnew(const char *init) {
    size_t initlen = (init == NULL) ? 0 : strlen(init);
    return sdsnewlen(init, initlen);
}

// 创建一个指定长度的SDS
sds sdsnewlen(const void *init, size_t initlen) {
    void *sh;
    sds s;
    char type = sdsReqType(initlen);  // 根据长度选择合适的SDS类型
    int hdrlen = sdsHdrSize(type);    // 获取头部大小
    
    // 分配内存
    sh = s_malloc(hdrlen+initlen+1);
    if (sh == NULL) return NULL;
    
    // 设置类型标志
    if (init==NULL)
        memset(sh, 0, hdrlen+initlen+1);
    else {
        memcpy(sh+hdrlen, init, initlen);
        ((char*)sh)[hdrlen+initlen] = '\0';
    }
    
    s = (char*)sh+hdrlen;  // s指向buf
    
    // 设置长度和分配空间
    switch(type) {
        case SDS_TYPE_5:
            // ...
        case SDS_TYPE_8:
            SDS_HDR_VAR(8,s)->len = initlen;
            SDS_HDR_VAR(8,s)->alloc = initlen;
            *((char*)s-1) = type;
            break;
        // 其他类型...
    }
    
    return s;
}
```

#### 字符串拼接

```c
// 将给定字符串拼接到SDS末尾
sds sdscat(sds s, const char *t) {
    return sdscatlen(s, t, strlen(t));
}

// 将指定长度的二进制数据拼接到SDS末尾
sds sdscatlen(sds s, const void *t, size_t len) {
    size_t curlen = sdslen(s);
    
    // 确保有足够空间
    s = sdsMakeRoomFor(s, len);
    if (s == NULL) return NULL;
    
    // 复制数据
    memcpy(s+curlen, t, len);
    
    // 更新长度
    sdssetlen(s, curlen+len);
    s[curlen+len] = '\0';  // 添加终止符
    
    return s;
}
```

#### 空间预分配

```c
// 确保SDS有足够空间容纳追加的数据
sds sdsMakeRoomFor(sds s, size_t addlen) {
    void *sh, *newsh;
    size_t avail = sdsavail(s);  // 获取可用空间
    size_t len, newlen;
    char type, oldtype = s[-1] & SDS_TYPE_MASK;
    int hdrlen;
    
    // 已有足够空间，直接返回
    if (avail >= addlen) return s;
    
    len = sdslen(s);
    sh = (char*)s-sdsHdrSize(oldtype);
    newlen = len+addlen;
    
    // 根据新长度确定类型
    type = sdsReqType(newlen);
    hdrlen = sdsHdrSize(type);
    
    // 计算新的分配长度（预分配策略）
    if (newlen < SDS_MAX_PREALLOC)
        newlen *= 2;  // 如果新长度小于阈值，翻倍分配
    else
        newlen += SDS_MAX_PREALLOC;  // 否则增加固定大小
    
    // 重新分配内存
    newsh = s_realloc(sh, hdrlen+newlen+1);
    if (newsh == NULL) return NULL;
    
    // 调整指针和设置新的头部信息
    s = (char*)newsh+hdrlen;
    
    // 设置类型和长度信息
    // ...
    
    return s;
}
```

## 3. 字典 (Dict)

### 3.1 字典结构定义

Redis 的字典是基于哈希表实现的，定义在 `dict.h` 和 `dict.c` 文件中。

```c
// 哈希表节点
typedef struct dictEntry {
    void *key;                // 键
    union {
        void *val;            // 值
        uint64_t u64;         // 整数值
        int64_t s64;          // 有符号整数值
        double d;             // 双精度浮点值
    } v;
    struct dictEntry *next;   // 链接下一个哈希表节点，形成链表
} dictEntry;

// 哈希表
typedef struct dictht {
    dictEntry **table;        // 哈希表数组
    unsigned long size;       // 哈希表大小
    unsigned long sizemask;   // 哈希表大小掩码，用于计算索引，等于size-1
    unsigned long used;       // 已有节点数量
} dictht;

// 字典
typedef struct dict {
    dictType *type;           // 类型特定函数
    void *privdata;           // 私有数据
    dictht ht[2];             // 两个哈希表，用于渐进式rehash
    long rehashidx;           // rehash索引，-1表示未进行rehash
    int iterators;            // 当前正在使用的迭代器数量
} dict;

// 字典类型，包含各种操作函数
typedef struct dictType {
    uint64_t (*hashFunction)(const void *key);                     // 哈希函数
    void *(*keyDup)(void *privdata, const void *key);              // 复制键函数
    void *(*valDup)(void *privdata, const void *obj);              // 复制值函数
    int (*keyCompare)(void *privdata, const void *key1, const void *key2);  // 比较键函数
    void (*keyDestructor)(void *privdata, void *key);              // 销毁键函数
    void (*valDestructor)(void *privdata, void *obj);              // 销毁值函数
} dictType;
```

### 3.2 字典的核心特性

1. **哈希表实现**：使用链地址法解决冲突
2. **渐进式rehash**：在字典扩容或缩容时，将rehash操作分散到多次操作中，避免一次性执行带来的服务器阻塞
3. **自动扩容和缩容**：根据负载因子自动调整哈希表大小
4. **多态操作**：通过函数指针支持不同类型的键和值

### 3.3 核心操作源码分析

#### 字典创建

```c
// 创建一个新字典
dict *dictCreate(dictType *type, void *privDataPtr) {
    dict *d = zmalloc(sizeof(*d));
    
    _dictInit(d, type, privDataPtr);
    return d;
}

// 初始化字典
int _dictInit(dict *d, dictType *type, void *privDataPtr) {
    // 初始化两个哈希表
    _dictReset(&d->ht[0]);
    _dictReset(&d->ht[1]);
    
    // 设置类型和私有数据
    d->type = type;
    d->privdata = privDataPtr;
    d->rehashidx = -1;  // 未进行rehash
    d->iterators = 0;
    
    return DICT_OK;
}
```

#### 添加键值对

```c
// 添加键值对
int dictAdd(dict *d, void *key, void *val) {
    // 尝试添加键，获取对应的entry
    dictEntry *entry = dictAddRaw(d, key, NULL);
    if (!entry) return DICT_ERR;
    
    // 设置值
    dictSetVal(d, entry, val);
    return DICT_OK;
}

// 添加键并返回entry
dictEntry *dictAddRaw(dict *d, void *key, dictEntry **existing) {
    long index;
    dictEntry *entry;
    dictht *ht;
    
    // 如果正在rehash，执行一步渐进式rehash
    if (dictIsRehashing(d)) _dictRehashStep(d);
    
    // 查找键位置，如果已存在则返回NULL
    if ((index = _dictKeyIndex(d, key, dictHashKey(d, key), existing)) == -1)
        return NULL;
    
    // 确定使用哪个哈希表
    ht = dictIsRehashing(d) ? &d->ht[1] : &d->ht[0];
    
    // 创建新节点
    entry = zmalloc(sizeof(*entry));
    entry->next = ht->table[index];
    ht->table[index] = entry;
    ht->used++;
    
    // 设置键
    dictSetKey(d, entry, key);
    
    return entry;
}
```

#### 渐进式rehash

```c
// 执行一步渐进式rehash
int dictRehash(dict *d, int n) {
    int empty_visits = n * 10;  // 允许访问的空桶数量
    
    // 如果没有进行rehash，直接返回
    if (!dictIsRehashing(d)) return 0;
    
    // 执行n步rehash
    while(n-- && d->ht[0].used != 0) {
        dictEntry *de, *nextde;
        
        // 如果当前桶为空，跳过
        while(d->ht[0].table[d->rehashidx] == NULL) {
            d->rehashidx++;
            if (--empty_visits == 0) return 1;
        }
        
        // 获取当前桶中的链表
        de = d->ht[0].table[d->rehashidx];
        
        // 将链表中的所有节点迁移到新哈希表
        while(de) {
            uint64_t h;
            
            nextde = de->next;
            
            // 计算在新表中的索引
            h = dictHashKey(d, de->key) & d->ht[1].sizemask;
            
            // 插入到新表
            de->next = d->ht[1].table[h];
            d->ht[1].table[h] = de;
            d->ht[0].used--;
            d->ht[1].used++;
            
            de = nextde;
        }
        
        // 清空旧表中的当前桶
        d->ht[0].table[d->rehashidx] = NULL;
        d->rehashidx++;
    }
    
    // 检查是否完成所有rehash
    if (d->ht[0].used == 0) {
        zfree(d->ht[0].table);
        d->ht[0] = d->ht[1];
        _dictReset(&d->ht[1]);
        d->rehashidx = -1;
        return 0;
    }
    
    return 1;
}
```

## 4. 跳表 (Skip List)

### 4.1 跳表结构定义

跳表是有序集合(Sorted Set)的底层实现之一，定义在 `server.h` 和 `t_zset.c` 文件中。

```c
// 跳表节点
typedef struct zskiplistNode {
    sds ele;                   // 元素值
    double score;              // 分数
    struct zskiplistNode *backward;  // 后退指针
    struct zskiplistLevel {
        struct zskiplistNode *forward;  // 前进指针
        unsigned long span;             // 跨度
    } level[];                 // 层
} zskiplistNode;

// 跳表
typedef struct zskiplist {
    struct zskiplistNode *header, *tail;  // 表头节点和表尾节点
    unsigned long length;                 // 节点数量
    int level;                            // 最大层数
} zskiplist;
```

### 4.2 跳表的核心特性

1. **多层链表结构**：通过概率性地为节点增加多层索引，加快查找速度
2. **O(log N) 平均查找复杂度**：类似于二分查找的效率
3. **有序性**：节点按分数排序
4. **后退指针**：支持反向遍历
5. **跨度计数**：用于计算排名

### 4.3 核心操作源码分析

#### 创建跳表

```c
// 创建跳表
zskiplist *zslCreate(void) {
    int j;
    zskiplist *zsl;
    
    // 分配内存
    zsl = zmalloc(sizeof(*zsl));
    
    // 初始化层数和长度
    zsl->level = 1;
    zsl->length = 0;
    
    // 创建头节点，最大层数为ZSKIPLIST_MAXLEVEL
    zsl->header = zslCreateNode(ZSKIPLIST_MAXLEVEL, 0, NULL);
    
    // 初始化头节点的层
    for (j = 0; j < ZSKIPLIST_MAXLEVEL; j++) {
        zsl->header->level[j].forward = NULL;
        zsl->header->level[j].span = 0;
    }
    
    zsl->header->backward = NULL;
    zsl->tail = NULL;
    
    return zsl;
}
```

#### 插入节点

```c
// 插入节点
zskiplistNode *zslInsert(zskiplist *zsl, double score, sds ele) {
    zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
    unsigned int rank[ZSKIPLIST_MAXLEVEL];
    int i, level;
    
    // 查找插入位置
    x = zsl->header;
    for (i = zsl->level-1; i >= 0; i--) {
        // 计算排名
        rank[i] = i == (zsl->level-1) ? 0 : rank[i+1];
        
        // 找到插入位置
        while (x->level[i].forward &&
               (x->level[i].forward->score < score ||
                (x->level[i].forward->score == score &&
                 sdscmp(x->level[i].forward->ele, ele) < 0))) {
            rank[i] += x->level[i].span;
            x = x->level[i].forward;
        }
        
        update[i] = x;
    }
    
    // 随机生成层数
    level = zslRandomLevel();
    
    // 如果新节点的层数大于当前最大层数
    if (level > zsl->level) {
        for (i = zsl->level; i < level; i++) {
            rank[i] = 0;
            update[i] = zsl->header;
            update[i]->level[i].span = zsl->length;
        }
        zsl->level = level;
    }
    
    // 创建新节点
    x = zslCreateNode(level, score, ele);
    
    // 插入节点到各层
    for (i = 0; i < level; i++) {
        x->level[i].forward = update[i]->level[i].forward;
        update[i]->level[i].forward = x;
        
        // 更新跨度
        x->level[i].span = update[i]->level[i].span - (rank[0] - rank[i]);
        update[i]->level[i].span = (rank[0] - rank[i]) + 1;
    }
    
    // 更新高于插入层的跨度
    for (i = level; i < zsl->level; i++) {
        update[i]->level[i].span++;
    }
    
    // 设置后退指针
    x->backward = (update[0] == zsl->header) ? NULL : update[0];
    if (x->level[0].forward)
        x->level[0].forward->backward = x;
    else
        zsl->tail = x;
    
    zsl->length++;
    return x;
}
```

## 5. 压缩列表 (ZipList)

### 5.1 压缩列表结构

压缩列表是一种紧凑的、内存高效的数据结构，用于存储小型列表和哈希表，定义在 `ziplist.h` 和 `ziplist.c` 文件中。

```c
// 压缩列表没有明确的结构体定义，而是一个连续的内存块
// 其布局如下：
// <zlbytes> <zltail> <zllen> <entry> <entry> ... <entry> <zlend>
//
// zlbytes: 4字节，表示整个压缩列表占用的字节数
// zltail: 4字节，表示最后一个元素的偏移量
// zllen: 2字节，表示元素个数
// entry: 可变长度的元素
// zlend: 1字节，值为255，表示压缩列表的结束
```

### 5.2 压缩列表的核心特性

1. **内存紧凑**：所有数据连续存储，没有额外指针开销
2. **变长编码**：根据数据大小使用不同的编码方式
3. **适用于小型数据**：当数据量小时，比链表更节省内存
4. **连锁更新风险**：插入或删除可能导致连锁更新，影响性能

### 5.3 核心操作源码分析

#### 创建压缩列表

```c
// 创建一个空的压缩列表
unsigned char *ziplistNew(void) {
    unsigned int bytes = ZIPLIST_HEADER_SIZE+ZIPLIST_END_SIZE;
    unsigned char *zl = zmalloc(bytes);
    
    // 设置zlbytes
    ZIPLIST_BYTES(zl) = intrev32ifbe(bytes);
    
    // 设置zltail
    ZIPLIST_TAIL_OFFSET(zl) = intrev32ifbe(ZIPLIST_HEADER_SIZE);
    
    // 设置zllen
    ZIPLIST_LENGTH(zl) = 0;
    
    // 设置zlend
    zl[bytes-1] = ZIP_END;
    
    return zl;
}
```

#### 插入元素

```c
// 插入元素
unsigned char *ziplistInsert(unsigned char *zl, unsigned char *p, unsigned char *s, unsigned int slen) {
    size_t curlen = intrev32ifbe(ZIPLIST_BYTES(zl));
    size_t reqlen;
    unsigned int prevlensize, prevlen = 0;
    size_t offset;
    int nextdiff = 0;
    unsigned char encoding = 0;
    long long value = 123456789; // 初始化为一个不可能的值
    zlentry entry, tail;
    
    // 如果p是NULL，表示插入到末尾
    if (p == NULL) {
        p = zl + intrev32ifbe(ZIPLIST_TAIL_OFFSET(zl));
    }
    
    // 获取前一个元素的长度
    if (p[0] != ZIP_END) {
        entry = zipEntry(p);
        prevlen = entry.prevrawlen;
        prevlensize = entry.prevrawlensize;
    } else {
        unsigned char *ptail = ZIPLIST_ENTRY_TAIL(zl);
        if (ptail[0] != ZIP_END) {
            prevlen = zipRawEntryLength(ptail);
        }
    }
    
    // 尝试整数编码
    if (zipTryEncoding(s, slen, &value, &encoding)) {
        // 根据整数值确定编码长度
        reqlen = zipIntSize(encoding);
    } else {
        // 字符串编码
        reqlen = slen;
    }
    
    // 计算前一个元素长度的编码长度
    reqlen += zipPrevEncodeLength(NULL, prevlen);
    
    // 计算当前元素长度的编码长度
    reqlen += zipEncodeLength(NULL, encoding ? 1 : slen);
    
    // 检查后一个元素的prevlen是否需要更新
    nextdiff = (p[0] != ZIP_END) ? zipPrevLenByteDiff(p, reqlen) : 0;
    
    // 计算偏移量
    offset = p - zl;
    
    // 调整压缩列表大小
    zl = ziplistResize(zl, curlen + reqlen + nextdiff);
    p = zl + offset;
    
    // 如果有后续元素，需要移动它们
    if (p[0] != ZIP_END) {
        memmove(p + reqlen, p + nextdiff, curlen - offset - 1 + nextdiff);
        
        // 更新后一个元素的prevlen
        zipPrevEncodeLength(p + reqlen, reqlen);
        
        // 更新尾部偏移量
        ZIPLIST_TAIL_OFFSET(zl) = intrev32ifbe(intrev32ifbe(ZIPLIST_TAIL_OFFSET(zl)) + reqlen);
    } else {
        // 更新尾部偏移量
        ZIPLIST_TAIL_OFFSET(zl) = intrev32ifbe(p - zl);
    }
    
    // 如果插入位置在中间，可能需要连锁更新
    if (nextdiff != 0) {
        offset = p - zl;
        zl = __ziplistCascadeUpdate(zl, p + reqlen);
        p = zl + offset;
    }
    
    // 编码前一个元素长度
    p = zipPrevEncodeLength(p, prevlen);
    
    // 编码当前元素长度
    if (encoding) {
        p = zipEncodeLength(p, 1);
        p[0] = encoding;
        
        // 编码整数值
        memcpy(p + 1, &value, reqlen - 1);
    } else {
        p = zipEncodeLength(p, slen);
        
        // 复制字符串
        memcpy(p, s, slen);
    }
    
    // 更新元素个数
    ZIPLIST_INCR_LENGTH(zl, 1);
    
    return zl;
}
```

## 6. 总结与实践建议

### 6.1 Redis 数据结构设计原则

1. **内存效率优先**：Redis 作为内存数据库，极度关注内存使用效率
2. **根据数据特性选择结构**：不同场景使用不同的数据结构
3. **渐进式操作**：将大型操作分解为多个小步骤，避免阻塞服务器
4. **编码优化**：根据数据内容选择最优编码方式

### 6.2 实践建议

1. **理解底层实现**：了解 Redis 数据类型的底层实现，有助于更高效地使用 Redis
2. **选择合适的数据类型**：根据应用场景选择最合适的数据类型
3. **注意内存使用**：监控 Redis 内存使用情况，避免内存溢出
4. **避免大键值**：大键值可能导致性能问题，应尽量拆分
5. **利用批量操作**：使用批量命令减少网络往返

### 6.3 源码学习心得

1. **简洁高效**：Redis 源码简洁易读，实现高效
2. **精心设计的数据结构**：每种数据结构都针对特定场景优化
3. **内存与性能平衡**：在内存使用和性能之间取得平衡
4. **渐进式思想**：将大操作分解为小步骤，保证服务器响应性
5. **编码技巧**：大量使用位操作、内存对齐等技巧优化性能

通过深入理解 Redis 数据结构的实现，我们可以更好地利用 Redis 的特性，设计出更高效的应用。
