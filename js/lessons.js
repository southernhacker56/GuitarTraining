'use strict';

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


// ===== LESSON PROGRESS TRACKING =====
const LESSON_PROGRESS_KEY = 'guitarlearn:completedLessons';

function getCompletedLessons() {
  try {
    const raw = JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY));
    return Array.isArray(raw) ? new Set(raw) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompletedLessons(set) {
  try {
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (e.g. private browsing) — progress just won't persist
  }
}


// ===== RENDER LESSONS =====
// onProgressChange(completedCount, totalCount) fires on render and whenever
// a lesson's completion state toggles, so callers can keep other UI in sync
// (e.g. the "Lessons" stat in the progress banner).
function renderLessons(onProgressChange) {
  const list = document.getElementById('lessonsList');
  const completed = getCompletedLessons();

  function reportProgress() {
    if (onProgressChange) onProgressChange(completed.size, LESSONS.length);
  }

  LESSONS.forEach((lesson, idx) => {
    const item = document.createElement('div');
    item.className = 'lesson-item';
    if (completed.has(idx)) item.classList.add('completed');

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'lesson-header';
    header.setAttribute('aria-expanded', 'false');
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
      <button type="button" class="lesson-complete-btn">${completed.has(idx) ? 'Completed ✓' : 'Mark as complete'}</button>
    `;

    const completeBtn = body.querySelector('.lesson-complete-btn');
    completeBtn.addEventListener('click', () => {
      if (completed.has(idx)) completed.delete(idx);
      else completed.add(idx);
      saveCompletedLessons(completed);
      item.classList.toggle('completed', completed.has(idx));
      completeBtn.textContent = completed.has(idx) ? 'Completed ✓' : 'Mark as complete';
      reportProgress();
    });

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.lesson-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.lesson-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    item.appendChild(header);
    item.appendChild(body);
    list.appendChild(item);
  });

  reportProgress();
}
