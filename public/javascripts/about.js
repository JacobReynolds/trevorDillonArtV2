var userid = '562113665';
var access_token = '229943735.71da50e.ed75f052e06949b8884e564c3666cc95';
$(document).ready(function () {
    function loadProfilePicture() {
        "use strict";
        $.ajax({
            type: "POST",
            dataType: "jsonp",
            cache: false,
            url: '//graph.facebook.com/v2.5/' + userid + '/picture?width=300',
            success: function (data) {
                $('#portfolioPicture').attr('src', data.data.url);
            }
        });
    }

    loadProfilePicture();
})
