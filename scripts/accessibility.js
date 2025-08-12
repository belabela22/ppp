// ARIA roles, keyboard navigation, and focus management

(() => {
  const steps = Array.from(document.querySelectorAll('.step-card'));
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('admissionForm');

  const focusFirstField = (stepIndex) => {
    const step = steps[stepIndex];
    const first = step.querySelector('input, select, textarea, button');
    if (first) first.focus();
  };

  const updateAriaHidden = (activeIndex) => {
    steps.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== activeIndex)));
  };

  // Trap "Enter" to navigate next if valid, but allow in textarea
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const target = e.target;
      const isTextArea = target && target.tagName === 'TEXTAREA';
      if (!isTextArea) {
        e.preventDefault();
        if (!nextBtn.hidden && !nextBtn.disabled) nextBtn.click();
        else if (!submitBtn.hidden && !submitBtn.disabled) submitBtn.click();
      }
    }
  });

  document.addEventListener('form:stepChanged', (e) => {
    const { activeIndex } = e.detail;
    updateAriaHidden(activeIndex);
    focusFirstField(activeIndex);
  });

  // Visible focus indicators (in case UA changes)
  [backBtn, nextBtn, submitBtn].forEach((btn) => {
    btn.addEventListener('focus', () => btn.classList.add('focus-visible'));
    btn.addEventListener('blur', () => btn.classList.remove('focus-visible'));
  });

  // Screen reader status updates
  const status = document.getElementById('formStatus');
  document.addEventListener('form:progress', (e) => {
    const { stepIndex, totalSteps } = e.detail;
    status.textContent = `Step ${stepIndex + 1} of ${totalSteps}`;
  });
})();
