# CyberNotes - Node.js Based Secure Note Portal

## Layihə Haqqında
CyberNotes, istifadəçilərin şəxsi və təhlükəsiz qeydlərini saxlaya biləcəyi, Node.js və Express.js freymvorku üzərində qurulmuş tam funksional bir veb tətbiqdir. Layihə həm istifadəçi interfeysi, həm də geniş imkanlara malik idarəetmə paneli (Admin Dashboard) ilə təmin olunmuşdur. Sistem məlumatların təhlükəsizliyi və istifadəçi təcrübəsinin optimallaşdırılması prinsipləri əsasında hazırlanmışdır.

## Əsas Funksiyalar
Layihə aşağıdakı əsas texniki imkanlara malikdir:

### 1. Dual-Authentication Sistemi
İstifadəçilər sistemə daxil olarkən həm qeydiyyatdan keçdikləri e-poçt ünvanından, həm də istifadəçi adlarından (username) istifadə edə bilərlər. Bu, giriş prosesini daha çevik və rahat edir.

### 2. Şəxsi Qeyd İdarəetməsi (CRUD)
Hər bir istifadəçi öz profilinə daxil olaraq yeni qeydlər yarada, mövcud qeydlərini görə bilər. Məlumat bazası arxitekturası elə qurulmuşdur ki, hər bir istifadəçi yalnız özünə aid olan məlumatlara çıxış əldə edir.

### 3. Təhlükəsizlik və Məlumatların Qorunması
* **Password Hashing:** İstifadəçi şifrələri verilənlər bazasında açıq şəkildə saxlanılmır. Bcrypt alqoritmi vasitəsilə mürəkkəb şifrələmə (hashing) prosesindən keçirilir.
* **Session Management:** İstifadəçi seansları express-session kitabxanası ilə idarə olunur, bu da icazəsiz girişlərin qarşısını alır.
* **Input Validation:** Qeydiyyat zamanı istifadəçi adlarında "@" kimi xüsusi işarələrin istifadəsinə məhdudiyyət qoyulmuşdur ki, bu da e-poçt və istifadəçi adı arasındakı fərqi qəti şəkildə qoruyur.

### 4. Admin Dashboard (İdarəetmə Paneli)
Admin statusuna malik istifadəçilər üçün xüsusi dizayn edilmiş panel vasitəsilə aşağıdakı əməliyyatlar icra oluna bilər:
* Sistemdəki ümumi istifadəçi və qeyd sayına real zamanlı nəzarət.
* İstifadəçilərin siyahısının görüntülənməsi, silinməsi və rollarının (User/Admin) dəyişdirilməsi.
* Bütün sistem üzrə yazılan qeydlərin monitorinqi və moderatorluq edilməsi.

## İstifadə Olunan Texnologiyalar
Layihə modern və performanslı texnologiya stack-i üzərində qurulub:
* **Backend:** Node.js, Express.js
* **Database:** SQLite3 (Fayl əsaslı, sürətli və konfiqurasiya tələb etməyən baza)
* **Authentication:** BcryptJS (Şifrələmə), Express-Session (Seans idarəetməsi)
* **Frontend:** HTML5, CSS3 (Modern və təmiz dizayn), JavaScript (Fetch API)

## Quraşdırılma Qaydaları
Layihəni lokal mühitdə işə salmaq üçün aşağıdakı addımları izləyin:

1. Layihəni klonlayın:
   ```bash
   git clone https://github.com/istifadeci_adiniz/cyber-notes.git
   ```

2. Layihə qovluğuna daxil olun:
   ```bash
   cd cyber-notes
   ```

3. Lazımi asılılıqları (dependencies) yükləyin:
   ```bash
   npm install
   ```

4. Serveri işə salın:
   ```bash
   node app.js
   ```

5. Brauzerdə daxil olun:
   `http://localhost:3000`

## İlk Admin Hesabının Yaradılması
Sistemdə ilk dəfə admin statusu qazanmaq üçün:
1. `/register` səhifəsindən normal qeydiyyatdan keçin.
2. Brauzerdə bir dəfəlik `http://localhost:3000/make-me-admin` ünvanına daxil olun.
3. Bu əməliyyatdan sonra hesabınız admin statusuna yüksələcək və siz `/admin` panelinə daxil ola biləcəksiniz.

## Fayl Strukturu
* `app.js`: Serverin əsas məntiqi və API marşrutları.
* `views/`: HTML səhifələri (Login, Register, Profile, Admin).
* `public/`: CSS üslubları və statik fayllar.
* `database.sqlite`: Bütün məlumatların saxlandığı verilənlər bazası faylı.

## Müəllif və Lisenziya
Bu layihə təhsil və praktika məqsədilə hazırlanmışdır. Kodların inkişaf etdirilməsi və şəxsi məqsədlər üçün istifadəsi sərbəstdir. Layihə ilə bağlı hər hansı təklif və ya sualınız olarsa, GitHub üzərindən əlaqə saxlaya bilərsiniz.
