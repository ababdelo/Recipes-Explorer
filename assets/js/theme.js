$(document).ready(() => {
    const $themeToggleBtn = $('#theme-toggle');
    const $themeIcon = $themeToggleBtn.find('i');
    const savedTheme = localStorage.getItem('theme') || 'light';

    applyTheme(savedTheme);

    $themeToggleBtn.on('click', () => {
        const newTheme = $('html').attr('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function applyTheme(theme) {
        $('html').attr('data-theme', theme);
        if (theme === 'dark') {
            $themeIcon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            $themeIcon.removeClass('fa-sun').addClass('fa-moon');
        }
    }
});
