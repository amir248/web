<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    </head>

<?php
$errors = '';
$name = $_POST['name'];
$email_address = $_POST['email'];
$message = $_POST['message'];
$rover = $_POST['messages'];
if (!preg_match(
"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i",
$email_address))
{
    $errors .= "\n Error: Invalid email address";
}

if( empty($errors))
{
$to = $email_address;
$email_subject = "web workshop named after Baron Sittoverstausen: $name";
$email_body = "You have received a new message. ".
$rover.
" Here are the details:\n Name: $name \n ".
"Email: $email_address\n Message \n $message";
// $headers = "From: $myemail\n";
$headers .= "Reply-To: $email_address";
mail($to,$email_subject,$email_body,$headers);
//redirect to the 'thank you' page
echo ("<h1>отправка состоялась!</h1>");
header("refresh: 1; url=https://qucu.ru/quiz.html");
header('Content-Type: text/html; charset=utf-8');
}
?>
</html>
