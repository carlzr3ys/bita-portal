// Admin Login
document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Check if already logged in
    checkAdminSession();

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            // Disable button
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5rem;"></i>Logging in...';

            try {
                const response = await fetch('../api/admin_login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (result.success) {
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    showError(result.message || 'Login failed. Please check your credentials.');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right: 0.5rem;"></i>Login';
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Login failed. Please check your connection and try again.');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right: 0.5rem;"></i>Login';
            }
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    async function checkAdminSession() {
        try {
            const response = await fetch('../api/check_admin_session.php');
            const result = await response.json();
            
            if (result.success && result.authenticated) {
                // Already logged in, redirect to dashboard
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            // Not logged in, stay on login page
        }
    }
});

