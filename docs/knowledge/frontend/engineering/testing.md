# 前端测试

## 概述
前端测试是确保Web应用程序质量和可靠性的关键实践。通过系统化的测试策略，开发团队可以捕获错误，保证功能正确性，并提高代码质量。

## 测试类型

### 单元测试
- **定义**：测试独立的代码单元（通常是函数或组件）
- **特点**：快速执行、隔离性强、覆盖率高
- **工具**：Jest, Mocha, Jasmine
- **示例** (Jest):
```javascript
// math.js
export function sum(a, b) {
  return a + b;
}

// math.test.js
import { sum } from './math';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### 集成测试
- **定义**：测试多个单元协同工作
- **特点**：验证组件间交互、中等复杂度
- **工具**：Jest, Cypress, Testing Library
- **示例** (React Testing Library):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

test('submitting form calls onSubmit with user data', () => {
  const handleSubmit = jest.fn();
  render(<Form onSubmit={handleSubmit} />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' },
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({ username: 'testuser' });
});
```

### 端到端测试(E2E)
- **定义**：测试整个应用流程，模拟真实用户行为
- **特点**：真实环境测试、高度仿真、运行较慢
- **工具**：Cypress, Playwright, Selenium
- **示例** (Cypress):
```javascript
describe('Login Flow', () => {
  it('should login successfully with correct credentials', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, testuser!').should('be.visible');
  });
});
```

### 组件测试
- **定义**：验证UI组件的渲染和交互行为
- **工具**：Storybook, Testing Library, Vue Test Utils
- **示例** (React Testing Library):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);

  fireEvent.click(screen.getByText('Click Me'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 快照测试
- **定义**：捕获UI组件的渲染输出并与之前的快照比较
- **用途**：防止UI意外更改
- **工具**：Jest
- **示例**:
```javascript
import renderer from 'react-test-renderer';
import Button from './Button';

test('renders correctly', () => {
  const tree = renderer
    .create(<Button>Snapshot</Button>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
```

### 视觉回归测试
- **定义**：比较UI的视觉变化
- **工具**：Percy, Applitools, BackstopJS
- **适用场景**：确保UI样式和布局的一致性

## 测试框架和工具

### Jest
- **特点**：零配置、内置断言、模拟功能、快照测试
- **配置示例**:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
```

### Testing Library
- **理念**：测试用户行为而非实现细节
- **核心API**：render, screen, fireEvent, waitFor
- **与框架结合**：@testing-library/react, @testing-library/vue, @testing-library/angular

### Cypress
- **特点**：浏览器内执行、实时重载、时间旅行调试
- **基本配置**:
```javascript
// cypress.json
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "video": false
}
```

## 测试策略与最佳实践

### 测试金字塔
- **单元测试**：基础层，数量最多
- **集成测试**：中间层，验证组件协作
- **E2E测试**：顶层，覆盖关键用户流程

### 测试驱动开发(TDD)
1. 先写测试
2. 运行测试并确认失败
3. 编写满足测试的最小代码
4. 运行测试并确认通过
5. 重构代码
6. 重复过程

### 最佳实践
- **测试覆盖率**：设置合理目标，关注业务逻辑覆盖
- **独立测试**：测试间不应相互依赖
- **测试命名**：描述性强，格式如"[被测功能] should [预期行为] when [条件]"
- **模拟外部依赖**：API请求、时间功能等
- **CI/CD集成**：自动化测试执行，拒绝不通过的PR
- **测试环境隔离**：每次测试都使用干净环境

## React应用测试示例

### 组件测试
```javascript
// Counter.jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
    </div>
  );
}

// Counter.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter组件', () => {
  test('初始计数为0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('点击增加按钮后计数加1', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('增加'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('点击减少按钮后计数减1', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('减少'));
    expect(screen.getByTestId('count')).toHaveTextContent('-1');
  });
});
```

### 异步测试
```javascript
// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { fetchUserData } from './api';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>错误: {error}</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}

// UserProfile.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { fetchUserData } from './api';
import UserProfile from './UserProfile';

// 模拟API模块
jest.mock('./api');

describe('UserProfile组件', () => {
  test('显示加载状态', () => {
    fetchUserData.mockResolvedValueOnce({});
    render(<UserProfile userId="123" />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  test('成功获取数据后显示用户信息', async () => {
    fetchUserData.mockResolvedValueOnce({
      name: '张三',
      email: 'zhangsan@example.com'
    });

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('Email: zhangsan@example.com')).toBeInTheDocument();
    });
  });

  test('获取数据失败时显示错误信息', async () => {
    fetchUserData.mockRejectedValueOnce(new Error('网络错误'));

    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('错误: 网络错误')).toBeInTheDocument();
    });
  });
});
```

## 测试自动化与持续集成
- **集成工具**：GitHub Actions, CircleCI, Jenkins
- **示例配置** (GitHub Actions):
```yaml
# .github/workflows/test.yml
name: Frontend Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Run E2E tests
      run: npm run test:e2e
```

## 总结
前端测试是现代Web开发不可或缺的部分。通过结合单元测试、集成测试和端到端测试，开发团队可以提高代码质量、减少缺陷并加快开发速度。成功的测试策略应根据项目特点选择适当的测试类型和工具，并在开发流程中持续执行。