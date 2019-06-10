var $logo = $('#logo-main'),
	$logoAdd = $('#logo-img-add'),
	$imgDelete = $('#img-delete'),
	$preview = document.getElementById("preview");

/* ------------- 初始化 登录页 和 首页 【配置信息 见 logoGen.js】------------- */
var loginLogo = new LogoGen({
	logoModule: "#login-info",
	canvasId: "canvas",
	canvasBox: "#canvas-box",
	canvasConfig: {
		title: "新点网上协同办公平台"
	}
});

var homeLogo = new LogoGen({
	logoModule: "#home-info",	// 整个canvas所在的模块id
	canvasId: "home-canvas",	// canvas 的id
	canvasBox: "#home-canvas-box", // canvas 的盒子
	canvasConfig: {
		width: 300,
		height: 50,
		title: "新点网上协同办公平台"
	},
	titleConfig: {
		size: "18px"
	},
	subTitleConfig: {
		size: "12px"
	},
	imgInfo: {
		time: 60
	}
});

/* ------------- 初始化 登录页 和 首页 end ------------- */

(function(win) {
	

	/* ------------- 初始化一个logo ------------- */

	var tempOpt= {
		width: 150,
		height: 66,
		imgUrl: "./css/logo.png"
		// first: true
	};

	loginLogo.setImg(tempOpt);

	homeLogo.setImg(tempOpt);

	$preview.src = tempOpt.imgUrl;

	$logoAdd.removeClass('nopic');



	/* ------------- 初始化一个logo  end ------------- */

})(window);


// 全局事件
(function() {
	var $dialogBg = $('#dialog-bg'),
		$dialogBox = $('#dialog-box'),
        $dialogResult = $('#dialog-result'),
		$dialogTip = $('.check-tip', $dialogBox),
        $logoInfo = $('#login-info'),
        $logoWidth = $('.logo-width', $logoInfo),
        $logoHeight = $('.logo-height', $logoInfo);

    $logo.on('click', '.add-sub-title', function() {
        var $this = $(this);
        $this.addClass('active');
    });

    $logoAdd.on('click', '.img-delete', function() {
    	var tempOpt= {
			width: 0,
			height: 0,
			imgUrl: ""
		};

		loginLogo.setImg(tempOpt);

		homeLogo.setImg(tempOpt);

		$preview.src = tempOpt.imgUrl;

		$logoAdd.addClass('nopic');

		$(this).addClass('hidden')
    });

    $('#color-picker').minicolors({
        opacity: true
    });

    $('body').on('click', '.check-tip', function() {
    	var $this = $(this);

    	if($this.hasClass('select')) {
    		$this.removeClass('select');
    	} else {
    		$this.addClass('select');
    	}

    }).on('click','.dialog-close,.dialog-ok', function() {
    	if($dialogTip.hasClass('select')) {
    		localStorage.select = "1";
    	} else {
    		localStorage.select = "-";
    	};

    	$dialogBox.addClass('hidden');
    	$dialogBg.addClass('hidden');
        $dialogResult.addClass('hidden');
    }).on('click', '.tip', function() {
        $dialogBox.removeClass('hidden');
        $dialogBg.removeClass('hidden');
    }).on('input propertychange', '#theme-select', function() {
        var val = $(this).val();
        console.log(val);
        if(val == 'dream') {
            $logoWidth.val(630);
            $logoHeight.val(64);

            loginLogo.setSize({
                width: 630,
                height: 64
            });

            homeLogo.setSize({
                width: 318,
                height: 28 
            });

        } else if(val == 'grace') {
            loginLogo.setSize({
                width: 580,
                height: 58
            });
            homeLogo.setSize({
                width: 324,
                height: 32 
            });
        } else if(val == 'aide') {
            loginLogo.setSize({
                width: 580,
                height: 58
            });
            homeLogo.setSize({
                width: 296,
                height: 24 
            });
            
        } else if(val == 'breeze') {
            loginLogo.setSize({
                width: 580,
                height: 58
            });

            homeLogo.setSize({
                width: 188,
                height: 36 
            });
        } else if(val == 'metro') {
            loginLogo.setSize({
                width: 630,
                height: 64
            });
            homeLogo.setSize({
                width: 284,
                height: 34 
            });
        } else if(val == 'imac') {
            loginLogo.setSize({
                width: 630,
                height: 64
            });
            homeLogo.setSize({
                width: 314,
                height: 30 
            });
        } else {
            loginLogo.setSize({
                width: 650,
                height: 110
            });
            homeLogo.setSize({
                width: 300,
                height: 50 
            });
        }

    });

	if(localStorage.select == "1") {
    	// 不在提示
    	$dialogTip.addClass('select');

    	$dialogBox.addClass('hidden');
    	$dialogBg.addClass('hidden');
    } else {
    	$dialogBox.removeClass('hidden');
    	$dialogBg.removeClass('hidden');

    	$dialogTip.removeClass('select');
    }

    var $downText = $('.down-text');
    if(browserIsIe()) {
        $downText.text('生成');
    } else {
        $downText.text('下载');
    }
    




})();


// 渲染图片
(function(win) {

    var oFReader = new FileReader(),
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    var $upload = document.getElementById("upload");
        
    oFReader.onload = function(oFREvent) {
        var imgUrl = oFREvent.target.result;
        $preview.src = imgUrl;
        $logoAdd.removeClass('nopic');
        $imgDelete.removeClass('hidden');
        
        getImgInfo({
            url: imgUrl,
            callback: function(opt) {
                // console.log(opt);
                
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
        // console.log(oFile);
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
