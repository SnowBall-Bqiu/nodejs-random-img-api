# 随机图片 API

这是一个基于 **Node.js** 与 **Express** 的简单随机图片服务。

## 项目结构
```
nodejs-random-img-api/
├─ img/
│  ├─ h/      # 横屏图片目录
│  └─ m/      # 竖屏图片目录
├─ src/
│  └─ server.js   # 服务器入口
├─ package.json
└─ README.md
```

## 安装依赖
```bash
npm install
```

## 启动服务器
```bash
npm start   # 运行 http://localhost:3000
```

## API 端点
- `GET /h`  : 随机返回一张 **横屏** 图片并 **重定向** 到 `/img/h/<filename>`
- `GET /m`  : 随机返回一张 **竖屏** 图片并 **重定向** 到 `/img/m/<filename>`
- `GET /img/*` : 直接访问 `img` 目录下的所有图片（静态文件服务）
- `GET /<folder>` : 随机返回 `<folder>` 子目录下的任意图片（包括 `h` 与 `m`）
- `GET /<folder>/h` : 随机返回 `<folder>/h` 子目录中的图片
- `GET /<folder>/m` : 随机返回 `<folder>/m` 子目录中的图片
- `GET /all` : 随机返回所有二级子目录中的任意图片
- `GET /all/h` : 随机返回所有二级子目录的 `h` 子目录中的图片
- `GET /all/m` : 随机返回所有二级子目录的 `m` 子目录中的图片

## 示例
```bash
curl -I http://localhost:3000/h   # 会返回 302 重定向到具体图片路径
curl -I http://localhost:3000/m
```

## 注意事项
- 确保在 `img/h` 与 `img/m` 目录中放置图片文件（支持 PNG、JPG、JPEG、GIF、WEBP）。
- 若对应目录为空，接口会返回 `404 Not Found`。
- 项目使用 **CommonJS** 模块语法，兼容 Node.js 14+。
