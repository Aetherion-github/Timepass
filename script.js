// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Password visibility toggle
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('password-strength');
    if (!strengthDiv) return;

    // Define strength criteria
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough]
        .filter(Boolean).length;

    strengthDiv.className = 'password-strength';
    if (strength < 3) {
        strengthDiv.classList.add('strength-weak');
    } else if (strength < 4) {
        strengthDiv.classList.add('strength-medium');
    } else {
        strengthDiv.classList.add('strength-strong');
    }
}

// Tab switching functionality
function showTab(tabName) {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const tabs = document.getElementsByClassName('tab');

    Array.from(tabs).forEach(tab => tab.classList.remove('active'));

    if (tabName === 'login') {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Image preview functionality
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle registration
function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('reg-email').value;

    if (localStorage.getItem(username)) {
        showToast('Username already exists!', 'error');
        return;
    }

    // Store credentials and initial info
    localStorage.setItem(username, password);
    const initialInfo = {
        fullName: name,
        phoneNumber: phone,
        email: email
    };
    localStorage.setItem(`${username}_info`, JSON.stringify(initialInfo));
    
    showToast('Registration successful! Please login.', 'success');
    showTab('login');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (localStorage.getItem(username) === password) {
        localStorage.setItem('current_user', username);
        showToast('Login successful!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    } else {
        showToast('Invalid username or password!', 'error');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
}

// Save user details
function saveUserDetails(event) {
    event.preventDefault();
    const imageInput = document.getElementById('profilePicture');
    const userDetails = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        birthdate: document.getElementById('birthdate').value,
        bio: document.getElementById('bio').value,
        hobby: document.getElementById('hobby').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        twitter: document.getElementById('twitter').value,
        profilePicture: ''
    };

    // Handle profile picture
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userDetails.profilePicture = e.target.result;
            completeProfileSave(userDetails);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        completeProfileSave(userDetails);
    }
}

// Complete profile save
function completeProfileSave(userDetails) {
    const username = localStorage.getItem('current_user');
    localStorage.setItem(`${username}_info`, JSON.stringify(userDetails));
    showToast('Profile updated successfully!', 'success');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1000);
}

// Display profile
function displayProfile() {
    const username = localStorage.getItem('current_user');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const userDetails = JSON.parse(localStorage.getItem(`${username}_info`));
    if (userDetails) {
        // Update profile picture
        const profilePicture = document.getElementById('profilePictureDisplay');
        if (userDetails.profilePicture) {
            profilePicture.innerHTML = `<img src="${userDetails.profilePicture}" alt="Profile Picture">`;
        }

        // Update basic info
        const basicInfo = document.getElementById('profileBasicInfo');
        basicInfo.innerHTML = `
            <h2>${userDetails.fullName}</h2>
            <p>${userDetails.location || 'Location not set'}</p>
        `;

        // Update detailed info
        const profileDetails = document.getElementById('profileDetails');
        profileDetails.innerHTML = `
            <div class="detail-card">
                <h3><i class="fas fa-user"></i> Personal Info</h3>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <p><strong>Phone:</strong> ${userDetails.phoneNumber}</p>
                <p><strong>Birth Date:</strong> ${userDetails.birthdate || 'Not set'}</p>
            </div>
            <div class="detail-card">
                <h3><i class="fas fa-info-circle"></i> About</h3>
                <p><strong>Bio:</strong> ${userDetails.bio || 'No bio added'}</p>
                <p><strong>Hobbies:</strong> ${userDetails.hobby || 'No hobbies listed'}</p>
            </div>
            <div class="detail-card">
                <h3><i class="fas fa-link"></i> Social Links</h3>
                ${userDetails.linkedin ? `<p><a href="${userDetails.linkedin}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></p>` : ''}
                ${userDetails.twitter ? `<p><a href="${userDetails.twitter}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a></p>` : ''}
            </div>
        `;
    }
}

// Pre-fill form
function prefillForm() {
    const username = localStorage.getItem('current_user');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const userDetails = JSON.parse(localStorage.getItem(`${username}_info`));
    if (userDetails) {
        for (const [key, value] of Object.entries(userDetails)) {
            const element = document.getElementById(key);
            if (element && key !== 'profilePicture') {
                element.value = value;
            }
        }

        // Show existing profile picture
        if (userDetails.profilePicture) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `<img src="${userDetails.profilePicture}" alt="Profile Preview">`;
        }
    }
}

// Navigation function
function goToForm() {
    window.location.href = 'form.html';
}

// Initialize pages
if (window.location.pathname.includes('profile.html')) {
    displayProfile();
} else if (window.location.pathname.includes('form.html')) {
    prefillForm();
} else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Add password strength checker to registration form
    const passwordInput = document.getElementById('reg-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => checkPasswordStrength(e.target.value));
    }
}