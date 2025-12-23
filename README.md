# 🎯 Cognifyz Fullstack Registration Platform

A comprehensive fullstack web application demonstrating modern web development practices with Node.js/Express backend, HTML5/CSS3/Bootstrap frontend, and a complete RESTful API with CRUD operations.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Validation Rules](#validation-rules)
- [Data Storage](#data-storage)
- [Screenshots](#screenshots)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎨 Project Overview

**Cognifyz Registration Platform** is a fullstack application that allows users to register with comprehensive form validation, data management, and API interaction capabilities. The project demonstrates:

- ✅ **Frontend Development** - Responsive UI with HTML, CSS, and Bootstrap
- ✅ **Backend Development** - Express.js server with middleware and routing
- ✅ **Validation** - Client-side and server-side validation
- ✅ **RESTful API Design** - Complete CRUD operations with JSON responses
- ✅ **Data Persistence** - In-memory storage with unique IDs
- ✅ **CORS Handling** - Cross-origin resource sharing configuration
- ✅ **Security** - Password strength requirements and input sanitization

---

## ✨ Features

### 🔐 Registration Form
- **Personal Information:**
  - First Name & Last Name (required, min 2 characters)
  - Email (required, valid format validation)
  - Phone (required, 10+ digits)
  - Age (18-120 years)
  - Country (dropdown selection)
  - Gender (radio buttons)

- **Security:**
  - Strong Password Requirements (8+ chars, uppercase, lowercase, digit, special char)
  - Password Confirmation
  - Terms & Conditions Agreement

- **Additional Fields:**
  - Interests (checkboxes)
  - Bio (optional textarea)

### 🎛️ Validation System
- **Real-time Client-Side Validation** - Instant feedback as users type
- **Server-Side Validation** - Secure backend validation
- **Regex Patterns** - Email, phone, password format validation
- **Error Messages** - Clear, user-friendly error descriptions

### 📊 Data Management
- **Recent Submissions Display** - Shows last 5 submissions on home page
- **Automatic ID Generation** - Each submission gets unique ID
- **Timestamp Tracking** - Created, updated timestamps for all entries
- **Data Sanitization** - Trim whitespace, lowercase emails

### 🔌 RESTful API
- **Complete CRUD Operations** - Create, Read, Update, Delete
- **Advanced Filtering** - Filter by country, gender, age range
- **Search Functionality** - Search by name or email
- **Pagination** - Handle large datasets with page/limit
- **Statistics** - Get submission analytics and demographics
- **Bulk Operations** - Delete multiple submissions at once

### 📱 Responsive Design
- **Bootstrap 5 Framework** - Mobile-first design
- **Mobile Optimized** - Works perfectly on all devices
- **Smooth Animations** - Fade-in and slide-up effects
- **Professional UI** - Gradient backgrounds and modern styling

### 📖 Additional Pages
- **Terms & Conditions Page** - Detailed T&C information
- **API Dashboard** - Interactive API management interface
- **Success Page** - Confirmation after registration

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | Latest |
| **Backend Framework** | Express.js | 5.2.1 |
| **Frontend Framework** | Bootstrap | 5.3.0 |
| **Icons** | Bootstrap Icons | 1.11.0 |
| **Data Storage** | In-Memory Array | - |
| **Database** | Mongoose (ready) | 9.0.2 |
| **Environment** | dotenv | 17.2.3 |

---

## 📁 Project Structure

```
cognifyz/
│
├── server.js                          # Main Express server & API routes
├── package.json                       # Project dependencies
├── package-lock.json                  # Dependency lock file
├── README.md                          # This file
├── .gitignore                         # Git ignore configuration
│
├── views/                             # Server-rendered HTML pages
│   ├── index.html                    # Main registration form page
│   ├── success.html                  # Success page (optional)
│   └── terms.html                    # Terms & Conditions page
│
├── public/                            # Static files served to client
│   ├── api-dashboard.html            # Interactive API management dashboard
│   │
│   ├── css/
│   │   └── styles.css                # Custom styling & animations
│   │
│   └── js/
│       ├── validation.js             # Client-side form validation
│       └── api-client.js             # API interaction functions
│
└── node_modules/                      # Installed dependencies (auto-generated)
```

---

## 💻 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### Step 1: Clone the Repository
```bash
git clone https://github.com/LavanyaBhadakwade/cognifyz-fullstack-internship.git
cd cognifyz
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication tokens
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables

### Step 3: Verify Installation
```bash
npm list
```

---

## 🚀 Running the Application

### Start the Server
```bash
node server.js
```

**Expected Output:**
```
✨ Server is running on http://localhost:3000

📊 RESTful API Endpoints (Task 5):
   CREATE:  POST   http://localhost:3000/api/submissions
   READ:    GET    http://localhost:3000/api/submissions
   READ:    GET    http://localhost:3000/api/submissions/:id
   UPDATE:  PUT    http://localhost:3000/api/submissions/:id
   UPDATE:  PATCH  http://localhost:3000/api/submissions/:id
   DELETE:  DELETE http://localhost:3000/api/submissions/:id
   STATS:   GET    http://localhost:3000/api/stats
   BULK:    POST   http://localhost:3000/api/submissions/bulk-delete

🎯 All Tasks 1-5 Features Implemented:
   ✅ Task 1: HTML Structure & Server-Side Rendering
   ✅ Task 2: Inline Styles & Validation
   ✅ Task 3: Advanced CSS & Responsive Design
   ✅ Task 4: Complex Validation & DOM Manipulation
   ✅ Task 5: RESTful API & CRUD Operations
```

### Access the Application

| Page | URL | Purpose |
|------|-----|---------|
| **Home/Registration** | `http://localhost:3000/` | Main registration form |
| **API Dashboard** | `http://localhost:3000/api-dashboard.html` | API management interface |
| **Terms & Conditions** | `http://localhost:3000/views/terms.html` | T&C page |

### Stop the Server
Press `Ctrl + C` in the terminal

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. CREATE - Add New Submission
```http
POST /api/submissions
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "password": "Secure@Pass123",
  "age": 25,
  "country": "USA",
  "gender": "Male",
  "interests": ["Technology", "Sports"],
  "bio": "Software Developer"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "age": 25,
    "country": "USA",
    "gender": "Male",
    "interests": ["Technology", "Sports"],
    "bio": "Software Developer",
    "timestamp": "2025-12-24T10:30:00.000Z",
    "createdAt": "2025-12-24T10:30:00.000Z",
    "updatedAt": "2025-12-24T10:30:00.000Z"
  }
}
```

---

### 2. READ - Get All Submissions
```http
GET /api/submissions?page=1&limit=10&country=USA&minAge=20&maxAge=30&search=john
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
| `country` | string | Filter by country |
| `gender` | string | Filter by gender |
| `minAge` | number | Minimum age filter |
| `maxAge` | number | Maximum age filter |
| `search` | string | Search by name or email |

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "data": [
    { /* submission 1 */ },
    { /* submission 2 */ }
  ]
}
```

---

### 3. READ - Get Single Submission
```http
GET /api/submissions/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* submission details */ }
}
```

**If Not Found (404):**
```json
{
  "success": false,
  "message": "Submission not found"
}
```

---

### 4. UPDATE - Full Replacement (PUT)
```http
PUT /api/submissions/1
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1-555-567-8901",
  "age": 28,
  "country": "Canada",
  "gender": "Female",
  "interests": ["Design", "Music"],
  "bio": "UI/UX Designer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submission updated successfully",
  "data": { /* updated submission */ }
}
```

---

### 5. UPDATE - Partial Update (PATCH)
```http
PATCH /api/submissions/1
Content-Type: application/json

{
  "email": "newemail@example.com",
  "age": 30,
  "bio": "Updated bio"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submission updated partially",
  "data": { /* updated submission */ }
}
```

---

### 6. DELETE - Remove Submission
```http
DELETE /api/submissions/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Submission deleted successfully",
  "data": { /* deleted submission */ }
}
```

---

### 7. GET - Submission Statistics
```http
GET /api/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "byCountry": {
      "USA": 5,
      "Canada": 3,
      "UK": 2
    },
    "byGender": {
      "Male": 6,
      "Female": 4
    },
    "averageAge": 26.5,
    "ageDistribution": {
      "18-25": 4,
      "26-35": 5,
      "36-50": 1,
      "51+": 0
    }
  }
}
```

---

### 8. DELETE - Bulk Delete Multiple
```http
POST /api/submissions/bulk-delete
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "3 submission(s) deleted successfully",
  "deletedCount": 3
}
```

---

## 📝 Usage Examples

### Using cURL (Command Line)

**Create a submission:**
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234567",
    "age": 25,
    "country": "USA",
    "gender": "Male"
  }'
```

**Get all submissions:**
```bash
curl http://localhost:3000/api/submissions
```

**Get specific submission:**
```bash
curl http://localhost:3000/api/submissions/1
```

**Update a submission:**
```bash
curl -X PUT http://localhost:3000/api/submissions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "email": "jane@example.com"
  }'
```

**Delete a submission:**
```bash
curl -X DELETE http://localhost:3000/api/submissions/1
```

---

### Using JavaScript (Fetch API)

**Create a submission:**
```javascript
async function createSubmission() {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1-555-1234567',
      age: 25,
      country: 'USA',
      gender: 'Male'
    })
  });
  const data = await response.json();
  console.log(data);
}
```

**Get all submissions with filters:**
```javascript
async function getSubmissions() {
  const response = await fetch(
    '/api/submissions?country=USA&minAge=20&maxAge=30&page=1&limit=5'
  );
  const data = await response.json();
  console.log(data);
}
```

**Update a submission:**
```javascript
async function updateSubmission(id) {
  const response = await fetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'newemail@example.com',
      age: 30
    })
  });
  const data = await response.json();
  console.log(data);
}
```

**Delete a submission:**
```javascript
async function deleteSubmission(id) {
  const response = await fetch(`/api/submissions/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data);
}
```

---

## ✅ Validation Rules

| Field | Rules | Example |
|-------|-------|---------|
| **First Name** | Min 2 chars, required | "John" ✅ |
| **Last Name** | Min 2 chars, required | "Doe" ✅ |
| **Email** | Valid format, required | "john@example.com" ✅ |
| **Phone** | 10+ digits/chars, optional +/-, required | "+1-555-123-4567" ✅ |
| **Password** | 8+ chars, uppercase, lowercase, digit, special | "Pass@123" ✅ |
| **Age** | 18-120 years, required | "25" ✅ |
| **Country** | Must be selected, required | "USA" ✅ |
| **Gender** | Must be selected, required | "Male" ✅ |
| **Terms** | Must be accepted, required | "checked" ✅ |

### Password Requirements
A valid password must contain:
- ✅ At least 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one digit (0-9)
- ✅ At least one special character (@$!%*?&)

**Valid Examples:**
- `Password@123` ✅
- `Secure#Pass99` ✅
- `MyP@ssw0rd` ✅

**Invalid Examples:**
- `password123` ❌ (no uppercase)
- `PASSWORD@123` ❌ (no lowercase)
- `Password@abc` ❌ (no digit)
- `Password123` ❌ (no special char)
- `Pass@1` ❌ (less than 8 chars)

---

## 💾 Data Storage

### Current Implementation (In-Memory)
```javascript
let submissions = [];        // Array storing all submissions
let submissionIdCounter = 1; // Auto-incrementing ID counter
```

**Characteristics:**
- ✅ Fast performance (no database queries)
- ✅ Simple to understand and implement
- ❌ Data lost on server restart
- ❌ Single instance only
- ❌ Not suitable for production

### Data Structure
```javascript
{
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1-555-123-4567",
  age: 25,
  country: "USA",
  gender: "Male",
  interests: ["Technology", "Sports"],
  bio: "Software Developer",
  timestamp: "2025-12-24T10:30:00.000Z",
  createdAt: "2025-12-24T10:30:00.000Z",
  updatedAt: "2025-12-24T10:30:00.000Z"
}
```

---

## 📸 Screenshots

![Registration Page](Screenshots/home.png)
![API Dashboard](Screenshots/api-dashboard.png)
![Terms & Conditions](Screenshots/terms.png)

### Home Page - Registration Form
- Responsive navigation bar
- Hero section with call-to-action
- Feature cards highlighting key features
- Comprehensive registration form
- Recent submissions display

### API Dashboard
- Interactive API endpoint testing
- Create/Read/Update/Delete interface
- Real-time JSON response viewer
- Submission management table
- Filter and search capabilities

### Terms & Conditions
- Professional styling
- Detailed T&C content
- Navigation back to home
- Accessible and responsive layout

---

## 🎓 Learning Outcomes

This project teaches you:

### Backend Development
- ✅ Express.js routing and middleware
- ✅ Request/response handling
- ✅ CORS configuration
- ✅ Data validation and sanitization
- ✅ RESTful API design principles

### Frontend Development
- ✅ HTML5 semantic markup
- ✅ CSS3 animations and gradients
- ✅ Bootstrap responsive framework
- ✅ Form validation with JavaScript
- ✅ Fetch API for HTTP requests

### Full-Stack Integration
- ✅ Client-server communication
- ✅ Form submission handling
- ✅ Data persistence (in-memory)
- ✅ Error handling and user feedback
- ✅ API testing and debugging

### Best Practices
- ✅ Code organization and structure
- ✅ Error handling patterns
- ✅ Security considerations
- ✅ Code comments and documentation
- ✅ Git version control

---

## 🚀 Future Enhancements

### Database Integration
- [ ] MongoDB/Mongoose setup
- [ ] Persistent data storage
- [ ] Database indexing for performance
- [ ] Backup and recovery procedures

### Authentication & Authorization
- [ ] User login system
- [ ] JWT token-based auth
- [ ] Role-based access control (RBAC)
- [ ] Password reset functionality

### Advanced Features
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Export to CSV/PDF
- [ ] Data visualization charts

### Deployment
- [ ] Heroku deployment
- [ ] Docker containerization
- [ ] GitHub Actions CI/CD
- [ ] Environment configuration
- [ ] Production optimization

### Frontend Enhancements
- [ ] React/Vue.js frontend
- [ ] Real-time updates with WebSockets
- [ ] Image upload functionality
- [ ] Progressive Web App (PWA)
- [ ] Dark mode theme

### Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] API testing (Postman)
- [ ] E2E testing (Cypress)
- [ ] Load testing

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/LavanyaBhadakwade/cognifyz-fullstack-internship.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**
   - Keep code clean and well-commented
   - Follow existing code style
   - Test your changes

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 📞 Contact & Support

- **GitHub:** [@LavanyaBhadakwade](https://github.com/LavanyaBhadakwade)
- **Repository:** [cognifyz-fullstack-internship](https://github.com/LavanyaBhadakwade/cognifyz-fullstack-internship)
- **Issues:** [Report Issues](https://github.com/LavanyaBhadakwade/cognifyz-fullstack-internship/issues)

---

## 📚 Resources & References

- [Express.js Documentation](https://expressjs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [RESTful API Best Practices](https://restfulapi.net/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 🎉 Acknowledgments

- **Cognifyz Technologies** - Internship Program
- **Bootstrap** - CSS Framework
- **Node.js Community** - Open Source Tools
- **All Contributors** - For their support and feedback

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Lines of Backend Code** | 575+ |
| **HTML Pages** | 3 |
| **API Endpoints** | 8 |
| **Validation Rules** | 9 |
| **Supported HTTP Methods** | 5 (GET, POST, PUT, PATCH, DELETE) |
| **Response Formats** | JSON |
| **Mobile Responsive** | ✅ Yes |
| **Browser Compatibility** | Chrome, Firefox, Safari, Edge |

---

**Last Updated:** December 24, 2025

**Version:** 1.0.0 (Completed Tasks 1-5)

---
