# 🎓 Physics Simulation Platform

Interactive physics simulations with AI tutoring - Built for physics education research.

![Status](https://img.shields.io/badge/status-ready-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Matter.js](https://img.shields.io/badge/Matter.js-0.19-purple)

## ✨ What This Is

A web-based platform for physics education featuring:
- 🎮 Interactive simulations with real physics (Matter.js engine)
- 🤖 AI tutoring for guided discovery learning  
- 🎯 Targets common misconceptions from SPHERE dataset
- 📊 Real-time data visualization

**Current Simulation:** Friction & Newton's 1st Law (targets FCI10 misconception - 45.3% prevalence)

## 🚀 Quick Start (Mac + VS Code)

### Step 1: Install Node.js (5 min - first time only)

1. Open Safari and visit: https://nodejs.org/
2. Download the **LTS version** (left button)
3. Open the downloaded .pkg file
4. Follow installer (click Continue/Agree/Install)
5. **Verify:** Open Terminal and run:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers!

### Step 2: Open Project in VS Code (1 min)

1. Download and extract the `physics-sim-platform` folder
2. Open VS Code
3. Click File → Open Folder
4. Select the `physics-sim-platform` folder
5. Click "Open"

### Step 3: Open Terminal in VS Code (10 sec)

- Press: `Control` + `` ` `` (backtick key)
- Or: View menu → Terminal

You should see a terminal panel at the bottom of VS Code!

### Step 4: Install Dependencies (3 min)

In the VS Code terminal, type:

```bash
npm install
```

Wait for it to complete... You'll see a progress bar and lots of text. **This is normal!**

When done, you'll see:
```
added XXX packages in XXs
```

### Step 5: Run the App! (10 sec)

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

**Your browser will automatically open!** 

If not, manually visit: http://localhost:3000

## 🎮 Using the Simulation

1. **Adjust Friction**: Drag the slider (0 = ice, 1 = rough surface)
2. **Apply Force**: Click the button to push the red box
3. **Observe**: Watch the box move and see velocity in real-time
4. **Chat with AI**: Tell the AI what you observed
5. **Experiment**: Try friction = 0 vs friction = 1.0

**Key Discovery:** When friction = 0, the box keeps moving even after force is removed! (Newton's 1st Law)

## 🛠️ Development

### File Structure

```
physics-sim-platform/
├── src/
│   ├── simulations/
│   │   └── FrictionSimulation/
│   │       ├── FrictionSimulation.jsx     # Main simulation
│   │       └── FrictionControls.jsx       # Control panel
│   ├── components/
│   │   ├── Layout/
│   │   │   └── SimulationLayout.jsx
│   │   └── AITutor/
│   │       ├── ChatPanel.jsx
│   │       └── ChatMessage.jsx
│   ├── hooks/
│   │   └── useAITutor.js                  # AI logic
│   ├── App.jsx                            # Main app
│   └── main.jsx                           # Entry point
├── package.json                            # Dependencies
└── vite.config.js                         # Build config
```

### Making Changes

1. **Edit code** in VS Code
2. **Save file** (Cmd+S)
3. **Browser auto-refreshes** - see changes instantly!

No need to restart server! Vite has hot reload.

### Common Tasks

**Change box color:**
```javascript
// In src/simulations/FrictionSimulation/FrictionSimulation.jsx
// Line ~40
render: {
  fillStyle: '#3498db'  // Change to blue
}
```

**Adjust physics:**
```javascript
// Change gravity
world.gravity.y = 0.5  // Lighter gravity

// Change box size
const box = Bodies.rectangle(150, 350, 100, 100, ...)  // Bigger box
```

## 🔧 Troubleshooting

### "npm: command not found"
→ Node.js not installed. Go back to Step 1.

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### Canvas not showing
- Hard refresh: Cmd+Shift+R
- Check VS Code terminal for errors
- Check browser console (F12)

### Still stuck?
See `SETUP_INSTRUCTIONS_MAC.md` for detailed troubleshooting

## 📊 AI Tutoring

**Current Mode:** Mock responses (no API key needed)

The AI will respond with pre-programmed Socratic questions. This is perfect for:
- Testing the UI
- Demonstrating to advisor
- Development without API costs

**Want Real AI?** See `ADDING_REAL_AI.md`

## 🚢 Deploying to Web

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Get URL to share with advisor!
```

## 🎯 Next Steps

1. ✅ Get it running (you're doing this now!)
2. Play with friction values (0 vs 1.0)
3. Experiment with the code
4. Show to your advisor
5. Add more simulations!

## 📚 Learning Resources

- **Matter.js Examples:** https://brm.io/matter-js/demo/
- **React Tutorial:** https://react.dev/learn
- **Vite Guide:** https://vitejs.dev/guide/

## 💬 Questions?

See the guides:
- `SETUP_INSTRUCTIONS_MAC.md` - Detailed Mac setup
- `ABSOLUTE_BEGINNER_GUIDE.md` - For complete beginners
- `TROUBLESHOOTING.md` - Common issues

## 🎉 Success!

You know it's working when:
- ✅ npm run dev starts without errors
- ✅ Browser opens to http://localhost:3000
- ✅ You see a red box on a dark surface
- ✅ Friction slider works
- ✅ Box moves when you click "Apply Force"
- ✅ AI chat responds

**Congratulations! You have a working physics simulation! 🚀**
