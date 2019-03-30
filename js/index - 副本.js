var $logoPic = $('#logo-pic'),
    $logoImgBox = $('#logo-img'),
    $logoInfo = $('#login-info'),
    $logo = $('#logo-main'),
    $logoTitle = $('#logo-title'),  
    $logoSubTitle = $('#logo-sub-title'),
    $font = $('#logo-font-size'), // 字体大小
    $weight = $('#logo-font-weight'), // 粗细
    $family = $('#logo-font-family'), // 字体
    $color = $('#text-picker'), // 颜色

    $textInfo = $('.text-info', $logoInfo),

    DEFAULT_LEFT = 10,
    DEFAULT_MARGIN = 20,

    // 登录页
    imgInfo = {
        width: 0,
        height: 0
    },
    cacheImgInfo = {};
    

// 全局事件
(function() {
    $logo.on('click', '.add-sub-title', function() {
        var $this = $(this);

        $this.addClass('active');
    });

    $('#color-picker').minicolors({
        opacity: true
    });
    $('#text-picker').minicolors({
        opacity: true
    });
})();

var 
    $logoWidth = $('.logo-width', $logoInfo),
    $logoHeight = $('.logo-height', $logoInfo),
    $picTimes = $('.pic-times', $logoInfo),

    canvasConfig = {
        bg: "#00f",
        width: 650,
        height: 110,
        title: "",
        subTitle: ""
    },
    titleConfig = {
        size: "24px",
        weight: "500",
        color: "#fff",
        family: "Microsoft YaHei"
    },
    subTitleConfig = {
        size: "18px",
        weight: "500",
        color: "#fff",
        family: "Microsoft YaHei"
    },
    currentTtile = "";

// 渲染 登录页 logo
(function(win) {
    
    var $canvasBox = $('#canvas-box'),
        $canvas = document.getElementById('canvas'),
        ctx = $canvas.getContext("2d");

    function initPic() {
        $logoWidth.val(canvasConfig.width);
        $logoHeight.val(canvasConfig.height);
    }

    initPic();


    // 渲染logo的画布
    function renderLogo(opt) {
        var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;

        $canvas.style.width = _width + 'px';
        $canvas.style.height = _height + 'px';

        ctx.fillStyle = _bg;
        ctx.fillRect(0, 0, _width, _height);
    }

    renderLogo();

    var $colorPicker = $('#color-picker');
    var $textPicker = $('#text-picker');

    $('body').on('input propertychange', '#color-picker', function() {
        canvasConfig.bg = $colorPicker.minicolors("rgbaString", $(this).val());

        renderLogo();

    }).on('input propertychange', '#logo-name', function() {
        canvasConfig.title = $(this).val();

        $logoTitle.text(canvasConfig.title);

        renderTitle();

    }).on('input propertychange', '#add-sub-title', function() {
        canvasConfig.subTitle = $(this).val();

        $logoSubTitle.text(canvasConfig.subTitle);

        renderTitle();
    }).on('click', '#logo-title', function() {
        currentTtile = "title";
        initFont();

    }).on('click', '#logo-sub-title', function() {
        currentTtile = "subTitle";
        initFont();

    }).on('click', '#logo-img', function() {

    });


    $logoInfo.on('input propertychange', ".logo-width", function() {
        canvasConfig.width = $(this).val();
        renderLogo();

    }).on('input propertychange', '.logo-height', function() {
        canvasConfig.height = $(this).val();
        renderLogo();

    }).on('click', '.result', function() {
        renderResultLogo();

        convertCanvasToImage(document.getElementById('canvas-result'))

    }).on('input propertychange', '#logo-font-family', function() {
        // 标题字体
        var _val = $(this).val();
        if (currentTtile == 'title') {
            titleConfig.family = _val;
        } else {
            subTitleConfig.family = _val;
        }
        renderTitle();

    }).on('input propertychange', '#logo-font-weight', function() {
        // 标题字体粗细
        var _val = $(this).val();

        if (currentTtile == 'title') {
            titleConfig.weight = _val;
        } else {
            subTitleConfig.weight = _val;
        }

        renderTitle();

    }).on('input propertychange', '#logo-font-size', function() {
        // 标题字体大小
        var _val = $(this).val();

        if (currentTtile == 'title') {
            titleConfig.size = _val;
        } else {
            subTitleConfig.size = _val;
        }
        renderTitle();

    }).on('input propertychange', '#text-picker', function() {
        // titleConfig.color = $textPicker.minicolors("rgbaString", $(this).val());
        var _val =  $textPicker.minicolors("value");

        if (currentTtile == 'title') {
            titleConfig.color = _val;
        } else {
            subTitleConfig.color = _val;
        }

        renderTitle();

    }).on('click', '.icon-plus', function() {
        var _time = parseInt($picTimes.data('time'));

        _time = _time + 10;

        $picTimes.data('time', _time).val(_time + "%");
        console.log("plus")
        console.log(_time)
        renderImg({
            time: _time
        });

    }).on('click', '.icon-reduce', function() {
        var _time = parseInt($picTimes.data('time'));

        if(_time > 10) {
            _time = _time - 10;
        } else {
            _time = 10;
        }
        console.log("reduce")
        console.log(_time)

        $picTimes.data('time', _time).val(_time + "%");

        renderImg({
            time: _time
        });
    });

    $logoImgBox.resizable({
        containment: "#canvas-box"
    });
    $logoImgBox.draggable({
        containment: "#canvas-box"
    });
    $logoTitle.draggable({
        containment: "#canvas-box"
    });
    $logoSubTitle.draggable({
        containment: "#canvas-box"
    });


})(window);




/*// 首页配置
var homeImgInfo = {
        width: 0,
        height: 0
    },
    homeCanvasConfig = {
        bg: "#00f",
        width: 300,
        height: 50,
        title: "",
        subTitle: ""
    },
    homeTitleConfig = {
        size: "24px",
        weight: "500",
        family: "Microsoft YaHei"
    },
    homeSubTitleConfig = {
        size: "18px",
        weight: "500",
        family: "Microsoft YaHei"
    },
    homeCurrentTtile = "";

var $homeLogoImgBox = $('#logo-img-home'),
    $homeLogoPic = $('#logo-pic-home'),
    $homeInfo = $('#home-info'),
    $homeLogoWidth = $('.logo-width', $homeInfo),
    $homeLogoHeight = $('.logo-height', $homeInfo);

// 渲染 首页 logo
(function(win) {
    var $canvasBox = $('#canvas-box'),
        $canvas = document.getElementById('canvas-home'),
        ctx = $canvas.getContext("2d");

    // 渲染logo的画布
    function renderLogo(opt) {
        var _bg = homeCanvasConfig.bg,
            _width = homeCanvasConfig.width,
            _height = homeCanvasConfig.height;

        $canvas.style.width = _width + 'px';
        $canvas.style.height = _height + 'px';

        ctx.fillStyle = _bg;
        ctx.fillRect(0, 0, _width, _height);
    }

    renderLogo();

    $homeLogoImgBox.draggable({
        containment: "#canvas-box-home"
    });
    // $logoTitle.draggable({
    //     containment: "#canvas-box-home"
    // });
    // $logoSubTitle.draggable({
    //     containment: "#canvas-box-home"
    // });

})(window);*/

// 文本信息
(function(win) {
    var logoTitle = document.getElementById('logo-title'), // 标题位置
        logoSubTitle = document.getElementById('logo-sub-title'); // 副标题位置

    win.getTitleSite = function(opt) {
        !opt && (opt = {});
        var reset = opt.reset ||false,
            _width = imgInfo.width; // opt.home ? imgInfo.width : homeImgInfo.width;

        return {
            top: logoTitle.offsetTop || 0,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + _width) : logoTitle.offsetLeft
        };
    };

    win.getSubTitleSite = function(reset) {
        return {
            top: logoSubTitle.offsetTop || 0,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + imgInfo.width) : logoSubTitle.offsetLeft
        };
    };

    win.renderTitle = function(reset) {
        $logoTitle.css({
            left: getTitleSite({ reset: reset, home: false}).left + 'px',
            fontSize: titleConfig.size,
            fontWeight: titleConfig.weight,
            fontFamily: titleConfig.family,
            color: titleConfig.color
        });

        $logoSubTitle.css({
            left: getSubTitleSite(reset).left + 'px',
            fontSize: subTitleConfig.size,
            fontWeight: subTitleConfig.weight,
            fontFamily: subTitleConfig.family,
            color: subTitleConfig.color
        });
    };

    // 初始化字体大小
    win.initFont = function() {
        if (currentTtile) {

            $textInfo.removeClass('hidden');

            if (currentTtile == 'title') {
                $font.val(titleConfig.size);
                $weight.val(titleConfig.weight);
                $family.val(titleConfig.family);
                $color.minicolors("value", titleConfig.color);
            } else if (currentTtile == 'subTitle') {
                $font.val(subTitleConfig.size);
                $weight.val(subTitleConfig.weight);
                $family.val(subTitleConfig.family);
                // $color.val(subTitleConfig.color);
                $color.minicolors("value", subTitleConfig.color);
            }
        } else {

            $textInfo.addClass('hidden');
        }
    };

    

    win.renderImg = function(opt) {
        var time = opt.time/100;

        console.log(time);
        imgInfo.width = cacheImgInfo.width * time;
        imgInfo.height = cacheImgInfo.height * time;


        $logoImgBox.css({
            width: imgInfo.width + 'px',
            height: imgInfo.height + 'px',
        });
    }


})(window);

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

                function loginImg() {
                    var box_height = $logoHeight.val(), // 容器高度
                        top = 0; // 图片容器距离顶部的距离

                    // 图片高度大于容器高度，则图片高度等于容器高度
                    if (opt.height > box_height) {
                        var r = opt.width / opt.height;
                        opt.height = box_height;
                        opt.width = opt.height * r;
                    } else {
                        top = (box_height - opt.height) / 2
                    }

                    imgInfo.width = opt.width;
                    imgInfo.height = opt.height;

                    cacheImgInfo = JSON.parse(JSON.stringify(imgInfo));

                    $logoPic.attr('src', imgUrl);

                    $logoImgBox.css({
                        width: imgInfo.width + 'px',
                        height: imgInfo.height + 'px',
                        top: top + 'px',
                        left: DEFAULT_LEFT + 'px'
                    });
                }

                loginImg();

                function homeImg() {
                    var box_height = $homeLogoHeight.val(), // 容器高度
                        top = 0; // 图片容器距离顶部的距离
                    
                    console.log(box_height);

                    // 图片高度大于容器高度，则图片高度等于容器高度
                    if (opt.height > box_height) {
                        var r = opt.width / opt.height;
                        opt.height = box_height;
                        opt.width = opt.height * r;
                    } else {
                        top = (box_height - opt.height) / 2
                    }

                    homeImgInfo.width = opt.width;
                    homeImgInfo.height = opt.height;

                    $homeLogoPic.attr('src', imgUrl);

                    $homeLogoImgBox.css({
                        width: homeImgInfo.width + 'px',
                        height: homeImgInfo.height + 'px',
                        top: top + 'px',
                        left: DEFAULT_LEFT + 'px'
                    });

                }

                // homeImg();

                // .css({
                //     width: imgInfo.width + 'px',
                //     height: imgInfo.height + 'px'
                // });
                
                renderTitle(true);
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

        // ctx.fillStyle = _bg;

        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, _width, _height);

        // 绘图
        var img = document.getElementById('logo-pic'); // 图片本身

        var imgBox = document.getElementById('logo-img'), // 图片容器确定位置
            imgSite = {
                top: imgBox.offsetTop,
                left: imgBox.offsetLeft
            };
            console.log(imgInfo);
        ctx.drawImage(img, imgSite.left, imgSite.top, imgInfo.width, imgInfo.height);

        // 字体

        // 大标题
        var titleSite = getTitleSite();
        ctx.font = titleConfig.weight + ' ' + titleConfig.size + ' ' + titleConfig.family;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = titleConfig.color;
        ctx.fillText(canvasConfig.title, titleSite.left, titleSite.top + 8);

        // 小标题
        var subTitleSite = getSubTitleSite();
        ctx.font = subTitleConfig.weight + ' ' + subTitleConfig.size + ' ' + subTitleConfig.family;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = subTitleConfig.color;
        ctx.fillText(canvasConfig.subTitle, subTitleSite.left, subTitleSite.top + 5);
    }

    win.convertCanvasToImage = function(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        // window.location.href=image;
        // return image;
        var a = document.createElement('a');
       a.href = canvas.toDataURL('image/png'); //下载图片
       a.download = canvasConfig.title + ".png"; 
       a.click();
    }

    // renderLogo();

})(window);