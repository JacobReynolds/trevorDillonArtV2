//Ending number of the image we're on
var imageAmount = 10;
//How many images to load at a time
var loadAmount = 10;
var imagePath = 'images/portfolio/';

function loadMore() {
    imageAmount += loadAmount;
    $.get('/portfolio', {
        amount: imageAmount
    }).success(function (data) {
        data.forEach(function (image) {
            $('#photos').append('<div id="advancedImageContainer" onclick="enlargePicture(this);"><img src="' + imagePath + image + '"/></div>');
        })
    })
}
