# 📝 如何在VS Code中使用这个项目

## 🎨 VS Code界面说明

当你打开项目后，VS Code界面分为几个部分：

```
┌─────────────────────────────────────────────────────────────┐
│  File  Edit  View  ...                    [VS Code菜单栏]   │
├────┬────────────────────────────────────────────────────────┤
│ 📁 │  physics-sim-platform/                                 │
│    │  ├─ 📂 src/                     [左侧: 文件浏览器]     │
│    │  │  ├─ 📂 simulations/                                 │
│    │  │  │  └─ 📂 FrictionSimulation/                       │
│    │  │  │     ├─ FrictionSimulation.jsx                    │
│    │  │  │     └─ FrictionControls.jsx                      │
│    │  │  ├─ 📂 components/                                  │
│    │  │  ├─ 📂 hooks/                                       │
│    │  │  ├─ App.jsx                                         │
│    │  │  └─ main.jsx                                        │
│    │  ├─ 📄 package.json                                    │
│    │  ├─ 📄 README.md                                       │
│    │  └─ 📄 vite.config.js                                  │
├────┼────────────────────────────────────────────────────────┤
│    │                                                         │
│    │  // Code编辑区域          [中间: 代码编辑器]           │
│    │  import React from 'react'                             │
│    │  import Matter from 'matter-js'                        │
│    │  ...                                                    │
│    │                                                         │
├────┴────────────────────────────────────────────────────────┤
│  > npm run dev                  [底部: Terminal]            │
│  VITE v5.0.8  ready in 500 ms                              │
│  ➜  Local:   http://localhost:3000/                       │
│  yourname@MacBook-Pro physics-sim-platform %               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 重要文件说明

### 配置文件（不需要经常改）

**package.json**
- 列出所有dependencies（React, Matter.js等）
- 定义npm scripts（dev, build）
- **不要随便改！** 除非添加新package

**vite.config.js**
- Vite build tool配置
- 设置port 3000
- **基本不需要改**

**index.html**
- 网页的entry point
- 很简单，只有几行
- **不需要改**

### 源代码文件（你会经常编辑）

**src/main.jsx**
- React app的启动文件
- **不需要改**

**src/App.jsx**
- 主应用组件
- Header, navigation, footer
- **添加新simulation时会改这里**

**src/simulations/FrictionSimulation/FrictionSimulation.jsx**
- **核心文件！** 包含所有physics logic
- Matter.js engine setup
- Box和ground的创建
- **常改这里**

**src/simulations/FrictionSimulation/FrictionControls.jsx**
- UI controls（sliders, buttons）
- **改UI外观时编辑这里**

**src/components/...**
- Shared components
- **一般不需要改**

**src/hooks/useAITutor.js**
- AI tutoring logic
- Mock responses
- **要改AI对话时编辑这里**

---

## 🎯 VS Code Workflow

### 1. 启动项目

```
打开VS Code → 打开文件夹 → physics-sim-platform
↓
打开Terminal (Control+`)
↓
npm install (首次)
↓
npm run dev
↓
浏览器打开 http://localhost:3000
```

### 2. 修改Code

```
在左侧文件树找到文件
↓
点击文件在编辑器中打开
↓
编辑code
↓
按Cmd+S保存
↓
浏览器自动刷新！（无需手动）
```

### 3. 查看Changes

浏览器自动更新，立即看到效果！

---

## 🔧 常用操作

### 打开文件（快速）

1. 按 `Cmd+P`
2. 开始输入文件名
3. 选择文件
4. Enter打开

Example:
```
Cmd+P → 输入"Friction" → 选FrictionSimulation.jsx → Enter
```

### 搜索Code

1. 按 `Cmd+Shift+F`
2. 输入搜索词
3. 看到所有matches

Example:
```
搜索 "fillStyle" 找到所有颜色设置
```

### 查看Terminal Output

Terminal显示重要信息：
- ✅ Server启动成功
- ⚠️ Warnings（通常可以忽略）
- ❌ Errors（需要修复）

---

## 🎨 修改Simulation的常见操作

### 改变Box颜色

**文件:** `src/simulations/FrictionSimulation/FrictionSimulation.jsx`

**找到** (大约第42行):
```javascript
render: {
  fillStyle: '#e74c3c',  // ← 改这里
  strokeStyle: '#c0392b',
  lineWidth: 3
}
```

**常用颜色：**
- `'#e74c3c'` - 红色 (当前)
- `'#3498db'` - 蓝色
- `'#2ecc71'` - 绿色
- `'#f39c12'` - 橙色
- `'#9b59b6'` - 紫色

### 改变Box大小

**文件:** 同上

**找到** (大约第40行):
```javascript
const box = Bodies.rectangle(150, 350, 80, 80, {
                                    //  ^   ^
                                    //  宽  高
```

**试试:**
```javascript
const box = Bodies.rectangle(150, 350, 100, 100, {  // 更大
const box = Bodies.rectangle(150, 350, 60, 60, {    // 更小
const box = Bodies.rectangle(150, 350, 120, 60, {   // 长方形
```

### 改变初始Friction

**文件:** `src/simulations/FrictionSimulation/FrictionSimulation.jsx`

**找到** (第6行):
```javascript
const [friction, setFriction] = useState(0.5)  // 改这里
                                        //  ^
```

**试试:**
```javascript
useState(0)    // 开始就是ice
useState(0.8)  // 开始是rough surface
```

### 改变Applied Force大小

**文件:** `src/simulations/FrictionSimulation/FrictionSimulation.jsx`

**找到** (大约第75行):
```javascript
Matter.Body.applyForce(boxRef.current, boxRef.current.position, {
  x: 0.05,  // ← 改这里调整force大小
  y: 0
})
```

**试试:**
```javascript
x: 0.02   // 更小的force
x: 0.1    // 更大的force
```

---

## 💡 Pro Tips

### Tip 1: Auto Save

在VS Code中enable auto save：
- **File** → **Auto Save** (打勾)
- 现在你修改code后自动保存！

### Tip 2: Side-by-Side View

1. 右键点击文件tab
2. 选 "Split Right"
3. 左右对比两个文件

### Tip 3: Integrated Browser

安装Extension: "Live Server"
- 可以在VS Code内预览
- 不过目前方案已经很好了

### Tip 4: Keyboard Shortcuts

- `Cmd+/` - 快速注释/取消注释
- `Cmd+D` - 选中下一个相同词
- `Option+Up/Down` - 移动整行code

---

## 📊 Terminal Commands参考

### Development

```bash
npm run dev      # 启动development server
# Press Ctrl+C   # 停止server
```

### Building

```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Cleaning

```bash
rm -rf node_modules   # 删除dependencies
npm install           # 重新安装
```

---

## 🎯 Your Typical Workflow

```
1. 打开VS Code → 打开physics-sim-platform文件夹
   ↓
2. Terminal: npm run dev
   ↓
3. 浏览器自动打开showing simulation
   ↓
4. 在VS Code编辑code
   ↓
5. 保存 (Cmd+S)
   ↓
6. 浏览器自动更新
   ↓
7. 看效果
   ↓
8. 重复步骤4-7
```

**当你完成一天的工作：**
- Terminal中按 `Ctrl+C` 停止server
- 关闭VS Code

**第二天继续：**
- 打开VS Code
- Terminal: `npm run dev`
- 继续coding!

---

## 🎉 Ready to Code!

如果你能：
- ✅ 在VS Code中看到项目文件
- ✅ Terminal能运行命令
- ✅ npm install成功
- ✅ npm run dev启动simulation

**你就ready to start developing了！** 🚀

---

**Questions?** 看其他.md文件或问我！

**Happy coding!** 💻
