# CatTab - 新标签页 (CatTab New Tab)

一个基于 **Next.js** + **Tailwind CSS** 构建的极简主义浏览器起始页。
部署在免费且高速的 Cloudflare Pages 上，拥有沉浸式的视频背景、实时农历时钟、优雅的搜索引擎切换以及毛玻璃风格的快捷导航。

演示地址：https://cattab.kayala.nyc.mn

## ✨ 核心特性

- ⚡ **极速加载**：采用静态导出模式 (`output: 'export'`)，适配 Cloudflare Edge 网络。
- 🎥 **沉浸体验**：全屏 MP4 视频背景（优先显示静态图，节省带宽）。
- ⏰ **实时信息**：显示当前时间、日期以及**中国农历**。
- 🔍 **多引擎搜索**：
  - 支持百度、Google、必应、DuckDuckGo 等。
  - 极简下拉菜单，支持鼠标悬停交互。
- 🔗 **快捷导航**：底部悬浮胶囊式导航栏，支持原标签页直接打开。
- ⚙️ **云端配置**：所有链接和搜索引擎均可通过 Cloudflare 环境变量自定义。

## 🚀 部署到 Cloudflare Pages (推荐)

### 1. 准备工作
先点击 GitHub 仓库右上角的 Fork 按钮，将项目复制到你的 GitHub 账户。

### 2. Cloudflare 设置步骤
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
3. 选择你的 **CatTab** 仓库并开始设置。
4. **关键配置** (Build settings)：
   - **Framework preset (框架预设)**: 选择 `Next.js (Static HTML Export)`。
   - **Build command**: `npm run build`。
   - **Build output directory (输出目录)**: **`out`** (注意：必须填 out)。
5. 点击 **Save and Deploy**。

---

## 🛠️ 环境变量配置

无需修改代码，你可以在 Cloudflare 项目的 **Settings** -> **Environment Variables** 中设置以下变量。
*注意：设置完环境变量后，需要去 Deployments 页面点击 "Retry deployment" 重新构建才会生效。*

### 1. 底部导航链接 (`NEXT_PUBLIC_NAV_LINKS`)
格式为 JSON 数组。

**示例值：**
```json
[
  {"name":"淘宝","url":"https://www.taobao.com"},
  {"name":"京东","url":"https://www.jd.com"},
  {"name":"知乎","url":"https://www.zhihu.com"},
  {"name":"B站","url":"https://www.bilibili.com"},
  {"name":"GitHub","url":"https://github.com"}
]
```

### 2. 搜索引擎列表 (`NEXT_PUBLIC_SEARCH_ENGINES`)
格式为 JSON 数组。不设置则使用默认列表。

**示例值：**
```json
[
  {"name": "百度", "url": "https://www.baidu.com/s?wd="},
  {"name": "Google", "url": "https://www.google.com/search?q="},
  {"name": "必应", "url": "https://www.bing.com/search?q="}
]
```

---

## 🧩 如何设置为浏览器“新建标签页”？

由于浏览器（Edge/Chrome）的安全限制，默认设置无法更改“新建标签页”的地址。你需要安装一个轻量级插件来实现。

### 推荐方案：使用 Custom New Tab URL 插件

**步骤 1：安装插件**
- **Edge 用户**: [点击前往微软商店下载](https://microsoftedge.microsoft.com/addons/detail/custom-new-tab-url/peaghqbcckbncgpjekxgccjgnpjpgbem)
- **Chrome 用户**: [点击前往 Chrome 商店下载](https://chromewebstore.google.com/detail/custom-new-tab-url/mmjbfehnmbegkmipeaijcxnmajfcipmo) (或搜索 New Tab Redirect)

**步骤 2：配置地址**
1. 安装后，点击浏览器右上角的插件图标（或在扩展管理中找到它）。
2. 在 **URL** 输入框中，填入你的 Cloudflare 网址（例如 `https://your-cattab.pages.dev`）。
3. 点击 **Save** 保存。

**步骤 3：保留更改 (重要！)**
首次点击浏览器顶部的 `+` 号新建标签页时，浏览器会弹出安全警告：“扩展是否更改了新建标签页？”
👉 **请务必选择【保留更改 (Keep changes)】**。

现在，每次新建标签页都会打开你的 CatTab 导航页了！

---

## 🎨 个性化定制

- **替换视频**：
  替换 `public/background/cat.mp4` 文件（建议压缩至 5MB 以内）。
- **替换静态底图**：
  替换 `public/background/cat.jpg` 文件（用于视频加载前的过渡）。
- **修改图标**：
  将你的图标重命名为 `icon.png` 替换 `app/icon.png`。

## 📦 技术栈

- [Next.js 14](https://nextjs.org/) (Static Export)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lunar-javascript](https://github.com/6tail/lunar-javascript)

## 📄 开源协议

MIT License
