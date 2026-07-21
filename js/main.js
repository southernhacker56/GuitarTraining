'use strict';

// ===== SETTINGS PERSISTENCE =====
const SETTINGS_KEY = 'guitarlearn:settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSettings(patch) {
  try {
    const current = loadSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // localStorage unavailable (e.g. private browsing) — settings just won't persist
  }
}


// ===== PROGRESS BANNER STATS =====
function initStatsBanner() {
  const lessonsStat = document.getElementById('statLessons');
  const chordsStat = document.getElementById('statChords');
  const progressionsStat = document.getElementById('statProgressions');

  if (chordsStat) chordsStat.textContent = countChords();
  if (progressionsStat) progressionsStat.textContent = PROGRESSIONS.length;

  return {
    updateLessons(completedCount, total) {
      if (lessonsStat) lessonsStat.textContent = `${completedCount}/${total}`;
    },
  };
}


// ===== MOBILE NAV =====
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
    closeNav();
  });
}


// ===== INITIALIZE UI =====
function initUI() {
  const settings = loadSettings();
  const stats = initStatsBanner();

  initMobileNav();
  renderLessons((done, total) => stats.updateLessons(done, total));
  renderStrummingPatterns();
  initTuner();

  // ---- Chord library + tabs ----
  const initialCategory = CHORD_DATA[settings.chordTab] ? settings.chordTab : 'major';
  renderChordLibrary(initialCategory);

  const chordGrid = document.getElementById('chordGrid');
  const chordTabs = document.querySelectorAll('.chord-tab');
  chordTabs.forEach(tab => {
    tab.setAttribute('aria-selected', String(tab.dataset.category === initialCategory));
    tab.classList.toggle('active', tab.dataset.category === initialCategory);
  });
  if (chordGrid) {
    const activeTab = document.querySelector(`.chord-tab[data-category="${initialCategory}"]`);
    if (activeTab) chordGrid.setAttribute('aria-labelledby', activeTab.id);
  }

  chordTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chordTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      if (chordGrid) chordGrid.setAttribute('aria-labelledby', tab.id);
      renderChordLibrary(tab.dataset.category);
      saveSettings({ chordTab: tab.dataset.category });
    });
  });

  // ---- Metronome UI ----
  const metro = new Metronome();
  const bpmSlider = document.getElementById('bpmSlider');
  const bpmValue = document.getElementById('bpmValue');
  const metroToggle = document.getElementById('metronomeToggle');
  const timeSigSelect = document.getElementById('timeSig');

  const initialBpm = Math.max(40, Math.min(220, settings.bpm || 80));
  bpmSlider.value = initialBpm;
  bpmValue.textContent = initialBpm;
  metro.setBPM(initialBpm);

  const initialTimeSig = ['3', '4', '6'].includes(String(settings.timeSig)) ? String(settings.timeSig) : '4';
  timeSigSelect.value = initialTimeSig;
  metro.setBeatsPerMeasure(parseInt(initialTimeSig, 10));
  if (initialTimeSig !== '4') {
    const n = parseInt(initialTimeSig, 10);
    const dotsContainer = document.getElementById('beatDots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const dot = document.createElement('span');
      dot.className = 'beat-dot';
      dot.dataset.beat = i;
      dotsContainer.appendChild(dot);
    }
  }

  bpmSlider.addEventListener('input', () => {
    const bpm = parseInt(bpmSlider.value, 10);
    bpmValue.textContent = bpm;
    metro.setBPM(bpm);
    saveSettings({ bpm });
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bpm = parseInt(btn.dataset.bpm, 10);
      bpmSlider.value = bpm;
      bpmValue.textContent = bpm;
      metro.setBPM(bpm);
      saveSettings({ bpm });
    });
  });

  timeSigSelect.addEventListener('change', () => {
    const n = parseInt(timeSigSelect.value, 10);
    metro.setBeatsPerMeasure(n);
    saveSettings({ timeSig: timeSigSelect.value });
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

  const initialProgressionIdx = PROGRESSIONS[settings.progressionIdx] ? settings.progressionIdx : 0;
  progressionSelect.value = String(initialProgressionIdx);
  trainer.progressionIdx = initialProgressionIdx;

  const initialBeatsPerChord = Math.max(1, Math.min(8, settings.beatsPerChord || 4));
  beatsSlider.value = initialBeatsPerChord;
  beatsLabel.textContent = initialBeatsPerChord;
  trainer.beatsPerChord = initialBeatsPerChord;

  progressionSelect.addEventListener('change', () => {
    trainer.progressionIdx = parseInt(progressionSelect.value, 10);
    saveSettings({ progressionIdx: trainer.progressionIdx });
  });

  beatsSlider.addEventListener('input', () => {
    const n = parseInt(beatsSlider.value, 10);
    beatsLabel.textContent = n;
    trainer.beatsPerChord = n;
    trainer.metro.setBeatsPerMeasure(n);
    // Keep the trainer's own beat counter in sync with the metronome's reset
    // beat, otherwise the beat bar and the actual chord-change point drift
    // apart when this slider is adjusted mid-run.
    if (trainer.isRunning) trainer.beatCount = 0;
    saveSettings({ beatsPerChord: n });
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
