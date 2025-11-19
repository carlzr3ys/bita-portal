// Load alumni data from database
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('alumniGrid');
    if (!grid) return;

    try {
        const response = await fetch('api/get_alumni.php');
        const result = await response.json();

        if (result.success && result.alumni) {
            // Clear existing content
            grid.innerHTML = '';
            
            if (result.alumni.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No alumni records found.</p>';
                return;
            }
            
            // Add alumni cards
            result.alumni.forEach(alum => {
                const card = document.createElement('div');
                card.className = 'alumni-card';
                
                let html = `
                    <h3>${alum.name || 'N/A'}</h3>
                    <p><strong>Matric:</strong> ${alum.matric || 'N/A'}</p>
                `;
                
                if (alum.batch) {
                    html += `<p><strong>Batch:</strong> ${alum.batch}</p>`;
                }
                
                if (alum.current_company) {
                    html += `<p><strong>Current Position:</strong> ${alum.current_company}</p>`;
                }
                
                if (alum.bio) {
                    html += `<p style="margin-top: 1rem; color: var(--text-light);">${alum.bio}</p>`;
                }
                
                // Social media links
                const socialLinks = [];
                if (alum.linkedin) socialLinks.push(`<a href="${alum.linkedin}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-linkedin"></i></a>`);
                if (alum.instagram) socialLinks.push(`<a href="${alum.instagram}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-instagram"></i></a>`);
                if (alum.facebook) socialLinks.push(`<a href="${alum.facebook}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-facebook"></i></a>`);
                if (alum.twitter) socialLinks.push(`<a href="${alum.twitter}" target="_blank" style="color: var(--primary-color); margin-right: 0.5rem;"><i class="fab fa-twitter"></i></a>`);
                
                if (socialLinks.length > 0) {
                    html += `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">${socialLinks.join('')}</div>`;
                }
                
                card.innerHTML = html;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="text-align: center; color: var(--error-color); grid-column: 1 / -1;">Failed to load alumni data.</p>';
        }
    } catch (error) {
        console.error('Error loading alumni:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--error-color); grid-column: 1 / -1;">Error loading alumni data. Please try again later.</p>';
    }
});

