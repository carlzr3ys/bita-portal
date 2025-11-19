// Dashboard - Load user information
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in via session
    try {
        const response = await fetch('api/get_user.php', {
            credentials: 'include' // Include cookies for session
        });
        const result = await response.json();

        if (!result.success || !result.user) {
            // Redirect to login if not authenticated
            window.location.href = 'login.html';
            return;
        }

        const user = result.user;
        
        // Display user information
        document.getElementById('welcomeName').textContent = `Welcome, ${user.name}!`;
        document.getElementById('dashboardName').textContent = user.name;
        document.getElementById('dashboardMatric').textContent = user.matric;
        document.getElementById('dashboardEmail').textContent = user.email;
        document.getElementById('dashboardProgram').textContent = user.program;
    } catch (error) {
        console.error('Error loading user data:', error);
        window.location.href = 'login.html';
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                try {
                    await fetch('api/logout.php', {
                        credentials: 'include' // Include cookies for session
                    });
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Logout error:', error);
                    // Still redirect even if logout API fails
                    window.location.href = 'index.html';
                }
            }
        });
    }
});

