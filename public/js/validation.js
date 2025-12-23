// public/js/validation.js - UPDATED FOR TASK 4

// Client-side validation with dynamic DOM manipulation
const form = document.getElementById('registrationForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const age = document.getElementById('age');
const country = document.getElementById('country');
const bio = document.getElementById('bio');
const terms = document.getElementById('terms');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');

// ============================================
// TASK 4: CLIENT-SIDE ROUTING IMPLEMENTATION
// ============================================

// Simple client-side router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }
  
  addRoute(path, handler) {
    this.routes[path] = handler;
  }
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'registration';
    this.currentRoute = hash;
    
    // Hide all sections
    document.querySelectorAll('section[id]').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show the current section
    const targetSection = document.getElementById(hash);
    if (targetSection) {
      targetSection.style.display = 'block';
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update navigation active state
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
          link.classList.add('active');
        }
      });
      
      // Show notification
      this.showRouteNotification(hash);
    }
    
    // Execute route handler if exists
    if (this.routes[hash]) {
      this.routes[hash]();
    }
  }
  
  showRouteNotification(route) {
    const routeNames = {
      'registration': 'Registration Form',
      'submissions': 'Recent Submissions',
      'about': 'About Project'
    };
    
    const notification = document.createElement('div');
    notification.className = 'route-notification';
    notification.innerHTML = `
      <i class="bi bi-check-circle-fill me-2"></i>
      Navigated to: ${routeNames[route] || route}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
  
  navigate(path) {
    window.location.hash = path;
  }
}

// Initialize router
const router = new Router();

// Add route handlers
router.addRoute('registration', () => {
  console.log('📝 Registration route loaded');
});

router.addRoute('submissions', () => {
  console.log('📊 Submissions route loaded');
  loadSubmissions(); // Reload submissions when navigating to this section
});

router.addRoute('about', () => {
  console.log('ℹ️ About route loaded');
});

// ============================================
// TASK 4: DYNAMIC DOM MANIPULATION
// ============================================

// Create progress indicator dynamically
function createProgressIndicator() {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'form-progress-container';
  progressContainer.innerHTML = `
    <div class="form-progress-header">
      <h6 class="mb-2">Form Completion Progress</h6>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated" 
             role="progressbar" 
             id="formProgressBar"
             style="width: 0%">0%</div>
      </div>
    </div>
    <div class="progress-stats mt-3" id="progressStats">
      <div class="row text-center">
        <div class="col-4">
          <div class="stat-box">
            <h4 id="completedFields">0</h4>
            <small>Completed</small>
          </div>
        </div>
        <div class="col-4">
          <div class="stat-box">
            <h4 id="remainingFields">11</h4>
            <small>Remaining</small>
          </div>
        </div>
        <div class="col-4">
          <div class="stat-box">
            <h4 id="errorFields">0</h4>
            <small>Errors</small>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Insert at the top of the form
  const formBody = document.querySelector('#registrationForm').parentElement;
  formBody.insertBefore(progressContainer, form);
}

// Calculate and update form progress dynamically
function updateFormProgress() {
  const requiredFields = [firstName, lastName, email, phone, password, confirmPassword, age, country];
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  const termsChecked = terms.checked;
  
  let completed = 0;
  let errors = 0;
  
  // Check each required field
  requiredFields.forEach(field => {
    if (field.value.trim() !== '') {
      if (field.classList.contains('is-valid') || (!field.classList.contains('is-invalid') && field.value.trim() !== '')) {
        completed++;
      }
    }
    if (field.classList.contains('is-invalid')) {
      errors++;
    }
  });
  
  // Check gender and terms
  if (genderSelected) completed++;
  if (termsChecked) completed++;
  
  const total = requiredFields.length + 2; // +2 for gender and terms
  const percentage = Math.round((completed / total) * 100);
  
  // Update progress bar
  const progressBar = document.getElementById('formProgressBar');
  if (progressBar) {
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
    
    // Change color based on progress
    progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
    if (percentage < 33) {
      progressBar.classList.add('bg-danger');
    } else if (percentage < 66) {
      progressBar.classList.add('bg-warning');
    } else if (percentage < 100) {
      progressBar.classList.add('bg-info');
    } else {
      progressBar.classList.add('bg-success');
    }
  }
  
  // Update stats
  document.getElementById('completedFields').textContent = completed;
  document.getElementById('remainingFields').textContent = total - completed;
  document.getElementById('errorFields').textContent = errors;
}

// Create live validation summary
function createValidationSummary() {
  const summaryContainer = document.createElement('div');
  summaryContainer.id = 'validationSummary';
  summaryContainer.className = 'validation-summary';
  summaryContainer.style.display = 'none';
  summaryContainer.innerHTML = `
    <div class="alert alert-warning">
      <h6><i class="bi bi-exclamation-triangle me-2"></i>Please fix the following errors:</h6>
      <ul id="validationErrorList" class="mb-0 mt-2"></ul>
    </div>
  `;
  
  // Insert before submit button
  submitBtn.parentElement.insertBefore(summaryContainer, submitBtn);
}

// Update validation summary dynamically
function updateValidationSummary() {
  const summary = document.getElementById('validationSummary');
  const errorList = document.getElementById('validationErrorList');
  const errors = [];
  
  // Collect all visible errors
  document.querySelectorAll('.invalid-feedback.show').forEach(error => {
    if (error.textContent.trim()) {
      errors.push(error.textContent.trim());
    }
  });
  
  if (errors.length > 0) {
    errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    summary.style.display = 'block';
  } else {
    summary.style.display = 'none';
  }
}

// Create field strength indicators dynamically
function createFieldStrengthIndicator(field, rules) {
  const indicator = document.createElement('div');
  indicator.className = 'field-strength-indicator mt-2';
  indicator.id = `${field.id}StrengthIndicator`;
  
  const rulesList = rules.map(rule => `
    <div class="strength-rule" id="${field.id}_${rule.id}">
      <i class="bi bi-circle"></i>
      <span>${rule.label}</span>
    </div>
  `).join('');
  
  indicator.innerHTML = `<div class="strength-rules">${rulesList}</div>`;
  
  field.parentElement.appendChild(indicator);
}

// Update field strength dynamically
function updateFieldStrength(field, rules) {
  rules.forEach(rule => {
    const ruleElement = document.getElementById(`${field.id}_${rule.id}`);
    if (ruleElement) {
      const icon = ruleElement.querySelector('i');
      if (rule.test(field.value)) {
        icon.className = 'bi bi-check-circle-fill text-success';
        ruleElement.classList.add('valid');
      } else {
        icon.className = 'bi bi-x-circle-fill text-danger';
        ruleElement.classList.remove('valid');
      }
    }
  });
}

// Initialize dynamic elements
createProgressIndicator();
createValidationSummary();

// Create password strength rules
createFieldStrengthIndicator(password, [
  { id: 'length', label: 'At least 8 characters', test: (val) => val.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (val) => /[A-Z]/.test(val) },
  { id: 'lowercase', label: 'One lowercase letter', test: (val) => /[a-z]/.test(val) },
  { id: 'number', label: 'One number', test: (val) => /\d/.test(val) },
  { id: 'special', label: 'One special character', test: (val) => /[@$!%*?&]/.test(val) }
]);

// ============================================
// ENHANCED VALIDATION WITH DOM UPDATES
// ============================================

// Real-time validation with dynamic updates
function validateField(field, errorId, validationFn, errorMsg) {
  const errorElement = document.getElementById(errorId);
  const isValid = validationFn();
  
  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    errorElement.classList.remove('show');
    
    // Add success animation
    field.style.animation = 'none';
    setTimeout(() => {
      field.style.animation = 'shake-success 0.3s';
    }, 10);
  } else {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    errorElement.textContent = errorMsg;
    errorElement.classList.add('show');
    
    // Add error animation
    field.style.animation = 'none';
    setTimeout(() => {
      field.style.animation = 'shake-error 0.3s';
    }, 10);
  }
  
  // Update progress and summary
  updateFormProgress();
  updateValidationSummary();
  
  return isValid;
}

// First name validation with DOM updates
firstName.addEventListener('input', () => {
  validateField(firstName, 'firstNameError', 
    () => firstName.value.trim().length >= 2,
    'First name must be at least 2 characters');
});

// Last name validation
lastName.addEventListener('input', () => {
  validateField(lastName, 'lastNameError', 
    () => lastName.value.trim().length >= 2,
    'Last name must be at least 2 characters');
});

// Email validation with suggestions
email.addEventListener('input', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = validateField(email, 'emailError', 
    () => emailRegex.test(email.value),
    'Please enter a valid email address');
    
  // Dynamic suggestion for common email domains
  if (!isValid && email.value.includes('@')) {
    const domain = email.value.split('@')[1];
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const suggestion = commonDomains.find(d => d.startsWith(domain));
    
    if (suggestion && domain !== suggestion) {
      const errorElement = document.getElementById('emailError');
      errorElement.innerHTML = `Did you mean: <strong>${email.value.split('@')[0]}@${suggestion}</strong>?`;
    }
  }
});

// Phone validation
phone.addEventListener('input', () => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  validateField(phone, 'phoneError', 
    () => phoneRegex.test(phone.value),
    'Please enter a valid phone number');
});

// Enhanced password strength checker with DOM updates
password.addEventListener('input', () => {
  const val = password.value;
  const strengthIndicator = document.getElementById('passwordStrength');
  
  // Update individual rules
  updateFieldStrength(password, [
    { id: 'length', label: 'At least 8 characters', test: (val) => val.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (val) => /[A-Z]/.test(val) },
    { id: 'lowercase', label: 'One lowercase letter', test: (val) => /[a-z]/.test(val) },
    { id: 'number', label: 'One number', test: (val) => /\d/.test(val) },
    { id: 'special', label: 'One special character', test: (val) => /[@$!%*?&]/.test(val) }
  ]);
  
  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[a-z]/.test(val)) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/\d/.test(val)) strength++;
  if (/[@$!%*?&]/.test(val)) strength++;

  if (val.length === 0) {
    strengthIndicator.textContent = '';
  } else if (strength <= 2) {
    strengthIndicator.innerHTML = '<span class="badge bg-danger">❌ Weak password</span>';
  } else if (strength <= 4) {
    strengthIndicator.innerHTML = '<span class="badge bg-warning">⚠️ Medium password</span>';
  } else {
    strengthIndicator.innerHTML = '<span class="badge bg-success">✅ Strong password</span>';
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  validateField(password, 'passwordError', 
    () => passwordRegex.test(val),
    'Password must meet all requirements');
});

// Confirm password validation with dynamic matching indicator
confirmPassword.addEventListener('input', () => {
  const matches = confirmPassword.value === password.value && password.value !== '';
  validateField(confirmPassword, 'confirmPasswordError', 
    () => matches,
    'Passwords do not match');
    
  // Show real-time matching status
  if (confirmPassword.value.length > 0) {
    const matchIndicator = document.createElement('div');
    matchIndicator.className = 'match-indicator';
    matchIndicator.innerHTML = matches ? 
      '<i class="bi bi-check-circle-fill text-success"></i> Passwords match' :
      '<i class="bi bi-x-circle-fill text-danger"></i> Passwords do not match';
  }
});

// Age validation with suggestions
age.addEventListener('input', () => {
  const ageVal = parseInt(age.value);
  const isValid = validateField(age, 'ageError', 
    () => ageVal >= 18 && ageVal <= 120,
    'Age must be between 18 and 120');
    
  // Dynamic age category display
  if (isValid) {
    let category = '';
    if (ageVal >= 18 && ageVal < 30) category = 'Young Adult';
    else if (ageVal >= 30 && ageVal < 50) category = 'Adult';
    else if (ageVal >= 50 && ageVal < 65) category = 'Middle Age';
    else category = 'Senior';
    
    const ageCategory = document.createElement('small');
    ageCategory.className = 'text-muted d-block mt-1';
    ageCategory.textContent = `Category: ${category}`;
    
    // Remove existing category if any
    const existing = age.parentElement.querySelector('.text-muted');
    if (existing && existing !== document.getElementById('ageError')) {
      existing.remove();
    }
    
    age.parentElement.appendChild(ageCategory);
  }
});

// Country validation with flag emoji
country.addEventListener('change', () => {
  validateField(country, 'countryError', 
    () => country.value !== '',
    'Please select a country');
    
  // Add flag emoji dynamically
  const flags = {
    'USA': '🇺🇸',
    'UK': '🇬🇧',
    'Canada': '🇨🇦',
    'India': '🇮🇳',
    'Australia': '🇦🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷'
  };
  
  if (country.value && flags[country.value]) {
    const flagSpan = document.createElement('span');
    flagSpan.className = 'country-flag ms-2';
    flagSpan.textContent = flags[country.value];
    
    // Remove existing flag
    const existingFlag = country.parentElement.querySelector('.country-flag');
    if (existingFlag) existingFlag.remove();
    
    country.parentElement.querySelector('.input-group-text').textContent = flags[country.value];
  }
});

// Gender validation with DOM updates
const genderInputs = document.querySelectorAll('input[name="gender"]');
genderInputs.forEach(input => {
  input.addEventListener('change', () => {
    const genderError = document.getElementById('genderError');
    const isSelected = document.querySelector('input[name="gender"]:checked');
    if (isSelected) {
      genderError.classList.remove('show');
      
      // Add visual feedback
      genderInputs.forEach(inp => {
        const label = inp.nextElementSibling;
        if (inp.checked) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });
    }
    updateFormProgress();
    updateValidationSummary();
  });
});

// Terms validation with animation
terms.addEventListener('change', () => {
  const termsError = document.getElementById('termsError');
  if (terms.checked) {
    termsError.classList.remove('show');
    
    // Show thank you message
    const thankYou = document.createElement('small');
    thankYou.className = 'text-success d-block mt-2 animate-fade-in';
    thankYou.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Thank you for agreeing!';
    terms.parentElement.appendChild(thankYou);
    
    setTimeout(() => thankYou.remove(), 3000);
  } else {
    termsError.classList.add('show');
  }
  updateFormProgress();
  updateValidationSummary();
});

// Character counter with dynamic color changes
bio.addEventListener('input', () => {
  const count = bio.value.length;
  charCount.textContent = count + ' / 500 characters';
  
  if (count >= 450) {
    charCount.style.color = '#dc3545';
    charCount.innerHTML = `<i class="bi bi-exclamation-triangle me-1"></i>${count} / 500 characters`;
  } else if (count >= 400) {
    charCount.style.color = '#ffc107';
    charCount.innerHTML = `<i class="bi bi-info-circle me-1"></i>${count} / 500 characters`;
  } else {
    charCount.style.color = '#666';
    charCount.textContent = count + ' / 500 characters';
  }
  
  // Show word count dynamically
  const words = bio.value.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (words > 0) {
    const wordCount = document.createElement('small');
    wordCount.className = 'text-muted d-block';
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    
    const existing = bio.parentElement.querySelector('small.text-muted:last-child');
    if (existing && existing !== charCount) {
      existing.remove();
    }
    bio.parentElement.appendChild(wordCount);
  }
});

// Form submission with enhanced validation
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validating...';
  
  // Validate all fields
  let isValid = true;
  
  if (firstName.value.trim().length < 2) {
    validateField(firstName, 'firstNameError', () => false, 'First name must be at least 2 characters');
    isValid = false;
  }
  
  if (lastName.value.trim().length < 2) {
    validateField(lastName, 'lastNameError', () => false, 'Last name must be at least 2 characters');
    isValid = false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    validateField(email, 'emailError', () => false, 'Please enter a valid email address');
    isValid = false;
  }
  
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  if (!phoneRegex.test(phone.value)) {
    validateField(phone, 'phoneError', () => false, 'Please enter a valid phone number');
    isValid = false;
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password.value)) {
    validateField(password, 'passwordError', () => false, 'Password doesn\'t meet requirements');
    isValid = false;
  }
  
  if (password.value !== confirmPassword.value) {
    validateField(confirmPassword, 'confirmPasswordError', () => false, 'Passwords do not match');
    isValid = false;
  }
  
  const ageVal = parseInt(age.value);
  if (ageVal < 18 || ageVal > 120) {
    validateField(age, 'ageError', () => false, 'Age must be between 18 and 120');
    isValid = false;
  }
  
  if (country.value === '') {
    validateField(country, 'countryError', () => false, 'Please select a country');
    isValid = false;
  }
  
  const genderSelected = document.querySelector('input[name="gender"]:checked');
  if (!genderSelected) {
    document.getElementById('genderError').classList.add('show');
    isValid = false;
  }
  
  if (!terms.checked) {
    document.getElementById('termsError').classList.add('show');
    isValid = false;
  }
  
  if (isValid) {
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    
    // Simulate processing time with animation
    setTimeout(() => {
      form.submit();
    }, 1000);
  } else {
    // Scroll to first error
    const firstError = document.querySelector('.is-invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
    
    // Show error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    errorNotification.style.zIndex = '9999';
    errorNotification.innerHTML = `
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>Validation Failed!</strong> Please fix all errors before submitting.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(errorNotification);
    
    setTimeout(() => errorNotification.remove(), 5000);
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Submit Registration';
  }
});

// Update progress on page load
updateFormProgress();