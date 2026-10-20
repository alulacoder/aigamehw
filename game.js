/**
 * CYBER DASH 3D - Full Engine with Hardcore Obstacles & Special Moves
 * 
 * Obstacles:
 * 1. Ground Spikes (Single, Double, Triple, Quadruple)
 * 2. Rotating Buzzsaw Blades (Deadly razor gear spinning in 3D)
 * 3. Ceiling Spikes (Deadly when gravity is flipped or during high leaps)
 * 4. Multi-level Floating Runways
 * 
 * Special Moves & Interactive Mechanisms:
 * 1. Yellow Catapult Pad (The Flat Booster): Launches the cube high into the stratosphere (23.5 vy)
 * 2. Pink Mini-Spring Pad: Low-trajectory speed hop over razor saws (14.0 vy)
 * 3. Mid-Air Jump Orbs (Yellow Ring): Airborne rhythm jump when clicked/spaced near the orb
 * 4. Gravity Inversion Portal (Cyan/Violet Ring Gate): Flips gravity upside down to run on the ceiling!
 * 5. Aerial Dash Booster Ring (Cyan Orb): Bursts the cube forward with speed boost
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.currentLevelIndex = 0;
    this.state = 'MENU';
    this.cameraMode = 'DYNAMIC_3D';
    
    // Game Mode & Difficulty Settings
    this.gameMode = 'classic'; // 'classic', 'survival', 'boss', 'timeattack'
    this.difficulty = 'NORMAL'; // 'EASY', 'NORMAL', 'HARD', 'INSANE'
    
    // Physics parameters
    this.BASE_GRAVITY = -48.0;
    this.gravityDir = 1; // 1 = normal downward, -1 = inverted ceiling gravity!
    this.JUMP_VELOCITY = 15.5;
    this.YELLOW_PAD_VELOCITY = 23.5; // High catapult
    this.PINK_PAD_VELOCITY = 14.2;   // Low fast hop
    this.ORB_JUMP_VELOCITY = 17.5;
    this.CUBE_SIZE = 1.0;
    this.CEILING_Y = 7.5; // Ceiling limit for upside down gravity

    // Currency & Upgrades State (Persistent in localStorage)
    this.shards = parseInt(localStorage.getItem('cyberdash_shards') || '150', 10);
    this.runShards = 0;
    
    // Upgrade definitions & levels
    this.upgrades = {
      shield: {
        id: 'shield',
        name: 'Quantum Barrier',
        desc: 'Absorbs 1 lethal hazard collision per run.',
        tier: parseInt(localStorage.getItem('cyberdash_upg_shield') || '0', 10),
        maxTier: 2,
        cost: [80, 200],
        icon: '🛡️'
      },
      magnet: {
        id: 'magnet',
        name: 'Shard Magnetizer',
        desc: 'Pulls nearby cyber-shards towards your cube automatically.',
        tier: parseInt(localStorage.getItem('cyberdash_upg_magnet') || '0', 10),
        maxTier: 3,
        cost: [50, 120, 250],
        icon: '🧲'
      },
      boost: {
        id: 'boost',
        name: 'Nitro Kinetic Thruster',
        desc: 'Provides 1.1x / 1.25x speed boost and bonus multiplier.',
        tier: parseInt(localStorage.getItem('cyberdash_upg_boost') || '0', 10),
        maxTier: 2,
        cost: [100, 220],
        icon: '⚡'
      },
      chrono: {
        id: 'chrono',
        name: 'Chrono Stasis',
        desc: 'Slows down gravity by 15% for extended airborne reflex windows.',
        tier: parseInt(localStorage.getItem('cyberdash_upg_chrono') || '0', 10),
        maxTier: 2,
        cost: [90, 180],
        icon: '⏳'
      }
    };

    // Active in-run shield status
    this.activeShields = 0;

    // Boss Chase System
    this.boss = {
      active: false,
      mesh: null,
      x: -40,
      y: 4.0,
      speed: 16.5,
      laserTimer: 0,
      laserMesh: null,
      isFiring: false
    };

    // Time Attack Clock
    this.timeAttack = {
      timeLeft: 60.0,
      distanceBonus: 0
    };

    // Player state
    this.player = {
      x: 0,
      y: 0.5,
      z: 0,
      vy: 0,
      isGrounded: true,
      currentPlatform: null,
      rotationAngle: 0,
      mesh: null,
      coreMaterial: null,
      wireMat: null,
      shieldMesh: null
    };

    // Progression
    this.attempts = 1;
    this.bestScores = [0, 0, 0, 0, 0, 0];

    // Achievements System
    this.initAchievements();

    // Three.js elements
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.obstacleGroup = null;
    this.particleGroup = null;
    this.ceilingGroup = null;
    this.groundGrid = null;
    this.ceilingGrid = null;
    this.lights = {};
    
    this.levelObjects = [];
    this.particles = [];
    this.shakeIntensity = 0;
    this.speedMultiplier = 1.0;

    this.lastTime = performance.now();

    this.initThree();
    this.initUI();
    this.setupInputs();
    this.updateWalletDisplays();
    this.updateLevelDisplay();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /* -------------------------------------------------------------
     ACHIEVEMENTS SYSTEM
  ------------------------------------------------------------- */
  initAchievements() {
    this.achievementDefs = [
      { id: 'first_jump', name: 'First Ignition', desc: 'Perform your first jump into the cyber-dimension', icon: '🚀' },
      { id: 'shard_collector', name: 'Shard Hoarder', desc: 'Collect 50 or more Cyber-Shards', icon: '💎' },
      { id: 'shield_save', name: 'Nano-Deflector', desc: 'Survive a deadly hazard using the Quantum Shield', icon: '🛡️' },
      { id: 'boss_escape', name: 'Apex Evader', desc: 'Escape or survive 300m against the Cyber-Leviathan', icon: '🐉' },
      { id: 'time_master', name: 'Chronos Dasher', desc: 'Reach 400m in Time Attack mode before timeout', icon: '⏱️' },
      { id: 'first_victory', name: 'Grid Master', desc: 'Complete 100% of any level or run', icon: '🏆' },
      { id: 'insane_runner', name: 'Demon Overdrive', desc: 'Play on INSANE difficulty', icon: '🔥' },
      { id: 'upgraded', name: 'Cyborg Evolution', desc: 'Unlock any ability upgrade in the workshop', icon: '⚡' }
    ];
    this.unlockedAchievements = JSON.parse(localStorage.getItem('cyberdash_achievements') || '{}');
  }

  unlockAchievement(id) {
    if (this.unlockedAchievements[id]) return;
    this.unlockedAchievements[id] = Date.now();
    localStorage.setItem('cyberdash_achievements', JSON.stringify(this.unlockedAchievements));

    const ach = this.achievementDefs.find(a => a.id === id);
    if (ach) {
      window.soundManager.playAchievement();
      const toast = document.getElementById('achievement-toast');
      document.getElementById('toast-title').innerText = `ACHIEVEMENT UNLOCKED: ${ach.name}!`;
      document.getElementById('toast-desc').innerText = ach.desc;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 4000);
    }
  }

  /* -------------------------------------------------------------
     THREE.JS SETUP
  ------------------------------------------------------------- */
  initThree() {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(-6, 4.5, 9);
    this.camera.lookAt(4, 2, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.obstacleGroup = new THREE.Group();
    this.particleGroup = new THREE.Group();
    this.ceilingGroup = new THREE.Group();
    this.scene.add(this.obstacleGroup);
    this.scene.add(this.particleGroup);
    this.scene.add(this.ceilingGroup);

    this.createPlayerMesh();
    this.setupLighting();
    this.createGroundAndCeiling();
    this.createSpaceBackdrop();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  createPlayerMesh() {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(this.CUBE_SIZE, this.CUBE_SIZE, this.CUBE_SIZE);
    
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x005577,
      emissiveIntensity: 0.3
    });
    const cubeMesh = new THREE.Mesh(geom, mat);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    group.add(cubeMesh);

    const wireGeom = new THREE.EdgesGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(wireGeom, wireMat);
    group.add(wireframe);

    // Glowing pupil
    const pupilGeom = new THREE.PlaneGeometry(0.45, 0.45);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const pupil = new THREE.Mesh(pupilGeom, pupilMat);
    pupil.position.set(0.05, 0.05, 0.505);
    group.add(pupil);

    const pupilEyeGeom = new THREE.PlaneGeometry(0.2, 0.2);
    const pupilEyeMat = new THREE.MeshBasicMaterial({ color: 0x001122, side: THREE.DoubleSide });
    const innerPupil = new THREE.Mesh(pupilEyeGeom, pupilEyeMat);
    innerPupil.position.set(0.1, 0.05, 0.508);
    group.add(innerPupil);

    // Holographic Quantum Shield sphere
    const shieldGeom = new THREE.SphereGeometry(this.CUBE_SIZE * 0.9, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
    shieldMesh.visible = false;
    group.add(shieldMesh);
    this.player.shieldMesh = shieldMesh;

    group.position.set(0, 0.5, 0);
    this.scene.add(group);

    this.player.mesh = group;
    this.player.coreMaterial = mat;
    this.player.wireMat = wireMat;

    this.createBossMesh();
  }

  createBossMesh() {
    const bossGroup = new THREE.Group();

    // Dragon head core
    const headGeom = new THREE.ConeGeometry(2.4, 5.0, 5);
    headGeom.rotateZ(-Math.PI / 2);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x1f0305,
      emissive: 0xff0033,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2
    });
    const head = new THREE.Mesh(headGeom, headMat);
    bossGroup.add(head);

    // Glowing Horns / Wings
    for (let s of [-1, 1]) {
      const hornGeom = new THREE.ConeGeometry(0.6, 3.2, 4);
      hornGeom.rotateX(s * 0.6);
      hornGeom.rotateZ(Math.PI / 4);
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.9
      });
      const horn = new THREE.Mesh(hornGeom, hornMat);
      horn.position.set(-1.2, 1.2, s * 1.5);
      bossGroup.add(horn);
    }

    // Menacing glowing eyes
    for (let s of [-1, 1]) {
      const eyeGeom = new THREE.SphereGeometry(0.35, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      const eye = new THREE.Mesh(eyeGeom, eyeMat);
      eye.position.set(1.5, 0.6, s * 0.85);
      bossGroup.add(eye);
    }

    // Plasma Cannon in mouth
    const cannonGeom = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 12);
    cannonGeom.rotateZ(Math.PI / 2);
    const cannonMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const cannon = new THREE.Mesh(cannonGeom, cannonMat);
    cannon.position.set(2.2, -0.2, 0);
    bossGroup.add(cannon);

    // Laser Beam Ray
    const laserGeom = new THREE.CylinderGeometry(0.25, 0.25, 60, 8);
    laserGeom.rotateZ(Math.PI / 2);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 0.85
    });
    const laserMesh = new THREE.Mesh(laserGeom, laserMat);
    laserMesh.position.set(32, -0.2, 0);
    laserMesh.visible = false;
    bossGroup.add(laserMesh);

    bossGroup.position.set(-40, 4.0, 0);
    bossGroup.visible = false;
    this.scene.add(bossGroup);

    this.boss.mesh = bossGroup;
    this.boss.laserMesh = laserMesh;
  }

  setupLighting() {
    this.lights.ambient = new THREE.AmbientLight(0x223366, 1.2);
    this.scene.add(this.lights.ambient);

    this.lights.dir = new THREE.DirectionalLight(0x00f0ff, 2.0);
    this.lights.dir.position.set(20, 30, 20);
    this.lights.dir.castShadow = true;
    this.scene.add(this.lights.dir);

    this.lights.cubePoint = new THREE.PointLight(0x00f0ff, 3.8, 14, 1.5);
    this.scene.add(this.lights.cubePoint);
  }

  createGroundAndCeiling() {
    // Floor
    const groundGeom = new THREE.BoxGeometry(2500, 4, 16);
    this.groundMat = new THREE.MeshStandardMaterial({
      color: 0x070c1f,
      roughness: 0.6,
      metalness: 0.3
    });
    const ground = new THREE.Mesh(groundGeom, this.groundMat);
    ground.position.set(700, -2, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);

    const gridHelper = new THREE.GridHelper(1400, 350, 0x00ffff, 0x004488);
    gridHelper.position.set(700, 0.01, 0);
    gridHelper.scale.set(1, 1, 0.016);
    this.scene.add(gridHelper);
    this.groundGrid = gridHelper;

    // Ceiling runway for gravity flip inverted runs!
    const ceilingGeom = new THREE.BoxGeometry(2500, 2, 16);
    this.ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x0c071f,
      roughness: 0.7,
      metalness: 0.4
    });
    const ceiling = new THREE.Mesh(ceilingGeom, this.ceilingMat);
    ceiling.position.set(700, this.CEILING_Y + 1.5, 0);
    this.ceilingGroup.add(ceiling);

    const ceilingGrid = new THREE.GridHelper(1400, 350, 0xbf00ff, 0x440088);
    ceilingGrid.position.set(700, this.CEILING_Y + 0.49, 0);
    ceilingGrid.scale.set(1, 1, 0.016);
    this.ceilingGroup.add(ceilingGrid);
  }

  createSpaceBackdrop() {
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.2) * 1400;
      positions[i + 1] = (Math.random() - 0.2) * 90;
      positions[i + 2] = (Math.random() - 0.5) * 60 - 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.backdropMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.38,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.spaceParticles = new THREE.Points(geometry, this.backdropMat);
    this.scene.add(this.spaceParticles);
  }

  /* -------------------------------------------------------------
     ATMOSPHERE & OBSTACLE BUILDERS
  ------------------------------------------------------------- */
  applyAtmosphere(atmo) {
    this.scene.fog = new THREE.FogExp2(atmo.fogColor, atmo.fogDensity);
    this.scene.background = new THREE.Color(atmo.bgColor);

    this.lights.ambient.color.setHex(atmo.ambientColor);
    this.lights.dir.color.setHex(atmo.dirLightColor);
    this.lights.cubePoint.color.setHex(atmo.cubeGlow);

    this.groundMat.color.setHex(atmo.floorColor);
    this.backdropMat.color.setHex(atmo.skyParticles);

    this.player.coreMaterial.color.setHex(atmo.cubeColor);
    this.player.coreMaterial.emissive.setHex(atmo.cubeGlow);
    this.player.wireMat.color.setHex(atmo.cubeColor);
  }

  buildLevel(levelData) {
    while (this.obstacleGroup.children.length > 0) {
      const obj = this.obstacleGroup.children[0];
      this.obstacleGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
    this.levelObjects = [];
    this.gravityDir = 1; // Reset to normal floor gravity

    const atmo = levelData.atmosphere;
    this.applyAtmosphere(atmo);
    this.buildGoalGate(levelData.length, atmo);

    levelData.elements.forEach(elem => {
      switch (elem.type) {
        case 'spike':
          this.createSpike(elem.x, elem.y || 0, false, atmo);
          break;
        case 'double_spike':
          this.createSpike(elem.x - 0.65, elem.y || 0, false, atmo);
          this.createSpike(elem.x + 0.65, elem.y || 0, false, atmo);
          break;
        case 'triple_spike':
          this.createSpike(elem.x - 1.2, elem.y || 0, false, atmo);
          this.createSpike(elem.x, elem.y || 0, false, atmo);
          this.createSpike(elem.x + 1.2, elem.y || 0, false, atmo);
          break;
        case 'quad_spike':
          this.createSpike(elem.x - 1.8, elem.y || 0, false, atmo);
          this.createSpike(elem.x - 0.6, elem.y || 0, false, atmo);
          this.createSpike(elem.x + 0.6, elem.y || 0, false, atmo);
          this.createSpike(elem.x + 1.8, elem.y || 0, false, atmo);
          break;
        case 'spike_ceiling':
          this.createSpike(elem.x, elem.y || this.CEILING_Y, true, atmo);
          break;
        case 'saw':
          this.createSawBlade(elem.x, elem.y || 1.5, atmo);
          break;
        case 'platform':
          this.createPlatform(elem.x, elem.y || 1.5, elem.length || 10, atmo);
          break;
        case 'pad':
          // Signature Yellow Flat Catapult Booster
          this.createCatapultPad(elem.x, elem.y || 0, 'yellow', atmo);
          break;
        case 'pink_pad':
          // Pink Mini Spring Pad (low hop)
          this.createCatapultPad(elem.x, elem.y || 0, 'pink', atmo);
          break;
        case 'orb':
          // Mid-Air Jump Ring (Yellow)
          this.createOrb(elem.x, elem.y || 2.5, 'yellow', atmo);
          break;
        case 'blue_orb':
          // Authentic GD Blue Gravity Ring (Flips gravity upon tap)
          this.createOrb(elem.x, elem.y || 2.5, 'blue', atmo);
          break;
        case 'portal_flip':
          // Gravity Flip Portal Ring!
          this.createGravityPortal(elem.x, elem.y || 3.0, atmo);
          break;
        case 'coin':
          // Glowing collectible Cyber-Shard
          this.createCollectibleShard(elem.x, elem.y || 2.0);
          break;
      }
    });
  }

  createCollectibleShard(x, y) {
    const group = new THREE.Group();
    // Octahedron diamond shard
    const shardGeom = new THREE.OctahedronGeometry(0.38, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      emissive: 0x00ffcc,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.1
    });
    const shardMesh = new THREE.Mesh(shardGeom, shardMat);
    group.add(shardMesh);

    // Subtle outer halo ring
    const ringGeom = new THREE.RingGeometry(0.48, 0.54, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    group.add(ringMesh);

    group.position.set(x, y, 0);
    this.obstacleGroup.add(group);

    this.levelObjects.push({
      type: 'coin',
      x: x,
      y: y,
      mesh: group,
      collected: false,
      radius: 0.9
    });
  }

  createSpike(x, y, isCeiling, atmo) {
    const spikeHeight = 1.2;
    const spikeRadius = 0.55;
    const geom = new THREE.ConeGeometry(spikeRadius, spikeHeight, 4);
    geom.rotateY(Math.PI / 4);
    if (isCeiling) {
      geom.rotateX(Math.PI);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: atmo.spikeColor,
      roughness: 0.2,
      metalness: 0.8,
      emissive: atmo.spikeColor,
      emissiveIntensity: 0.4
    });

    const mesh = new THREE.Mesh(geom, mat);
    const posY = isCeiling ? y - spikeHeight / 2 : y + spikeHeight / 2;
    mesh.position.set(x, posY, 0);
    mesh.castShadow = true;

    const edgeGeom = new THREE.EdgesGeometry(geom);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    mesh.add(new THREE.LineSegments(edgeGeom, edgeMat));

    this.obstacleGroup.add(mesh);

    this.levelObjects.push({
      type: 'spike',
      x: x,
      y: posY,
      width: spikeRadius * 1.5,
      height: spikeHeight * 0.9,
      mesh: mesh
    });
  }

  createSawBlade(x, y, atmo) {
    // 3D Rotating Razor Gear Saw
    const group = new THREE.Group();
    const radius = 1.1;
    const gearGeom = new THREE.CylinderGeometry(radius, radius, 0.2, 12);
    gearGeom.rotateX(Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      color: atmo.sawColor,
      emissive: atmo.sawColor,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const gearMesh = new THREE.Mesh(gearGeom, mat);
    group.add(gearMesh);

    // Inner teeth spikes
    for (let i = 0; i < 8; i++) {
      const toothGeom = new THREE.ConeGeometry(0.25, 0.6, 3);
      toothGeom.rotateZ(-Math.PI / 2);
      const tooth = new THREE.Mesh(toothGeom, mat);
      const angle = (i / 8) * Math.PI * 2;
      tooth.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      tooth.rotation.z = angle;
      group.add(tooth);
    }

    // Glowing center hub
    const hubGeom = new THREE.SphereGeometry(0.35, 12, 12);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    group.add(new THREE.Mesh(hubGeom, hubMat));

    group.position.set(x, y, 0);
    this.obstacleGroup.add(group);

    this.levelObjects.push({
      type: 'saw',
      x: x,
      y: y,
      radius: radius * 1.05,
      mesh: group
    });
  }

  createPlatform(x, y, length, atmo) {
    const height = 0.8;
    const depth = 2.4;
    const geom = new THREE.BoxGeometry(length, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: atmo.platformColor,
      roughness: 0.3,
      metalness: 0.7,
      emissive: atmo.gridColor,
      emissiveIntensity: 0.15
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x + length / 2, y + height / 2, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Glowing top runway
    const borderGeom = new THREE.BoxGeometry(length, 0.08, depth + 0.1);
    const borderMat = new THREE.MeshBasicMaterial({ color: atmo.gridColor });
    const border = new THREE.Mesh(borderGeom, borderMat);
    border.position.set(0, height / 2 + 0.04, 0);
    mesh.add(border);

    this.obstacleGroup.add(mesh);

    this.levelObjects.push({
      type: 'platform',
      xStart: x,
      xEnd: x + length,
      topY: y + height,
      bottomY: y,
      mesh: mesh
    });
  }

  createCatapultPad(x, y, style, atmo) {
    const group = new THREE.Group();
    const padColor = style === 'pink' ? atmo.pinkPadColor : atmo.padColor;

    // Base plate
    const baseGeom = new THREE.BoxGeometry(1.6, 0.15, 1.8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x22222a, metalness: 0.9, roughness: 0.2 });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = 0.075;
    group.add(baseMesh);

    // Glowing Flat Button Pad
    const padGeom = new THREE.BoxGeometry(1.3, 0.18, 1.5);
    const padMat = new THREE.MeshStandardMaterial({
      color: padColor,
      emissive: padColor,
      emissiveIntensity: 1.0,
      metalness: 0.3,
      roughness: 0.1
    });
    const padMesh = new THREE.Mesh(padGeom, padMat);
    padMesh.position.y = 0.18;
    group.add(padMesh);

    // Outer Glow Ring
    const ringGeom = new THREE.TorusGeometry(0.85, 0.06, 8, 24);
    ringGeom.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: padColor });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.y = 0.12;
    group.add(ringMesh);

    group.position.set(x, y, 0);
    this.obstacleGroup.add(group);

    this.levelObjects.push({
      type: style === 'pink' ? 'pink_pad' : 'pad',
      x: x,
      y: y + 0.2,
      width: 1.4,
      height: 0.5,
      mesh: group,
      ringMesh: ringMesh
    });
  }

  createOrb(x, y, style = 'yellow', atmo) {
    const group = new THREE.Group();
    const orbColor = style === 'blue' ? atmo.blueOrbColor : atmo.orbColor;

    const sphereGeom = new THREE.SphereGeometry(0.35, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: orbColor,
      emissive: orbColor,
      emissiveIntensity: 0.9
    });
    group.add(new THREE.Mesh(sphereGeom, sphereMat));

    const ringGeom = new THREE.TorusGeometry(0.65, 0.08, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: orbColor });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    group.add(ring);

    group.position.set(x, y, 0);
    this.obstacleGroup.add(group);

    this.levelObjects.push({
      type: style === 'blue' ? 'blue_orb' : 'orb',
      x: x,
      y: y,
      radius: 1.35,
      ringMesh: ring,
      mesh: group
    });
  }

  createGravityPortal(x, y, atmo) {
    // Holographic Gravity Distortion Portal
    const group = new THREE.Group();
    const portalGeom = new THREE.TorusGeometry(1.6, 0.2, 16, 32);
    portalGeom.rotateY(Math.PI / 2);
    const portalMat = new THREE.MeshStandardMaterial({
      color: atmo.portalColor,
      emissive: atmo.portalColor,
      emissiveIntensity: 1.3
    });
    group.add(new THREE.Mesh(portalGeom, portalMat));

    // Inner glowing field
    const fieldGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
    fieldGeom.rotateZ(Math.PI / 2);
    const fieldMat = new THREE.MeshBasicMaterial({
      color: atmo.portalColor,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    group.add(new THREE.Mesh(fieldGeom, fieldMat));

    group.position.set(x, y, 0);
    this.obstacleGroup.add(group);

    this.levelObjects.push({
      type: 'portal_flip',
      x: x,
      y: y,
      width: 1.2,
      height: 3.2,
      triggered: false,
      mesh: group
    });
  }

  buildGoalGate(x, atmo) {
    const gateGroup = new THREE.Group();
    const portalGeom = new THREE.TorusGeometry(3.5, 0.35, 16, 32);
    portalGeom.rotateY(Math.PI / 2);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffd166,
      emissiveIntensity: 1.2
    });
    gateGroup.add(new THREE.Mesh(portalGeom, portalMat));

    const planeGeom = new THREE.CircleGeometry(3.2, 32);
    planeGeom.rotateY(Math.PI / 2);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    gateGroup.add(new THREE.Mesh(planeGeom, planeMat));

    gateGroup.position.set(x, 3.5, 0);
    this.obstacleGroup.add(gateGroup);
  }

  /* -------------------------------------------------------------
     PARTICLE EFFECTS
  ------------------------------------------------------------- */
  spawnTrailParticle(x, y) {
    if (this.particles.length > 160) return;
    const geom = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      color: this.player.coreMaterial.color,
      transparent: true,
      opacity: 0.85
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x - 0.5, y + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
    this.particleGroup.add(mesh);

    this.particles.push({
      mesh: mesh,
      vx: -(Math.random() * 3 + 2),
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 2,
      life: 0.35,
      maxLife: 0.35
    });
  }

  spawnCatapultParticles(x, y, colorHex = 0xffea00) {
    for (let i = 0; i < 26; i++) {
      const geom = new THREE.TetrahedronGeometry(0.16);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, 0);
      this.particleGroup.add(mesh);

      const angle = (i / 26) * Math.PI * 2;
      this.particles.push({
        mesh: mesh,
        vx: Math.cos(angle) * (Math.random() * 8 + 4),
        vy: Math.sin(angle) * 7 + (this.gravityDir > 0 ? 10 : -10),
        vz: (Math.random() - 0.5) * 6,
        life: 0.5,
        maxLife: 0.5
      });
    }
  }

  spawnDeathExplosion(x, y) {
    for (let i = 0; i < 45; i++) {
      const size = Math.random() * 0.25 + 0.1;
      const geom = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0xff0055 : 0x00f0ff,
        emissive: 0xff0055,
        emissiveIntensity: 0.8
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, 0);
      this.particleGroup.add(mesh);

      this.particles.push({
        mesh: mesh,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() * 16) + 2,
        vz: (Math.random() - 0.5) * 16,
        rotX: Math.random() * 10,
        rotY: Math.random() * 10,
        life: 0.9,
        maxLife: 0.9
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particleGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
        continue;
      }

      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;
      if (p.rotX) {
        p.mesh.rotation.x += p.rotX * dt;
        p.mesh.rotation.y += p.rotY * dt;
      }
      p.mesh.material.opacity = p.life / p.maxLife;
    }
  }

  /* -------------------------------------------------------------
     PHYSICS & GAMEPLAY LOOP
  ------------------------------------------------------------- */
  startLevel(index = 0) {
    this.currentLevelIndex = index;
    let levelData;

    // Apply upgrade modifiers
    const speedBoostTier = this.upgrades.boost.tier;
    const speedMod = speedBoostTier === 2 ? 1.25 : (speedBoostTier === 1 ? 1.1 : 1.0);
    this.speedMultiplier = speedMod;

    // Chrono Stasis upgrade lowers gravity for aerial control
    const chronoTier = this.upgrades.chrono.tier;
    this.BASE_GRAVITY = chronoTier === 2 ? -38.0 : (chronoTier === 1 ? -42.0 : -48.0);

    // Equip Quantum Shields
    this.activeShields = this.upgrades.shield.tier; // 0, 1, or 2
    if (this.player.shieldMesh) {
      this.player.shieldMesh.visible = this.activeShields > 0;
    }
    const shieldInd = document.getElementById('hud-shield-indicator');
    if (this.activeShields > 0) {
      shieldInd.classList.remove('hidden');
      document.getElementById('hud-shield-count').innerText = this.activeShields;
    } else {
      shieldInd.classList.add('hidden');
    }

    // Determine level layout based on game mode
    if (this.gameMode === 'classic') {
      levelData = LEVELS[this.currentLevelIndex];
      this.boss.active = false;
      if (this.boss.mesh) this.boss.mesh.visible = false;
      document.getElementById('boss-hud-bar').classList.add('hidden');
      document.getElementById('hud-progress-container').classList.remove('hidden');
    } else if (this.gameMode === 'survival') {
      levelData = window.aiObstacleGenerator.generateLevel({
        mode: 'survival',
        difficulty: this.difficulty,
        length: 1200
      });
      this.boss.active = false;
      if (this.boss.mesh) this.boss.mesh.visible = false;
      document.getElementById('boss-hud-bar').classList.add('hidden');
      document.getElementById('hud-progress-container').classList.remove('hidden');
    } else if (this.gameMode === 'boss') {
      levelData = window.aiObstacleGenerator.generateLevel({
        mode: 'boss',
        difficulty: this.difficulty,
        length: 1400
      });
      this.boss.active = true;
      this.boss.x = -45;
      this.boss.y = 4.0;
      this.boss.speed = levelData.speed * 0.94; // stays close on your tail!
      this.boss.laserTimer = 3.5;
      this.boss.isFiring = false;
      if (this.boss.mesh) {
        this.boss.mesh.visible = true;
        this.boss.mesh.position.set(-45, 4.0, 0);
      }
      document.getElementById('boss-hud-bar').classList.remove('hidden');
      document.getElementById('hud-progress-container').classList.add('hidden');
    } else if (this.gameMode === 'timeattack') {
      levelData = window.aiObstacleGenerator.generateLevel({
        mode: 'timeattack',
        difficulty: this.difficulty,
        length: 1600
      });
      this.boss.active = false;
      if (this.boss.mesh) this.boss.mesh.visible = false;
      this.timeAttack.timeLeft = 45.0; // 45 seconds countdown
      document.getElementById('boss-hud-bar').classList.add('hidden');
      document.getElementById('hud-progress-container').classList.remove('hidden');
    }

    this.currentActiveLevel = levelData;
    this.buildLevel(levelData);

    this.player.x = 0;
    this.player.y = 0.5;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.currentPlatform = null;
    this.player.rotationAngle = 0;
    this.player.mesh.visible = true;
    this.gravityDir = 1;

    this.runShards = 0;
    document.getElementById('hud-shards').innerText = this.runShards;

    const modeTitles = {
      classic: `LEVEL ${index + 1}: ${levelData.title}`,
      survival: `SURVIVAL: ${this.difficulty}`,
      boss: `BOSS CHASE: CYBER-LEVIATHAN`,
      timeattack: `TIME ATTACK [45.0s]`
    };
    document.getElementById('hud-level-name').innerText = modeTitles[this.gameMode] || levelData.title;
    document.getElementById('hud-attempt').innerText = this.attempts;
    document.getElementById('hud-speed').innerText = ((levelData.speed * this.speedMultiplier) / 16).toFixed(1) + 'x';
    document.getElementById('hud-progress-fill').style.width = '0%';
    document.getElementById('hud-progress-text').innerText = '0%';

    if (this.difficulty === 'INSANE') {
      this.unlockAchievement('insane_runner');
    }

    this.showScreen('hud');
    this.state = 'PLAYING';
    window.soundManager.startMusic(levelData.theme);
  }

  jump() {
    if (this.state !== 'PLAYING') return;
    this.unlockAchievement('first_jump');

    // Normal or inverted jump from surface
    if (this.player.isGrounded) {
      this.player.vy = this.JUMP_VELOCITY * this.gravityDir;
      this.player.isGrounded = false;
      this.player.currentPlatform = null;
      window.soundManager.playJump();
      return;
    }

    // Mid-air Jump Orb / Blue Gravity Orb trigger
    for (const obj of this.levelObjects) {
      if (obj.type === 'orb' || obj.type === 'blue_orb') {
        const dx = this.player.x - obj.x;
        const dy = this.player.y - obj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < obj.radius) {
          if (obj.type === 'blue_orb') {
            // Inverts gravity in mid-air
            this.gravityDir *= -1;
            this.player.vy = 12.0 * this.gravityDir;
            window.soundManager.playGravityFlip();
            this.spawnCatapultParticles(obj.x, obj.y, 0x00d4ff);
          } else {
            // Standard Yellow Ring: Jump boost in mid-air
            this.player.vy = this.ORB_JUMP_VELOCITY * this.gravityDir;
            window.soundManager.playOrbTrigger();
            this.spawnCatapultParticles(obj.x, obj.y, 0xffd166);
          }
          obj.mesh.scale.set(1.5, 1.5, 1.5);
          break;
        }
      }
    }
  }

  triggerCatapult(pad, style = 'yellow') {
    const launchSpeed = style === 'pink' ? this.PINK_PAD_VELOCITY : this.YELLOW_PAD_VELOCITY;
    this.player.vy = launchSpeed * this.gravityDir;
    this.player.isGrounded = false;
    this.player.currentPlatform = null;
    this.shakeCamera(0.35);

    if (style === 'pink') {
      window.soundManager.playPinkPad();
      this.spawnCatapultParticles(pad.x, pad.y, 0xff00aa);
    } else {
      window.soundManager.playPadLaunch();
      this.spawnCatapultParticles(pad.x, pad.y, 0xffea00);
    }

    if (pad.mesh) {
      pad.mesh.scale.set(1.3, 0.4, 1.3);
      setTimeout(() => {
        if (pad.mesh) pad.mesh.scale.set(1.0, 1.0, 1.0);
      }, 140);
    }
  }

  updatePhysics(dt) {
    const levelData = this.currentActiveLevel || LEVELS[this.currentLevelIndex];
    const speed = levelData.speed * this.speedMultiplier;

    // 1. Move Forward
    this.player.x += speed * dt;

    // Time attack countdown
    if (this.gameMode === 'timeattack') {
      this.timeAttack.timeLeft -= dt;
      document.getElementById('hud-level-name').innerText = `TIME ATTACK [${Math.max(0, this.timeAttack.timeLeft).toFixed(1)}s]`;
      if (this.timeAttack.timeLeft <= 0) {
        this.handleTimeAttackOver();
        return;
      }
      if (this.player.x >= 400) {
        this.unlockAchievement('time_master');
      }
    }

    // 2. Boss Chase AI Behavior
    if (this.boss.active && this.boss.mesh) {
      // Boss follows player x position
      const targetBossX = this.player.x - 22;
      this.boss.x += (targetBossX - this.boss.x) * dt * 1.5;
      this.boss.y = 4.0 + Math.sin(performance.now() * 0.003) * 1.2;
      this.boss.mesh.position.set(this.boss.x, this.boss.y, 0);

      // Boss distance indicator
      const distToPlayer = Math.max(1, Math.floor(this.player.x - this.boss.x));
      document.getElementById('boss-dist-txt').innerText = `${distToPlayer}m`;
      const fillPct = Math.min(100, Math.max(5, (1 - (distToPlayer / 45)) * 100));
      document.getElementById('boss-fill').style.width = `${fillPct}%`;

      if (distToPlayer < 4) {
        // Boss devoured player!
        this.handleHazardHit('BOSS DEVOURED');
        return;
      }

      // Boss laser barrage timer
      this.boss.laserTimer -= dt;
      if (this.boss.laserTimer <= 0.8 && this.boss.laserTimer > 0.7) {
        window.soundManager.playBossWarning();
      }
      if (this.boss.laserTimer <= 0) {
        // Fire laser!
        this.boss.isFiring = true;
        this.boss.laserMesh.visible = true;
        window.soundManager.playBossBlast();
        this.shakeCamera(0.4);

        // Check laser collision with player
        const laserY = this.boss.y - 0.2;
        if (Math.abs(this.player.y - laserY) < 1.0 && this.player.x > this.boss.x) {
          this.handleHazardHit('PLASMA LASER STRIKE');
          return;
        }

        setTimeout(() => {
          if (this.boss.laserMesh) this.boss.laserMesh.visible = false;
          this.boss.isFiring = false;
        }, 320);

        this.boss.laserTimer = 4.5 + Math.random() * 2.0;
      }

      if (this.player.x >= 300) {
        this.unlockAchievement('boss_escape');
      }
    }

    // 3. Vertical Gravity
    const currentGravity = this.BASE_GRAVITY * this.gravityDir;
    this.player.vy += currentGravity * dt;
    this.player.y += this.player.vy * dt;

    // 4. Platform & Floor / Ceiling Surface Collisions
    if (this.gravityDir === 1) {
      // Normal Floor Gravity
      let groundHeight = 0.5;

      for (const obj of this.levelObjects) {
        if (obj.type === 'platform') {
          const playerLeft = this.player.x - this.CUBE_SIZE * 0.4;
          const playerRight = this.player.x + this.CUBE_SIZE * 0.4;
          const playerBottom = this.player.y - this.CUBE_SIZE * 0.5;

          if (playerRight > obj.xStart && playerLeft < obj.xEnd) {
            const platformTop = obj.topY + this.CUBE_SIZE * 0.5;
            if (playerBottom <= obj.topY && this.player.y >= obj.topY - 0.25 && this.player.vy <= 0) {
              groundHeight = platformTop;
              this.player.currentPlatform = obj;
              break;
            } else if (this.player.y < obj.topY - 0.25 && this.player.y > obj.bottomY) {
              this.handleHazardHit('WALL CRASH');
              return;
            }
          }
        }
      }

      if (this.player.y <= groundHeight) {
        this.player.y = groundHeight;
        this.player.vy = 0;
        this.player.isGrounded = true;
        const nearestQuadrant = Math.round(this.player.rotationAngle / (Math.PI / 2)) * (Math.PI / 2);
        this.player.rotationAngle = nearestQuadrant;
      } else {
        this.player.isGrounded = false;
        this.player.rotationAngle -= Math.PI * 3.8 * dt;
      }
    } else {
      // Inverted Ceiling Gravity!
      const ceilingHeight = this.CEILING_Y - 0.5;

      if (this.player.y >= ceilingHeight) {
        this.player.y = ceilingHeight;
        this.player.vy = 0;
        this.player.isGrounded = true;
        const nearestQuadrant = Math.round(this.player.rotationAngle / (Math.PI / 2)) * (Math.PI / 2);
        this.player.rotationAngle = nearestQuadrant;
      } else {
        this.player.isGrounded = false;
        this.player.rotationAngle += Math.PI * 3.8 * dt;
      }
    }

    // 5. Gravity Flip Portals
    for (const obj of this.levelObjects) {
      if (obj.type === 'portal_flip' && !obj.triggered) {
        if (Math.abs(this.player.x - obj.x) < 0.9 && Math.abs(this.player.y - obj.y) < 2.0) {
          obj.triggered = true;
          this.gravityDir *= -1; // Invert gravity direction!
          this.player.vy = 8.0 * this.gravityDir;
          this.shakeCamera(0.4);
          window.soundManager.playGravityFlip();
          this.spawnCatapultParticles(obj.x, obj.y, 0x00ffcc);
          break;
        }
      }
    }

    // 6. Catapult Pads (Yellow & Pink)
    for (const obj of this.levelObjects) {
      if (obj.type === 'pad' || obj.type === 'pink_pad') {
        const dx = Math.abs(this.player.x - obj.x);
        const dy = Math.abs(this.player.y - obj.y);
        if (dx < obj.width * 0.55 && dy < 0.6) {
          this.triggerCatapult(obj, obj.type === 'pink_pad' ? 'pink' : 'yellow');
          break;
        }
      }
    }

    // 7. Shard Magnetizer Upgrade & Shard Pickups
    const magnetTier = this.upgrades.magnet.tier;
    const magnetRadius = magnetTier === 3 ? 12.0 : (magnetTier === 2 ? 8.0 : (magnetTier === 1 ? 5.0 : 0));

    for (const obj of this.levelObjects) {
      if (obj.type === 'coin' && !obj.collected) {
        const dx = this.player.x - obj.x;
        const dy = this.player.y - obj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Magnet attraction
        if (magnetRadius > 0 && dist < magnetRadius) {
          obj.x += dx * 6.5 * dt;
          obj.y += dy * 6.5 * dt;
          obj.mesh.position.set(obj.x, obj.y, 0);
        }

        // Collection collision
        if (dist < 1.1) {
          obj.collected = true;
          obj.mesh.visible = false;
          this.runShards += 5;
          this.shards += 5;
          document.getElementById('hud-shards').innerText = this.runShards;
          window.soundManager.playCoin();
          this.spawnCatapultParticles(obj.x, obj.y, 0x00ffcc);

          if (this.shards >= 50) {
            this.unlockAchievement('shard_collector');
          }
        }
      }
    }

    // 8. Deadly Hazards (Spikes & Rotating Buzzsaws)
    for (const obj of this.levelObjects) {
      if (obj.type === 'spike') {
        const dx = Math.abs(this.player.x - obj.x);
        const dy = Math.abs(this.player.y - obj.y);
        if (dx < obj.width * 0.44 && dy < obj.height * 0.44) {
          this.handleHazardHit('HAZARD SPIKE IMPACT');
          return;
        }
      } else if (obj.type === 'saw') {
        const dx = this.player.x - obj.x;
        const dy = this.player.y - obj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < obj.radius * 0.82) {
          this.handleHazardHit('RAZOR BUZZSAW COLLISION');
          return;
        }
      }
    }

    // 9. Update Mesh & Shield
    this.player.mesh.position.set(this.player.x, this.player.y, this.player.z);
    this.player.mesh.rotation.z = this.player.rotationAngle;

    if (this.player.shieldMesh && this.activeShields > 0) {
      this.player.shieldMesh.rotation.y += dt * 3.0;
      this.player.shieldMesh.rotation.x += dt * 1.5;
    }

    // 10. Follow Light
    this.lights.cubePoint.position.set(this.player.x, this.player.y + 0.5, this.player.z + 1.5);

    // 11. Trail
    if (Math.random() < 0.65) {
      this.spawnTrailParticle(this.player.x, this.player.y);
    }

    // 12. Progress Tracking
    const progressPct = Math.min(100, Math.floor((this.player.x / levelData.length) * 100));
    document.getElementById('hud-progress-fill').style.width = `${progressPct}%`;
    document.getElementById('hud-progress-text').innerText = `${progressPct}%`;

    if (this.player.x >= levelData.length) {
      this.handleVictory();
    }
  }

  // Handle hazard collision with quantum shield check
  handleHazardHit(reason = 'MATRIX COLLISION') {
    if (this.activeShields > 0) {
      this.activeShields--;
      window.soundManager.playShieldBreak();
      this.shakeCamera(0.5);
      this.spawnCatapultParticles(this.player.x, this.player.y, 0x00f0ff);
      this.unlockAchievement('shield_save');

      const shieldInd = document.getElementById('hud-shield-indicator');
      if (this.activeShields > 0) {
        document.getElementById('hud-shield-count').innerText = this.activeShields;
      } else {
        shieldInd.classList.add('hidden');
        if (this.player.shieldMesh) this.player.shieldMesh.visible = false;
      }
      // Temporary invulnerability hop
      this.player.vy = 10.0 * this.gravityDir;
      this.player.x += 4.0;
      return;
    }

    this.handleDeath(reason);
  }

  handleTimeAttackOver() {
    this.state = 'DEAD';
    window.soundManager.stopMusic();
    window.soundManager.playDeath();
    this.saveLeaderboardScore(Math.floor(this.player.x));
    this.saveCurrency();

    document.getElementById('death-status-txt').innerText = 'TIME EXPIRED';
    document.getElementById('death-pct-num').innerText = Math.floor(this.player.x) + 'm';
    document.getElementById('death-attempt-num').innerText = this.attempts;
    document.getElementById('death-shards-earned').innerText = this.runShards;
    this.attempts++;

    setTimeout(() => {
      this.showScreen('death-screen');
    }, 350);
  }

  handleDeath(reason = 'MATRIX COLLISION') {
    this.state = 'DEAD';
    window.soundManager.stopMusic();
    window.soundManager.playDeath();
    this.shakeCamera(0.65);
    this.player.mesh.visible = false;
    this.spawnDeathExplosion(this.player.x, this.player.y);

    const levelData = this.currentActiveLevel || LEVELS[this.currentLevelIndex];
    const pct = Math.min(99, Math.floor((this.player.x / levelData.length) * 100));
    
    if (this.gameMode === 'classic') {
      if (pct > this.bestScores[this.currentLevelIndex]) {
        this.bestScores[this.currentLevelIndex] = pct;
        this.updateLevelDisplay();
      }
    }

    this.saveLeaderboardScore(this.gameMode === 'classic' ? pct : Math.floor(this.player.x));
    this.saveCurrency();

    document.getElementById('death-status-txt').innerText = reason;
    document.getElementById('death-pct-num').innerText = this.gameMode === 'classic' ? pct : Math.floor(this.player.x) + 'm';
    document.getElementById('death-attempt-num').innerText = this.attempts;
    document.getElementById('death-shards-earned').innerText = this.runShards;
    this.attempts++;

    setTimeout(() => {
      this.showScreen('death-screen');
    }, 450);
  }

  handleVictory() {
    this.state = 'VICTORY';
    window.soundManager.stopMusic();
    window.soundManager.playVictory();
    this.unlockAchievement('first_victory');

    if (this.gameMode === 'classic') {
      this.bestScores[this.currentLevelIndex] = 100;
      this.updateLevelDisplay();
    }

    // Award bonus shards
    const bonusShards = 50 + (this.difficulty === 'INSANE' ? 50 : 20);
    this.shards += bonusShards;
    this.saveCurrency();
    this.saveLeaderboardScore(100);

    const levelData = this.currentActiveLevel || LEVELS[this.currentLevelIndex];
    document.getElementById('victory-lvl-name').innerText = levelData.title;
    document.getElementById('victory-shards-num').innerText = bonusShards;
    this.showScreen('victory-screen');
  }

  saveCurrency() {
    localStorage.setItem('cyberdash_shards', this.shards.toString());
    this.updateWalletDisplays();
  }

  updateWalletDisplays() {
    const valStr = `💎 ${this.shards}`;
    const el1 = document.getElementById('menu-wallet-shards');
    const el2 = document.getElementById('shop-wallet-shards');
    if (el1) el1.innerText = valStr;
    if (el2) el2.innerText = valStr;
  }

  /* -------------------------------------------------------------
     LEADERBOARD SYSTEM
  ------------------------------------------------------------- */
  getLeaderboardData(board) {
    const key = `cyberdash_lb_${board}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);

    // Initial realistic mock AI runner data
    const defaults = {
      classic: [
        { name: 'Vortex_Rider', diff: 'NORMAL', score: '100%', shards: '240' },
        { name: 'CyberPulse', diff: 'HARD', score: '98%', shards: '190' },
        { name: 'SynthMaster', diff: 'EASY', score: '94%', shards: '150' },
        { name: 'NeonPhantom', diff: 'INSANE', score: '88%', shards: '130' }
      ],
      survival: [
        { name: 'QuantumGlider', diff: 'INSANE', score: '1120m', shards: '380' },
        { name: 'ChronoDrifter', diff: 'HARD', score: '940m', shards: '290' },
        { name: 'AeroZero', diff: 'NORMAL', score: '780m', shards: '210' },
        { name: 'Overclocked', diff: 'EASY', score: '620m', shards: '140' }
      ],
      boss: [
        { name: 'ApexSlayer', diff: 'INSANE', score: '1400m (ESCAPED)', shards: '520' },
        { name: 'LeviathanBane', diff: 'HARD', score: '1180m', shards: '390' },
        { name: 'DragonEvader', diff: 'NORMAL', score: '850m', shards: '260' },
        { name: 'NeonRunner', diff: 'EASY', score: '640m', shards: '170' }
      ],
      timeattack: [
        { name: 'WarpSpeedX', diff: 'INSANE', score: '1420m', shards: '460' },
        { name: 'HyperSonic', diff: 'HARD', score: '1280m', shards: '370' },
        { name: 'VelocityGod', diff: 'NORMAL', score: '1050m', shards: '280' },
        { name: 'SwiftRunner', diff: 'EASY', score: '820m', shards: '190' }
      ]
    };

    const boardData = defaults[board] || defaults.classic;
    localStorage.setItem(key, JSON.stringify(boardData));
    return boardData;
  }

  saveLeaderboardScore(scoreVal) {
    const board = this.gameMode;
    const list = this.getLeaderboardData(board);
    const scoreStr = typeof scoreVal === 'number' && board === 'classic' ? `${scoreVal}%` : `${scoreVal}m`;
    
    list.push({
      name: 'YOU (PLAYER)',
      diff: this.difficulty,
      score: scoreStr,
      shards: this.runShards.toString()
    });

    // Sort descending
    list.sort((a, b) => parseInt(b.score, 10) - parseInt(a.score, 10));
    localStorage.setItem(`cyberdash_lb_${board}`, JSON.stringify(list.slice(0, 8)));
  }

  renderLeaderboard(board = 'classic') {
    const list = this.getLeaderboardData(board);
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    tbody.innerHTML = list.map((item, idx) => {
      let rankClass = '';
      if (idx === 0) rankClass = 'rank-gold';
      else if (idx === 1) rankClass = 'rank-silver';
      else if (idx === 2) rankClass = 'rank-bronze';

      const isYou = item.name.includes('YOU');
      return `
        <tr style="${isYou ? 'background: rgba(0, 240, 255, 0.15); font-weight: bold;' : ''}">
          <td class="${rankClass}">#${idx + 1}</td>
          <td>${item.name}</td>
          <td><span style="font-size:0.75rem; color:#ffbe0b;">${item.diff}</span></td>
          <td style="color:#00f0ff;">${item.score}</td>
          <td style="color:#00ffcc;">💎 ${item.shards}</td>
        </tr>
      `;
    }).join('');
  }

  /* -------------------------------------------------------------
     UPGRADES WORKSHOP SYSTEM
  ------------------------------------------------------------- */
  renderUpgradesModal() {
    this.updateWalletDisplays();
    const grid = document.getElementById('upgrades-grid');
    if (!grid) return;

    grid.innerHTML = Object.values(this.upgrades).map(u => {
      const isMax = u.tier >= u.maxTier;
      const nextCost = isMax ? null : u.cost[u.tier];
      const canAfford = !isMax && this.shards >= nextCost;

      return `
        <div class="upgrade-card">
          <div class="upgrade-top">
            <div class="upgrade-icon">${u.icon}</div>
            <div class="upgrade-info">
              <h3>${u.name}</h3>
              <p>${u.desc}</p>
              <div class="upgrade-tier">TIER: ${u.tier} / ${u.maxTier} ${isMax ? '★ MAXED' : ''}</div>
            </div>
          </div>
          <button class="btn-buy-upgrade" data-upgrade="${u.id}" ${(!canAfford || isMax) ? 'disabled' : ''}>
            ${isMax ? 'MAX LEVEL REACHED' : `UPGRADE (💎 ${nextCost})`}
          </button>
        </div>
      `;
    }).join('');

    // Attach purchase listeners
    grid.querySelectorAll('.btn-buy-upgrade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const upgId = e.target.getAttribute('data-upgrade');
        this.purchaseUpgrade(upgId);
      });
    });
  }

  purchaseUpgrade(id) {
    const upg = this.upgrades[id];
    if (!upg || upg.tier >= upg.maxTier) return;
    const cost = upg.cost[upg.tier];
    if (this.shards < cost) return;

    this.shards -= cost;
    upg.tier++;
    localStorage.setItem(`cyberdash_upg_${id}`, upg.tier.toString());
    this.saveCurrency();
    window.soundManager.playUpgrade();
    this.unlockAchievement('upgraded');
    this.renderUpgradesModal();
  }

  /* -------------------------------------------------------------
     ACHIEVEMENTS MODAL
  ------------------------------------------------------------- */
  renderAchievementsModal() {
    const list = document.getElementById('achievements-list');
    if (!list) return;

    const unlockedCount = Object.keys(this.unlockedAchievements).length;
    document.getElementById('achieve-count').innerText = `${unlockedCount} / ${this.achievementDefs.length}`;

    list.innerHTML = this.achievementDefs.map(ach => {
      const isUnlocked = !!this.unlockedAchievements[ach.id];
      return `
        <div class="achieve-item ${isUnlocked ? 'unlocked' : ''}">
          <div class="achieve-icon">${ach.icon}</div>
          <div class="achieve-details">
            <h4>${ach.name} ${isUnlocked ? '✓' : ''}</h4>
            <p>${ach.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  shakeCamera(intensity) {
    this.shakeIntensity = intensity;
  }

  updateCamera(dt) {
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 2.5);
    }

    if (this.cameraMode === 'DYNAMIC_3D') {
      const targetCamX = this.player.x - 7.5;
      const targetCamY = THREE.MathUtils.clamp(this.player.y + 3.8, 3.5, 12.0);
      const targetCamZ = 8.8;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 0.14 + shakeX;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 0.09 + shakeY;
      this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.1;

      this.camera.lookAt(this.player.x + 4.5, this.player.y * 0.4 + 1.8, 0);
    } else {
      this.camera.position.set(this.player.x + 3.0 + shakeX, this.player.y + 3.0 + shakeY, 15);
      this.camera.lookAt(this.player.x + 3.0, this.player.y + 1.0, 0);
    }
  }

  /* -------------------------------------------------------------
     RENDER & ANIMATION LOOP
  ------------------------------------------------------------- */
  animate(time) {
    requestAnimationFrame(this.animate);

    const dt = Math.min((time - this.lastTime) / 1000, 0.08);
    this.lastTime = time;

    // Rotate buzzsaws, coins & rings
    for (const obj of this.levelObjects) {
      if (obj.type === 'saw' && obj.mesh) {
        obj.mesh.rotation.z += dt * 8.0; // High speed razor spinning
      }
      if (obj.type === 'coin' && obj.mesh) {
        obj.mesh.rotation.y += dt * 3.5;
        obj.mesh.rotation.z += dt * 1.5;
      }
      if (obj.type === 'orb' && obj.ringMesh) {
        obj.ringMesh.rotation.x += dt * 3.0;
        obj.ringMesh.rotation.y += dt * 2.2;
      }
      if ((obj.type === 'pad' || obj.type === 'pink_pad') && obj.ringMesh) {
        obj.ringMesh.rotation.z += dt * 3.5;
      }
      if (obj.type === 'portal_flip' && obj.mesh) {
        obj.mesh.rotation.y += dt * 2.5;
      }
    }

    if (this.state === 'PLAYING') {
      this.updatePhysics(dt);
    }

    this.updateParticles(dt);
    this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
  }

  /* -------------------------------------------------------------
     UI & LEVEL CAROUSEL INTERFACES
  ------------------------------------------------------------- */
  initUI() {
    // Mode tabs selector
    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.gameMode = e.target.getAttribute('data-mode');
        this.updateModeUI();
      });
    });

    // Difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.difficulty = e.target.getAttribute('data-diff');
      });
    });

    document.getElementById('btn-play').addEventListener('click', () => {
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('lvl-prev').addEventListener('click', () => {
      this.currentLevelIndex = (this.currentLevelIndex - 1 + LEVELS.length) % LEVELS.length;
      this.updateLevelDisplay();
    });

    document.getElementById('lvl-next').addEventListener('click', () => {
      this.currentLevelIndex = (this.currentLevelIndex + 1) % LEVELS.length;
      this.updateLevelDisplay();
    });

    const audioBtn = document.getElementById('btn-audio-toggle');
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.soundManager.toggleSound();
      audioBtn.innerText = isEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    });

    const camBtn = document.getElementById('btn-camera-mode');
    camBtn.addEventListener('click', () => {
      this.cameraMode = this.cameraMode === 'DYNAMIC_3D' ? 'CLASSIC_SIDE' : 'DYNAMIC_3D';
      camBtn.innerText = this.cameraMode === 'DYNAMIC_3D' ? '📷 CAM: DYNAMIC 3D' : '📷 CAM: SIDE 2.5D';
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('btn-quit').addEventListener('click', () => {
      this.showScreen('menu-screen');
    });

    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.currentLevelIndex = (this.currentLevelIndex + 1) % LEVELS.length;
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('btn-victory-menu').addEventListener('click', () => {
      this.showScreen('menu-screen');
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
      this.pauseGame();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      this.startLevel(this.currentLevelIndex);
    });

    document.getElementById('btn-pause-quit').addEventListener('click', () => {
      this.showScreen('menu-screen');
    });

    // Modals: Upgrades
    document.getElementById('btn-open-upgrades').addEventListener('click', () => {
      this.renderUpgradesModal();
      document.getElementById('upgrades-modal').classList.remove('hidden');
    });
    document.getElementById('btn-death-upgrades').addEventListener('click', () => {
      this.renderUpgradesModal();
      document.getElementById('upgrades-modal').classList.remove('hidden');
    });
    document.getElementById('btn-victory-upgrades').addEventListener('click', () => {
      this.renderUpgradesModal();
      document.getElementById('upgrades-modal').classList.remove('hidden');
    });
    document.getElementById('btn-close-upgrades').addEventListener('click', () => {
      document.getElementById('upgrades-modal').classList.add('hidden');
    });
    document.getElementById('btn-done-upgrades').addEventListener('click', () => {
      document.getElementById('upgrades-modal').classList.add('hidden');
    });

    // Modals: Leaderboard
    document.getElementById('btn-open-leaderboard').addEventListener('click', () => {
      this.renderLeaderboard(this.gameMode);
      document.getElementById('leaderboard-modal').classList.remove('hidden');
    });
    document.getElementById('btn-close-leaderboard').addEventListener('click', () => {
      document.getElementById('leaderboard-modal').classList.add('hidden');
    });
    document.getElementById('btn-close-board').addEventListener('click', () => {
      document.getElementById('leaderboard-modal').classList.add('hidden');
    });
    document.querySelectorAll('.board-tab').forEach(bTab => {
      bTab.addEventListener('click', (e) => {
        document.querySelectorAll('.board-tab').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.renderLeaderboard(e.target.getAttribute('data-board'));
      });
    });

    // Modals: Achievements
    document.getElementById('btn-open-achievements').addEventListener('click', () => {
      this.renderAchievementsModal();
      document.getElementById('achievements-modal').classList.remove('hidden');
    });
    document.getElementById('btn-close-achievements').addEventListener('click', () => {
      document.getElementById('achievements-modal').classList.add('hidden');
    });
    document.getElementById('btn-close-achieve').addEventListener('click', () => {
      document.getElementById('achievements-modal').classList.add('hidden');
    });
  }

  updateModeUI() {
    const classicCarousel = document.getElementById('classic-carousel');
    const featureBox = document.getElementById('mode-feature-box');
    const diffBar = document.getElementById('diff-bar');

    if (this.gameMode === 'classic') {
      classicCarousel.classList.remove('hidden');
      featureBox.classList.add('hidden');
      diffBar.classList.add('hidden');
      this.updateLevelDisplay();
    } else {
      classicCarousel.classList.add('hidden');
      featureBox.classList.remove('hidden');
      diffBar.classList.remove('hidden');

      const featureConfig = {
        survival: {
          tag: 'SURVIVAL MODE (AI-GENERATED)',
          title: 'NEURAL HORIZON RUNWAY',
          desc: 'High-speed endless runway synthesized in real-time. Obstacles shift patterns every run based on adaptive rhythm grammars.',
          bonus: '💎 Collect Cyber-Shards scattered across the tracks to upgrade abilities.'
        },
        boss: {
          tag: 'BOSS CHASE (HARDCORE)',
          title: 'CYBER-LEVIATHAN OVERDRIVE',
          desc: 'A colossal biomechanical dragon pursues you from behind firing deadly plasma beams. Maintain maximum speed and dodge incoming laser barrages.',
          bonus: '⚡ Tip: Equip the Quantum Barrier upgrade to survive sudden laser strikes!'
        },
        timeattack: {
          tag: 'TIME ATTACK MODE',
          title: 'CHRONO OVERCLOCK',
          desc: 'Race against a 45-second ticking clock at blistering velocity (24.0+ speed). Push for maximum distance and collect time shards.',
          bonus: '⏱️ High-risk, extreme reward pacing for master dashers.'
        }
      };

      const c = featureConfig[this.gameMode];
      if (c) {
        document.getElementById('mode-feature-tag').innerText = c.tag;
        document.getElementById('mode-feature-title').innerText = c.title;
        document.getElementById('mode-feature-desc').innerText = c.desc;
        document.getElementById('mode-bonus-info').innerText = c.bonus;
      }
    }
  }

  updateLevelDisplay() {
    const lvl = LEVELS[this.currentLevelIndex];
    document.getElementById('level-difficulty-tag').innerText = lvl.difficulty;
    document.getElementById('level-title').innerText = lvl.title;
    document.getElementById('level-desc').innerText = lvl.description;
    document.getElementById('level-atmo').innerText = `ATMOSPHERE: ${lvl.atmosphere.name}`;
    document.getElementById('level-best-pct').innerText = `BEST: ${this.bestScores[this.currentLevelIndex]}%`;

    this.applyAtmosphere(lvl.atmosphere);
  }

  showScreen(screenId) {
    ['menu-screen', 'death-screen', 'victory-screen', 'pause-screen'].forEach(id => {
      const el = document.getElementById(id);
      if (id === screenId) {
        el.classList.remove('hidden');
        el.classList.add('active');
      } else {
        el.classList.remove('active');
        el.classList.add('hidden');
      }
    });

    const hud = document.getElementById('hud');
    if (screenId === 'hud') {
      hud.classList.remove('hidden');
    } else {
      hud.classList.add('hidden');
    }
  }

  pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.showScreen('pause-screen');
    }
  }

  resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.showScreen('hud');
    }
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (this.state === 'MENU') {
          this.startLevel(this.currentLevelIndex);
        } else if (this.state === 'PLAYING') {
          this.jump();
        } else if (this.state === 'DEAD') {
          this.startLevel(this.currentLevelIndex);
        }
      }

      if (e.code === 'KeyR') {
        this.startLevel(this.currentLevelIndex);
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'PLAYING') this.pauseGame();
        else if (this.state === 'PAUSED') this.resumeGame();
      }
    });

    window.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.modal-card')) return;
      if (this.state === 'PLAYING') {
        this.jump();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
