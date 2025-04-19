# Angular 入门指南

Angular是由Google开发和维护的现代前端框架，用于构建单页面应用程序(SPA)。它采用TypeScript作为主要开发语言，提供了完整的开发工具和组件体系。本文档将介绍Angular的核心概念和基本使用方法。

## 目录

- [Angular简介](#angular简介)
- [环境搭建](#环境搭建)
- [项目结构](#项目结构)
- [核心概念](#核心概念)
- [基本开发流程](#基本开发流程)
- [路由导航](#路由导航)
- [HTTP通信](#http通信)
- [表单处理](#表单处理)
- [最佳实践](#最佳实践)

## Angular简介

### 什么是Angular

Angular是一个完整的前端框架，用于构建单页面应用。它具有以下特点：

- **组件化架构**：应用基于组件进行构建，每个组件包含视图、样式和逻辑
- **双向数据绑定**：视图和模型之间的自动同步
- **依赖注入系统**：提供可重用的服务和更好的测试性
- **声明式模板**：使用HTML扩展和指令来声明UI
- **RxJS整合**：响应式编程模型处理异步操作
- **TypeScript支持**：强类型系统提供更好的开发体验

### Angular的版本历史

- **AngularJS (Angular 1)**: 最初版本，基于JavaScript
- **Angular 2+**: 完全重写的框架，基于TypeScript
- **Angular版本更新**: 遵循语义化版本控制，每6个月一个主要版本

## 环境搭建

### 安装Node.js和npm

Angular开发需要Node.js环境，建议使用12.x或更高版本：

```bash
# 检查Node.js版本
node -v
npm -v
```

### 安装Angular CLI

Angular CLI是官方的命令行工具，用于创建、开发、维护Angular应用：

```bash
# 全局安装Angular CLI
npm install -g @angular/cli

# 检查安装
ng version
```

### 创建新项目

```bash
# 创建新项目
ng new my-angular-app

# 启动开发服务器
cd my-angular-app
ng serve
```

默认情况下，应用将在`http://localhost:4200/`运行。

## 项目结构

一个典型的Angular项目结构：

```
my-angular-app/
├── node_modules/           # 依赖包
├── src/                    # 源代码目录
│   ├── app/                # 应用代码
│   │   ├── components/     # 组件目录
│   │   ├── services/       # 服务目录
│   │   ├── models/         # 数据模型
│   │   ├── app.component.* # 根组件
│   │   └── app.module.ts   # 根模块
│   ├── assets/             # 静态资源
│   ├── environments/       # 环境配置
│   ├── index.html          # 主HTML文件
│   ├── main.ts             # 应用入口点
│   ├── styles.css          # 全局样式
│   └── polyfills.ts        # 兼容性脚本
├── angular.json            # Angular配置
├── package.json            # npm配置
├── tsconfig.json           # TypeScript配置
└── README.md               # 文档
```

## 核心概念

### 模块(Modules)

Angular应用是模块化的，NgModule是Angular的基本构建块：

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],  // 声明组件、指令、管道
  imports: [BrowserModule],      // 导入其他模块
  providers: [],                 // 提供服务
  bootstrap: [AppComponent]      // 指定启动组件
})
export class AppModule { }
```

### 组件(Components)

组件控制屏幕上的一块区域（视图），定义其显示逻辑和交互：

```typescript
// hero.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',                 // HTML标签名
  templateUrl: './hero.component.html', // 视图模板
  styleUrls: ['./hero.component.css']   // 样式文件
})
export class HeroComponent {
  hero = 'Windstorm';                   // 组件属性

  updateHero() {                        // 组件方法
    this.hero = 'Superman';
  }
}
```

```html
<!-- hero.component.html -->
<h2>{{hero}}</h2>
<button (click)="updateHero()">Change Hero</button>
```

### 服务与依赖注入(Services & DI)

服务是一种独立于组件的可复用功能类：

```typescript
// hero.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // 在根注入器中提供服务
})
export class HeroService {
  getHeroes() {
    return ['Superman', 'Batman', 'Wonder Woman'];
  }
}
```

使用依赖注入在组件中使用服务：

```typescript
// hero-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-list',
  template: `
    <ul>
      <li *ngFor="let hero of heroes">{{hero}}</li>
    </ul>
  `
})
export class HeroListComponent implements OnInit {
  heroes: string[] = [];

  // 通过构造函数注入服务
  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.heroService.getHeroes();
  }
}
```

### 指令(Directives)

Angular提供三种类型的指令：

1. **组件**：带有模板的指令
2. **结构型指令**：修改DOM结构，例如`*ngFor`、`*ngIf`
3. **属性型指令**：修改元素外观或行为，例如`ngClass`、`ngStyle`

```html
<!-- 结构型指令示例 -->
<div *ngIf="isActive">Shown when isActive is true</div>

<ul>
  <li *ngFor="let item of items; let i = index">{{i}}: {{item}}</li>
</ul>

<!-- 属性型指令示例 -->
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">
  Styled based on conditions
</div>

<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">
  Styled with dynamic values
</div>
```

### 管道(Pipes)

管道用于在模板中转换显示的值：

```html
<!-- 内置管道 -->
<p>{{ name | uppercase }}</p>
<p>{{ price | currency:'USD' }}</p>
<p>{{ birthdate | date:'MMM dd, yyyy' }}</p>
<p>{{ longText | slice:0:50 }}...</p>

<!-- 链式管道 -->
<p>{{ birthdate | date:'fullDate' | uppercase }}</p>
```

创建自定义管道：

```typescript
// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
```

## 基本开发流程

### 创建组件

```bash
# 使用CLI创建组件
ng generate component hero-detail
# 或简写
ng g c hero-detail
```

### 组件通信

1. **父组件到子组件**：使用`@Input`装饰器

```typescript
// child.component.ts
@Component({/*...*/})
export class ChildComponent {
  @Input() data: string;
}
```

```html
<!-- parent.component.html -->
<app-child [data]="parentData"></app-child>
```

2. **子组件到父组件**：使用`@Output`装饰器和事件发射器

```typescript
// child.component.ts
@Component({/*...*/})
export class ChildComponent {
  @Output() dataChange = new EventEmitter<string>();

  sendData() {
    this.dataChange.emit('Data from child');
  }
}
```

```html
<!-- parent.component.html -->
<app-child (dataChange)="handleDataChange($event)"></app-child>
```

### 生命周期钩子

Angular组件有一系列生命周期钩子：

```typescript
@Component({/*...*/})
export class MyComponent implements OnInit, OnDestroy {
  constructor() {
    // 组件实例化时调用
  }

  ngOnInit() {
    // 组件初始化后调用
    // 适合进行数据获取等操作
  }

  ngOnDestroy() {
    // 组件销毁前调用
    // 适合清理订阅等资源
  }

  // 其他钩子：
  // ngOnChanges, ngDoCheck, ngAfterContentInit
  // ngAfterContentChecked, ngAfterViewInit, ngAfterViewChecked
}
```

## 路由导航

### 基本路由配置

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }  // 通配符路由，处理未匹配路径
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

### 路由导航链接

```html
<!-- 导航菜单 -->
<nav>
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
  <a routerLink="/contact" routerLinkActive="active">Contact</a>
</nav>

<!-- 路由出口 -->
<router-outlet></router-outlet>
```

### 路由参数

```typescript
// routes配置
const routes: Routes = [
  { path: 'hero/:id', component: HeroDetailComponent }
];
```

```typescript
// 获取路由参数
import { ActivatedRoute } from '@angular/router';

@Component({/*...*/})
export class HeroDetailComponent implements OnInit {
  heroId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // 通过快照获取参数
    this.heroId = this.route.snapshot.paramMap.get('id');

    // 或者通过观察者获取参数（参数变化时会更新）
    this.route.paramMap.subscribe(params => {
      this.heroId = params.get('id');
    });
  }
}
```

### 编程式导航

```typescript
import { Router } from '@angular/router';

@Component({/*...*/})
export class MyComponent {
  constructor(private router: Router) { }

  navigateToHero(id: number) {
    this.router.navigate(['/hero', id]);

    // 或者带查询参数
    this.router.navigate(['/heroes'], {
      queryParams: { page: 1, sort: 'name' }
    });
  }
}
```

## HTTP通信

### 配置HttpClient

```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule  // 导入HTTP模块
  ],
  // ...
})
export class AppModule { }
```

### 创建数据服务

```typescript
// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/items';

  constructor(private http: HttpClient) { }

  // GET请求
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // POST请求
  addItem(item: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(this.apiUrl, item, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // 错误处理
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // 客户端错误
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // 服务器错误
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

### 在组件中使用HTTP服务

```typescript
@Component({/*...*/})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.loading = true;
    this.dataService.getItems()
      .subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err;
          this.loading = false;
        }
      });
  }

  addNewItem(item: any) {
    this.dataService.addItem(item)
      .subscribe({
        next: (newItem) => {
          this.items.push(newItem);
        },
        error: (err) => this.error = err
      });
  }
}
```

## 表单处理

Angular提供两种表单构建方式：模板驱动表单和响应式表单。

### 模板驱动表单

简单易用，适合基础表单：

```typescript
// app.module.ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule],
  // ...
})
export class AppModule { }
```

```html
<!-- template-form.component.html -->
<form #heroForm="ngForm" (ngSubmit)="onSubmit(heroForm)">
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" name="name"
           [(ngModel)]="hero.name" required #name="ngModel">
    <div *ngIf="name.invalid && (name.dirty || name.touched)">
      Name is required
    </div>
  </div>

  <div>
    <label for="power">Power</label>
    <select id="power" name="power" [(ngModel)]="hero.power" required>
      <option *ngFor="let power of powers" [value]="power">{{power}}</option>
    </select>
  </div>

  <button type="submit" [disabled]="!heroForm.form.valid">Submit</button>
</form>
```

```typescript
@Component({/*...*/})
export class TemplateFormComponent {
  powers = ['Super Strength', 'Flight', 'Invisibility'];
  hero = { name: '', power: '' };

  onSubmit(form: NgForm) {
    console.log('Form submitted', form.value);
    // 处理表单提交
  }
}
```

### 响应式表单

功能更强大，适合复杂表单逻辑：

```typescript
// app.module.ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule],
  // ...
})
export class AppModule { }
```

```typescript
// reactive-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html'
})
export class ReactiveFormComponent implements OnInit {
  heroForm: FormGroup;
  powers = ['Super Strength', 'Flight', 'Invisibility'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      power: ['', Validators.required],
      alterEgo: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        zip: ['']
      })
    });
  }

  onSubmit() {
    console.log('Form submitted', this.heroForm.value);
    // 处理表单提交
  }

  // 表单值变化时的处理
  subscribeToFormChanges() {
    this.heroForm.valueChanges.subscribe(val => {
      console.log('Form values changed', val);
    });

    this.heroForm.get('name').valueChanges.subscribe(val => {
      console.log('Name changed', val);
    });
  }
}
```

```html
<!-- reactive-form.component.html -->
<form [formGroup]="heroForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" formControlName="name">
    <div *ngIf="heroForm.get('name').invalid &&
               (heroForm.get('name').dirty || heroForm.get('name').touched)">
      <div *ngIf="heroForm.get('name').errors?.required">
        Name is required
      </div>
      <div *ngIf="heroForm.get('name').errors?.minlength">
        Name must be at least 3 characters
      </div>
    </div>
  </div>

  <div>
    <label for="power">Power</label>
    <select id="power" formControlName="power">
      <option *ngFor="let power of powers" [value]="power">{{power}}</option>
    </select>
  </div>

  <div formGroupName="address">
    <h3>Address</h3>
    <div>
      <label for="street">Street</label>
      <input type="text" id="street" formControlName="street">
    </div>
    <div>
      <label for="city">City</label>
      <input type="text" id="city" formControlName="city">
    </div>
    <div>
      <label for="zip">ZIP</label>
      <input type="text" id="zip" formControlName="zip">
    </div>
  </div>

  <button type="submit" [disabled]="!heroForm.valid">Submit</button>
</form>
```

## 最佳实践

### 项目结构

- **特性模块化**：按功能将应用分成多个模块
- **惰性加载**：只在需要时加载模块，提高应用启动性能
- **共享模块**：将共用组件、指令和管道放在共享模块中

```typescript
// 惰性加载配置示例
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

### 状态管理

对于复杂应用，考虑使用状态管理库：

- **NgRx**：基于Redux模式的状态管理
- **NGXS**：基于状态类的简化状态管理
- **Akita**：实体数据库启发的状态管理

### 性能优化

- **OnPush变更检测**：减少不必要的检测周期
- **使用trackBy函数**：优化ngFor列表渲染
- **使用纯管道**：避免不必要的计算
- **懒加载**：模块和图片等资源

```typescript
// OnPush示例
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// trackBy示例
<div *ngFor="let item of items; trackBy: trackByFn">{{item.name}}</div>

trackByFn(index: number, item: any): number {
  return item.id;
}
```

### 测试

- **单元测试**：使用Jasmine和Karma
- **端到端测试**：使用Protractor或Cypress
- **组件测试**：使用TestBed

```typescript
// 单元测试示例
describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroService]
    });
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return heroes', () => {
    expect(service.getHeroes().length).toBeGreaterThan(0);
  });
});
```

## 参考资源

- [Angular官方文档](https://angular.io/docs)
- [Angular风格指南](https://angular.io/guide/styleguide)
- [Angular CLI文档](https://angular.io/cli)
- [RxJS文档](https://rxjs.dev/guide/overview)
- [TypeScript文档](https://www.typescriptlang.org/docs/)