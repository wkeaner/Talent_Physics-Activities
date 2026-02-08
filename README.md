# ⚛️ Talent — Interactive Physics Simulation Platform

> **Misconception-targeted interactive simulations with AI tutoring, driven by physics education research data.**

A web-based platform that generates interactive physics simulations designed to address specific student misconceptions identified in the [SPHERE dataset](https://data.mendeley.com/datasets/88d7m2fv7p/2) (497 Indonesian high school students, Force Concept Inventory). Each simulation creates **cognitive conflict** — the moment a student's prediction clashes with what actually happens — and an AI tutor guides them to reconstruct their understanding.

**Live demo:** [https://talent-physics-activities.vercel.app/](https://talent-physics-activities.vercel.app/) *(coming soon)*

---

## Why This Exists

Physics misconceptions are remarkably persistent. A student who believes "objects need continuous force to keep moving" will hold that belief through lectures, textbooks, and even traditional labs. Research shows the most effective remedy is **cognitive conflict**: let the student *predict*, then *observe* something that contradicts their prediction, then *explain* the discrepancy.

The problem? Creating high-quality interactive simulations that target specific misconceptions takes expert teams weeks per simulation (see [PhET](https://phet.colorado.edu/) — excellent but slow to produce). Our approach:

1. **Data-driven targeting** — We use the SPHERE dataset to identify which misconceptions are most prevalent (e.g., 45.3% of students believe force is required for constant velocity)
2. **Config-driven architecture** — Each simulation is defined by a JSON configuration file, not hard-coded
3. **LLM generation pipeline** *(in progress)* — An LLM reads the misconception data and generates new simulation configs automatically
4. **AI-guided discovery** — An AI tutor walks students through the Predict → Observe → Explain cycle

This means we can scale from 1 simulation to 30+ without rewriting code for each one.

---

## How the Pedagogy Works

Every simulation follows the **POE framework** (Predict-Observe-Explain), a well-established strategy in physics education research:

### Step 1: 🔮 Predict
The student is presented with a scenario and asked to predict what will happen. Multiple-choice options are designed around known misconceptions from SPHERE data.

> *"If you push a box on a frictionless surface and then stop pushing, what happens?"*
> - A) The box stops immediately ← *misconception: force = motion*
> - B) The box slows down gradually ← *partial understanding*
> - C) The box keeps sliding at the same speed ← *correct*

### Step 2: 👀 Observe
The student runs the simulation and sees what actually happens. On a frictionless surface, the box keeps going — contradicting most students' predictions. This is the cognitive conflict moment.

### Step 3: 💡 Explain
The AI tutor asks Socratic questions to help the student reconcile their prediction with their observation:

> *"You predicted the box would stop, but it kept going. If there's no friction, what force is slowing it down?"*

The student arrives at Newton's First Law through their own reasoning, not by being told.

### Step 4: 🚀 Extend
An optional challenge connects the concept to the real world:

> *"A spacecraft fires its engines briefly in deep space, then turns them off. What happens to its speed?"*

### Why This Works Better Than Traditional Teaching

| Traditional Approach | Our Approach |
|---|---|
| Teacher states the law | Student discovers the law |
| Passive listening | Active experimentation |
| One explanation for all | Targets the specific misconception each student holds |
| No feedback loop | AI adapts based on student responses |
| Static textbook diagrams | Interactive physics with real-time data |

---

## Pedagogical Strategies

The platform implements four evidence-based strategies from the physics education research literature. Each simulation config specifies which strategy to use:

| Strategy | When to Use | Example |
|---|---|---|
| **Cognitive Conflict** | Student holds a clear, testable misconception | "Push a box on ice, stop pushing — does it stop?" |
| **Analogy** | Concept is abstract, needs familiar mapping | "Electric current is like water flow in pipes" |
| **Experience Bridging** | Student has correct intuition in one context but not another | "You know a ball on ice keeps sliding — same law applies to a car" |
| **Engaged Critiquing** | Student can evaluate others' reasoning | "Alice says the box stops because it runs out of force. Is she right?" |

---

## Current Simulations

### 🧊 Friction & Motion (Newton's First Law)
- **Target misconception:** "Objects require continuous force to maintain velocity" (45.3% prevalence in SPHERE)
- **Assessment item:** FCI Item 10
- **What happens:** Student pushes a box, then removes the force. On ice (low friction), the box keeps moving. On concrete (high friction), it stops quickly. This creates cognitive conflict for students who believe force is needed for motion.
- **Interactive controls:** Friction slider, surface presets (ice/wood/concrete/sand), mass slider, force button

### 💥 Collision Forces (Newton's Third Law) *(coming soon)*
- **Target misconception:** "The heavier object exerts a greater force" (38% prevalence)
- **Assessment item:** FCI Item 15
- **What happens:** A heavy truck and light car collide. Force vectors show they experience exactly equal forces — but different accelerations (F=ma).

### 🎯 Planned Simulations
- Projectile Motion — "There is a horizontal force on a projectile"
- Free Fall — "Heavier objects fall faster"
- Circular Motion — "There is an outward force in circular motion"

---

## Technical Architecture

### Config-Driven Design

The core innovation is that **every simulation is a JSON file**, not custom code. Here is a simplified example:

```json
{
  "education": {
    "concept": "Newton's First Law",
    "misconception": "Objects need force to keep moving",
    "spherePrevalence": 0.453
  },
  "physics": {
    "dynamics": [{
      "id": "box",
      "type": "rectangle",
      "physics": { "mass": 5, "friction": 0.5 }
    }]
  },
  "controls": [
    { "type": "slider", "label": "Friction", "target": "ground", "property": "friction" },
    { "type": "button", "label": "Push Box", "action": "applyForce" }
  ],
  "pedagogy": {
    "strategy": "cognitive_conflict",
    "predict": { "prompt": "What happens when you stop pushing on ice?" },
    "observe": { "instructions": "Set friction to 0 and push the box..." },
    "explain": { "prompt": "Why didn't the box stop?" }
  }
}
```

A single generic engine (`SimulationEngine.jsx`) reads this JSON and creates the entire simulation — physics, controls, pedagogy, and AI tutor context. Adding a new simulation means writing a new JSON file, not new code.

### System Components

```
┌─────────────────────────────────────────────────┐
│                    App.jsx                       │
│         (simulation selector + routing)          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              SimulationPage.jsx                   │
│    (wires engine + controls + pedagogy + chat)   │
└──┬──────────┬──────────┬──────────┬─────────────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Simulation│ │Control   │ │Pedagogy│ │AI Tutor  │
│Engine  │ │Factory   │ │Manager │ │(ChatPanel)│
│        │ │          │ │        │ │          │
│Matter.js│ │Auto-gen  │ │POE flow│ │Socratic  │
│physics │ │sliders,  │ │predict,│ │questions │
│renderer│ │buttons   │ │observe,│ │from      │
│        │ │from JSON │ │explain │ │config    │
└────┬───┘ └────┬─────┘ └───┬────┘ └────┬─────┘
     │          │            │           │
     └──────────┴────────────┴───────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  friction-newton1   │
          │       .json         │
          │  (single source     │
          │   of truth)         │
          └─────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Physics engine | [Matter.js](https://brm.io/matter-js/) | Lightweight 2D rigid body physics, runs in browser |
| UI framework | React 18 | Component-based, hot reload for development |
| Build tool | Vite | Fast dev server, instant hot module replacement |
| AI tutoring | Mock responses (Anthropic API ready) | Follows POE sequence from config |
| Deployment | Vercel | Free tier, auto-deploy from GitHub |

### File Structure

```
physics-sim-platform/
├── src/
│   ├── engine/                        # Generic simulation engine
│   │   ├── SimulationEngine.jsx       # Matter.js renderer (reads any config)
│   │   ├── ControlFactory.jsx         # Generates UI controls from config
│   │   ├── PedagogyManager.jsx        # POE teaching flow
│   │   └── configValidator.js         # Validates configs before rendering
│   │
│   ├── configs/                       # Simulation definitions (JSON)
│   │   ├── friction-newton1.json      # Friction & Motion simulation
│   │   └── index.js                   # Simulation registry
│   │
│   ├── pages/
│   │   └── SimulationPage.jsx         # Generic page (reads any config)
│   │
│   ├── components/
│   │   ├── AITutor/                   # Chat interface
│   │   │   ├── ChatPanel.jsx
│   │   │   └── ChatMessage.jsx
│   │   └── Layout/
│   │       └── SimulationLayout.jsx   # Two-column layout
│   │
│   ├── hooks/
│   │   └── useAITutor.js             # AI response logic
│   │
│   └── simulations/                   # Legacy (kept as reference)
│       └── FrictionSimulation/
│
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (download the LTS version)
- A code editor ([VS Code](https://code.visualstudio.com/) recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/wkeaner/Talent_Physics-Activities.git
cd Talent_Physics-Activities/physics-sim-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### For Educators (Non-Technical)

You don't need to write code to use or evaluate this platform:

1. **Try the simulation** — Visit the live demo link above, or follow the installation steps
2. **Read the config file** — Open `src/configs/friction-newton1.json` in any text editor. You can read and understand the pedagogy section even without programming knowledge
3. **Suggest improvements** — The `pedagogy` section of each config defines the teaching strategy. You can suggest better prediction questions, scaffolding hints, or extension challenges by editing the JSON text
4. **Evaluate effectiveness** — Each simulation has built-in pre/post assessment items linked to FCI (Force Concept Inventory) questions

---

## Research Context

This platform is part of a PhD research project at the **University of Georgia** investigating:

**RQ1:** Can LLMs generate pedagogically effective physics simulation configs from Q-matrix data?

**RQ2:** Do LLM-generated simulations produce learning gains equivalent to human-designed versions?

**RQ3:** What percentage of SPHERE Q-matrix misconceptions can be automatically covered?

**RQ4:** How do teachers adopt and customize generated simulations?

### Related Publications
- SPHERE dataset: Saputri, D. F., et al. (2021). *European Journal of Physics Education*
- Force Concept Inventory: Hestenes, D., Wells, M., & Swackhamer, G. (1992). *The Physics Teacher*

### Target Venues
- AIED 2026 (AI in Education)
- EDM 2026 (Educational Data Mining)

---

## How to Add a New Simulation

1. **Create a config JSON** in `src/configs/` following the schema (see `friction-newton1.json` as template)
2. **Register it** in `src/configs/index.js`:
   ```javascript
   import myConfig from './my-simulation.json'
   const SIMULATIONS = {
     'friction': { config: frictionConfig, emoji: '🧊', shortDescription: '...' },
     'my-sim':   { config: myConfig, emoji: '💥', shortDescription: '...' },  // ← add
   }
   ```
3. **That's it.** The engine, controls, pedagogy, and AI tutor all generate automatically from the config.

---

## Contributing

We welcome contributions from both developers and physics educators.

**Educators can help with:**
- Reviewing prediction questions and scaffolding prompts
- Suggesting new misconceptions to target
- Evaluating pedagogical soundness of simulations
- Providing FCI or other assessment items

**Developers can help with:**
- Adding new simulation configs
- Improving the SimulationEngine
- Building the LLM generation pipeline
- Adding data collection/analytics

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Acknowledgments

- **SPHERE dataset** — for misconception prevalence data
- **PhET Interactive Simulations** (CU Boulder) — for inspiration on simulation design
- **Matter.js** — for the physics engine
- **Force Concept Inventory** — for validated assessment items

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Contact

**Ying Zhang** — PhD Student, University of Georgia
- GitHub: [@wkeaner](https://github.com/wkeaner)
- Project: Talent — Interactive Physics Learning Platform

---

*Built with ❤️ for physics education research*
