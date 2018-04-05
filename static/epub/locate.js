var tocURLs = [];

function getURLs(manifest) {
    var key;
    for (key in manifest) {
        if (!manifest.hasOwnProperty(key)) continue;
        if (typeof manifest[key] === 'function') continue;
        if (manifest[key] && manifest[key].href) tocURLs.push(manifest[key].href);
    }
}

// 修正页面竖直滚动模式下的页面内链接跳转问题
function locate(e) {
    var book = window.parent.book,
        self = this,
        href,
        lastSeparator,
        anchor,
        item,
        i;

    href = self.href;
    lastSeparator = href.lastIndexOf('/');
    href = href.substring(lastSeparator + 1, href.length);

    if (!href)
        return;

    if (href.indexOf('#') !== -1) {
        anchor = href.split('#')[1];
        href = href.split('#')[0];
    }

    for (i = 0; i < tocURLs.length; i++) {
        item = tocURLs[i];
        if (href === 'reader.html') { // TODO 临时解决base标签失效的问题
            anchor ? window.parent.pageYScrollTo(anchor) : '';
            return false;
        }
        if (item.indexOf(href) !== -1) {
            book.goto(item).then(function () {
                if (anchor)
                    window.parent.pageYScrollTo(anchor);
            });
            return false;
        }
    }
}

function bindEvent() {
    var a = document.getElementsByTagName('a');

    getURLs(window.parent.book.manifest);

    a = Array.prototype.slice.call(a, 0);
    a.forEach(function (e) {
        e.onclick = locate;
    });
}

bindEvent();