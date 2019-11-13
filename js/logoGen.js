(function (win) {
    'use strict';
    var DEFAULT_LEFT = 10,
        DEFAULT_MARGIN = 20;

    var PIXEL_RATIO = (function () {
        var c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            dpr = window.devicePixelRatio || 2,
            bsr = ctx['webkitBackingStorePixelRatio'] ||
            ctx['mozBackingStorePixelRatio'] ||
            ctx['msBackingStorePixelRatio'] ||
            ctx['oBackingStorePixelRatio'] ||
            ctx['backingStorePixelRatio'] || 1;

        return dpr / bsr;
    })();

    var LogoGen = function (opt) {
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
    LogoGen.prototype.init = function (options) {
        options = options || {};
        if (options.canvasConfig) {
            this.canvasConfig = $.extend({}, this.canvasConfig, options.canvasConfig);
        }

        if (options.titleConfig) {
            this.titleConfig = $.extend({}, this.titleConfig, options.titleConfig);
        }

        if (options.subTitleConfig) {
            this.subTitleConfig = $.extend({}, this.subTitleConfig, options.subTitleConfig);
        }

        if (options.imgInfo) {
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
    LogoGen.prototype.initEvent = function () {
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
        that.$logoInfo.on('input propertychange', ".logo-width", function () {
            that.canvasConfig.width = $(this).val();
            that.renderCanvas();
        }).on('input propertychange', '.logo-height', function () {
            that.canvasConfig.height = $(this).val();
            that.renderCanvas();
        }).on('click', '.result', function () {
            // renderResultLogo();
            that.convertCanvasToImage()
        }).on('input propertychange', '.logo-font-family', function () {
            // 标题字体
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.family = _val;
            } else {
                that.subTitleConfig.family = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.logo-font-weight', function () {
            // 标题字体粗细
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.weight = _val;
            } else {
                that.subTitleConfig.weight = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.logo-font-size', function () {
            // 标题字体大小
            var _val = $(this).val();
            if (that.currentTtile == 'title') {
                that.titleConfig.size = _val;
            } else {
                that.subTitleConfig.size = _val;
            }
            that.renderTitle();
        }).on('input propertychange', '.text-picker', function () {
            // titleConfig.color = $textPicker.minicolors("rgbaString", $(this).val());
            var _val = that.$textPicker.minicolors("value");
            if (that.currentTtile == 'title') {
                that.titleConfig.color = _val;
            } else {
                that.subTitleConfig.color = _val;
            }
            that.renderTitle();
        }).on('click', '.icon-plus', function () {
            var _time = parseInt(that.$picTimes.data('time'));
            _time = _time + 10;
            that.$picTimes.data('time', _time).val(_time + "%").attr('data-time', _time);

            that.imgInfo.time = _time;

            that.renderImg({
                time: _time
            });
        }).on('click', '.icon-reduce', function () {
            var _time = parseInt(that.$picTimes.data('time'));
            if (_time > 10) {
                _time = _time - 10;
            } else {
                _time = 10;
            }
            that.$picTimes.data('time', _time).val(_time + "%").attr('data-time', _time);

            that.imgInfo.time = _time;

            that.renderImg({
                time: _time
            });
        }).on('mousedown', '.logo-title', function () {
            that.currentTtile = "title";
            that.initFont();
            that.$titleText.text('标题：');

        }).on('mousedown', '.logo-sub-title', function () {
            that.currentTtile = "subTitle";
            that.initFont();
            that.$titleText.text('副标题：');

        }).on('mousedown', '.logo-pic', function () {
            if (that.$picInfo.hasClass('hidden')) {
                that.$picInfo.removeClass('hidden');
            }
        });

        var $colorPicker = $('#color-picker');

        $('body').on('input propertychange', '#color-picker', function () {
            that.canvasConfig.bg = $colorPicker.minicolors("rgbaString", $(this).val());
            that.renderCanvas();
        }).on('input propertychange', '#logo-name', function () {
            that.canvasConfig.title = $(this).val();
            // that.$logoTitle.text(that.canvasConfig.title);
            that.renderTitle();

        }).on('input propertychange', '#add-sub-title', function () {
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
            if (!$target.closest('.logo-title,.logo-sub-title,.text-info').length) {
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
    LogoGen.prototype.renderCanvas = function () {
        var canvasConfig = this.canvasConfig;
        var _bg = canvasConfig.bg,
            _width = canvasConfig.width,
            _height = canvasConfig.height;
        this.$canvas.width = _width;
        // this.$canvas.style.height = _height + 'px';
        this.$canvas.height = _height;
        this.ctx.fillStyle = _bg;
        this.ctx.fillRect(0, 0, _width, _height);
    }

    /**
     * [getTitleSite 获取标题位置]
     * @param  {[type]} reset [是否重置左侧位置]
     * @return {[type]} center [是否获取居中的top值]
     * @return {[type]} result [是否是最后保存的时候]
     */
    LogoGen.prototype.getTitleSite = function (reset, center, result) {
        var logoTitle = this.$logoTitle[0],
            top = logoTitle.offsetTop || 0;
        if (!result) {
            if (!center) {
                if (logoTitle.offsetTop >= this.canvasConfig.height / 2 - logoTitle.clientHeight) {
                    top = this.canvasConfig.height / 2 - logoTitle.clientHeight - 5;
                }
            } else {

                top = this.canvasConfig.height / 2 - logoTitle.clientHeight / 2
            }
        }

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
    LogoGen.prototype.getSubTitleSite = function (reset, first, result) {
        var logoSubTitle = this.$logoSubTitle[0],
            top = logoSubTitle.offsetTop || 0;
        if (!result) {
            if (logoSubTitle.offsetTop >= (this.canvasConfig.height - logoSubTitle.clientHeight)) {
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
    LogoGen.prototype.renderTitle = function (reset) {
        var that = this;

        that.$logoTitle.text(that.canvasConfig.title);
        that.$logoSubTitle.text(that.canvasConfig.subTitle);

        var center = true;

        if (that.canvasConfig.subTitle) {
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
            height: that.titleConfig.size,
            lineHeight: browserIsIe() ? 'normal' : 1,
            fontWeight: that.titleConfig.weight,
            fontFamily: that.titleConfig.family,
            color: that.titleConfig.color
        });

        this.$logoSubTitle.css({
            top: subTitleSite.top + 'px',
            left: subTitleSite.left + 'px',
            fontSize: that.subTitleConfig.size,
            height: that.subTitleConfig.size,
            lineHeight: browserIsIe() ? 'normal' : 1,
            fontWeight: that.subTitleConfig.weight,
            fontFamily: that.subTitleConfig.family,
            color: that.subTitleConfig.color
        });
    };

    /**
     * [initFont 初始化字体格式]
     * @return {[type]} [description]
     */
    LogoGen.prototype.initFont = function () {
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
    LogoGen.prototype.renderImg = function (opt) {
        opt = opt || {
            time: 100
        };

        var time = opt.time / 100;
        var that = this;
        that.imgInfo.width = that.cacheImgInfo.width * time;
        that.imgInfo.height = that.cacheImgInfo.height * time;
        that.$logoImgBox.css({
            width: that.imgInfo.width + 'px',
            height: that.imgInfo.height + 'px',
        });
    };

    LogoGen.prototype.setSize = function (opt) {
        var that = this;
        that.canvasConfig.width = opt.width;
        that.canvasConfig.height = opt.height;

        that.$logoWidth.val(opt.width);
        that.$logoHeight.val(opt.height);

        that.renderCanvas();
        // that.renderImg();
        that.renderTitle();
    }

    /**
     * [setImg 设置图片]
     * @param {[type]} opt [description]
     * opt = {
     * 	height: "",
     * 	width: "",
     * 	imgUrl: ""
     * }
     */
    LogoGen.prototype.setImg = function (opt) {
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

        if (that.imgInfo.time) {
            time = that.imgInfo.time;
        }
        time = time / 100;


        that.cacheImgInfo = JSON.parse(JSON.stringify(opt));

        that.imgInfo.width = opt.width * time;
        that.imgInfo.height = opt.height * time;

        // if (that.imgInfo.height <= box_height) {
        //     top = (box_height - that.imgInfo.height) / 2
        // }
        // 
        top = (box_height - that.imgInfo.height) / 2

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
    LogoGen.prototype.createResultCanvas = function (opt) {
        opt = opt || {};
        var that = this,
            canvasConfig = that.canvasConfig,
            titleConfig = that.titleConfig,
            subTitleConfig = that.subTitleConfig;
        var id = opt.id || Date.parse(new Date());
        var canvas = document.createElement('canvas'),
            ratio = PIXEL_RATIO,
            _width = canvasConfig.width,
            _height = canvasConfig.height;

        canvas.id = id;
        canvas.width = _width * ratio;
        canvas.height = _height * ratio;
        canvas.style.width = _width + 'px';
        canvas.style.height = _height + 'px';

        var ctx = canvas.getContext("2d");

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        // ctx.scale(ratio, ratio);
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, _width, _height);

        document.body.appendChild(canvas);

        var renderResultLogo = function (opt) {
            // 绘图
            var img = that.$logoPic[0]; //document.getElementById('logo-pic'); // 图片本身
            var imgBox = that.$logoImgBox[0], //document.getElementById('logo-img'), // 图片容器确定位置
                imgSite = {
                    top: imgBox.offsetTop,
                    left: imgBox.offsetLeft
                };
            ctx.drawImage(img, imgSite.left, imgSite.top, that.imgInfo.width, that.imgInfo.height);

            // 字体
            // 大标题
            var titleSite = that.getTitleSite(false, false, true);
            ctx.font = titleConfig.weight + ' ' + titleConfig.size + ' ' + titleConfig.family;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = titleConfig.color;
            ctx.fillText(canvasConfig.title, titleSite.left, titleSite.top); // + 8
            // 小标题
            var subTitleSite = that.getSubTitleSite(false, false, true);

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
    LogoGen.prototype.convertCanvasToImage = function () {
        var cacheId = 'create-' + Date.parse(new Date());
        var that = this;
        this.createResultCanvas({
            id: cacheId
        });
        var canvas = document.getElementById(cacheId);
        canvas.style.display = 'none';

        function dataURLToBlob(dataurl) {
            var arr = dataurl.split(',');
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        }

        var imgBase64 = canvas.toDataURL('image/png', 1); 

        // imgBase64 的宽高为设置宽高的 PIXEL_RATIO 倍，所以下面需要再转一次进行恢复
        // 不过只能是优化，本质上还是模糊
        function imageToCanvas(src, cb) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.src = src;
            
            img.onload = function () {
                var img_w = img.width / PIXEL_RATIO,
                    img_h = img.height / PIXEL_RATIO;

                canvas.width = img_w;
                canvas.height = img_h;
                
                ctx.drawImage(img, 0, 0, img_w, img_h);
                cb(canvas);
            };
        }

        imageToCanvas(imgBase64, function (canvas) {
            var blob = dataURLToBlob(canvas.toDataURL('image/png', 1));

            var url = window.URL.createObjectURL(blob);
            var filename = that.canvasConfig.title + ".png";

            // IE 11
            if (window.navigator.msSaveBlob !== undefined) {
                window.navigator.msSaveBlob(blob, filename);
                return;
            }

            var a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);

            requestAnimationFrame(function () {
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });

            $('#' + cacheId).remove();
        })

        // var img = new Image();
        /*  img.onload = function () {
            var oWidth = img.width;
            var oHeight = img.height;
            var Size = calcWH(oWidth, oHeight); //调整为合适的尺寸
            //开始进行转换到canvas再压缩操作
            var canvas = document.createElement("canvas");
            canvas.width = Size.width;  //设置画布的宽度
            canvas.height = Size.height;//设置画布的高度
            var ctx = canvas.getContext("2d");
            //ctx.drawImage(图像对象,画点起始Y,画点起始Y,画出宽度,画出高度)//画出宽度和高度决定了你复刻了多少像素，和是画布宽高度是两回事
            ctx.drawImage(img,0,0,Size.width,Size.height);
            //此时我们可以使用canvas.toBlob(function(blob){ //参数blob就已经是二进制文件了 });来把canvas转回二进制文件，但是我们使用提交表单的时候才即使转换的方式。
            var smBase64 = canvas.toDataURL('image/jpeg', 1); 
 */

        // var blob = dataURLToBlob(resultBase64);

        // if (!browserIsIe()) {
        //     var a = document.createElement('a');
        //     var event = new MouseEvent("click"); // 创建一个单击事件
        //     a.href = imgData; //下载图片
        //     a.download = this.canvasConfig.title + ".png";
        //     a.dispatchEvent(event); // 触发a的单击事件
        // } else {
        //     var image = new Image();
        //     image.title = this.canvasConfig.title + ".png";
        //     image.src = imgData;
        //     $('#logo-result').html(image);
        //     $('#dialog-result').removeClass('hidden');
        //     $('#dialog-bg').removeClass('hidden');
        // }


    };


    win.browserIsIe = function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }

    win.LogoGen = LogoGen;
})(window);


// (function (window) {
//     try {
//         new MouseEvent('test');
//         return false; // No need to polyfill
//     } catch (e) {
//         // Need to polyfill - fall through
//     }

//     // Polyfills DOM4 MouseEvent

//     var MouseEvent = function (eventType, params) {
//         params = params || {
//             bubbles: false,
//             cancelable: false
//         };
//         var mouseEvent = document.createEvent('MouseEvent');
//         mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

//         return mouseEvent;
//     }

//     MouseEvent.prototype = Event.prototype;

//     window.MouseEvent = MouseEvent;
// })(window);