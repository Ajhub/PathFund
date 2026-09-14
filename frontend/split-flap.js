const CHARSETS = {
  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  numeric: '0123456789'
};

class SplitFlapText {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.words = options.words || ['SYSTEM INIT', 'SYNC ONLINE', 'FUNDPATH'];
    this.flipDuration = options.flipDuration || 0.12;
    this.stagger = options.stagger || 0.06;
    this.cycleDelay = options.cycleDelay || 2000;
    this.charset = CHARSETS[options.charset || 'alphanumeric'] || CHARSETS.alphanumeric;
    this.flipsPerChar = options.flipsPerChar || 8;
    this.loop = options.loop !== undefined ? options.loop : false;
    this.onComplete = options.onComplete || null;
    
    this.padTo = options.padTo || 8;
    this.width = Math.max(this.padTo, ...this.words.map(w => w.length));
    this.normalizedWords = this.words.map(w => w.padEnd(this.width, ' ').slice(0, this.width));
    
    this.tiles = Array.from({ length: this.width }, (_, i) => ({
      current: this.normalizedWords[0][i] || ' ',
      next: this.normalizedWords[0][i] || ' ',
      flipping: false,
      tick: 0
    }));

    this.phraseIndex = 0;
    this.cancelled = false;
    this.raf = null;
    this.cycleTimer = null;
    this.currentPhrase = this.normalizedWords[0];

    this.render();
    
    // Start animation if there are multiple words
    if (this.normalizedWords.length > 1) {
      this.cycleTimer = setTimeout(() => this.scheduleNext(), this.cycleDelay);
    } else if (this.onComplete) {
      setTimeout(this.onComplete, this.cycleDelay);
    }
  }

  sampleChar() {
    return this.charset.charAt(Math.floor(Math.random() * this.charset.length)) || ' ';
  }

  buildSequence(target) {
    const steps = [];
    for (let i = 0; i < this.flipsPerChar; i++) {
      steps.push(this.sampleChar());
    }
    steps.push(target);
    return steps;
  }

  render() {
    if (!this.container) return;
    
    this.container.style.setProperty('--split-flap-flip-duration', `${this.flipDuration}s`);
    
    let html = '';
    this.tiles.forEach((tile, index) => {
      const charCur = tile.current === ' ' ? '&nbsp;' : tile.current;
      const charNext = tile.next === ' ' ? '&nbsp;' : tile.next;
      
      let tileHtml = `
        <span class="split-flap-text__tile">
          <span class="split-flap-text__half split-flap-text__half--top">
            <span class="split-flap-text__char">${charCur}</span>
          </span>
          <span class="split-flap-text__half split-flap-text__half--bottom">
            <span class="split-flap-text__char">${tile.flipping ? charNext : charCur}</span>
          </span>
      `;
      
      if (tile.flipping) {
        tileHtml += `
          <span class="split-flap-text__flap split-flap-text__flap--front" style="animation-duration: ${this.flipDuration}s">
            <span class="split-flap-text__char">${charCur}</span>
          </span>
          <span class="split-flap-text__flap split-flap-text__flap--back" style="animation-duration: ${this.flipDuration}s; animation-delay: ${this.flipDuration / 2}s">
            <span class="split-flap-text__char">${charNext}</span>
          </span>
        `;
      }
      
      tileHtml += `</span>`;
      html += tileHtml;
    });
    
    this.container.innerHTML = html;
  }

  animateTo(targetPhrase) {
    const targetChars = targetPhrase.split('');
    const safeFlipMs = this.flipDuration * 1000;
    const safeStaggerMs = this.stagger * 1000;
    
    const plans = targetChars.map((targetChar, index) => {
      const fromChar = this.currentPhrase[index] || ' ';
      if (fromChar === targetChar) return null;
      return {
        index,
        from: fromChar,
        target: targetChar,
        sequence: this.buildSequence(targetChar),
        start: index * safeStaggerMs,
        step: -1,
        done: false
      };
    }).filter(Boolean);

    if (!plans.length) {
      this.currentPhrase = targetPhrase;
      return 0;
    }

    const totalDuration = plans.reduce((max, plan) => Math.max(max, plan.start + plan.sequence.length * safeFlipMs), 0);
    const startedAt = performance.now();

    const tick = (now) => {
      if (this.cancelled) return;
      const elapsed = now - startedAt;
      let shouldContinue = false;
      let needsRender = false;

      plans.forEach(plan => {
        const localElapsed = elapsed - plan.start;
        if (localElapsed < 0) {
          shouldContinue = true;
          return;
        }

        const step = Math.floor(localElapsed / safeFlipMs);
        if (step < plan.sequence.length) {
          shouldContinue = true;
          if (step !== plan.step) {
            plan.step = step;
            const t = this.tiles[plan.index];
            t.current = step === 0 ? plan.from : plan.sequence[step - 1];
            t.next = plan.sequence[step];
            t.flipping = true;
            t.tick++;
            needsRender = true;
          }
        } else if (!plan.done) {
          plan.done = true;
          const t = this.tiles[plan.index];
          t.current = plan.target;
          t.next = plan.target;
          t.flipping = false;
          needsRender = true;
        }
      });

      if (needsRender) this.render();

      if (shouldContinue) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.currentPhrase = targetPhrase;
      }
    };

    this.raf = requestAnimationFrame(tick);
    return totalDuration;
  }

  scheduleNext() {
    if (this.cancelled) return;
    
    const nextIndex = this.phraseIndex + 1;
    if (nextIndex >= this.normalizedWords.length && !this.loop) {
      if (this.onComplete) {
        setTimeout(this.onComplete, 1000);
      }
      return;
    }
    
    this.phraseIndex = nextIndex % this.normalizedWords.length;
    const duration = this.animateTo(this.normalizedWords[this.phraseIndex]);
    this.cycleTimer = setTimeout(() => this.scheduleNext(), this.cycleDelay + duration);
  }

  destroy() {
    this.cancelled = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.cycleTimer) clearTimeout(this.cycleTimer);
  }
}
