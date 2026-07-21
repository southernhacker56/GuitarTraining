'use strict';

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
