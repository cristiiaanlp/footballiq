# ⚽ Football IQ

**La plataforma definitiva para aprender fútbol de forma interactiva.**
Tácticas, sistemas y lectura de juego — divertido, visual y gamificado.
El _Chess.com del fútbol_.

> Duolingo + Chess.com + Football Manager + videojuego táctico.

## ✨ Funcionalidades

| | Feature | Descripción |
|---|---|---|
| 🖊️ | **Tactic Lab** | Pizarra interactiva con drag & drop, flechas, formaciones y exportar imagen |
| 🧠 | **Quizzes tácticos** | Pressing, posesión, espacios, coberturas… con feedback del _porqué_ |
| 🌳 | **Match Scenarios** | Situaciones reales sobre el campo: ¿cuál es la mejor decisión? |
| 🎓 | **Football Academy** | Módulos visuales y **animados** (transiciones, amplitud, tercer hombre…) |
| 🏆 | **Coach Mode** | XP, niveles, rangos (Rookie → Tactical Master) y logros |
| 🔥 | **Daily Challenges** | Reto diario, rachas y leaderboard |
| 🔲 | **Formation Explorer** | 4-3-3, 4-4-2, 3-5-2… fortalezas, debilidades y usos |
| 👤 | **Perfil gaming** | Nivel, XP, precisión, módulos, streak y logros |

## 🧱 Stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** (dark mode premium + glassmorphism)
- **Framer Motion** (animaciones)
- **Zustand** (estado de gamificación, persistido)
- **Supabase Auth** (con _fallback_ a modo demo local)
- **SVG / Canvas** interactivo para las tácticas

## 🚀 Empezar

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

### Modo demo vs. Supabase

La app funciona **sin configuración**: si no defines credenciales de Supabase,
arranca en **Modo Demo Local** (auth + progreso en `localStorage`).

Para usar Supabase real, copia `.env.example` a `.env.local` y rellena:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🆕 Extras premium

- **Animación de jugadas** en el Tactic Lab (captura keyframes → Play, con control de velocidad) + galería **Mis tácticas** (cargar/editar/borrar).
- **Examen** al final de cada módulo de la Academy (bucle aprende → practica → examina).
- **Sonidos** sintetizados (Web Audio, sin archivos) con toggle en el perfil.
- **Celebración de subida de nivel** (overlay + confeti + sonido).
- **PWA instalable** (`manifest.webmanifest` + service worker offline).
- **Contenido**: ~41 quizzes y 16 escenarios, todo en español.

## ☁️ Sincronización en la nube (Supabase)

Con credenciales de Supabase configuradas, el progreso se sincroniza entre
dispositivos y el leaderboard pasa a ser real. Ejecuta
[`supabase/schema.sql`](supabase/schema.sql) en tu proyecto y rellena el
`.env.local`. Sin credenciales, todo funciona en modo demo local.

## 💰 Monetización (preparada)

Arquitectura lista para **Stripe**:

- Estado `isPremium` en el store + gating de contenido (`PremiumOverlay`).
- Módulos Free vs. Premium en la Academy.
- Variables de entorno `*_STRIPE_*` reservadas en `.env.example`.

## 📦 Estructura

```
src/
  app/            # rutas (landing, auth, (app)/* protegidas)
  components/     # ui/, layout/, pitch/, learn/, landing/, auth/
  data/           # formations, quizzes, scenarios, academy
  hooks/          # useAuth
  lib/            # supabase, ranks, nav, utils
  stores/         # gameStore (zustand)
  types/          # tipos del dominio
```

## 🎨 Diseño

Dark mode premium, glassmorphism ligero, tipografía Inter, paleta verde
fútbol / azul / oro, animaciones suaves y **mobile-first** (se siente como una
app nativa, con bottom-nav en móvil y sidebar en escritorio).
