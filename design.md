# Line Tower Wars - Mobile Game Design

## Overview
A strategic tower defense game where players place towers to defend against waves of advancing enemies. The game features progressive difficulty, multiple tower and enemy types, and a grid-based placement system.

---

## Screen List

### 1. **Home Screen**
- App logo and title
- "Start Game" button
- "Settings" button
- High score display
- Quick stats (best wave reached, total gold earned)

### 2. **Game Screen (Main Gameplay)**
- **Top Bar**: Current wave, lives remaining, gold available, wave timer
- **Game Canvas**: 22×14 grid with towers, creeps, and projectiles rendered
- **Bottom Panel**: Tower selection menu (5 tower types with cost and stats)
- **Interaction**: Tap to place towers, long-press to sell towers, swipe to pan (if needed)

### 3. **Tower Selection/Info Panel**
- Displays tower stats when selected (damage, range, fire rate, cost)
- Shows placement preview on grid (green = valid, red = invalid)
- Cancel placement button

### 4. **Game Over Screen**
- Final wave reached
- Total gold earned
- Final score
- "Restart" button
- "Home" button

### 5. **Settings Screen**
- Sound toggle (on/off)
- Difficulty selector (if applicable)
- Reset progress option
- About section

---

## Primary Content and Functionality

### Game Canvas
- **Grid Display**: 22 columns × 14 rows, each cell is a tower placement slot
- **Towers**: Rendered as colored squares/icons with health bars
- **Creeps**: Animated enemies moving along the path from entry to exit
- **Projectiles**: Visual feedback for tower attacks (arrows, cannonballs, etc.)
- **Path Visualization**: Optional overlay showing the creep path

### Tower Selection Menu
- **5 Tower Types**:
  - Arrow (50 gold): Fast, balanced damage
  - Cannon (100 gold): Area damage, slow fire rate
  - Sniper (150 gold): High damage, long range, single target
  - Freeze (120 gold): Slows enemies, low damage
  - Bomb (200 gold): Massive explosion, expensive
- Each tower shows: name, cost, damage, range, fire rate

### Wave System
- Waves progress automatically after all creeps are defeated
- **Boss Waves** (every 5 waves): Spawn a powerful Demon + regular enemies
- Wave difficulty increases: more enemies, higher HP, faster speed
- Display wave number and enemies remaining

### Resource Management
- **Gold**: Earned by defeating creeps, spent on towers
- **Lives**: Start with 20, lose 1 per creep that reaches the exit
- **Game Over**: When lives reach 0

---

## Key User Flows

### Flow 1: Place a Tower
1. Player taps a tower type in the bottom menu
2. Grid shows placement preview (green = valid, red = blocked)
3. Player taps a grid cell to place the tower
4. Tower is placed, gold is deducted
5. Creeps automatically target and attack the tower

### Flow 2: Sell a Tower
1. Player long-presses an existing tower
2. Confirmation dialog appears
3. Player confirms to sell
4. Tower is removed, player receives 50% of tower cost as gold

### Flow 3: Play a Wave
1. Wave starts, creeps spawn at entry point
2. Towers automatically target and fire at creeps
3. Creeps follow the path toward the exit
4. Player can place additional towers during the wave
5. When all creeps are defeated, wave ends
6. Player receives wave bonus gold
7. Next wave button appears

### Flow 4: Game Over
1. Last life is lost (creep reaches exit)
2. Game Over screen displays
3. Player can restart or return to home

---

## Color Choices

| Element | Color | Hex |
|---------|-------|-----|
| **Background** | Light Gray | #F5F5F5 |
| **Grid Cells** | White | #FFFFFF |
| **Grid Lines** | Light Gray | #E0E0E0 |
| **Arrow Tower** | Green | #4ADE80 |
| **Cannon Tower** | Orange | #FB9238 |
| **Sniper Tower** | Blue | #38BDF8 |
| **Freeze Tower** | Purple | #C084FC |
| **Bomb Tower** | Red | #EF4444 |
| **Goblin Creep** | Light Green | #84CC16 |
| **Wolf Creep** | Orange | #F97316 |
| **Ogre Creep** | Indigo | #6366F1 |
| **Gargoyle Creep** | Cyan | #22D3EE |
| **Demon Creep** | Dark Red | #DC2626 |
| **Primary Text** | Dark Gray | #1F2937 |
| **Secondary Text** | Medium Gray | #6B7280 |
| **Button Primary** | Blue | #3B82F6 |
| **Button Hover** | Dark Blue | #1D4ED8 |
| **Success (Wave Complete)** | Green | #10B981 |
| **Warning (Low Lives)** | Orange | #F59E0B |
| **Error (Game Over)** | Red | #EF4444 |

---

## Layout Specifics (Mobile Portrait 9:16)

### Game Screen Layout
```
┌─────────────────────────┐
│  Wave: 3 | Lives: 18    │  ← Top Status Bar (height: 60px)
│  Gold: 450 | Timer: 45s │
├─────────────────────────┤
│                         │
│                         │
│   [22×14 Grid Canvas]   │  ← Main Game Area (flex-grow)
│   (Touch-interactive)   │
│                         │
│                         │
├─────────────────────────┤
│ [Arrow] [Cannon] [Snip] │  ← Tower Selection (height: 80px)
│ 50g     100g     150g    │  (Horizontal scroll if needed)
│ [Freeze] [Bomb]         │
│ 120g     200g           │
└─────────────────────────┘
```

### Home Screen Layout
```
┌─────────────────────────┐
│                         │
│     [LTW Logo]          │  ← Logo (centered)
│                         │
│  Line Tower Wars        │  ← Title
│                         │
│   [Start Game]          │  ← Primary Button
│   [Settings]            │  ← Secondary Button
│                         │
│  Best Wave: 12          │  ← Stats
│  High Score: 2,450      │
│                         │
└─────────────────────────┘
```

---

## Interaction Design

### Touch Interactions
- **Tap**: Select tower, place tower, confirm actions
- **Long-press**: Sell tower (2-second hold)
- **Swipe**: Pan canvas (if grid is larger than screen)
- **Double-tap**: Zoom in/out (optional)

### Feedback
- Tower placement preview (green/red overlay)
- Haptic feedback on tower placement
- Visual feedback on tower attacks (projectile animation)
- Creep death animation (fade out)

---

## Performance Considerations

- **Canvas Rendering**: Use React Native's Canvas or Skia for smooth 60fps rendering
- **Grid Optimization**: Only render visible cells and entities
- **Creep Pathfinding**: Pre-compute path at wave start, update only when towers are placed
- **Projectile Pooling**: Reuse projectile objects to reduce GC pressure

---

## Accessibility

- **Text Size**: Minimum 14sp for body text, 18sp for buttons
- **Color Contrast**: All text has sufficient contrast (WCAG AA)
- **Touch Targets**: Minimum 48×48dp for all interactive elements
- **Haptic Feedback**: Optional, can be toggled in settings

---

## Future Enhancements

- Leaderboard integration
- Multiple maps/difficulty levels
- Tower upgrades
- Special abilities (temporary speed boost, etc.)
- Multiplayer/PvP mode
- Daily challenges
