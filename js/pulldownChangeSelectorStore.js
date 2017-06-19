import { History } from "./vendor/History"; // localStorage 存取記錄使用
import Object from "./vendor/prototypePlugins"; // prototype 擴充
import { Observable } from "rxjs"; // Rx

/** 設定路徑 */
const baseUrl = '//apis.senao.com.tw/apis/senao_online/EC_S3Resource.jsp?apiKey=';
const storeUrl = baseUrl + 'APP_SenaoOnlineStore_type2.json';

/** DOM */
let storeGroupDOM = document.querySelector('.pulldownChangeSelectorStore-group');
let cityDOM = storeGroupDOM.querySelector('.pulldownChange-city');
let townDOM = storeGroupDOM.querySelector('.pulldownChange-town');
let storeDOM = storeGroupDOM.querySelector('.pulldownChange-store');

cityDOM.dataset.type = 'city';
townDOM.dataset.type = 'town';
storeDOM.dataset.type = 'store';

/** event */
const cityDOMEvent = Observable.fromEvent(cityDOM, 'change');
const townDOMEvent = Observable.fromEvent(townDOM, 'change');
const storeDOMEvent = Observable.fromEvent(storeDOM, 'change');

/** 顯示 */
let display = false;
const defaultOption = '<option value="" data-num ="">請選擇</option>';
const defaultOptionWithTown = '<option value="" data-num ="">請選縣市</option>';
const defaultOptionWithStore = '<option value="" data-num ="">請選擇地區</option>';
const defaultOptionWithEmpty = '<option value="" data-num="" data-store="" >尚無資料</option>';

/** ajax Obserable */
const stores = Observable.ajax({ method: 'get', url: storeUrl, crossDomain: true });

/** localStorage */
let history = new History();
let userStore = history.query(true);

/** TODO: 建立預設值，並且起始都是0，監聽 change 觸發替換 town, store */

// const dataQuery = (key= '') => {
//     //
// };

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

    /** 預設值: city 現有 options */
    // let cityOptions = Observable.from( cityDOM.querySelectorAll('option') );
    // cityOptions.filter( item => item.value === cityDefault ).subscribe(item => item.selected = true);

    // 注入 town, store 預設 options
    townDOM.innerHTML = defaultOption;
    storeDOM.innerHTML = defaultOption;

    // console.log(cityString);
    // console.log(userStore);
}

/** get json */
stores.map(response => response.response.stores).subscribe(
        (item) => {
            console.warn(item);
            if(item !== undefined) localStorage.setItem('stores', JSON.stringify(item));
            let store = JSON.parse( localStorage.getItem('stores') );
            renderCitySelectOption( store );
            // return store;
        },
        () => { console.log('can\'t connection'); },
        () => { console.log('complete'); }
);

/** search with API json */
const locationSearch = (stores, json) => {

};

/** events listener */

cityDOMEvent.subscribe(
    (event) => {
        let selector = event.target;
        console.log(selector.value);
        let town = JSON.parse( localStorage.getItem('stores') ).filter(item => item.name === selector.value )[0]['data'] || [];
        townDOM.generatorOption(town, selector.value);
    },
    () => {
        // 查詢失敗等原因
        townDOM.optionsEmpty();
        storeDOM.optionsEmpty();
    }
);
townDOMEvent.subscribe(
    (item) => {
        let citySelector = cityDOM.options[cityDOM.selectedIndex].value || '';
        let selector = event.target;
        let town = JSON.parse( localStorage.getItem('stores') ).filter(item => item.name === citySelector )[0]['data'] || [];
        let store = town.filter(item => item.name === selector.value )[0]['data'] || [];

        storeDOM.generatorOption(store, selector.value);
    },
    () => {
        // 查詢失敗等原因
        setStoreIsEmpty();
    }
);
storeDOMEvent.subscribe(item => console.log(item));


/** testing */
// setTimeout(function() {
//     console.log(cityDOM);
//     console.log( cityDOM.selectedOptions[0].value );
// },2000);
