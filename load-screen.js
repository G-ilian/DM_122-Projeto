import { installData } from "./install-data/index.js";
import getStarwarsDatabase from "./helpers/database.js";

async function isDataInstalled(){
    const db = await getStarwarsDatabase();
    const charactersCount = await db.starWars.count();
    return charactersCount > 0;
}
async function updateProgressBar(progressBar,current,total){
    const progressPercentage = Math.floor((current / total) * 100);
    progressBar.value = progressPercentage;
}

async function loadData() {
    const progressBar = document.querySelector('#load-screen progress');
    const totalCharacters = 83;
    let installedCharacters = 0;

    function updateInstalledCharacters() {
        installedCharacters++;
        updateProgressBar(progressBar, installedCharacters, totalCharacters);

        if (installedCharacters >= totalCharacters) {
            document.getElementById('load-screen').style.display = 'none';
            document.querySelector('main').style.display = 'block';
        }
    }

    // Start the install process
    const installProcess = installData();

    const checkInterval = setInterval(async () => {
        const db = await getStarwarsDatabase();
        const currentCount = await db.starWars.count();

        if (currentCount > installedCharacters) {
            installedCharacters = currentCount;
            updateInstalledCharacters();
        }

        if (installedCharacters >= totalCharacters) {
            clearInterval(checkInterval);
        }
    }, 100); 

    await installProcess;

    if (installedCharacters >= totalCharacters) {
        document.getElementById('load-screen').style.display = 'none';
        document.querySelector('main').style.display = 'block';
    }
}


window.addEventListener('load', async function() {
    const dataAlreadyInstalled = await isDataInstalled();
    if (dataAlreadyInstalled) {
        // Se os dados já estiverem instalados, mostre o conteúdo principal imediatamente
        document.getElementById('load-screen').style.display = 'none';
        document.querySelector('main').style.display = 'block';
    } else {
        loadData();
    }
});