document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.querySelector('.sidebars');
    var sidebarOpen = document.querySelector('.sidebars-ouvert');

    if (sidebar) {
        sidebar.addEventListener('click', function() {
            event.stopPropagation();
            sidebar.classList.toggle('open');
            sidebarOpen.classList.toggle('open');
        });
    }

    document.addEventListener('click', function(event) {
        if (!sidebarOpen.contains(event.target)) { 
            sidebar.classList.remove('open');
            sidebarOpen.classList.remove('open');
        }
    });
});

let lastScroll = 0;
const header = document.querySelector("header nav"); 

window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 300) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
});

function gostart(url) {
    window.location.href = url;
}

