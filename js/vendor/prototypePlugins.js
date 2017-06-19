

/**
 * selector element prototype
 */

/** 設置 selector 為空 */
Object.defineProperty(HTMLSelectElement.prototype, 'optionsEmpty', {
    value: function (defaultOption) {
        // 空 selector 的預設 option
        const defaultOptionWithEmpty = '<option value="" data-num="" data-store="" >尚無資料</option>';
        // empty options
        this.options.length = 0;
        // set empty option
        this.innerHTML = defaultOption || defaultOptionWithEmpty;
        return this;
    }
});

Object.defineProperty(HTMLSelectElement.prototype, 'generatorOption', {
    value: function(items, key) {
        const defaultOption = '<option value="" data-num ="">請選擇</option>';

        if(items.length <= 0) {return false;}
        this.optionsEmpty();
        let options = items.map((item, index) => {
            let isStore = item.storeName !== undefined;
            return isStore ? '<option value="'+ item.storeName +'" data-num="'+ index +'" data-location="'+ item.lat + ',' + item.lon +'" >'+ item.storeName +'</option>'
                : '<option value="'+ item.name +'" data-num="'+ index +'" >'+ item.name +'</option>';
        }).join('');
        this.innerHTML = defaultOption + options;
        return defaultOption + options;
    },
    writable: true,
    enumerable: true,
});


export default Object;