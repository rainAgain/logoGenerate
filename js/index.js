var $logoPic = $('#logo-pic'),
    $logoImgBox = $('#logo-img'),
    $logoWidth = $('#logo-width'),
    $logoHeight = $('#logo-height'),
    $logoTitle = $('#logo-title'),
    $logoSubTitle = $('#logo-sub-title'),

    DEFAULT_LEFT = 10,
    DEFAULT_MARGIN = 20,

    imgInfo = {
        width: 0,
        height: 0
    },
    canvasConfig = {
        bg: "#00f",
        width: 650,
        height: 110,
        title: "",
        subTitle: ""
    };

// 渲染logo
(function(win) {
    var $logo = $('#logo-main'),
    	$canvasBox = $('#canvas-box'),
        $canvas = document.getElementById('canvas'),
        ctx = $canvas.getContext("2d");
        
    
    function initPic() {
        $logoWidth.val(canvasConfig.width);
        $logoHeight.val(canvasConfig.height);
    }

    initPic();

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
        console.log(_bg);
		ctx.fillStyle = _bg;
		ctx.fillRect(0,0,_width,_height);
	}

	renderLogo();

    var $colorPicker = $('#color-picker');
    $('body').on('input propertychange', '#color-picker', function() {
        canvasConfig.bg = $colorPicker.minicolors("rgbaString", $(this).val());
        
        // console.log($colorPicker.minicolors("opacity", $(this).val()))

        renderLogo();

    }).on('input propertychange', "#logo-width", function() {
        canvasConfig.width = $(this).val();
        renderLogo();
        
    }).on('input propertychange', '#logo-height', function() {
        canvasConfig.height = $(this).val();
        renderLogo();
        
    }).on('input propertychange', '#logo-name', function() {
        canvasConfig.title = $(this).val();

        $logoTitle.text(canvasConfig.title);

        renderTitle();

    }).on('input propertychange', '#add-sub-title', function() {
        canvasConfig.subTitle = $(this).val();

        $logoSubTitle.text(canvasConfig.subTitle);

        renderTitle();
    }).on('click', '.result', function() {
        renderResultLogo();
    })

    $logoImgBox.resizable({containment: "#canvas-box"});
    $logoImgBox.draggable({containment: "#canvas-box"});
    $logoTitle.draggable({containment: "#canvas-box"});
    $logoSubTitle.draggable({containment: "#canvas-box"});

    
})(window);

// 渲染图片
(function(win) {
    var oFReader = new FileReader(), 
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    var $upload = document.getElementById("upload"),
        $preview = document.getElementById("preview");

    oFReader.onload = function (oFREvent) {
        var imgUrl = oFREvent.target.result;
        $preview.src = imgUrl;
        // console.log(imgUrl);
        // console.log($logoImg);
        
        getImgInfo({
            url: imgUrl,
            callback: function(opt) {
                console.log(opt);

                var box_height = $logoHeight.val(), // 容器高度
                    top = 0; // 图片容器距离顶部的距离

                // 图片高度大于容器高度，则图片高度等于容器高度
                if(opt.height > box_height) {
                    var r = opt.width / opt.height;
                    opt.height = box_height;
                    opt.width = opt.height * r;
                } else {
                    top = (box_height - opt.height) / 2
                }

                imgInfo.width = opt.width;
                imgInfo.height = opt.height;

                $logoPic.attr('src', imgUrl).css({
                    width: imgInfo.width + 'px',
                    height: imgInfo.height + 'px'
                });

                
                $logoImgBox.css({
                    width: imgInfo.width + 'px',
                    height: imgInfo.height + 'px',
                    top: top + 'px',
                    left: DEFAULT_LEFT + 'px'
                });

                renderTitle();
            }
        })
        // $preview.style.backgroundImage = 'url('+oFREvent.target.result+')';
    };
    
    win.renderTitle = function() {
        $logoTitle.css({
            left: DEFAULT_LEFT + DEFAULT_MARGIN + imgInfo.width + 'px'
        });

        $logoSubTitle.css({
            left: DEFAULT_LEFT + DEFAULT_MARGIN + imgInfo.width + 'px'
        });
    }

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
        console.log(oFile);
        oFReader.readAsDataURL(oFile);
    }

    function getImgInfo(opt) {
        var img_url = opt.url,
            callback = opt.callback || $.noop;
        var img = new Image(),
            width = 0,
            height = 0;

        img.src = img_url;

        if(img.complete) {
            width = img.width;
            height=  img.height;
            if(typeof callback == 'function') {
                callback({
                    width: width,
                    height: height
                });
            }
        } else {
            img.onload = function() {
                width = img.width;
                height=  img.height;

                if(typeof callback == 'function') {
                    callback({
                        width: width,
                        height: height
                    });
                }
            }
        }
    }
    
})(window);

(function(win) {
    var $canvas = document.getElementById('canvas-result'),
        ctx = $canvas.getContext("2d");
    
    win.renderResultLogo = function(opt) {
        var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;

        $canvas.style.width = _width + 'px';
        $canvas.style.height = _height + 'px';
        
        // ctx.lineWidth = 10;
        console.log(_bg);
        ctx.fillStyle = _bg;
        ctx.fillRect(0,0,_width,_height);
        var img = document.getElementById('logo-pic');

        ctx.drawImage(img,10,10,imgInfo.width,imgInfo.height);

        ctx.font="20px Georgia";
        ctx.strokeText(canvasConfig.title,130,10);

        ctx.font="30px Verdana";
        ctx.strokeText(canvasConfig.subTitle,130,50);
    }

    // renderLogo();
    
})(window);