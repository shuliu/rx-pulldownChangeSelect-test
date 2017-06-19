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
const defaultOptionWithCity = '<option value="" data-num ="">請選擇縣市</option>';
const defaultOptionWithTown = '<option value="" data-num ="">請選擇地區</option>';
const defaultOptionWithStore = '<option value="" data-num ="">請選擇門市</option>';
const defaultOptionWithEmpty = '<option value="" data-num="" data-store="" >尚無資料</option>';

/** ajax Obserable */
const stores = Observable.ajax({ method: 'get', url: storeUrl, crossDomain: true });

/** localStorage */
let history = new History();
let userStore = history.query(true);

/** 建立 select options */
const renderCitySelectOption = (suggestArr = []) => {
    let cityString, townString, storeString;
    cityString = townString = storeString = '';
    
    if(suggestArr.length > 0) {
        cityString = suggestArr.map( (item, index) => {
            return '<option value="'+ item.name +'" data-num="'+ index +'" >'+ item.name +'</option>';
        }).join('');
    }

    let townsData = optionSearch(suggestArr, {city: userStore.city})
        .map( (item, index) => {
            return '<option value="'+ item.name +'" data-num="'+ index +'" >'+ item.name +'</option>';
    }).join('');

    let storesData = optionSearch(suggestArr, {city: userStore.city, town: userStore.town})
        .map( (item, index) => {
            return '<option value="'+ item.storeName +'" data-num="'+ index +'" >'+ item.storeName +'</option>';
    }).join('');

    // insert city options
    cityDOM.innerHTML = defaultOption + cityString;
    townDOM.innerHTML = defaultOption + townsData;
    storeDOM.innerHTML = defaultOption + storesData;

    /** city 預設值 */
    let cityDefault = userStore.city || cityDOM.dataset.val || '';
    let townDefault = userStore.town || townDOM.dataset.val || '';
    let storeDefault = userStore.store || storeDOM.dataset.val || '';

    /** 預設值: 設定現有 options selector */
    let cityOptions = Observable.from( cityDOM.querySelectorAll('option') );
    cityOptions.filter( item => item.value === cityDefault ).subscribe(item => item.selected = true);

    let townOptions = Observable.from( townDOM.querySelectorAll('option') );
    townOptions.filter( item => item.value === townDefault ).subscribe(item => item.selected = true);

    let storeOptions = Observable.from( storeDOM.querySelectorAll('option') );
    storeOptions.filter( item => item.value === storeDefault ).subscribe(item => item.selected = true);

}

/** get json */
stores.map(response => response.response.stores).subscribe(
        (item) => {
            if(item !== undefined) localStorage.setItem('stores', JSON.stringify(item));
            let store = JSON.parse( localStorage.getItem('stores') );
            renderCitySelectOption( store );
            // return store;
        },
        () => { console.log('can\'t connection'); }
);

/**
 * search with API json
 * 縣市取鄉鎮，鄉鎮取門市，門市取單一門市詳細資料
 * @param JSON store API json data
 * @param JSON user {"city": "", "town": "", "store": ""}
 * @return JSON data
 * */
const optionSearch = (stores, user) => {
    if( user.city === undefined || user.city === '' ) {
        return stores;
    }
    let townData = stores.filter(item => item.name === user.city)[0]['data'] || [];
    if( user.town === undefined || user.town === '' ) {
        return townData;
    }
    let storeData = townData.filter(item => item.name === user.town)[0]['data'] || [];
    if( user.store === undefined || user.store === '' ) {
        return storeData;
    }
    let oneStore = storeData.filter(item => item.storeName === user.store) || [];
    return oneStore;
};

/** events listener */

/** city selector event */
cityDOMEvent.subscribe(
    (event) => {
        let selector = event.target;
        let town = JSON.parse( localStorage.getItem('stores') ).filter(item => item.name === selector.value )[0]['data'] || [];
        townDOM.generatorOption(town, selector.value);
        storeDOM.optionsClear();
    },
    () => {
        // 查詢失敗等原因
        townDOM.optionsEmpty();
        storeDOM.optionsEmpty();
    }
);

/** town select event */
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

/** store select event */
// storeDOMEvent.subscribe(item => console.log(item));

