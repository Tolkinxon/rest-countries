const mode = getItem('mode') || '';
const elModes = document.querySelector('.js-header-modes');

const elImg = document.querySelector('.js-country-info-img');
const elName = document.querySelector('.js-country-name');
const elNativeName = document.querySelector('.js-native-name');
const elPopulation = document.querySelector('.js-population');
const elRegion = document.querySelector('.js-region');
const elSubRegion = document.querySelector('.js-sub-region');
const elCapital = document.querySelector('.js-capital');
const elDomain = document.querySelector('.js-domain');
const elCurrency = document.querySelector('.js-currency');
const elLanguage = document.querySelector('.js-language');
const elBorderCountry = document.querySelector('.js-border-coutry');

if(mode){
    document.body.classList.add('dark');
}

elModes.addEventListener('click',() => {document.body.classList.toggle('dark');setItem('mode', document.body.classList.value);})

const id = getItem('id');
let currentCoutry = {};
;(async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    currentCoutry = data.find(item => item.area == id);

    const {flags, population, region, capital, name, name:{ common }, area} = currentCoutry;
    elImg.src = flags.png;
    elName.textContent = common;

    elPopulation,textContent = population;
    elRegion.textContent = region;
    elCapital.textContent = capital;
})()
