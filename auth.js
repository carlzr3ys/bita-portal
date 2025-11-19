// Authentication and Navigation Management

let isAuthenticated = false;
let currentUser = null;

// Check user session
async function checkAuth() {
    try {
        const response = await fetch('api/check_session.php', {
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success && result.authenticated) {
            isAuthenticated = true;
            currentUser = {
                id: result.user_id,
                name: result.user_name,
                email: result.user_email
            };
            return true;
        } else {
            isAuthenticated = false;
            currentUser = null;
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        isAuthenticated = false;
        currentUser = null;
        return false;
    }
}

// Update navigation based on auth status
async function updateNavigation() {
    await checkAuth();
    
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) {
        console.warn('navMenu not found');
        return;
    }
    
    // Find and hide/show menu items
    const alumniLink = navMenu.querySelector('a[href="alumni.html"]');
    const membersLink = navMenu.querySelector('a[href="members.html"]');
    const modulesLink = navMenu.querySelector('a[href="modules.html"]');
    const contactLink = navMenu.querySelector('a[href="contact-admin.html"]');
    
    const alumniItem = alumniLink?.closest('.nav-item');
    const membersItem = membersLink?.closest('.nav-item');
    const modulesItem = modulesLink?.closest('.nav-item');
    const contactItem = contactLink?.closest('.nav-item');
    
    // Remove or restore protected links based on auth status
    if (!isAuthenticated) {
        // Remove protected items completely if not authenticated
        [alumniItem, membersItem, modulesItem, contactItem].forEach(item => {
            if (item) {
                item.remove();
            }
        });
    } else {
        // If authenticated, ensure protected items exist
        // They might have been removed, so we need to add them back
        // Find first nav item as reference (after removing Home/About)
        const firstNavItem = navMenu.querySelector('li.nav-item');
        let referenceItem = firstNavItem;
        
        // Add Alumni if not exists
        if (!alumniItem) {
            const newAlumniItem = document.createElement('li');
            newAlumniItem.className = 'nav-item';
            newAlumniItem.innerHTML = '<a href="alumni.html" class="nav-link">Alumni</a>';
            if (referenceItem) {
                referenceItem.insertAdjacentElement('afterend', newAlumniItem);
            } else {
                navMenu.appendChild(newAlumniItem);
            }
            referenceItem = newAlumniItem;
        }
        
        // Add Members if not exists
        if (!membersItem) {
            const newMembersItem = document.createElement('li');
            newMembersItem.className = 'nav-item';
            newMembersItem.innerHTML = '<a href="members.html" class="nav-link">BITA Members</a>';
            const currentAlumni = navMenu.querySelector('a[href="alumni.html"]')?.closest('.nav-item');
            if (currentAlumni) {
                currentAlumni.insertAdjacentElement('afterend', newMembersItem);
            } else if (referenceItem) {
                referenceItem.insertAdjacentElement('afterend', newMembersItem);
            } else {
                navMenu.appendChild(newMembersItem);
            }
        }
        
        // Add Modules if not exists
        if (!modulesItem) {
            const newModulesItem = document.createElement('li');
            newModulesItem.className = 'nav-item';
            newModulesItem.innerHTML = '<a href="modules.html" class="nav-link">Modules</a>';
            const currentMembers = navMenu.querySelector('a[href="members.html"]')?.closest('.nav-item');
            if (currentMembers) {
                currentMembers.insertAdjacentElement('afterend', newModulesItem);
            } else if (referenceItem) {
                referenceItem.insertAdjacentElement('afterend', newModulesItem);
            } else {
                navMenu.appendChild(newModulesItem);
            }
        }
        
        // Add Contact Admin if not exists
        if (!contactItem) {
            const newContactItem = document.createElement('li');
            newContactItem.className = 'nav-item';
            newContactItem.innerHTML = '<a href="contact-admin.html" class="nav-link"><i class="fas fa-envelope" style="margin-right: 0.5rem;"></i>Contact Admin</a>';
            const currentModules = navMenu.querySelector('a[href="modules.html"]')?.closest('.nav-item');
            if (currentModules) {
                currentModules.insertAdjacentElement('afterend', newContactItem);
            } else if (referenceItem) {
                referenceItem.insertAdjacentElement('afterend', newContactItem);
            } else {
                navMenu.appendChild(newContactItem);
            }
        }
    }
    
    // Hide Register and Login if authenticated, show if not
    const registerLink = navMenu.querySelector('a[href="register.html"]');
    const loginLink = navMenu.querySelector('a[href="login.html"]');
    const registerItem = registerLink?.closest('.nav-item');
    const loginItem = loginLink?.closest('.nav-item');
    
    // Find Home and About links
    const homeLink = navMenu.querySelector('a[href="index.html"]');
    const aboutLink = navMenu.querySelector('a[href="about.html"]');
    const homeItem = homeLink?.closest('.nav-item');
    const aboutItem = aboutLink?.closest('.nav-item');
    
    if (isAuthenticated) {
        console.log('🔐 User is authenticated, updating navigation...');
        
        // Remove Register and Login completely
        if (registerItem) registerItem.remove();
        if (loginItem) loginItem.remove();
        
        // Remove Home and About completely
        if (homeItem) homeItem.remove();
        if (aboutItem) aboutItem.remove();
        
        // Remove existing logout buttons (to avoid duplicates)
        const existingLogout1 = navMenu.querySelector('#navLogoutBtn');
        const existingLogout2 = navMenu.querySelector('#logoutBtn');
        const logoutItem1 = existingLogout1?.closest('.nav-item');
        const logoutItem2 = existingLogout2?.closest('.nav-item');
        if (logoutItem1) {
            logoutItem1.remove();
            console.log('🗑️ Removed existing logout button (navLogoutBtn)');
        }
        if (logoutItem2) {
            logoutItem2.remove();
            console.log('🗑️ Removed existing logout button (logoutBtn)');
        }
        
        // Add Profile/Dashboard link if not exists
        let profileLink = navMenu.querySelector('a[href="dashboard.html"]');
        if (!profileLink) {
            // Create profile link
            const profileItem = document.createElement('li');
            profileItem.className = 'nav-item';
            profileItem.innerHTML = `
                <a href="dashboard.html" class="nav-link">
                    <i class="fas fa-user-circle" style="margin-right: 0.5rem;"></i>Profile
                </a>
            `;
            
            // Add Contact Admin link if not exists in nav
            if (!contactLink) {
                const contactAdminItem = document.createElement('li');
                contactAdminItem.className = 'nav-item';
                contactAdminItem.innerHTML = `
                    <a href="contact-admin.html" class="nav-link">
                        <i class="fas fa-envelope" style="margin-right: 0.5rem;"></i>Contact Admin
                    </a>
                `;
                // Insert before Profile
                navMenu.insertBefore(contactAdminItem, profileItem);
            } else if (contactItem) {
                contactItem.style.display = '';
            }
            
            // Append profile
            navMenu.appendChild(profileItem);
        }
        
        // ALWAYS add logout button when authenticated (even if profile exists)
        let logoutBtn = document.getElementById('navLogoutBtn') || document.getElementById('logoutBtn');
        if (!logoutBtn) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav-item';
            logoutItem.innerHTML = `
                <a href="#" class="nav-link btn-register" id="navLogoutBtn">
                    <i class="fas fa-sign-out-alt" style="margin-right: 0.5rem;"></i>Logout
                </a>
            `;
            navMenu.appendChild(logoutItem);
            console.log('✅ Logout button created');
        } else {
            console.log('✅ Logout button already exists');
        }
        
        // Always attach logout functionality (even if button already exists)
        setTimeout(() => {
            const logoutBtn = document.getElementById('navLogoutBtn') || document.getElementById('logoutBtn');
            if (logoutBtn) {
                if (!logoutBtn.hasAttribute('data-logout-attached')) {
                    logoutBtn.setAttribute('data-logout-attached', 'true');
                    logoutBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        if (confirm('Are you sure you want to logout?')) {
                            try {
                                await fetch('api/logout.php', {
                                    credentials: 'include'
                                });
                                window.location.href = 'index.html';
                            } catch (error) {
                                console.error('Logout error:', error);
                                window.location.href = 'index.html';
                            }
                        }
                    });
                    console.log('✅ Logout functionality attached');
                } else {
                    console.log('✅ Logout functionality already attached');
                }
            } else {
                console.error('❌ Logout button not found!');
            }
        }, 100);
    } else {
        // Add Home and About back if they don't exist (they were removed when logged in)
        const navLogoItem = navMenu.querySelector('.nav-logo')?.parentElement;
        let referenceItem = navMenu.querySelector('li.nav-item'); // Get first nav item
        
        if (!homeItem) {
            const newHomeItem = document.createElement('li');
            newHomeItem.className = 'nav-item';
            newHomeItem.innerHTML = '<a href="index.html" class="nav-link">Home</a>';
            if (referenceItem) {
                navMenu.insertBefore(newHomeItem, referenceItem);
            } else {
                navMenu.appendChild(newHomeItem);
            }
            referenceItem = newHomeItem;
        }
        
        if (!aboutItem) {
            const currentHome = navMenu.querySelector('a[href="index.html"]')?.closest('.nav-item');
            const newAboutItem = document.createElement('li');
            newAboutItem.className = 'nav-item';
            newAboutItem.innerHTML = '<a href="about.html" class="nav-link">About</a>';
            if (currentHome) {
                currentHome.insertAdjacentElement('afterend', newAboutItem);
            } else if (referenceItem) {
                referenceItem.insertAdjacentElement('afterend', newAboutItem);
            } else {
                navMenu.appendChild(newAboutItem);
            }
            referenceItem = newAboutItem;
        }
        
        // Add Register and Login back if they don't exist
        const currentAbout = navMenu.querySelector('a[href="about.html"]')?.closest('.nav-item');
        
        if (!registerItem && currentAbout) {
            const newRegisterItem = document.createElement('li');
            newRegisterItem.className = 'nav-item';
            newRegisterItem.innerHTML = '<a href="register.html" class="nav-link btn-register">Register</a>';
            currentAbout.insertAdjacentElement('afterend', newRegisterItem);
        }
        
        if (!loginItem) {
            const currentRegister = navMenu.querySelector('a[href="register.html"]')?.closest('.nav-item');
            const newLoginItem = document.createElement('li');
            newLoginItem.className = 'nav-item';
            newLoginItem.innerHTML = '<a href="login.html" class="nav-link">Login</a>';
            if (currentRegister) {
                currentRegister.insertAdjacentElement('afterend', newLoginItem);
            } else if (currentAbout) {
                currentAbout.insertAdjacentElement('afterend', newLoginItem);
            } else {
                navMenu.appendChild(newLoginItem);
            }
        }
        
        // Remove Profile link if exists
        const profileLink = navMenu.querySelector('a[href="dashboard.html"]');
        const profileItem = profileLink?.closest('.nav-item');
        if (profileItem) profileItem.remove();
        
        // Remove Contact Admin link if exists (manually added)
        const contactLink = navMenu.querySelector('a[href="contact-admin.html"]');
        const contactItem = contactLink?.closest('.nav-item');
        if (contactItem) contactItem.remove();
        
        // Remove Logout link if exists (check both IDs)
        const logoutBtn1 = navMenu.querySelector('#navLogoutBtn');
        const logoutBtn2 = navMenu.querySelector('#logoutBtn');
        const logoutItem1 = logoutBtn1?.closest('.nav-item');
        const logoutItem2 = logoutBtn2?.closest('.nav-item');
        if (logoutItem1) logoutItem1.remove();
        if (logoutItem2) logoutItem2.remove();
    }
}

// Check if page requires authentication and redirect if not logged in
async function requireAuth(redirectTo = 'login.html') {
    const isAuth = await checkAuth();
    
    if (!isAuth) {
        // Store current page to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = redirectTo;
        return false;
    }
    
    return true;
}

// Remove protected navigation items immediately (before auth check)
function removeProtectedNavItems() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Remove protected items completely from DOM
    const protectedSelectors = [
        'a[href="alumni.html"]',
        'a[href="members.html"]',
        'a[href="modules.html"]',
        'a[href="contact-admin.html"]'
    ];
    
    protectedSelectors.forEach(selector => {
        const link = navMenu.querySelector(selector);
        const item = link?.closest('.nav-item');
        if (item) {
            item.remove(); // Remove from DOM completely
        }
    });
}

// Initialize auth on page load
if (document.readyState === 'loading') {
    // Remove protected items immediately
    document.addEventListener('DOMContentLoaded', () => {
        removeProtectedNavItems();
        updateNavigation();
    });
} else {
    // DOM already loaded
    removeProtectedNavItems();
    updateNavigation();
}

