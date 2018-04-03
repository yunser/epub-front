const storage = {
    set (key, value) {
        console.log('set', key, value)
        if (value === undefined || value === null) {
            localStorage.setItem(key, null)
            return
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            localStorage.setItem(key, JSON.stringify({
                _type: typeof value,
                value: value
            }))
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
    get (key) {
        // console.log('storage get ' + key)
        let item = localStorage.getItem(key)
        if (item === null) {
            return null
        }
        let ret = JSON.parse(item)
        if (ret && typeof ret === 'object') {
            if (ret._type === 'string' || ret._type === 'number' || ret._type === 'boolean') {
                return ret.value
            }
        }
        return ret
    },
    setItem (key, value) {
        this.set(key, value)
        return this
    },
    getItem (key) {
        return this.get(key)
    }
}

// let storage2 = new Proxy(storage, {
//   get: function (target, key, receiver) {
//     storage.get(key)
//     return Reflect.get(target, key, receiver)
//   },
//   set: function (target, key, value, receiver) {
//     storage.set(key, value)
//     return Reflect.set(target, key, value, receiver)
//   }
// })

export default storage
