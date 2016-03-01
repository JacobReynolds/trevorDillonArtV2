var previousImage = null;

//Gets called after load from pages it is injected in
var smallWidth, largeWidth;

function setImageDimensions() {
    smallWidth = $('#advancedImageContainer').first().find('img').width();
    largeWidth = smallWidth + 200;
}

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
    image.css({
        width: width
    });
    if (previousImage !== null) {
        previousImage.css({
            width: smallWidth
        });
    }
    previousImage = newPreviousImage;
}
