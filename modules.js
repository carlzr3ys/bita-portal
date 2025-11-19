// Module navigation and content switching
document.addEventListener('DOMContentLoaded', () => {
    const moduleLinks = document.querySelectorAll('.module-link');
    const moduleSections = document.querySelectorAll('.module-section');
    const sidebar = document.getElementById('modulesSidebar');

    // Handle module link clicks
    moduleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active link
            moduleLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            moduleSections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                const navMenu = document.getElementById('navMenu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu && hamburger) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Make sidebar collapsible on mobile
    if (window.innerWidth <= 768 && sidebar) {
        const sidebarTitle = sidebar.querySelector('h3');
        if (sidebarTitle) {
            sidebarTitle.style.cursor = 'pointer';
            sidebarTitle.addEventListener('click', () => {
                const sidebarList = sidebar.querySelector('ul');
                if (sidebarList) {
                    sidebarList.style.display = 
                        sidebarList.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }
});

