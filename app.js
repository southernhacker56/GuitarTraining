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

// ===== LESSON DATA =====
const LESSONS = [
  {
    title: 'Getting Started',
    subtitle: 'Parts of the guitar, posture, and tuning',
    body: `Before you play a single note, you need to get comfortable holding the guitar and understand its parts. This foundation makes everything else easier.`,
    points: [
      'Sit with the guitar body resting on your right thigh (or left if left-handed). Keep your back straight.',
      'The headstock holds the tuning pegs. The neck connects it to the body. The soundhole (acoustic) or pickups (electric) are on the body.',
      'Strings are numbered 1–6. String 1 (high e) is the thinnest, String 6 (low E) is the thickest.',
      'Use a free tuning app (like GuitarTuna) to tune to standard tuning: E A D G B e.',
      'Press strings with your fingertips, not the flat of your finger — this keeps adjacent strings from buzzing.',
    ],
    tip: '<strong>Pro tip:</strong> Tune every single time before you practice. Playing in tune trains your ear from day one.',
  },
  {
    title: 'Reading Chord Diagrams',
    subtitle: 'How to interpret chord charts',
    body: `Chord diagrams are a visual map of where to place your fingers. Once you can read them, you can learn any chord.`,
    points: [
      'The diagram shows the guitar neck from the front. Vertical lines are strings (left = low E, right = high e).',
      'Horizontal lines are frets. The thick bar at the top is the nut (the end of the neck).',
      'A filled circle shows where to press down — the number inside is which finger to use (1=index, 2=middle, 3=ring, 4=pinky).',
      'An "X" above a string means don\'t play it. An "O" above means play it open (unfretted).',
      'A thick curved bar across multiple strings is a "barre" — press your index finger across all those strings.',
    ],
    tip: '<strong>Pro tip:</strong> Start with chord diagrams that have no barres and mostly open strings — like Em and Am.',
  },
  {
    title: 'Your First Two Chords: Em & Am',
    subtitle: 'The easiest chords to learn',
    body: `Em (E minor) and Am (A minor) are the best first chords because they use only 2 fingers and sound great. Together they form hundreds of songs.`,
    points: [
      'Em: Place your middle finger on the 5th string, 2nd fret. Place your ring finger on the 4th string, 2nd fret. Strum all 6 strings.',
      'Am: Place your index on the 2nd string, 1st fret. Middle on the 4th string, 2nd fret. Ring on the 3rd string, 2nd fret. Strum strings 5–1 only.',
      'Press down firmly and close to the fret (the metal strip), not on top of it.',
      'Strum slowly, checking each string rings clearly. Adjust any buzzing fingers.',
      'Practice switching between Em and Am. Do this 100 times — slow, clean, relaxed.',
    ],
    tip: '<strong>Pro tip:</strong> If your fingers hurt — that\'s normal. Calluses form in 2–3 weeks of daily practice and the pain goes away.',
  },
  {
    title: 'The G, C, and D Chords',
    subtitle: 'Three chords that unlock hundreds of songs',
    body: `G, C, and D together are the most useful combination in all of guitar. The song "Sweet Home Alabama," "Knockin\' on Heaven\'s Door," and countless pop hits use only these three.`,
    points: [
      'G chord: Ring finger on 6th string fret 3, middle on 5th string fret 2, pinky on 1st string fret 3. Strum all 6 strings.',
      'C chord: Index on 2nd string fret 1, middle on 4th string fret 2, ring on 5th string fret 3. Strum strings 5–1 only (avoid string 6).',
      'D chord: Index on 3rd string fret 2, middle on 1st string fret 2, ring on 2nd string fret 3. Strum strings 4–1 only.',
      'Practice the G → C → D → G loop. This covers a massive range of songs.',
      'Lift fingers as a unit when changing chords — try to move all fingers simultaneously.',
    ],
    tip: '<strong>Pro tip:</strong> The "anchor finger" technique: when changing between chords, if a finger stays on the same string/fret, leave it there as an anchor and only move the others.',
  },
  {
    title: 'Basic Strumming Patterns',
    subtitle: 'Rhythm, timing, and feel',
    body: `Knowing where to put your fingers is only half the battle. Strumming is what makes music feel alive. Start simple and build up.`,
    points: [
      'Always count out loud: "1, 2, 3, 4" for 4/4 time. Even pros do this when learning new rhythms.',
      'Down strums land on the beat. Up strums land on the "and" (the upbeat between beats).',
      'Pattern 1 (Beginner): D D D D — four even down strums per bar.',
      'Pattern 2 (Common): D DU DU D — where DU means down-up. Count: 1, 2-and, 3-and, 4.',
      'Keep your strumming arm loose. The motion comes from your elbow, not your wrist alone.',
      'Use a metronome — even at 60 BPM. Perfect time at slow speed is better than sloppy time at fast speed.',
    ],
    tip: '<strong>Pro tip:</strong> Keep your pick moving down AND up even on beats where you\'re muting. The consistent motion is what gives you steady rhythm.',
  },
  {
    title: 'Smooth Chord Transitions',
    subtitle: 'The secret skill that separates beginners from players',
    body: `The hardest part of learning guitar isn't making the chord shapes — it's switching between them smoothly while keeping rhythm. This is a skill you have to train deliberately.`,
    points: [
      '"One-minute changes": Set a timer for 1 minute. Pick two chords and switch between them as many times as possible. Count your switches, then try to beat your score.',
      'Do NOT stop strumming when you change chords. Keep your rhythm arm moving even if the chord isn\'t fully formed yet.',
      'Practice the chord shape before you need it. As you near the end of a bar, start moving fingers early.',
      'Common hard transitions: G to C, C to F, D to Bm. Isolate these and drill them.',
      'The "spider crawl" exercise: slowly move fingers from one chord to another, one finger at a time.',
    ],
    tip: '<strong>Pro tip:</strong> Use the Chord Progression Trainer below. Set a slow tempo and increase it only when your transitions are clean.',
  },
  {
    title: 'Power Chords',
    subtitle: 'The foundation of rock guitar',
    body: `Power chords are 2-finger chords that work on any string and sound powerful with distortion. They\'re the backbone of rock, punk, and metal.`,
    points: [
      'A power chord uses only the root note and the 5th. Example: E5 = 6th string open + 5th string fret 2.',
      'Shape: index finger on the root, ring finger (or ring + pinky) two frets up on the next string down.',
      'Move the same shape up and down the neck to play any power chord. The shape never changes.',
      'A5 = 5th string open + 4th string fret 2. G5 = 6th string fret 3 + 5th string fret 5.',
      'Mute the strings below the root with your picking-hand palm and above with your fretting-hand fingers.',
    ],
    tip: '<strong>Pro tip:</strong> Power chords are neither major nor minor — they work over both, which makes them flexible for almost any song.',
  },
  {
    title: 'Introduction to Barre Chords',
    subtitle: 'The F chord and beyond',
    body: `Barre chords are considered the biggest hurdle in beginner guitar. The F major chord is the classic example. Don't be discouraged — everyone struggles with it at first.`,
    points: [
      'A barre chord uses your index finger to press all strings across one fret, acting like a moveable capo.',
      'F major: Barre all strings at fret 1 with index finger, then form an E-shape with your remaining fingers at frets 2 and 3.',
      'Common issues: buzzing or muted strings. Fix by squeezing harder, rolling your index finger slightly toward the nut, and checking your thumb position (behind the neck, roughly behind your index).',
      'Once you can play F, you can play ANY major chord just by sliding the same shape up the neck.',
      'F at fret 1 = F. Same shape at fret 3 = G. At fret 5 = A. At fret 8 = C.',
    ],
    tip: '<strong>Pro tip:</strong> Build barre chord strength gradually — practice for 5 minutes then rest. Forcing it for too long causes tension and injury.',
  },
];

// ===== PROGRESSION DATA =====
const PROGRESSIONS = [
  { name: 'Pop Standard', chords: ['G', 'C', 'D', 'Em'] },
  { name: 'Classic Rock',  chords: ['E', 'A', 'D', 'A'] },
  { name: 'Beginner Friendly', chords: ['Em', 'Am', 'C', 'G'] },
  { name: 'Am Groove',    chords: ['Am', 'F', 'C', 'G'] },
  { name: 'Blues in E',   chords: ['E7', 'A7', 'E7', 'B7'] },
];

// ===== STRUMMING PATTERNS =====
const STRUM_PATTERNS = [
  {
    name: 'All Downstrokes',
    level: 'Beginner',
    beats: [
      { count: '1', strum: 'D' }, { count: '2', strum: 'D' },
      { count: '3', strum: 'D' }, { count: '4', strum: 'D' },
    ],
  },
  {
    name: 'Down-Up Basic',
    level: 'Beginner',
    beats: [
      { count: '1', strum: 'D' }, { count: '+', strum: 'U' },
      { count: '2', strum: 'D' }, { count: '+', strum: 'U' },
      { count: '3', strum: 'D' }, { count: '+', strum: 'U' },
      { count: '4', strum: 'D' }, { count: '+', strum: 'U' },
    ],
  },
  {
    name: 'D DU UDU',
    level: 'Intermediate',
    beats: [
      { count: '1', strum: 'D' }, { count: '2', strum: 'D' },
      { count: '+', strum: 'U' }, { count: '3', strum: 'U' },
      { count: '+', strum: 'D' }, { count: '4', strum: 'U' },
    ],
  },
  {
    name: 'Island / Reggae',
    level: 'Intermediate',
    beats: [
      { count: '1', strum: '-' }, { count: '+', strum: 'U' },
      { count: '2', strum: '-' }, { count: '+', strum: 'U' },
      { count: '3', strum: '-' }, { count: '+', strum: 'U' },
      { count: '4', strum: '-' }, { count: '+', strum: 'U' },
    ],
  },
  {
    name: 'Country Waltz (3/4)',
    level: 'Beginner',
    beats: [
      { count: '1', strum: 'D' }, { count: '2', strum: 'D' },
      { count: '+', strum: 'U' }, { count: '3', strum: 'D' },
    ],
  },
  {
    name: 'Rock Eighth Notes',
    level: 'Intermediate',
    beats: [
      { count: '1', strum: 'D' }, { count: '+', strum: 'D' },
      { count: '2', strum: 'D' }, { count: '+', strum: 'D' },
      { count: '3', strum: 'D' }, { count: '+', strum: 'D' },
      { count: '4', strum: 'D' }, { count: '+', strum: 'D' },
    ],
  },
];


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
  const activeFrets = chord.strings.filter(f => f > 0);
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
function playChord(chord) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  setTimeout(() => ctx.close(), (noteDuration + chord.strings.length * strumDelay + 0.5) * 1000);
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
    playBtn.className = 'chord-play-btn';
    playBtn.innerHTML = '&#9654;';
    playBtn.title = `Play ${chord.name}`;
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


// ===== RENDER LESSONS =====
function renderLessons() {
  const list = document.getElementById('lessonsList');
  LESSONS.forEach((lesson, idx) => {
    const item = document.createElement('div');
    item.className = 'lesson-item';

    const header = document.createElement('div');
    header.className = 'lesson-header';
    header.innerHTML = `
      <div class="lesson-num">${idx + 1}</div>
      <div class="flex-col">
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-subtitle">${lesson.subtitle}</div>
      </div>
      <div class="lesson-chevron">&#8964;</div>
    `;

    const body = document.createElement('div');
    body.className = 'lesson-body';
    const pointsHTML = lesson.points.map(p => `<li>${p}</li>`).join('');
    body.innerHTML = `
      <p>${lesson.body}</p>
      <ul class="lesson-points">${pointsHTML}</ul>
      <div class="lesson-tip">${lesson.tip}</div>
    `;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.lesson-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });

    item.appendChild(header);
    item.appendChild(body);
    list.appendChild(item);
  });
}


// ===== RENDER STRUMMING PATTERNS =====
function renderStrummingPatterns() {
  const grid = document.getElementById('patternGrid');
  STRUM_PATTERNS.forEach(pattern => {
    const card = document.createElement('div');
    card.className = 'pattern-card';
    const beatsHTML = pattern.beats.map(b => {
      const cls = b.strum === 'D' ? 'down' : b.strum === 'U' ? 'up' : 'mute';
      return `<div class="strum-beat">
        <span class="strum-count">${b.count}</span>
        <span class="strum-dir ${cls}">${b.strum === '-' ? '&#x2212;' : b.strum}</span>
      </div>`;
    }).join('');
    card.innerHTML = `
      <div class="pattern-name">${pattern.name}</div>
      <div class="pattern-display">${beatsHTML}</div>
      <div class="pattern-level">Level: ${pattern.level}</div>
    `;
    grid.appendChild(card);
  });
}


// ===== METRONOME =====
class Metronome {
  constructor() {
    this.audioCtx = null;
    this.bpm = 80;
    this.beatsPerMeasure = 4;
    this.isPlaying = false;
    this.currentBeat = 0;
    this.nextNoteTime = 0;
    this.scheduleAheadTime = 0.12;
    this.lookahead = 25;
    this.timerID = null;
    this.onBeat = null; // callback(beat)
  }

  _click(time, isAccent) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.frequency.value = isAccent ? 1200 : 880;
    gain.gain.setValueAtTime(isAccent ? 0.9 : 0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  _schedule() {
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      const beat = this.currentBeat;
      this._click(this.nextNoteTime, beat === 0);
      // Schedule UI callback slightly ahead so it fires near the beat
      const delay = Math.max(0, (this.nextNoteTime - this.audioCtx.currentTime) * 1000);
      const b = beat;
      setTimeout(() => { if (this.onBeat) this.onBeat(b); }, delay);
      this.nextNoteTime += 60.0 / this.bpm;
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
    }
    this.timerID = setTimeout(() => this._schedule(), this.lookahead);
  }

  start() {
    if (this.isPlaying) return;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.1;
    this._schedule();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerID);
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    if (this.onBeat) this.onBeat(-1); // signal stop
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.start();
    return this.isPlaying;
  }

  setBPM(bpm) { this.bpm = Math.max(20, Math.min(300, bpm)); }
  setBeatsPerMeasure(n) {
    this.beatsPerMeasure = n;
    this.currentBeat = 0;
  }
}


// ===== CHORD TRAINER =====
class ChordTrainer {
  constructor(metronome) {
    this.metro = metronome;
    this.progressionIdx = 0;
    this.beatsPerChord = 4;
    this.currentChordIdx = 0;
    this.beatCount = 0;
    this.isRunning = false;
    this.onChordChange = null;
    this.onBeatProgress = null;
  }

  get progression() {
    return PROGRESSIONS[this.progressionIdx].chords;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentChordIdx = 0;
    this.beatCount = 0;

    this.metro.beatsPerMeasure = this.beatsPerChord;
    this.metro.onBeat = (beat) => {
      if (beat === -1) { this.stop(); return; }
      this.beatCount++;
      if (this.onBeatProgress) {
        this.onBeatProgress(this.beatCount % this.beatsPerChord, this.beatsPerChord);
      }
      if (this.beatCount % this.beatsPerChord === 1 && this.beatCount > 1) {
        this.currentChordIdx = (this.currentChordIdx + 1) % this.progression.length;
        if (this.onChordChange) this.onChordChange(
          this.progression[this.currentChordIdx],
          this.progression[(this.currentChordIdx + 1) % this.progression.length]
        );
      } else if (this.beatCount === 1) {
        if (this.onChordChange) this.onChordChange(
          this.progression[0],
          this.progression[1]
        );
      }
    };

    this.metro.start();
  }

  stop() {
    this.isRunning = false;
    this.metro.onBeat = null;
    if (this.metro.isPlaying) this.metro.stop();
  }

  toggle() {
    if (this.isRunning) this.stop();
    else this.start();
    return this.isRunning;
  }
}


// ===== GUITAR TUNER =====
const TUNER_STRINGS = [
  { string: 6, note: 'E', freq: 82.41 },
  { string: 5, note: 'A', freq: 110.00 },
  { string: 4, note: 'D', freq: 146.83 },
  { string: 3, note: 'G', freq: 196.00 },
  { string: 2, note: 'B', freq: 246.94 },
  { string: 1, note: 'E', freq: 329.63 },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

class GuitarTuner {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.mediaStream = null;
    this.isListening = false;
    this.animFrame = null;
    this.buffer = null;
    this.onResult = null;
    this.onSilence = null;
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 4096;
      source.connect(this.analyser);
      this.buffer = new Float32Array(this.analyser.fftSize);
      this.isListening = true;
      this._tick();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    this.isListening = false;
    cancelAnimationFrame(this.animFrame);
    if (this.mediaStream) this.mediaStream.getTracks().forEach(t => t.stop());
    if (this.audioCtx) { this.audioCtx.close(); this.audioCtx = null; }
  }

  _tick() {
    if (!this.isListening) return;
    this.analyser.getFloatTimeDomainData(this.buffer);
    const freq = this._autoCorrelate(this.buffer, this.audioCtx.sampleRate);
    if (freq > 0) {
      if (this.onResult) this.onResult(this._freqToResult(freq));
    } else {
      if (this.onSilence) this.onSilence();
    }
    this.animFrame = requestAnimationFrame(() => this._tick());
  }

  _autoCorrelate(buf, sampleRate) {
    // RMS check — reject silence
    let rms = 0;
    for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / buf.length);
    if (rms < 0.015) return -1;

    // Clip to a zero-crossing region for stability
    const SIZE = buf.length;
    let r1 = 0, r2 = SIZE - 1;
    for (let i = 0; i < SIZE / 2; i++) { if (Math.abs(buf[i]) < 0.2) { r1 = i; break; } }
    for (let i = 1; i < SIZE / 2; i++) { if (Math.abs(buf[SIZE - i]) < 0.2) { r2 = SIZE - i; break; } }
    const sig = buf.slice(r1, r2);
    const n = sig.length;

    // Compute autocorrelation only for guitar range (60 Hz – 1200 Hz)
    const minLag = Math.floor(sampleRate / 1200);
    const maxLag = Math.min(Math.ceil(sampleRate / 60), Math.floor(n / 2));
    const corr = new Float32Array(maxLag + 1);
    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < n - lag; i++) sum += sig[i] * sig[i + lag];
      corr[lag] = sum;
    }

    // Skip initial downslope, then find tallest peak
    let d = minLag;
    while (d < maxLag - 1 && corr[d] > corr[d + 1]) d++;
    let maxVal = -Infinity, maxPos = d;
    for (let i = d; i <= maxLag; i++) {
      if (corr[i] > maxVal) { maxVal = corr[i]; maxPos = i; }
    }

    if (maxPos <= minLag || maxPos >= maxLag) return -1;
    if (maxVal < 0) return -1;

    // Parabolic interpolation for sub-sample accuracy
    const y1 = corr[maxPos - 1], y2 = corr[maxPos], y3 = corr[maxPos + 1];
    const a = (y1 + y3 - 2 * y2) / 2;
    const b = (y3 - y1) / 2;
    const refined = a !== 0 ? maxPos - b / (2 * a) : maxPos;
    return sampleRate / refined;
  }

  _freqToResult(freq) {
    const A4 = 440;
    const semitones = 12 * Math.log2(freq / A4);
    const semRounded = Math.round(semitones);
    const noteIdx = ((semRounded % 12) + 12) % 12;
    const perfectFreq = A4 * Math.pow(2, semRounded / 12);
    const cents = Math.round(1200 * Math.log2(freq / perfectFreq));

    // Find closest open guitar string
    let closestString = 1;
    let minDist = Infinity;
    TUNER_STRINGS.forEach(gs => {
      const dist = Math.abs(Math.log2(freq / gs.freq));
      if (dist < minDist) { minDist = dist; closestString = gs.string; }
    });

    return { note: NOTE_NAMES[noteIdx], cents, freq: freq.toFixed(1), closestString };
  }
}

function initTuner() {
  const tuner = new GuitarTuner();
  const toggleBtn = document.getElementById('tunerToggle');
  const noteEl = document.getElementById('tunerNote');
  const freqEl = document.getElementById('tunerFreq');
  const statusEl = document.getElementById('tunerStatus');
  const needle = document.getElementById('tunerNeedle');
  const meterBar = document.getElementById('tunerMeterBar');
  const stringDots = document.querySelectorAll('.tuner-string-dot');

  function resetDisplay() {
    noteEl.textContent = '—';
    noteEl.className = 'tuner-note';
    freqEl.textContent = '';
    statusEl.textContent = 'Listening… play an open string';
    statusEl.className = 'tuner-status';
    needle.style.left = '50%';
    needle.style.background = '';
    meterBar.classList.remove('active');
    stringDots.forEach(d => d.classList.remove('active', 'in-tune'));
  }

  tuner.onResult = ({ note, cents, freq, closestString }) => {
    const absCents = Math.abs(cents);
    const inTune = absCents <= 10;

    noteEl.textContent = note;
    noteEl.className = 'tuner-note active' + (inTune ? ' in-tune' : '');
    freqEl.textContent = `${freq} Hz`;

    // Needle: 0% = -50 cents, 50% = in tune, 100% = +50 cents
    const pct = Math.max(0, Math.min(100, ((cents + 50) / 100) * 100));
    needle.style.left = pct + '%';
    meterBar.classList.add('active');

    if (inTune) {
      needle.style.background = '#44cc77';
      statusEl.textContent = 'In Tune';
      statusEl.className = 'tuner-status in-tune';
    } else if (cents < 0) {
      needle.style.background = '#e8a020';
      statusEl.textContent = `${absCents} cents flat — tune up`;
      statusEl.className = 'tuner-status flat';
    } else {
      needle.style.background = '#e8a020';
      statusEl.textContent = `${absCents} cents sharp — tune down`;
      statusEl.className = 'tuner-status sharp';
    }

    stringDots.forEach(d => {
      const n = parseInt(d.dataset.string);
      d.classList.toggle('active', n === closestString && !inTune);
      d.classList.toggle('in-tune', n === closestString && inTune);
    });
  };

  tuner.onSilence = () => {
    needle.style.left = '50%';
    needle.style.background = '';
    meterBar.classList.remove('active');
    noteEl.className = 'tuner-note';
    stringDots.forEach(d => d.classList.remove('active', 'in-tune'));
  };

  toggleBtn.addEventListener('click', async () => {
    if (tuner.isListening) {
      tuner.stop();
      toggleBtn.textContent = 'Start Listening';
      toggleBtn.classList.remove('listening');
      noteEl.textContent = '—';
      freqEl.textContent = '';
      statusEl.textContent = 'Press "Start Listening" to begin';
      statusEl.className = 'tuner-status';
      needle.style.left = '50%';
      needle.style.background = '';
      meterBar.classList.remove('active');
      stringDots.forEach(d => d.classList.remove('active', 'in-tune'));
    } else {
      toggleBtn.textContent = 'Requesting mic…';
      toggleBtn.disabled = true;
      const ok = await tuner.start();
      toggleBtn.disabled = false;
      if (ok) {
        toggleBtn.textContent = 'Stop Listening';
        toggleBtn.classList.add('listening');
        resetDisplay();
      } else {
        statusEl.textContent = 'Microphone access denied. Please allow mic permissions and try again.';
        toggleBtn.textContent = 'Start Listening';
      }
    }
  });
}


// ===== INITIALIZE UI =====
function initUI() {
  renderLessons();
  renderChordLibrary('major');
  renderStrummingPatterns();
  initTuner();

  // Chord tabs
  document.querySelectorAll('.chord-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.chord-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderChordLibrary(tab.dataset.category);
    });
  });

  // ---- Metronome UI ----
  const metro = new Metronome();
  const bpmSlider = document.getElementById('bpmSlider');
  const bpmValue = document.getElementById('bpmValue');
  const metroToggle = document.getElementById('metronomeToggle');
  const beatDots = document.querySelectorAll('.beat-dot');
  const timeSigSelect = document.getElementById('timeSig');

  bpmSlider.addEventListener('input', () => {
    const bpm = parseInt(bpmSlider.value, 10);
    bpmValue.textContent = bpm;
    metro.setBPM(bpm);
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bpm = parseInt(btn.dataset.bpm, 10);
      bpmSlider.value = bpm;
      bpmValue.textContent = bpm;
      metro.setBPM(bpm);
    });
  });

  timeSigSelect.addEventListener('change', () => {
    const n = parseInt(timeSigSelect.value, 10);
    metro.setBeatsPerMeasure(n);
    // Update dot display
    const dotsContainer = document.getElementById('beatDots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const dot = document.createElement('span');
      dot.className = 'beat-dot';
      dot.dataset.beat = i;
      dotsContainer.appendChild(dot);
    }
  });

  metro.onBeat = (beat) => {
    if (beat === -1) {
      document.querySelectorAll('.beat-dot').forEach(d => {
        d.classList.remove('accent-beat', 'normal-beat');
      });
      return;
    }
    document.querySelectorAll('.beat-dot').forEach((dot, i) => {
      dot.classList.remove('accent-beat', 'normal-beat');
      if (i === beat) {
        dot.classList.add(beat === 0 ? 'accent-beat' : 'normal-beat');
      }
    });
  };

  metroToggle.addEventListener('click', () => {
    const playing = metro.toggle();
    metroToggle.textContent = playing ? 'Stop' : 'Start';
    metroToggle.style.background = playing ? '#e05555' : '';
    if (!playing) {
      metroToggle.style.background = '';
      document.querySelectorAll('.beat-dot').forEach(d => {
        d.classList.remove('accent-beat', 'normal-beat');
      });
    }
  });

  // ---- Chord Trainer UI ----
  const trainer = new ChordTrainer(metro);
  const progressionSelect = document.getElementById('progressionSelect');
  const beatsSlider = document.getElementById('beatsSlider');
  const beatsLabel = document.getElementById('beatsLabel');
  const currentChordName = document.getElementById('currentChordName');
  const nextChordName = document.getElementById('nextChordName');
  const beatBar = document.getElementById('beatBar');
  const trainerToggle = document.getElementById('trainerToggle');

  progressionSelect.addEventListener('change', () => {
    trainer.progressionIdx = parseInt(progressionSelect.value, 10);
  });

  beatsSlider.addEventListener('input', () => {
    const n = parseInt(beatsSlider.value, 10);
    beatsLabel.textContent = n;
    trainer.beatsPerChord = n;
    trainer.metro.setBeatsPerMeasure(n);
  });

  trainer.onChordChange = (current, next) => {
    currentChordName.textContent = current;
    nextChordName.textContent = next;
  };

  trainer.onBeatProgress = (beatInChord, total) => {
    const pct = ((beatInChord) / total) * 100;
    beatBar.style.width = pct + '%';
  };

  trainerToggle.addEventListener('click', () => {
    // If metronome is running solo, stop it first
    if (metro.isPlaying && !trainer.isRunning) metro.stop();

    const running = trainer.toggle();
    trainerToggle.textContent = running ? 'Stop Trainer' : 'Start Trainer';
    trainerToggle.style.background = running ? '#e05555' : '';

    if (!running) {
      trainerToggle.style.background = '';
      currentChordName.textContent = '—';
      nextChordName.textContent = '—';
      beatBar.style.width = '0%';
      document.querySelectorAll('.beat-dot').forEach(d => {
        d.classList.remove('accent-beat', 'normal-beat');
      });
    }

    // Sync metronome toggle button state
    metroToggle.textContent = 'Start';
    metroToggle.style.background = '';
  });
}

document.addEventListener('DOMContentLoaded', initUI);
