// Load members data from database
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('membersGrid');
    if (!grid) return;

    try {
        const response = await fetch('api/get_members.php');
        const result = await response.json();

        if (result.success && result.members) {
            // Clear existing content
            grid.innerHTML = '';
            
            if (result.members.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No members found.</p>';
                return;
            }
            
            // Add member cards
            result.members.forEach(member => {
                const card = document.createElement('div');
                card.className = 'member-card';
                
                let html = `
                    <h3>${member.name || 'N/A'}</h3>
                    <p><strong>Matric:</strong> ${member.matric || 'N/A'}</p>
                `;
                
                if (member.year) {
                    html += `<p><strong>Year:</strong> ${member.year}</p>`;
                }
                
                if (member.batch) {
                    html += `<p><strong>Batch:</strong> ${member.batch}</p>`;
                }
                
                html += `<p><strong>Status:</strong> <span style="color: var(--success-color);">Active</span></p>`;
                
                if (member.bio) {
                    html += `<p style="margin-top: 1rem; color: var(--text-light);">${member.bio}</p>`;
                }
                
                // Social media links
                const socialLinks = [];
                if (member.linkedin) socialLinks.push(`<a href="${member.linkedin}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-linkedin"></i></a>`);
                if (member.instagram) socialLinks.push(`<a href="${member.instagram}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-instagram"></i></a>`);
                if (member.facebook) socialLinks.push(`<a href="${member.facebook}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-facebook"></i></a>`);
                if (member.twitter) socialLinks.push(`<a href="${member.twitter}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-twitter"></i></a>`);
                
                if (socialLinks.length > 0) {
                    html += `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">${socialLinks.join('')}</div>`;
                }
                
                card.innerHTML = html;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="text-align: center; color: var(--error-color); grid-column: 1 / -1;">Failed to load members data.</p>';
        }
    } catch (error) {
        console.error('Error loading members:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--error-color); grid-column: 1 / -1;">Error loading members data. Please try again later.</p>';
    }
});

