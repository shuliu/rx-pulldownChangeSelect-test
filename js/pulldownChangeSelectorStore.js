import { Observable } from "rxjs";

/** default */
const defaultStore = {"city": "", "town": "", "store": ""};

/** 設定路徑 */
const baseUrl = '//apis.senao.com.tw/apis/senao_online/EC_S3Resource.jsp?apiKey=';
const storeUrl = baseUrl + 'APP_SenaoOnlineStore_type2.json';

/** DOM */
const storeGroupDOM = document.querySelector('.pulldownChangeSelectorStore-group');
const cityDOM = storeGroupDOM.querySelector('.pulldownChange-city');
const townDOM = storeGroupDOM.querySelector('.pulldownChange-town');
const storeDOM = storeGroupDOM.querySelector('.pulldownChange-store');

/** event */
const cityDOMEvent = Observable.fromEvent(cityDOM, 'change');
const townDOMEvent = Observable.fromEvent(townDOM, 'change');
const storeDOMEvent = Observable.fromEvent(storeDOM, 'change');

/** 顯示 */
const display = false;
const defaultOption = '<option value="" data-num ="">請選擇</option>';
const defaultOptionWithTown = '<option value="" data-num ="">請選縣市</option>';
const defaultOptionWithStore = '<option value="" data-num ="">請選擇地區</option>';
const defaultOptionWithEmpty = '<option value="" data-num="" data-store="" >尚無資料</option>';

/** ajax Obserable */
const stores = Observable.ajax({ method: 'get', url: storeUrl, crossDomain: true });
const userStore = JSON.parse(localStorage.getItem('defaultStore')) || defaultStore;

/** TODO: 建立預設值，並且起始都是0，監聽 change 觸發替換 town, store */

/** 建立 select options */
const renderCitySelectOption = (suggestArr = []) => {
    let cityString, townString, storeString;
    cityString = townString = storeString = defaultOptionWithEmpty;
    if(suggestArr.length > 0) {
        cityString = suggestArr.map( (item, index) => {
            return '<option value="'+ item.name +'" data-num="'+ index +'" >'+ item.name +'</option>';
        }).join('');
    }

    // insert city options
    cityDOM.innerHTML = defaultOption + cityString;
    

    /** city 預設值 */
    let cityDefault = userStore.city || cityDOM.dataset.val || '';

    /** city 現有 options */
    let cityOptions = Observable.from( cityDOM.querySelectorAll('option') );
    cityOptions.filter( item => item.value === cityDefault ).subscribe(item => item.selected = true);

    // 注入 town, store 預設 options
    townDOM.innerHTML = defaultOptionWithTown;
    storeDOM.innerHTML = defaultOptionWithStore;

    // console.log(cityString);
    console.log(userStore);
}

/** 設置 selector 為空 */
Object.defineProperty(HTMLSelectElement.prototype, 'emptyOptions', {get: function () {
    // empty options
    this.options.length = 0;
    // set empty option
    this.innerHTML = defaultOptionWithEmpty;
}});

/** get json */
stores.map(response => response.response.stores)
    .subscribe(
        (item) => {
            // console.info(item);
            if(item !== undefined) localStorage.setItem('stores', JSON.stringify(item));
            let store = JSON.parse( localStorage.getItem('stores') );
            renderCitySelectOption( store );
            // return store;
        },
        () => { console.log('can\'t connection'); },
        () => { console.log('complete'); }
);

/** events listener */

cityDOMEvent.subscribe(
    (item) => {
        townDOM.emptyOptions;
        // setTownIsEmpty();
    },
    () => {
        // 查詢失敗等原因
        // townDOM.emptyOptions();
        // setTownIsEmpty();
        townDOM.emptyOptions;
        storeDOM.emptyOptions;
    }
);
townDOMEvent.subscribe(
    (item) => {
        setTownIsEmpty();
    },
    () => {
        // 查詢失敗等原因
        setStoreIsEmpty();
    }
);
storeDOMEvent.subscribe(item => console.log(item));