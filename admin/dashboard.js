// Admin Dashboard
let currentRejectUserId = null;
let currentAdmin = null;
let isSuperAdmin = false;

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
    loadPendingUsers();
    loadStats();

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadPendingUsers();
        loadStats();
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            const response = await fetch('../api/admin_logout.php');
            const result = await response.json();
            if (result.success) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = 'login.html';
        }
    });

    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('cardModal').style.display = 'none';
    });

    document.getElementById('closeRejectModal').addEventListener('click', () => {
        document.getElementById('rejectModal').style.display = 'none';
        currentRejectUserId = null;
    });

    document.getElementById('cancelReject').addEventListener('click', () => {
        document.getElementById('rejectModal').style.display = 'none';
        currentRejectUserId = null;
    });

    document.getElementById('confirmReject').addEventListener('click', () => {
        if (currentRejectUserId) {
            const comment = document.getElementById('rejectComment').value.trim();
            rejectUser(currentRejectUserId, comment);
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const cardModal = document.getElementById('cardModal');
        const rejectModal = document.getElementById('rejectModal');
        const adminModal = document.getElementById('adminModal');
        if (e.target === cardModal) {
            cardModal.style.display = 'none';
        }
        if (e.target === rejectModal) {
            rejectModal.style.display = 'none';
            currentRejectUserId = null;
        }
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
            resetAdminForm();
        }
    });

    // Admin management buttons
    document.getElementById('createAdminBtn')?.addEventListener('click', () => {
        showCreateAdminModal();
    });

    document.getElementById('closeAdminModal')?.addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'none';
        resetAdminForm();
    });

    document.getElementById('cancelAdminForm')?.addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'none';
        resetAdminForm();
    });

    document.getElementById('adminForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveAdmin();
    });
});

async function checkAdminSession() {
    try {
        const response = await fetch('../api/check_admin_session.php');
        const result = await response.json();
        
        if (!result.success || !result.authenticated) {
            window.location.href = 'login.html';
            return;
        }

        if (result.admin) {
            currentAdmin = result.admin;
            isSuperAdmin = result.admin.role === 'superadmin';
            document.getElementById('adminName').textContent = result.admin.name || 'Admin';
            
            // Show admin management section if superadmin
            if (isSuperAdmin) {
                const superAdminSection = document.getElementById('superAdminSection');
                if (superAdminSection) {
                    superAdminSection.style.display = 'block';
                    loadAdmins();
                }
            } else {
                console.log('Admin role:', result.admin.role, '- Admin management section not available for moderators');
            }
        }
    } catch (error) {
        console.error('Session check error:', error);
        window.location.href = 'login.html';
    }
}

async function loadPendingUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Loading pending registrations...</p></div>';

    try {
        const response = await fetch('../api/get_pending_users.php');
        const result = await response.json();

        if (result.success) {
            const users = result.users || [];
            
            if (users.length === 0) {
                usersList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <h3>No Pending Registrations</h3>
                        <p>All registration requests have been processed.</p>
                    </div>
                `;
                return;
            }

            usersList.innerHTML = users.map(user => `
                <div class="user-card" id="user-${user.id}">
                    <div class="user-info">
                        <div class="user-info-item">
                            <label>Name</label>
                            <span>${escapeHtml(user.name)}</span>
                        </div>
                        <div class="user-info-item">
                            <label>Matric Number</label>
                            <span>${escapeHtml(user.matric)}</span>
                        </div>
                        <div class="user-info-item">
                            <label>Email</label>
                            <span>${escapeHtml(user.email)}</span>
                        </div>
                        <div class="user-info-item">
                            <label>Program</label>
                            <span>${escapeHtml(user.program)}</span>
                        </div>
                        <div class="user-info-item">
                            <label>Registered</label>
                            <span>${formatDate(user.created_at)}</span>
                        </div>
                    </div>
                    <div class="user-actions">
                        <a href="#" class="btn-view-card" onclick="viewMatricCard('${user.matric_card}'); return false;">
                            <i class="fas fa-image" style="margin-right: 0.5rem;"></i>View Card
                        </a>
                        <button class="btn-approve" onclick="approveUser(${user.id})">
                            <i class="fas fa-check" style="margin-right: 0.5rem;"></i>Approve
                        </button>
                        <button class="btn-reject" onclick="showRejectModal(${user.id})">
                            <i class="fas fa-times" style="margin-right: 0.5rem;"></i>Reject
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            usersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Users</h3>
                    <p>${result.message || 'Failed to load pending registrations'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Load users error:', error);
        usersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>Failed to load pending registrations. Please try again.</p>
            </div>
        `;
    }
}

async function loadStats() {
    try {
        const response = await fetch('../api/get_admin_stats.php');
        const result = await response.json();

        if (result.success) {
            document.getElementById('pendingCount').textContent = result.pending_count || 0;
            document.getElementById('totalUsers').textContent = result.total_users || 0;
        }
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

function viewMatricCard(cardPath) {
    if (!cardPath) {
        alert('Matric card image not available');
        return;
    }
    const modal = document.getElementById('cardModal');
    const img = document.getElementById('modalCardImage');
    img.src = '../' + cardPath;
    modal.style.display = 'flex';
}

function showRejectModal(userId) {
    currentRejectUserId = userId;
    document.getElementById('rejectComment').value = '';
    document.getElementById('rejectModal').style.display = 'flex';
}

async function approveUser(userId) {
    if (!confirm('Are you sure you want to approve this registration?')) {
        return;
    }

    try {
        const response = await fetch('../api/approve_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (result.success) {
            // Remove user card from list
            const userCard = document.getElementById(`user-${userId}`);
            if (userCard) {
                userCard.style.transition = 'opacity 0.3s';
                userCard.style.opacity = '0';
                setTimeout(() => {
                    userCard.remove();
                    loadPendingUsers();
                    loadStats();
                }, 300);
            }
            alert('User approved successfully!');
        } else {
            alert(result.message || 'Failed to approve user');
        }
    } catch (error) {
        console.error('Approve error:', error);
        alert('Failed to approve user. Please try again.');
    }
}

async function rejectUser(userId, comment) {
    try {
        const response = await fetch('../api/reject_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user_id: userId,
                comment: comment || null
            })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('rejectModal').style.display = 'none';
            currentRejectUserId = null;
            
            // Remove user card from list
            const userCard = document.getElementById(`user-${userId}`);
            if (userCard) {
                userCard.style.transition = 'opacity 0.3s';
                userCard.style.opacity = '0';
                setTimeout(() => {
                    userCard.remove();
                    loadPendingUsers();
                    loadStats();
                }, 300);
            }
            alert('User rejected successfully!');
        } else {
            alert(result.message || 'Failed to reject user');
        }
    } catch (error) {
        console.error('Reject error:', error);
        alert('Failed to reject user. Please try again.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Admin Management Functions
async function loadAdmins() {
    if (!isSuperAdmin) return;
    
    const adminsList = document.getElementById('adminsList');
    adminsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Loading admins...</p></div>';

    try {
        const response = await fetch('../api/get_admins.php');
        const result = await response.json();

        if (result.success) {
            const admins = result.admins || [];
            
            if (admins.length === 0) {
                adminsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No Admins Found</h3>
                        <p>Click "Create New Admin" to add an admin.</p>
                    </div>
                `;
                return;
            }

            adminsList.innerHTML = admins.map(admin => {
                const isOtherSuperAdmin = admin.role === 'superadmin' && admin.id !== currentAdmin.id;
                const canEdit = !isOtherSuperAdmin;
                const canDelete = !isOtherSuperAdmin;
                
                return `
                    <div class="admin-card" id="admin-${admin.id}">
                        <div class="admin-card-info">
                            <h4>${escapeHtml(admin.name)}</h4>
                            <p><i class="fas fa-envelope" style="margin-right: 0.5rem;"></i>${escapeHtml(admin.email)}</p>
                            <p><i class="fas fa-calendar" style="margin-right: 0.5rem;"></i>Created: ${formatDate(admin.created_at)}</p>
                            <span class="admin-badge ${admin.role}">${admin.role === 'superadmin' ? 'Super Admin' : 'Moderator'}</span>
                            ${isOtherSuperAdmin ? '<p style="color: #ef4444; margin-top: 0.5rem; font-size: 0.85rem;"><i class="fas fa-lock" style="margin-right: 0.5rem;"></i>Protected: Cannot edit other super admins</p>' : ''}
                        </div>
                        <div class="admin-card-actions">
                            <button class="btn-edit-admin" onclick="showEditAdminModal(${admin.id})" ${!canEdit ? 'disabled title="Cannot edit other super admins"' : ''}>
                                <i class="fas fa-edit" style="margin-right: 0.5rem;"></i>Edit
                            </button>
                            <button class="btn-delete-admin" onclick="deleteAdmin(${admin.id})" ${!canDelete ? 'disabled title="Cannot delete other super admins"' : ''}>
                                <i class="fas fa-trash" style="margin-right: 0.5rem;"></i>Delete
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            adminsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Admins</h3>
                    <p>${result.message || 'Failed to load admins'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Load admins error:', error);
        adminsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>Failed to load admins. Please try again.</p>
            </div>
        `;
    }
}

function showCreateAdminModal() {
    document.getElementById('adminModalTitle').textContent = 'Create New Admin';
    document.getElementById('adminId').value = '';
    document.getElementById('adminName').value = '';
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPassword').required = true;
    document.getElementById('passwordLabel').textContent = 'Password *';
    document.getElementById('passwordHint').textContent = 'Password must be at least 8 characters';
    document.getElementById('adminRole').value = 'moderator';
    document.getElementById('adminRole').disabled = false;
    document.getElementById('adminRole').removeAttribute('title');
    document.getElementById('adminModal').style.display = 'flex';
}

function showEditAdminModal(adminId) {
    // Get admin data
    fetch('../api/get_admins.php')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.admins) {
                const admin = result.admins.find(a => a.id === adminId);
                if (admin) {
                    const isOtherSuperAdmin = admin.role === 'superadmin' && admin.id !== currentAdmin.id;
                    if (isOtherSuperAdmin) {
                        alert('Cannot edit other super admins');
                        return;
                    }

                    document.getElementById('adminModalTitle').textContent = 'Edit Admin';
                    document.getElementById('adminId').value = admin.id;
                    document.getElementById('adminName').value = admin.name;
                    document.getElementById('adminEmail').value = admin.email;
                    document.getElementById('adminPassword').value = '';
                    document.getElementById('adminPassword').required = false;
                    document.getElementById('passwordLabel').textContent = 'Password';
                    document.getElementById('passwordHint').textContent = 'Leave blank to keep current password';
                    document.getElementById('adminRole').value = admin.role;
                    
                    // Disable role dropdown if editing own account as superadmin (prevent lockout)
                    const isOwnAccount = admin.id === currentAdmin.id;
                    const isOwnSuperAdmin = isOwnAccount && admin.role === 'superadmin';
                    document.getElementById('adminRole').disabled = isOwnSuperAdmin;
                    if (isOwnSuperAdmin) {
                        document.getElementById('adminRole').title = 'Cannot change your own role from superadmin';
                    }
                    
                    document.getElementById('adminModal').style.display = 'flex';
                }
            }
        })
        .catch(error => {
            console.error('Error loading admin data:', error);
            alert('Failed to load admin data');
        });
}

function resetAdminForm() {
    document.getElementById('adminForm').reset();
    document.getElementById('adminId').value = '';
    document.getElementById('adminRole').disabled = false;
    document.getElementById('adminRole').removeAttribute('title');
}

async function saveAdmin() {
    const adminId = document.getElementById('adminId').value;
    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const role = document.getElementById('adminRole').value;
    
    // Validation
    if (!name || !email) {
        alert('Name and email are required');
        return;
    }
    
    if (!adminId && !password) {
        alert('Password is required for new admin');
        return;
    }
    
    if (password && password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    try {
        const response = await fetch('../api/save_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                admin_id: adminId || null,
                name: name,
                email: email,
                password: password || null,
                role: role
            })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('adminModal').style.display = 'none';
            resetAdminForm();
            loadAdmins();
            alert(adminId ? 'Admin updated successfully!' : 'Admin created successfully!');
        } else {
            alert(result.message || 'Failed to save admin');
        }
    } catch (error) {
        console.error('Save admin error:', error);
        alert('Failed to save admin. Please try again.');
    }
}

async function deleteAdmin(adminId) {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch('../api/delete_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ admin_id: adminId })
        });

        const result = await response.json();

        if (result.success) {
            loadAdmins();
            alert('Admin deleted successfully!');
        } else {
            alert(result.message || 'Failed to delete admin');
        }
    } catch (error) {
        console.error('Delete admin error:', error);
        alert('Failed to delete admin. Please try again.');
    }
}

