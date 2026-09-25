# Pen Fight — Last Bench

A responsive React + TypeScript canvas game inspired by the school-desk pen-fighting ritual.

## Run

```bash
npm install
npm run dev
```

Build a static deployment with `npm run build`; the result is written to `dist/`.

## Included

- Pull-back-and-release flick input for mouse and touch
- Momentum, friction, rotational velocity, off-centre collision response, and desk-edge knockouts
- Opening-shot cap, alternating starts, double-knockout replay, and best-of-five scoring
- Quick Duel with a position-aware AI and a selectable fictional pen collection
- Responsive school-desk canvas treatment and keyboard-accessible menus

The physics loop lives in `src/game/Engine.ts` and renders through canvas, keeping frame updates outside React state rendering.
