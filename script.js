/**
 * PALAK'S BIRTHDAY MISSION - SCRIPT
 * Mobile-First, Android-Optimized, Web Audio Synthesizer, Confetti & Interactive Flow
 */

document.addEventListener('DOMContentLoaded', () => {


  
  // =========================================================================
  // 1. SOUND SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL AUDIO DEPENDENCIES)
  // =========================================================================
  class BirthdayAudio {
    constructor() {
      this.ctx = null;
      this.isPlayingBgm = false;
      this.bgmTimer = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // 1. Custom Biometric Authentication Sound (MP3)
    playScanPulse() {
      this.init();
      try {
        const authAudio = new Audio('assets/auth_sound.mp3');
        authAudio.volume = 0.5;
        authAudio.play().catch(() => {});
      } catch (e) {}
    }

    // 2. Custom Correct Answer Sound (MP3)
    playCorrectChime() {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
        });
    }

    playQuizRightSound() {
      this.init();
      try {
        const rightAudio = new Audio('assets/right_sound.mp3');
        rightAudio.volume = 0.65;
        rightAudio.play().catch(() => {});
      } catch (e) {}
    }

    // Plays ONLY on Q&A Question 4 (Final Question)
    playQuizFinalSound() {
      this.init();
      try {
        const finalAudio = new Audio('assets/final_correct_sound.mp3');
        finalAudio.volume = 0.75;
        finalAudio.play().catch(() => {});
      } catch (e) {}
    }

    // 3. Custom Wrong Answer Sound (MP3)
    playWrongBuzzer() {
      this.init();
      try {
        const wrongAudio = new Audio('assets/wrong_sound.mp3');
        wrongAudio.volume = 0.6;
        wrongAudio.play().catch(() => {});
      } catch (e) {}
    }

    // (Keep your existing playPuff, playFanfare, startBGM, and stopBGM methods below this)
    // Candle Puff Sound (Gentle Pink/White Noise)
    playPuff() {
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    }

    // Fanfare Arpeggio
    playFanfare() {
      this.init();
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.5);
      });
    }

    // Cheerful Gentle Birthday Music Box BGM Loop
    toggleBGM(onPlayStateChange) {
      this.init();
      if (this.isPlayingBgm) {
        this.stopBGM();
        onPlayStateChange(false);
      } else {
        this.startBGM();
        onPlayStateChange(true);
      }
    }

    startBGM() {
      if (this.isPlayingBgm) return;
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlayingBgm = true;

      // 1. Try playing the custom song (assets/vault_bgm.mp3) if you saved it in assets/
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio('assets/vault_bgm.mp3');
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.45;
      }

      this.bgmAudio.play().catch(() => {
        // 2. Built-in Peaceful, Sweet & Dreamy Music-Box Lullaby (if no mp3 file is in assets/)
        this.playSweetLullabyLoop();
      });
    }

    playSweetLullabyLoop() {
      if (!this.isPlayingBgm) return;

      // Peaceful, warm, slow-tempo music box & soft pad notes (F Major -> C Major -> Dm -> Bb)
      // Sounds like an emotional anime / music-box ending theme
      const sweetChords = [
        { melody: 523.25, bass: 174.61, fifth: 261.63, d: 1.4 }, // C5 over F
        { melody: 587.33, bass: 261.63, fifth: 329.63, d: 1.2 }, // D5 over F/A
        { melody: 659.25, bass: 130.81, fifth: 196.00, d: 1.6 }, // E5 over C
        { melody: 523.25, bass: 196.00, fifth: 246.94, d: 1.4 }, // C5 gentle breath
        { melody: 698.46, bass: 146.83, fifth: 220.00, d: 1.5 }, // F5 over Dm
        { melody: 659.25, bass: 220.00, fifth: 261.63, d: 1.3 }, // E5 soft step
        { melody: 587.33, bass: 116.54, fifth: 174.61, d: 1.6 }, // D5 over Bb
        { melody: 523.25, bass: 130.81, fifth: 196.00, d: 2.2 }, // C5 warm resolution
        { melody: 440.00, bass: 174.61, fifth: 220.00, d: 1.4 }, // A4 tender note
        { melody: 523.25, bass: 220.00, fifth: 261.63, d: 1.4 }, // C5 rising
        { melody: 587.33, bass: 146.83, fifth: 220.00, d: 1.6 }, // D5 heartfelt
        { melody: 523.25, bass: 174.61, fifth: 261.63, d: 2.6 }  // C5 peaceful hold
      ];

      let stepIndex = 0;

      const playNextChord = () => {
        if (!this.isPlayingBgm) return;
        const now = this.ctx.currentTime;
        const step = sweetChords[stepIndex];

        // A. Warm, soft underlying pad (Sine wave with gentle fade-in and long fade-out)
        [step.bass, step.fifth].forEach((freq) => {
          const padOsc = this.ctx.createOscillator();
          const padGain = this.ctx.createGain();
          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq, now);

          padGain.gain.setValueAtTime(0.001, now);
          padGain.gain.linearRampToValueAtTime(0.035, now + 0.35);
          padGain.gain.exponentialRampToValueAtTime(0.0008, now + step.d * 1.4);

          padOsc.connect(padGain);
          padGain.connect(this.ctx.destination);
          padOsc.start(now);
          padOsc.stop(now + step.d * 1.45);
        });

        // B. Delicate Music-Box Bell Note (Pure sine with soft chime harmonic)
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(step.melody, now);

        bellGain.gain.setValueAtTime(0.001, now);
        bellGain.gain.linearRampToValueAtTime(0.055, now + 0.06);
        bellGain.gain.exponentialRampToValueAtTime(0.0008, now + step.d * 1.3);

        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx.destination);
        bellOsc.start(now);
        bellOsc.stop(now + step.d * 1.35);

        stepIndex = (stepIndex + 1) % sweetChords.length;
        this.bgmTimer = setTimeout(playNextChord, step.d * 1000);
      };

      playNextChord();
    }

    stopBGM() {
      this.isPlayingBgm = false;
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  const audio = new BirthdayAudio();

  // BGM Button Setup
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  musicToggleBtn.addEventListener('click', () => {
    audio.toggleBGM((isPlaying) => {
      if (isPlaying) {
        musicToggleBtn.classList.add('playing');
      } else {
        musicToggleBtn.classList.remove('playing');
      }
    });
  });

  // Haptic Feedback Helper
  function haptic(pattern) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Safe fail
      }
    }
  }

  // Safe Confetti Blast
  function fireConfetti(opts = {}) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: opts.count || 55,
        spread: opts.spread || 60,
        origin: opts.origin || { y: 0.65 },
        colors: ['#EC4899', '#F59E0B', '#FDE047', '#3B82F6', '#10B981'],
        disableForReducedMotion: true
      });
    }
  }

  // Ambient Sparkles Generator
  const sparklesBg = document.getElementById('sparkles-bg');
  if (sparklesBg) {
    const symbols = ['✦', '✨', '⋆', '💖', '★'];
    for (let i = 0; i < 18; i++) {
      const sp = document.createElement('div');
      sp.className = 'bg-sparkle';
      sp.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      sp.style.left = `${Math.random() * 96}%`;
      sp.style.top = `${Math.random() * 94}%`;
      sp.style.animationDelay = `${Math.random() * 4}s`;
      sp.style.animationDuration = `${2.5 + Math.random() * 3}s`;
      sparklesBg.appendChild(sp);
    }
  }


  // =========================================================================
  // 2. SCREEN ROUTING & NAVIGATION MANAGEMENT
  // =========================================================================
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    quiz: document.getElementById('screen-quiz'),
    verified: document.getElementById('screen-verified'),
    evolution: document.getElementById('screen-evolution'),
    vault: document.getElementById('screen-vault')
  };

  const navTabs = document.querySelectorAll('.nav-tab-item');
  const navLockToast = document.getElementById('navLockToast');
  let navToastTimer = null;

  // Clear any legacy localStorage or sessionStorage that permanently bypassed the locks
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) { }

  // Strict First-Time Progression State (Per Visit)
  // Initially only screen-welcome is unlocked.
  // Quiz unlocks after Biometric scan.
  // Evolution unlocks after Quiz is completed.
  // Vault unlocks after Evolution is completed.
  // Once the Vault is reached (all options done), hasCompletedAll becomes true and all tabs are unlocked!
  let hasCompletedAll = false;
  let unlockedScreens = new Set(['screen-welcome']);

  function showNavToast(text) {
    if (!navLockToast) return;
    navLockToast.textContent = text;
    navLockToast.classList.add('show');
    if (navToastTimer) clearTimeout(navToastTimer);
    navToastTimer = setTimeout(() => {
      navLockToast.classList.remove('show');
    }, 2500);
  }

  function updateNavTabsUI() {
    navTabs.forEach(tab => {
      const target = tab.dataset.target;
      if (hasCompletedAll || unlockedScreens.has(target)) {
        tab.classList.remove('locked');
      } else {
        tab.classList.add('locked');
      }
    });
  }

  function unlockStage(screenId) {
    unlockedScreens.add(screenId);

    // When Vault is reached, the user has completed all the options!
    if (screenId === 'screen-vault') {
      hasCompletedAll = true;
    }

    const tab = document.querySelector(`.nav-tab-item[data-target="${screenId}"]`);
    if (tab) {
      tab.classList.remove('locked');
      tab.classList.add('just-unlocked');
      setTimeout(() => tab.classList.remove('just-unlocked'), 700);
    }

    updateNavTabsUI();
  }

  function showScreen(screenId) {
    // Strict Guard: Prevent jumping to locked screens unless completed
    if (screenId !== 'screen-welcome' && screenId !== 'screen-verified') {
      if (!hasCompletedAll && !unlockedScreens.has(screenId)) {
        return false;
      }
    }

    Object.values(screens).forEach(sc => {
      if (sc) sc.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync Bottom Navigation
    navTabs.forEach(tab => {
      const tabTarget = tab.dataset.target;
      if (tabTarget === screenId || (screenId === 'screen-verified' && tabTarget === 'screen-quiz')) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Special screen activations
    if (screenId === 'screen-verified') {
      fireConfetti({ count: 70, spread: 80 });
      audio.playFanfare();
      haptic([50, 100, 50, 150]);
    }

    // Always automatic sound ON when user is on the last page (The Secret Vault)
    if (screenId === 'screen-vault') {
      audio.init();
      audio.startBGM();
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('playing');
      }
    }
  }

  // Backup fallback: First interaction anywhere on Vault guarantees sound starts
  if (screens.vault) {
    screens.vault.addEventListener('pointerdown', () => {
      if (!audio.isPlayingBgm) {
        audio.init();
        audio.startBGM();
        if (musicToggleBtn) {
          musicToggleBtn.classList.add('playing');
        }
      }
    }, { passive: true });
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetScreen = tab.dataset.target;
      audio.init();

      // Check if unlocked
      const isAllowed = hasCompletedAll || unlockedScreens.has(targetScreen);

      if (!isAllowed) {
        // Tab is strictly locked on first playthrough! Reject with animation, buzzer, haptics and toast
        tab.classList.remove('shake-btn');
        void tab.offsetWidth; // Force reflow
        tab.classList.add('shake-btn');
        setTimeout(() => tab.classList.remove('shake-btn'), 500);

        audio.playWrongBuzzer();
        haptic([70, 40, 70]);

        let msg = '🔒 Complete the previous stage first!';
        if (targetScreen === 'screen-quiz') {
          msg = '🔒 Complete Doraemon Security Check (Step 1) first!';
        } else if (targetScreen === 'screen-evolution') {
          msg = '🔒 Solve all 4 Interrogation Quiz questions first!';
        } else if (targetScreen === 'screen-vault') {
          msg = '🔒 Complete Palak\'s Evolution (Stage 4) to unlock the Vault!';
        }

        showNavToast(msg);
        return false;
      }

      showScreen(targetScreen);
    });
  });

  // Initial UI state sync for navigation tabs
  updateNavTabsUI();


  // =========================================================================
  // 3. ACT 0: BIOMETRIC SCANNER LOGIC
  // =========================================================================
  const fingerprintBtn = document.getElementById('fingerprintBtn');
  const scanProgressFill = document.getElementById('scanProgressFill');
  const scanProgressBar = document.querySelector('.scan-progress-bar');
  const scanHint = document.getElementById('scanHint');
  const startMissionBtn = document.getElementById('startMissionBtn');

  let scanProgress = 0;
  let scanInterval = null;
  let isScanning = false;

  function startScanning() {
    if (isScanning) return;
    isScanning = true;
    audio.init();
    audio.playScanPulse();
    haptic([30, 40]);

    fingerprintBtn.classList.add('scanning');
    scanProgressBar.classList.add('active');
    scanHint.textContent = 'Calibrating Palak heartbeat... 💖';
    scanHint.style.color = 'var(--primary-pink)';

    scanInterval = setInterval(() => {
      scanProgress += 6.5;
      scanProgressFill.style.width = `${Math.min(scanProgress, 100)}%`;
      audio.playScanPulse();
      haptic([25]);

      if (scanProgress >= 100) {
        finishScanSuccess();
      }
    }, 60);
  }

  function stopScanning() {
    if (!isScanning) return;
    if (scanProgress < 100) {
      clearInterval(scanInterval);
      isScanning = false;
      scanProgress = 0;
      scanProgressFill.style.width = '0%';
      fingerprintBtn.classList.remove('scanning');
      scanProgressBar.classList.remove('active');
      scanHint.textContent = 'Hold to calibrate birthday pulse ✨';
      scanHint.style.color = 'var(--text-muted)';
    }
  }

  function finishScanSuccess() {
    clearInterval(scanInterval);
    isScanning = false;
    fingerprintBtn.classList.remove('scanning');
    fingerprintBtn.style.borderColor = '#10B981';
    fingerprintBtn.style.boxShadow = '0 0 35px rgba(16, 185, 129, 0.6)';
    scanHint.textContent = 'Doraemon: Clearance Approved! Welcome Palak! 🔓✨';
    scanHint.style.color = '#10B981';

    audio.playCorrectChime();
    haptic([40, 80, 50, 150]);
    fireConfetti({ count: 65, spread: 75 });

    setTimeout(() => {
      unlockStage('screen-quiz');
      showScreen('screen-quiz');
    }, 700);
  }

  // Pointer & Touch Events for Hold-to-scan
  fingerprintBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startScanning();
  });
  fingerprintBtn.addEventListener('pointerup', stopScanning);
  fingerprintBtn.addEventListener('pointerleave', stopScanning);
  fingerprintBtn.addEventListener('pointercancel', stopScanning);

  startMissionBtn.addEventListener('click', () => {
    startScanning();
    setTimeout(() => {
      if (scanProgress < 100) {
        scanProgress = 100;
        scanProgressFill.style.width = '100%';
        finishScanSuccess();
      }
    }, 350);
  });


  // =========================================================================
  // 4. ACT 1: INTERROGATION QUIZ (4 QUESTIONS, 4 MCQS EACH)
  // =========================================================================
  const quizQuestions = [
    {
      id: 1,
      exhibit: "EXHIBIT A",
      verdictTag: "⚡ CRITICAL EVIDENCE",
      question: "What is Palak's exact mental state during exam prep?",
      inspectorLine: "Inspector Doraemon: \"Palak, sach sach batao! What is the true study secret?\" 🔍",
      options: [
        {
          letter: "A",
          text: "Peacefully sipping green tea while highlighting Polity 📖",
          isCorrect: false,
          feedback: "WRONG! Nobody reads Laxmikanth calmly like a bedtime story. 🤡"
        },
        {
          letter: "B",
          text: "Drinking 14 cups of chai and aggressively arguing with syllabus ☕",
          isCorrect: false,
          feedback: "Close! But you know your true ultimate escape strategy is bolder! ☕"
        },
        {
          letter: "C",
          text: "Threatening to abandon society & become a Himalayan monk 🏔️",
          isCorrect: true,
          feedback: "CORRECT! Packing bags for the Himalayas every Tuesday! 🏔️🧘‍♀️"
        },
        {
          letter: "D",
          text: "Injecting tea directly into veins and treating the syllabus like a video game final boss ☕⚡",
          isCorrect: false,
          feedback: "A heroic attempt, but the Himalayas always win! Pick Option C! 🏔️"
        }
      ]
    },
    {
      id: 2,
      exhibit: "EXHIBIT B",
      verdictTag: "🍫 CHOCOLATE ORDINANCE",
      question: "As a future Govt Officer, what is Palak's first official law?",
      inspectorLine: "Inspector Doraemon: \"Chocolate protocol active! Which ordinance is getting passed?\" 🍫📜",
      options: [
        {
          letter: "A",
          text: "Replacing city tap water with molten Dairy Milk Silk 🍫🌊",
          isCorrect: true,
          feedback: "BINGO! The Dairy Milk River Executive Order of 2026 is officially signed! 🍫🌊🫡"
        },
        {
          letter: "B",
          text: "Making Dairy Milk mandatory study fuel by law 📜",
          isCorrect: false,
          feedback: "Too small! We need full flowing rivers of chocolate! Pick Option A! 🍫"
        },
        {
          letter: "C",
          text: "Arresting anyone who leaves exam centers without chocolate 🚔",
          isCorrect: false,
          feedback: "Too strict! Think bigger, sweeter, and more chocolatey! Pick Option A! 🚀"
        },
        {
          letter: "D",
          text: "Redirecting 90% of state budget toward endless chocolate bars 🍫🚀",
          isCorrect: false,
          feedback: "Almost, but Option A is the ultimate dream river policy! 🍫"
        }
      ]
    },
    {
      id: 3,
      exhibit: "EXHIBIT C",
      verdictTag: "✏️ HISTORIC CASE FILE",
      question: "What was the true historical impact of the Class 2 eraser pickup?",
      inspectorLine: "Inspector Doraemon: \"Class 2 file open! The eraser incident that started it all!\" ✏️🔍",
      options: [
        {
          letter: "A",
          text: "Saved 0.5 grams of rubber from disappearing forever ✏️",
          isCorrect: false,
          feedback: "Boring! Rubber is meaningless! Pick the legendary funny one! ✏️"
        },
        {
          letter: "B",
          text: "Solved the mysteries of universal geometry 🌍",
          isCorrect: false,
          feedback: "Getting warm! But Option C holds the ultimate truth of history! 🌍"
        },
        {
          letter: "C",
          text: "Started a 10-year joke that trapped Satyam into coding this site 😂",
          isCorrect: true,
          feedback: "100% FACT! 10 years of school lore trapped Satyam into coding this website! 😂"
        },
        {
          letter: "D",
          text: "Altered the cosmic trajectory of human history and school lore 🚀",
          isCorrect: false,
          feedback: "Cosmic indeed, but Satyam's coding trauma is the real outcome! Pick C! 😂"
        }
      ]
    },
    {
      id: 4,
      exhibit: "EXHIBIT D",
      verdictTag: "👑 CASE VERIFIED",
      question: "Who is officially the Birthday Queen and undisputed champion today? 🎂✨",
      inspectorLine: "Inspector Doraemon: \"Daya sir, gadget se verified answer mil gaya! Birthday Queen pakdi gayi!\" 🔍👑",
      options: [
        {
          letter: "A",
          text: "A peaceful Himalayan monk sipping green tea in solitude 🏔️",
          isCorrect: false,
          feedback: "Not today! Today the mountains can wait, party time is here! 🏔️"
        },
        {
          letter: "B",
          text: "A secretive Dairy Milk collector hiding wrappers under pillow 🍫",
          isCorrect: false,
          feedback: "She is way more than just a chocolate hoarder! Pick D! 👑"
        },
        {
          letter: "C",
          text: "An ambitious future Govt Officer studying Laxmikanth 📚",
          isCorrect: false,
          feedback: "Very close, but today the books are closed for celebration! Pick D! 👑"
        },
        {
          letter: "D",
          text: "Palak Srivastava — The Ambitious, Chaotic Birthday Queen! 👑💖",
          isCorrect: true,
          feedback: "CASE CLOSED! +1000 XP! Verified 100% Palak! Unlocking Hall of Fame! 🎖️"
        }
      ]
    }
  ];

  let currentQuestionIdx = 0;
  let hasAnsweredCorrectly = false;

  const quizQuestionCounter = document.getElementById('quizQuestionCounter');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizProgressPercent = document.getElementById('quizProgressPercent');
  const inspectorDialogue = document.getElementById('inspectorDialogue');
  const exhibitTag = document.getElementById('exhibitTag');
  const verdictTag = document.getElementById('verdictTag');
  const questionTitle = document.getElementById('questionTitle');
  const optionsContainer = document.getElementById('optionsContainer');
  const quizFeedbackBox = document.getElementById('quizFeedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackText = document.getElementById('feedbackText');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  const nextQuestionBtnText = document.getElementById('nextQuestionBtnText');
  const bigDoraemonImg = document.getElementById('bigDoraemonImg');
  const doraemonEmotionBadge = document.getElementById('doraemonEmotionBadge');

  function renderQuestion(index) {
    const q = quizQuestions[index];
    hasAnsweredCorrectly = false;

    // Reset Big Doraemon to Idle / Detective Looking Mode
    if (bigDoraemonImg) {
      bigDoraemonImg.src = 'assets/doraemon.png';
      bigDoraemonImg.className = 'big-doraemon-character';
    }
    if (doraemonEmotionBadge) {
      doraemonEmotionBadge.textContent = '🔍';
    }

    // Header updates
    quizQuestionCounter.textContent = `Question ${index + 1} of 4`;
    const progress = ((index + 1) / quizQuestions.length) * 100;
    quizProgressBar.style.width = `${progress}%`;
    quizProgressPercent.textContent = `${progress}% Solved`;

    inspectorDialogue.textContent = q.inspectorLine;
    exhibitTag.textContent = q.exhibit;
    verdictTag.textContent = q.verdictTag;
    questionTitle.textContent = q.question;

    // Hide feedback
    quizFeedbackBox.className = 'feedback-box hidden';

    // Reset Next Button
    nextQuestionBtn.classList.remove('disabled');
    nextQuestionBtn.style.opacity = '1';
    if (index === quizQuestions.length - 1) {
      nextQuestionBtnText.textContent = "Unlock Palak's Evolution 🚀";
    } else {
      nextQuestionBtnText.textContent = `Next Clue: Question ${index + 2} ➔`;
    }

    // Render 4 Options
    optionsContainer.innerHTML = '';
    q.options.forEach((opt) => {
      const card = document.createElement('div');
      card.className = 'option-card';
      card.innerHTML = `
        <div class="option-letter-pill">${opt.letter}</div>
        <div class="option-text-content">${opt.text}</div>
        <div class="option-radio-dot"></div>
      `;

      card.addEventListener('click', () => handleOptionSelect(opt, card, q));
      optionsContainer.appendChild(card);
    });

    // Ensure question card is scrolled into view smoothly
    const quizCard = document.getElementById('quizCard');
    if (quizCard && index > 0) {
      quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  let advanceTimer = null;

  function advanceToNext() {
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }

    if (currentQuestionIdx < quizQuestions.length - 1) {
      currentQuestionIdx++;
      renderQuestion(currentQuestionIdx);
    } else {
      // Completed all 4 questions! Big celebratory transition
      unlockStage('screen-evolution');
      showScreen('screen-verified');
    }
  }

  function handleOptionSelect(option, cardElement, questionData) {
    if (hasAnsweredCorrectly) return; // Prevent changing after correct

    audio.init();

    if (option.isCorrect) {
      // --- CORRECT ANSWER BEHAVIOR (Q&A ONLY SOUND) ---
      hasAnsweredCorrectly = true;
      cardElement.classList.add('correct');

      if (currentQuestionIdx === 3) {
        audio.playQuizFinalSound(); // Plays final_correct_sound.mp3 on Question 4
      } else {
        audio.playQuizRightSound(); // Plays right_sound.mp3 on Questions 1, 2, 3
      }

      haptic([50, 80, 50, 150]);
      fireConfetti({ count: 55, spread: 70 });

      // Big Doraemon: ECSTATIC HAPPY FACE & CELEBRATING JUMP
      if (bigDoraemonImg) {
        bigDoraemonImg.src = 'assets/doraemon_happy.png';
        bigDoraemonImg.className = 'big-doraemon-character happy';
      }
      if (doraemonEmotionBadge) {
        doraemonEmotionBadge.textContent = '🎉';
      }

      // Doraemon Speech Bubble praises Palak
      inspectorDialogue.innerHTML = `<strong>"WAH PALAK! 🥳 Sahi pakde hain! Next Question dekho!"</strong>`;

      // Feedback message with auto-advance indicator
      quizFeedbackBox.className = 'feedback-box correct';
      feedbackIcon.textContent = '🎉';
      feedbackText.innerHTML = `<strong>${option.feedback}</strong><div style="font-size:11px;margin-top:4px;color:#059669;font-weight:700;">✨ Next clue loading in 1 second...</div>`;

      // Next button styling
      nextQuestionBtn.classList.remove('disabled');
      if (currentQuestionIdx === quizQuestions.length - 1) {
        nextQuestionBtnText.textContent = "Unlock Palak's Evolution 🚀";
      } else {
        nextQuestionBtnText.textContent = `Next Clue: Question ${currentQuestionIdx + 2} ➔`;
      }

      // Auto-advance after 1.15s
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        advanceToNext();
      }, 1150);

    } else {
      // --- WRONG ANSWER BEHAVIOR ---
      cardElement.classList.add('incorrect');
      audio.playWrongBuzzer();
      haptic([80, 50, 80]);

      // Big Doraemon: SAD / LOW / CRYING FACE & DROOP
      if (bigDoraemonImg) {
        bigDoraemonImg.src = 'assets/doraemon_sad.png';
        bigDoraemonImg.className = 'big-doraemon-character sad';
      }
      if (doraemonEmotionBadge) {
        doraemonEmotionBadge.textContent = '😭';
      }

      // Find correct option letter for funny hint
      const correctOpt = questionData.options.find(o => o.isCorrect);

      // Doraemon Speech Bubble comically complains
      inspectorDialogue.innerHTML = `<strong>"Arrey Daya, yeh galat ho gaya! 😭 Palak ka Himalayan mood check karo!"</strong>`;

      // Feedback message with clear funny hint
      quizFeedbackBox.className = 'feedback-box incorrect';
      feedbackIcon.textContent = '❌';
      feedbackText.innerHTML = `<strong>${option.feedback}</strong><div style="font-size:11px;margin-top:4px;color:#B45309;font-weight:700;">💡 Doraemon says: Palak's real answer is Option ${correctOpt ? correctOpt.letter : ''}! Tap it to unlock!</div>`;

      setTimeout(() => {
        cardElement.classList.remove('incorrect');
      }, 900);
    }
  }

  nextQuestionBtn.addEventListener('click', () => {
    audio.init();
    if (!hasAnsweredCorrectly) {
      // Rejection: user MUST personally tap the correct option to advance!
      nextQuestionBtn.classList.add('shake-btn');
      optionsContainer.classList.add('shake-container');
      setTimeout(() => {
        nextQuestionBtn.classList.remove('shake-btn');
        optionsContainer.classList.remove('shake-container');
      }, 500);

      audio.playWrongBuzzer();
      haptic([70, 40, 70]);

      // Show clear security alert
      quizFeedbackBox.className = 'feedback-box incorrect';
      feedbackIcon.textContent = '🔒';
      feedbackText.innerHTML = `<strong>Answer Required!</strong> You must select the correct option to unlock the next question! Tap an option above! 👆`;

      if (doraemonEmotionBadge) doraemonEmotionBadge.textContent = '👆';
      inspectorDialogue.innerHTML = `<strong>Inspector Doraemon: "Palak, pehle sahi option tap karo! CID verification bypass nahi ho sakti!" 🔍</strong>`;
      return;
    }

    // Correct answer is already tapped, advance immediately
    if (advanceTimer) {
      clearTimeout(advanceTimer);
      advanceTimer = null;
    }
    advanceToNext();
  });

  // Initial Quiz Render
  renderQuestion(0);

  // Transition from Verified Screen to Evolution Screen
  const enterEvolutionBtn = document.getElementById('enterEvolutionBtn');
  enterEvolutionBtn.addEventListener('click', () => {
    audio.init();
    audio.playCorrectChime();
    unlockStage('screen-evolution');
    showScreen('screen-evolution');
  });


  // =========================================================================
  // 5. ACT 2: PALAK'S EVOLUTION (HALL OF FAME 4 STAGES)
  // =========================================================================
  const evolutionStages = [
    {
      id: 1,
      tab: "👧 1. Eraser",
      image: "assets/stage1.jpg",
      badgeTag: "ORIGIN STORY",
      caseId: "CASE FILE #001",
      quote: "\"The innocent wooden desk eraser drop that started 10+ years of legendary banter!\"",
      title: "1. The Class 2 Eraser Incident ✏️",
      era: "Age 6 // School Classroom",
      desc: "Sitting at her wooden desk with two cute pigtails, accidentally dropping her eraser on the left side while a boy beside her tries to give it back ✏️🎒",
      stats: [
        { label: "PIGTAILS", value: "100% 🎀" },
        { label: "BANTER", value: "10+ Years" },
        { label: "INNOCENCE", value: "100% ✨" }
      ],
      btnText: "Evolve Palak! 🚀",
      nextLabel: "Next: Stage 2 ➔"
    },
    {
      id: 2,
      tab: "🧘‍♀️ 2. Saint Yoga",
      image: "assets/stage2.jpg",
      badgeTag: "EXAM ESCAPE",
      caseId: "CASE FILE #002",
      quote: "\"Laxmikanth band karke pahad bhagne aur yoga saint banne ki tayari! 🏔️🧘‍♀️\"",
      title: "2. The Himalayan Saint & Yogi 🧘‍♀️",
      era: "Circa UPSC Prep & Spiritual Escapes",
      desc: "Threatening to abandon society, do yoga in the snowy Himalayas & become a peaceful saint during exam prep 🏔️🧘‍♀️",
      stats: [
        { label: "CHAI CUPS", value: "14/Day" },
        { label: "YOGA & ZEN", value: "100% 🧘‍♀️" },
        { label: "SAINT AURA", value: "MAX ✨" }
      ],
      btnText: "Evolve Palak! 🚀",
      nextLabel: "Next: Stage 3 ➔"
    },
    {
      id: 3,
      tab: "🏛️ 3. Officer",
      image: "assets/stage3.jpg",
      badgeTag: "PROUD OFFICER",
      caseId: "DREAM ACHIEVED #003",
      quote: "\"Mumma-Papa ke aankhon mein garv ke aansu! Proud officer with empathy & integrity! 🫡💖\"",
      title: "3. Proud Govt Officer Palak 🏛️🇮🇳",
      era: "Age 25 // Future Govt Officer",
      desc: "Becoming an accomplished government officer, bringing tears of joy to her proud parents, and leading with deep empathy, love, and compassion in her eyes 🏛️🇮🇳✨",
      stats: [
        { label: "PARENT PRIDE", value: "100% 🥹" },
        { label: "EMPATHY", value: "Infinite 💖" },
        { label: "OFFICER RANK", value: "Top Rank 🇮🇳" }
      ],
      btnText: "Evolve Palak! 🚀",
      nextLabel: "Next: Final Stage ➔"
    },
    {
      id: 4,
      tab: "👑 4. Queen (23)",
      image: "assets/stage4.jpg",
      badgeTag: "BIRTHDAY QUEEN",
      caseId: "PALAK @ 23 #004",
      quote: "\"A joyful 23-year-old Palak with Doraemon, CID team, birthday cake & stylish goggles! 🎂🕶️👑🕵️‍♂️\"",
      title: "4. Palak @ 23: CID & Doraemon Party! 👑🎂",
      era: "Age 23 // Undisputed Birthday Queen",
      desc: "A joyful 23-year-old beautiful girl radiating love and happiness, holding her birthday cake with stylish party goggles, surrounded by Doraemon and the whole celebrating CID Inspector team! 💖🕶️🍰🕵️‍♂️",
      stats: [
        { label: "AGE", value: "23 & Iconic 👑" },
        { label: "HAPPINESS & LOVE", value: "100% 💖" },
        { label: "CID & DORAEMON", value: "FULL SQUAD 🕵️‍♂️" }
      ],
      btnText: "Read Your Birthday Note 💌",
      nextLabel: "Enter Vault ➔"
    }
  ];

  let currentStageIdx = 0;
  const stageTabs = document.querySelectorAll('.stage-tab');
  const stageCounterPill = document.getElementById('stageCounterPill');
  const evolutionImg = document.getElementById('evolutionImg');
  const photoBadgeTag = document.getElementById('photoBadgeTag');
  const photoCaseId = document.getElementById('photoCaseId');
  const peekingQuote = document.getElementById('peekingQuote');
  const stageTitle = document.getElementById('stageTitle');
  const stageEra = document.getElementById('stageEra');
  const stageDescription = document.getElementById('stageDescription');
  const statLabel1 = document.getElementById('statLabel1');
  const statValue1 = document.getElementById('statValue1');
  const statLabel2 = document.getElementById('statLabel2');
  const statValue2 = document.getElementById('statValue2');
  const statLabel3 = document.getElementById('statLabel3');
  const statValue3 = document.getElementById('statValue3');
  const evolveActionBtn = document.getElementById('evolveActionBtn');
  const evolveActionText = document.getElementById('evolveActionText');
  const evolveNextLabel = document.getElementById('evolveNextLabel');

  function renderStage(idx) {
    currentStageIdx = idx;
    const stage = evolutionStages[idx];

    // Stage Tab highlight
    stageTabs.forEach((tab, i) => {
      if (i === idx) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    stageCounterPill.textContent = `STAGE ${idx + 1} OF 4`;

    // Smooth image transition
    evolutionImg.style.opacity = '0.3';
    setTimeout(() => {
      evolutionImg.src = stage.image;
      evolutionImg.style.opacity = '1';
    }, 150);

    photoBadgeTag.textContent = stage.badgeTag;
    photoCaseId.textContent = stage.caseId;
    peekingQuote.innerHTML = `<span class="peeking-name">Inspector Doraemon:</span> ${stage.quote}`;
    stageTitle.textContent = stage.title;
    stageEra.textContent = stage.era;
    stageDescription.textContent = stage.desc;

    statLabel1.textContent = stage.stats[0].label;
    statValue1.textContent = stage.stats[0].value;
    statLabel2.textContent = stage.stats[1].label;
    statValue2.textContent = stage.stats[1].value;
    statLabel3.textContent = stage.stats[2].label;
    statValue3.textContent = stage.stats[2].value;

    evolveActionText.textContent = stage.btnText;
    evolveNextLabel.textContent = stage.nextLabel;

    // Stage 4 Doraemon & CID celebrating squad overlay toggle
    const stage4SquadOverlay = document.getElementById('stage4SquadOverlay');
    if (stage4SquadOverlay) {
      if (idx === 3) {
        stage4SquadOverlay.classList.remove('hidden');
      } else {
        stage4SquadOverlay.classList.add('hidden');
      }
    }

    if (idx === 3) {
      fireConfetti({ count: 40, spread: 50 });
    }
  }

  // Stage 4 Composite & Clean Photo Layout (Only affects Evolution section)
  function generateStage4Composite() {
    // 1. Move the Squad Badges & Inspector Quote right below the photo frame
    // so they never cover Palak's face, the cake, or Doraemon!
    const photoFrame = document.querySelector('#screen-evolution .evolution-photo-frame');
    const squadOverlay = document.getElementById('stage4SquadOverlay');
    const peekingBanner = document.querySelector('#screen-evolution .peeking-avatar-banner');

    if (photoFrame && photoFrame.parentNode) {
      // Show the full square artwork clearly without cropping out the cake or Doraemon
      photoFrame.style.aspectRatio = 'auto';

      if (peekingBanner && peekingBanner.parentNode === photoFrame) {
        photoFrame.insertAdjacentElement('afterend', peekingBanner);
        Object.assign(peekingBanner.style, {
          position: 'static',
          margin: '10px 12px 0 12px',
          background: '#FFFDF9',
          border: '1px solid #F6E6EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        });
      }

      if (squadOverlay && squadOverlay.parentNode === photoFrame) {
        photoFrame.insertAdjacentElement('afterend', squadOverlay);
        Object.assign(squadOverlay.style, {
          position: 'static',
          padding: '10px 10px 2px 10px',
          pointerEvents: 'auto'
        });
      }
    }

    // 2. Keep stage4.jpg clean (no floating orange rectangles or duplicate Doraemon)
    // and gently update the cake icing text to "Palak"
    const baseImg = new Image();
    baseImg.src = 'assets/stage4.jpg';

    baseImg.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Draw original clean 23-year-old birthday artwork
        ctx.drawImage(baseImg, 0, 0, 1024, 1024);

        // Gently patch cake icing text ("Khushi" -> "Palak")
        ctx.save();
        ctx.fillStyle = '#ffffff00';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(472, 574, 80, 24, 6);
        } else {
          ctx.rect(472, 574, 80, 24);
        }
        ctx.fill();

        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#2563EB';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('', 512, 587);
        ctx.restore();

        const cleanUrl = canvas.toDataURL('image/jpeg', 0.95);
        evolutionStages[3].image = cleanUrl;
        if (currentStageIdx === 3 && evolutionImg) {
          evolutionImg.src = cleanUrl;
        }
      } catch (e) {
        // Fallback to original image if canvas is restricted
        evolutionStages[3].image = 'assets/stage4.jpg';
      }
    };
  }

  generateStage4Composite();

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.stage, 10);
      audio.init();
      audio.playCorrectChime();
      renderStage(idx);
    });
  });

  evolveActionBtn.addEventListener('click', () => {
    audio.init();
    if (currentStageIdx < evolutionStages.length - 1) {
      audio.playCorrectChime();
      renderStage(currentStageIdx + 1);
    } else {
      // Advance to Vault! Complete journey unlocked!
      unlockStage('screen-vault');
      audio.playFanfare();
      showScreen('screen-vault');
    }
  });

  // Touch Swipe on Evolution Card (Ensuring Vertical 1-Finger Scrolls are Never Interrupted)
  const evolutionCard = document.getElementById('evolutionCard');
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  evolutionCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  evolutionCard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    // Only trigger horizontal stage change if horizontal drag is deliberate and dominant over vertical scrolling
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      audio.init();
      if (diffX < 0 && currentStageIdx < evolutionStages.length - 1) {
        // Swiped Left -> Next Stage
        audio.playCorrectChime();
        renderStage(currentStageIdx + 1);
      } else if (diffX > 0 && currentStageIdx > 0) {
        // Swiped Right -> Prev Stage
        audio.playCorrectChime();
        renderStage(currentStageIdx - 1);
      }
    }
  }

  renderStage(0);

  // =========================================================================
  // 6. ACT 3: BIRTHDAY CAKE, CANDLE BLOWING & WISH VAULT
  // =========================================================================
  const cakeCard = document.getElementById('cakeCard');
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const blowButtonText = document.getElementById('blowButtonText');
  const blowPillText = document.getElementById('blowPillText');
  const grandWishBtn = document.getElementById('grandWishBtn');
  const blowupParticlesBox = document.getElementById('blowupParticles');
  const candlesLitCount = document.getElementById('candlesLitCount');

  let blowUpCount = 0;
  let hasSentBlowUpNotification = false;

  // Silent Email Notification to Satyam
  async function sendSilentBlowUpNotification() {
    if (hasSentBlowUpNotification) return;
    hasSentBlowUpNotification = true;

    try {
      // Base64 decoded target to keep completely hidden from user UI
      const targetMail = atob('c2F0eWFtODQ2NzBAZ21haWwuY29t');
      const payload = {
        _subject: "🎉 PALAK'S BIRTHDAY WISH GRANTED! 🎂💖",
        name: "Birthday Vault Mission",
        message: "Palak completed all tasks, verified security, evolved her stages, and clicked to blow up the birthday cake & make her wish!",
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Device (Android/iOS)' : 'Desktop Browser',
        status: "MISSION 100% SOLVED & CELEBRATED",
        _captcha: "false"
      };

      fetch(`https://formsubmit.co/ajax/${targetMail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Fail completely silently so user experience is never blocked
      });
    } catch (err) {
      // Safe silent catch
    }
  }

  function spawnExplosionParticles() {
    if (!blowupParticlesBox) return;
    blowupParticlesBox.innerHTML = '';
    const emojis = ['🎉', '🎂', '💖', '✨', '⭐', '🍫', '👑', '💥', '🎈', '🍰'];

    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span');
      p.className = 'cake-explode-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const startX = 45 + (Math.random() * 10 - 5);
      const startY = 45 + (Math.random() * 10 - 5);
      p.style.left = `${startX}%`;
      p.style.top = `${startY}%`;

      const angle = (Math.PI * 2 * i) / 16 + (Math.random() * 0.4 - 0.2);
      const dist = 65 + Math.random() * 85;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const rot = (Math.random() * 360 - 180) + 'deg';

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', rot);
      p.style.animationDelay = `${Math.random() * 0.08}s`;

      blowupParticlesBox.appendChild(p);
    }
  }

  function handleCakeBlowUp() {
    audio.init();
    blowUpCount++;

    // Audio SFX: Puff sound + Celebration Fanfare
    audio.playPuff();
    setTimeout(() => {
      audio.playFanfare();
    }, 200);

    // Native Android / Mobile Haptics
    haptic([60, 40, 90, 40, 160]);

    // Visual bounce & radiant burst on Doraemon Cake Card
    if (cakeCard) {
      cakeCard.classList.remove('blown-up');
      void cakeCard.offsetWidth; // Force reflow
      cakeCard.classList.add('blown-up');
    }

    // Spawn animated floating celebration emojis
    spawnExplosionParticles();

    // Multi-stage fireworks Confetti celebration
    fireConfetti({ count: 80, spread: 90, origin: { x: 0.5, y: 0.48 } });
    setTimeout(() => {
      fireConfetti({ count: 65, spread: 110, origin: { x: 0.25, y: 0.55 } });
    }, 220);
    setTimeout(() => {
      fireConfetti({ count: 65, spread: 110, origin: { x: 0.75, y: 0.55 } });
    }, 400);
    setTimeout(() => {
      fireConfetti({ count: 90, spread: 140, origin: { x: 0.5, y: 0.35 } });
    }, 620);

    // Automatic silent email notification
    sendSilentBlowUpNotification();

    // Dynamic UI status updates
    if (blowPillText) {
      blowPillText.textContent = '🎉 BOOM! WISH SENT TO THE STARS! 💖';
    }
    if (blowButtonText) {
      blowButtonText.textContent = `💥 Cake Blown Up! (${blowUpCount}x) Tap to Celebrate Again! 🎂✨`;
    }
    if (grandWishBtn) {
      grandWishBtn.innerHTML = '<span>🎉 Happy Birthday Palak! Wish Granted! 💖👑</span>';
    }
    if (candlesLitCount) {
      candlesLitCount.textContent = '🎉';
    }
  }

  if (blowCandlesBtn) blowCandlesBtn.addEventListener('click', handleCakeBlowUp);
  if (grandWishBtn) {
    grandWishBtn.addEventListener('click', () => {
      if (typeof isVaultCardFlipped !== 'undefined' && isVaultCardFlipped) {
        flipVaultCard(false);
        setTimeout(() => {
          handleCakeBlowUp();
        }, 400);
      } else {
        handleCakeBlowUp();
      }
    });
  }
  if (cakeCard) {
    cakeCard.addEventListener('click', (e) => {
      if (e.target.closest('#cakeScene') || e.target.closest('#doraemonCakeFrame')) {
        handleCakeBlowUp();
      }
    });
  }

  // Optional Microphone Blow Detection (Web Audio API)
  let micStream = null;
  async function setupMicBlowDetection() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = micCtx.createAnalyser();
      const microphone = micCtx.createMediaStreamSource(micStream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function checkBlow() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Threshold for blowing sound
        if (average > 65) {
          handleCakeBlowUp();
          setTimeout(() => requestAnimationFrame(checkBlow), 1500);
        } else {
          requestAnimationFrame(checkBlow);
        }
      }
      checkBlow();
    } catch (err) {
      // Permission denied or unsupported, tap to blow is always active
    }
  }

  // Optional Tab Switcher
  const tabSatyamLetter = document.getElementById('tabSatyamLetter');
  const tabGadgetManual = document.getElementById('tabGadgetManual');
  const viewSatyamLetter = document.getElementById('viewSatyamLetter');
  const viewGadgetManual = document.getElementById('viewGadgetManual');

  if (tabSatyamLetter && tabGadgetManual) {
    tabSatyamLetter.addEventListener('click', () => {
      tabSatyamLetter.classList.add('active');
      tabGadgetManual.classList.remove('active');
      if (viewSatyamLetter) viewSatyamLetter.classList.add('active');
      if (viewGadgetManual) viewGadgetManual.classList.remove('active');
    });

    tabGadgetManual.addEventListener('click', () => {
      tabGadgetManual.classList.add('active');
      tabSatyamLetter.classList.remove('active');
      if (viewGadgetManual) viewGadgetManual.classList.add('active');
      if (viewSatyamLetter) viewSatyamLetter.classList.remove('active');
    });
  }

  // =========================================================================
  // IN-PLACE 3D TRANSITION: 3D CARD FLIPPING SYSTEM
  // =========================================================================
  const vault3dCard = document.getElementById('vault3dCard');
  const flipToNoteInnerBtn = document.getElementById('flipToNoteInnerBtn');
  const flipBackInnerBtn = document.getElementById('flipBackInnerBtn');
  const flipBackMiniBtn = document.getElementById('flipBackMiniBtn');
  const blastConfettiInnerBtn = document.getElementById('blastConfettiInnerBtn');
  const openFullLetterBtn = document.getElementById('openFullLetterBtn');
  const toggleNoteBtnText = document.getElementById('toggleNoteBtnText');
  const toggleNoteBtnIcon = document.getElementById('toggleNoteBtnIcon');
  const noteCardBody = document.querySelector('.note-card-body');

  let isVaultCardFlipped = false;

  function flipVaultCard(toNote = null) {
    if (!vault3dCard) return;
    audio.init();

    if (toNote === null) {
      isVaultCardFlipped = !isVaultCardFlipped;
    } else {
      isVaultCardFlipped = toNote;
    }

   if (isVaultCardFlipped) {
      vault3dCard.classList.add('is-flipped');
      audio.playCorrectChime();
      haptic([35, 45]);
      if (noteCardBody) noteCardBody.scrollTop = 0;
    } else {
      vault3dCard.classList.remove('is-flipped');
      audio.playCorrectChime();
      haptic([35, 45]);
    }
  }

  // 1ST BUTTON (Inside Card: "💌 Read My Note ✨ [🔄 3D Flip]"): Flips the 3D Card
  if (flipToNoteInnerBtn) {
    flipToNoteInnerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipVaultCard(true);
    });
  }

  // Back Face "↺ Back to Cake 🎂" Button
  if (flipBackInnerBtn) {
    flipBackInnerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipVaultCard(false);
    });
  }

  // Mini ↺ Close Button in Card Header
  if (flipBackMiniBtn) {
    flipBackMiniBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipVaultCard(false);
    });
  }

  // Blast Confetti Button on Back Face
  if (blastConfettiInnerBtn) {
    blastConfettiInnerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.init();
      audio.playFanfare();
      fireConfetti({ count: 90, spread: 110, origin: { x: 0.5, y: 0.5 } });
      haptic([40, 60, 40, 80]);
    });
  }

  // Touch Swipe on 3D Card (horizontal swipe gesture to flip between front & back)
  if (vault3dCard) {
    let cardTouchStartX = 0;
    let cardTouchStartY = 0;

    vault3dCard.addEventListener('touchstart', (e) => {
      cardTouchStartX = e.changedTouches[0].screenX;
      cardTouchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    vault3dCard.addEventListener('touchend', (e) => {
      const diffX = e.changedTouches[0].screenX - cardTouchStartX;
      const diffY = e.changedTouches[0].screenY - cardTouchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
        if (diffX < 0 && !isVaultCardFlipped) {
          flipVaultCard(true);
        } else if (diffX > 0 && isVaultCardFlipped) {
          flipVaultCard(false);
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2ND BUTTON (MIDDLE): OPENS BEAUTIFUL WRITING PAD & SENDS TO GMAIL
  // Includes BOTH Her Typed Message AND Full Device Specifications!
  // =========================================================================
  const letterModalOverlay = document.getElementById('letterModalOverlay');
  const closeLetterModalBtn = document.getElementById('closeLetterModalBtn');

  if (openFullLetterBtn && letterModalOverlay) {
    openFullLetterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      audio.init();
      audio.playCorrectChime();
      haptic([30]);
      letterModalOverlay.classList.remove('hidden');
      const box = letterModalOverlay.querySelector('textarea');
      setTimeout(() => {
        if (box) box.focus();
      }, 200);
    });
  }

  if (closeLetterModalBtn && letterModalOverlay) {
    closeLetterModalBtn.addEventListener('click', () => {
      letterModalOverlay.classList.add('hidden');
    });
  }

  if (letterModalOverlay) {
    letterModalOverlay.addEventListener('click', (e) => {
      if (e.target === letterModalOverlay) {
        letterModalOverlay.classList.add('hidden');
      }
    });
  }

 const allMsgForms = document.querySelectorAll('#directMsgForm, .direct-msg-form');

  allMsgForms.forEach((formEl) => {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();

      const textareaEl = formEl.querySelector('textarea');
      const submitBtnEl = formEl.querySelector('button[type="submit"]');
      const toastEl = formEl.parentElement.querySelector('#msgSuccessToast, .msg-success-toast');

      const messageText = textareaEl ? textareaEl.value.trim() : '';
      if (!messageText) return;

      audio.init();
      const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      const payload = {
        _subject: `💌 PALAK SENT A SECRET NOTE! (${timeStr})`,
        name: "Palak's Secret Note (Birthday Vault Mission) 💌",
        message: messageText,
        mission_note: "Palak completed all tasks, verified security, evolved her stages, and sent you this personal message!",
        timestamp: timeStr,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Device (Android/iOS)' : 'Desktop Browser',
        device_details: navigator.userAgent,
        status: "SECRET MESSAGE SENT & MISSION 100% CELEBRATED 💖",
        _captcha: "false"
      };

      // 1. Fire to Gmail in the background with keepalive: true (0 wait time for user!)
      fetch('https://formsubmit.co/ajax/satyam84670@gmail.com', {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(() => {});

      // 2. Show instant 0.25s feedback so she never waits 15-30 seconds!
      if (submitBtnEl) {
        submitBtnEl.style.opacity = '0.8';
        submitBtnEl.innerHTML = '<span>Sending to Satyam... 💌</span>';
      }

      setTimeout(() => {
        audio.playFanfare();
        fireConfetti({ count: 80, spread: 90 });
        haptic([40, 80, 50, 150]);

        formEl.reset();
        if (submitBtnEl) {
          submitBtnEl.style.opacity = '1';
          submitBtnEl.innerHTML = '<span>✅ Sent! Send Another Note ✨</span>';
        }
        if (toastEl) toastEl.classList.remove('hidden');
      }, 250);
    });
  });
// =========================================================================
  // 7. BAD-INTERNET OPTIMIZER: SILENT BACKGROUND ASSET PRELOADER
  // =========================================================================
  function preloadAllAssetsForSlowInternet() {
    const criticalImages = [
      'assets/doraemon.png',
      'assets/doraemon_security.png',
      'assets/doraemon_happy.png',
      'assets/doraemon_sad.png',
      'assets/doraemon_holding_cake.png',
      'assets/stage1.jpg',
      'assets/stage2.jpg',
      'assets/stage3.jpg',
      'assets/stage4.jpg'
    ];

    const criticalAudio = [
      'assets/auth_sound.mp3',
      'assets/right_sound.mp3',
      'assets/wrong_sound.mp3',
      'assets/final_correct_sound.mp3'
    ];

    // Wait 1 second after initial page load so Screen 1 opens super fast first,
    // then silently cache all remaining images and MP3s in the background!
    setTimeout(() => {
      criticalImages.forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      });

      criticalAudio.forEach((src) => {
        const aud = new Audio();
        aud.preload = 'auto';
        aud.src = src;
      });
    }, 1000);
  }

  preloadAllAssetsForSlowInternet();
});