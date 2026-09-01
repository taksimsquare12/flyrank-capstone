# FlyRank Capstone: Production AI Chat & 3D Interactive Web Experience

A high-performance, accessible, and responsive Next.js 16 application featuring real-time AI response streaming, custom GLSL fragment shaders, and interactive 3D WebGL scenes built for the Frontend AI Engineering Track.

- **Production URL:** https://flyrank-capstone.vercel.app
- **Repository:** https://github.com/taksimsquare12/flyrank-capstone
---

## 📸 Screenshots & Architecture Overview

The application integrates streaming AI model interactions alongside WebGL graphics:
1. **AI Chat Interface (`FE-09`):** Real-time token streaming with `aria-live` accessible announcements and request cancellation controls.
2. **Interactive 3D Configurator (`FE-AA2`):** React Three Fiber (R3F) model viewer with real-time material swapping and dynamic lighting.
3. **Shader Hero Section (`FE-AA3`):** Custom GLSL fragment shader utilizing `u_time`, `u_resolution`, and `u_mouse` uniforms.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js 16 (App Router, Server Actions, Dynamic Client Components)
- **Language & Styling:** TypeScript, Tailwind CSS
- **3D & Shaders:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Testing & CI:** Vitest (`happy-dom` environment), GitHub Actions CI Pipeline
- **Deployment & Hosting:** Vercel (Edge runtime, Automatic SSL, Production Environment)

---

## 🔒 Production Protection & API Hygiene

To prevent credit drainage and ensure API reliability:
- **Rate Limiting & Input Caps:** Message inputs are capped at a maximum character limit frontend/backend and debounced to prevent duplicate requests.
- **Handler Timeouts:** Streaming handlers configured with explicit `maxDuration = 30` seconds on Vercel serverless execution.
- **Graceful Error Handling:** Fallback UI badges and retry actions trigger on network interruption or rate-limit hits.

---

## 🔑 Environment Variables

To run this project locally, create a `.env.local` file in the root directory:

| Variable Name | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base application URL for CORS and metadata canonicals | Yes | `http://localhost:3000` |
| `OPENAI_API_KEY` | API Key for AI streaming backend | Yes | `your_api_key_here` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Vercel Analytics tracking token | No | `opt_in_token` |

---

## 🚀 Local Run & Installation Instructions

```bash
# 1. Clone the repository
git clone [https://github.com/taksimsquare12/flyrank-capstone.git](https://github.com/taksimsquare12/flyrank-capstone.git)

# 2. Navigate to root directory
cd flyrank-capstone

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev