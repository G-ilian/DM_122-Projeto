export default async function getStarwarsDatabase(){
    const {default: Dexie} = await import('https://cdn.jsdelivr.net/npm/dexie@4.0.8/+esm');
    const db = new Dexie('starWarsDatabase');
    
    db.version(1).stores({
        starWars: '++id,name',
    });
    return db;
}