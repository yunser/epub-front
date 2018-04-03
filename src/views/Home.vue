<template>
    <my-page title="首页">
        这是首页内容
        <div id="main">
            <div id="prev" class="arrow" @click="prev">‹</div>
            <div id="wrapper">
                <div id="area"></div>
            </div>
            <div id="next" class="arrow" @click="next">›</div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.Book = ePub("http://img1.yunser.com/epubtmp/", {
                width: 400,
                height: 600,
                spreads : false
            });
            this.Book.renderTo("area").then(function(){
                //Book.setStyle("width", "400px");
            });
        },
        methods: {
            prev() {
                this.Book.prevPage()
            },
            next() {
                this.Book.nextPage()
            }
        }
    }
</script>

<style scoped>
    body {
        overflow: auto;
        background: #eee;
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
        -moz-box-shadow:      inset 10px 0 20px rgba(0,0,0,.1);
        -webkit-box-shadow:   inset 10px 0 20px rgba(0,0,0,.1);
        box-shadow:           inset 10px 0 20px rgba(0,0,0,.1);
        padding: 40px 40px;
    }
</style>
