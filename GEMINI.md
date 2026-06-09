# GEMINI.md — Gemini Agent Guide & Instructions

Hello Gemini! This document specifies workflows, instructions, and design parameters customized for Gemini agent models working on the **Pulse Analytics** project.

---

## 1. Planning and Execution Workflow

Gemini agents must operate within a structured development loop to prevent styling drift or regressions.

### Planning Mode
For any significant design changes, feature additions, or codebase refactors:
1.  **Research**: Use read and search tools to understand existing backend/frontend linkages. Do NOT run command lines that edit files or build components yet.
2.  **Implementation Plan**: Create or update the `implementation_plan.md` artifact in the brain folder (`C:\Users\user\.gemini\antigravity-ide\brain\<conversation-id>/implementation_plan.md`). 
    *   Explicitly cite **[DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md)** in the root path for visual tokens.
    *   Detail the transition steps to **shadcn** UI components.
    *   Set `request_feedback = true` in the metadata to alert the user.
3.  **Approval**: Stop and wait for the user to approve the implementation plan before writing any code.
4.  **Execute**: Track task status using `task.md` and make contiguous or non-contiguous file changes.
5.  **Verify & Walkthrough**: Compile, test, and write the final changes to `walkthrough.md` with visual verification.

---

## 2. Core Specifications

*   **Design Blueprint**: Use **[DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md) in the root path** as the single source of truth for color styling (ink, canvas-soft, mesh gradients), border radius, spacing, and typography.
*   **Skills Folder**: Look in **`.agents/skills/`** for instructions on Next.js best practices (`next-best-practices`), general frontend quality (`frontend-design`), and UI specifications (`ui-ux-pro-max`).
*   **Component Library**: Use **shadcn** components. When updating or refactoring existing styles:
    *   Configure `components.json` and initialize shadcn.
    *   Convert custom CSS/Tailwind buttons, inputs, cards, and tables into shadcn primitives matching the colors and typography from [DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md).

---

## 3. Gemini-Specific Tools usage

*   **`browser_subagent`**: Use the browser subagent to perform visual testing on `http://localhost:3000` to verify changes, test authentication, and make sure that layout responsiveness works properly.
*   **`generate_image`**: If you need interface mocks or decorative assets (e.g., custom dashboard banners or mesh backgrounds), generate them with this tool. Do NOT use standard image placeholders.
*   **`replace_file_content` & `multi_replace_file_content`**: For targeted codebase edits. Use `multi_replace_file_content` only for non-contiguous changes inside a single file. Do NOT replace whole files if only parts are modified.
*   **`run_command`**: Use this to start the Next.js development server (`npm run dev` in `frontend/`) or Express API (`npm run dev` in `backend/`).

---

## 4. Specific Coding Instructions for Gemini

*   **Typography**: Stick to Geist (sans) and Geist Mono (monospace technical labels). Adjust letter-spacing for headers to negative values (`-0.6px` to `-2.4px`) according to [DESIGN.md](file:///c:/Users/user/Desktop/pulse/DESIGN.md).
*   **Colors**: Use curated palettes from `DESIGN.md` instead of default Tailwind colors:
    *   Ink/Dark values: `#171717` (`colors.primary` / `colors.ink`)
    *   Canvas soft background: `#fafafa`
    *   Borders and dividers: `#ebebeb` (`colors.hairline`)
*   **Clean Refs**: Use clean, clickable markdown links for all code symbols (e.g. `[Button](file:///c:/Users/user/Desktop/pulse/frontend/components/ui/Button.tsx)`) when interacting in logs or plans.
