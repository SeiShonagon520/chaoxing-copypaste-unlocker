# 学习通复制粘贴解除 - MAIN环境诊断版

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-4.0.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/platform-Tampermonkey%20%7C%20Violentmonkey%20%7C%20ScriptCat-orange.svg" alt="Platform">
</p>

针对超星学习通（特别是 `mooc2-ans.chaoxing.com` 新版作答页面及各种嵌套 iframe 架构），通过模拟浏览器控制台（MAIN World / 页内主上下文环境）彻底解除复制、剪切、粘贴、右键菜单和文本选取的限制。

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
- 🔄 **全方位事件捕获与阻断**：
  - 拦截并停止冒泡：`paste`, `copy`, `cut`, `contextmenu`, `keydown`, `keyup`, `keypress`, `selectstart`, `dragstart`, `mousedown`。
  - 清除 `preventDefault` / `stopPropagation` 造成的按键与粘贴死锁。
- 🖼️ **递归穿透嵌套 iframe**：
  - 自动遍历页面上所有同源/跨源 iframe（包括富文本编辑器 UEditor / TinyMCE / 自研题库 iframe）。
  - 对动态生成的 iframe 进行深度探查与脚本注入。
- ⚡ **SPA 路由与动态 DOM 监听**：
  - 基于 `MutationObserver` 实时感知答题区渲染与题目切换。
  - 拦截并监听 `history.pushState`、`history.replaceState` 以及 `popstate`，页面切换无需刷新即可自动重新生效。
- 📊 **可视化诊断日志**：
  - 按 `F12` 打开浏览器开发者工具（Console），带有醒目的 `[粘贴助手]` 前缀色彩日志，实时反馈注入进度与拦截状态。

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

## 📄 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。仅供学习交流与浏览器技术研究使用，请合理合规使用。
