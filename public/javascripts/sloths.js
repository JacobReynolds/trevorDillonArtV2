$(document).ready(function () {

    $('.sortable').sortable({
        start: function (event, ui) {
            clone = $(ui.item[0].outerHTML).clone();
        },
        placeholder: {
            element: function (clone, ui) {
                return $('<li id="editImageContainerPlaceholder"></li>');
            },
            update: function () {
                return;
            }
        },
        stop: function () {
            updateImageOrder();
        }

    });
})

function updateImageOrder() {
    var images = $('.editImage').get().map(function (element) {
        return element.id;
    })
    $.post({
        url: '/updateImageOrder',
        data: JSON.stringify(images),
        contentType: 'application/json',
        success: function (ids) {
            var images = $('.editImage').get();
            images.forEach(function (image, index) {
                $(image).attr('id', ids[index]);
            })
        }
    })
}

function removeImage(button, imageId) {
    $.post({
        url: '/removeImage',
        data: {
            imageId: imageId
        },
        success: function () {
            $(button).parent().remove();
        }
    })
}
