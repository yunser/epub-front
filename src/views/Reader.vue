<template>
    <my-page :title="title" :page="page">
        <div>
            <!--<ui-raised-button class="file-btn" label="从文件中导入">-->
                <!--<input type="file" class="ui-file-button" @change="fileChange($event, 1)">-->
            <!--</ui-raised-button>-->
            <div id="wrapper">
                <div id="area"></div>
            </div>
            <div id="prev" class="arrow" @click="prev" v-if="book">‹</div>
            <div id="next" class="arrow" @click="next" v-if="book">›</div>
            <ui-circular-progress class="loading" :size="40" v-if="loading"/>
            <ui-drawer right :open="open" :docked="false" @close="toggle()">
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
                book: null,
                open: false,
                toc: [],
                meta: null,
                infoVisible: false,
                settingVisible: false,
                loading: true,
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
                        }
                    ]
                }
            }
        },
        mounted() {
//            this.init()
            this.init2()
        },
        destroyed() {
            this.book && this.book.destroy()
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
                this.book.setStyle('font-size', '1.2em')
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
                if (!bookId) {
                    return
                }
                bookDb.init(() => {
                    bookDb.getBook(bookId, book => {
                        console.log(book)
                        this.loadBook(book.content)
                    })
                })
            },
            prev() {
                this.book.prevPage()
            },
            next() {
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
            goto(item) {
                this.open = false
                this.book.goto(item.href)
            },
            loadBook(content) {
                this.book = ePub({
                    bookPath: content,
//                    width: 400,
//                    height: 600,
//                    spreads: false,
                    restore: false
                })
                this.book.setStyle('font-size', '1.2em')
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
                    this.loading = false
                })
                this.book.renderTo("area").then(() => {
                    console.log('renderTo finish')
                    //Book.setStyle("width", "400px");
//                this.book.displayChapter(3, true)
                })
            },
            fileChange(e) {
                let file = e.target.files[0]
//                if (left === 1) {
//                    var f_name = file.name;
//                    var f_type = f_name.substring(f_name.lastIndexOf("."))
//                }
                console.log(file.name)
                let reader = new FileReader()
                reader.onload = e => {
                    let content = e.target.result
                    this.loadBook(content)
                }
                reader.readAsArrayBuffer(file)
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
</style>
