# 🎯 START HERE! (从这里开始)

## 🚀 3个步骤启动（Mac用户）

### Step 1: 打开Terminal

按 `Command(⌘) + Space`，输入"Terminal"，按Enter

### Step 2: Navigate到这个文件夹

在Terminal中，输入 `cd ` (cd后面有个空格！)

然后**把physics-sim-platform文件夹拖到Terminal窗口**

路径会自动填入，然后按Enter

你应该在这个目录中：
```bash
pwd
# 应该显示: /Users/yourname/.../physics-sim-platform
```

### Step 3: 运行这两个命令

```bash
npm install
```

等待完成（2-3分钟）...

然后：

```bash
npm run dev
```

**浏览器会自动打开！** 🎉

---

## ✅ 成功的标志

你应该看到：
- ✅ 网页标题："Physics Simulation Platform"
- ✅ 左侧：红色box在黑色地面上
- ✅ Friction slider可以拖动
- ✅ "Apply Force"按钮可以点击
- ✅ Box会移动！
- ✅ 右侧：AI Tutor chat

---

## 🎮 试试这个

1. 拖动Friction到**0**
2. 点击"Apply Force"
3. 看box一直滑不停！

**这就是Newton's First Law！** 🎯

---

## 📚 详细说明

- **完整setup指南**: 看 `SETUP_MAC_VSCODE.md`
- **项目介绍**: 看 `README.md`
- **遇到问题**: 往下看 👇

---

## 🆘 常见问题Quick Fix

### "npm: command not found"
→ Node.js没安装
→ 访问 https://nodejs.org/ 下载安装

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### 端口被占用
```bash
npm run dev -- --port 3001
```

### Canvas不显示
- 刷新浏览器 (Cmd+Shift+R)
- 看terminal有没有errors

---

## 🎯 下一步（当simulation工作后）

1. ✅ 截图或录屏
2. ✅ 发给advisor
3. ✅ 玩15分钟，熟悉功能
4. ✅ 尝试修改code（见README.md）

---

## 💬 Need Help?

1. 看 `SETUP_MAC_VSCODE.md` (超详细的Mac指南)
2. 看 `TROUBLESHOOTING.md` (问题解答)
3. 截图error发给我

---

**Ready? 打开Terminal，开始Step 1！** 🚀
