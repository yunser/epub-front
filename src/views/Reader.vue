<template>
    <my-page class="page-reader" :title="title" :page="page" :style="pageStyle">
        <div id="wrapper">
            <div id="area"></div>
            <div class="page-divider"></div>
        </div>
        <div id="prev" class="arrow" @click="prev" v-if="book">‹</div>
        <div id="next" class="arrow" @click="next" v-if="book">›</div>
        <ui-circular-progress class="loading" :size="40" v-if="loading"/>
        <ui-drawer class="toc-drawer" right :open="open" :docked="false" @close="toggle()">
            <ui-appbar title="目录">
                <ui-icon-button icon="close" @click="toggle" slot="left" />
            </ui-appbar>
            <div class="drawer-body">
                <ui-list>
                    <ui-list-item :title="item.label"
                                  :key="item.label"
                                  @click="gotoDirectory(item)"
                                  v-for="item in toc"/>
                </ui-list>
            </div>
        </ui-drawer>
        <ui-drawer class="info-drawer" right :open="infoVisible" :docked="false" @close="toggleInfo()">
            <ui-appbar title="书籍信息">
                <ui-icon-button icon="close" @click="toggleInfo" slot="left" />
            </ui-appbar>
            <div class="info-body">
                <ui-article>
                    <table v-if="meta">
                        <tr class="item">
                            <td class="key">书名</td>
                            <td class="value">{{ meta.bookTitle }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">封面</td>
                            <td class="value">
                                <img class="cover" :src="cover">
                                <!-- {{ meta.cover }} -->
                            </td>
                        </tr>
                        <tr class="item">
                            <td class="key">作者</td>
                            <td class="value">{{ meta.creator }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">简介</td>
                            <td class="value">{{ meta.description }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">方向</td>
                            <td class="value">{{ meta.direction }}</td>
                        </tr>
                        <!--<tr class="item">-->
                        <!--<td class="key">identifier</td>-->
                        <!--<td class="value">{{ meta.identifier }}</td>-->
                        <!--</tr>-->
                        <tr class="item">
                            <td class="key">语言</td>
                            <td class="value">{{ meta.language | lang }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">布局</td>
                            <td class="value">{{ meta.layout }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">修改时间</td>
                            <td class="value">{{ meta.modified_date | time }}</td>
                        </tr>
                        <!--<tr class="item">-->
                        <!--<td class="key">orientation</td>-->
                        <!--<td class="value">{{ meta.orientation }}</td>-->
                        <!--</tr>-->
                        <tr class="item">
                            <td class="key">出版日期</td>
                            <td class="value">{{ meta.pubdate | time }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">出版社</td>
                            <td class="value">{{ meta.pubtrsher }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">版权</td>
                            <td class="value">{{ meta.rights }}</td>
                        </tr>
                    </table>
                </ui-article>
            </div>
        </ui-drawer>
        <ui-drawer class="setting-drawer" right :open="settingVisible" :docked="false" @close="toggleSetting()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" @click="toggleSetting" slot="left" />
            </ui-appbar>
            <div class="setting-body">
                <ui-select-field v-model="options.fontFamily" label="字体">
                    <ui-menu-item value="Microsoft Yahei, Heiti SC, Heiti TC" title="黑体"/>
                    <ui-menu-item value="SimSun, Songti SC, Songti TC" title="宋体"/>
                    <ui-menu-item value="KaiTi, Kaiti SC, Kaiti TC" title="楷体"/>
                    <ui-menu-item value="YouYuan, Yuanti SC, Yuanti TC" title="圆体"/>
                    <ui-menu-item value="PingFang SC, PingFang TC" title="方体（Mac only）"/>
                </ui-select-field>
                <ui-text-field type="number" v-model="options.fontSize" label="文字大小" />
                <!-- <ui-text-field type="number" v-model.number="options.theme" label="主题（0-3）" /> -->
                <h3 class="form-label">主题</h3>
                <ul class="theme-list">
                    <li class="item" 
                        :title="theme.name"
                        v-for="theme, index in themes"
                        @click="selectTheme(index)"
                        :style="themeStyle(theme)"></li>
                </ul>
                <!-- <ui-select-field v-model="options.bold" label="粗细">
                    <ui-menu-item value="normal" title="默认"/>
                    <ui-menu-item value="bold" title="加粗"/>
                </ui-select-field>
                <ui-select-field v-model="options.bold" label="字间距">
                    <ui-menu-item value="normal" title="0.8"/>
                    <ui-menu-item value="normal" title="0.9"/>
                    <ui-menu-item value="bold" title="1.0"/>
                    <ui-menu-item value="bold" title="1.2"/>
                    <ui-menu-item value="bold" title="1.4"/>
                </ui-select-field>
                <ui-select-field v-model="options.bold" label="行间距">
                    <ui-menu-item value="normal" title="0.8"/>
                    <ui-menu-item value="normal" title="0.9"/>
                    <ui-menu-item value="bold" title="1.0"/>
                    <ui-menu-item value="bold" title="1.2"/>
                    <ui-menu-item value="bold" title="1.4"/>
                </ui-select-field>
                <ui-select-field v-model="options.bold" label="阅读区域大小">
                    <ui-menu-item value="normal" title="700"/>
                    <ui-menu-item value="normal" title="800"/>
                    <ui-menu-item value="bold" title="950"/>
                    <ui-menu-item value="bold" title="1000"/>
                    <ui-menu-item value="bold" title="1100"/>
                    <ui-menu-item value="bold" title="1200"/>
                    <ui-menu-item value="bold" title="1400"/>
                </ui-select-field> -->
                <div>
                    <ui-raised-button class="btn-clear" label="清除浏览器缓存" @click="clearStorage" />
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="bookmark-drawer" right :open="bookmarkVisible" :docked="false" @close="toggleBookmark()">
            <ui-appbar title="书签">
                <ui-icon-button icon="close" @click="toggleBookmark" title="关闭" slot="left" />
                <ui-icon-button icon="add" @click="addBookmark" title="添加书签" slot="right" />
            </ui-appbar>
            <ui-list>
                <ui-list-item :title="bookmark.name"
                              :key="bookmark.id"
                              @click="gotoBookmark(bookmark)"
                              v-for="bookmark in bookmarks">
                    <ui-icon-button icon="close" title="删除" @click.stop="removeBookmark(bookmark)" slot="right" />
                </ui-list-item>
            </ui-list>
            <div class="bookmark-body">
                <div v-if="!bookmarks.length">暂无书签，点击 “+” 添加书签</div>
            </div>
        </ui-drawer>
        <ui-drawer class="note-drawer" :open="noteVisible" :docked="false" @close="toggleNote()">
            <ui-appbar title="标注与笔记">
                <ui-icon-button icon="close" @click="toggleNote" title="关闭" slot="left" />
                <ui-icon-button icon="import_export" @click="exportNote" title="导出笔记" slot="right" v-if="notes.length" />
            </ui-appbar>
            <div class="total" v-if="notes.length">总数：{{ notes.length }}</div>
            <ul class="note-list" v-if="notes.length">
                <li class="item"
                    :title="note.name"
                    :key="note.id"
                    @click="editNote(note)"
                    v-for="note in notes">
                    <div class="time">{{ note.createTime | simpleTime }}</div>
                    <div class="mark" :style="{'border-color': note.color}">{{ note.selectedText }}</div>
                    <div class="note">{{ note.note || '暂无笔记' }}</div>
                    <ui-icon-button class="close" icon="close" title="删除" @click.stop="removeNote(note)" />
                    <ui-icon-button class="goto" icon="arrow_forward" title="跳转" @click.stop="gotoNote(note)" />
                </li>
            </ul>
            <div class="note-body">
                <div v-if="!notes.length">暂无标注和笔记</div>
            </div>
        </ui-drawer>
        <ui-drawer class="edit-drawer" :open="editVisible" :docked="true" @close="toggleNote()">
            <ui-appbar title="编辑笔记">
                <ui-icon-button icon="close" @click="editVisible = false" title="关闭" slot="left" />
                <!-- <ui-icon-button icon="check" @click="editVisible = false" title="保存" slot="right" /> -->
            </ui-appbar>
            <div class="edit-body" v-if="note">
                <div class="time">{{ note.createTime | simpleTime }}</div>
                <div class="mark" :style="{'border-color': note.color}">{{ note.selectedText }}</div>
                <textarea class="input" v-model="note.note" placeholder="输入笔记"></textarea>
                <!-- <div class="note">{{ note.note || '暂无笔记' }}</div> -->
            </div>
        </ui-drawer>
        <ui-drawer class="export-drawer" :open="exportVisible" :docked="false" @close="toggleNote()">
            <ui-appbar title="导出笔记">
                <ui-icon-button icon="close" @click="exportVisible = false" title="关闭" slot="left" />
                <ui-icon-button icon="file_download" @click="exportMarkdown" title="导出 Markdown" slot="right" />
            </ui-appbar>
            <div class="export-body">
                <div class="tip">提示：你可以复制下面内容，然后粘贴到笔记软件中即可</div>
                <div class="total" v-if="notes.length">总数：{{ notes.length }}</div>
                <ul class="note-list2" v-if="notes.length">
                    <li class="item"
                        :title="note.name"
                        :key="note.id"
                        @click="gotoBookmark(note)"
                        v-for="note in notes">
                        <div class="time">{{ note.createTime | simpleTime }}</div>
                        <div class="mark" :style="{'border-color': note.color}">{{ note.selectedText }}</div>
                        <div class="note">{{ note.note || '暂无笔记' }}</div>
                    </li>
                </ul>
                <div class="note-body">
                    <div v-if="!notes.length">暂无标注和笔记</div>
                </div>
            </div>
        </ui-drawer>
        <ui-drawer class="search-drawer" right :open="searchVisible" :docked="false" @close="toggleSearch()">
            <ui-appbar title="全文搜索">
                <ui-icon-button icon="close" @click="toggleSearch" title="关闭" slot="left" />
            </ui-appbar>
            <div class="search-body">
                <ui-text-field  v-model="keyword" />
                <ui-icon-button icon="search" title="全文搜索" @click="search" />
                <div v-if="results">
                    <div v-if="!results.length">搜索不到结果</div>
                    <ul class="result-list">
                        <li class="item" v-for="result in results">
                            <a class="link" href="#" @click.prevent="gotoCfi(result.cfi)" v-html="searhReslt(result.excerpt)">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </ui-drawer>
        <div class="page-info" v-if="info">
            {{ info.page }} / {{ info.totalPage }} {{ info.page / info.totalPage * 100}}%
            <!--<div v-if="this.book.currentChapter">当前章节页数：{{ this.book.currentChapter.pages }}</div>-->
        </div>
        <!--select menu-->
        <div class="select-menu" id="select-menu">
            <ul class="highlight-list">
                <li class="item" 
                    :style="{'background-color': highlight.color}"
                    @click="highlightText(index)"
                    v-for="highlight, index in highlights"></li>
            </ul>
            <div class="divider"></div>
            <div class="menu-item" title="" @click="removeHighlight">删除标记</div>
            <div class="menu-item" title="复制到剪切板" @click="copy">复制</div>
            <div class="menu-item" title="使用百度搜索" @click="searchNetwork">搜索</div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable2 */
    import bookDb from '../util/bookDb2'
    import {getCoverURL} from '../util/bookUtil'
    import {format} from '../util/time'
    import reader from '../util/reader'
    import exportMarkdown from '../util/exportMarkdown'
    const ePub = window.ePub
    const EPUBJS = window.EPUBJS
    const QiuPen = window.QiuPen

    export default {
        data () {
            return {
                reader: null,
                title: 'epub 阅读器',
                info: {
                    page: 1,
                    totalPage: 10
                },
                book: null,
                toc: [],
                meta: null,
                cover: null,
                loading: true,
                // infomation
                open: false,
                infoVisible: false,
                // bookmark
                bookmarkVisible: false,
                bookmarks: [
                    {
                        id: '1',
                        cfi: 'epubcfi(/6/2[chapter1]!/4/14/1:0)',
                        name: '第一个书签',
                        posY: 1
                    },
                    {
                        id: '2',
                        cfi: '',
                        name: '第一个书签',
                        posY: 1
                    }
                ],
                // search
                searchVisible: false,
                keyword: '',
                results: null,
                // note
                noteVisible: false,
                editVisible: false,
                note: null,
                notes: [],
                exportVisible: false,
                // setting
                settingVisible: false,
                options: {
                    bgColor: '#fff',
                    fontSize: 16,
                    fontFamily: 'Microsoft Yahei, Heiti SC, Heiti TC',
                    lineHeight: 2,
                    theme: 0
                },
                themes: [
                    {
                        id: '1',
                        name: '白色',
                        color: '#000',
                        bgColor: '#fff'
                    },
                    {
                        id: '2',
                        name: '浅棕色',
                        color: '#000',
                        bgColor: '#f9f4e9'
                    },
                    {
                        id: '3',
                        name: '护眼',
                        color: '#000',
                        bgColor: '#ceeaba'
                    },
                    {
                        id: '4',
                        name: '夜间',
                        color: '#fff',
                        bgColor: '#000'
                    }
                ],
                highlights: [
                    {
                        name: 'red',
                        color: '#FFBA84'
                    },
                    {
                        name: 'orange',
                        color: '#E2943B'
                    },
                    {
                        name: 'yellow',
                        color: '#F7C242'
                    },
                    {
                        name: 'green',
                        color: '#86C166'
                    },
                    {
                        name: 'blue',
                        color: '#33A6B8'
                    },
                    {
                        name: 'purple',
                        color: '#8A6BBE'
                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'book',
                            click: this.toggleNote,
                            title: '标注与笔记'
                        },
                        {
                            type: 'icon',
                            icon: 'list',
                            click: this.toggle,
                            title: '目录'
                        },
                        {
                            type: 'icon',
                            icon: 'search',
                            click: this.toggleSearch,
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'bookmarks',
                            click: this.toggleBookmark,
                            title: '书签'
                        },
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.toggleSetting,
                            title: '设置'
                        },
                        {
                            type: 'icon',
                            icon: 'info',
                            click: this.toggleInfo,
                            title: '书籍信息'
                        },
                        {
                            type: 'icon',
                            icon: 'fullscreen',
                            click: this.fullscreen,
                            title: '全屏/取消全屏'
                        }
                    ]
                }
            }
        },
        computed: {
            pageStyle() {
                return {
                    color: this.themes[this.options.theme].color,
                    'background-color': this.themes[this.options.theme].bgColor
                }
            }
        },
        mounted() {
            this.init()
            this.initEvent()
        },
        destroyed() {
            this.book && this.book.destroy()
            document.removeEventListener('keydown', this.onKeyDown)
        },
        filters: {
            lang(value) {
                switch (value) {
                    case 'en':
                        return '英语'
                    case 'zh':
                        return '中文'
                    default:
                        return value
                }
            },
            time(value) {
                if (!value) {
                    return ''
                }
                return format(new Date(value), 'yyyy-MM-dd')
            },
            simpleTime(value) {
                let date = new Date(value)
                let now = new Date()
                let time = now.getTime() - date.getTime()
                if (time < 60 * 60 * 1000) {
                    return parseInt(time / (60 * 1000)) + ' 分钟前'
                } else if (time < 24 * 60 * 1000) {
                    return parseInt(time / (24 * 60 * 1000)) + ' 小时前'
                }
                return format(new Date(value), 'yyyy-MM-dd')
            }
        },
        methods: {
            exportMarkdown() {
                exportMarkdown(this.notes, this.meta)
            },
            searhReslt(text) {
                return text.replace(this.keyword, `<span class="keyword"> ${this.keyword} </span>`)
            },
            editNote(note) {
                this.note = note
                this.editVisible = true
            },
            removeNote(note) {
                let store = this.$storage.get('highlight', {})
                this.notes = store[this.bookId] || []
                for (let i = 0; i < this.notes.length; i++) {
                    if (this.notes[i].id === note.id) {
                        this.notes.splice(i, 1)
                        break
                    }
                }
                this.$storage.set('highlight', store)
            },
            copy() {
                let iframe = document.getElementsByTagName('iframe')[0]
                let result = iframe.contentWindow.document.execCommand('copy', false, null)
                if (!result) {
                    console.log('failed to copy text to clipboard')
                }
                document.getElementById('select-menu').style.visibility = 'hidden'
            },
            removeHighlight() {
                QiuPen.highlighter.unhighlightSelection()
                // QiuPen.save(this.book, this.bookId, this.selectedText, this.locationCfi)
                document.getElementById('select-menu').style.visibility = 'hidden'
            },
            searchNetwork() {
                window.open('https://www.baidu.com/s?wd=' + this.selectedText)
                document.getElementById('select-menu').style.visibility = 'hidden'
            },
            highlightText(index) {
                let name = 'hl-' + this.highlights[index].name
                QiuPen.highlighter.highlightSelection(name)
                QiuPen.save(this.book, this.bookId, this.selectedText, this.locationCfi, this.highlights[index].color)
                this.loadNote()
                document.getElementById('select-menu').style.visibility = 'hidden'
            },
            fullscreen() {
                // 进入全屏模式
                function launchFullscreen(element) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen()
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen()
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen()
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen()
                    }
                }

                // 退出全屏模式
                function exitFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen()
                    }
                }

                if (this.isFullScreen) {
                    exitFullscreen()
                } else {
                    launchFullscreen(document.documentElement)
                }
                this.isFullScreen = !this.isFullScreen
            },
            themeStyle(theme) {
                return {
                    'background-color': theme.bgColor
                }
            },
            selectTheme(index) {
                this.options.theme = index
            },
            search() {
                if (!this.keyword.length) {
                    alert('请输入关键词')
                    return
                }
                let book = this.book
                let q = this.keyword
                return new Promise((resolve, reject) => {
                    var resultPromises = []
                    for (var i = 0; i < book.spine.length; i++) {
                    var spineItem = book.spine[i]
                    resultPromises.push(new Promise((resolve, reject) => {
                        new Promise(function(resolve, reject) {
                            resolve(new EPUBJS.Chapter(spineItem, book.store, book.credentials))
                        }).then(function(chapter) {
                            return new Promise(function(resolve, reject) {
                                chapter.load().then(function() {
                                resolve(chapter)
                                }).catch(reject)
                            })
                        }).then(function(chapter) {
                            return Promise.resolve(chapter.find(q))
                            }).then(function(result) {
                        resolve(result)
                        })
                    }))
                    }
                    Promise.all(resultPromises).then((results) => {
                        return new Promise((resolve, reject) => {
                            resolve(results)
                            var mergedResults = [].concat.apply([], results)
                            this.results = mergedResults
                        })
                    })
                })
            },
            init() {
                this.reader = reader
                // http://img1.yunser.com/epub/test.epub
                // let path = 'http://img1.yunser.com/epubtmp/'
                document.getElementById('area').style.height = window.innerHeight - 100 + 'px'

                this.options = this.$storage.get('options', this.options)

                let bookId = this.$route.params.id
                this.bookId = bookId
                // TODO
                if (!this.bookId) {
                    return
                }
                bookDb.init(() => {
                    bookDb.getBook(this.bookId, book => {
                        console.log(book)
                        this.loadBook(book.content)
                    })
                })
                // get bookmarks
                this.bookmarks = this.$storage.get('bookmarks-' + this.bookId, [])
                this.loadNote()
            },
            loadNote() {
                // get notes
                let store = this.$storage.get('highlight', {})
                this.notes = store[this.bookId] || []
            },
            initAfterLoadedBook() {
                QiuPen.init()
            },
            initEvent() {
                console.log('初始化事件')
                document.addEventListener('keydown', this.onKeyDown = e => {
                    console.log(e.keyCode)
                    switch (e.keyCode) {
                        case 27: // Esc
                            this.$router.push('/')
                            break
                        case 37: // left
                        case 38: // up
                            this.prev()
                            break
                        case 39: // right
                        case 40: // down
                        this.next()
                            this.book.nextPage()
                            break
                    }
                }, false)
            },
            keydown() {
            },
            prev() {
                this.info.page--
                this.book.prevPage()
            },
            next() {
                this.info.page++
                this.book.nextPage()
            },
            toggle() {
                this.open = !this.open
            },
            toggleInfo() {
                this.infoVisible = !this.infoVisible
            },
            toggleSetting() {
                this.settingVisible = !this.settingVisible
            },
            toggleBookmark() {
                this.bookmarkVisible = !this.bookmarkVisible
            },
            toggleNote() {
                this.noteVisible = !this.noteVisible
                this.editVisible = false
            },
            exportNote() {
                this.exportVisible = true
            },
            toggleSearch() {
                this.searchVisible = !this.searchVisible
            },
            gotoDirectory(item) {
                this.open = false
                this.book.goto(item.href)
            },
            gotoBookmark(bookmark) {
                this.book.goto(bookmark.cfi)
                this.bookmarkVisible = false
            },
            gotoCfi(cfi) {
                this.book.goto(cfi)
            },
            gotoNote(note) {
                this.book.goto(note.cfi)
            },
            removeBookmark(bookmark) {
                for (let i = 0; i < this.bookmarks.length; i++) {
                    if (this.bookmarks[i].id === bookmark.id) {
                        this.bookmarks.splice(i, 1)
                        this.$storage.set('bookmarks-' + this.bookId, this.bookmarks)
                    }
                }
            },
            addBookmark() {
                let name = '书签 ' + new Date().getHours() + ':' + new Date().getMinutes()
                this.bookmarks.unshift({
                    id: '' + new Date().getTime(), // TODO
                    cfi: this.locationCfi,
                    name: name, // TODO
                    createTime: new Date().getTime(),
                    posY: 1 // TODO
                })
                this.$storage.set('bookmarks-' + this.bookId, this.bookmarks)
            },
            loadBook(content) {
                this.book = ePub({
                    bookPath: content,
                //    width: 300,
                //    height: 400,
                    restore: false,
                    spreads: false
                })
                this.book.getMetadata().then(meta => {
                    this.meta = meta
                    // this.meta.cover = this.book.cover
                    this.title = meta.bookTitle + ' – ' + meta.creator
                })
                this.book.getToc().then(toc => {
                    this.toc = toc
                })
                this.book.pageListReady.then(pageList => {
                    console.log('申请的页数')
                    console.log(this.book.pagination)
                    this.info.totalPage = this.book.pagination.totalPages
                })
                this.book.ready.all.then(() => {
                    console.log(this.book)
                    getCoverURL(this.book, cover => {
                        this.cover = cover
                    })
                    this.loading = false
                    this.initAfterLoadedBook()
                })
                this.book.renderer.forceSingle(false)
                // epub.js能捕获用户在书籍上的鼠标释放事件，使用self.selected是为了防止用户重复选中。
                // 监听 章节渲染
                this.book.on('renderer:chapterDisplayed', () => {
                    // this.info.page = 1
                    // 创建动态脚本
                    function createScript(url) {
                        var script = document.createElement('script')
                        script.type = 'text/javascript'
                        script.src = url
                        return script
                    }

                    // 创建动态样式表
                    function createLink(url) {
                        var link = document.createElement('link')
                        link.rel = 'stylesheet'
                        link.type = 'text/css'
                        link.href = url
                        return link
                    }

                    var link = createLink('/static/epub/common.css')
                    var script = createScript('/static/epub/selection.js')
                    var iframe = document.getElementsByTagName('iframe')[0]
                    iframe.contentDocument.head.appendChild(link)
                    iframe.contentDocument.body.appendChild(script)

                    QiuPen.create(iframe.contentWindow.document)
                    QiuPen.load(this.book, this.bookId)
                })
                this.book.on('book:pageChanged', function(location) {
                    console.log(location.anchorPage, location.pageRange)
                })
                this.book.on('renderer:locationChanged', locationCfi => {
                    this.locationCfi = locationCfi
                })
                this.book.on('renderer:mouseup', event => {
                    // 释放后检测用户选中的文字
                    var render = this.book.renderer.render
                    var selectedContent = render.window.getSelection()
                    this.selection = selectedContent
                    console.log(this.selection)
                    console.log(this.selection.anchorNode.data.substring(this.selection.baseOffset, this.selection.extentOffset))
                    this.selectedText = this.selection.anchorNode.data.substring(this.selection.baseOffset, this.selection.extentOffset)
                    // 若当前用户不在选中状态，并且选中文字不为空
                    if (this.selected === false) {
                        console.log('啦啦2')
                        if (selectedContent.toString() && (selectedContent.toString() !== '')) {
                            console.log('啦啦2')
                            this.selected = true
                        }
                    }
                })
                this.book.renderTo('area').then(() => {
                    this.setStyle()
                    // this.book.goto('epubcfi(/6/6[id71]!/4[0-622b49af2d5d40458b0c96129dcf4ccb]/2/2[calibre_pb_0]/1:0)')
                })
            },
            setStyle() {
                // TODO ???
                if (!this.book) {
                    return
                }
                this.book.setStyle('font-size', this.options.fontSize + 'px')
                this.book.setStyle('background-color', this.options.bgColor)
                this.book.setStyle('font-family', this.options.fontFamily)
                this.book.setStyle('line-height', 3)

                this.book.renderer.forceSingle(false)

                this.book.setStyle('color', this.themes[this.options.theme].color)
                this.book.setStyle('background-color', this.themes[this.options.theme].bgColor)
            },
            clearStorage() {
                let clear = confirm('清除浏览器缓存会删除所有的书签、标注和笔记')
                if (clear) {
                    localStorage.clear() // TODO
                    // TODO
                }
            }
        },
        watch: {
            options: {
                deep: true,
                handler() {
                    this.$storage.set('options', this.options)
                    this.setStyle()
                }
            },
            note: {
                deep: true,
                handler() {
                    console.log('123')
                    let store = this.$storage.get('highlight', {})
                    store[this.bookId] = this.notes
                    this.$storage.set('highlight', store)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

#prev {
    left: 40px;
}

#next {
    right: 40px;
}

.arrow {
    position: absolute;
    top: 50%;
    margin-top: -32px;
    font-size: 64px;
    color: #E2E2E2;
    font-family: arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    &:hover {
        color: #777;
    }
    &:active {
        color: #000;
    }
}

#wrapper {
    max-width: 1100px;
    // padding: 16px;
    // width: 480px;
    // height: 640px;
    margin: 0 auto;
    overflow: hidden;
    // border: 1px solid #ccc;
    background: #fff;
    border-radius: 0 5px 5px 0;
}
#area {
    // width: 480px;
    // height: 650px;
    // margin: -5px auto;
    // box-shadow: inset 10px 0 20px rgba(0, 0, 0, .1);
    // padding: 40px 40px;
}
.page-divider {
    display: none;
    position: absolute;
    width: 1px;
    border-right: 1px #000 solid;
    height: 80%;
    z-index: 1;
    left: 50%;
    margin-left: -1px;
    top: 10%;
    opacity: .15;
}
@media all and (min-width: 800px) {
   .divider {
       display: block;
   }
   .page-info {
       display: block;
    }
}
.page-info {
    display: none;
    position: absolute;
    left: 16px;
    bottom: 16px;
}
.drawer-body {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
.info-drawer {
    width: 320px;
    max-width: 100%;
    .info-body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 16px;
        .key {
            width: 100px;
        }
        .cover {
            margin-bottom: 0;
        }
    }
}
.setting-drawer {
    width: 320px;
    max-width: 100%;
    .setting-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
    .btn-clear {
        position: absolute;
        left: 16px;
        bottom: 16px;
    }
}
.bookmark-drawer {
    width: 320px;
    max-width: 100%;
    .bookmark-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
}
.note-drawer {
    width: 320px;
    max-width: 100%;
    .note-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
    .total {
        margin: 16px;
    }
}
.edit-drawer {
    left: 320px;
    z-index: 100000000;
    width: 320px;
    max-width: 100%;
    .edit-body {
        padding: 16px;
        .time {
            margin-bottom: 16px;
        }
        .mark {
            padding: 8px 16px;
            margin-bottom: 16px;
            border-left: 8px solid #09c;
            max-height: 54px;
            overflow: hidden;
        }
        .note {
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .input {
            width: 100%;
            height: 240px;
            padding: 16px;
            outline: none;
        }
    }
}
.export-drawer {
    width: 100%;
    max-width: 100%;
    .note-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
    // TODO
    .export-body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
    .total {
        margin: 16px;
    }
    .tip {
        display: inline-block;
        margin: 16px;
        height: 40px;
        background: #feffe1;
        padding: 10px 14px;
        margin-bottom: 20px;
        font-size: 14px;
        color: #666;
    }
}
.note-list {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid #eee;
    overflow: auto;
    .item {
        position: relative;
        padding: 48px 16px 16px 16px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        &:hover {
            background-color: #f9f9f9;
            .close {
                display: block;
            }
            .goto {
                display: block;
            }
        }
    }
    .close {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        // background-color: #fff;
    }
    .goto {
        display: none;
        position: absolute;
        top: 0;
        right: 48px;
        // background-color: #fff;
    }
    .mark {
        padding: 8px 16px;
        margin-bottom: 16px;
        border-left: 8px solid #09c;
        max-height: 54px;
        overflow: hidden;
    }
    .note {
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .time {
        position: absolute;
        top: 16px;
        left: 16px;
        color: #999;
    }
}
.note-list2 {
    border-top: 1px solid #eee;
    overflow: auto;
    .item {
        position: relative;
        padding: 48px 16px 16px 16px;
        border-bottom: 1px solid #eee;
    }
    .close {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        // background-color: #fff;
    }
    .goto {
        display: none;
        position: absolute;
        top: 0;
        right: 48px;
        // background-color: #fff;
    }
    .mark {
        padding: 8px 16px;
        margin-bottom: 16px;
        border-left: 8px solid #09c;
    }
    .note {
        color: #999;
    }
    .time {
        position: absolute;
        top: 16px;
        left: 16px;
        color: #999;
    }
}

.theme-list {
    overflow: hidden;
    .item {
        float: left;
        width: 40px;
        height: 40px;
        margin-right: 16px;
        margin-bottom: 16px;
        border: 1px solid #999;
        border-radius: 50%;
        background-color: #000;
        cursor: pointer;
    }
}
.form-label {
    color: rgba(0,0,0,.54);
    margin-bottom: 8px;
}
.highlight-list {
    overflow: hidden;
    padding-left: 16px;
    .item {
        float: left;
        width: 24px;
        height: 24px;
        margin-right: 8px;
        margin-bottom: 8px;
        background-color: #f00;
        border-radius: 50%;
        cursor: pointer;
    }
}
</style>

<style lang="scss">
    .toc-drawer {
        width: 400px;
        max-width: 100%;
        .ui-item-title {
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .search-drawer {
    width: 400px;
    max-width: 100%;
    .search-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
    .result-list {
        position: absolute;
        top: 128px;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 1px solid #eee;
        overflow: auto;
        .item {
            padding: 16px;
            border-bottom: 1px solid #eee;
            &:hover {
                background-color: #f9f9f9;
            }
        }
        .link {
            color: #666;
        }
        .keyword {
            color: #009688;
            font-weight: bold;
        }
    }
}
</style>
