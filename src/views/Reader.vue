<template>
    <my-page :title="title" :page="page">
        <div id="wrapper">
            <div id="area"></div>
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
                                  @click="goto(item)"
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
                            <td class="key">创建者</td>
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
                            <td class="value">{{ meta.language }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">布局</td>
                            <td class="value">{{ meta.layout }}</td>
                        </tr>
                        <tr class="item">
                            <td class="key">修改时间</td>
                            <td class="value">{{ meta.modified_date }}</td>
                        </tr>
                        <!--<tr class="item">-->
                        <!--<td class="key">orientation</td>-->
                        <!--<td class="value">{{ meta.orientation }}</td>-->
                        <!--</tr>-->
                        <tr class="item">
                            <td class="key">出版日期</td>
                            <td class="value">{{ meta.pubdate }}</td>
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
                暂无可设置项
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
        <div v-if="info">
            {{ info.page }} / {{ info.totalPage }} {{ info.page / info.totalPage * 100}}%
            <!--<div v-if="this.book.currentChapter">当前章节页数：{{ this.book.currentChapter.pages }}</div>-->
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import bookDb from '../util/bookDb2'

    export default {
        data () {
            return {
                title: 'epub 阅读器',
                info: {
                    page: 1,
                    totalPage: 10,
                },
                book: null,
                open: false,
                toc: [],
                meta: null,
                infoVisible: false,
                settingVisible: false,
                bookmarkVisible: false,
                loading: true,
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
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'list',
                            click: this.toggle,
                            title: '目录'
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
                            icon: 'bookmarks',
                            click: this.toggleBookmark,
                            title: '书签'
                        }
                    ]
                }
            }
        },
        mounted() {
//            this.init()
            this.init2()
            this.initEvent()
        },
        destroyed() {
            this.book && this.book.destroy()
            document.removeEventListener('keydown', this.onKeyDown)
        },
        methods: {
            init() {
                let path = 'http://img1.yunser.com/epubtmp/'
//            let path = 'http://img1.yunser.com/epub/test.epub'
                this.book = ePub(path, {
                    width: 400,
                    height: 600,
                    spreads: false,
                    restore: true
                })
                this.book.getMetadata().then(meta => {
                    this.meta = meta
                    console.log('getMetadata')
                    console.log(meta)
                    this.title = meta.bookTitle + ' – ' + meta.creator
                })
                this.book.getToc().then(toc => {
                    console.log('toc')
                    console.log(toc)
                    this.toc = toc
                })
                this.book.ready.all.then(() => {
                    console.log('finish')
                    console.log(this.book)
                    this.loading = false
                })
                this.book.renderTo("area").then(() => {
                    console.log('renderTo finish')

                    //Book.setStyle("width", "400px");
//                this.book.displayChapter(3, true)
                })
            },
            init2() {
                let bookId = this.$route.params.id
                this.bookId = bookId
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
            },
            initEvent() {
                console.log('初始化事件')
                document.addEventListener('keydown', this.onKeyDown = e => {
                    console.log(e.keyCode)
                    switch(e.keyCode) {
                        case 27: // Esc
                            this.$router.push('/')
                            break
                        case 37: // left
                        case 38: // up
                            this.book.prevPage()
                            break
                        case 39: // right
                        case 40: // down
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
            goto(item) {
                this.open = false
                this.book.goto(item.href)
            },
            gotoBookmark(bookmark) {
                this.book.goto(bookmark.cfi)
                this.bookmarkVisible = false
//                Book.displayChapter('/6/4[chap01ref]!/4[body01]/10');
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
                   width: 300,
                //    height: 400,
//                    spreads: false,
                    restore: false
                })
                this.book.getMetadata().then(meta => {
                    this.meta = meta
                    console.log('getMetadata')
                    console.log(meta)
                    this.title = meta.bookTitle + ' – ' + meta.creator
                })
                this.book.getToc().then(toc => {
                    console.log('toc')
                    console.log(toc)
                    this.toc = toc
                })
                this.book.ready.all.then(() => {
                    console.log('finish')
                    console.log(this.book)
                    this.loading = false
                })
                this.book.renderer.forceSingle(true)
                //epub.js能捕获用户在书籍上的鼠标释放事件，使用self.selected是为了防止用户重复选中。
                //监听 章节渲染
                this.book.on('renderer:chapterDisplayed',() => {
                    this.info.page = 1
                })
                this.book.on('book:pageChanged', function(location){
                    console.log('book:pageChanged')
                    console.log(location.anchorPage, location.pageRange)
                });
                this.book.on('renderer:locationChanged', locationCfi => {
                    console.log('renderer:locationChanged')
                    console.log(locationCfi)
                    this.locationCfi = locationCfi
                });
                this.book.on('renderer:mouseup', (event) => {
                    console.log('啦啦')
                    //释放后检测用户选中的文字
                    var render = this.book.renderer.render;
                    var selectedContent = render.window.getSelection();
                    this.selection = selectedContent;
                    console.log(this.selection)
                    //若当前用户不在选中状态，并且选中文字不为空
                    if (this.selected == false) {
                        console.log('啦啦2')
                        if (selectedContent.toString() && (selectedContent.toString() != "")) {
                            console.log('啦啦2')
                            this.selected = true;
                        }
                    }
                });
                this.book.renderTo("area").then(() => {
                    console.log('renderTo finish')
                    this.setStyle()
                    //Book.setStyle("width", "400px");
//                this.book.displayChapter(3, true)
                })
            },
            setStyle() {
                let options = this.$storage.get('options', {
                    bgColor: '#fff',
                    fontSize: 1.2,
                    fontFamily: '宋体'
                })

                this.book.setStyle('font-size', options.fontSize + 'em')
                this.book.setStyle('background-color', options.bgColor)
                this.book.setStyle('font-family', options.fontFamily)
                this.book.renderer.forceSingle(false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui-file-button{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
    }
    #wrapper {
        width: 480px;
        height: 640px;
        overflow: hidden;
        border: 1px solid #ccc;
        margin: 20px auto;
        background: #fff;
        border-radius: 0 5px 5px 0;
    }
    #area {
        width: 480px;
        height: 650px;
        margin: -5px auto;
        -moz-box-shadow: inset 10px 0 20px rgba(0, 0, 0, .1);
        -webkit-box-shadow: inset 10px 0 20px rgba(0, 0, 0, .1);
        box-shadow: inset 10px 0 20px rgba(0, 0, 0, .1);
        padding: 40px 40px;
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
            padding: 16px;
            .key {
                width: 100px;
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
</style>

<style lang="scss">
    .toc-drawer {
        width: 400px;
        max-width: 100%;
        .mu-item-title {
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
