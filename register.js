// Simple Registration Form with File Upload
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const matricCardInput = document.getElementById('matricCard');
    const filePreview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');
    const removeFileBtn = document.getElementById('removeFile');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const successContainer = document.getElementById('successContainer');

    // File upload preview
    if (matricCardInput) {
        matricCardInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showError('Please upload an image file (PNG, JPG, JPEG)');
                    matricCardInput.value = '';
                    return;
                }

                // Validate file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showError('File size must be less than 5MB');
                    matricCardInput.value = '';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImage.src = event.target.result;
                    filePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove file
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', () => {
            matricCardInput.value = '';
            filePreview.style.display = 'none';
            previewImage.src = '';
        });
    }

    // Form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            hideMessage();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const matric = document.getElementById('matric').value.trim();
            const program = document.getElementById('program').value;
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const matricCardFile = matricCardInput.files[0];

            // Validation
            let hasError = false;

            if (!name) {
                showFieldError('nameError', 'Name is required');
                hasError = true;
            }

            if (!matric) {
                showFieldError('matricError', 'Matric number is required');
                hasError = true;
            }

            if (!program || program !== 'BITA') {
                showFieldError('programError', 'Only BITA students can register');
                hasError = true;
            }

            if (!email) {
                showFieldError('emailError', 'Email is required');
                hasError = true;
            } else if (!email.endsWith('@student.utem.edu.my')) {
                showFieldError('emailError', 'Email must be a valid UTEM student email (@student.utem.edu.my)');
                hasError = true;
            }

            if (!password) {
                showFieldError('passwordError', 'Password is required');
                hasError = true;
            } else if (password.length < 8) {
                showFieldError('passwordError', 'Password must be at least 8 characters');
                hasError = true;
            }

            if (password !== confirmPassword) {
                showFieldError('confirmPasswordError', 'Passwords do not match');
                hasError = true;
            }

            if (!matricCardFile) {
                showFieldError('fileError', 'Please upload a photo of your matric card');
                hasError = true;
            }

            if (hasError) {
                return;
            }

            // Disable submit button
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Registering...';

            try {
                // Create FormData for file upload
                const formData = new FormData();
                formData.append('name', name);
                formData.append('matric', matric);
                formData.append('program', program);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('matricCard', matricCardFile);

                // Submit form
                const response = await fetch('api/register.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    document.getElementById('studentName').textContent = name;
                    registerForm.style.display = 'none';
                    successContainer.style.display = 'block';
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    showError(result.message || 'Registration failed. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                console.error('Registration error:', error);
                showError('Registration failed. Please check your connection and try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !email.endsWith('@student.utem.edu.my')) {
                showFieldError('emailError', 'Email must be a valid UTEM student email');
            } else {
                clearFieldError('emailError');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value.length > 0 && passwordInput.value.length < 8) {
                showFieldError('passwordError', 'Password must be at least 8 characters');
            } else {
                clearFieldError('passwordError');
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value !== passwordInput.value) {
                showFieldError('confirmPasswordError', 'Passwords do not match');
            } else {
                clearFieldError('confirmPasswordError');
            }
        });
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

function hideMessage() {
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
        el.style.display = 'none';
    });
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        errorElement.style.display = 'none';
    }
}
