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

    // Continuar verificando o progresso
    const checkInterval = setInterval(async () => {
        // Verifique o número de personagens instalados atualmente
        const db = await getStarwarsDatabase();
        const currentCount = await db.starWars.count();

        // Se o número mudou, atualize a barra de progresso
        if (currentCount > installedCharacters) {
            installedCharacters = currentCount;
            updateInstalledCharacters();
        }

        // Se a instalação estiver completa, pare o intervalo
        if (installedCharacters >= totalCharacters) {
            clearInterval(checkInterval);
        }
    }, 100); // Verifica a cada 100ms

    // Aguarde a conclusão do processo de instalação
    await installProcess;

    // Verifique novamente se a instalação foi concluída
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