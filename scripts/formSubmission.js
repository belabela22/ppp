// Final submission handling with full validation

(() => {
  const form = document.getElementById('admissionForm');
  const submitBtn = document.getElementById('submitBtn');

  const gatherFormData = (formEl) => {
    const fd = new FormData(formEl);
    // Convert to simple object for easier handling/logging
    const data = {};
    fd.forEach((value, key) => {
      if (data[key]) {
        // Support multi-select
        if (Array.isArray(data[key])) data[key].push(value);
        else data[key] = [data[key], value];
      } else {
        data[key] = value;
      }
    });
    return data;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all steps before submit
    let allValid = true;
    const steps = document.querySelectorAll('.step-card');
    steps.forEach((_, idx) => {
      const ok = window.FormValidation.validateStep(idx);
      if (!ok) allValid = false;
    });
    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;

    const data = gatherFormData(form);

    // Simulate submission
    console.log('Submitting patient admission data:', data);

    // Show a simple success UI
    const status = document.getElementById('formStatus');
    status.textContent = 'Form submitted successfully. Thank you.';
    alert('Form submitted successfully. Thank you.');

    // Optionally, reset form
    // form.reset();
    // document.location.reload();
  });
})();
