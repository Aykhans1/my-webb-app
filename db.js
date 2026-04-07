const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // İstifadəçilər cədvəlini yaradırıq (yoxdursa)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user'
        )
    `);

    return db;
}

module.exports = setupDB;