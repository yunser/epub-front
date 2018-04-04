<template>
    <my-page title="编辑器" :page="page">
        1212
        <button @click="downlaod">下载</button>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                page: {
                    menu: [
//                        {
//                            type: 'icon',
//                            icon: 'add',
//                            click: this.add,
//                            title: '添加书籍'
//                        },
//                        {
//                            type: 'icon',
//                            icon: 'info',
//                            to: '/help',
//                            title: '设置'
//                        },
//                        {
//                            type: 'icon',
//                            icon: 'help',
//                            to: '/help',
//                            title: '帮助'
//                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        destroyed() {
        },
        methods: {
            init() {
                console.log('初始化')
            },
            downlaod() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/var";

    @keyframes rotate {
        to { transform: rotate(360deg); }
    }

</style>
