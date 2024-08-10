export async function fetchCharactersData(url){
    await new Promise(resolve => setTimeout(resolve, 400));

    const response = await fetch(url);
    const character = await response.json();

    const characterDetails = {
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