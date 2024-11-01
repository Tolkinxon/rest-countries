const elFormSelectWrapper = document.querySelector('.js-form__select-wrapper');
const elModes = document.querySelector('.js-header-modes');
const mode = getItem('mode') || '';
const elCountryItemTemplate = document.querySelector('.js-country-item-template').content;
const elCountriesList = document.querySelector('.js-countries-list');
const elForm = document.querySelector('.js-form');
const elInput = document.querySelector('.js-input');
const elSelect = document.querySelector('.js-select');
const elSort = document.querySelector('.js-sort');
const elCurrentPage = document.querySelector('.js-current-page');
const elPrevNextBtns = document.querySelector('.js-prev-next-btns');

if(mode){
    document.body.classList.add('dark');
}

elSelect.value = getItem('prevRegion');
elInput.value = getItem('prevTitle');
let counter = getItem('counter');


elModes.addEventListener('click',() => {document.body.classList.toggle('dark');setItem('mode', document.body.classList.value);})
elFormSelectWrapper.addEventListener('click',() => { 
    if(getItem('mode')){elFormSelectWrapper.children[1].classList.toggle('rotate')}
    else {elFormSelectWrapper.children[0].classList.toggle('rotate')}
})

function render(arr, node, pattertTitle = '') {
    if(arr.length == 0) return alert('There is have no countries check your internet connection');

    node.innerHTML = '';
    const fragment = document.createDocumentFragment();

    arr.forEach(({flags, population, region, capital, name, name:{ common }, area}) => {
        
        const clone = elCountryItemTemplate.cloneNode(true);

        if(pattertTitle == '' || pattertTitle.source == '(?:)'){
            clone.querySelector('.js-country-name').textContent = common;
            // clone.querySelector('.js-capital').textContent = capital;
          } else {
            clone.querySelector('.js-country-name').innerHTML = common.toString().replaceAll(pattertTitle, (match) => {
              return `<mark style="color: white; background-color: gray;">${match}</mark>`
            })

            // clone.querySelector('.js-capital').innerHTML = capital.toString().replaceAll(pattertTitle, (match) => {
            //     return `<mark style="color: white; background-color: gray;">${match}</mark>`
            // })
          }
        clone.querySelector('.js-capital').textContent = capital;
        clone.querySelector('.js-flag').src = flags.png;
        clone.querySelector('.js-population').textContent = population;
        clone.querySelector('.js-region').textContent = region;
        clone.querySelector('.js-item').dataset.id = area; 
        

        fragment.appendChild(clone);
    })
    node.appendChild(fragment);
}

const sortingObj = {
    ["a-z"]: function(a, b){
      const A = a.name.common.toString().toLowerCase().charCodeAt(0);
      const B = b.name.common.toString().toLowerCase().charCodeAt(0);
      return A - B;
      },
  
    ["z-a"]: function(a, b){
      const A = a.name.common.toString().toLowerCase().charCodeAt(0);
      const B = b.name.common.toString().toLowerCase().charCodeAt(0);
      return B - A;
      },
  
    ['1-9']: function(a, b){
        return a.population - b.population
    },
  
    ['9-1']: function(a, b){
      return b.population - a.population
    }
}

let currentData = []
function pagination(list) {
    elCurrentPage.textContent = list;
    
    const slicedData = currentData.slice((list * 20) - 20, list * 20);
    return slicedData;
}

;(async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    currentData =  data;

    // const responseAlpha = await fetch('https://restcountries.com/v3.1/alpha/uz');
    // const dataAlpha = await responseAlpha.json();
    
    const page = pagination(counter);
    render(page, elCountriesList);
})()


async function region(region) {
    if(region == 'all') {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        const data = await response.json();
        currentData = data;
        const page = pagination(counter);
        return page
    }


    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const data = await response.json();
    currentData = data;
    const page = pagination(counter);
    return page
}


elForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const selectedRegion = elSelect.value;
    const searchByName = elInput.value.trim().toLowerCase();
    const sortingValue = elSort.value;

    const prevRegion = getItem('prevRegion')
    const prevTitle = getItem('prevTitle')

    if(prevRegion != selectedRegion || prevTitle != searchByName) {
        counter = 1;
        setItem('counter', counter)
    }


    setItem('prevRegion', selectedRegion)
    setItem('prevTitle', searchByName)

    const pattertTitle = RegExp(searchByName, 'gi')
    
    if(searchByName) {
        const responseName = await fetch(`https://restcountries.com/v3.1/name/${searchByName}`);
        const dataName = await responseName.json();

        // const responseCapital = await fetch(`https://restcountries.com/v3.1/capital/${searchByName}`);
        // const dataCapital = await responseCapital.json();

        currentData =  dataName;
        const page = pagination(counter);
        page.sort(sortingObj[sortingValue])
        render(page, elCountriesList, pattertTitle);
        return
    }
   

    
    const page = await region(selectedRegion); 
    console.log(page);
    
    page.sort(sortingObj[sortingValue])
    render(page, elCountriesList, pattertTitle);  
})

elCountriesList.addEventListener('dblclick', (evt) => {
    findItem(evt.target)
})

function findItem (elem) {
    if(elem.matches('.js-item')){
        const id = elem.dataset.id;
        setItem('id', id);
        window.location = '/single.html'
        return        
    }
    findItem(elem.parentElement)
}

elPrevNextBtns.addEventListener('click', (evt)=>{
    if(evt.target.matches('.js-prev')){
        counter = counter <= 1 ? 1 : --counter;
        setItem("counter", counter);
        const page = pagination(counter);
        render(page, elCountriesList);
    }

    if(evt.target.matches('.js-next')){
        const maxList = Math.ceil(currentData.length / 20)
        counter = counter >= maxList ? maxList : ++counter;
        setItem("counter", counter);
        const page = pagination(counter);
        render(page, elCountriesList);
    }
})

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    setItem('prevRegion', 'all')
    setItem('prevTitle', '')
    setItem('counter', 1);
});



