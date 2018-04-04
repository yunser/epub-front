/* eslint-disable */

let g_store

class BookDb {

    constructor() {
        this.DB_NAME = 'dbName'
        this.OBJECT = 'Book'
    }

    init(cb) {
        var request = indexedDB.open('dbName3', 1);  // 打开 dbName 数据库
        request.onerror = function(e){              // 监听连接数据库失败时执行
            console.log('连接数据库失败');
        }
        request.onsuccess = function(e){            // 监听连接数据库成功时执行
            console.log('连接数据库成功');
        }

        request.onupgradeneeded = e => {
            var db = e.target.result;
            db.createObjectStore(this.OBJECT, {keyPath: 'id', autoIncrement: false});
            console.log('创建对象仓库成功');
        }

        request.onsuccess = e => {
            var db = e.target.result;
            var tx = db.transaction(this.OBJECT,'readwrite');
            g_store = tx.objectStore(this.OBJECT);
            cb && cb()
        }
    }

    init2() {
        var value = {
            'id': '2',
            'userName': 'asd',
            'age': 24
        }
        var req1 = g_store.put(value);        // 保存数据

        var req2 = g_store.get('2');            // 获取索引userId为1的数据
        req2.onsuccess = function(){
            console.log(this.result);    // linxin
        }

        var req3 = g_store.delete('2');             // 删除索引为1的数据
        req3.onsuccess = function(){
            console.log('删除数据成功');        // 删除数据成功
        }
    }

    getBooks(cb) {
        var req = g_store.openCursor();
        var result = [];

        req.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            } else {
                cb && cb(result)
            }
        }
    }

    getBook(id, cb) {
        let req = g_store.get(id)
        req.onsuccess = e => {
            console.log('getBook')
            console.log(e.target.result)
            cb && cb(e.target.result)
        }
    }

    addBook(book, cb) {
        let req = g_store.put(book)
        req.onsuccess = () => {
            console.log('保存成功')
            cb && cb()
        }
    }

    deleteBook(id, cb) {
        let req = g_store.delete(id)
        req.onsuccess = () => {
            console.log('删除数据成功')
            cb && cb()
        }
    }
}

let db = new BookDb()

export default db
