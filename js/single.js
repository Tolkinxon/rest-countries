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
;(async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    const currentCoutry = data.find(item => item.area == id);

    const {flags, population, region, capital, name, name:{ common }, area, currencies, tld, languages, borders, subregion} = currentCoutry;
    elImg.src = flags.png;
    elName.textContent = common;
    elNativeName.textContent = name['official'];
    elPopulation,textContent = population;
    elRegion.textContent = region;
    elCapital.textContent = capital;
    elDomain.textContent = tld[0];
    elCurrency.textContent = Object.values(currencies)[0].name;
    elLanguage.textContent = Object.values(languages);

    elBorderCountry.innerHTML = '<p>Border Countries:</p>';
    
    borders?.forEach(element => {
        const i = document.createElement('i');
        i.textContent = element;
        elBorderCountry.append(i);
    });

    elSubRegion.textContent = subregion;
    
})()
