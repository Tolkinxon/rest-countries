const elFormSelectWrapper = document.querySelector('.js-form__select-wrapper');
const elModes = document.querySelector('.js-header-modes');
const mode = getItem('mode') || '';
const elCountryItemTemplate = document.querySelector('.js-country-item-template').content;
const elCountriesList = document.querySelector('.js-countries-list');
const elForm = document.querySelector('.js-form');
const elInput = document.querySelector('.js-input');
const elSelect = document.querySelector('.js-select');

if(mode){
    document.body.classList.add('dark');
}

elModes.addEventListener('click',() => {document.body.classList.toggle('dark'); setItem('mode', document.body.classList.value);})
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

async function region(region) {
    if(region == 'all') {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        render(data, elCountriesList);
        return
    }


    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const data = await response.json();
    render(data, elCountriesList);
}

;(async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    // const arr = [];
    // data.forEach(({region}) => {
    //     if(!arr.includes(region)){
    //         arr.push(region);
    //     }
    // })

    render(data, elCountriesList);
})()



elForm.addEventListener('change', (evt) => {
    evt.preventDefault();

    const selectedRegion = elSelect.value;
    const searchByName = elInput.value;


    region(selectedRegion);   
})