/**
 * STACKLY — Authentication Controller
 * Manages Sign In, Sign Up, field validation, password toggling, role redirection,
 * and automatic form reset on navigation / browser Back button.
 */

// Global Reset for Login Form
function resetLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.reset();

  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const founderRadio = document.getElementById('roleFounder');

  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (pwdInput) pwdInput.value = '';
  if (founderRadio) founderRadio.checked = true;

  // Restore submit button to normal active "Sign In" state
  const submitBtn = form.querySelector('.auth-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Sign In</span>';
  }

  // Clear validation classes and hints
  form.querySelectorAll('.auth-field').forEach(f => f.classList.remove('has-error'));
  form.querySelectorAll('.auth-input').forEach(i => i.classList.remove('error'));
  form.querySelectorAll('.validation-hint').forEach(h => h.style.display = 'none');
}

// Global Reset for Sign Up Form
function resetSignUpForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.reset();

  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const pwdInput = document.getElementById('signupPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const founderRadio = document.getElementById('signupRoleFounder');

  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (pwdInput) pwdInput.value = '';
  if (confirmInput) confirmInput.value = '';
  if (founderRadio) founderRadio.checked = true;

  // Restore submit button to active "Create Account" state
  const submitBtn = form.querySelector('.auth-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Create Account</span>';
  }

  // Clear validation classes and hints
  form.querySelectorAll('.auth-field').forEach(f => f.classList.remove('has-error'));
  form.querySelectorAll('.auth-input').forEach(i => i.classList.remove('error'));
  form.querySelectorAll('.validation-hint').forEach(h => h.style.display = 'none');
}

// Ensure form is fresh on normal load and on browser Back/Forward (bfcache) navigation
window.addEventListener('pageshow', (event) => {
  resetLoginForm();
  resetSignUpForm();
  // Small delay failsafe to override late browser autofill on history back
  setTimeout(() => {
    resetLoginForm();
    resetSignUpForm();
  }, 40);
});

window.addEventListener('popstate', () => {
  resetLoginForm();
  resetSignUpForm();
});

document.addEventListener('DOMContentLoaded', () => {
  resetLoginForm();
  resetSignUpForm();
  initSignInForm();
  initSignUpForm();
  initPasswordToggles();
});

/* ==========================================================================
   1. SIGN IN FORM
   ========================================================================== */
function initSignInForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const roleInputs = document.querySelectorAll('input[name="userRole"]');

  // Clear error state in real-time as user types
  [emailInput, pwdInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const group = input.closest('.auth-field');
      if (group) group.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const pwdVal = pwdInput ? pwdInput.value : '';
    let selectedRole = 'founder';

    roleInputs.forEach(r => {
      if (r.checked) selectedRole = r.value;
    });

    // 1. Validate Gmail format strictly ending in @gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!emailVal) {
      setFieldError(emailInput, 'Please enter email');
      isValid = false;
    } else if (!gmailRegex.test(emailVal)) {
      setFieldError(emailInput, 'Please enter a valid Gmail address (must end with @gmail.com).');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // 2. Validate Password (min 6 chars)
    if (!pwdVal || pwdVal.length < 6) {
      setFieldError(pwdInput, 'Password must be at least 6 characters long.');
      isValid = false;
    } else {
      clearFieldError(pwdInput);
    }

    if (!isValid) return;

    // Button loading state
    const submitBtn = form.querySelector('.auth-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing In...';
    }

    // Retrieve name if user previously signed up, otherwise default to role occupant
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('stackly_user') || 'null');
    } catch (err) {}

    const resolvedName = (storedUser && storedUser.name)
      ? storedUser.name
      : (selectedRole === 'founder' ? 'Marcus Vance' : 'Elena Rostova');

    // Persist session
    const userSession = {
      name: resolvedName,
      email: emailVal,
      role: selectedRole,
      roleTitle: selectedRole === 'founder' ? 'Founder & Executive' : 'DevOps & Cloud Architect',
      loginTime: new Date().toISOString(),
      avatarInitials: getInitials(resolvedName)
    };

    sessionStorage.setItem('stackly_user', JSON.stringify(userSession));
    localStorage.setItem('stackly_user', JSON.stringify(userSession));

    setTimeout(() => {
      if (selectedRole === 'founder') {
        window.location.href = 'dashboard-founder.html';
      } else {
        window.location.href = 'dashboard-engineer.html';
      }
      setTimeout(() => {
        resetLoginForm();
      }, 500);
    }, 600);
  });
}

/* ==========================================================================
   2. SIGN UP FORM
   ========================================================================== */
function initSignUpForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const pwdInput = document.getElementById('signupPassword');
  const confirmPwdInput = document.getElementById('confirmPassword');
  const roleInputs = document.querySelectorAll('input[name="signupRole"]');

  // Clear errors as user types
  [nameInput, emailInput, pwdInput, confirmPwdInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const group = input.closest('.auth-field');
      if (group) group.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const fullNameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const pwdVal = pwdInput ? pwdInput.value : '';
    const confirmPwdVal = confirmPwdInput ? confirmPwdInput.value : '';
    let selectedRole = 'founder';

    roleInputs.forEach(r => {
      if (r.checked) selectedRole = r.value;
    });

    // 1. Name check
    if (!fullNameVal || fullNameVal.length < 2) {
      setFieldError(nameInput, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // 2. Gmail check
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!emailVal) {
      setFieldError(emailInput, 'Please enter the email');
      isValid = false;
    } else if (!gmailRegex.test(emailVal)) {
      setFieldError(emailInput, 'Please enter a valid Gmail address (must end with @gmail.com).');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // 3. Password check
    if (!pwdVal || pwdVal.length < 6) {
      setFieldError(pwdInput, 'Password must be at least 6 characters long.');
      isValid = false;
    } else {
      clearFieldError(pwdInput);
    }

    // 4. Confirm Password check
    if (!confirmPwdVal || confirmPwdVal !== pwdVal) {
      setFieldError(confirmPwdInput, 'Passwords do not match.');
      isValid = false;
    } else {
      clearFieldError(confirmPwdInput);
    }

    if (!isValid) return;

    // Loading state
    const submitBtn = form.querySelector('.auth-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
    }

    // Store user session and registered details
    const newUser = {
      name: fullNameVal,
      email: emailVal,
      role: selectedRole,
      roleTitle: selectedRole === 'founder' ? 'Founder & Executive' : 'DevOps & Cloud Architect',
      avatarInitials: getInitials(fullNameVal)
    };

    localStorage.setItem('stackly_user', JSON.stringify(newUser));
    sessionStorage.setItem('stackly_user', JSON.stringify(newUser));

    setTimeout(() => {
      // Direct user back to sign in page as requested
      window.location.href = 'login.html';
      setTimeout(() => {
        resetSignUpForm();
      }, 500);
    }, 700);
  });
}

/* ==========================================================================
   3. PASSWORD TOGGLES
   ========================================================================== */
function initPasswordToggles() {
  setupToggle('togglePassword', 'password');
  setupToggle('toggleSignupPassword', 'signupPassword');
  setupToggle('toggleConfirmPassword', 'confirmPassword');
}

function setupToggle(buttonId, inputId) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);

  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');

    btn.innerHTML = isPassword ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  });
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
function setFieldError(input, message) {
  if (!input) return;
  input.classList.add('error');
  const group = input.closest('.auth-field');
  if (group) {
    group.classList.add('has-error');
    const hint = group.querySelector('.validation-hint');
    if (hint) {
      hint.textContent = message;
      hint.style.display = 'block';
    }
  }
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove('error');
  const group = input.closest('.auth-field');
  if (group) {
    group.classList.remove('has-error');
    const hint = group.querySelector('.validation-hint');
    if (hint) hint.style.display = 'none';
  }
}

function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
