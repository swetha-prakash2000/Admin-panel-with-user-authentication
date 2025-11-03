// @ts-nocheck
// public/js/signup.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const fields = [
    { id: 'name', minLen: 3, errId: 'err-name', type: 'text' },
    { id: 'email', minLen: 5, errId: 'err-email', type: 'email' },
    { id: 'password', minLen: 5, errId: 'err-password', type: 'password' },
    { id: 'confirmPassword', minLen: 5, errId: 'err-confirmPassword', type: 'password' },
  ];

  // helper to show/hide error
  const showError = (el, msg) => {
    const errEl = document.getElementById(el);
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.style.display = 'block';
  };
  const hideError = (el) => {
    const errEl = document.getElementById(el);
    if (!errEl) return;
    errEl.style.display = 'none';
  };

  // Hide server error when user types anywhere
  const serverError = document.getElementById('serverError');
  const hideServerError = () => {
    if (serverError) serverError.style.display = 'none';
  };

  // Attach input listeners for real-time validation and to hide server error
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    if (!input) return;

    input.addEventListener('input', () => {
      hideServerError();

      const val = input.value.trim();
      if (f.id === 'email') {
        // simple email check
        const isValidEmail = val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (val !== '' && !isValidEmail) {
          showError(f.errId, 'Enter a valid email address');
        } else {
          hideError(f.errId);
        }
        return;
      }

      if (f.id === 'confirmPassword') {
        const pwd = document.getElementById('password')?.value.trim() || '';
        if (val !== '' && val !== pwd) {
          showError(f.errId, 'Passwords do not match');
        } else {
          hideError(f.errId);
        }
        return;
      }

      // generic min length check
      if (val !== '' && val.length < f.minLen) {
        showError(f.errId, `${f.type === 'password' ? 'Password' : 'Field'} must contain at least ${f.minLen} characters`);
      } else {
        hideError(f.errId);
      }
    });
  });

  // On submit: final validation
  form.addEventListener('submit', (e) => {
    let isValid = true;
    hideServerError();

    // clear all inline errors first
    fields.forEach(f => hideError(f.errId));

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      if (!input) return;

      const val = input.value.trim();

      if (val === '') {
        showError(f.errId, 'This field is required');
        isValid = false;
        return;
      }

      if (f.id === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          showError(f.errId, 'Enter a valid email address');
          isValid = false;
        }
        return;
      }

      if (val.length < f.minLen) {
        showError(f.errId, `Must be at least ${f.minLen} characters`);
        isValid = false;
        return;
      }
    });

    // check confirm password matches
    const pwd = document.getElementById('password')?.value.trim() || '';
    const confirmPwd = document.getElementById('confirmPassword')?.value.trim() || '';
    if (pwd !== confirmPwd) {
      showError('err-confirmPassword', 'Passwords do not match');
      isValid = false;
    }

    // ensure terms checkbox is checked
    const terms = document.getElementById('terms');
    if (!terms || !terms.checked) {
      // you can show a message near the checkbox — for now we'll use alert
      showError('err-confirmPassword', 'Please accept terms & conditions'); // small hack: reuse an error div
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();
      return false;
    }

    // allow submit to proceed
    return true;
  });
});
