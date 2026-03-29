# 校园互助服务平台

一个面向大学生的现代化校园互助服务平台，提供快递代取、自习室预约、学业笔记共享、二手物品交易等互助服务。

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS v3
- **后端**: Node.js + Express + 内存存储
- **状态管理**: Zustand
- **HTTP客户端**: Axios
- **UI组件**: Lucide React + Framer Motion

## 功能特性

### 1. 用户系统
- 账号密码登录/注册
- 手机号验证码登录（模拟）
- 学校邮箱验证注册
- JWT认证与授权
- 个人中心管理

### 2. 服务交易
- 发布需求（快递代取、自习室预约、笔记共享、二手交易）
- 接单机制
- 订单管理
- 支付流程（模拟）

### 3. 位置服务
- 自动定位
- 学校选择
- 距离排序

### 4. 消息系统
- 用户间消息
- 客服反馈

## 项目结构

```
├── src/
│   ├── api/           # API接口
│   ├── components/    # 通用组件
│   ├── pages/         # 页面组件
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   ├── App.jsx        # 主应用
│   ├── main.jsx       # 入口文件
│   └── index.css      # 全局样式
├── backend/           # 后端服务
│   ├── config/        # 配置文件
│   ├── controllers/   # 控制器
│   ├── middleware/    # 中间件
│   ├── routes/        # 路由
│   └── index.js       # 入口文件
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 启动方式

### 1. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd backend
npm install
```

### 2. 启动后端服务

```bash
cd backend
npm start
```

后端服务将运行在 http://localhost:5000

### 3. 启动前端服务

```bash
npm run dev
```

前端服务将运行在 http://localhost:5173

## API接口

### 用户接口
- POST /api/users/register - 用户注册
- POST /api/users/login - 用户登录
- GET /api/users/profile - 获取个人资料
- PUT /api/users/profile - 更新个人资料

### 服务接口
- GET /api/services - 获取服务列表
- GET /api/services/:id - 获取服务详情
- POST /api/services - 创建服务
- PUT /api/services/:id - 更新服务
- DELETE /api/services/:id - 删除服务

### 订单接口
- GET /api/orders - 获取订单列表
- POST /api/orders - 创建订单
- POST /api/orders/:id/confirm - 确认订单

### 学校接口
- GET /api/schools - 获取学校列表

## 配置说明

### 地图API配置

1. 访问百度地图开放平台: https://lbsyun.baidu.com/
2. 注册账号并创建应用
3. 获取AK（访问密钥）
4. 在 `.env` 文件中配置:

```
VITE_BAIDU_MAP_AK=your_baidu_map_ak
```

### 后端配置

在 `backend/.env` 文件中配置:

```
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

## 开发说明

### 前端开发

- 使用 Tailwind CSS 进行样式开发
- 使用 Zustand 进行状态管理
- 使用 React Router 进行路由管理
- 使用 Axios 进行HTTP请求

### 后端开发

- 使用 Express 框架
- 使用 JWT 进行认证
- 使用内存存储（可替换为SQLite/MongoDB）

## 注意事项

1. 当前使用内存存储，重启服务后数据会丢失
2. 支付功能为模拟实现，生产环境需接入正规支付SDK
3. 地图功能需要配置正确的API Key
4. 短信验证码为模拟实现，生产环境需接入短信服务商

## 后续优化方向

1. 接入真实数据库（SQLite/MongoDB）
2. 接入百度/高德地图API实现精确定位
3. 接入支付宝/微信支付SDK
4. 实现WebSocket实时消息
5. 添加图片上传功能
6. 实现服务评价系统
7. 添加更多服务类型

## 许可证

MIT License
