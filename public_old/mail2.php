<?php
require_once "recaptchalib.php";
 
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Добавляем reCAPTCHA от Google на сайт</title>
</head>
<body>
<?php
//секретный ключ
$secret = "6LdmJNEZAAAAANoVJTK7PLSKTrmwg2JVVG0eCk6D";
//ответ
$response = null;
//проверка секретного ключа
$reCaptcha = new ReCaptcha($secret);
 
if (!empty($_POST)) {
 
    //Валидация $_POST['name'] и $_POST['email']
    if ($_POST["g-recaptcha-response"]) {
        $response = $reCaptcha->verifyResponse(
            $_SERVER["REMOTE_ADDR"],
            $_POST["g-recaptcha-response"]
        );
    }
 
    if ($response != null && $response->success) {
        echo "Все хорошо.";
    } else {
        echo "Вы точно человек?";
    }
 
}
?>
 
<form method="post">
    <label for="name">Имя:</label>
    <input name="name" required><br />
    <label for="email">E-mail:</label>
    <input name="email" type="email" required><br />
    <div class="g-recaptcha" data-sitekey="66LdmJNEZAAAAAC4NVgJ9KsjAEseUVTUoubETN0U4"></div>
    <input type="submit" value="Отправить" />
</form>
 
<script src='https://www.google.com/recaptcha/api.js'></script>
 
</body>
</html>