# 🚀 Vite → Next.js 14 Migration Guide
## MeeChain Dashboard Conversion

**Total Time: 30-45 minutes**

---

## 📊 **What We're Doing**

```
VITE (Current)           →  NEXT.JS (Target)
├── src/App.tsx          →  pages/dashboard.tsx
├── src/components/      →  components/
├── src/main.tsx         →  pages/_app.tsx
├── server.ts            →  pages/api/
├── index.html           →  public/
└── vite.config.ts       →  next.config.js
```

---

## ⚠️ **BEFORE YOU START**

### **Backup Current Project**

```bash
# On your local machine
cd ~/projects/dashboard
git add .
git commit -m "backup: vite project before nextjs migration"

# Or zip it
zip -r dashboard-vite-backup.zip .

# Safe ✅
```

---

## 🎯 **STEP 1: Create New Next.js Project**

```bash
# ═════════════════════════════════════════════════════════
# Step 1.1: Create fresh Next.js project
# ═════════════════════════════════════════════════════════

# Option A: Using create-next-app (RECOMMENDED)
npx create-next-app@14 meechain-dashboard-next \
  --typescript \
  --tailwind \
  --eslint \
  --no-app-directory \
  --no-git

# Expected: Next.js 14.x project created

# Option B: If you want specific version
npm create next-app@14.1.4 meechain-dashboard-next -- \
  --typescript \
  --tailwind \
  --eslint \
  --no-app-directory
```

```bash
# ═════════════════════════════════════════════════════════
# Step 1.2: Navigate to new project
# ═════════════════════════════════════════════════════════

cd meechain-dashboard-next

# Verify structure
ls -la
# Expected:
# pages/
# components/
# public/
# styles/
# package.json
# next.config.js
# tsconfig.json
```

---

## 🎯 **STEP 2: Install Additional Dependencies**

```bash
# ═════════════════════════════════════════════════════════
# Step 2.1: Install Motion (from Vite project)
# ═════════════════════════════════════════════════════════

npm install motion lucide-react axios

# Expected:
# motion@latest
# lucide-react
# axios

# Step 2.2: Optional - Gemini 
npm install @google/genai

# Step 2.3: Verify installation
npm list | grep -E "motion|lucide|axios|genai"
```

---

## 🎯 **STEP 3: Copy Components**

```bash
# ═════════════════════════════════════════════════════════
# Step 3.1: Copy original components to new project
# ═════════════════════════════════════════════════════════

# Assuming original VITE project is at ~/projects/dashboard

# Copy all components
cp ~/projects/dashboard/src/components/*.tsx components/

# Expected:
# components/
# ├── ErrorRecoveryBanner.tsx
# ├── LiveBlockStream.tsx
# ├── MagicHallView.tsx
# ├── MagicOrbView.tsx
# ├── Navbar.tsx
# ├── ProductionCodeHub.tsx
# ├── StatsMonitorView.tsx
# └── VerificationSuiteView.tsx

# Step 3.2: Copy types
mkdir -p lib/
cp ~/projects/dashboard/src/types.ts lib/types.ts

# Step 3.3: Copy data
mkdir -p lib/
cp ~/projects/dashboard/src/data/*.ts lib/

# Expected: All data files copied
```

---

## 🎯 **STEP 4: Setup CSS & Globals**

```bash
# ═════════════════════════════════════════════════════════
# Step 4.1: Copy Tailwind CSS from original
# ═════════════════════════════════════════════════════════

# Copy index.css from VITE
cp ~/projects/dashboard/src/index.css styles/index.css

# Append to globals.css (Next.js default)
cat styles/index.css >> styles/globals.css

# Expected: CSS merged

# Step 4.2: Verify globals.css has Tailwind directives
cat styles/globals.css | head -20

# Should show:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

---

## 🎯 **STEP 5: Create Pages**

```bash
# ═════════════════════════════════════════════════════════
# Step 5.1: Create _app.tsx
# ═════════════════════════════════════════════════════════

cat > pages/_app.tsx << 'EOF'
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
EOF

# Expected: _app.tsx created
```

```bash
# ═════════════════════════════════════════════════════════
# Step 5.2: Create index.tsx (home page)
# ═════════════════════════════════════════════════════════

cat > pages/index.tsx << 'EOF'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="text-8xl mb-6 animate-bounce">🎶</div>
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400 mb-4">
          MeeChain
        </h1>
        <p className="text-gray-400 text-xl">
          Music Economy on Web3 • Blockchain Magic
        </p>
      </div>

      <Link href="/dashboard">
        <a className="px-8 py-4 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-500 hover:to-green-500 text-white font-bold text-lg rounded-lg transition transform hover:scale-105">
          🚀 Enter Dashboard
        </a>
      </Link>
    </div>
  );
}
EOF

# Expected: index.tsx created
```

```bash
# ═════════════════════════════════════════════════════════
# Step 5.3: Create dashboard.tsx (main view)
# ═════════════════════════════════════════════════════════

cat > pages/dashboard.tsx << 'EOF'
import React from 'react';
import App from './dashboard-app';

export default function Dashboard() {
  return <App />;
}
EOF

# Expected: dashboard.tsx created

# Step 5.4: Move App.tsx to pages/dashboard-app.tsx
cp ~/projects/dashboard/src/App.tsx pages/dashboard-app.tsx

# Expected: App.tsx moved and renamed
```

```bash
# ═════════════════════════════════════════════════════════
# Step 5.5: Fix imports in dashboard-app.tsx
# ═════════════════════════════════════════════════════════

# Open pages/dashboard-app.tsx
nano pages/dashboard-app.tsx

# Find these lines at top:
# import { MagicOrbView } from './components/MagicOrbView';
# import { StatsMonitorView } from './components/StatsMonitorView';
# etc.

# Change to:
# import { MagicOrbView } from '../components/MagicOrbView';
# import { StatsMonitorView } from '../components/StatsMonitorView';
# (add ../ because file is now in pages/, not src/)

# Save and exit (Ctrl+X, Y, Enter)
```

---

## 🎯 **STEP 6: Convert API Endpoints**

```bash
# ═════════════════════════════════════════════════════════
# Step 6.1: Create pages/api/health.ts
# ═════════════════════════════════════════════════════════

cat > pages/api/health.ts << 'EOF'
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uptime = process.uptime();
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    version: '2.4.0-prod',
    environment: process.env.NODE_ENV || 'production',
    services: {
      nginx: 'online',
      apiGateway: 'online',
      anvilNode: 'online',
      rpcProxy: 'online',
    },
  });
}
EOF

# Expected: health.ts created
```

```bash
# ═════════════════════════════════════════════════════════
# Step 6.2: Create pages/api/stats.ts
# ═════════════════════════════════════════════════════════

# Extract stats endpoint logic from server.ts
# and convert to Next.js API Route

cat > pages/api/stats.ts << 'EOF'
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract stats logic from server.ts /api/stats endpoint
  // Convert to Next.js format
  
  res.status(200).json({
    timestamp: new Date().toISOString(),
    blockHeight: 18492040,
    requestsPerSecond: 142,
    networkLatencyMs: 24,
    // ... add rest of stats
  });
}
EOF

# Expected: stats.ts created

# Step 6.3: Extract remaining endpoints from server.ts
# Copy /api/chaos, /api/deployment-manifest, etc.
# from server.ts into separate pages/api/*.ts files
```
#(ยังไม่ทำขั้นตอนย้อนกลับมาทีหลัง) กันลืม
---

## 🎯 **STEP 7: Environment Variables**

```bash
# ═════════════════════════════════════════════════════════
# Step 7.1: Create .env.local
# ═════════════════════════════════════════════════════════

cat > .env.local << 'EOF'
# Public (visible to browser)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_RPC_URL=https://rpc.meechain.live
NEXT_PUBLIC_CHAIN_ID=13390

# Server-only (backend secrets)
GEMINI_API_KEY=your_gemini_key_here
EOF

# Expected: .env.local created

# Step 7.2: Create .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://meechain-dashboard.vercel.app
NEXT_PUBLIC_RPC_URL=https://rpc.meechain.live
NEXT_PUBLIC_CHAIN_ID=13390
EOF

# Expected: .env.production created
```

---

## 🎯 **STEP 8: Update tsconfig.json**

```bash
# ═════════════════════════════════════════════════════════
# Step 8.1: Next.js already creates tsconfig.json
# ═════════════════════════════════════════════════════════

# Verify it has path alias for @
cat tsconfig.json | grep -A 3 "paths"

# Should show:
# "paths": {
#   "@/*": ["./*"]
# }

# If not, add it
# Next.js creates this automatically, so usually OK
```

---

## 🎯 **STEP 9: Update next.config.js**

```bash
# ═════════════════════════════════════════════════════════
# Step 9.1: Verify next.config.js
# ═════════════════════════════════════════════════════════

cat next.config.js

# Should be minimal:
# const nextConfig = {}
# module.exports = nextConfig

# That's fine! Tailwind CSS is configured via postcss.config.js
```

---

## 🎯 **STEP 10: Test Locally**

```bash
# ═════════════════════════════════════════════════════════
# Step 10.1: Clean install and build
# ═════════════════════════════════════════════════════════

npm run build

# Expected: Build succeeds
# If errors:
#   - Check import paths (use ../ if in pages/)
#   - Check component exports
#   - Check missing dependencies
```

```bash
# ═════════════════════════════════════════════════════════
# Step 10.2: Run dev server
# ═════════════════════════════════════════════════════════

npm run dev

# Expected:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
# ✓ Ready in 3.2s
```

```bash
# ═════════════════════════════════════════════════════════
# Step 10.3: Test in browser
# ═════════════════════════════════════════════════════════

# Open http://localhost:3000 in browser

# Expected:
# 1. Home page loads
# 2. "Enter Dashboard" button visible
# 3. Click button → goes to /dashboard
# 4. Dashboard loads with all components

# Check console (F12):
# - No errors
# - CSS loaded
# - Components rendering
```

---

## 🎯 **STEP 11: Deploy to Vercel**

```bash
# ═════════════════════════════════════════════════════════
# Step 11.1: Push to GitHub
# ═════════════════════════════════════════════════════════

git init
git add .
git commit -m "feat: convert vite project to nextjs 14"
git remote add origin https://github.com/MEECHAIN1/Meechain-Dashboard.git
git push -u origin main

# Expected: Code pushed to GitHub
```

```bash
# ═════════════════════════════════════════════════════════
# Step 11.2: Deploy to Vercel
# ═════════════════════════════════════════════════════════

# Option A: CLI
npm install -g vercel
vercel

# Option B: Web UI
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Import GitHub repository
# 4. Set environment variables
# 5. Deploy

# Expected: Deployment complete ✅
```

---

## ✅ **Verification Checklist**

```
┌─────────────────────────────────────────────────┐
│ VITE → NEXT.JS MIGRATION COMPLETE              │
└─────────────────────────────────────────────────┘

✅ Backups
  ├─ Original VITE project saved
  ├─ GitHub commit created
  └─ Local copy preserved

✅ Project Structure
  ├─ pages/ directory created
  ├─ components/ copied
  ├─ lib/ created (types & data)
  └─ public/ ready

✅ Configuration
  ├─ next.config.js ✓
  ├─ tsconfig.json ✓
  ├─ tailwind.config.js ✓
  ├─ .env.local ✓
  └─ package.json ✓

✅ Pages
  ├─ pages/_app.tsx ✓
  ├─ pages/index.tsx (home) ✓
  ├─ pages/dashboard.tsx ✓
  └─ pages/api/health.ts ✓

✅ Components
  ├─ All 8 components migrated ✓
  ├─ Import paths fixed ✓
  └─ Dependencies installed ✓

✅ Testing
  ├─ npm run build passed ✓
  ├─ npm run dev started ✓
  ├─ Home page loads ✓
  ├─ Dashboard renders ✓
  └─ No console errors ✓

✅ Deployment
  ├─ GitHub pushed ✓
  ├─ Vercel connected ✓
  └─ Live URL active ✓
```

---

## 🚨 **Common Issues & Fixes**

### **Issue 1: Import errors in components**
```bash
# Error: Cannot find module '../components/...'
# Fix: Ensure all import paths use correct relative paths
# For files in pages/, use ../components/ComponentName
# For files in lib/, use ../lib/filename
```

### **Issue 2: CSS not loading**
```bash
# Error: Styles not applied
# Fix: Ensure _app.tsx imports globals.css
# import '../styles/globals.css'
```

### **Issue 3: Tailwind classes not working**
```bash
# Fix: Verify tailwind.config.js includes page paths
# content: [
#   './pages/**/*.{js,ts,jsx,tsx}',
#   './components/**/*.{js,ts,jsx,tsx}',
# ]
```

### **Issue 4: Environment variables not loading**
```bash
# Error: process.env.NEXT_PUBLIC_* undefined
# Fix: Variables must start with NEXT_PUBLIC_
# Fix: Restart dev server after .env changes
```

---

## 📊 **Final Comparison**

```
VITE                        NEXT.JS
├── src/main.tsx           → pages/_app.tsx
├── src/App.tsx            → pages/dashboard.tsx
├── src/components/        → components/
├── src/index.css          → styles/globals.css
├── server.ts              → pages/api/*.ts
├── vite.config.ts         → next.config.js
├── index.html             → app wrapper
└── package.json (vite)    → package.json (next)

Result: Same functionality, better deployment! ✨
```

---

## 🎉 **Next Steps**

1. ✅ Follow steps 1-11 above
2. ✅ Test locally
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel
5. ✅ Update DNS to Vercel URL
6. ✅ Celebrate! 🎊

---

**Total Time: 30-45 minutes**  
**Difficulty: Medium**  
**Risk: Low (backups exist)**

Ready? Let's go! 🚀