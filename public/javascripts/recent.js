var previousImage = null;


function loadInsta() {
    "use strict";
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/users/self/media/recent?access_token=229943735.71da50e.ed75f052e06949b8884e564c3666cc95",
        success: function (data) {
            parseImages(data.data.map(function (x) {
                return {
                    url: x.images.standard_resolution.url,
                    description: x.caption.text
                };
            }));
        }
    });
}

function parseImages(images) {
    images.forEach(function (image) {
        $('#recentWrapper #photos').append('<div id="advancedImageContainer" onclick="enlargePicture(this);"><div class="detail"><p>' + image.description + '</p></div><img src="' + image.url + '"/></div>');
    })

    //A call for enlargeImage.js
    setImageDimensions();
}

loadInsta();
