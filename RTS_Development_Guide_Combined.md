# Komplet Guide til RTS Spiludvikling: Fra Interaction Layer til Retention Loops

Dette dokument kombinerer tre faser af spiludvikling for at skabe et professionelt RTS (Real-Time Strategy) spil. Vi gennemgår opbygningen af et interaktionslag, tilføjelse af "juice" og feedback, samt implementering af progressionssystemer for at holde spillerne engagerede.

---

## Del 1: RTS Interaction Layer
Dette lag får spillet til at føles som et rigtigt spil ved at give spilleren kontrol over verdenen.

### 1. Minimap (Simpel men effektiv)
Målet er at vise enheder og tårne hurtigt, samt tillade kamera-spring ved klik.

**HTML & CSS Setup:**
```html
<canvas id="minimap"></canvas>
```
```css
#minimap {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 150px;
  height: 150px;
  background: #000;
  border: 2px solid #555;
}
```

**JavaScript Logik:**
```javascript
const minimap = document.getElementById("minimap");
const mctx = minimap.getContext("2d");

function renderMinimap(state) {
  mctx.clearRect(0, 0, 150, 150);
  const scale = 150 / 100; // Map størrelse

  state.units.forEach(u => {
    mctx.fillStyle = "red";
    mctx.fillRect(u.x * scale, u.y * scale, 3, 3);
  });

  state.towers.forEach(t => {
    mctx.fillStyle = "blue";
    mctx.fillRect(t.x * scale, t.y * scale, 4, 4);
  });
}

// Klik på minimap for at flytte kameraet
minimap.addEventListener("click", (e) => {
  const rect = minimap.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width * 100;
  const y = (e.clientY - rect.top) / rect.height * 100;
  camera.position.x = x - 50;
  camera.position.z = y - 50;
});
```

### 2. Click-to-Place Towers (Raycasting)
Dette er kernen i RTS-følelsen. Vi bruger raycasting til at finde det punkt i 3D-verdenen, hvor spilleren klikker.

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(plane);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    placeTower(point);
  }
});

function placeTower(point) {
  socket.emit("action", {
    type: "build_tower",
    x: Math.floor(point.x),
    y: Math.floor(point.z)
  });
}
```
*Vigtigt: Clienten vælger positionen, men serveren skal altid validere den.*

### 3. Selection System
Klik og træk for at vælge flere enheder samtidig.

```javascript
let start = null;
const box = document.getElementById("selectionBox");

window.addEventListener("mousedown", (e) => {
  start = { x: e.clientX, y: e.clientY };
  box.style.display = "block";
});

window.addEventListener("mousemove", (e) => {
  if (!start) return;
  const x = Math.min(start.x, e.clientX);
  const y = Math.min(start.y, e.clientY);
  const w = Math.abs(start.x - e.clientX);
  const h = Math.abs(start.y - e.clientY);

  box.style.left = x + "px";
  box.style.top = y + "px";
  box.style.width = w + "px";
  box.style.height = h + "px";
});

window.addEventListener("mouseup", (e) => {
  if (!start) return;
  selectUnits(start, { x: e.clientX, y: e.clientY });
  start = null;
  box.style.display = "none";
});
```

---

## Del 2: Combat Feel & Juice
Når mekanikkerne er på plads, skal vi tilføje feedback, så spilleren mærker deres handlinger.

### 1. Hit Effects (Visuel Impact)
Brug partikel-systemer til at visualisere hits.

```javascript
function spawnHitEffect(x, z) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 20; i++) {
    vertices.push(x, 1, z);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xffff00, size: 0.5 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let life = 0;
  function update() {
    life += 0.05;
    particles.rotation.y += 0.1;
    particles.material.opacity = 1 - life;
    if (life > 1) { scene.remove(particles); return; }
    requestAnimationFrame(update);
  }
  update();
}
```

### 2. Screen Shake & Damage Numbers
Gør det tydeligt når der sker skade.

```javascript
function screenShake(intensity = 0.5) {
  const original = camera.position.clone();
  let t = 0;
  function shake() {
    t += 0.1;
    camera.position.x = original.x + (Math.random() - 0.5) * intensity;
    camera.position.z = original.z + (Math.random() - 0.5) * intensity;
    if (t < 1) requestAnimationFrame(shake);
    else camera.position.copy(original);
  }
  shake();
}

function floatingText(x, z, text) {
  const div = document.createElement("div");
  div.innerText = text;
  div.style.position = "absolute";
  div.style.color = "yellow";
  document.body.appendChild(div);

  let yOffset = 0;
  function update() {
    yOffset += 1;
    const screen = worldToScreen({ x, y: z });
    div.style.left = screen.x + "px";
    div.style.top = (screen.y - yOffset) + "px";
    div.style.opacity = 1 - yOffset / 50;
    if (yOffset < 50) requestAnimationFrame(update);
    else div.remove();
  }
  update();
}
```

---

## Del 3: Addiction & Retention Loops
Hvorfor kommer spilleren tilbage i morgen? Vi bygger loops, ikke bare features.

### 1. Core Addiction Loop
1. Spil en match
2. Optjen belønning (Gold/XP)
3. Unlock / Progression
4. Føl dig stærkere/klogere
5. Spil igen

### 2. Progression System
Start med et simpelt XP og level system.

```javascript
type Player = {
  id: string;
  rating: number;
  gold: number;
  xp: number;
  level: number;
};

function gainXP(player, amount) {
  player.xp += amount;
  if (player.xp >= xpToNext(player.level)) {
    player.level++;
    player.xp = 0;
    onLevelUp(player);
  }
}

function onLevelUp(player) {
  player.gold += 100;
  sendEvent(player.id, "level_up");
}
```

### 3. Match Rewards & Rank
Giv altid en belønning, selv ved nederlag, så spilleren føler progression.

| Resultat | Guld | XP |
| :--- | :--- | :--- |
| **Sejr** | 50 | 30 |
| **Nederlag** | 20 | 10 |

**Ranks baseret på Rating:**
- **Bronze:** < 1000
- **Silver:** 1000 - 1499
- **Gold:** 1500+

### 4. Retention Strategier
- **Daily Hook:** Giv stigende belønninger for at logge ind hver dag.
- **Win Streaks:** Tilføj en multiplikator for hver sejr i træk.
- **Short-term Goals:** Vis spilleren hvor tæt de er på næste mål (f.eks. "80% til næste level").

---

## Konklusion
Du er nu færdig med at bygge de grundlæggende systemer. Herfra handler det om at teste med rigtige spillere og bruge data til at forbedre spiloplevelsen.

**Næste skridt:** Overvej "Live Ops" (events, balancering, patches og monetarisering) for at gøre projektet til en rigtig forretning.
