/* eslint-disable */
import storage from './storage'

var QiuPen = {
    highlighter: null
}

var classes = [
    'hl-red', 'hl-orange', 'hl-yellow', 'hl-green', 'hl-blue', 'hl-purple',
    'line-red', 'line-orange', 'line-yellow', 'line-green', 'line-blue', 'line-purple'
]
var classAppliers = []

function Highlight(chapterPos, highlight) {
    this.chapterPos = chapterPos
    this.highlight = highlight
}

QiuPen.init = function () {
    rangy.init(); // 初始化rangy模块
    classes.forEach(function (item) {
        var classApplier = rangy.createClassApplier(item, {
            ignoreWhiteSpace: true,
            elementTagName: 'span'
        })
        classAppliers.push(classApplier)
    })
}

QiuPen.create = function (document) {
    QiuPen.highlighter = rangy.createHighlighter(document); // 创建一个highlighter
    classAppliers.forEach(function (item) {
        QiuPen.highlighter.addClassApplier(item)
    })
}

QiuPen.save = function (book, bookKey, selectedText) {
    console.log('bookKey', bookKey)
    var store = storage.get('highlight', {})

    store[bookKey] = store[bookKey] || []
    var chapterPos = book.renderer.currentChapter.spinePos
    console.log('保存')
    console.log(chapterPos)
    var serStr = QiuPen.highlighter.serialize()
    console.log(serStr)
    var hlObj = new Highlight(chapterPos, serStr)
    console.log(hlObj)
    store[bookKey].push(hlObj)
    
    storage.set('highlight', store)
}

QiuPen.load = function (book, bookKey) {
    console.log('bookKey', bookKey)
    var store = storage.get('highlight', {})
    var hlObjs = store[bookKey]
    if (!hlObjs) return
    var chapterPos = book.renderer.currentChapter.spinePos
    var result = null
    hlObjs.forEach(function (item) {
        if (item.chapterPos === chapterPos) {
            result = item
        }
    })
    if (!result) return
    QiuPen.highlighter.deserialize(result.highlight)
}

QiuPen.clear = function (bookKey) {
    var store = storage.get('highlight', {})
    var hlObjs = store[bookKey]
    if (!hlObjs) return
    delete store[bookKey]
    storage.set('highlight', store)
}

window.QiuPen = QiuPen
