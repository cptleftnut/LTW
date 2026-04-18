# Line Tower Wars Android - TODO

## Core Game Logic
- [x] Port GameData.lua to TypeScript (towers, creeps, waves, grid config)
- [x] Port Pathfinder.lua to TypeScript (BFS pathfinding algorithm)
- [x] Implement game state management (Redux or Context)
- [x] Implement wave spawning system
- [x] Implement creep movement and pathfinding
- [x] Implement tower targeting and combat
- [x] Implement projectile system
- [x] Implement collision detection and damage

## Game Canvas & Rendering
- [x] Set up canvas rendering system (Skia or React Native Canvas)
- [x] Render grid cells
- [x] Render towers with visual feedback
- [x] Render creeps with animations
- [x] Render projectiles
- [ ] Implement tower placement preview (green/red overlay)
- [x] Implement path visualization (optional)

## UI Components
- [x] Create Home Screen with logo and buttons
- [x] Create Game Screen with status bar and tower menu
- [ ] Create Tower Selection Panel with stats
- [ ] Create Game Over Screen
- [ ] Create Settings Screen
- [x] Implement tower placement UI
- [ ] Implement tower selling UI
- [x] Implement wave progression UI

## Game Mechanics
- [ ] Tower placement validation
- [ ] Tower selling (50% refund)
- [ ] Gold management and display
- [ ] Lives management and display
- [ ] Wave progression and bonuses
- [ ] Boss wave spawning (every 5 waves)
- [ ] Game over detection and handling
- [ ] Score calculation

## Touch & Interaction
- [ ] Implement tap-to-place tower
- [ ] Implement long-press-to-sell tower
- [ ] Implement tower selection menu
- [ ] Implement game pause/resume
- [ ] Add haptic feedback on tower placement
- [ ] Add haptic feedback on tower selling
- [ ] Add haptic feedback on creep death

## Audio & Polish
- [ ] Add background music
- [ ] Add tower placement sound
- [ ] Add tower attack sounds
- [ ] Add creep death sound
- [ ] Add wave complete sound
- [ ] Add game over sound
- [ ] Implement sound toggle in settings

## Branding & Assets
- [ ] Generate app logo
- [ ] Update app.config.ts with branding
- [ ] Create splash screen
- [ ] Create app icon variants

## Testing & Build
- [ ] Test game logic with unit tests
- [ ] Test UI interactions
- [ ] Test performance on low-end devices
- [ ] Test on Android emulator
- [ ] Build APK for Android
- [ ] Generate release APK

## Optional Enhancements
- [ ] Leaderboard system
- [ ] Multiple maps
- [ ] Tower upgrades
- [ ] Difficulty levels
- [ ] Daily challenges

## Audio & Sound Effects
- [x] Add background music system
- [x] Add tower placement sound
- [x] Add tower attack sounds
- [x] Add creep death sound
- [x] Add wave complete sound
- [x] Add game over sound
- [x] Implement sound toggle in settings

## Tower Upgrade System
- [x] Create tower upgrade data structures
- [ ] Implement upgrade UI
- [x] Add damage upgrade
- [x] Add range upgrade
- [x] Add fire rate upgrade
- [ ] Update game engine to handle upgrades

## Difficulty Levels
- [x] Add Easy difficulty (slower creeps, more gold)
- [x] Add Normal difficulty (default)
- [x] Add Hard difficulty (faster creeps, less gold)
- [x] Create difficulty selector UI
- [x] Adjust wave scaling based on difficulty

## Map Variations
- [x] Create Map 1 (original path)
- [x] Create Map 2 (winding path)
- [x] Create Map 3 (multiple paths)
- [x] Implement map selector UI
- [ ] Update pathfinding for different maps

## GitHub Workflow
- [ ] Create GitHub Actions workflow file
- [ ] Set up Android build configuration
- [ ] Configure APK generation
- [ ] Set up artifact storage
- [ ] Test workflow on push
