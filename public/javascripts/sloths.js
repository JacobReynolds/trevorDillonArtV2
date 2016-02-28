$(document).ready(function () {
    $('.sortable').sortablePhotos({
        selector: '> #editImageContainer',
        sortable: true,
        padding: 2,
        afterDrop: function () {
            updateImageOrder();
        }
    });
})

function updateImageOrder() {
    var images = $('.editImage').get().map(function (element) {
        return element.id;
    })
    var test = JSON.stringify(images);
    $.post({
        url: '/updateImageOrder',
        data: JSON.stringify(images),
        contentType: 'application/json',
        success: function () {
            location.reload();
        }
    })
}
