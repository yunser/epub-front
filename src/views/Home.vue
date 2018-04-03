<template>
    <my-page :title="title" :page="page">
        <div id="main">
            <div id="prev" class="arrow" @click="prev">‹</div>
            <div id="wrapper">
                <div id="area"></div>
            </div>
            <div id="next" class="arrow" @click="next">›</div>
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
                        <ui-list-item title="Menu Item 2"/>
                        <ui-list-item title="Menu Item 3"/>
                        <ui-list-item @click.native="open = false" title="Close"/>
                    </ui-list>
                </div>
            </ui-drawer>
            <ui-drawer class="info-drawer" right :open="infoVisible" :docked="false" @close="toggleInfo()">
                <ui-appbar title="目录">
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
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                title: 'epub 阅读器',
                open: false,
                toc: [],
                meta: null,
                infoVisible: true,
                loading: true,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.toggle,
                            title: '设置'
                        },
                        {
                            type: 'icon',
                            icon: 'info',
                            to: '/help',
                            title: '设置'
                        },
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            let path = 'http://img1.yunser.com/epubtmp/'
//            let path = 'http://img1.yunser.com/epub/test.epub'
            this.Book = ePub(path, {
                width: 400,
                height: 600,
                spreads: false,
                restore: true
            })
            this.Book.setStyle('font-size', '1.2em')
            this.Book.getMetadata().then(meta => {
                this.meta = meta
                console.log('getMetadata')
                console.log(meta)
                this.title = meta.bookTitle + ' – ' + meta.creator
            })
            this.Book.getToc().then(toc => {
                console.log('toc')
                console.log(toc)
                this.toc = toc
            })
            this.Book.ready.all.then(() => {
                console.log('finish')
                this.loading = false
            })
            this.Book.renderTo("area").then(() => {
                console.log('renderTo finish')

                //Book.setStyle("width", "400px");
//                this.Book.displayChapter(3, true)
            })
        },
        methods: {
            prev() {
                this.Book.prevPage()
            },
            next() {
                this.Book.nextPage()
            },
            toggle() {
                this.open = !this.open
            },
            toggleInfo() {
                this.infoVisible = !this.infoVisible
            },
            goto(item) {
                this.open = false
                this.Book.goto(item.href)
            }
        }
    }
</script>

<style lang="scss" scoped>
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
        width: 600px;
        max-width: 100%;
    }
    .info-body {
        padding: 16px;
        .key {
            width: 100px;
        }
    }
</style>
