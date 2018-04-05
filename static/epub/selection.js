// 监听选中文本
document.addEventListener('mouseup', function (e) {
    var sel = window.getSelection();
    if (!sel.isCollapsed && true) selected(e); // TODO
    else window.parent.document.getElementById('select-menu').style.visibility = 'hidden';
});

// 选中文本后的事件处理程序
function selected(e) {
    var x = e.clientX,
        y = e.clientY,
        menu = window.parent.document.getElementById('select-menu'),
        menuHeight = window.parent.document.defaultView.getComputedStyle(menu, null).height,
        menuWidth = window.parent.document.defaultView.getComputedStyle(menu, null).width,
        screenHeight = window.parent.screen.availHeight,
        screenWidth = window.parent.screen.availWidth;

    menuHeight = parseInt(menuHeight);
    menuWidth = parseInt(menuWidth);

    if ((screenWidth - x) < menuWidth) {
        menu.style.left = x - menuWidth + 'px';
    } else {
        menu.style.left = x + 'px'
    }
    if ((screenHeight - y) < menuHeight) {
        menu.style.top = y - menuHeight + 'px';
    } else {
        menu.style.top = y + 'px'
    }

    menu.style.visibility = 'visible';
}

// 解决复制粘贴问题的 hack
document.addEventListener('keydown', function (e) {
    var key = e.keyCode || e.which;
    if (key === 67 && e.ctrlKey)
    {
        document.execCommand('copy', false, null);
    }
});