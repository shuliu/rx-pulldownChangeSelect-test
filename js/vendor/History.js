/**
 * 存取外部 API 資料及 localStorage
 */


export class History {

    constructor(keyName = 'defaultStore') {
        /** 預設空資料的記錄 */
        this.baseUserSelector = {"city": "", "town": "", "store": ""};
        /** localStorage key name */
        this.keyName = '';
        this.setKey(keyName);
        /** 建立 user 的記錄暫存 */
        this.user = this.query(true);

    }

    /** set key name */
    setKey(name = '') {
        return this.keyName = name;
    }

    getKey() {
        return this.keyName;
    }

    /** 取得預設的空記錄 */
    getDefault() {
        return this.baseUserSelector;
    }

    /** get json with client */
    getUser() {
        return this.user;
    }

    /** set key value */
    setValue(key, value= '') {
        if( Object.keys(this.user).indexOf(key) !== -1 ) {
            this.user[key] = value;
            return true;
        } else {
            return false;
        }
    }

    /** 回存入 localStorage */
    save(items = {}) {
        let encode = JSON.stringify(items);
        localStorage.setItem(this.keyName, encode);
        return encode;
    }

    /** 查詢 localStorage */
    query(save = false) {
        let items = JSON.parse(localStorage.getItem(this.keyName)) || this.baseUserSelector;
        if(save === true){ this.user = items; }
        return items;
    }
}
