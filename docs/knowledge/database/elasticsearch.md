# ElasticSearch 应用

ElasticSearch 是一个基于 Lucene 的分布式全文搜索引擎，提供了实时数据搜索、分析和可视化能力。本文将介绍 ElasticSearch 的核心概念和常见应用场景。

## ElasticSearch 基础

### 核心概念

1. **文档(Document)**：ElasticSearch 中的主要数据单元，以 JSON 格式表示
2. **索引(Index)**：具有相似特性的文档集合
3. **分片(Shard)**：将索引分成多个部分，实现分布式扩展
4. **副本(Replica)**：分片的备份，提供高可用性
5. **节点(Node)**：运行 ElasticSearch 的单个服务器实例
6. **集群(Cluster)**：一组协同工作的节点

### 数据模型比较

| 关系型数据库 | ElasticSearch |
|----------|--------------|
| 数据库(Database) | 索引(Index) |
| 表(Table) | 类型(Type) (旧版) / 无 (新版) |
| 行(Row) | 文档(Document) |
| 列(Column) | 字段(Field) |
| 模式(Schema) | 映射(Mapping) |

## 安装与配置

### 安装 ElasticSearch

#### 使用 Docker 安装

```bash
# 拉取镜像
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.7.0

# 创建网络
docker network create elastic

# 运行 ElasticSearch 容器
docker run --name es01 --net elastic -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.7.0
```

#### 在 Linux 上安装

```bash
# 下载并安装公钥
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg

# 添加源
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# 安装
sudo apt-get update && sudo apt-get install elasticsearch

# 启动服务
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

### 基本配置

主要配置文件: `elasticsearch.yml`

```yaml
# 集群名称
cluster.name: my-application

# 节点名称
node.name: node-1

# 数据和日志存储路径
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch

# 网络设置
network.host: 0.0.0.0
http.port: 9200

# 发现设置
discovery.seed_hosts: ["127.0.0.1"]
cluster.initial_master_nodes: ["node-1"]

# 内存设置
bootstrap.memory_lock: true
```

## 基本操作

ElasticSearch 提供了 RESTful API 用于所有操作。

### 索引操作

#### 创建索引

```bash
# 创建索引
PUT /products
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "created": { "type": "date" },
      "tags": { "type": "keyword" },
      "location": { "type": "geo_point" }
    }
  }
}
```

#### 获取索引信息

```bash
# 获取所有索引
GET /_cat/indices?v

# 获取特定索引的映射
GET /products/_mapping
```

#### 删除索引

```bash
# 删除索引
DELETE /products
```

### 文档操作

#### 添加文档

```bash
# 添加文档（指定ID）
PUT /products/_doc/1
{
  "name": "Smartphone",
  "description": "High-end smartphone with latest features",
  "price": 799.99,
  "created": "2023-01-15",
  "tags": ["electronics", "mobile"],
  "location": {
    "lat": 40.7128,
    "lon": -74.0060
  }
}

# 添加文档（自动生成ID）
POST /products/_doc
{
  "name": "Laptop",
  "description": "Powerful laptop for professionals",
  "price": 1299.99,
  "created": "2023-01-20",
  "tags": ["electronics", "computer"]
}
```

#### 获取文档

```bash
# 获取单个文档
GET /products/_doc/1

# 根据查询获取文档
GET /products/_search
{
  "query": {
    "match": {
      "name": "smartphone"
    }
  }
}
```

#### 更新文档

```bash
# 更新文档（部分更新）
POST /products/_update/1
{
  "doc": {
    "price": 749.99,
    "tags": ["electronics", "mobile", "sale"]
  }
}

# 更新或创建文档（upsert）
POST /products/_update/3
{
  "doc": {
    "name": "Tablet",
    "price": 399.99
  },
  "doc_as_upsert": true
}
```

#### 删除文档

```bash
# 删除文档
DELETE /products/_doc/1

# 根据查询删除文档
POST /products/_delete_by_query
{
  "query": {
    "match": {
      "tags": "discontinued"
    }
  }
}
```

### 批量操作

```bash
# 批量操作
POST /_bulk
{"index": {"_index": "products", "_id": "4"}}
{"name": "Headphones", "price": 99.99, "tags": ["electronics", "audio"]}
{"update": {"_index": "products", "_id": "1"}}
{"doc": {"in_stock": false}}
{"delete": {"_index": "products", "_id": "2"}}
```

## 搜索与查询

ElasticSearch 提供了强大的查询功能，从简单查询到高级复合查询。

### 基本查询

```bash
# 全文查询
GET /products/_search
{
  "query": {
    "match": {
      "description": "powerful professional"
    }
  }
}

# 精确匹配
GET /products/_search
{
  "query": {
    "term": {
      "tags": "electronics"
    }
  }
}

# 范围查询
GET /products/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 500,
        "lte": 1000
      }
    }
  }
}

# 存在查询（字段必须存在）
GET /products/_search
{
  "query": {
    "exists": {
      "field": "location"
    }
  }
}
```

### 复合查询

```bash
# 布尔查询
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "tags": "electronics" } }
      ],
      "must_not": [
        { "term": { "tags": "discontinued" } }
      ],
      "should": [
        { "match": { "description": "premium" } }
      ],
      "filter": [
        { "range": { "price": { "lte": 1000 } } }
      ]
    }
  }
}

# 查询字符串查询
GET /products/_search
{
  "query": {
    "query_string": {
      "default_field": "description",
      "query": "powerful AND (laptop OR computer) NOT gaming"
    }
  }
}
```

### 全文搜索

```bash
# 匹配查询（分词）
GET /products/_search
{
  "query": {
    "match": {
      "description": "high quality smartphone"
    }
  }
}

# 匹配短语查询
GET /products/_search
{
  "query": {
    "match_phrase": {
      "description": "high quality"
    }
  }
}

# 匹配短语前缀查询
GET /products/_search
{
  "query": {
    "match_phrase_prefix": {
      "description": "smart pho"
    }
  }
}

# 多字段查询
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "apple",
      "fields": ["name", "description"]
    }
  }
}
```

### 地理位置搜索

```bash
# 距离查询
GET /products/_search
{
  "query": {
    "geo_distance": {
      "distance": "10km",
      "location": {
        "lat": 40.7128,
        "lon": -74.0060
      }
    }
  }
}

# 边界框查询
GET /products/_search
{
  "query": {
    "geo_bounding_box": {
      "location": {
        "top_left": {
          "lat": 41.0,
          "lon": -75.0
        },
        "bottom_right": {
          "lat": 40.0,
          "lon": -73.0
        }
      }
    }
  }
}
```

### 搜索结果处理

```bash
# 分页
GET /products/_search
{
  "from": 10,
  "size": 20,
  "query": {
    "match_all": {}
  }
}

# 排序
GET /products/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    { "price": "desc" },
    { "created": "desc" }
  ]
}

# 字段选择
GET /products/_search
{
  "query": {
    "match_all": {}
  },
  "_source": ["name", "price", "tags"]
}

# 高亮匹配部分
GET /products/_search
{
  "query": {
    "match": {
      "description": "powerful"
    }
  },
  "highlight": {
    "fields": {
      "description": {}
    }
  }
}
```

## 聚合分析

ElasticSearch 的聚合功能提供了强大的数据分析能力。

### 指标聚合

```bash
# 基本统计
GET /products/_search
{
  "size": 0,
  "aggs": {
    "avg_price": { "avg": { "field": "price" } },
    "max_price": { "max": { "field": "price" } },
    "min_price": { "min": { "field": "price" } },
    "sum_price": { "sum": { "field": "price" } },
    "count": { "value_count": { "field": "price" } },
    "stats_price": { "stats": { "field": "price" } },
    "extended_stats": { "extended_stats": { "field": "price" } }
  }
}

# 基数统计
GET /products/_search
{
  "size": 0,
  "aggs": {
    "unique_tags": {
      "cardinality": {
        "field": "tags"
      }
    }
  }
}

# 百分位统计
GET /products/_search
{
  "size": 0,
  "aggs": {
    "price_percentiles": {
      "percentiles": {
        "field": "price",
        "percents": [50, 75, 95, 99]
      }
    }
  }
}
```

### 桶聚合

```bash
# 词条聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "product_tags": {
      "terms": {
        "field": "tags",
        "size": 10
      }
    }
  }
}

# 范围聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 100 },
          { "from": 100, "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    }
  }
}

# 日期直方图
GET /products/_search
{
  "size": 0,
  "aggs": {
    "sales_over_time": {
      "date_histogram": {
        "field": "created",
        "calendar_interval": "month"
      }
    }
  }
}

# 地理距离聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "distance_rings": {
      "geo_distance": {
        "field": "location",
        "origin": { "lat": 40.7128, "lon": -74.0060 },
        "ranges": [
          { "to": 10000 },
          { "from": 10000, "to": 50000 },
          { "from": 50000 }
        ]
      }
    }
  }
}
```

### 子聚合和管道聚合

```bash
# 嵌套聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "tags": {
      "terms": {
        "field": "tags",
        "size": 10
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}

# 管道聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "created",
        "calendar_interval": "month"
      },
      "aggs": {
        "sales": {
          "sum": {
            "field": "price"
          }
        }
      }
    },
    "max_monthly_sales": {
      "max_bucket": {
        "buckets_path": "sales_per_month>sales"
      }
    }
  }
}
```

## 数据建模与优化

### 映射优化

```bash
# 优化映射例子
PUT /optimized_products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "english"
      },
      "price": { "type": "scaled_float", "scaling_factor": 100 },
      "created": { "type": "date", "format": "yyyy-MM-dd" },
      "tags": { "type": "keyword" },
      "in_stock": { "type": "boolean" },
      "category": { "type": "keyword" },
      "attributes": {
        "type": "nested",
        "properties": {
          "name": { "type": "keyword" },
          "value": { "type": "keyword" }
        }
      }
    }
  }
}
```

### 索引优化策略

1. **选择适当的分片数**：分片数过多会增加开销，过少会限制扩展性
2. **控制字段数量**：避免映射过大，对于不需要搜索的字段设置 `index: false`
3. **正确使用字段类型**：例如，对于精确匹配使用 `keyword`，对于全文搜索使用 `text`
4. **对大文本使用索引控制**：使用 `index_options: docs` 或考虑搜索场景是否需要匹配位置信息
5. **使用多字段**：同一字段的不同索引方式，如 `text` 存储全文搜索，`keyword` 存储精确匹配

### 性能优化

1. **批量操作**：使用 Bulk API 进行批量操作
2. **调整刷新间隔**：默认为1秒，可以通过 `refresh_interval` 进行调整
3. **合理设置分片和副本数**：根据数据量和节点数确定
4. **使用路由**：在大型分布式索引中使用路由提高查询效率
5. **调整缓存大小**：如 `indices.fielddata.cache.size`
6. **使用文档缓存**：设置 `index.translog.durability` 为 `async`

```bash
# 调整刷新间隔
PUT /products/_settings
{
  "index": {
    "refresh_interval": "30s"
  }
}

# 使用路由
POST /products/_doc?routing=user123
{
  "name": "Custom Product",
  "user_id": "user123"
}

# 查询时使用路由
GET /products/_search?routing=user123
{
  "query": {
    "term": {
      "user_id": "user123"
    }
  }
}
```

## 集成与应用

### 使用 Kibana 可视化

Kibana 是 Elastic Stack 的可视化工具，可以帮助您分析和可视化 ElasticSearch 数据。

```bash
# 使用 Docker 运行 Kibana
docker run --name kibana --net elastic -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://es01:9200" docker.elastic.co/kibana/kibana:8.7.0
```

### 与应用程序集成

ElasticSearch 提供了多种语言的客户端库。

#### Java 客户端示例

```java
// 创建客户端
RestHighLevelClient client = new RestHighLevelClient(
    RestClient.builder(
        new HttpHost("localhost", 9200, "http")));

// 索引请求
IndexRequest request = new IndexRequest("products");
request.id("1");
Map<String, Object> jsonMap = new HashMap<>();
jsonMap.put("name", "Smartphone");
jsonMap.put("price", 799.99);
request.source(jsonMap);
IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);

// 搜索请求
SearchRequest searchRequest = new SearchRequest("products");
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
searchSourceBuilder.query(QueryBuilders.matchQuery("name", "smartphone"));
searchRequest.source(searchSourceBuilder);
SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
```

#### Node.js 客户端示例

```javascript
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// 索引文档
async function run() {
  const result = await client.index({
    index: 'products',
    id: '1',
    body: {
      name: 'Smartphone',
      price: 799.99
    }
  });

  const search = await client.search({
    index: 'products',
    body: {
      query: {
        match: {
          name: 'smartphone'
        }
      }
    }
  });

  console.log(search.body.hits.hits);
}

run().catch(console.error);
```

### 常见应用场景

#### 日志分析

```bash
# 创建索引模板
PUT _template/logs_template
{
  "index_patterns": ["logs-*"],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "message": { "type": "text" },
      "level": { "type": "keyword" },
      "service": { "type": "keyword" },
      "trace_id": { "type": "keyword" },
      "user_id": { "type": "keyword" }
    }
  }
}

# 分析错误日志
GET /logs-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-1d" } } }
      ]
    }
  },
  "aggs": {
    "errors_over_time": {
      "date_histogram": {
        "field": "@timestamp",
        "fixed_interval": "1h"
      }
    },
    "error_by_service": {
      "terms": {
        "field": "service"
      }
    }
  }
}
```

#### 全文搜索引擎

```bash
# 创建文章索引
PUT /articles
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "content": {
        "type": "text",
        "analyzer": "english"
      },
      "author": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "published_date": { "type": "date" }
    }
  }
}

# 高级文章搜索
GET /articles/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "elasticsearch search engine",
            "fields": ["title^3", "content"],
            "type": "phrase_prefix"
          }
        }
      ],
      "filter": [
        { "term": { "tags": "technology" } },
        { "range": { "published_date": { "gte": "now-1y" } } }
      ]
    }
  },
  "highlight": {
    "fields": {
      "title": {},
      "content": {
        "fragment_size": 150,
        "number_of_fragments": 3
      }
    }
  },
  "_source": ["title", "author", "published_date", "tags"],
  "sort": [
    "_score",
    { "published_date": "desc" }
  ]
}
```

#### 实时分析平台

```bash
# 创建电子商务交易索引
PUT /transactions
{
  "mappings": {
    "properties": {
      "transaction_id": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "product_id": { "type": "keyword" },
      "price": { "type": "float" },
      "quantity": { "type": "integer" },
      "timestamp": { "type": "date" },
      "payment_method": { "type": "keyword" },
      "country": { "type": "keyword" },
      "device": { "type": "keyword" }
    }
  }
}

# 实时销售仪表板数据
GET /transactions/_search
{
  "size": 0,
  "query": {
    "range": {
      "timestamp": {
        "gte": "now-30d"
      }
    }
  },
  "aggs": {
    "sales_over_time": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "day"
      },
      "aggs": {
        "revenue": {
          "sum": {
            "script": {
              "source": "doc['price'].value * doc['quantity'].value"
            }
          }
        }
      }
    },
    "sales_by_country": {
      "terms": {
        "field": "country",
        "size": 10
      },
      "aggs": {
        "revenue": {
          "sum": {
            "script": {
              "source": "doc['price'].value * doc['quantity'].value"
            }
          }
        }
      }
    },
    "payment_method_breakdown": {
      "terms": {
        "field": "payment_method"
      }
    },
    "device_breakdown": {
      "terms": {
        "field": "device"
      }
    }
  }
}
```

## 监控与维护

### 集群健康检查

```bash
# 检查集群健康
GET /_cluster/health

# 节点状态
GET /_nodes/stats

# 索引状态
GET /_cat/indices?v
```

### 备份与恢复

```bash
# 注册仓库
PUT /_snapshot/my_backup
{
  "type": "fs",
  "settings": {
    "location": "/path/to/backup/location"
  }
}

# 创建快照
PUT /_snapshot/my_backup/snapshot_1
{
  "indices": "products,customers",
  "ignore_unavailable": true,
  "include_global_state": false
}

# 查看快照
GET /_snapshot/my_backup/snapshot_1

# 恢复快照
POST /_snapshot/my_backup/snapshot_1/_restore
{
  "indices": "products",
  "index_settings": {
    "index.number_of_replicas": 0
  },
  "rename_pattern": "(.+)",
  "rename_replacement": "restored_$1"
}
```

### 索引生命周期管理

```bash
# 创建生命周期策略
PUT /_ilm/policy/logs_policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "7d",
            "max_size": "50gb"
          }
        }
      },
      "warm": {
        "min_age": "30d",
        "actions": {
          "allocate": {
            "require": {
              "data_tier": "warm"
            }
          },
          "forcemerge": {
            "max_num_segments": 1
          },
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "min_age": "90d",
        "actions": {
          "set_priority": {
            "priority": 0
          },
          "allocate": {
            "require": {
              "data_tier": "cold"
            }
          },
          "read_only": {}
        }
      },
      "delete": {
        "min_age": "365d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}

# 将索引与策略关联
PUT /logs-000001
{
  "settings": {
    "index.lifecycle.name": "logs_policy",
    "index.lifecycle.rollover_alias": "logs"
  }
}
```

## 安全性

### 启用安全性

```yaml
# elasticsearch.yml
xpack.security.enabled: true
xpack.license.self_generated.type: basic
```

### 创建用户和角色

```bash
# 创建角色
POST /_security/role/readonly_role
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": ["products*"],
      "privileges": ["read", "view_index_metadata"]
    }
  ]
}

# 创建用户
POST /_security/user/read_user
{
  "password": "complex-password-here",
  "roles": ["readonly_role"],
  "full_name": "Read Only User",
  "email": "readuser@example.com"
}
```

### 配置 SSL/TLS

```yaml
# elasticsearch.yml
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
```

## 总结

ElasticSearch 是一个功能强大的分布式搜索和分析引擎，适用于多种应用场景。通过掌握本文中的核心概念和实践示例，您可以在项目中有效地利用 ElasticSearch 的全文搜索、实时分析和数据可视化能力。

随着应用需求的增长，可以进一步探索 Elastic Stack 的其他组件（如 Logstash、Kibana 和 Beats），以构建更完整的数据处理和分析解决方案。