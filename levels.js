// Authentic Geometry Dash Level Lineup in 3D
// Modeled faithfully after official Geometry Dash rhythm levels:
// 1. STEREO MADNESS (Easy • 1★)
// 2. BACK ON TRACK (Normal • 2★ - Introduces Yellow Jump Pads)
// 3. POLARGEIST (Hard • 3★ - Introduces Jump Orbs)
// 4. DRY OUT (Harder • 4★ - Introduces Gravity Inversion Portals)
// 5. XSTEP (Insane • 5★ - Blue orbs, chained jump pads, precision aerial timing, floating spike steps)
// 6. CLUTTERFUNK (Demon • 6★ - Micro-platforms, rapid gravity flips, ceiling saws, triple spikes)

const LEVELS = [
  {
    id: 0,
    title: "STEREO MADNESS",
    difficulty: "EASY • 1★",
    theme: "neon",
    speed: 15.5,
    atmosphere: {
      name: "CYBER HORIZON",
      bgColor: 0x070b19,
      fogColor: 0x0d152d,
      fogDensity: 0.012,
      ambientColor: 0x223366,
      dirLightColor: 0x00f0ff,
      floorColor: 0x0a1024,
      gridColor: 0x00d2ff,
      cubeColor: 0x00f0ff,
      cubeGlow: 0x00a8ff,
      spikeColor: 0xff0055,
      platformColor: 0x14203d,
      padColor: 0xffbe0b,
      pinkPadColor: 0xff00aa,
      sawColor: 0xff0055,
      portalColor: 0x00ffcc,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0x00f0ff
    },
    description: "The classic introductory gauntlet. Master fundamental jump timing, single spikes, and basic 2-block elevated steps.",
    length: 500,
    elements: [
      { x: 30, type: 'spike' },
      { x: 50, type: 'spike' },
      { x: 70, type: 'double_spike' },
      { x: 92, type: 'platform', y: 1.0, length: 12 },
      { x: 104, type: 'spike', y: 2.0 },
      { x: 125, type: 'platform', y: 2.0, length: 10 },
      { x: 150, type: 'double_spike' },
      { x: 175, type: 'platform', y: 1.0, length: 8 },
      { x: 195, type: 'platform', y: 2.0, length: 10 },
      { x: 220, type: 'spike' },
      { x: 240, type: 'double_spike' },
      { x: 265, type: 'platform', y: 1.5, length: 12 },
      { x: 277, type: 'spike', y: 2.5 },
      { x: 300, type: 'triple_spike' },
      { x: 330, type: 'platform', y: 2.0, length: 14 },
      { x: 360, type: 'double_spike' },
      { x: 390, type: 'spike' },
      { x: 420, type: 'triple_spike' },
      { x: 450, type: 'spike' }
    ]
  },
  {
    id: 1,
    title: "BACK ON TRACK",
    difficulty: "NORMAL • 2★",
    theme: "neon",
    speed: 17.0,
    atmosphere: {
      name: "NEON TRANSIT",
      bgColor: 0x05131a,
      fogColor: 0x091e28,
      fogDensity: 0.013,
      ambientColor: 0x114455,
      dirLightColor: 0x00ffcc,
      floorColor: 0x081820,
      gridColor: 0x00ffa2,
      cubeColor: 0x00ffa2,
      cubeGlow: 0x00b371,
      spikeColor: 0xff0055,
      platformColor: 0x0e2832,
      padColor: 0xffbe0b,
      pinkPadColor: 0xff00aa,
      sawColor: 0xff0055,
      portalColor: 0x00ffcc,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0x00ffa2
    },
    description: "Introduces the signature Yellow Catapult Pads! High-velocity jumps over expansive multi-spike hazard beds.",
    length: 580,
    elements: [
      { x: 28, type: 'spike' },
      { x: 48, type: 'double_spike' },
      { x: 72, type: 'pad' }, // Yellow booster launch!
      { x: 86, type: 'triple_spike' }, // Clear 3 spikes
      { x: 110, type: 'platform', y: 2.0, length: 14 },
      { x: 138, type: 'pink_pad' }, // Mini hop
      { x: 148, type: 'spike' },
      { x: 170, type: 'platform', y: 1.5, length: 10 },
      { x: 195, type: 'pad' }, // Launch to high deck
      { x: 212, type: 'platform', y: 3.5, length: 16 },
      { x: 222, type: 'spike', y: 4.5 },
      { x: 245, type: 'double_spike' },
      { x: 270, type: 'pad' },
      { x: 286, type: 'triple_spike' },
      { x: 315, type: 'platform', y: 2.2, length: 12 },
      { x: 345, type: 'pink_pad' },
      { x: 356, type: 'double_spike' },
      { x: 385, type: 'pad' },
      { x: 405, type: 'platform', y: 3.2, length: 14 },
      { x: 435, type: 'triple_spike' },
      { x: 465, type: 'pad' },
      { x: 490, type: 'double_spike' },
      { x: 520, type: 'spike' }
    ]
  },
  {
    id: 2,
    title: "POLARGEIST",
    difficulty: "HARD • 3★",
    theme: "void",
    speed: 18.5,
    atmosphere: {
      name: "COSMIC POLAR",
      bgColor: 0x0c061e,
      fogColor: 0x140a32,
      fogDensity: 0.015,
      ambientColor: 0x331a66,
      dirLightColor: 0xc77dff,
      floorColor: 0x12082b,
      gridColor: 0x9d4edd,
      cubeColor: 0xe0aaff,
      cubeGlow: 0x9d4edd,
      spikeColor: 0xf72585,
      platformColor: 0x241147,
      padColor: 0xffbe0b,
      pinkPadColor: 0xff00aa,
      sawColor: 0x00f0ff,
      portalColor: 0x7209b7,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0x9d4edd
    },
    description: "Introduces aerial Jump Orbs (Rings). Time your clicks mid-flight to chain jumps across floating abyssal voids.",
    length: 660,
    elements: [
      { x: 26, type: 'spike' },
      { x: 46, type: 'double_spike' },
      { x: 68, type: 'orb', y: 2.5 }, // Mid-air ring timing
      { x: 90, type: 'platform', y: 2.0, length: 12 },
      { x: 114, type: 'pad' }, // Pad launch into orb
      { x: 130, type: 'orb', y: 4.2 },
      { x: 154, type: 'platform', y: 2.5, length: 14 },
      { x: 164, type: 'spike', y: 3.5 },
      { x: 188, type: 'triple_spike' },
      { x: 212, type: 'saw', y: 1.5 },
      { x: 232, type: 'orb', y: 2.8 },
      { x: 254, type: 'orb', y: 3.0 }, // Chained orbs
      { x: 280, type: 'platform', y: 2.0, length: 10 },
      { x: 304, type: 'pad' },
      { x: 320, type: 'orb', y: 4.5 },
      { x: 345, type: 'platform', y: 3.2, length: 16 },
      { x: 356, type: 'spike', y: 4.2 },
      { x: 382, type: 'saw', y: 2.0 },
      { x: 405, type: 'double_spike' },
      { x: 428, type: 'orb', y: 2.8 },
      { x: 452, type: 'pink_pad' },
      { x: 465, type: 'saw', y: 1.4 },
      { x: 490, type: 'platform', y: 2.0, length: 12 },
      { x: 518, type: 'pad' },
      { x: 535, type: 'orb', y: 4.0 },
      { x: 565, type: 'triple_spike' },
      { x: 595, type: 'double_spike' },
      { x: 620, type: 'spike' }
    ]
  },
  {
    id: 3,
    title: "DRY OUT",
    difficulty: "HARDER • 4★",
    theme: "inferno",
    speed: 20.0,
    atmosphere: {
      name: "SOLAR WASTES",
      bgColor: 0x1f0c05,
      fogColor: 0x301308,
      fogDensity: 0.016,
      ambientColor: 0x55220f,
      dirLightColor: 0xff6b35,
      floorColor: 0x260e06,
      gridColor: 0xff7b00,
      cubeColor: 0xffaa00,
      cubeGlow: 0xff5400,
      spikeColor: 0xff0033,
      platformColor: 0x3d170a,
      padColor: 0xffea00,
      pinkPadColor: 0xff0055,
      sawColor: 0xffea00,
      portalColor: 0x00f0ff,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0xff7b00
    },
    description: "Introduces Gravity Inversion Portals! Upside-down physics on the ceiling, inverted spikes, and reverse jump timing.",
    length: 750,
    elements: [
      { x: 26, type: 'double_spike' },
      { x: 48, type: 'saw', y: 1.4 },
      { x: 70, type: 'platform', y: 1.8, length: 12 },
      { x: 95, type: 'portal_flip', y: 2.5 }, // GRAVITY FLIP TO CEILING!
      { x: 115, type: 'spike_ceiling', y: 7.0 },
      { x: 135, type: 'saw', y: 5.4 },
      { x: 158, type: 'spike_ceiling', y: 7.0 },
      { x: 180, type: 'portal_flip', y: 5.5 }, // FLIP BACK DOWN
      { x: 202, type: 'triple_spike' },
      { x: 228, type: 'pad' },
      { x: 245, type: 'platform', y: 3.5, length: 14 },
      { x: 256, type: 'spike', y: 4.5 },
      { x: 280, type: 'saw', y: 2.2 },
      { x: 305, type: 'portal_flip', y: 2.5 }, // INVERT 2
      { x: 325, type: 'saw', y: 5.2 },
      { x: 348, type: 'spike_ceiling', y: 7.0 },
      { x: 372, type: 'portal_flip', y: 5.5 }, // DOWN
      { x: 395, type: 'triple_spike' },
      { x: 420, type: 'pink_pad' },
      { x: 432, type: 'saw', y: 1.4 },
      { x: 456, type: 'platform', y: 2.2, length: 12 },
      { x: 482, type: 'pad' },
      { x: 500, type: 'orb', y: 4.2 },
      { x: 525, type: 'saw', y: 2.5 },
      { x: 550, type: 'portal_flip', y: 2.2 }, // INVERT 3
      { x: 572, type: 'spike_ceiling', y: 7.0 },
      { x: 595, type: 'portal_flip', y: 5.5 }, // DOWN
      { x: 620, type: 'triple_spike' },
      { x: 650, type: 'platform', y: 2.0, length: 12 },
      { x: 680, type: 'double_spike' },
      { x: 710, type: 'spike' }
    ]
  },
  {
    id: 4,
    title: "xSTEP",
    difficulty: "INSANE • 5★",
    theme: "void",
    speed: 22.0,
    atmosphere: {
      name: "NEBULA X-DIMENSION",
      bgColor: 0x050112,
      fogColor: 0x0a0224,
      fogDensity: 0.018,
      ambientColor: 0x2c0652,
      dirLightColor: 0x7209b7,
      floorColor: 0x0a031e,
      gridColor: 0xb5179e,
      cubeColor: 0x00f0ff,
      cubeGlow: 0x7209b7,
      spikeColor: 0xf72585,
      platformColor: 0x1f083d,
      padColor: 0xffbe0b,
      pinkPadColor: 0xff00aa,
      sawColor: 0x4cc9f0,
      portalColor: 0x7209b7,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0xb5179e
    },
    description: "The legendary xStep experience! Blue Gravity Orbs, staircased micro-platforms, razor buzzsaw gauntlets, and rapid chained launch pads.",
    length: 880,
    elements: [
      { x: 26, type: 'double_spike' },
      { x: 46, type: 'platform', y: 1.2, length: 6 },
      { x: 58, type: 'platform', y: 2.4, length: 6 }, // Stair stepping
      { x: 70, type: 'platform', y: 3.6, length: 6 },
      { x: 86, type: 'saw', y: 4.8 },
      { x: 104, type: 'blue_orb', y: 3.2 }, // BLUE ORB: Flips gravity in mid-air!
      { x: 126, type: 'spike_ceiling', y: 7.0 },
      { x: 148, type: 'blue_orb', y: 5.0 }, // Flips gravity back down!
      { x: 172, type: 'triple_spike' },
      { x: 196, type: 'pad' }, // Yellow catapult
      { x: 212, type: 'pad' }, // Chained catapult!
      { x: 234, type: 'platform', y: 4.2, length: 12 },
      { x: 242, type: 'spike', y: 5.0 },
      { x: 264, type: 'saw', y: 3.5 },
      { x: 286, type: 'orb', y: 2.8 },
      { x: 308, type: 'platform', y: 1.8, length: 8 },
      { x: 326, type: 'pink_pad' },
      { x: 338, type: 'saw', y: 2.0 },
      { x: 360, type: 'portal_flip', y: 2.5 }, // Full inversion gate
      { x: 382, type: 'spike_ceiling', y: 7.0 },
      { x: 404, type: 'saw', y: 5.2 },
      { x: 426, type: 'blue_orb', y: 5.2 },
      { x: 450, type: 'triple_spike' },
      { x: 476, type: 'platform', y: 2.2, length: 10 },
      { x: 502, type: 'pad' },
      { x: 518, type: 'orb', y: 4.2 },
      { x: 542, type: 'saw', y: 2.4 },
      { x: 566, type: 'quad_spike' }, // 4 SPIKES!
      { x: 596, type: 'platform', y: 1.5, length: 6 },
      { x: 608, type: 'platform', y: 2.8, length: 6 },
      { x: 620, type: 'platform', y: 4.0, length: 8 },
      { x: 638, type: 'saw', y: 5.2 },
      { x: 660, type: 'blue_orb', y: 3.5 },
      { x: 684, type: 'portal_flip', y: 5.5 },
      { x: 710, type: 'triple_spike' },
      { x: 736, type: 'pink_pad' },
      { x: 748, type: 'saw', y: 1.4 },
      { x: 772, type: 'platform', y: 2.0, length: 12 },
      { x: 800, type: 'pad' },
      { x: 820, type: 'quad_spike' },
      { x: 850, type: 'double_spike' }
    ]
  },
  {
    id: 5,
    title: "CLUTTERFUNK",
    difficulty: "DEMON • 6★",
    theme: "inferno",
    speed: 24.0,
    atmosphere: {
      name: "CORE OVERDRIVE",
      bgColor: 0x140302,
      fogColor: 0x220503,
      fogDensity: 0.02,
      ambientColor: 0x3d0a04,
      dirLightColor: 0xff3c00,
      floorColor: 0x1a0604,
      gridColor: 0xff5400,
      cubeColor: 0xffaa00,
      cubeGlow: 0xff3700,
      spikeColor: 0xff0033,
      platformColor: 0x300c06,
      padColor: 0xffea00,
      pinkPadColor: 0xff0055,
      sawColor: 0xffea00,
      portalColor: 0x00f0ff,
      orbColor: 0xffd166,
      blueOrbColor: 0x00d4ff,
      skyParticles: 0xff5400
    },
    description: "Maximum rhythmic brutality. 24.0 speed demon run: quad spikes, micro stepping blocks, rotating saws on ceilings, and instant gravity shifts.",
    length: 1000,
    elements: [
      { x: 25, type: 'triple_spike' },
      { x: 48, type: 'saw', y: 1.2 },
      { x: 68, type: 'platform', y: 1.5, length: 5 },
      { x: 78, type: 'pink_pad', y: 1.5 },
      { x: 92, type: 'saw', y: 2.8 },
      { x: 110, type: 'pad' },
      { x: 125, type: 'quad_spike' },
      { x: 152, type: 'blue_orb', y: 3.2 }, // INSTANT GRAVITY FLIP
      { x: 174, type: 'spike_ceiling', y: 7.0 },
      { x: 196, type: 'saw', y: 5.2 },
      { x: 218, type: 'blue_orb', y: 5.2 }, // FLIP DOWN
      { x: 242, type: 'quad_spike' },
      { x: 270, type: 'platform', y: 2.2, length: 8 },
      { x: 288, type: 'pad' },
      { x: 304, type: 'pad' }, // Chained boost
      { x: 326, type: 'platform', y: 4.5, length: 12 },
      { x: 334, type: 'saw', y: 5.6 },
      { x: 358, type: 'orb', y: 3.5 },
      { x: 382, type: 'portal_flip', y: 2.2 },
      { x: 404, type: 'spike_ceiling', y: 7.0 },
      { x: 426, type: 'saw', y: 5.0 },
      { x: 448, type: 'spike_ceiling', y: 7.0 },
      { x: 472, type: 'portal_flip', y: 5.5 },
      { x: 496, type: 'quad_spike' },
      { x: 524, type: 'platform', y: 1.8, length: 6 },
      { x: 538, type: 'platform', y: 3.2, length: 6 },
      { x: 554, type: 'saw', y: 4.4 },
      { x: 576, type: 'blue_orb', y: 3.0 },
      { x: 600, type: 'saw', y: 5.5 },
      { x: 624, type: 'blue_orb', y: 5.0 },
      { x: 650, type: 'quad_spike' },
      { x: 678, type: 'pad' },
      { x: 696, type: 'orb', y: 4.2 },
      { x: 720, type: 'saw', y: 2.2 },
      { x: 746, type: 'platform', y: 2.0, length: 10 },
      { x: 772, type: 'triple_spike' },
      { x: 800, type: 'pink_pad' },
      { x: 812, type: 'saw', y: 1.5 },
      { x: 836, type: 'pad' },
      { x: 856, type: 'quad_spike' },
      { x: 890, type: 'platform', y: 3.0, length: 12 },
      { x: 920, type: 'triple_spike' },
      { x: 955, type: 'spike' }
    ]
  }
];

/**
 * AI-Assisted Procedural Obstacle & Vibe Generator
 * Generates dynamic, beat-aware rhythm chunks using heuristic Grammars & AI Pattern Synthesis
 */
class AIObstacleGenerator {
  constructor() {
    this.rhythmGrammars = [
      // Rhythm Cadence 1: Pad Vault (Launch -> high platform -> precision landing)
      {
        name: 'Launch Vault',
        difficulty: 1,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'pad' });
          elements.push({ x: startX + 14, type: 'platform', y: 3.2, length: 12 });
          if (diffMod > 1.2) {
            elements.push({ x: startX + 20, type: 'spike', y: 4.2 });
          }
          elements.push({ x: startX + 18, type: 'coin', y: 4.5 });
          elements.push({ x: startX + 32, type: 'spike' });
          return { elements, length: 42 };
        }
      },
      // Rhythm Cadence 2: Aerial Ring Chain (Orb -> Orb -> Safe Step)
      {
        name: 'Orb Melody',
        difficulty: 2,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'spike' });
          elements.push({ x: startX + 10, type: 'orb', y: 2.8 });
          elements.push({ x: startX + 22, type: 'coin', y: 3.2 });
          if (diffMod > 1.3) {
            elements.push({ x: startX + 20, type: 'saw', y: 1.2 });
          }
          elements.push({ x: startX + 32, type: 'orb', y: 3.2 });
          elements.push({ x: startX + 44, type: 'platform', y: 1.8, length: 10 });
          elements.push({ x: startX + 49, type: 'coin', y: 2.8 });
          return { elements, length: 58 };
        }
      },
      // Rhythm Cadence 3: Inversion Flip Warp (Portal -> Ceiling Hazard -> Return)
      {
        name: 'Dimension Rift',
        difficulty: 3,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'portal_flip', y: 3.0 });
          elements.push({ x: startX + 12, type: 'spike_ceiling', y: 7.0 });
          elements.push({ x: startX + 18, type: 'coin', y: 6.2 });
          elements.push({ x: startX + 28, type: 'saw', y: 5.2 });
          elements.push({ x: startX + 38, type: 'portal_flip', y: 5.0 });
          elements.push({ x: startX + 48, type: 'triple_spike' });
          return { elements, length: 58 };
        }
      },
      // Rhythm Cadence 4: Razor Cascade (Alternating saws and micro hops)
      {
        name: 'Razor Cascade',
        difficulty: 2,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'pink_pad' });
          elements.push({ x: startX + 10, type: 'saw', y: 1.2 });
          elements.push({ x: startX + 18, type: 'coin', y: 2.2 });
          elements.push({ x: startX + 24, type: 'double_spike' });
          elements.push({ x: startX + 36, type: 'pink_pad' });
          elements.push({ x: startX + 46, type: 'saw', y: 1.4 });
          return { elements, length: 54 };
        }
      },
      // Rhythm Cadence 5: Blue Orb Zero-G Shift (Airborne mid-air tap to invert)
      {
        name: 'Antigravity Jump',
        difficulty: 3,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'pad' });
          elements.push({ x: startX + 14, type: 'blue_orb', y: 3.5 });
          elements.push({ x: startX + 20, type: 'spike_ceiling', y: 7.0 });
          elements.push({ x: startX + 26, type: 'coin', y: 5.5 });
          elements.push({ x: startX + 34, type: 'blue_orb', y: 5.2 });
          elements.push({ x: startX + 46, type: 'platform', y: 1.5, length: 12 });
          return { elements, length: 62 };
        }
      },
      // Rhythm Cadence 6: Classic Gauntlet (Single / Double / Triple spikes with reward arcs)
      {
        name: 'Precision Strides',
        difficulty: 1,
        build: (startX, diffMod) => {
          const elements = [];
          elements.push({ x: startX, type: 'spike' });
          elements.push({ x: startX + 5, type: 'coin', y: 1.8 });
          elements.push({ x: startX + 16, type: diffMod > 1.4 ? 'triple_spike' : 'double_spike' });
          elements.push({ x: startX + 28, type: 'pink_pad' });
          elements.push({ x: startX + 38, type: 'double_spike' });
          elements.push({ x: startX + 44, type: 'coin', y: 2.2 });
          return { elements, length: 50 };
        }
      }
    ];
  }

  // Generate a procedural seed-based or dynamic endless run
  generateLevel({ mode = 'survival', difficulty = 'NORMAL', seed = null, length = 800 }) {
    const diffMultipliers = {
      'EASY': 0.85,
      'NORMAL': 1.0,
      'HARD': 1.35,
      'INSANE': 1.7
    };
    const diffMod = diffMultipliers[difficulty] || 1.0;
    const speed = (mode === 'timeattack' ? 22.0 : 17.5) * (0.9 + diffMod * 0.15);

    let curX = 35;
    const elements = [];
    let chunkCount = 0;

    // AI Pattern Synthesis Loop
    while (curX < length - 60) {
      // Filter grammars by difficulty
      let pool = this.rhythmGrammars.filter(g => {
        if (diffMod < 1.0) return g.difficulty <= 2;
        if (diffMod < 1.4) return g.difficulty <= 3;
        return true;
      });

      // AI procedural selection: avoid identical back-to-back patterns
      const grammar = pool[Math.floor(Math.random() * pool.length)];
      const chunk = grammar.build(curX, diffMod);

      chunk.elements.forEach(el => elements.push(el));
      curX += chunk.length + (Math.random() * 8 + 6) / diffMod;
      chunkCount++;
    }

    // Pick dynamic atmosphere
    const atmoThemes = [
      {
        name: "NEO MATRIX OVERDRIVE",
        bgColor: 0x05131a,
        fogColor: 0x091e28,
        fogDensity: 0.013,
        ambientColor: 0x114455,
        dirLightColor: 0x00ffcc,
        floorColor: 0x081820,
        gridColor: 0x00ffa2,
        cubeColor: 0x00ffa2,
        cubeGlow: 0x00b371,
        spikeColor: 0xff0055,
        platformColor: 0x0e2832,
        padColor: 0xffbe0b,
        pinkPadColor: 0xff00aa,
        sawColor: 0xff0055,
        portalColor: 0x00ffcc,
        orbColor: 0xffd166,
        blueOrbColor: 0x00d4ff,
        skyParticles: 0x00ffa2,
        musicTheme: 'neon'
      },
      {
        name: "CYBER VOID RUNWAY",
        bgColor: 0x0d061f,
        fogColor: 0x140a32,
        fogDensity: 0.015,
        ambientColor: 0x331a66,
        dirLightColor: 0xc77dff,
        floorColor: 0x12082b,
        gridColor: 0x9d4edd,
        cubeColor: 0xe0aaff,
        cubeGlow: 0x9d4edd,
        spikeColor: 0xf72585,
        platformColor: 0x241147,
        padColor: 0xffbe0b,
        pinkPadColor: 0xff00aa,
        sawColor: 0x00f0ff,
        portalColor: 0x7209b7,
        orbColor: 0xffd166,
        blueOrbColor: 0x00d4ff,
        skyParticles: 0x9d4edd,
        musicTheme: 'void'
      },
      {
        name: "SOLAR INFERNO CHASE",
        bgColor: 0x180402,
        fogColor: 0x240604,
        fogDensity: 0.018,
        ambientColor: 0x470c06,
        dirLightColor: 0xff3c00,
        floorColor: 0x1a0604,
        gridColor: 0xff5400,
        cubeColor: 0xffaa00,
        cubeGlow: 0xff3700,
        spikeColor: 0xff0033,
        platformColor: 0x300c06,
        padColor: 0xffea00,
        pinkPadColor: 0xff0055,
        sawColor: 0xffea00,
        portalColor: 0x00f0ff,
        orbColor: 0xffd166,
        blueOrbColor: 0x00d4ff,
        skyParticles: 0xff5400,
        musicTheme: mode === 'boss' ? 'boss' : 'inferno'
      }
    ];

    const atmoIndex = mode === 'boss' ? 2 : (mode === 'timeattack' ? 0 : Math.floor(Math.random() * atmoThemes.length));
    const selectedAtmo = atmoThemes[atmoIndex];

    return {
      title: mode === 'boss' ? 'BOSS CHASE: CYBER-LEVIATHAN' : (mode === 'timeattack' ? 'TIME ATTACK CHRONO' : 'PROCEDURAL SURVIVAL'),
      difficulty: `${difficulty} • AI RUN`,
      theme: selectedAtmo.musicTheme,
      speed: speed,
      atmosphere: selectedAtmo,
      description: `AI Procedural run synthesized with ${chunkCount} rhythm obstacle cadences. Adapts each launch!`,
      length: length,
      elements: elements
    };
  }
}

window.LEVELS = LEVELS;
window.aiObstacleGenerator = new AIObstacleGenerator();
