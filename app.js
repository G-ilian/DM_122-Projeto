import getStarwarsDatabase from './helpers/database.js';

async function getCharacterData(id){
    const db = await getStarwarsDatabase();
    console.log(db.starWars)
    let characterData = await db.starWars.get(id);

    if(characterData)
        return characterData;
    // Criar a lógica para esse caso aqui
}
function fillCard(characterData){
    console.log(characterData);
    // const characterName = document.querySelector('.characterName');
    // const characterHeight = document.querySelector('.characterHeight');
    // const characterGender = document.querySelector('.characterGender');
    // const characterHomeworld = document.querySelector('.characterHomeworld');
    // const characterFilms = document.querySelector('.characterFilms');

    // characterName.textContent = characterData.name;
    // characterHeight.textContent = characterData.height;
    // characterGender.textContent = characterData.gender;
    // characterHomeworld.textContent = characterData.homeworld;
    // characterFilms.innerHTML = '';
    // characterData.films.forEach(film => {
    //     const filmElement = document.createElement('li');
    //     filmElement.textContent = film;
    //     characterFilms.appendChild(filmElement);
    // });

    
}

const linkToInstall = document.querySelector("a[href='#']");
linkToInstall.addEventListener('click', async () => {
    console.log("Installing data")
    const { installData } = await import('./install-data/index.js');
    alert('Installing data');
    // button.disabled = true;
    // button.setAttribute('aria-busy', true);
    // await installData();
    // button.removeAttribute('aria-busy');
});

function setLoading(isLoading){
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.setAttribute('aria-busy', isLoading);
    submitButton.disabled = isLoading;
}


const form = document.querySelector('form');


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLoading(true);
    const characterId = form.elements['characterId'].value;
    console.log(`Fetching data for character ${characterId}`);
    const characterData = await getCharacterData(characterId);
    fillCard(characterData);
    setLoading(false);
});