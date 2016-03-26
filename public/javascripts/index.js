//GoDaddy nests in a iframe which removes our meta tags, this will make sure to add them
initializeMobile();

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

function initializeMobile() {
    var headTag = window.parent.document.getElementsByTagName('head');

    if (headTag[0].innerHTML.indexOf('viewport') === -1) {
        $(headTag).append('<meta name="viewport" content="width=device-width, initial-scale=1"/>');
    }
}
