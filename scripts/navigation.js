// Step navigation and progress bar logic

(() => {
  const steps = Array.from(document.querySelectorAll('.step-card'));
  const totalSteps = steps.length;
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressBar = document.getElementById('progressBar');

  let current = 0;

  const updateProgress = () => {
    const percent = Math.round(((current) / (totalSteps - 1)) * 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', String(percent));
    progressBar.classList.remove('progress-pulse');
    // trigger pulse animation
    void progressBar.offsetWidth; // reflow
    progressBar.classList.add('progress-pulse');

    document.dispatchEvent(new CustomEvent('form:progress', {
      detail: { stepIndex: current, totalSteps }
    }));
  };

  const setActiveStep = (newIndex, direction = 'forward') => {
    if (newIndex === current) return;

    const oldStep = steps[current];
    const newStep = steps[newIndex];

    // Animate out old step
    oldStep.classList.remove('active', 'enter-left', 'enter-right');
    oldStep.classList.add(direction === 'forward' ? 'exit-left' : 'exit-right');

    // Prepare new step
    newStep.classList.remove('exit-left', 'exit-right', 'enter-left', 'enter-right');
    newStep.classList.add(direction === 'forward' ? 'enter-right' : 'enter-left');

    // Activate new step after slight delay to allow animation
    requestAnimationFrame(() => {
      oldStep.classList.remove('exit-left', 'exit-right');
      newStep.classList.add('active');
    });

    current = newIndex;
    updateNavButtons();
    updateProgress();

    document.dispatchEvent(new CustomEvent('form:stepChanged', {
      detail: { activeIndex: current }
    }));
  };

  const updateNavButtons = () => {
    backBtn.disabled = current === 0;
    nextBtn.hidden = current === totalSteps - 1;
    submitBtn.hidden = !(current === totalSteps - 1);

    // Validate step to toggle next/submit enable
    const isValid = window.FormValidation.validateStep(current);
    if (!nextBtn.hidden) nextBtn.disabled = !isValid;
    if (!submitBtn.hidden) submitBtn.disabled = !isValid;
  };

  // Re-validate current step on any input validation event
  document.addEventListener('form:inputValidated', () => {
    updateNavButtons();
  });

  backBtn.addEventListener('click', () => {
    const newIndex = Math.max(0, current - 1);
    setActiveStep(newIndex, 'backward');
  });

  nextBtn.addEventListener('click', () => {
    // Ensure current step valid before moving on
    if (!window.FormValidation.validateStep(current)) return;
    const newIndex = Math.min(totalSteps - 1, current + 1);
    setActiveStep(newIndex, 'forward');
  });

  // Initial state
  updateProgress();
  updateNavButtons();
})();
