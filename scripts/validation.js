// Real-time validation, semantic HTML5 validation, and custom formats

(() => {
  const form = document.getElementById('admissionForm');

  const validators = {
    policyNumber: (input) => {
      const pattern = input.dataset.regex ? new RegExp(input.dataset.regex) : null;
      const msg = input.dataset.regexMsg || 'Invalid format.';
      if (!input.value.trim()) return 'Policy number is required.';
      if (pattern && !pattern.test(input.value.trim())) return msg;
      return '';
    },
    phone: (input) => {
      if (!input.value.trim()) return 'Phone is required.';
      if (input.validity.patternMismatch) return 'Enter a valid phone number.';
      return '';
    },
    email: (input) => {
      if (!input.value.trim()) return 'Email is required.';
      if (input.validity.typeMismatch) return 'Enter a valid email address.';
      return '';
    },
    dob: (input) => {
      if (!input.value) return 'Date of birth is required.';
      const date = new Date(input.value);
      const today = new Date();
      if (date > today) return 'Date of birth cannot be in the future.';
      return '';
    },
    required: (input) => {
      if (!input.value.trim()) return `${(input.labels?.[0]?.innerText || 'This field')} is required.`;
      return '';
    },
    postalCode: (input) => {
      if (!input.value.trim()) return 'Postal code is required.';
      if (input.validity.patternMismatch) return 'Enter a valid postal code.';
      return '';
    }
  };

  const findValidator = (input) => {
    if (input.id === 'policyNumber') return validators.policyNumber;
    if (input.id === 'phone') return validators.phone;
    if (input.id === 'email') return validators.email;
    if (input.id === 'dob') return validators.dob;
    if (input.id === 'postalCode') return validators.postalCode;
    if (input.required) return validators.required;
    return null;
  };

  const getErrorEl = (input) => {
    const id = input.getAttribute('aria-describedby');
    return id ? document.getElementById(id) : null;
  };

  const setValidityUI = (input, message) => {
    const errorEl = getErrorEl(input);
    const isValid = !message;

    input.classList.add('validated');
    input.setAttribute('aria-invalid', String(!isValid));

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
    }
  };

  const validateInput = (input) => {
    const validator = findValidator(input);
    let message = '';
    if (validator) message = validator(input);
    else if (!input.checkValidity()) message = input.validationMessage;
    setValidityUI(input, message);
    return !message;
  };

  const validateStep = (stepIndex) => {
    const step = document.querySelector(`.step-card[data-step="${stepIndex}"]`);
    const inputs = step.querySelectorAll('input, select, textarea');
    let ok = true;
    inputs.forEach((input) => {
      // Skip optional empty fields that are valid by default
      if (!input.required && !input.value) {
        input.classList.remove('is-invalid');
        input.setAttribute('aria-invalid', 'false');
        return;
      }
      const valid = validateInput(input);
      if (!valid) ok = false;
    });
    return ok;
  };

  // Expose functions to other scripts
  window.FormValidation = {
    validateInput,
    validateStep
  };

  // Real-time validation listeners
  const allInputs = form.querySelectorAll('input, select, textarea');

  allInputs.forEach((input) => {
    input.addEventListener('input', () => {
      validateInput(input);
      document.dispatchEvent(new CustomEvent('form:inputValidated', {
        detail: { input }
      }));
    });
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('change', () => {
      validateInput(input);
      document.dispatchEvent(new CustomEvent('form:inputValidated', {
        detail: { input }
      }));
    });
  });
})();
