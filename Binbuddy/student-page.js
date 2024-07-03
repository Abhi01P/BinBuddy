function toggleMenu() {
    const hoverContent = document.getElementById('hover-content');
    hoverContent.style.display = hoverContent.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    const hoverContent = document.getElementById('hover-content');
    const hoverMain = document.querySelector('.hover-main');
    if (!hoverMain.contains(event.target) && !hoverContent.contains(event.target)) {
        hoverContent.style.display = 'none';
    }
});
