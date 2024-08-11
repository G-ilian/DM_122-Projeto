import getStarwarsDatabase from "./helpers/database.js";
import { starWarsMapper } from "./install-data/index.js";
import { registerServiceWorker } from './helpers/install-sw.js';

let currentCharacterId = null;

async function getCharacterData(id) {
  const db = await getStarwarsDatabase();
  let characterData = await db.starWars.get(parseInt(id));

  if (characterData) return characterData;
  const {getFromNetwork} = await import('./install-data/index.js');
  characterData = await getFromNetwork(id);
  return characterData;
}

export async function editCharacter() {
  console.log("edit");
  const dialog = document.querySelector("dialog");
  const form = dialog.querySelector("form");
  const db = await getStarwarsDatabase();
  console.log('Id do personagem:',currentCharacterId);
  const characterData = await db.starWars.get(currentCharacterId);
  form.elements["first_name"].value = characterData.name;
  form.elements["height"].value = characterData.height;
  form.elements["homeworld"].value = characterData.homeworld;

  Array.from(form.elements["gender"].options).forEach(option => {
    if(characterData.gender.includes(option.text)){
      option.selected = true;
    }else{
      option.selected = false;
    }
  });
  Array.from(form.elements["films"].options).forEach(option => {
    if (characterData.films.includes(option.text)) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });
  dialog.showModal();

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.querySelector('#confirm').addEventListener('click', () => handleEdit(dialog,form));

  dialog.querySelector("#cancel").addEventListener("click", () => {handleClose(dialog);});
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

export async function addCharacter() {
    console.log('Add character');
    const dialog = document.querySelector("dialog");
    const form = dialog.querySelector("form");
    dialog.showModal();

    const confirmButton = dialog.querySelector("#confirm");
    const cancelButton = dialog.querySelector("#cancel");
    confirmButton.removeEventListener("click", handleAdd);
    cancelButton.removeEventListener("click", handleClose);

    // Adicionar novos event listeners
    confirmButton.addEventListener("click", () => handleAdd(dialog, form));
    cancelButton.addEventListener("click", () => handleClose(dialog));
}

async function handleEdit(dialog,form) {
    const db = await getStarwarsDatabase();
    const name= form.elements["first_name"].value;
    const height= form.elements["height"].value;
    const homeworld= form.elements["homeworld"].value;
    const gender = form.elements["gender"].options[form.elements["gender"].selectedIndex].text;
    const films = Array.from(form.elements["films"].selectedOptions).map(option => option.text);
    const id = currentCharacterId
    const data = starWarsMapper({name, height, gender, homeworld, films});

    await db.starWars.update(id, data);

    const characterData = await db.starWars.get(currentCharacterId);
    fillCard(characterData);
    dialog.close(); 
}

async function handleClose(dialog){
    dialog.close();
}

async function handleAdd(dialog, form) {
    const db = await getStarwarsDatabase();
    const name = form.elements["first_name"].value;
    const height = form.elements["height"].value;
    const homeworld = form.elements["homeworld"].value;
    const gender = form.elements["gender"].options[form.elements["gender"].selectedIndex].text;
    const films = Array.from(form.elements["films"].selectedOptions).map(option => option.text);
    const data = starWarsMapper({name, height, gender, homeworld, films});

    await db.starWars.add(data);
    dialog.close();
    form.reset();
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
  const characterCard = document.getElementById("characterCard");

  try{
    const characterData = await getCharacterData(characterId);
    fillCard(characterData);
  }catch(error){
    console.error(error);
    alert("Personagem não encontrado");
  }finally{
    setLoading(false);
  }
});

registerServiceWorker();
// TODO : Colocar combo box para selecionar os filmes e gender