const elFormSelectWrapper = document.querySelector('.js-form__select-wrapper');
const elModes = document.querySelector('.js-header-modes');
const mode = getItem('mode') || '';
const elCountryItemTemplate = document.querySelector('.js-country-item-template').content;
const elCountriesList = document.querySelector('.js-countries-list');
const elForm = document.querySelector('.js-form');
const elInput = document.querySelector('.js-input');
const elSelect = document.querySelector('.js-select');
const elCurrentPage = document.querySelector('.js-current-page');
const elPrevNextBtns = document.querySelector('.js-prev-next-btns');

if(mode){
    document.body.classList.add('dark');
}

elModes.addEventListener('click',() => {document.body.classList.toggle('dark');setItem('mode', document.body.classList.value);})
elFormSelectWrapper.addEventListener('click',() => { 
    if(getItem('mode')){elFormSelectWrapper.children[1].classList.toggle('rotate')}
    else {elFormSelectWrapper.children[0].classList.toggle('rotate')}
})

function render(arr, node) {
    if(arr.length == 0) return alert('There is have no countries check your internet connection');

    node.innerHTML = '';
    const fragment = document.createDocumentFragment();

    arr.forEach(({flags, population, region, capital, name, name:{ common }}) => {
        
        const clone = elCountryItemTemplate.cloneNode(true);

        clone.querySelector('.js-flag').src = flags.png;
        clone.querySelector('.js-country-name').textContent = common;
        clone.querySelector('.js-population').textContent = population;
        clone.querySelector('.js-region').textContent = region;
        clone.querySelector('.js-capital').textContent = capital;

        fragment.appendChild(clone);
    })
    node.appendChild(fragment);
}
 
let counter = 1;
let currentData = []
function pagination(list) {
    elCurrentPage.textContent = list;
    return currentData.slice((list * 20) - 20, list * 20)
}

;(async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    currentData =  data;
    counter = 1;
    const page = pagination(1);
    render(page, elCountriesList);
})()


async function region(region) {
    if(region == 'all') {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        currentData = data;
        counter = 1;
        const page = pagination(1);
        render(page, elCountriesList);
        return
    }


    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const data = await response.json();
    currentData = data;
    counter = 1;
    const page = pagination(1);
    render(page, elCountriesList);
}


elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const selectedRegion = elSelect.value;
    const searchByName = elInput.value;

    region(selectedRegion);   
})

elPrevNextBtns.addEventListener('click', (evt)=>{
    if(evt.target.matches('.js-prev')){
        counter = counter == 1 ? 1 : --counter;
        const page = pagination(counter);
        render(page, elCountriesList);
    }

    if(evt.target.matches('.js-next')){
        const maxList = Math.ceil(currentData.length / 20)
        counter = counter == maxList ? maxList : ++counter;
        const page = pagination(counter);
        render(page, elCountriesList);
    }
})

