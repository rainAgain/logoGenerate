(function(win) {
    'use strict';
    var DEFAULT_LEFT = 10,
        DEFAULT_MARGIN = 20;
   
    var LogoGen = function(opt) {
        this.v = "1.0.0";
        this.options = {};
        // 默认图片信息
        this.imgInfo = {
            width: 0,
            height: 0,
            time: 100
        };
        this.cacheImgInfo = {};
        // canvas相关配置
        this.canvasConfig = {
            bg: "rgba(255,255,255,0)",
            width: 650,
            height: 110,
            title: "", // 标题
            subTitle: "" // 副标题
        };
        // 大标题配置
        this.titleConfig = {
            size: "40px",
            weight: "500",
            color: "#333",
            family: "Source Han Sans CN" //"Microsoft YaHei" // 思源黑体
        };
        // 副标题配置
        this.subTitleConfig = {
            size: "18px",
            weight: "500",
            color: "#333",
            family: "Source Han Sans CN" //"Microsoft YaHei" // 思源黑体
        };
        // 当前选中标题
        this.currentTtile = "";
        this.init(opt);
    };
    /**
     * [init 初始化变量与方法]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    LogoGen.prototype.init = function(options) {
        options = options || {};
        if (options.canvasConfig) {
            this.canvasConfig = $.extend({}, this.canvasConfig, options.canvasConfig);
        }

        if(options.titleConfig) {
        	this.titleConfig = $.extend({}, this.titleConfig, options.titleConfig);
        }

        if(options.subTitleConfig) {
        	this.subTitleConfig = $.extend({}, this.subTitleConfig, options.subTitleConfig);
        }

        if(options.imgInfo) {
        	this.imgInfo = $.extend({}, this.imgInfo, options.imgInfo);
        }

        this.options = JSON.parse(JSON.stringify(options));
        this.$logoInfo = $(options.logoModule); // 类别模块
        var $logoInfo = this.$logoInfo;
        this.$logoTitle = $('.logo-title', $logoInfo); // 主标题
        this.$logoSubTitle = $('.logo-sub-title', $logoInfo); // 副标题
        this.$logoImgBox = $('.logo-img', $logoInfo); // 图片容器
        this.$logoPic = $('.logo-pic', $logoInfo); // 图片本身
        this.$font = $('.logo-font-size', $logoInfo); // 字体大小
        this.$weight = $('.logo-font-weight', $logoInfo); // 粗细
        this.$family = $('.logo-font-family', $logoInfo); // 字体
        this.$textPicker = $('.text-picker', $logoInfo); // 颜色
        this.$picInfo = $('.pic-info', $logoInfo); // 图片显示与隐藏
        this.$textInfo = $('.text-info', $logoInfo); // 控制字体设置的显示与隐藏
        this.$titleText = $('.title-text', $logoInfo); // 文本标题
        this.$logoWidth = $('.logo-width', $logoInfo);
        this.$logoHeight = $('.logo-height', $logoInfo);
        this.$picTimes = $('.pic-times', $logoInfo);
        this.$canvas = document.getElementById(options.canvasId);
        this.ctx = this.$canvas.getContext("2d");

        
        this.initEvent();
    };

    /**
     * [initEvent 初始化事件]
     * @return {[type]} [description]
     */
    LogoGen.prototype.initEvent = function() {
        var that = this;
        that.$textPicker.minicolors({
            opacity: true
        });
        // 初始化放大
        that.$picTimes.data('time', that.imgInfo.time).val(that.imgInfo.time + "%").attr('data-time', that.imgInfo.time);
        // 第一次渲染画布
        that.renderCanvas();
        // 第一次渲染标题位置
        that.renderTitle();


        // 按钮组事件监听
        that.$logoInfo.on('input propertychange', ".logo-width", function() {
            that.canvasConfig.width = $(this).val();
            that.renderCanvas();
        }).on('input propertychange', '.logo-height', function() {
            that.canvasConfig.height = $(this).val();
            that.renderCanvas();
        }).on('click', '.result', function() {
            // renderResultLogo();
            that.convertCanvasToImage()
        }).on('input propertychange', '.logo-font-family', function() {
            // 标题字体
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.family = _val;
            } else {
                that.subTitleConfig.family = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.logo-font-weight', function() {
            // 标题字体粗细
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.weight = _val;
            } else {
                that.subTitleConfig.weight = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.logo-font-size', function() {
            // 标题字体大小
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.size = _val;
            } else {
                that.subTitleConfig.size = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.text-picker', function() {
            // titleConfig.color = $textPicker.minicolors("rgbaString", $(this).val());
            var _val = that.$textPicker.minicolors("value");
            if (that.currentTtile == 'title') {
                that.titleConfig.color = _val;
            } else {
                that.subTitleConfig.color = _val;
            }
            that.renderTitle();
        }).on('click', '.icon-plus', function() {
            var _time = parseInt(that.$picTimes.data('time'));
            _time = _time + 10;
            that.$picTimes.data('time', _time).val(_time + "%").attr('data-time', _time);
            
            that.imgInfo.time = _time;

            // console.log("plus")
            // console.log(_time)
            that.renderImg({
                time: _time
            });
        }).on('click', '.icon-reduce', function() {
            var _time = parseInt(that.$picTimes.data('time'));
            if (_time > 10) {
                _time = _time - 10;
            } else {
                _time = 10;
            }
            // console.log("reduce")
            // console.log(_time)
            that.$picTimes.data('time', _time).val(_time + "%").attr('data-time', _time);
            
            that.imgInfo.time = _time;

            that.renderImg({
                time: _time
            });
        }).on('click', '.logo-title', function() {
            that.currentTtile = "title";
            that.initFont();
            that.$titleText.text('标题：');
        }).on('click', '.logo-sub-title', function() {
            that.currentTtile = "subTitle";
            that.initFont();
            that.$titleText.text('副标题：');
        }).on('click', '.logo-pic', function() {
        	if(that.$picInfo.hasClass('hidden')) {
        		that.$picInfo.removeClass('hidden');
        	}
        });

        var $colorPicker = $('#color-picker');

        $('body').on('input propertychange', '#color-picker', function() {
            that.canvasConfig.bg = $colorPicker.minicolors("rgbaString", $(this).val());
            that.renderCanvas();
        }).on('input propertychange', '#logo-name', function() {
            that.canvasConfig.title = $(this).val();
            // that.$logoTitle.text(that.canvasConfig.title);
            that.renderTitle();
            
        }).on('input propertychange', '#add-sub-title', function() {
        	var val = $(this).val();

            that.canvasConfig.subTitle = val;
            // that.$logoSubTitle.text(that.canvasConfig.subTitle);
            that.renderTitle();
            
        });

        $('body').on('click', function (e) {
            var $target = $(e.target);
            if (!$target.closest('.logo-img,.pic-info').length) {
                that.$picInfo.addClass('hidden');
            }
            if(!$target.closest('.logo-title,.logo-sub-title,.text-info').length) {
            	that.$textInfo.addClass('hidden');
            }
        });


        // that.$logoImgBox.resizable({
        //     containment: that.options.canvasBox
        // });
        that.$logoImgBox.draggable({
            containment: that.options.canvasBox
        });
        that.$logoTitle.draggable({
            containment: that.options.canvasBox
        });
        that.$logoSubTitle.draggable({
            containment: that.options.canvasBox
        });
    }

    /**
     * [renderCanvas 渲染canvas画布]
     * @return {[type]} [description]
     */
    LogoGen.prototype.renderCanvas = function() {
        var canvasConfig = this.canvasConfig;
        // console.log(canvasConfig);
        var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;
        // console.log(canvasConfig);
        this.$canvas.width = _width;
        // this.$canvas.style.height = _height + 'px';
        this.$canvas.height = _height;
        this.ctx.fillStyle = _bg;
        // console.log(this.ctx);
        this.ctx.fillRect(0, 0, _width, _height);
    }

    /**
     * [getTitleSite 获取标题位置]
     * @param  {[type]} reset [是否重置左侧位置]
     * @return {[type]} center [是否获取居中的top值]
     * @return {[type]} result [是否是最后保存的时候]
     */
    LogoGen.prototype.getTitleSite = function(reset, center, result) {
        var logoTitle = this.$logoTitle[0],
        	top = logoTitle.offsetTop || 0;
        // console.log(center)
        if(!result) {
            if(!center) {
                if(logoTitle.offsetTop >= this.canvasConfig.height/2 - logoTitle.clientHeight) {
                    top = this.canvasConfig.height/2 - logoTitle.clientHeight - 5;
                }
            } else {
                // console.log(this.canvasConfig.height/2);
                // console.log(logoTitle.clientHeight/2);

                top = this.canvasConfig.height/2 - logoTitle.clientHeight/2
            } 
        }
        
        
        // console.log(top)
        // console.log(top);

        return {
            top: top,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + this.imgInfo.width) : logoTitle.offsetLeft
        };
    }

    /**
     * [getSubTitleSite 获取副标题位置]
     * @param  {[type]} reset [是否重置左侧位置]
     * @return {[type]} first [是否是第一次]
     * @return {[type]} result [是否是最后保存的时候]
     */
    LogoGen.prototype.getSubTitleSite = function(reset, first, result) {
        var logoSubTitle = this.$logoSubTitle[0],
        	top = logoSubTitle.offsetTop || 0;
        if(!result) {
            if(logoSubTitle.offsetTop >= (this.canvasConfig.height - logoSubTitle.clientHeight)) {
                top = this.canvasConfig.height - logoSubTitle.clientHeight - 5
            } 
        }

        return {
            top: top,
            left: reset ? (DEFAULT_LEFT + DEFAULT_MARGIN + this.imgInfo.width) : logoSubTitle.offsetLeft
        };
    };

    /**
     * [renderTitle 渲染标题们]
     * @param  {[type]} reset [是否重置，用于上传图片后，重置左边的位置]
     * @return {[type]} first [是否是第一次加载，即，文本是否居中]
     */
    LogoGen.prototype.renderTitle = function(reset) {
        var that = this;
        
        that.$logoTitle.text(that.canvasConfig.title);
		that.$logoSubTitle.text(that.canvasConfig.subTitle);

		var center = true;
		
		if(that.canvasConfig.subTitle) {
			center = false;
		} else {
			center = true;
		}

        var titleSite = that.getTitleSite(reset, center),
        	subTitleSite = that.getSubTitleSite(reset);

        this.$logoTitle.css({
        	top: titleSite.top + 'px',
            left: titleSite.left + 'px',
            fontSize: that.titleConfig.size,
            fontWeight: that.titleConfig.weight,
            fontFamily: that.titleConfig.family,
            color: that.titleConfig.color
        });

        this.$logoSubTitle.css({
        	top: subTitleSite.top + 'px',
            left: subTitleSite.left + 'px',
            fontSize: that.subTitleConfig.size,
            fontWeight: that.subTitleConfig.weight,
            fontFamily: that.subTitleConfig.family,
            color: that.subTitleConfig.color
        });
    };

    /**
     * [initFont 初始化字体格式]
     * @return {[type]} [description]
     */
    LogoGen.prototype.initFont = function() {
        var titleConfig = this.titleConfig,
            subTitleConfig = this.subTitleConfig;
        if (this.currentTtile) {
            this.$textInfo.removeClass('hidden');
            if (this.currentTtile == 'title') {
                this.$font.val(titleConfig.size);
                this.$weight.val(titleConfig.weight);
                this.$family.val(titleConfig.family);
                this.$textPicker.minicolors("value", titleConfig.color);
            } else if (this.currentTtile == 'subTitle') {
                this.$font.val(subTitleConfig.size);
                this.$weight.val(subTitleConfig.weight);
                this.$family.val(subTitleConfig.family);
                // $color.val(subTitleConfig.color);
                this.$textPicker.minicolors("value", subTitleConfig.color);
            }
        } else {
            this.$textInfo.addClass('hidden');
        }
    };

    /**
     * [renderImg 渲染图片div]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    LogoGen.prototype.renderImg = function(opt) {
    	opt = opt || {
    		time: 100
    	};

        var time = opt.time / 100;
        var that = this;
        // console.log(time);
        that.imgInfo.width = that.cacheImgInfo.width * time;
        that.imgInfo.height = that.cacheImgInfo.height * time;
        that.$logoImgBox.css({
            width: that.imgInfo.width + 'px',
            height: that.imgInfo.height + 'px',
        });
    };

    /**
     * [setImg 设置图片]
     * @param {[type]} opt [description]
     * opt = {
     * 	height: "",
     * 	width: "",
     * 	imgUrl: ""
     * }
     */
    LogoGen.prototype.setImg = function(opt) {
        var that = this;
        var box_height = that.$logoHeight.val(), // 容器高度
            top = 0, // 图片容器距离顶部的距离
            time = 100; // 图片放大倍数

        // 图片高度大于容器高度，则图片高度等于容器高度
        if (opt.height > box_height) {
            var r = opt.width / opt.height;
            opt.height = box_height;
            opt.width = opt.height * r;
        } else {
            top = (box_height - opt.height) / 2
        }

        if(that.imgInfo.time) {
        	time = that.imgInfo.time;
        }
        time = time / 100;

        // console.log(top);

        that.cacheImgInfo = JSON.parse(JSON.stringify(opt));

        that.imgInfo.width = opt.width * time;
        that.imgInfo.height = opt.height * time;

        // if (that.imgInfo.height <= box_height) {
        //     top = (box_height - that.imgInfo.height) / 2
        // }
        // 
        top = (box_height - that.imgInfo.height) / 2

        
        
        // console.log(that.cacheImgInfo);

        that.$logoPic.attr('src', opt.imgUrl);

        that.$logoImgBox.css({
            width: that.imgInfo.width + 'px',
            height: that.imgInfo.height + 'px',
            top: top + 'px',
            left: DEFAULT_LEFT + 'px'
        });
        that.renderTitle(true);
    }


    // 图片预加载
    /*LogoGen.prototype.img = function(url, callback, error) {
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
    };*/

    /**
     * [createResultCanvas 创建生成的canvas]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    LogoGen.prototype.createResultCanvas = function(opt) {
        opt = opt || {};
        var that = this,
            canvasConfig = that.canvasConfig,
            titleConfig = that.titleConfig,
            subTitleConfig = that.subTitleConfig;
        var id = opt.id || Date.parse(new Date());
        var canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width = canvasConfig.width;
        canvas.height = canvasConfig.height;

        
        

        document.body.appendChild(canvas);
        var $canvas = document.getElementById(id),
            ctx = $canvas.getContext("2d");
        // console.log(canvasConfig);
        var renderResultLogo = function(opt) {
            var _bg = canvasConfig.bg,
                _width = canvasConfig.width,
                _height = canvasConfig.height;
            // $canvas.style.width = _width + 'px';
            // $canvas.style.height = _height + 'px';
            // ctx.lineWidth = 10;
            // console.log(_bg);

            var devicePixelRatio = window.devicePixelRatio || 1,
		        backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1,
		        ratio = devicePixelRatio / backingStoreRatio;
		    // console.log(ratio);
            ctx.scale(ratio, ratio);


            // ctx.fillStyle = _bg;
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillRect(0, 0, _width, _height);
            // 绘图
            var img = that.$logoPic[0]; //document.getElementById('logo-pic'); // 图片本身
            var imgBox = that.$logoImgBox[0], //document.getElementById('logo-img'), // 图片容器确定位置
                imgSite = {
                    top: imgBox.offsetTop,
                    left: imgBox.offsetLeft
                };
            // console.log(imgInfo);
            ctx.drawImage(img, imgSite.left, imgSite.top, that.imgInfo.width*ratio, that.imgInfo.height*ratio);

            
            // 字体
            // 大标题
            var titleSite = that.getTitleSite(false,false,true);
            ctx.font = titleConfig.weight + ' ' + titleConfig.size + ' ' + titleConfig.family;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = titleConfig.color;
            ctx.fillText(canvasConfig.title, titleSite.left, titleSite.top ); // + 8
            // 小标题
            var subTitleSite = that.getSubTitleSite(false,false,true);

            ctx.font = subTitleConfig.weight + ' ' + subTitleConfig.size + ' ' + subTitleConfig.family;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = subTitleConfig.color;
            ctx.fillText(canvasConfig.subTitle, subTitleSite.left, subTitleSite.top); //  + 5
        }
        renderResultLogo();
    };

    /**
     * [convertCanvasToImage 转为图片并下载]
     * @return {[type]} [description]
     */
    LogoGen.prototype.convertCanvasToImage = function() {
        var cacheId = 'create-' + Date.parse(new Date())
        this.createResultCanvas({
            id: cacheId
        });
        var canvas = document.getElementById(cacheId);
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        // window.location.href=image;
        // return image;
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png'); //下载图片
        a.download = this.canvasConfig.title + ".png";
        a.click();
        $('#' + cacheId).remove();
    };


    win.LogoGen = LogoGen;
})(window)