const elFormSelectWrapper = document.querySelector('.js-form__select-wrapper');
const elModes = document.querySelector('.js-header-modes');
const mode = getItem('mode') || '';

if(mode){
    document.body.classList.add('dark');
}

elModes.addEventListener('click',() => {document.body.classList.toggle('dark'); setItem('mode', document.body.classList.value);})
elFormSelectWrapper.addEventListener('click',() => elFormSelectWrapper.children[0].classList.toggle('rotate'))
