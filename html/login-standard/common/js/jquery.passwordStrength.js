jQuery.fn.passwordStrength = function(options) {
    return this.each(function() {
        var that = this; that.opts = {};
        that.opts = jQuery.extend({}, jQuery.fn.passwordStrength.defaults, options);

        that.div = jQuery(that.opts.targetDiv);
        that.defaultClass = that.div.attr('class');

        that.percents = (that.opts.classes.length) ? 100 / that.opts.classes.length : 100;
        v = jQuery(this).keyup(function() {
            if (typeof el == "undefined")
                this.el = jQuery(this);
            var s = getPasswordStrength(this.value);
            var p = this.percents;
            var t = Math.floor(s / p);
            if (100 <= s) t = this.opts.classes.length - 1;
            this.div.removeAttr('class').addClass(this.defaultClass).addClass(this.opts.classes[t]);
            var pwdResut = jQuery("#pwdResult");
            if (s < 60) {
                pwdResut.removeAttr("style").attr("style", "color:red;");
                pwdResut.text("差");
            }
            else if (s <= 80) {
                pwdResut.removeAttr("style").attr("style", "color:blue;");
                pwdResut.text("一般");
            }
            else {
                pwdResut.removeAttr("style").attr("style", "color:green;");
                pwdResut.text("强");
            }
        })
    });
    //获取密码强度
    function getPasswordStrength(H) {
        var D = (H.length);
        if (D > 4) {
            D = 4;
        }
        var F = H.replace(/[0-9]/g, "");
        var G = (H.length - F.length);
        if (G > 3) { G = 3; }
        var A = H.replace(/\W/g, "").replace(/[_]/g, "");
        var C = (H.length - A.length);
        if (C > 3) { C = 3; }
        var B = H.replace(/[A-Za-z]/g, "");
        var I = (H.length - B.length);
        if (I > 3) { I = 3; }
        var E = ((D * 10) - 20) + (G * 10) + (C * 15) + (I * 10);
        if (E < 0) { E = 0; }
        if (E > 100) { E = 100; }
        return E;
    }

};

jQuery.fn.passwordStrength.defaults = { classes: Array('is10', 'is20', 'is30', 'is40', 'is50', 'is60', 'is70', 'is80', 'is90', 'is100'), targetDiv: '#passwordStrengthDiv', cache: {} }

jQuery.passwordStrength = {};

jQuery.passwordStrength.getRandomPassword = function(size) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; var size = size || 8; var i = 1; var ret = ""; while (i <= size) { jQuerymax = chars.length - 1; jQuerynum = Math.floor(Math.random() * jQuerymax); jQuerytemp = chars.substr(jQuerynum, 1); ret += jQuerytemp; i++; } return ret;
}

jQuery.passwordStrength.getPasswordStrength = function(H) {
    var D = (H.length);
    if (D > 4) {
        D = 4;
    }
    var F = H.replace(/[0-9]/g, "");
    var G = (H.length - F.length);
    if (G > 3) { G = 3; }
    var A = H.replace(/\W/g, "").replace(/[_]/g, "");
    var C = (H.length - A.length);
    if (C > 3) { C = 3; }
    var B = H.replace(/[A-Za-z]/g, "");
    var I = (H.length - B.length);
    if (I > 3) { I = 3; }
    var E = ((D * 10) - 20) + (G * 10) + (C * 15) + (I * 10);
    if (E < 0) { E = 0; }
    if (E > 100) { E = 100; }
    return E;
}