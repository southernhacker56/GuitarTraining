'use strict';

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
    // Reference from C4 so semitone 0 = C (index 0 in NOTE_NAMES)
    const C4 = 261.63;
    const semitones = 12 * Math.log2(freq / C4);
    const semRounded = Math.round(semitones);
    const noteIdx = ((semRounded % 12) + 12) % 12;
    const perfectFreq = C4 * Math.pow(2, semRounded / 12);
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

  function stopListening() {
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
      stopListening();
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

  // Release the mic/audio context if the tab is hidden or the page is being
  // torn down while listening, rather than leaving the stream open.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && tuner.isListening) stopListening();
  });
  window.addEventListener('pagehide', () => {
    if (tuner.isListening) tuner.stop();
  });
}
