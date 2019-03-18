(function(win) {
    var $logo = $('#logo-main'),
        $canvas = document.getElementById('canvas'),
        ctx = $canvas.getContext("2d"),
        canvasConfig = {
            bg: "#00f",
            width: 650,
            height: 110
        }

	$logo.on('click', '.add-sub-title', function() {
		var $this = $(this);

		$this.addClass('active');
	});

	$('#color-picker').minicolors({
		opacity: true
	});

	function renderLogo(opt) {
        var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;

        $canvas.style.width = _width + 'px';
        $canvas.style.height = _height + 'px';
        
		// ctx.lineWidth = 10;

		ctx.fillStyle = _bg;
		ctx.fillRect(0,0,_width,_height);
	}

	renderLogo();

    $('body').on('input propertychange', '#color-picker', function() {
        canvasConfig.bg = $(this).val();
        renderLogo();

    }).on('input propertychange', "#logo-width", function() {
        canvasConfig.width = $(this).val();
        renderLogo();
        
    }).on('input propertychange', '#logo-height', function() {
        canvasConfig.height = $(this).val();
        renderLogo();
        
    });
})(window);

(function(win) {
    var oFReader = new FileReader(), 
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    var $upload = document.getElementById("upload"),
        $preview = document.getElementById("preview");

    oFReader.onload = function (oFREvent) {
        $preview.src = oFREvent.target.result;
        // $preview.style.backgroundImage = 'url('+oFREvent.target.result+')';
    };

    // 导入图片
    win.loadImageFile = function() {

        if ($upload.files.length === 0) { 
            return; 
        }
        var oFile = $upload.files[0];
    
        if (!rFilter.test(oFile.type)) { 
            alert("You must select a valid image file!"); 
            return; 
        }
        oFReader.readAsDataURL(oFile);
    }
    
})(window);