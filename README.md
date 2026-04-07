CyberNotes: Security Lab & Note Management System
Layihə Haqqında
CyberNotes, müasir veb tətbiqlərdə rast gəlinən təhlükəsizlik boşluqlarını və onların proqram təminatı səviyyəsində həlli yollarını göstərmək üçün hazırlanmış tədris layihəsidir. Bu sistem istifadəçilərə şəxsi qeydlərini saxlamağa imkan verməklə yanaşı, daxilində bilərəkdən yerləşdirilmiş SQL Injection boşluğu vasitəsilə kiber-təhlükəsizlik laboratoriyası funksiyasını yerinə yetirir.

Əsas Texniki İmkanlar
Dual-Authentication: İstifadəçilər həm e-poçt ünvanı, həm də istifadəçi adı (username) ilə sistemə daxil ola bilərlər.

Şəxsi Qeyd Sistemi (CRUD): Hər bir istifadəçi üçün fərdi, digər istifadəçilərdən izolyasiya olunmuş qeyd yaratma və oxuma imkanı.

Admin Dashboard: Sistem statistikası (istifadəçi və qeyd sayı), istifadəçi bazasının idarə edilməsi (silmə və rol dəyişmə) və bütün sistem qeydlərinin monitorinqi.

Təhlükəsizlik: Şifrələrin Bcrypt ilə hash olunması və sessiyaların avtorizasiya qoruması.

Təhlükəsizlik Laboratoriyası: SQL Injection (Vulnerability)
Bu layihənin əsas xüsusiyyəti, daxilindəki login modulunun SQL Injection hücumlarına qarşı zəif (vulnerable) formada konfiqurasiya edilə bilməsidir.

Zəiflik Ssenarisi
Sistemdə istifadəçi məlumatları SQL sorğusuna birbaşa "String Concatenation" metodu ilə daxil edildiyi üçün 1=1 tipli tautologiya hücumları mümkündür.

Hücum Nümunəsi:
Login sahəsinə aşağıdakı payload daxil edildikdə:
' OR 1=1 --

Arxa fonda icra olunan SQL sorğusu:
SELECT * FROM users WHERE email = '' OR 1=1 --' OR username = ...

Bu zaman verilənlər bazası 1=1 şərtini hər zaman doğru (true) qəbul edir və hücumçu şifrəni bilmədən bazadakı ilk istifadəçi (adətən sistem administratoru) kimi giriş əldə edir.

Həll Metodologiyası (Remediation)
Layihə daxilində bu boşluğun qarşısını almaq üçün Prepared Statements (Parametrləşdirilmiş Sorğular) tətbiq olunmuşdur. Bu metodda istifadəçi girişi SQL əmri kimi deyil, yalnız verilən (data) kimi qəbul edilir və SQL mühərriki tərəfindən zərərsizləşdirilir.

Texnologiya Stack-i
Server-side: Node.js & Express.js

Verilənlər Bazası: SQLite3 (Fayl əsaslı)

Kriptoqrafiya: BcryptJS

Sessiya İdarəetməsi: Express-Session

Frontend: Modern CSS Grid/Flexbox, Vanilla JavaScript

Quraşdırılma Qaydaları
Layihəni lokal mühitdə işə salmaq üçün aşağıdakı addımları izləyin:

Repository-ni klonlayın:

Bash
git clone https://github.com/istifadeci_adiniz/cyber-notes.git
Lazımi kitabxanaları yükləyin:

Bash
npm install express bcryptjs sqlite3 sqlite express-session
Tətbiqi başladın:

Bash
node app.js
Brauzerdə daxil olun:
http://localhost:3000

Layihə Strukturu
app.js - Serverin əsas məntiqi, API marşrutları və təhlükəsizlik konfiqurasiyaları.

views/ - Login, Register, Profile və Admin Dashboard səhifələri.

public/ - Saytın vizual üslubunu təyin edən CSS faylları.

database.sqlite - Bütün məlumatların saxlandığı lokal verilənlər bazası.

// --- TƏHLÜKƏSİZ LOGİN (SQL INJECTION HƏLLİ) ---
        const user = await db.get('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier]);


 

Xəbərdarlıq
Bu layihə yalnız təhsil və laboratoriya testləri üçün nəzərdə tutulmuşdur. Layihə daxilindəki zəif kod nümunələri kiber-təhlükəsizlik boşluqlarını nümayiş etdirmək məqsədi daşıyır. Bu kodların real istehsalat mühitində (production) istifadə edilməsi qətiyyən tövsiyə olunmur. Layihə müəllifi qeyri-etik məqsədlər üçün istifadədən məsuliyyət daşımır.
