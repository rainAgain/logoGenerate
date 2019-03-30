(function(win) {
	var DEFAULT_LEFT = 10,
    	DEFAULT_MARGIN = 20;
    var LogoGen = function() {
        this.v = "1.0.0";
        // 默认图片信息
        this.imgInfo = {
	        width: 0,
	        height: 0
	    };

	    this.cacheImgInfo = {};

	    // canvas相关配置
	    this.canvasConfig = {
	        bg: "#00f",
	        width: 650,
	        height: 110,
	        title: "",
	        subTitle: ""
	    };

	    // 大标题配置
	    this.titleConfig = {
	        size: "24px",
	        weight: "500",
	        color: "#fff",
	        family: "Microsoft YaHei"
	    };

	    // 副标题配置
	    this.subTitleConfig = {
	        size: "18px",
	        weight: "500",
	        color: "#fff",
	        family: "Microsoft YaHei"
	    };

	    // 当前选中标题
	    this.currentTtile = "";
    };

    /**
     * [init description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
   /* {
    	logoModule: $('#login-info'),
    	canvasId: "canvas"
    }*/
    LogoGen.prototype.init = function(options) {
        options = options || {};

        this.$logoInfo =  options.logoModule; // 类别模块
        
        var $logoInfo = this.$logoInfo;

        this.$logoTitle = $('.logo-title', $logoInfo); // 主标题
	    this.$logoSubTitle = $('.logo-sub-title', $logoInfo); // 副标题
	    this.$logoImgBox = $('.logo-img', $logoInfo); // 图片容器
	    this.$logoPic = $('.logo-pic', $logoInfo); // 图片本身

	    this.$font = $('.logo-font-size', $logoInfo); // 字体大小
	    this.$weight = $('.logo-font-weight', $logoInfo); // 粗细
	    this.$family = $('.logo-font-family', $logoInfo); // 字体
	    this.$textPicker = $('.text-picker', $logoInfo); // 颜色

	    this.$textInfo = $('.text-info', $logoInfo); // 控制字体设置的显示与隐藏

	    this.$logoWidth = $('.logo-width', $logoInfo);
	    this.$logoHeight = $('.logo-height', $logoInfo);
	    this.$picTimes = $('.pic-times', $logoInfo);

	    this.$canvas = document.getElementById(options.canvasId);
	    this.ctx = this.$canvas.getContext("2d");
    };

    LogoGen.prototype.initEvent = function() {
    	this.$textPicker.minicolors({
	        opacity: true
	    });

    	this.$logoInfo.on('input propertychange', ".logo-width", function() {
	        this.canvasConfig.width = $(this).val();
	        this.renderCanvas();

	    }).on('input propertychange', '.logo-height', function() {
	        this.canvasConfig.height = $(this).val();
	        this.renderCanvas();

	    }).on('click', '.result', function() {
	        renderResultLogo();
	        convertCanvasToImage(document.getElementById('canvas-result'))
	    }).on('input propertychange', '.logo-font-family', function() {
	        // 标题字体
	        var _val = $(this).val();
	        if (this.currentTtile == 'title') {
	            this.titleConfig.family = _val;
	        } else {
	            this.subTitleConfig.family = _val;
	        }
	        renderTitle();
	    }).on('input propertychange', '.logo-font-weight', function() {
	        // 标题字体粗细
	        var _val = $(this).val();
	        if (currentTtile == 'title') {
	            titleConfig.weight = _val;
	        } else {
	            subTitleConfig.weight = _val;
	        }
	        renderTitle();
	    }).on('input propertychange', '.logo-font-size', function() {
	        // 标题字体大小
	        var _val = $(this).val();
	        if (currentTtile == 'title') {
	            titleConfig.size = _val;
	        } else {
	            subTitleConfig.size = _val;
	        }
	        renderTitle();
	    }).on('input propertychange', '.text-picker', function() {
	        // titleConfig.color = $textPicker.minicolors("rgbaString", $(this).val());
	        var _val = $textPicker.minicolors("value");
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
	        if (_time > 10) {
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
	    }).on('click', '.logo-title', function() {
	        currentTtile = "title";
	        initFont();
	    }).on('click', '.logo-sub-title', function() {
	        currentTtile = "subTitle";
	        initFont();
	    });

    }

    // 渲染canvas画布
    LogoGen.prototype.renderCanvas = function() {
    	var canvasConfig = this.canvasConfig;

    	var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;
        this.$canvas.style.width = _width + 'px';
        this.$canvas.style.height = _height + 'px';
        this.ctx.fillStyle = _bg;
        this.ctx.fillRect(0, 0, _width, _height);
    }

    LogoGen.prototype.getTitleSite = function(reset) {
    	var logoTitle = this.$logoTitle[0];
    	return {
            top: logoTitle.offsetTop || 0,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + this.imgInfo.width) : logoTitle.offsetLeft
        };
    }

    LogoGen.prototype.getSubTitleSite = function(reset) {
    	var logoSubTitle = this.$logoSubTitle[0];
        return {
            top: logoSubTitle.offsetTop || 0,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + imgInfo.width) : logoSubTitle.offsetLeft
        };
    };

    LogoGen.prototype.renderTitle = function(reset) {
    	var that = this;
        this.$logoTitle.css({
            left: that.getTitleSite(reset).left + 'px',
            fontSize: that.titleConfig.size,
            fontWeight: that.titleConfig.weight,
            fontFamily: that.titleConfig.family,
            color: that.titleConfig.color
        });
        this.$logoSubTitle.css({
            left: that.getSubTitleSite(reset).left + 'px',
            fontSize: that.subTitleConfig.size,

            fontWeight: that.subTitleConfig.weight,
            fontFamily: that.subTitleConfig.family,
            color: that.subTitleConfig.color
        });
    };

    LogoGen.prototype.initFont = function() {
    	var titleConfig = this.titleConfig,
    		subTitleConfig  = this.subTitleConfig;

    	if (this.currentTtile) {
            this.$textInfo.removeClass('hidden');
            if (this.currentTtile == 'title') {
                $font.val(titleConfig.size);
                $weight.val(titleConfig.weight);
                $family.val(titleConfig.family);
                $textPicker.minicolors("value", titleConfig.color);
            } else if (currentTtile == 'subTitle') {
                $font.val(subTitleConfig.size);
                $weight.val(subTitleConfig.weight);
                $family.val(subTitleConfig.family);
                // $color.val(subTitleConfig.color);
                $textPicker.minicolors("value", subTitleConfig.color);
            }
        } else {
            this.$textInfo.addClass('hidden');
        }
    };

    LogoGen.prototype.renderImg = function(opt) {
        var time = opt.time / 100;
        var that = this;
        console.log(time);
        that.imgInfo.width = that.cacheImgInfo.width * time;
        that.imgInfo.height = that.cacheImgInfo.height * time;
        that.$logoImgBox.css({
            width: that.imgInfo.width + 'px',
            height: that.imgInfo.height + 'px',
        });
    };

    // 图片预加载
    LogoGen.prototype.img = function(url, callback, error) {
        var img = new Image();
        img.src = url;
        if (img.complete) {
            return callback(img);
        }
        img.onload = function() {
            img.onload = null;
            typeof callback === 'function' && callback(img);
        };
        img.onerror = function(e) {
            img.onerror = null;
            typeof error === 'function' && error(e);
        };
    };
})(window)