# 🍎 Mac + VS Code 完整Setup指南

专为Mac用户和VS Code用户设计的step-by-step指南。

---

## 📋 准备工作（5分钟）

### 你需要的工具：

1. ✅ **VS Code** (你已经有了！)
2. ⚠️ **Node.js** (可能没有 - 下面会安装)
3. ✅ **这个项目文件夹** (你正在下载)

---

## 🚀 Step 1: 安装Node.js（仅首次，5分钟）

### 检查是否已安装：

1. 打开Terminal：
   - 按 `Command(⌘) + Space`
   - 输入 "Terminal"
   - 按Enter

2. 在Terminal中输入：
   ```bash
   node --version
   ```

3. 看结果：
   - **如果显示**: `v18.17.0` (或其他版本号) → ✅ **已安装，跳到Step 2!**
   - **如果显示**: `command not found` → ⚠️ 需要安装，继续下面步骤

### 安装Node.js：

1. **打开Safari浏览器**

2. **访问**: https://nodejs.org/

3. 你会看到**两个绿色按钮**：
   ```
   [  LTS (推荐)  ]    [  Current  ]
   ```
   **点击左边的LTS按钮**

4. 下载完成后，打开下载的 `.pkg` 文件

5. 安装向导：
   - 点击 "继续"
   - 点击 "同意"  
   - 点击 "安装"
   - 输入你的Mac密码
   - 等待安装完成

6. **验证安装成功**：
   - 重新打开Terminal（重要！需要新窗口）
   - 输入：`node --version`
   - 应该看到：`v20.11.0` 或类似版本号 ✅

---

## 📂 Step 2: 在VS Code中打开项目（1分钟）

### 方法A: 拖放（最简单）

1. 在Finder中找到你下载的 `physics-sim-platform` 文件夹
2. **拖动整个文件夹** 到VS Code图标上
3. VS Code会自动打开这个项目 ✅

### 方法B: 通过菜单

1. 打开VS Code
2. 点击 **File** → **Open Folder...**
3. 找到 `physics-sim-platform` 文件夹
4. 点击 **Open**

### 验证成功：

你应该在VS Code左侧看到文件树：
```
physics-sim-platform
├── src/
├── public/
├── package.json
├── vite.config.js
└── ...
```

---

## 💻 Step 3: 在VS Code中打开Terminal（10秒）

### 方法A: 快捷键（推荐）

按：`Control` + `` ` ``

(Control键 + backtick键，backtick在Tab键上方)

### 方法B: 菜单

VS Code顶部菜单：**View** → **Terminal**

### 验证成功：

VS Code底部出现一个terminal面板，显示：
```
yourname@MacBook-Pro physics-sim-platform %
```

✅ **如果看到这个，perfect!**

---

## 📦 Step 4: 安装Dependencies（3分钟）

### 在VS Code的terminal中输入：

```bash
npm install
```

按Enter，然后**等待**...

### 你会看到：

```
npm WARN deprecated ...
npm WARN ...
...
added 245 packages in 45s
```

**不要panic!** 这些warnings是正常的。

### 完成的标志：

看到类似这样的最后一行：
```
added 245 packages, and audited 246 packages in 45s

found 0 vulnerabilities
```

Terminal回到：
```
yourname@MacBook-Pro physics-sim-platform %
```

✅ **安装完成！**

### 如果遇到错误：

```bash
# 清除并重试
rm -rf node_modules
npm cache clean --force
npm install
```

---

## 🚀 Step 5: 启动Development Server（10秒）

### 在terminal中输入：

```bash
npm run dev
```

### 你会看到：

```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### ✅ 成功！

**两件事会发生：**

1. **浏览器自动打开** → 显示你的simulation!
2. **如果没有自动打开** → 手动访问 http://localhost:3000

---

## 🎮 Step 6: 测试Simulation（2分钟）

### 你应该看到：

**左侧：**
- 标题 "Friction & Motion"
- Canvas with 红色box在黑色地面上
- Friction slider
- "Apply Force" 和 "Reset" 按钮
- Real-time data显示

**右侧：**
- "AI Physics Tutor" 标题
- AI的欢迎消息
- 聊天输入框

### 测试这些功能：

1. **拖动Friction slider到0**
   - 应该看到数字变化
   
2. **点击"Apply Force"**
   - Box应该向右移动
   - 速度数字应该增加
   
3. **观察box的运动**
   - Friction = 0: Box一直滑动！
   - Friction = 1.0: Box很快停下

4. **与AI对话**
   - 在右侧输入框输入: "The box kept moving when friction was 0!"
   - 点击"Send Message"
   - AI应该回复（1-2秒后）

✅ **如果以上都work，你成功了！** 🎉

---

## 🎨 Step 7: 开始修改Code（Optional）

### 试试改变box颜色：

1. 在VS Code左侧，打开：
   ```
   src → simulations → FrictionSimulation → FrictionSimulation.jsx
   ```

2. 找到第~42行：
   ```javascript
   render: {
     fillStyle: '#e74c3c',  // ← 这是红色
   ```

3. 改成：
   ```javascript
   fillStyle: '#3498db',  // 蓝色
   ```

4. **保存** (Cmd+S)

5. **看浏览器** → Box自动变成蓝色！

**不需要重启server！** Vite会自动更新！

### 试试改变初始friction：

在同一个文件，第~47行：
```javascript
friction: 0.1,  // 改成0.1，box更容易滑动
```

保存，浏览器自动更新！

---

## 🛑 如何停止Server

在VS Code terminal中按：

```
Ctrl + C
```

Server会停止。要重新启动：

```bash
npm run dev
```

---

## 🌐 下一步：部署到网上（给advisor看）

见文件：`DEPLOYING_TO_VERCEL.md`

---

## 🆘 常见问题

### Q: Terminal显示 "command not found: npm"

**A:** Node.js没安装好
```bash
# 重新安装Node.js
# 然后**重启Mac**（重要！）
# 重新打开VS Code
```

### Q: npm install卡住不动

**A:** 网络问题
```bash
# Ctrl+C 停止
# 换一个网络试试
# 或稍后再试
```

### Q: 浏览器显示空白页

**A:** 
1. 打开浏览器Console (Cmd+Option+J in Chrome)
2. 看有什么error
3. 截图error发给我

### Q: 修改code后浏览器没更新

**A:**
1. 保存文件 (Cmd+S)
2. 看VS Code terminal有没有errors
3. 手动刷新浏览器 (Cmd+R)

### Q: VS Code提示 "ESLint" errors

**A:** 可以忽略（这些是code style warnings，不影响运行）

---

## 💡 VS Code小技巧

### Useful Shortcuts:

- `Cmd+P` - 快速打开文件
- `Cmd+Shift+F` - 全局搜索
- `Cmd+/` - 注释/取消注释
- `Cmd+S` - 保存
- `Control+ `` - 打开/关闭terminal

### Recommended Extensions:

在VS Code中安装（optional）：
1. ES7+ React/Redux snippets
2. Prettier - Code formatter
3. Auto Rename Tag

---

## 🎯 你现在的状态

如果以上步骤都成功：

✅ Node.js installed
✅ Project opened in VS Code
✅ Dependencies installed
✅ Development server running
✅ Simulation working in browser
✅ AI chat responding

**你已经完成setup了！** 🎊

**下一步:**
- 玩10-15分钟simulation
- 试试修改code
- 截图或录屏
- 发给advisor!

---

## 🚀 Ready to Build More?

当你想添加第二个simulation：

1. 看文件：`ADDING_NEW_SIMULATION.md`
2. 或者：复制FrictionSimulation文件夹
3. 修改physics logic
4. Done!

---

**Any questions? 看TROUBLESHOOTING.md或问我！**

**Good luck! 你一定可以的！** 💪
