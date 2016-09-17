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
	tinymce.init({
		selector: '#biography',
		height: '480'
	});
	$.get('/aboutStatic', function (value) {
		tinyMCE.activeEditor.setContent(value);
	})
})

function updateBiography() {
	$.post('/updateBiography', {
		biography: tinyMCE.activeEditor.getContent({
			format: 'raw'
		}),
		function () {
			$('#success').css('opacity', '1');
			setTimeout(function () {
				$('#success').css('opacity', '0');
			}, 1000)
		}
	}).fail(function () {
		$('#error').css('opacity', '1');
		setTimeout(function () {
			$('#error').css('opacity', '0');
		}, 1000)
	});
}

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
