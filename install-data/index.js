export async function fetchCharactersData(id){
    await new Promise(resolve => setTimeout(resolve, 400));

    const response = await fetch(`https://swapi.dev/api/people/${id}/`);
    const character = await response.json();

    const characterDetails = {
        id: id,
        name: character.name,
        height: character.height,
        gender: character.gender,
    };

    // Fetch the homeworld data
    if (character.homeworld) {
        const homeworldResponse = await fetch(character.homeworld);
        const homeworldData = await homeworldResponse.json();
        characterDetails.homeworld = homeworldData.name; // Replace URL with the actual name
    }

    // Fetch film titles
    const filmPromises = character.films.map(filmUrl => fetch(filmUrl).then(res => res.json()));
    const films = await Promise.all(filmPromises);
    characterDetails.films = films.map(film => film.title); // Replace URLs with film titles

    return characterDetails;
}

export function starWarsMapper(characterData){
    return {
        id: characterData.id,
        name: characterData.name,
        height: characterData.height,
        gender: characterData.gender,
        homeworld: characterData.homeworld || 'Unknown',
        films: characterData.films || []
    }
}

async function getDB(){
    const {default: getStarwarsDatabase}= await import('../helpers/database.js');
    return await getStarwarsDatabase();
}

export async function installData(){
    // Get data from the api for 50 characters
    const promiseList = await Promise.allSettled(
        Array.from({length: 83}, (_, index) => fetchCharactersData(index + 1))
    );
    const starWarsListData = promiseList.filter(promise => promise.status === 'fulfilled' && promise.value!==null).map(promise => promise.value);
    const starWarsList = starWarsListData.map(starWarsMapper);

    // Get the database
    const db = await getDB();

    return db.starWars.bulkAdd(starWarsList);


}