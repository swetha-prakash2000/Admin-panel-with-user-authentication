// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const showPassword = document.getElementById('showPassword');
  const serverError = document.getElementById('serverError');

  // Toggle password visibility
  if (showPassword) {
    showPassword.addEventListener('change', () => {
      passwordInput.type = showPassword.checked ? 'text' : 'password';
    });
  }

  // Hide server error when user types
  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (serverError) serverError.style.display = 'none';
    });
  });

  // Helper to show/hide errors
  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  };

  const hideError = (id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  };

  // Real-time validation
  emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length > 0 && !regex.test(value)) {
      showError('err-email', 'Enter a valid email address');
    } else {
      hideError('err-email');
    }
  });

  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value.trim();
    if (value.length > 0 && value.length < 5) {
      showError('err-password', 'Password must be at least 5 characters');
    } else {
      hideError('err-password');
    }
  });

  // Final check on submit
  form.addEventListener('submit', (e) => {
    let isValid = true;
    hideError('err-email');
    hideError('err-password');
    if (serverError) serverError.style.display = 'none';

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showError('err-email', 'Email is required');
      isValid = false;
    } else if (!regex.test(email)) {
      showError('err-email', 'Enter a valid email address');
      isValid = false;
    }

    if (!password) {
      showError('err-password', 'Password is required');
      isValid = false;
    } else if (password.length < 4) {
      showError('err-password', 'Password must be at least 4 characters');
      isValid = false;
    }

    if (!isValid) e.preventDefault();
  });
});
