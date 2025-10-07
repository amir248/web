const express = require('express');
const { Client } = require('pg');
const dbConfig = require('./custom_modules/dbConfig');
const app = express();
const path = require("path");

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));

const port=3700;
const client = new Client(dbConfig);

client.connect();

app.use(express.urlencoded({ extended: true })); // для form-urlencoded
app.use(express.json()); // для JSON, если используется
// const jsonData = JSON.stringify(req.body.json || {});/

// Показать форму редактирования поста по URL
app.get("/edit/:url", async (req, res) => {
  const url = req.params.url;

  try {
    const result = await client.query(
      "SELECT * FROM article WHERE url = $1",
      [url]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Статья не найдена");
    }

    const article = result.rows[0];
    res.render("edit", { article }); // передаем статью в EJS
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.post('/edit/:url', async (req, res) => {
  try {
    const { title, description, text, autor, json } = req.body;
    const url = req.params.url;

    const jsonData = JSON.stringify(json || {});

    const query = `
      UPDATE article
      SET title=$1,
          description=$2,
          text=$3,
          autor=$4,
          json=$5
      WHERE url=$6
    `;
    await client.query(query, [title, description, text, autor, jsonData, url]);

    res.redirect(`/post/${url}`);
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
      return res.status(404).send("Статья не найдена");
    }

    res.render("post", { article: result.rows[0] });
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

app.listen(`${port}`, () => console.log('Server started on http://localhost:'+`${port}`));

