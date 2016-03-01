var previousImage = null;

//Gets called after load from pages it is injected in
var smallWidth, largeWidth;

//Set the image dimensions for enlarging images
//Some handling here so that when you enlarge an image it doesn't push its neighbor to the next line
function setImageDimensions() {
    var image = $('#advancedImageContainer').first().find('img')
    smallWidth = image.width();
    largeWidth = smallWidth + 200;
    var maxWidth = image.css('max-width');
    largeWidth = Math.min(largeWidth, maxWidth.replace('px', ''));
}

//Enlarge the child image element, make the previously enlarged element small
function enlargePicture(parent) {
    var image = $(parent).find('img');
    var newPreviousImage;
    var width;
    if (image.width() <= smallWidth) {
        width = largeWidth;
        newPreviousImage = image;
    } else {
        width = smallWidth;
        newPreviousImage = null;
    }
    image.css('width', width);
    if (previousImage !== null) {
        previousImage.removeAttr('style');
    }
    previousImage = newPreviousImage;
}

//Only after a window resize has finished, update the attributes.
var resizeId;
$(window).resize(function () {
    clearTimeout(resizeId);
    var resizeId = setTimeout(function () {
        updateAfterResize();
    }, 500)
})

//Clear expanded elements, reset dimensions
function updateAfterResize() {
    $('#advancedImageContainer img').each(function () {
        $(this).removeAttr('style');
    })
    previousImage = null;
    setImageDimensions();
}
