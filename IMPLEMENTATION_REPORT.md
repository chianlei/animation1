# Just Phil Ride 网站还原实施文档

记录日期：2026-09-15  
参考网站：https://www.justphilride.co.uk/  
项目目录：`animation1`

本文记录本次实际完成的实现工作、代码位置、交互方式及验证结果。它不是未来开发计划，也不代表已经通过原站所有像素和动画帧的一致性验收。

## 1. 交付范围

本次把最初的参考 Demo 改成独立的 React 实现，建立了完整首页区块、Diary 页面和 Contact 页面。页面使用整理后的原站公开素材，并针对桌面与手机分别调整布局。

| 页面    | 地址       | 实现范围                                                                                    |
| ------- | ---------- | ------------------------------------------------------------------------------------------- |
| 首页    | `/`        | 导航、首屏、统计、介绍、赞助商、视频、故事、照片、路线、动态、Mission、捐款、设计署名、页脚 |
| Diary   | `/diary`   | 动态摘要、展开／收起、追踪入口及捐款区                                                      |
| Contact | `/contact` | 照片、介绍、输入框、赞助商和公共页脚                                                        |

Contact 按用户明确要求不实现发送功能。Submit 按钮禁用，不提交网络请求，也不生成邮件草稿。

Diary 展开后的补充文字为摘要，附原站完整文章链接；没有逐字复制全部原文，也没有接入动态文章 CMS。

## 2. 原站检查与对比方法

实施过程中用本机 Chrome 打开原站首页、Diary 和 Contact，保存页面 HTML、桌面／手机截图，并读取可见元素的位置、尺寸和计算样式。

检查内容包括：

- 页面边距、Section 间距、容器宽度、圆角及虚线边框。
- 标题与正文的字体、字号、行高、字距和段落宽度。
- Hero 背景裁切、大型标识位置和手机文字换行。
- 赞助商双排布局、照片位置与旋转角度。
- 地图尺寸、图例位置、视频比例和底部双列结构。
- 桌面与手机之间的布局变化、导航和内容入口。

相关工具：

| 文件                            | 作用                                           |
| ------------------------------- | ---------------------------------------------- |
| `scripts/inspect-reference.mjs` | 用 Chrome 检查原站并收集参考资料               |
| `scripts/export-reference.mjs`  | 导出原站页面、样式信息和截图                   |
| `scripts/capture-local.mjs`     | 截取本地桌面／手机页面和区块，检查实现后的布局 |

检查时生成的参考截图和 JSON 位于开发机 `/tmp/justphil-reference/`；本地截图位于 `/tmp/justphil-local/`。这些是临时检查资料，不作为永久项目交付文件，系统清理临时目录后需要重新生成。

## 3. 技术组成

| 技术             | 当前用途                                                 |
| ---------------- | -------------------------------------------------------- |
| React 19         | 页面组件、公共组件、菜单与文章状态                       |
| TypeScript 6     | 组件参数、数据结构和编译检查                             |
| Vite 8           | 开发服务器、资源处理和生产构建                           |
| Framer Motion 12 | 入场、逐字显示、菜单过渡、照片拖拽及文章展开             |
| CSS              | 页面布局、颜色、字体、媒体查询、赞助商循环和手机横滑样式 |
| ResizeObserver   | 首屏文字随可用宽度调整字号                               |
| 浏览器视频 API   | 装饰视频播放／暂停控制及封面生成                         |
| Playwright       | 使用本机 Chrome 执行浏览器测试                           |
| Python 3         | 图片抓取、资源去重和素材准备                             |

项目中保留 Tailwind 依赖，但当前主要样式由 `src/index.css` 和 `src/App.css` 实现。没有使用 GSAP，也没有通过 React Router 管理页面；`App.tsx` 根据当前 pathname 选择页面，链接通过浏览器正常导航。

这些技术描述的是本项目的实现，不能据此推断原站使用了同样的技术。

## 4. 项目结构调整

```text
src/
  App.tsx                 页面选择、公共导航、页脚和动态设置
  index.css               字体与全局基础样式
  App.css                 区块样式和响应式规则
  pages/
    Home.tsx              首页区块组合
    Diary.tsx             Diary 页面
    Contact.tsx           Contact 页面
  components/
    UI.tsx                通用入场、标识、按钮和文字组件
    Navbar.tsx            固定导航与手机菜单
    Hero.tsx / Stats.tsx  首屏和挑战徽章
    About.tsx             项目介绍
    Sponsors.tsx          赞助商循环
    Video.tsx             按需视频播放器
    Inspiration.tsx       骑行故事
    Gallery.tsx           照片卡片与拖拽
    Route.tsx             路线地图
    Updates.tsx           动态摘要与展开
    Mission.tsx           Mission 宣传区
    CTA.tsx               捐款区
    Designer.tsx          设计署名区
    AmbientVideo.tsx      装饰视频可见性控制
    Footer.tsx            公共页脚
  data/
    site.ts               素材地址与公共链接
    photos.ts             照片信息
    sponsors.ts           赞助商信息
public/media/             本地素材
scripts/                  抓取和截图工具
tests/site.spec.ts        浏览器测试
```

首页不再由一个文件包办所有内容。照片、赞助商和链接与展示组件分开，后续修改素材或链接可以集中处理。

## 5. 素材处理

### 图片下载脚本

新增 `scripts/download_images.py`，使用 Python 标准库，不需要额外安装 Python 包。

脚本通过 sitemap 和同站链接发现页面，提取 HTML 图片、srcset、社交预览图片、行内 CSS 背景、外部样式表图片及嵌入的 Framer 图片地址。对原始 Framer 图片去重，对其他图片服务保留必要的变换参数，并处理重试和已下载文件跳过。

```bash
python3 scripts/download_images.py
```

默认保存到 `downloads/justphilride/`，生成 `image-urls.txt` 和 `manifest.json`，用于查看地址、对应文件及失败记录。本次抓取下载了 17 个去重后的图片资源；这不代表枚举了网站的全部私有素材。

抓取范围限于公开页面和可发现的资源。仅在 JavaScript 交互后出现、需要登录、未被链接或位于外部嵌入页面内的图片，不保证被扫描到。

### 页面使用的本地资源

使用 `scripts/prepare-reference-assets.py` 整理图片与参考页面中的资源，准备了山路背景、人物照片、原站 PHIL artwork、月桂徽章、慈善机构标识、赞助商标识、路线 SVG 和装饰视频。

字体使用 Anton、Manrope 和 JetBrains Mono，分别承担大标题、正文及辅助文字。素材从本地加载，减少对原站图片服务的运行时依赖；YouTube 和外链仍依赖外部服务。

Mike Kus 视频另生成静态封面 `mike-kus-poster.png`，用于视频还未开始播放时显示。

## 6. 首页逐 Section 实现记录

### 6.1 Navbar — 顶部导航

文件：`src/components/Navbar.tsx`

- 使用原站 Logo 形状，调整固定导航高度、奶油色背景和粉色虚线边框。
- 对齐导航链接、Donate 按钮、桌面间隔及手机 Logo 尺寸。
- 接入 Diary、Contact、Sponsorship、Live Tracker 和 Donate 相关入口。
- 手机菜单使用 AnimatePresence 处理开关过渡。
- 菜单打开时锁定页面滚动，支持 Escape 关闭，并处理菜单内键盘焦点。
- 加入 Logo 入场效果；页面提供 Skip to content 跳转入口。

### 6.2 Hero — 首屏

文件：`src/components/Hero.tsx`、`src/components/UI.tsx`

- 替换 Demo 标题组合，使用原站大型 PHIL SVG artwork。
- 使用原站山路背景，对齐背景裁切、首屏高度和标识位置。
- 保留车轮装饰、慈善机构标识及桌面两侧挑战说明。
- 桌面与手机使用分别定义的标题结构；手机为三行口号。
- FitText 使用 ResizeObserver 和字体加载完成回调，根据可用宽度计算字号。
- 标识使用位移和透明度入场，两侧说明使用逐字显示。

### 6.3 Stats — 挑战数据

文件：`src/components/Stats.tsx`

- 用原站月桂 SVG 替换普通数据网格。
- 显示四项挑战数据及对应标签。
- 桌面横向排列，手机改为纵向排列。
- 调整徽章尺寸、间距及与 Hero 背景的衔接。

### 6.4 About — 项目介绍

文件：`src/components/About.tsx`

- 恢复原站介绍结构与正文。
- 左侧标题和单车图形，右侧较宽正文。
- 调整标题字号、正文宽度、行距与两列比例。
- 手机改为上下排列，内容进入视口时显示。

### 6.5 Sponsors — 赞助商

文件：`src/components/Sponsors.tsx`、`src/data/sponsors.ts`

- 新增原先缺失的赞助商区块。
- 使用原站 Logo 与链接，分别整理首页和 Contact 的赞助商数据。
- 实现两排反方向循环滚动。
- 调整虚线边框、覆盖在边框上的标题、Logo 尺寸和留白。

### 6.6 Video — 视频区

文件：`src/components/Video.tsx`

- 新增原先缺失的视频区。
- 使用原站封面照片、灰度显示和粉色圆形播放按钮。
- 保持 16:9 比例，点击后才创建 YouTube iframe。
- 播放入口可通过键盘操作，不在首屏立即加载完整播放器。

### 6.7 Inspiration — 骑行背后的故事

文件：`src/components/Inspiration.tsx`

- 恢复标题、故事内容、慈善机构链接和双列排版。
- 调整正文宽度、字体、段落间隔和照片区前的留白。
- 手机采用单列结构，并使用通用区块入场。

### 6.8 Gallery — 照片区

文件：`src/components/Gallery.tsx`、`src/data/photos.ts`

- 用七张原站照片替换原来的三张 Demo 卡片。
- 整理照片标题、日期、编号、裁切、卡片尺寸和旋转角度。
- 按参考位置建立桌面叠放布局，支持独立拖动卡片和调整叠放层级。
- 手机使用原生横向滚动与滚动吸附，支持触屏滑动。
- 最后修正拖拽与初始位置互相影响的问题：外层负责初始位置及入场，内层负责拖拽。

当前桌面拖拽没有设置必须留在照片区内部的边界；测试验证了能够拖动，没有验证每一个拖动边界与原站完全相同。

### 6.9 Route — 路线地图

文件：`src/components/Route.tsx`

- 移除 Demo 自绘示意地图，使用原站路线 SVG。
- 加入大标题、Phil 头像、Live Tracking 入口和路线图例。
- 调整桌面地图尺寸、叠放位置、网格背景与图例位置。
- 修正地图覆盖标题的问题，明确标题层级。
- 手机重新安排标题、头像、地图和下方图例。

地图以原版 SVG 展示，不包含自行开发的实时定位系统；实时追踪通过外链进入。

### 6.10 Updates — 最新动态

文件：`src/components/Updates.tsx`

- 实现黑色面板、粉色虚线分隔及装饰角标。
- 显示头像、文章标题、时间和正文摘要。
- 首页提供 View Full Diary；Diary 页面提供 Live Tracker。
- Show More / Show Less 使用组件状态控制，AnimatePresence 实现高度和透明度过渡。
- 按钮包含 aria-expanded 与 aria-controls。

文章当前写在组件中，尚未提取成独立文章数据源。展开后的补充文字为摘要及原文入口。

### 6.11 Mission — 底部故事宣传区

文件：`src/components/Mission.tsx`

- 新增原先缺失的宣传区，用原站山路素材作为背景。
- 实现粉色背景处理、奶油色文字、箭头及虚线内框。
- 调整大标题、等宽长文、桌面双列和底部留白。
- 手机使用独立字号与间距规则，保持长文可读。

### 6.12 Donation — 捐款区

文件：`src/components/CTA.tsx`、`src/components/AmbientVideo.tsx`

- 用原站黑色双列结构替换 Demo 粉色 CTA。
- 加入慈善机构标识、大标题、说明及浅色捐款按钮。
- 捐款入口连接原站 JustGiving 募款链接。
- 右侧显示骑行视频；手机改为上下排列。
- 装饰视频仅在可见且没有启用减少动态效果时播放，离开可视区域后暂停。

### 6.13 Designer — 设计署名

文件：`src/components/Designer.tsx`

- 新增 Mike Kus 作品预览视频、静态封面、说明和链接。
- 桌面采用视频与文案双列，手机上下排列并保留视频。
- 调整标题、粉色链接、等宽说明和按钮。
- 保留原站设计署名。

### 6.14 Footer — 页脚

文件：`src/components/Footer.tsx`

- 补齐导航、社交平台、邮箱、慈善说明和设计署名。
- 实现虚线边框、桌面多列及手机堆叠。
- 调整字号、列间距、内边距及链接交互。
- 联系邮箱作为正常 mailto 链接保留，与 Contact 表单发送功能无关。

## 7. 独立页面和公共行为

`src/pages/Home.tsx` 按原站顺序组合首页区块；`Diary.tsx` 复用动态和捐款组件；`Contact.tsx` 实现联系页外观。

`App.tsx` 根据路径选择页面，设置相应浏览器标题，并处理初始 URL 的锚点滚动。Navbar 和 Footer 由所有页面共用。

全局 MotionConfig 使用用户的减少动态效果设置。通用 Reveal 和文字组件提供对应处理，装饰视频在该设置下暂停。这是功能可用性处理，并非已经完成整站无障碍审计。

## 8. 动画实现清单

| 效果         | 实现方式                                |
| ------------ | --------------------------------------- |
| 通用区块入场 | Framer Motion whileInView，位移与透明度 |
| 逐字显示     | 字符拆分、透明度及模糊过渡              |
| Hero artwork | 初始位移、透明度和缓动                  |
| 车轮装饰     | 分组延迟、位移及旋转                    |
| 手机菜单     | AnimatePresence 开关过渡                |
| 照片卡片     | 外层入场，内层 Framer Motion drag       |
| 赞助商循环   | CSS 循环动画                            |
| 文章展开     | 状态控制、高度与透明度过渡              |
| 手机照片横滑 | 原生滚动与 CSS 滚动吸附                 |
| 装饰视频     | 可见性和用户动态设置控制                |

本项目没有把所有动态都放到 Framer Motion 中，也没有对全部滚动过程做逐帧比对。

## 9. 验证记录

最后一轮实现检查结果：TypeScript 检查通过、ESLint 通过、Vite 生产构建通过，7 项 Chrome 浏览器测试通过。

测试文件：`tests/site.spec.ts`。配置文件：`playwright.config.ts`。

| 测试           | 验证内容                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| 首页区块与图片 | 主要区块存在，本地 HTML 图片解码，无页面 JavaScript 错误及横向溢出         |
| 动态展开       | Show More / Show Less 能展开和收起                                         |
| 视频按需加载   | 点击后启用播放器；测试中模拟外部 YouTube 请求，不证明线上视频服务始终可用  |
| 手机菜单及宽度 | 菜单、Escape 关闭、页面入口，以及 320 / 390 / 768 / 1024 / 1440px 宽度检查 |
| Contact 输入   | 标签关联、必填和邮箱格式校验；不测试提交服务                               |
| 照片拖拽       | 桌面照片可以通过拖动改变位置                                               |
| 减少动态效果   | 内容可见，装饰视频暂停                                                     |

浏览器测试主要验证功能和布局问题，没有使用自动像素差异阈值验收。桌面与手机截图另外人工查看，不等于所有设备和浏览器都已覆盖。

## 10. 启动、检查和构建

项目 `.nvmrc` 固定为 Node 20.19.5；当前 Vite 需要兼容的 Node 版本。

```bash
nvm use
npm install
npm run dev
```

打开终端显示的网址，默认 `http://localhost:5173/`；端口占用时 Vite 会显示其他端口。

```bash
npm run lint
npm run build
npm test
```

浏览器测试使用本机 Google Chrome。生产构建输出在 `dist/`；可通过 `npm run preview` 本地检查构建结果。

本次没有部署或发布到外部服务器。生产部署需要让服务器支持 `/diary` 和 `/contact` 等路径回退到 `index.html`，否则直接刷新内页可能出现 404。

## 11. 当前限制与未完成范围

1. 未完成动画逐帧一致性验收，不能声称原站每个时序、触发位置和缓动完全相同。
2. Diary 展开内容是摘要和原文链接，不是全部文章逐字复制；没有 CMS 或实时文章同步。
3. Contact 按用户要求不发送，Submit 禁用。
4. 地图为原站 SVG，实时追踪、捐款和部分内容通过外链进入。
5. 自动化测试覆盖 Chrome 和列出的宽度，未全面测试 Safari、Firefox 或所有实体手机。
6. 原站截图和样式资料是开发机临时文件，没有打包成永久参考资料库。
7. 图片抓取脚本覆盖可发现的公开资源，不保证获得网站所有隐藏或私有图片。

## 12. 交付文件索引

| 文件／目录                 | 内容                         |
| -------------------------- | ---------------------------- |
| `IMPLEMENTATION_REPORT.md` | 本实施文档                   |
| `README.md`                | 快速启动、检查命令和范围说明 |
| `TODO.md`                  | 按区块的完成记录             |
| `src/components/`          | 首页与公共区块实现           |
| `src/pages/`               | 三个页面                     |
| `src/data/`                | 照片、赞助商及公共链接       |
| `public/media/`            | 页面使用的本地素材           |
| `scripts/README.md`        | 图片下载脚本的使用与抓取边界 |
| `tests/site.spec.ts`       | 功能及响应式浏览器测试       |
