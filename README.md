# Just Phil Ride

React + TypeScript 还原项目，参考 [Just Phil Ride](https://www.justphilride.co.uk/)。首页、Diary 和 Contact 已拆为独立页面；样式使用 CSS，入场、文字显示和照片拖动使用 Framer Motion。

详细实施记录见 [网站还原实施文档](IMPLEMENTATION_REPORT.md)，包含逐 Section 工作、素材处理、动画实现、测试结果和当前限制。

## 启动

```bash
nvm use
npm install
npm run dev
```

需要 Node 20.19+（`.nvmrc` 固定为 20.19.5）。打开终端显示的网址，默认 http://localhost:5173/。

## 检查

```bash
npm run build
npm run lint
npm test
```

浏览器测试使用本机 Google Chrome，无需另下载浏览器。覆盖区块与图片加载、文章展开、视频入口、手机菜单、照片拖动、Contact 输入校验、减少动态效果设置，以及 320 / 390 / 768 / 1024 / 1440px 下的横向溢出检查。

## 页面与素材

- `/`：完整首页区块。
- `/diary`：动态与捐款区。
- `/contact`：联系页外观与输入框。按用户要求不实现发送功能，Submit 按钮禁用；不会发请求或创建邮件草稿。
- `src/components/`：独立区块和通用动画组件。
- `src/data/`：照片、赞助商和外链。
- `public/media/`：本地图片、SVG Logo、徽章、字体和视频。
- `scripts/download_images.py`：公开图片下载脚本；使用方式见 `scripts/README.md`。

视频播放器点击后才加载 YouTube iframe。装饰视频仅在可见且未启用减少动态效果时播放。图片、字体和装饰视频均从本地加载。

原站品牌与设计署名保留为 Mike Kus。Diary 初始摘要对齐原站，展开后补充说明为摘要，并提供完整原文链接。本项目已对比桌面和手机的参考截图；它是独立 React 实现，未宣称动画逐帧完全一致。
