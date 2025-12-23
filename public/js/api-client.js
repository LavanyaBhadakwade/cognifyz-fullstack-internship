// public/js/api-client.js - TASK 5: Front-End API Interaction

const API_BASE_URL = '/api';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Display API response in JSON viewer
function displayResponse(data, success = true) {
  const responseDiv = document.getElementById('apiResponse');
  const statusClass = success ? 'text-success' : 'text-danger';
  const statusIcon = success ? '✅' : '❌';
  
  responseDiv.innerHTML = `
    <div class="${statusClass} mb-2">
      <strong>${statusIcon} ${success ? 'Success' : 'Error'}</strong>
    </div>
    <pre class="mb-0">${JSON.stringify(data, null, 2)}</pre>
  `;
}

// Show notification toast
function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 5000);
}

// ============================================
// CRUD OPERATIONS
// ============================================

// CREATE - Add new submission
async function createSubmission() {
  const form = document.getElementById('createForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Add required fields for validation
  data.password = 'Test@123'; // Dummy password for API
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      showNotification(`Submission #${result.data.id} created successfully!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
      form.reset();
      refreshData();
    } else {
      displayResponse(result, false);
      showNotification('Creation failed: ' + result.errors.join(', '), 'danger');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error creating submission', 'danger');
  }
}

// READ ALL - Fetch all submissions
async function fetchAllSubmissions(page = 1, filters = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams({
      page: page,
      limit: 10,
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/submissions?${queryParams}`);
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      renderDataTable(result.data);
      renderPagination(result.page, result.totalPages);
      showNotification(`Fetched ${result.count} submissions`, 'info');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error fetching submissions', 'danger');
  }
}

// READ ONE - Fetch single submission
async function fetchOneSubmission() {
  const id = document.getElementById('readId').value;
  
  if (!id) {
    showNotification('Please enter an ID', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`);
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      showNotification(`Fetched submission #${id}`, 'success');
    } else {
      displayResponse(result, false);
      showNotification('Submission not found', 'danger');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error fetching submission', 'danger');
  }
}

// UPDATE - Update entire submission
async function updateSubmission(id) {
  const submission = await getSubmissionById(id);
  
  if (!submission) return;
  
  // Create a simple prompt-based update (you can create a modal for better UX)
  const firstName = prompt('First Name:', submission.firstName);
  const lastName = prompt('Last Name:', submission.lastName);
  const email = prompt('Email:', submission.email);
  const phone = prompt('Phone:', submission.phone);
  const age = prompt('Age:', submission.age);
  
  if (!firstName || !lastName || !email || !phone || !age) {
    showNotification('Update cancelled', 'info');
    return;
  }
  
  const data = {
    firstName,
    lastName,
    email,
    phone,
    age: parseInt(age),
    country: submission.country,
    gender: submission.gender,
    password: 'Test@123' // Dummy password
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      showNotification(`Submission #${id} updated successfully!`, 'success');
      refreshData();
    } else {
      displayResponse(result, false);
      showNotification('Update failed', 'danger');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error updating submission', 'danger');
  }
}

// PARTIAL UPDATE - Patch submission
async function patchSubmission(id) {
  const field = prompt('Field to update (firstName, lastName, email, phone, age, bio):', 'firstName');
  const value = prompt(`New value for ${field}:`);
  
  if (!field || !value) {
    showNotification('Patch cancelled', 'info');
    return;
  }
  
  const data = { [field]: value };
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      showNotification(`Submission #${id} patched successfully!`, 'success');
      refreshData();
    } else {
      displayResponse(result, false);
      showNotification('Patch failed', 'danger');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error patching submission', 'danger');
  }
}

// DELETE - Delete submission
async function deleteSubmission(id = null) {
  const submissionId = id || document.getElementById('deleteId').value;
  
  if (!submissionId) {
    showNotification('Please enter an ID', 'warning');
    return;
  }
  
  if (!confirm(`Are you sure you want to delete submission #${submissionId}?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      showNotification(`Submission #${submissionId} deleted successfully!`, 'success');
      refreshData();
    } else {
      displayResponse(result, false);
      showNotification('Delete failed', 'danger');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error deleting submission', 'danger');
  }
}

// ============================================
// STATISTICS
// ============================================

// Fetch and display statistics
async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const result = await response.json();
    
    if (result.success) {
      displayResponse(result, true);
      updateStatsDashboard(result.data);
      showNotification('Statistics fetched successfully', 'success');
    }
  } catch (error) {
    displayResponse({ error: error.message }, false);
    showNotification('Error fetching statistics', 'danger');
  }
}

// Update statistics dashboard
function updateStatsDashboard(stats) {
  document.getElementById('totalUsers').textContent = stats.total;
  document.getElementById('avgAge').textContent = stats.averageAge;
  document.getElementById('countries').textContent = Object.keys(stats.byCountry).length;
  
  // Calculate recent submissions (mock - in real app, you'd filter by date)
  document.getElementById('recentCount').textContent = Math.min(stats.total, 5);
  
  // Populate country filter
  const countryFilter = document.getElementById('countryFilter');
  countryFilter.innerHTML = '<option value="">All Countries</option>';
  Object.keys(stats.byCountry).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = `${country} (${stats.byCountry[country]})`;
    countryFilter.appendChild(option);
  });
}

// ============================================
// DATA TABLE MANAGEMENT
// ============================================

// Render data table
function renderDataTable(submissions) {
  const tbody = document.getElementById('dataTableBody');
  
  if (submissions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="mt-3 text-muted">No submissions found</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = submissions.map(sub => `
    <tr>
      <td><span class="badge bg-primary">#${sub.id}</span></td>
      <td>${sub.firstName} ${sub.lastName}</td>
      <td>${sub.email}</td>
      <td>${sub.age}</td>
      <td>${sub.country}</td>
      <td>${sub.gender}</td>
      <td>
        <button class="btn btn-sm btn-info action-btn me-1" onclick="viewSubmission(${sub.id})" title="View">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-warning action-btn me-1" onclick="updateSubmission(${sub.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger action-btn" onclick="deleteSubmission(${sub.id})" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// View submission details
async function viewSubmission(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`);
    const result = await response.json();
    
    if (result.success) {
      const sub = result.data;
      const modalBody = document.getElementById('viewModalBody');
      
      modalBody.innerHTML = `
        <div class="row g-3">
          <div class="col-md-6">
            <strong class="text-primary">ID:</strong> #${sub.id}
          </div>
          <div class="col-md-6">
            <strong class="text-primary">Created:</strong> ${new Date(sub.createdAt).toLocaleString()}
          </div>
          <div class="col-md-6">
            <strong class="text-primary">First Name:</strong> ${sub.firstName}
          </div>
          <div class="col-md-6">
            <strong class="text-primary">Last Name:</strong> ${sub.lastName}
          </div>
          <div class="col-md-6">
            <strong class="text-primary">Email:</strong> ${sub.email}
          </div>
          <div class="col-md-6">
            <strong class="text-primary">Phone:</strong> ${sub.phone}
          </div>
          <div class="col-md-4">
            <strong class="text-primary">Age:</strong> ${sub.age}
          </div>
          <div class="col-md-4">
            <strong class="text-primary">Country:</strong> ${sub.country}
          </div>
          <div class="col-md-4">
            <strong class="text-primary">Gender:</strong> ${sub.gender}
          </div>
          ${sub.interests && sub.interests.length > 0 ? `
            <div class="col-12">
              <strong class="text-primary">Interests:</strong><br>
              ${sub.interests.map(i => `<span class="badge bg-info me-1">${i}</span>`).join('')}
            </div>
          ` : ''}
          ${sub.bio ? `
            <div class="col-12">
              <strong class="text-primary">Bio:</strong><br>
              ${sub.bio}
            </div>
          ` : ''}
          <div class="col-12">
            <strong class="text-primary">Last Updated:</strong> ${new Date(sub.updatedAt).toLocaleString()}
          </div>
        </div>
      `;
      
      new bootstrap.Modal(document.getElementById('viewModal')).show();
    }
  } catch (error) {
    showNotification('Error viewing submission', 'danger');
  }
}

// Render pagination
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="fetchAllSubmissions(${currentPage - 1}); return false;">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="fetchAllSubmissions(${i}); return false;">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }
  
  // Next button
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="fetchAllSubmissions(${currentPage + 1}); return false;">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;
  
  pagination.innerHTML = html;
}

// ============================================
// FILTER & SEARCH
// ============================================

// Apply filters
function applyFilters() {
  const filters = {
    search: document.getElementById('searchFilter').value,
    country: document.getElementById('countryFilter').value,
    gender: document.getElementById('genderFilter').value,
    minAge: document.getElementById('minAgeFilter').value,
    maxAge: document.getElementById('maxAgeFilter').value
  };
  
  // Remove empty filters
  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key];
  });
  
  fetchAllSubmissions(1, filters);
}

// ============================================
// MODAL HELPERS
// ============================================

function showCreateForm() {
  new bootstrap.Modal(document.getElementById('createModal')).show();
}

function showUpdateForm() {
  const id = document.getElementById('updateId').value;
  if (!id) {
    showNotification('Please enter an ID', 'warning');
    return;
  }
  updateSubmission(id);
}

function showPatchForm() {
  const id = document.getElementById('patchId').value;
  if (!id) {
    showNotification('Please enter an ID', 'warning');
    return;
  }
  patchSubmission(id);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getSubmissionById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    return null;
  }
}

// Refresh all data
function refreshData() {
  fetchAllSubmissions();
  fetchStats();
}

// ============================================
// INITIALIZATION
// ============================================

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
  refreshData();
  
  // Add event listeners for real-time filtering
  document.getElementById('searchFilter').addEventListener('input', debounce(applyFilters, 500));
});

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}