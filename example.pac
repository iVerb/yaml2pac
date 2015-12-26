var proxy = "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT;";
var direct = 'DIRECT;';
// var default_ = direct;
var default_ = proxy;

var ip_map = {
    '104.24.103.245': 1,
    '192.168.*.*': 0,
};

var keyword_map = {
    '163': 1,
};

var domain_map = {
    'hao123.com': 1,
    'sina.com.cn': 1,
};


function FindProxyForURL(url, host) {
    /*
    url
        the full URL being accessed.
    host
        the hostname extracted from the URL. This is only for convenience, it is the exact same string as between :// and the first : or / after that. The port number is not included in this parameter. It can be extracted from the URL when necessary.

    https://web.archive.org/web/20070602031929/http://wp.netscape.com/eng/mozilla/2.0/relnotes/demo/proxy-live.html
    */

    // Match ip
    // Assume `host` is `www.google.com`
    //                             |
    //     this is where `pos` at -+
    // Then `suffix` would be `com` without dot
    var pos = host.lastIndexOf('.'),
        suffix = host.substring(pos + 1),
        indicator;

    // If `suffix` is a number
    if (!isNaN(suffix)) {
        for (var ip in ip_map) {
            indicator = ip_map[ip];
            if (shExpMatch(host, ip)) {
                return indicator ? proxy : direct;
            }
        }
        // An ip doesn't need to go through keyword or domain matching
        return default_;
    }


    // Match keyword
    for (var keyword in keyword_map) {
        indicator = keyword_map[keyword];
        if (host.indexOf(keyword) > -1) {
            return indicator ? proxy : direct;
        }
    }

    // Match domain
    for (;;) {
        suffix = host.substring(pos + 1);

        // Get the indicator of `suffix`
        indicator = domain_map[suffix];

        // 1 -> proxy; 0 -> direct
        if (indicator !== undefined)
            return indicator ? proxy : direct;

        // `suffix` is already the full `host`, stop iteration and use direct
        if (pos <= 0) {
            return default_;
        }

        // Shift left to get longer suffix, in next loop `suffix` would be `google.com`
        pos = host.lastIndexOf('.', pos - 1);
    }
}
