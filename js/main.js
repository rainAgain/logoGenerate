var $logo = $('#logo-main');

var loginLogo = new LogoGen({
	logoModule: "#login-info",
	canvasId: "canvas",
	canvasBox: "#canvas-box"
});

var homeLogo = new LogoGen({
	logoModule: "#home-info",
	canvasId: "home-canvas",
	canvasBox: "#home-canvas-box",
	canvasConfig: {
		width: 300,
		height: 50
	},
	titleConfig: {
		size: "14px"
	},
	subTitleConfig: {
		size: "12px"
	}
});

// 全局事件
(function() {
    $logo.on('click', '.add-sub-title', function() {
        var $this = $(this);
        $this.addClass('active');
    });
    $('#color-picker').minicolors({
        opacity: true
    });
})();


// 渲染图片
(function(win) {
    var oFReader = new FileReader(),
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    var $upload = document.getElementById("upload"),
        $preview = document.getElementById("preview");
    oFReader.onload = function(oFREvent) {
        var imgUrl = oFREvent.target.result;
        $preview.src = imgUrl;
        getImgInfo({
            url: imgUrl,
            callback: function(opt) {
                console.log(opt);
                
                opt.imgUrl = imgUrl;

                loginLogo.setImg(opt);

                homeLogo.setImg(opt);
            }
        })
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
        console.log(oFile);
        oFReader.readAsDataURL(oFile);
    }
    // 获取图片的宽高信息
    function getImgInfo(opt) {
        var img_url = opt.url,
            callback = opt.callback || $.noop;
        var img = new Image(),
            width = 0,
            height = 0;
        img.src = img_url;
        if (img.complete) {
            width = img.width;
            height = img.height;
            if (typeof callback == 'function') {
                callback({
                    width: width,
                    height: height
                });
            }
        } else {
            img.onload = function() {
                width = img.width;
                height = img.height;
                if (typeof callback == 'function') {
                    callback({
                        width: width,
                        height: height
                    });
                }
            }
        }
    }
})(window);
