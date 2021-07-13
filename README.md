# simple-chatroom

一个聊天室项目

## 项目命题

- React + ReactHooks + TS
- 使用 lerna 管理 monorepo
- 一个全栈聊天室

## 记录

### monorepo 项目创建

拿到这个命题之后，首先对 lerna 进行一个了解，然而官方文档并没有特别好的上手指引，用关键词「lerna」、「monorepo」、「yarn workspace」进行搜索，看了一些社区的实践，通过提出问题来驱动实践，做到 menorepo 的一个项目搭建。

过程中提出并解决了如下问题(只是举个例子，实际遇到的问题更多)：

- 如何使用 lerna 创建项目
  - lerna init
- lerna 如何选择依赖模式(independent)
- lerna 配置 yarn 作为依赖管理工具
- 如何将依赖提升，workspace 模式
- 如何给单独项目指定依赖 -- scope
- 如何创建依赖之间的关联 lerna link

之后的思路便是以关键词「React」、「聊天室」寻找一些不错的项目进行参考，其中搜索到了一篇 [基于 React、TS 的聊天室 monorepo 实战](https://zhuanlan.zhihu.com/p/126364500)，发现作者的思路非常好，提供了非常大的一个参考。最终项目的 UI 部分由于时间紧张，组件部分直接拿来用了，

#### 项目结构设计

首先是项目的 repo 设计，拆分的原则就是能否复用或者独立项目

```txt
.
├── @chatroom/app // 前端应用
├── @chatroom/component // 可复用组件
├── @chatroom/helper // 业务相关可复用工具函数、TS 类型定义
├── @chatroom/hooks // 可复用 hooks
├── @chatroom/utils // 可复用工具函数
└── @chatroom/server // 服务端应用
```

@chatroom/component 这一层将引用的基础组件库全量导出，这么做的考虑是可以在此预留一层基础组件的封装，而不是在 @chatroom/app 去引入基础组件。

### 业务开发

业务的开发思路是先实现逻辑，再去配套 UI。

TS 的类型定义先行，定义出用户端、服务端之间的通信数据结构，事件类型。

用户端没有使用重量级框架，选用 create-react-app 进行项目初始化，并且写了一个 Todo 作为 Hooks 的练手。

编码阶段先进行数据流的设计，使用 `createContext`、`useContext`、`useReducer` 类比 Redux 实现了聊天室状态管理，并将其与服务端事件响应打通，完成了整套前后端数据流的交互。

服务端的实现为了更简单，没有引入数据库，在业务上也做了阉割，仅仅是输入昵称就可加入会话。服务端实现参考 socket.io 官方示例，直接 ts-node 启了个项目。

类似 lerna 的上手，整个项目中遇到了非常多的问题，都通过查找资料一一解决。
