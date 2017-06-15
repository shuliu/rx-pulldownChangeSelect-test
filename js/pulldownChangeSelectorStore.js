import { Observable } from "rxjs";

/** default */
const defaultStore = {"city": "", "town": "", "store": ""};

/** 設定路徑 */
const baseUrl = '//apis.senao.com.tw/apis/senao_online/EC_S3Resource.jsp?apiKey=';
const storeUrl = baseUrl + 'APP_SenaoOnlineStore_type2.json';

/** DOM */
let storeGroupDOM = document.querySelector('.pulldownChangeSelectorStore-group');
let cityDOM = storeGroupDOM.querySelector('.pulldownChange-city');
let townDOM = storeGroupDOM.querySelector('.pulldownChange-town');
let storeDOM = storeGroupDOM.querySelector('.pulldownChange-store');

/** 顯示 */
let display = false;

/** ajax Obserable */
let stores = Observable.ajax({ method: 'get', url: storeUrl, crossDomain: true });
let userStore = JSON.parse(localStorage.getItem('defaultStore')) || defaultStore;

/** TODO: 建立預設值，並且起始都是0，監聽 change 觸發替換 town, store */

/** 建立 select options */
const renderCitySelectOption = (suggestArr = []) => {
    let cityString, townString, storeString;
    cityString = townString = storeString = '<option value="" data-num="" data-store="" >尚無資料</option>';
    if(suggestArr.length > 0) {
        cityString = suggestArr.map( (item, index) => {
            return '<option value="'+ item.name +'" data-num="'+ index +'" >'+ item.name +'</option>';
        }).join('');
    }
    cityDOM.innerHTML = cityString;

    /** city 預設值 */
    let cityDefault = userStore.city || cityDOM.dataset.val || '';

    /** city 現有 options */
    let cityOptions = Observable.from( cityDOM.querySelectorAll('option') );
    cityOptions.filter( item => item.value === cityDefault ).subscribe(item => item.selected = true);

    // townDOM.innerHTML = townString;
    // storeDOM.innerHTML = storeString;

    console.log(cityString);
    console.log(userStore);
}
/** get json */

stores.map(response => response.response.stores)
    .subscribe(
        (item) => {
            console.info(item);
            if(item !== undefined) localStorage.setItem('stores', JSON.stringify(item));
            let store = JSON.parse( localStorage.getItem('stores') );
            renderCitySelectOption( store );
            // return store;
        },
        () => { console.log('can\'t connection'); },
        () => { console.log('complete'); }
);


