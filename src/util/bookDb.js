/* eslint-disable */

class BookDb {

    constructor() {
        this.DB_NAME = 'dbName'
        this.OBJECT = 'Book'
    }

    init() {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open(this.DB_NAME, '9')
            this.request = request
            request.onerror = e => {
                console.log('连接数据库失败')
            }
            request.onsuccess = e => {
                console.log('连接数据库成功')

            }
            request.onupgradeneeded = e => {
                console.log('onupgradeneeded')
                var db = e.target.result
                var store = db.createObjectStore(this.OBJECT, {keyPath: 'id', autoIncrement: false})
                // this.store = store
                // this.db = db
                console.log('onupgradeneeded成功')
            }
            request.onsuccess = e => {
                console.log('onsuccess')
                var db = e.target.result;
                this.db = db
                console.log('创建对象仓库成功')
                var tx = db.transaction(this.OBJECT, 'readwrite')
                this.tx = tx
                // var store = tx.objectStore(this.OBJECT);
                // this.store = store
                resolve()
            }
        })
    }

    getBooks() {
        return new Promise((resolve, reject) => {
            let t = this.db.transaction(this.OBJECT, 'readwrite')
            let store = t.objectStore(this.OBJECT)
            var req = store.openCursor();
            var result = [];

            req.onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    result.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };
        })
    }

    getBook(id) {
        return new Promise((resolve, reject) => {
            console.log('22', this.OBJECT)
            let tx = this.db.transaction(this.OBJECT, 'readwrite')
            let store = tx.objectStore(this.OBJECT)
            let req = store.get(id)
            req.onsuccess = e => {
                console.log('getBook')
                console.log(e.target.result)
                resolve(e.target.result)
            }
        })
    }

    addBook(book) {
        return new Promise((resolve, reject) => {
            let t = this.db.transaction(this.OBJECT, 'readwrite')
            let store = this.tx.objectStore(this.OBJECT)
            let req = store.put(book)
            req.onsuccess = () => {
                console.log('保存成功')
                resolve()
            }
            let req2 = store.get('1')
            req2.onsuccess = (e) => {
                console.log('getBook222222222222222222222')
                console.log(e.result)
                resolve(e.result)
            }
        })
    }

    deleteBook(id) {
        return new Promise((resolve, reject) => {
            let t = this.db.transaction(this.OBJECT, 'readwrite')
            let store = t.objectStore(this.OBJECT)
            let req = store.delete(id)
            req.onsuccess = () => {
                console.log('删除数据成功')
                resolve()
            }
        })
    }
}

let db = new BookDb()

export default db
