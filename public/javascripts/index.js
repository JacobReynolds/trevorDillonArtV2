$(document).ready(function () {
    //No need for the home screen to be highlighted
    if (window.location.pathname === '/') {
        addActive('home');
    } else {
        addActive(window.location.pathname.replace(/^\/([^\/]*).*$/, '$1'));
    }
})

function addActive(section) {
    $('#navOptions #' + section).addClass("active");
}
