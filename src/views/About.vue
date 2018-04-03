<template>
    <my-page title="关于" backable>
        <div>这是关于页面</div>
        <div>版本：{{ version }}</div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                version: ''
            }
        },
        mounted() {
            this.$http.get('/version').then(
                response => {
                    let data = response.data
                    if (data.code === 200) {
                        console.log(data)
                        this.version = data.data
                    }
                },
                response => {
                    console.log(response)
                })
//            this.$http.post('/example', this.$qs.stringify({
//                param1: 'value1',
//                param2: 'value2'
//            })).then(
//                response => {
//                    let data = response.data
//                    if (data.code === 200) {
//                        console.log(data.data)
//                    }
//                },
//                response => {
//                    console.log(response)
//                })
        }
    }
</script>

<style scoped>
</style>
