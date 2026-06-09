# AGENTS.md — AI Agent Coordination & Guidelines

Welcome, AI Agent! This document defines the coordination protocol, code constraints, and architecture for the **Pulse Analytics** codebase. All agentic workflows, refactors, and feature implementations must align with the rules specified below.

---

## 1. Core Principles & Repository Structure

Pulse is a privacy-focused analytics SaaS platform consisting of two main sub-projects:
- **`backend/`**: TypeScript Express API using ESM module resolution (`.js` imports), MongoDB, Redis, and Socket.io.
- **`frontend/`**: Next.js 15 (React 19) dashboard with Tailwind CSS, Recharts, and Socket.io-client.

### Directory Structure

```text
pulse/
├── .agents/               # Configured and installed agent skills
│   └── skills/            # Directory containing agent skills
│       ├── find-skills
│       ├── frontend-design
│       ├── next-best-practices
│       ├── ui-ux-pro-max
│       └── web-design-guidelines
├── backend/               # TypeScript + Express API
└── frontend/              # Next.js 15 Dashboard application
```

---

## 2. Design System & Component Library

### Design Specification
*   The system UI/UX and design guidelines are defined in **[DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md) in the root path**. Do NOT define new colors or styling guidelines from scratch; always refer to this root document.
*   The design language is inspired by Vercel’s clean, developer-focused brand: stark black-and-ink elements on near-white canvases, highlighted by atmospheric mesh gradients (cyan, blue, magenta, amber), sentence-case period-terminated headlines, negative letter-spacing, and stacked shadows.

### Component Library
*   The primary component library to build and style this application is **shadcn/ui**.
*   All new or refactored UI components must use shadcn primitives (e.g., Radix primitives styled with Tailwind CSS utility classes) aligned with the color tokens and shapes defined in [DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md).

---

## 3. Skills Integration

We have custom agent skills installed in the repository to guide code creation, UI reviews, and system designs. Agents must locate and execute skills from the following directory:
*   **`.agents/skills/`**

### Active Skills:
1.  **`find-skills`** (`.agents/skills/find-skills/SKILL.md`): Discover and install new capabilities.
2.  **`frontend-design`** (`.agents/skills/frontend-design/SKILL.md`): Code quality guidelines for beautiful, premium user interfaces.
3.  **`next-best-practices`** (`.agents/skills/next-best-practices/SKILL.md`): Standard file conventions, App Router structures, optimization, and Next.js 15 patterns.
4.  **`ui-ux-pro-max`** (`.agents/skills/ui-ux-pro-max/SKILL.md`): Reference specifications for typography, buttons, inputs, components, and responsive grids.
5.  **`web-design-guidelines`** (`.agents/skills/web-design-guidelines/SKILL.md`): Best practices for reviewing interfaces, accessibility compliance, and design checking.

Before performing complex refactoring or styling, view the relevant `SKILL.md` in the `.agents/skills/` directory.

---

## 4. Development & Code Conventions

### Backend Code Rules
*   **Module System**: ESM (`"type": "module"`). All local imports must include `.js` file extensions.
*   **Validation**: body parameters must validate via Zod schemas in `src/schemas/`.
*   **Testing**: Vitest (`npm test`). Decouple the application setup (`createApp()`) from the listener socket server for isolated request tests.

### Frontend Code Rules
*   **Next.js 15 App Router**: Pages reside in `app/`. Client components must explicitly state `"use client";`.
*   **Aesthetics**: Avoid basic or generic styling. Utilize Geist (sans) and Geist Mono (monospace labels) fonts.
*   **Imports**: Use `@/` path alias pointing to the `frontend/` source root.

---

## 5. Coordination Protocol
If you are modifying files:
1.  Verify constraints against active code before committing to a change.
2.  Write tests or verify locally to ensure compliance.
3.  Document edits and outline implementation updates in the relevant files or PR descriptions.
