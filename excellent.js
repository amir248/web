//blozhik 3700
const express = require('express');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const dbConfig = require('./custom_modules/dbConfig');
const app = express();
const path = require("path");
const session = require('express-session');
const multer = require('multer');
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { getMaxListeners } = require('events');
const cron = require("node-cron");
const cors = require('cors');


app.set("trust proxy", 1); // доверяем первому прокси
// Ограничитель: максимум 5 запросов с одного IP за минуту
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // окно = 1 минута
  max: 3, // количество запросов
  message: "Слишком много запросов, попробуйте позже",
  standardHeaders: true, // возвращает инфу в заголовках RateLimit-*
  legacyHeaders: false, // отключаем старые заголовки X-RateLimit-*
});
const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 3,
  message: "Слишком много регистраций с этого IP. Попробуйте позже."
});
// Лимитер для логина
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 минут
  max: 5,
  message: "Слишком много попыток входа. Попробуйте позже. <a href='/'>/main/</a>"
});

// Хранилище
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // папка для сохранения
  },
  filename: function (req, file, cb) {
    // Берем оригинальное расширение и добавляем к уникальному имени
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public"))); // !!!!
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const port=3700;
const host="0.0.0.0";
const client = new Client(dbConfig);

client.connect();

// ======== Middleware ========
app.use(cors({
  origin: ['https://wealth.qucu.ru',"https://commnets.qucu.ru","https://send-json.qucu.ru/"], // разрешаем запросы только с этого сайта
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true })); // для form-urlencoded
app.use(express.json()); // для JSON, если используется
// const jsonData = JSON.stringify(req.body.json || {});/

// app.use(session({
//   secret: 'superSecretKey', // лучше вынести в .env
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // true только с HTTPS
// }));
app.use(session({
  secret: process.env.SESSION_SECRET || "superSecretKey",
  resave: false,
  saveUninitialized: false, // не создавать пустые сессии
  cookie: {
    httpOnly: true,       // нельзя читать через JS
    secure: true,         // только по HTTPS (обязательно в проде!)
    sameSite: "none",     // чтобы кросс-доменно работало
    domain: ".qucu.ru",   // одна cookie для всех поддоменов
    maxAge: 1000 * 60 * 60 * 24 * 7 // срок жизни 7 дней
  }
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://send-json.qucu.ru");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.get("/profile3", (req, res) => {
  if (!req.session.user) {
    console.log("profile3");
    return res.status(401).json({ message: "Не авторизован" });
  }
  res.json({ user: req.session.user });
});

app.post("/login3", async (req, res) => {
  console.log("login3");
  const { login, password } = req.body;

  try {
    const result = await client.query(
      "SELECT * FROM barbarians WHERE login = $1",
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    // обновляем last_login
    await client.query(
      "UPDATE barbarians SET last_login = NOW() WHERE id = $1",
      [user.id]
    );

    req.session.user = {
      id: user.id,
      login: user.login,
      email: user.email,
      name: user.name,
      is_verified: user.is_verified,
      role: user.role
    };

    return res.json({ message: "Успешный вход", user: req.session.user });
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Публичный просмотр профиля по логину
app.get("/profile/view/:login", async (req, res) => {
  try {
    const login = req.params.login;

    const result = await client.query(
      `SELECT login, name, lastname, age, gender, hobby, blod_type, profession, 
              having_children, marital_status, education, avatar, id
       FROM barbarians 
       WHERE login = $1`,
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Пользователь не найден");
    }

    const user = result.rows[0];
    const userId = user.id; // ✅ 
    res.render("profile_view_public", { user, userId });
  } catch (err) {
    console.error("Ошибка при загрузке публичного профиля:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Форма добавления статьи
app.get('/add', (req, res) => {
  res.render('add');
});
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next(); // всё ок
  } else {
    res.redirect('/login'); // не авторизован → на логин
  }
}
// Простая форма логина
app.get('/login', loginLimiter, (req, res) => {
  res.render('login');
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // ищем пользователя в базе
    const result = await client.query(
      "SELECT * FROM barbarians WHERE login = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.send("Неверный логин или пароль");
    }

    const user = result.rows[0];

    // если пароли в БД в открытом виде (плохо, но может быть у тебя так пока)
    // if (password === user.password) {
    //   req.session.user = { id: user.id, username: user.username };
    //   return res.redirect("/profile");
    // }

    // если хранятся в виде bcrypt-хэшей:
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
       // обновляем last_login
      await client.query(
        "UPDATE barbarians SET last_login = NOW() WHERE id = $1",
        [user.id]
      );
      // req.session.user = { id: user.id, username: user.username };
      // При логине
      req.session.user = {
        id: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
        is_verified: user.is_verified,
        role: user.role // если есть поле роли
      };
      return res.redirect("/profile");
    }

    res.send("Неверный логин или пароль");
  } catch (err) {
    console.error("Ошибка при логине:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// // Выход
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Ошибка при выходе:", err);
      return res.status(500).send("Ошибка сервера");
    }
    res.clearCookie('connect.sid'); // удаляем cookie сессии
    res.redirect('/'); // перенаправляем на страницу логина
  });
});

// ================== Фоновая задача ==================
// Удаляем неподтвержденных пользователей старше 24 часов
cron.schedule("0 * * * *", async () => {
  try {
    const result = await client.query(
      "DELETE FROM barbarians WHERE is_verified = false AND created_at < NOW() - INTERVAL '24 hours'"
    );
    console.log(`Удалено неподтвержденных пользователей: ${result.rowCount}`);
  } catch (err) {
    console.error("Ошибка при очистке неподтвержденных пользователей:", err);
  }
});
// Удаляем пользователей, которые не заходили больше XXX дня (для теста)
// Для продакшена заменить '1 day' на '1 year'
cron.schedule("0 * * * *", async () => {
  try {
    const result = await client.query(
      `DELETE FROM barbarians 
       WHERE last_login < NOW() - INTERVAL '1 year'`
    );
    console.log(`Удалено пользователей с неактивным логином: ${result.rowCount}`);
  } catch (err) {
    console.error("Ошибка при удалении неактивных пользователей:", err);
  }
});
// Маршрут обработки формы https://wealth.qucu.ru/request-quote для формы /send-quote ========
  //  const transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       user: "chikchicly@gmail.com",
  //       pass: "gzpn sthf vtux ypef" // пароль приложения
  //     }
  //   });
    const transporter = nodemailer.createTransport({
      host: "mail.qucu.ru",      // адрес вашего SMTP сервера
      port: 465,                  // обычно 465 для SSL или 587 для TLS
      secure: true,               // true для 465, false для 587
      auth: {
        user: "lucky",   // ваш email
        pass: "Lucky&*"       // пароль от почты или пароль приложения
      }
    });
// === Маршрут для заявок ===
app.post("/send-quote", async (req, res) => {
  try {
    const { fullName, phone, email, goals, page } = req.body;

    console.log("Новая заявка:", fullName, phone, email, goals);

    // формируем письмо
    const mailOptions = {
      from: '"Форма заявки" <youremail@yandex.ru>',
      to: "lucky@qucu.ru", // куда получать заявки
      // to: "chikchicly@gmail.com", // куда получать заявки
      subject: "New 💻 " +`${page}`,
      text: `
        Имя: ${fullName}
        Телефон: ${phone}
        Email: ${email}
        Проект: ${goals}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Заявка отправлена на почту!" });
  } catch (err) {
    console.error("Ошибка отправки:", err);
    res.status(500).json({ success: false, message: "Ошибка при отправке письма" });
  }
});
app.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    // Проверяем, есть ли пользователь с таким email
    const result = await client.query(
      "SELECT login, is_verified FROM barbarians WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).send("Пользователь не найден");
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return res.send("Email уже подтверждён");
    }

    // Генерируем новый токен
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await client.query(
      "UPDATE barbarians SET verification_token = $1 WHERE email = $2",
      [verificationToken, email]
    );

    const verifyLink = `https://new.qucu.ru/verify-email?token=${verificationToken}`;

    // Отправляем письмо
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chikchicly@gmail.com",
        pass: "gzpn sthf vtux ypef" // пароль приложения
      }
    });

    await transporter.sendMail({
      from: '"Your App" <chikchicly@gmail.com>',
      to: email,
      subject: "Подтверждение email (повторная отправка)",
      html: `<p>Привет, ${user.login}! Подтверди свой email:</p>
             <a href="${verifyLink}">Подтвердить</a>`
    });

    res.send("Ссылка для подтверждения повторно отправлена на email");
  } catch (err) {
    console.error("Ошибка при повторной отправке подтверждения:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Форма регистрации
app.get("/register",  (req, res) => {
  res.render("register");
});
app.post("/register", registerLimiter, async (req, res) => {
  try {
    // Защита от ботов
    if (req.body.nickname) {
      return res.status(400).send("Ботам вход запрещён");
    }

    const { login, password, email } = req.body;

    // Валидация
    if (login.length > 50) return res.send("Логин слишком длинный");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.send("Некорректный email");
    }

    // Проверка уникальности login и email
    const [loginCheck, emailCheck] = await Promise.all([
      client.query("SELECT 1 FROM barbarians WHERE login = $1 LIMIT 1", [login]),
      client.query("SELECT 1 FROM barbarians WHERE email = $1 LIMIT 1", [email])
    ]);

    if (loginCheck.rows.length > 0) return res.send("Логин уже занят");
    if (emailCheck.rows.length > 0) return res.send("Email уже используется");

    // Хешируем пароль
    const hash = await bcrypt.hash(password, 10);

    // Генерируем токен подтверждения
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Вставка в базу
    await client.query(
      "INSERT INTO barbarians (login, password, email, verification_token, is_verified) VALUES ($1, $2, $3, $4, $5)",
      [login, hash, email, verificationToken, false]
    );

    // Создаем транспорт для Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chikchicly@gmail.com",
        pass: "gzpn sthf vtux ypef"
      }
    });

    // Ссылка для подтверждения
    const verifyLink = `https://new.qucu.ru/verify-email?token=${verificationToken}`;

    // Отправка письма
    try {
      await transporter.sendMail({
        from: '"Your App" <chikchicly@gmail.com>',
        to: email,
        subject: "Подтверждение email",
        html: `<p>Привет, ${login}! Подтверди свой email:</p>
               <a href="${verifyLink}">Подтвердить</a>`
      });
      console.log(`Письмо подтверждения отправлено на ${email}`);
    } catch (mailErr) {
      console.error("Ошибка отправки письма:", mailErr);
      return res.status(500).send("Ошибка отправки письма. Проверьте лог сервера.");
    }

    // Редирект после успешной регистрации
    res.redirect("/profile");
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Маршрут подтверждения email
app.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Некорректная ссылка");

    const result = await client.query(
      "UPDATE barbarians SET is_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING login",
      [token]
    );

    if (result.rowCount === 0) {
      return res.send("Неверный или уже использованный токен");
    }

    res.send(`Email для пользователя ${result.rows[0].login} подтверждён! <a href="/login">Войти</a>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Профиль
app.get("/ava", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login"); // если не авторизован
    }

    // получаем данные пользователя из базы
    const result = await client.query(
      "SELECT id, login, email, avatar FROM barbarians WHERE id=$1",
      [req.session.user.id]
    );

    const user = result.rows[0];

    res.render("ava", { user }); // отдаём данные в EJS
  } catch (err) {
    console.error("Ошибка при загрузке профиля:", err);
    res.status(500).send("Ошибка сервера");
  }
});

// Роут
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).send('Файл не загружен');

  // req.file.path = путь к файлу с расширением
  const avatarPath = req.file.path.replace('public/', ''); // если хранить в базе без public/
  
  // Сохраняем путь в БД
  await client.query(
    "UPDATE barbarians SET avatar=$1 WHERE id=$2",
    [avatarPath, req.session.user.id]
  );

  res.render('info', { message : "Аватарка загружена!"});
});
app.get("/profile/edit",  async (req, res) => {
  try {
    const result = await client.query(
      "SELECT login, email, name, lastname, age, gender, hobby, blod_type, profession, having_children, marital_status, education FROM barbarians WHERE id = $1",
      [req.session.user.id]
    );
    const user = result.rows[0];
    res.render("profile_edit", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.post('/profile/edit', async (req, res) => {
  try {
    const { name, lastname, age, gender, hobby, blod_type, profession,
            having_children, marital_status, education, email } = req.body;

    // Проверка email на уникальность
    const check = await client.query(
      "SELECT id FROM barbarians WHERE email = $1 AND id <> $2",
      [email, req.session.user.id]
    );

    if (check.rows.length > 0) {
      return res.status(400).send("Email уже используется");
    }

    const query = `
      UPDATE barbarians
      SET name=$1, lastname=$2, age=$3, gender=$4, hobby=$5, blod_type=$6,
          profession=$7, having_children=$8, marital_status=$9,
          education=$10, email=$11
      WHERE id=$12
    `;

    await client.query(query, [
      name, lastname, age, gender, hobby, blod_type,
      profession, having_children, marital_status,
      education, email, req.session.user.id
    ]);

    res.redirect('/profile');
  } catch (err) {
    if (err.code === "23505" && err.detail.includes("(email)")) {
      return res.status(400).send("Email уже используется");
    }
    console.error(err);
    res.status(500).send("Ошибка при обновлении профиля");
  }
});


// Просмотр профиля
app.get("/profile", requireAuth, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT login, email, name, lastname, age, gender, hobby, blod_type, profession, having_children, marital_status, education, avatar, email, is_verified
       FROM barbarians
       WHERE id = $1`,
      [req.session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Пользователь не найден");
    }

    const user = result.rows[0];
    // обновляем сессию, чтобы дальше везде было актуальное is_verified
    req.session.user.is_verified = user.is_verified;

    res.render("profile_view", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка сервера");
    }
});
app.get("/comments", requireAuth, async (req, res) => {
  try {
    // Получаем ID авторизованного пользователя из сессии
    const userId = req.session.user.id;

    // Рендерим страницу с этим ID
    res.render("comments_page", { userId });
  } catch (err) {
    console.error("Ошибка загрузки комментариев:", err);
    res.status(500).send("Ошибка сервера");
  }
});
// форма смены пароля
app.get("/profile/change-password", requireAuth, (req, res) => {
  res.render("change_password");
});

app.post("/profile/change-password", requireAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 1. Проверка совпадения нового пароля и подтверждения
    if (newPassword !== confirmPassword) {
      return res.send("Новый пароль и подтверждение не совпадают");
    }

    // 2. Проверка минимальной длины пароля
    if (newPassword.length < 6) {
      return res.send("Пароль должен быть не менее 6 символов");
    }

    // 3. Получаем текущий хэш из БД
    const result = await client.query(
      "SELECT password FROM barbarians WHERE id = $1",
      [req.session.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Пользователь не найден");
    }

    const currentHash = result.rows[0].password;

    // 4. Проверка старого пароля
    const match = await bcrypt.compare(oldPassword, currentHash);
    if (!match) {
      return res.send("Старый пароль неверен");
    }

    // 5. Хэшируем новый пароль
    const newHash = await bcrypt.hash(newPassword, 10);

    // 6. Обновляем пароль в БД
    await client.query(
      "UPDATE barbarians SET password = $1 WHERE id = $2",
      [newHash, req.session.user.id]
    );

    res.send("Пароль успешно изменён");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});


// ----------------------The ent Profile view ---- ----------- ------ -----------
// Обработка добавления статьи
app.post('/add',requireAuth, async (req, res) => {
  try {
    const { title, description, text, autor, url, json, js, keywords } = req.body;

    const jsonData = json ? JSON.stringify(JSON.parse(json)) : "{}"; // проверка JSON
    const query = `
      INSERT INTO article (title, description, text, autor, url, json, js, keywords)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING url
    `;
    const result = await client.query(query, [title, description, text, autor, url, jsonData, js, keywords]);

    res.redirect(`/blozhik/${result.rows[0].url}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при добавлении статьи');
  }
});

// Показать форму редактирования поста по URL
app.get("/edit/:url", requireAuth,async (req, res) => {
  const url = req.params.url;
   // Если нужно, проверка роли администратора requireAuth
    if (!req.session.user || req.session.user.username !== 'Amir') {
      return res.status(403).send("Доступ запрещён");
    }
  try {
    const result = await client.query(
      "SELECT * FROM article WHERE url = $1",
      [url]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Статья не найдена");
    }

    const article = result.rows[0];

    // Если у тебя есть поле json_ld, которое хранится как строка
    if (article.json && typeof article.json=== "string") {
      try {
        article.json = JSON.parse(article.json);
      } catch (e) {
        console.error("Ошибка парсинга JSON:", e.message);
        // Можно оставить строку или обнулить
        article.json = {};
      }
    }

    res.render("edit", { article }); // передаем статью в EJS
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.post('/edit/:url',requireAuth, async (req, res) => {
  try {
    const { title, description, text, autor, json, js } = req.body;
    const url = req.params.url;

    const jsonData = JSON.stringify(json || {});

    const query = `
      UPDATE article
      SET title=$1,
          description=$2,
          text=$3,
          autor=$4,
          json=$5,
          js=$6
      WHERE url=$7
    `;
    // Передаём параметры в правильном порядке
    await client.query(query, [title, description, text, autor, jsonData, js, url]);

    res.redirect(`/blozhik/${url}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обновлении статьи');
  }
});



// Маршрут для одной статьи
app.get("/blozhik/:url", async (req, res) => {
  try {
    const url = req.params.url;
    const result = await client.query("SELECT * FROM article WHERE url = $1", [url]);

    if (result.rows.length === 0) {
      // return res.status(404).send("Статья не найдена");
      return res.status(404).render("404");
    }

    const article = result.rows[0];
    let jsonData = {};
    try {
      jsonData = JSON.parse(article.json || "{}");
    } catch (e) {
      console.error("Ошибка парсинга JSON из базы:", e);
    }

    // Передаём в EJS и сам article, и распарсенный JSON
    res.render("post", { article, jsonData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при загрузке статьи");
  }
});


app.get('/blozhik', async (req, res) => {
  try {
    // const result = await client.query('SELECT * FROM article ORDER BY article');
    const result = await client.query("SELECT * FROM article ORDER BY id DESC");
    const posts = result.rows; // массив объектов постов
    res.render("postos", { articles: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Ошибка при загрузке постов');
  }
});

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM barbarians'); // получаем всех пользователей
    const users = result.rows;
    res.render('index', { users }); // передаем массив в EJS
  } catch (err) {
    console.error(err);
    res.send('Ошибка при получении данных');
  }
});
app.get('/index-table', requireAuth, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM barbarians'); // получаем всех пользователей
    const users = result.rows;
    res.render('index-table', { users }); // передаем массив в EJS
  } catch (err) {
    console.error(err);
    res.send('Ошибка при получении данных');
  }
});
app.get('/xxx-non', requireAuth, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM barbarians ORDER BY id'); // получаем всех пользователей
    const users = result.rows;
    res.render('xxx-non', { users }); // передаем массив в EJS
  } catch (err) {
    console.error(err);
    res.send('Ошибка при получении данных');
  }
});
app.get('/delete', requireAuth, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM barbarians'); // получаем всех пользователей
    const users = result.rows;
    res.render('users', { users }); // передаем массив в EJS
  } catch (err) {
    console.error(err);
    res.send('Ошибка при получении данных');
  }
});
// Удаление пользователя (только админ может)
app.get('/delete-user/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    // Вывод объекта сессии для отладки
    console.log("SESSION:", req.session);
    // Если нужно, проверка роли администратора requireAuth
    if (!req.session.user.login || req.session.user.name !== 'Admin') {
      console.log(req.session); 
      return res.status(403).send("Доступ запрещён! ");
    }

    // Удаляем пользователя из таблицы barbarians
    await client.query("DELETE FROM barbarians WHERE id = $1", [userId]);

    res.redirect('/delete'); // возвращаемся на страницу со всеми пользователями
  } catch (err) {
    console.error("Ошибка при удалении пользователя:", err);
    res.status(500).send("Ошибка сервера");
  }
});
// Обработчик 404 (если ни один маршрут не сработал)
app.use((req, res) => {
  res.status(404).render("404");
});

// ======== Старт сервера ========

app.listen(`${port}`, () => console.log('Server started on: '+`${host}`+`${port}`));

