const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'cyber_security_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 saat
}));

let db;
(async () => {
    db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
    // Cədvəllərin yaradılması
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user'
        );
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `);
    console.log("Sistem və Databaza hazırdır.");
})();

// --- MIDDLEWARE (QORUMA) ---
function isAuth(req, res, next) {
    if (req.session.user) next();
    else res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') next();
    else res.status(403).send("Giriş qadağandır.");
}

// --- SƏHİFƏLƏR ---
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/profile', isAuth, (req, res) => res.sendFile(path.join(__dirname, 'views', 'profile.html')));
app.get('/admin', isAdmin, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));

// --- LOGİN & REGISTER ---
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
        res.redirect('/login');
    } catch { res.send("Xəta: Email artıq var."); }
});

// --- DİQQƏT: BU KOD SQL INJECTION-A QARŞI ZƏİFDİR ---
app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Təhlükəli sorğu: İstifadəçi daxil etdiyi mətni birbaşa string-in içinə qoyuruq
        // Bu, kiber-təhlükəsizlikdə "String Concatenation" xətası adlanır
        const query = `SELECT * FROM users WHERE email = '${identifier}' OR username = '${identifier}'`;
        
        console.log("İcra olunan sorğu:", query); // Terminalda sorğunun necə dəyişdiyini görəcəksən
        
        const user = await db.get(query); // Burada artıq ikinci parametr ([identifier]) yoxdur

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = { id: user.id, username: user.username, role: user.role };
                res.redirect('/profile'); 
            } else {
                res.send('Şifrə yanlışdır.');
            }
        } else {
            res.send('İstifadəçi tapılmadı.');
        }
    } catch (error) {
        res.status(500).send('SQL Xətası: ' + error.message);
    }
});

// --- QEYDLƏR ÜÇÜN APİ ---
app.get('/api/my-notes', isAuth, async (req, res) => {
    const notes = await db.all('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id]);
    res.json(notes);
});

app.post('/api/notes', isAuth, async (req, res) => {
    const { title, content } = req.body;
    await db.run('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', [req.session.user.id, title, content]);
    res.redirect('/profile');
});

// --- ADMİN APİ ---
app.get('/api/users', isAdmin, async (req, res) => {
    const users = await db.all('SELECT id, username, email, role FROM users');
    res.json(users);
});

app.delete('/api/users/:id', isAdmin, async (req, res) => {
    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.sendStatus(200);
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
// 1. İstifadəçinin Rolunu Dəyişmək (Admin et və ya User et)
app.post('/api/users/change-role/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;
    await db.run('UPDATE users SET role = ? WHERE id = ?', [newRole, id]);
    res.sendStatus(200);
});

// 2. Sistem Statistikası (Ümumi user və qeyd sayı)
app.get('/api/admin/stats', isAdmin, async (req, res) => {
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const noteCount = await db.get('SELECT COUNT(*) as count FROM notes');
    res.json({ users: userCount.count, notes: noteCount.count });
});

// 3. Bütün qeydləri görmək (Admin hər kəsin nə yazdığına baxa bilsin)
app.get('/api/admin/all-notes', isAdmin, async (req, res) => {
    const allNotes = await db.all(`
        SELECT notes.*, users.username 
        FROM notes 
        JOIN users ON notes.user_id = users.id 
        ORDER BY created_at DESC
    `);
    res.json(allNotes);
});
// Bütün istifadəçilərin qeydlərini gətir (JOIN vasitəsilə kimin yazdığını da görürük)
app.get('/api/admin/all-notes', isAdmin, async (req, res) => {
    const allNotes = await db.all(`
        SELECT notes.*, users.username 
        FROM notes 
        JOIN users ON notes.user_id = users.id 
        ORDER BY created_at DESC
    `);
    res.json(allNotes);
});

// Admin tərəfindən hər hansı bir qeydin silinməsi
app.delete('/api/admin/notes/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    await db.run('DELETE FROM notes WHERE id = ?', [id]);
    res.sendStatus(200);
});

// Özünü admin etmək üçün: localhost:3000/make-me-admin
app.get('/make-me-admin', async (req, res) => {
    await db.run("UPDATE users SET role = 'admin'");
    res.send("Hər kəs Admin edildi!");
});
app.get('/api/check-auth', isAuth, (req, res) => {
    res.json(req.session.user);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
