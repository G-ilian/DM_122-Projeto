import getStarwarsDatabase from "./helpers/database.js";
let currentCharacterId = null;

async function getCharacterData(id) {
  const db = await getStarwarsDatabase();
  let characterData = await db.starWars.get(parseInt(id));

  if (characterData) return characterData;
  // Criar a lógica para esse caso aqui
}

export async function editCharacter() {
  console.log("edit");
  const dialog = document.querySelector("dialog");
  const form = dialog.querySelector("form");
  const db = await getStarwarsDatabase();
  const characterData = await db.starWars.get(currentCharacterId);
  form.elements["first_name"].value = characterData.name;
  form.elements["height"].value = characterData.height;
  form.elements["homeworld"].value = characterData.homeworld;

  dialog.showModal();

  // Configura o evento de clicar fora do modal para fechar
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // Configura os botões de confirmar e cancelar
  dialog.querySelector("#confirm").addEventListener("click", async () => {
    console.log('confirm'); 
    const name = form.elements["first_name"].value;
    const height = form.elements["height"].value;
    const homeworld = form.elements["homeworld"].value;

    await db.starWars.update(currentCharacterId, { name, height, homeworld });

    // // Atualize o card com as novas informações
    const characterData = await db.starWars.get(currentCharacterId);
    fillCard(characterData);

    dialog.close(); // Fecha o modal
  });

  dialog.querySelector("#cancel").addEventListener("click", () => {
    dialog.close();
  });
}

export async function removeCharacter() {
  if (confirm("Are you sure you want to delete this character?")) {
    const db = await getStarwarsDatabase();
    await db.starWars.delete(currentCharacterId);
    alert("Character removed successfully.");
    // Limpar o card e o ID do personagem atual
    document.getElementById("characterCard").style.display = "none";
    currentCharacterId = null;
  }
}
function fillCard(characterData) {
  const characterCard = document.getElementById("characterCard");

  if (!characterData) {
    alert("Personagem não encontrado");
    characterCard.style.display = "none";
    return;
  }
  const characterName = document.querySelector("#characterName");
  const characterHeight = document.querySelector("#characterHeight");
  const characterGender = document.querySelector("#characterGender");
  const characterHomeworld = document.querySelector("#characterHomeworld");
  const characterFilms = document.querySelector("#characterFilms");

  characterName.textContent = characterData.name;
  characterHeight.textContent = characterData.height;
  characterGender.textContent = characterData.gender;
  characterHomeworld.textContent = characterData.homeworld;
  characterFilms.innerHTML = "";
  characterData.films.forEach((film) => {
    const filmElement = document.createElement("li");
    filmElement.textContent = film;
    characterFilms.appendChild(filmElement);
  });

  characterCard.style.display = "block";
  currentCharacterId = characterData.id;
}

function setLoading(isLoading) {
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.setAttribute("aria-busy", isLoading);
  submitButton.disabled = isLoading;
}

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading(true);
  const characterId = form.elements["characterId"].value.trim();
  console.log(`Fetching data for character ${characterId}`);
  const characterCard = document.getElementById("characterCard");

  console.log(characterId);
  if (characterId === "") {
    characterCard.style.display = "none";
    setLoading(false);
    return;
  }
  const characterData = await getCharacterData(characterId);
  fillCard(characterData);
  setLoading(false);
});
