(function(win) {
	var $logo = $('#logo-main');

	$logo.on('click', '.add-sub-title', function() {
		var $this = $(this);

		$this.addClass('active');
	});

	$('#color-picker').minicolors({
		opacity: true
	});

	function renderLogo() {
		var $canvas = document.getElementById('canvas');
		var ctx = $canvas.getContext("2d");

		// ctx.lineWidth = 10;

		ctx.fillStyle="#0000ff";
		ctx.fillRect(0,0,650,110);
	}

	renderLogo();
})(window);