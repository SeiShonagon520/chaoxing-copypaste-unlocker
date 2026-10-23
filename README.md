# 学习通复制粘贴解除 - MAIN环境诊断版

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-4.1.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/platform-Tampermonkey%20%7C%20Violentmonkey%20%7C%20ScriptCat-orange.svg" alt="Platform">
</p>

针对超星学习通（特别是 `mooc2-ans.chaoxing.com` 新版作答页面及各种嵌套 iframe 架构），通过模拟浏览器控制台（MAIN World / 页内主上下文环境）解除复制、剪切、粘贴、右键菜单和文本选取的限制。

---

## 🚀 快速安装

推荐使用以下主流脚本管理器：
- **Tampermonkey（篡改猴）**
- **Violentmonkey（暴力猴）**
- **ScriptCat（脚本猫）**

### 安装渠道
- **GreasyFork 一键安装**: [学习通复制粘贴解除 - MAIN环境诊断版](https://greasyfork.org/zh-CN/scripts/593720-%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%99%A4-main%E7%8E%AF%E5%A2%83%E8%AF%8A%E6%96%AD%E7%89%88)
- **GitHub Raw 源安装**: [点击直接安装](https://raw.githubusercontent.com/SeiShonagon520/chaoxing-copypaste-unlocker/main/chaoxing-unlock.user.js)
- **jsDelivr CDN 加速安装**: [点击通过 CDN 安装](https://cdn.jsdelivr.net/gh/SeiShonagon520/chaoxing-copypaste-unlocker@main/chaoxing-unlock.user.js)

---

## ✨ 核心特性

- 🎯 **突破隔离沙箱**：普通油猴脚本运行在 Isolated World（扩展沙箱），无法直接替换页内原生原型与闭包监听器。本脚本通过原生 DOM `<script>` 注入主环境（MAIN World），达到与在 F12 Console 手动输入完全一致的高权限。
- 🔄 **按类型分派的事件拦截**：
  - `copy` / `cut` / `contextmenu` / `selectstart` / `dragstart`：页面拦截这些事件没有正当理由，直接在捕获阶段截断。
  - `paste` / `keydown` / `keyup` / `keypress` / `mousedown` / `mouseup`：**只解除 `preventDefault` / `returnValue`，不阻断传播**。早期版本对所有事件统一 `stopPropagation`，会让编辑器自身收不到事件，表现为「输入框不能输入、粘贴无反应」。
  - 同时注册在 `window` 与 `document` 的捕获阶段：`window` 捕获早于 `document` 捕获，避免被页面在 `document` 层的拦截抢先。
- 🎨 **强制文本可选中**：学习通把 `user-select:none` 挂在 `<html>` 的内联 style 上（不是正文容器的 class），脚本用 `!important` 覆盖 `html` / `body` 及其全部后代，并在 `document.head` 尚不存在时递归重试注入。
- 🧬 **还原被劫持的选区 API**：页面可能把 `getSelection` 或 `Selection.prototype.toString` 换成返回空字符串的桩函数，导致「能选中但复制为空」。脚本用 `[native code]` 校验当前实现，若已被替换则从临时同源空白 iframe 取一份干净实现还原，并周期性复查（页面常在初始化完成后再次覆盖）。
- ⌨️ **接管 Ctrl+C / Ctrl+V / Ctrl+X**：页面用 `document.onkeydown = () => false` 取消快捷键时，覆盖事件对象的 `preventDefault` **无法**撤销这种内核级取消。脚本在 `window` 捕获阶段抢先截断按键，自行读写剪贴板完成复制/粘贴。
- 🖼️ **递归穿透嵌套 iframe**：
  - 自动遍历页面上所有同源 iframe（包括富文本编辑器 UEditor / 自研题库 iframe）。
  - 对动态生成的 iframe 进行深度探查与脚本注入。
- 🧹 **透明遮罩清理**：只处理「覆盖 ≥40% 视口 + 背景透明 + 无文本 + 无交互元素」的层（`pointer-events: none`），不误伤正常弹窗。
- ⚡ **SPA 路由与动态 DOM 监听**：
  - 基于 `MutationObserver` 实时感知答题区渲染与题目切换。
  - 拦截并监听 `history.pushState`、`history.replaceState` 以及 `popstate`，页面切换无需刷新即可自动重新生效。
- 📊 **可视化诊断日志**：
  - 按 `F12` 打开浏览器开发者工具（Console），带有醒目的 `[粘贴助手]` 前缀色彩日志。
  - `window.__CX_PASTE_DEBUG__` 提供 `status()`、`sweep()`、`maskKilled()`、`restoredApiCount()`。

---

## 🛠️ 使用方法

1. 安装油猴插件后，点击上方安装链接完成脚本安装。
2. 打开学习通考试或作业答题页面（如 `https://mooc2-ans.chaoxing.com/...`）。
3. 脚本会自动静默生效。
4. 在文本框或作答区域尝试 `Ctrl + C` 复制与 `Ctrl + V` 粘贴。
5. **如遇特殊题型或异常**：按 `F12` 打开控制台，筛选 `[粘贴助手]` 查看诊断详情或在 GitHub Issues 提交反馈。

---

## ⚙️ 匹配网址

- `https://mooc2-ans.chaoxing.com/*`
- `https://*.chaoxing.com/*`

---

## 🧪 已验证的拦截场景

以下场景在真实 Chromium 内核浏览器中逐项验证（拖选 → `Ctrl+C` → 键入 → `Ctrl+V`），全部通过：

| 拦截手段 | 选中 | 复制 | 键入 | 粘贴 |
|---|---|---|---|---|
| 无限制 | ✅ | ✅ | ✅ | ✅ |
| CSS `user-select:none` | ✅ | ✅ | ✅ | ✅ |
| `document.addEventListener` 捕获拦截 | ✅ | ✅ | ✅ | ✅ |
| 内联 `oncopy` / `onkeydown` 返回 false | ✅ | ✅ | ✅ | ✅ |
| `getSelection` / `toString` 被替换 | ✅ | ✅ | ✅ | ✅ |
| 全屏透明遮罩覆盖正文 | ✅ | ✅ | ✅ | ✅ |
| 禁止粘贴（清空输入框） | ✅ | ✅ | ✅ | ✅ |
| `execCommand` 被改写 | ✅ | ✅ | ✅ | ✅ |
| 以上全部叠加 | ✅ | ✅ | ✅ | ✅ |

---

## ⚠️ 已知限制

- **字体混淆不在本脚本范围**：学习通部分题目用 `.font-cxsecret` 自定义字体把字形映射到生僻字码位，效果是「看得懂、复制出来是乱码」。这需要在字形层做映射还原（遍历码位 + 字形轮廓哈希查表），与事件层解除是两件独立的事。仅解除复制时，复制到的仍是加密码位。
- **跨域 iframe** 受同源策略限制，只有 iframe 自身匹配 `*.chaoxing.com` 时脚本才会在其内部运行。
- **`sandbox` / 部分 `data:` `blob:` iframe** 可能无法访问或注入。

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。仅供学习交流与浏览器技术研究使用，请合理合规使用。
