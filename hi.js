let userType = '';
let isLoggedIn = false;
let showAdminPanel = false;
let selectedJob = null;
let jobs = [
    { 
        id: 1, 
        title: 'Frontend Developer', 
        company: 'Tech Solutions Inc.', 
        location: 'New York', 
        category: 'Technology', 
        description: 'Looking for an experienced Frontend Developer with React skills.', 
        salary: '$85,000 - $110,000' 
    },
    { 
        id: 2, 
        title: 'Marketing Manager', 
        company: 'Brand Innovators', 
        location: 'Remote', 
        category: 'Marketing', 
        description: 'Seeking a creative Marketing Manager to lead our digital campaigns.', 
        salary: '$70,000 - $90,000' 
    },
    { 
        id: 3, 
        title: 'Data Scientist', 
        company: 'Data Insights', 
        location: 'San Francisco', 
        category: 'Technology', 
        description: 'Join our team to analyze complex datasets and build ML models.', 
        salary: '$95,000 - $130,000' 
    },
    { 
        id: 4, 
        title: 'HR Specialist', 
        company: 'Global HR Solutions', 
        location: 'Chicago', 
        category: 'Human Resources', 
        description: 'Help manage our talent acquisition process and employee relations.', 
        salary: '$60,000 - $75,000' 
    },
    { 
        id: 5, 
        title: 'Project Manager', 
        company: 'Construct Co', 
        location: 'Denver', 
        category: 'Construction', 
        description: 'Oversee construction projects from planning to completion.', 
        salary: '$80,000 - $100,000' 
    }
];

// Filters
let filters = {
    searchTerm: '',
    location: '',
    category: ''
};

// DOM Elements
const authButtons = document.getElementById('authButtons');
const logoutBtn = document.getElementById('logoutBtn');
const jobSeekerBtn = document.getElementById('jobSeekerBtn');
const employerBtn = document.getElementById('employerBtn');
const loginSection = document.getElementById('loginSection');
const loginTitle = document.getElementById('loginTitle');
const loginForm = document.getElementById('loginForm');
const jobPostingSection = document.getElementById('jobPostingSection');
const adminPanel = document.getElementById('adminPanel');
const jobListings = document.getElementById('jobListings');
const jobCount = document.getElementById('jobCount');
const postJobForm = document.getElementById('postJobForm');
const applicationModal = document.getElementById('applicationModal');
const applicationTitle = document.getElementById('applicationTitle');
const applicationForm = document.getElementById('applicationForm');
const cancelApplication = document.getElementById('cancelApplication');
const locationSelect = document.getElementById('location');
const categorySelect = document.getElementById('category');
const searchTermInput = document.getElementById('searchTerm');
const clearFiltersBtn = document.getElementById('clearFilters');
const totalJobs = document.getElementById('totalJobs');
const totalCategories = document.getElementById('totalCategories');
const totalLocations = document.getElementById('totalLocations');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderJobs();
    populateFilters();
    updateStats();
});

// Authentication Buttons
jobSeekerBtn.addEventListener('click', () => {
    userType = 'jobseeker';
    showLoginForm();
    jobSeekerBtn.classList.add('active');
    employerBtn.classList.remove('active');
});

employerBtn.addEventListener('click', () => {
    userType = 'employer';
    showLoginForm();
    employerBtn.classList.add('active');
    jobSeekerBtn.classList.remove('active');
});

logoutBtn.addEventListener('click', handleLogout);

// Login Form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        isLoggedIn = true;
        
        if (username.includes('admin')) {
            showAdminPanel = true;
            adminPanel.classList.remove('hidden');
        }
        
        loginSection.classList.add('hidden');
        authButtons.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        if (userType === 'employer') {
            jobPostingSection.classList.remove('hidden');
        }
    }
});

// Job Posting Form
postJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newJob = {
        id: jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1,
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        location: document.getElementById('jobLocation').value,
        category: document.getElementById('jobCategory').value,
        description: document.getElementById('description').value,
        salary: document.getElementById('salary').value
    };
    
    jobs.push(newJob);
    renderJobs();
    populateFilters();
    updateStats();
    
    // Reset form
    postJobForm.reset();
});

// Filter Events
searchTermInput.addEventListener('input', () => {
    filters.searchTerm = searchTermInput.value;
    renderJobs();
});

locationSelect.addEventListener('change', () => {
    filters.location = locationSelect.value;
    renderJobs();
});

categorySelect.addEventListener('change', () => {
    filters.category = categorySelect.value;
    renderJobs();
});

clearFiltersBtn.addEventListener('click', () => {
    filters = {
        searchTerm: '',
        location: '',
        category: ''
    };
    
    searchTermInput.value = '';
    locationSelect.value = '';
    categorySelect.value = '';
    
    renderJobs();
});

// Application Form
applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // this is for a real app, we send this data to a server
    alert(`Application for ${selectedJob.title} submitted successfully!`);
    
    closeApplicationModal();
    applicationForm.reset();
});

cancelApplication.addEventListener('click', closeApplicationModal);

// Functions
function showLoginForm() {
    loginTitle.textContent = `Login as ${userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}`;
    loginSection.classList.remove('hidden');
}

function handleLogout() {
    isLoggedIn = false;
    userType = '';
    showAdminPanel = false;
    
    loginSection.classList.add('hidden');
    jobPostingSection.classList.add('hidden');
    adminPanel.classList.add('hidden');
    
    authButtons.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    jobSeekerBtn.classList.remove('active');
    employerBtn.classList.remove('active');
}

function renderJobs() {
    const filteredJobs = filterJobs();
    jobListings.innerHTML = '';
    jobCount.textContent = filteredJobs.length;
    
    if (filteredJobs.length === 0) {
        jobListings.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 1rem 0;">
                No jobs found matching your criteria
            </div>
        `;
        return;
    }
    
    filteredJobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job-card';
        
        jobElement.innerHTML = `
            <div class="job-header">
                <h3 class="job-title">${job.title}</h3>
                <span class="job-salary">${job.salary}</span>
            </div>
            <div class="job-company">${job.company} • ${job.location}</div>
            <div class="job-description">${job.description}</div>
            <div class="job-footer">
                <span class="job-category">${job.category}</span>
                <button class="btn primary-btn apply-btn" data-id="${job.id}">Apply Now</button>
            </div>
            ${showAdminPanel ? `<button class="btn danger-btn delete-btn" data-id="${job.id}" style="margin-top: 0.5rem">Delete Job</button>` : ''}
        `;
        
        jobListings.appendChild(jobElement);
    });
    
    // Add event listeners to the apply buttons
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const jobId = parseInt(button.getAttribute('data-id'));
            handleApply(jobId);
        });
    });
    
    // Add event listeners to the delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const jobId = parseInt(button.getAttribute('data-id'));
            deleteJob(jobId);
        });
    });
}

function filterJobs() {
    return jobs.filter(job => {
        return (
            job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            (filters.location === '' || job.location === filters.location) &&
            (filters.category === '' || job.category === filters.category)
        );
    });
}

function populateFilters() {
    const locations = [...new Set(jobs.map(job => job.location))];
    const categories = [...new Set(jobs.map(job => job.category))];
    
    // Clear existing options
    locationSelect.innerHTML = '<option value="">All Locations</option>';
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    
    // Add location options
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function handleApply(jobId) {
    if (isLoggedIn && userType === 'jobseeker') {
        selectedJob = jobs.find(job => job.id === jobId);
        applicationTitle.textContent = `Apply for ${selectedJob.title}`;
        applicationModal.classList.remove('hidden');
    } else {
        alert('Please log in as a job seeker to apply!');
        userType = 'jobseeker';
        showLoginForm();
    }
}

function closeApplicationModal() {
    applicationModal.classList.add('hidden');
    selectedJob = null;
}

function deleteJob(jobId) {
    jobs = jobs.filter(job => job.id !== jobId);
    renderJobs();
    populateFilters();
    updateStats();
}

function updateStats() {
    if (showAdminPanel) {
        const locations = [...new Set(jobs.map(job => job.location))];
        const categories = [...new Set(jobs.map(job => job.category))];
        
        totalJobs.textContent = jobs.length;
        totalCategories.textContent = categories.length;
        totalLocations.textContent = locations.length;
    }
}
