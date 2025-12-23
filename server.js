// server.js - UPDATED FOR TASK 5: RESTful API with CRUD Operations

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// CORS middleware for API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Store submissions in memory
let submissions = [];
let submissionIdCounter = 1;

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateSubmissionData = (data) => {
  const errors = [];
  
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  if (!validateEmail(data.email)) {
    errors.push('Invalid email address');
  }
  
  if (!validatePhone(data.phone)) {
    errors.push('Invalid phone number');
  }
  
  if (data.password && !validatePassword(data.password)) {
    errors.push('Password does not meet security requirements');
  }
  
  const ageNum = parseInt(data.age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
    errors.push('Age must be between 18 and 120');
  }
  
  if (!data.country) {
    errors.push('Country is required');
  }
  
  if (!data.gender) {
    errors.push('Gender is required');
  }
  
  return errors;
};

// ============================================
// TASK 5: RESTful API ENDPOINTS (CRUD Operations)
// ============================================

// CREATE - Add new submission (POST)
app.post('/api/submissions', (req, res) => {
  const { firstName, lastName, email, phone, password, age, country, gender, interests, bio } = req.body;
  
  // Validate data
  const errors = validateSubmissionData(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
      message: 'Validation failed'
    });
  }
  
  // Create new submission
  const submission = {
    id: submissionIdCounter++,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    age: parseInt(age),
    country,
    gender,
    interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
    bio: bio ? bio.trim() : '',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  submissions.push(submission);
  
  res.status(201).json({
    success: true,
    message: 'Submission created successfully',
    data: submission
  });
});

// READ - Get all submissions (GET)
app.get('/api/submissions', (req, res) => {
  // Support query parameters for filtering and pagination
  const { page = 1, limit = 10, country, gender, minAge, maxAge, search } = req.query;
  
  let filteredSubmissions = [...submissions];
  
  // Filter by country
  if (country) {
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.country.toLowerCase() === country.toLowerCase()
    );
  }
  
  // Filter by gender
  if (gender) {
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.gender.toLowerCase() === gender.toLowerCase()
    );
  }
  
  // Filter by age range
  if (minAge) {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.age >= parseInt(minAge));
  }
  if (maxAge) {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.age <= parseInt(maxAge));
  }
  
  // Search by name or email
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.firstName.toLowerCase().includes(searchLower) ||
      sub.lastName.toLowerCase().includes(searchLower) ||
      sub.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: filteredSubmissions.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredSubmissions.length / limit),
    data: paginatedSubmissions
  });
});

// READ - Get single submission by ID (GET)
app.get('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const submission = submissions.find(sub => sub.id === id);
  
  if (submission) {
    res.json({
      success: true,
      data: submission
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
});

// UPDATE - Update entire submission (PUT)
app.put('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
  
  // Validate data
  const errors = validateSubmissionData(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
      message: 'Validation failed'
    });
  }
  
  // Update submission
  const { firstName, lastName, email, phone, age, country, gender, interests, bio } = req.body;
  
  submissions[index] = {
    ...submissions[index],
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    age: parseInt(age),
    country,
    gender,
    interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
    bio: bio ? bio.trim() : '',
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Submission updated successfully',
    data: submissions[index]
  });
});

// UPDATE - Partially update submission (PATCH)
app.patch('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
  
  // Update only provided fields
  const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'country', 'gender', 'interests', 'bio'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  submissions[index] = {
    ...submissions[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Submission updated partially',
    data: submissions[index]
  });
});

// DELETE - Delete submission (DELETE)
app.delete('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = submissions.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
  
  const deletedSubmission = submissions.splice(index, 1)[0];
  
  res.json({
    success: true,
    message: 'Submission deleted successfully',
    data: deletedSubmission
  });
});

// STATISTICS - Get submission statistics (GET)
app.get('/api/stats', (req, res) => {
  const stats = {
    total: submissions.length,
    byCountry: {},
    byGender: {},
    averageAge: 0,
    ageDistribution: {
      '18-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51+': 0
    }
  };
  
  let totalAge = 0;
  
  submissions.forEach(sub => {
    // Count by country
    stats.byCountry[sub.country] = (stats.byCountry[sub.country] || 0) + 1;
    
    // Count by gender
    stats.byGender[sub.gender] = (stats.byGender[sub.gender] || 0) + 1;
    
    // Age statistics
    totalAge += sub.age;
    
    if (sub.age >= 18 && sub.age <= 25) stats.ageDistribution['18-25']++;
    else if (sub.age >= 26 && sub.age <= 35) stats.ageDistribution['26-35']++;
    else if (sub.age >= 36 && sub.age <= 50) stats.ageDistribution['36-50']++;
    else stats.ageDistribution['51+']++;
  });
  
  stats.averageAge = submissions.length > 0 ? (totalAge / submissions.length).toFixed(1) : 0;
  
  res.json({
    success: true,
    data: stats
  });
});

// BULK DELETE - Delete multiple submissions
app.post('/api/submissions/bulk-delete', (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or empty IDs array'
    });
  }
  
  const deletedCount = ids.reduce((count, id) => {
    const index = submissions.findIndex(sub => sub.id === id);
    if (index !== -1) {
      submissions.splice(index, 1);
      return count + 1;
    }
    return count;
  }, 0);
  
  res.json({
    success: true,
    message: `${deletedCount} submission(s) deleted successfully`,
    deletedCount
  });
});

// ============================================
// EXISTING ROUTES (Keep for backward compatibility)
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/views/terms.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'terms.html'));
});

app.post('/submit', (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword, age, country, gender, interests, bio, terms } = req.body;
  
  // Server-side validation
  const errors = [];
  
  if (!firstName || firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  
  if (!lastName || lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }
  
  if (!validateEmail(email)) {
    errors.push('Invalid email address');
  }
  
  if (!validatePhone(phone)) {
    errors.push('Invalid phone number');
  }
  
  if (!validatePassword(password)) {
    errors.push('Password does not meet security requirements');
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
    errors.push('Age must be between 18 and 120');
  }
  
  if (!country) {
    errors.push('Country is required');
  }
  
  if (!gender) {
    errors.push('Gender is required');
  }
  
  if (!terms) {
    errors.push('You must agree to the terms and conditions');
  }
  
  if (errors.length > 0) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation Errors</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <div class="container">
          <div class="error-card animate-fade-in">
            <div class="error-icon">❌</div>
            <h1 class="text-danger">Validation Failed</h1>
            <p class="text-center text-muted mb-4">Please correct the following errors:</p>
            <div class="alert alert-warning">
              <ul class="mb-0">${errors.map(error => `<li>${error}</li>`).join('')}</ul>
            </div>
            <a href="/" class="btn btn-primary btn-lg w-100">← Go Back and Fix Errors</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
  
  const submission = {
    id: submissionIdCounter++,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    age: ageNum,
    country,
    gender,
    interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
    bio: bio ? bio.trim() : '',
    timestamp: new Date().toLocaleString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  submissions.push(submission);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Success</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <div class="container">
        <div class="success-card animate-fade-in">
          <div class="success-icon">✅</div>
          <h1 class="text-success">Registration Successful!</h1>
          <p class="text-center text-muted mb-4">Your data has been validated and stored successfully.</p>
          
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Registration Details</h5>
            </div>
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Registration ID:</div>
                <div class="col-md-8">#${submission.id}</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Name:</div>
                <div class="col-md-8">${submission.firstName} ${submission.lastName}</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Email:</div>
                <div class="col-md-8">${submission.email}</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Phone:</div>
                <div class="col-md-8">${submission.phone}</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Age:</div>
                <div class="col-md-8">${submission.age} years</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Country:</div>
                <div class="col-md-8">${submission.country}</div>
              </div>
              <div class="row mb-2">
                <div class="col-md-4 fw-bold text-primary">Gender:</div>
                <div class="col-md-8">${submission.gender}</div>
              </div>
              ${submission.interests.length > 0 ? `
                <div class="row mb-2">
                  <div class="col-md-4 fw-bold text-primary">Interests:</div>
                  <div class="col-md-8">
                    ${submission.interests.map(interest => `<span class="badge bg-info me-1">${interest}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${submission.bio ? `
                <div class="row mb-2">
                  <div class="col-md-4 fw-bold text-primary">Bio:</div>
                  <div class="col-md-8">${submission.bio}</div>
                </div>
              ` : ''}
              <div class="row">
                <div class="col-md-4 fw-bold text-primary">Submitted:</div>
                <div class="col-md-8">${submission.timestamp}</div>
              </div>
            </div>
          </div>
          
          <div class="alert alert-success mt-4">
            <strong>✓ Server-side validation passed</strong><br>
            <small>All data has been validated and securely stored in temporary server memory.</small>
          </div>
          
          <a href="/" class="btn btn-primary btn-lg w-100 mt-3">← Register Another User</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
  console.log(`\n📊 RESTful API Endpoints (Task 5):`);
  console.log(`   CREATE:  POST   http://localhost:${PORT}/api/submissions`);
  console.log(`   READ:    GET    http://localhost:${PORT}/api/submissions`);
  console.log(`   READ:    GET    http://localhost:${PORT}/api/submissions/:id`);
  console.log(`   UPDATE:  PUT    http://localhost:${PORT}/api/submissions/:id`);
  console.log(`   UPDATE:  PATCH  http://localhost:${PORT}/api/submissions/:id`);
  console.log(`   DELETE:  DELETE http://localhost:${PORT}/api/submissions/:id`);
  console.log(`   STATS:   GET    http://localhost:${PORT}/api/stats`);
  console.log(`   BULK:    POST   http://localhost:${PORT}/api/submissions/bulk-delete`);
  console.log(`\n🎯 All Tasks 1-5 Features Implemented:`);
  console.log(`   ✅ Task 1: HTML Structure & Server-Side Rendering`);
  console.log(`   ✅ Task 2: Inline Styles & Validation`);
  console.log(`   ✅ Task 3: Advanced CSS & Responsive Design`);
  console.log(`   ✅ Task 4: Complex Validation & DOM Manipulation`);
  console.log(`   ✅ Task 5: RESTful API & CRUD Operations`);
});