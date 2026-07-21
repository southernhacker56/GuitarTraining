'use strict';

// ===== CHORD DATA =====
// strings: [string6(low E), string5(A), string4(D), string3(G), string2(B), string1(high e)]
// -1 = muted, 0 = open, n > 0 = fret number
// barre: { fret } - full barre across all (non-muted) strings at that fret

const CHORD_DATA = {
  major: [
    { name: 'G',  strings: [3, 2, 0, 0, 0, 3] },
    { name: 'C',  strings: [-1, 3, 2, 0, 1, 0] },
    { name: 'D',  strings: [-1, -1, 0, 2, 3, 2] },
    { name: 'A',  strings: [-1, 0, 2, 2, 2, 0] },
    { name: 'E',  strings: [0, 2, 2, 1, 0, 0] },
    { name: 'F',  strings: [1, 3, 3, 2, 1, 1], barre: { fret: 1 } },
  ],
  minor: [
    { name: 'Em', strings: [0, 2, 2, 0, 0, 0] },
    { name: 'Am', strings: [-1, 0, 2, 2, 1, 0] },
    { name: 'Dm', strings: [-1, -1, 0, 2, 3, 1] },
    { name: 'Gm', strings: [3, 5, 5, 3, 3, 3], barre: { fret: 3 } },
  ],
  seventh: [
    { name: 'G7', strings: [3, 2, 0, 0, 0, 1] },
    { name: 'C7', strings: [-1, 3, 2, 3, 1, 0] },
    { name: 'D7', strings: [-1, -1, 0, 2, 1, 2] },
    { name: 'A7', strings: [-1, 0, 2, 0, 2, 0] },
    { name: 'E7', strings: [0, 2, 0, 1, 0, 0] },
    { name: 'B7', strings: [-1, 2, 1, 2, 0, 2] },
  ],
};

function countChords() {
  return Object.values(CHORD_DATA).reduce((sum, arr) => sum + arr.length, 0);
}


// ===== CHORD DIAGRAM RENDERER =====
function createChordDiagram(chord) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 110, H = 142;
  const topPad = 26;
  const sidePad = 10;
  const numFrets = 4;
  const fbW = W - 2 * sidePad;       // 90
  const fbH = H - topPad - 8;         // 108
  const strSpacing = fbW / 5;         // 18
  const fretSpacing = fbH / numFrets; // 27
  const dotR = 8.5;
  const accent = '#e8a020';
  const dimText = '#7878a0';
  const stringColor = '#666680';
  const fretColor = '#333348';

  // string 6 is index 0 (leftmost), string 1 is index 5 (rightmost)
  const strX = i => sidePad + i * strSpacing;

  // Determine startFret: find min non-zero, non-barre fret
  const startFret = 1; // all included chords start at or near fret 1

  // Center y of a finger at the given fret
  const dotY = fret => topPad + (fret - startFret + 0.5) * fretSpacing;

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  // Fret lines
  for (let f = 0; f <= numFrets; f++) {
    const y = topPad + f * fretSpacing;
    svg.appendChild(el('line', {
      x1: sidePad, y1: y, x2: sidePad + fbW, y2: y,
      stroke: fretColor, 'stroke-width': f === 0 ? '0' : '1.5',
    }));
  }

  // Nut (thick bar at top) - only draw nut if startFret is 1
  svg.appendChild(el('rect', {
    x: sidePad, y: topPad - 4,
    width: fbW, height: 5,
    rx: 2, fill: '#44445a',
  }));

  // Strings
  for (let i = 0; i < 6; i++) {
    const x = strX(i);
    // Gradually thicker from string 1 (index 5) to string 6 (index 0)
    const thickness = 0.8 + (5 - i) * 0.25;
    svg.appendChild(el('line', {
      x1: x, y1: topPad, x2: x, y2: topPad + fbH,
      stroke: stringColor, 'stroke-width': thickness,
    }));
  }

  // Barre chord bar
  if (chord.barre) {
    const fret = chord.barre.fret;
    const cy = dotY(fret);
    // Find leftmost and rightmost non-muted strings
    let leftI = 0, rightI = 5;
    while (leftI <= 5 && chord.strings[leftI] === -1) leftI++;
    while (rightI >= 0 && chord.strings[rightI] === -1) rightI--;
    const x1 = strX(leftI);
    const x2 = strX(rightI);
    svg.appendChild(el('rect', {
      x: x1 - dotR, y: cy - dotR,
      width: x2 - x1 + 2 * dotR, height: 2 * dotR,
      rx: dotR, fill: accent,
    }));
  }

  // Finger dots
  chord.strings.forEach((fret, i) => {
    if (fret <= 0) return;
    if (chord.barre && chord.barre.fret === fret) return; // covered by barre
    svg.appendChild(el('circle', {
      cx: strX(i), cy: dotY(fret), r: dotR, fill: accent,
    }));
  });

  // X / O markers above nut
  chord.strings.forEach((fret, i) => {
    const x = strX(i);
    const y = topPad - 14;
    if (fret === -1) {
      // Muted: draw X
      const s = 4.5;
      [['x1','y1','x2','y2'], ['x1','y2','x2','y1']].forEach(([a,b,c,d]) => {
        svg.appendChild(el('line', {
          x1: x - s, y1: y - s, x2: x + s, y2: y + s,
          stroke: '#e05555', 'stroke-width': '2', 'stroke-linecap': 'round',
        }));
        // second diagonal
      });
      // Redraw second diagonal explicitly
      const line2 = document.createElementNS(NS, 'line');
      line2.setAttribute('x1', x + s); line2.setAttribute('y1', y - s);
      line2.setAttribute('x2', x - s); line2.setAttribute('y2', y + s);
      line2.setAttribute('stroke', '#e05555'); line2.setAttribute('stroke-width', '2');
      line2.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line2);
    } else if (fret === 0) {
      svg.appendChild(el('circle', {
        cx: x, cy: y, r: 5,
        stroke: dimText, 'stroke-width': '1.5', fill: 'none',
      }));
    }
  });

  return svg;
}


// ===== PLAY CHORD SOUND =====
// A single shared AudioContext is reused across plays instead of creating (and
// closing) a new one per click — repeated rapid clicks previously stacked up
// contexts, which is wasteful and can hit Safari's concurrent-context limit.
let sharedChordAudioCtx = null;
function getChordAudioContext() {
  if (!sharedChordAudioCtx) {
    sharedChordAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedChordAudioCtx.state === 'suspended') {
    sharedChordAudioCtx.resume();
  }
  return sharedChordAudioCtx;
}

function playChord(chord) {
  const ctx = getChordAudioContext();
  // Open string frequencies: [E2, A2, D3, G3, B3, E4]
  const openFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
  const strumDelay = 0.038; // seconds between each string
  const noteDuration = 2.2;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.65;
  masterGain.connect(ctx.destination);

  chord.strings.forEach((fret, i) => {
    if (fret === -1) return; // muted string
    const startTime = ctx.currentTime + 0.05 + i * strumDelay;
    const freq = openFreqs[i] * Math.pow(2, fret / 12);

    // Two slightly detuned oscillators for richness
    [-3, 3].forEach(detune => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;

      filter.type = 'lowpass';
      filter.frequency.value = Math.min(freq * 5, 3500);
      filter.Q.value = 0.8;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.1);
    });
  });
}


// ===== RENDER CHORD LIBRARY =====
function renderChordLibrary(category) {
  const grid = document.getElementById('chordGrid');
  grid.innerHTML = '';
  const chords = CHORD_DATA[category] || [];
  chords.forEach(chord => {
    const card = document.createElement('div');
    card.className = 'chord-card';
    card.title = `${chord.name} chord`;
    const svg = createChordDiagram(chord);
    const nameEl = document.createElement('div');
    nameEl.className = 'chord-card-name';
    nameEl.textContent = chord.name;
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'chord-play-btn';
    playBtn.innerHTML = '&#9654;';
    playBtn.title = `Play ${chord.name}`;
    playBtn.setAttribute('aria-label', `Play ${chord.name} chord`);
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      playChord(chord);
      playBtn.classList.add('playing');
      setTimeout(() => playBtn.classList.remove('playing'), 2400);
    });
    card.appendChild(svg);
    card.appendChild(nameEl);
    card.appendChild(playBtn);
    grid.appendChild(card);
  });
}
