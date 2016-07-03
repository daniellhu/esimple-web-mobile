function getCookie_XXXXXXXX(name)
    {
        var search = name + "="
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search)
            if (offset != -1) {
                offset += search.length
                end = document.cookie.indexOf(";", offset)
                if (end == -1) end = document.cookie.length
                return unescape(document.cookie.substring(offset, end))
            }
            else return ""
        }
    }

var contextPath = getCookie_XXXXXXXX("lmspd.servlet.contextPath");
if (contextPath == "\"\"") {
    contextPath = "";
}

var homePluginPath = contextPath + "/" + "home";

var mobilePluginPath = contextPath + "/" + "mobile";