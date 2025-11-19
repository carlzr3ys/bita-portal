// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginError = document.getElementById('loginError');

    // Email validation
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !email.endsWith('@student.utem.edu.my')) {
            emailError.textContent = 'Email must be a valid UTEM student email';
            emailError.classList.add('show');
        } else {
            emailError.classList.remove('show');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        emailError.classList.remove('show');
        passwordError.classList.remove('show');
        loginError.style.display = 'none';

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate
        if (!email.endsWith('@student.utem.edu.my')) {
            emailError.textContent = 'Email must be a valid UTEM student email';
            emailError.classList.add('show');
            return;
        }

        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordError.classList.add('show');
            return;
        }

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies for session
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (result.success) {
                // Check if there's a redirect URL stored
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                } else {
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
            } else {
                loginError.textContent = result.message || 'Login failed. Please check your credentials.';
                loginError.style.display = 'block';
                loginError.style.color = 'var(--error-color)';
                loginError.style.padding = '1rem';
                loginError.style.backgroundColor = '#fee2e2';
                loginError.style.borderRadius = '5px';
                loginError.style.marginTop = '1rem';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'Login failed. Please check your connection and try again.';
            loginError.style.display = 'block';
            loginError.style.color = 'var(--error-color)';
            loginError.style.padding = '1rem';
            loginError.style.backgroundColor = '#fee2e2';
            loginError.style.borderRadius = '5px';
            loginError.style.marginTop = '1rem';
        }
    });
});

