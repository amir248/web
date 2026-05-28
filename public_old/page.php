<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="description" content="Узнать свой ip. Как вычислить по ip адресу. И что нужно чтобы узнать ip адрес человека с фейковыми фотками, вымылшенным именем и поддельной страницей в соц сетях.">
    <title>Узнать ip</title>
    <script data-ad-client="ca-pub-6824659625881284" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

    <style>
    *{
        margin:0;
    }
    .fon{
        background-image: url(images/fon.webp);
        background-size: 100%;
        background-repeat: repeat-y;
        width:100%;
        min-height: 100%;
        display: flex;
        flex-wrap: wrap;
        position:absolute;
        text-align: center;
        color: red;
        font-size: 24px;
        text-shadow: 2px 2px 4px black;
        justify-content: center;
        word-wrap: break-word; /* Перенос слов */
    }
    div.fece{
        margin: 25px;
        border: 10px;
        width: 70%;
        max-width: 100%;
        margin-left: 5%;
    }
    .fece a{
      width:200px;
    }
    .baner{
        display: flex;
        flex-wrap: wrap;
        position: sticky;
        background-image: url(https://nasobe.ru/images/fozzy/ssd-480x320.png);
        background-position: inherit;
        background-size: cover;
        width: 200px;
        height: 133px;
        top: 10px;
        margin-left: 1%;
        justify-content: center;
        object-fit:contain;
    }
    p.text{
        width: 70%;
        max-width: 100%;
        margin: 5%;
        text-align: left;
        color: black;
        font-weight: 400;
        text-shadow: 1px 1px 4px red;
    }
    .white-color{
        background-color: rgba(255, 255, 254, 0.3);
        border-radius: 2%;
        padding: 25px;
        border: 3px solid red;
    }
    .green-color{
        background-color: rgba(53, 230, 44, 0.3);
        border-radius: 2%;
        padding: 25px;
        border: 4px solid black;
    }
    .black-color{
        background-color: black;
        border-radius:3%;
        padding: 25px;
        border: 3px solid yellow;
    }
    @media(max-width: 600px){
        .fon{
            font-size: 14px;
        }
    }
</style>
<!-- Счетчики -->
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CTRLNMFNGY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CTRLNMFNGY');
</script>
</head>

<body>
    <div class="fon">
        <div class="fece">
                <h1 class="green-color"><p>Ваш ip адрес: </p>
                    <?php
                    echo $_SERVER['REMOTE_ADDR'];
                    //echo $_SERVER['REMOVE_ADDR'];
                    ?>
                </h1><hr>
                <h1><p>user_agent:</p>
                    <?php
                    echo $_SERVER['HTTP_USER_AGENT'];
                    ?>
                </h1><hr>
                <h1><p>Хост:</p>
                    <?php
                    echo $_SERVER['REMOTE_HOST'];

                    ?>
                </h1><hr>
                <h1><p>dns:</p>
                    <?php
                    echo $_SERVER['HTTP_CLIENT_IP'];
                    echo $_SERVER['HTTP_X_FORWARDED_FOR'];
                    ?>
                </h1><hr><br>
                <div class='white-color'>
                <sup>Айпи адрес узнается через глобальную переменную в php REMOTE_ADDR.</sup>
                <br>
                <h2>Собственно сам код, для вставки в фейковую страницу, для записи IP адреса.</h2>
                <p class="text">
                "<"?php <br>// как бы тег пхпешный должен открыться, но как экранировать чтобы не открыть я не заморачиваюсь.<br>
                /*--------------------------------------------------------------------<br>
                ---------------ПОДСЧЕТ ПОСЕТИТЕЛЕЙ И ОБНОВЛЕНИЙ СТРАНИЦ ------------<br>
                -------------------------------------------------------------------- */<br>
                $user;<br>
                if (!empty($_SERVER['HTTP_CLIENT_IP']))<br>
                {<br>
                    $ip=$_SERVER['HTTP_CLIENT_IP'];<br>
                }<br>
                elseif (!empty($_SERVER['HTTP_FORWARDED_FOR']))<br>
                {<br>
                    $ip=$_SERVER['HTTP_FORWARDED_FOR'];<br>
                }<br>
                else<br>
                {<br>
                    $ip=$_SERVER['REMOTE_ADDR'];<br>
                }
                $home= $_SERVER['HTTP_HOST'].$SERVER['REQUEST_URI'].$SERVER['HTTP_USER_AGENT'];<br>
                if(isset($ip) )<br>
                {<br>
                    $date = date("j.M.Y");<br>
                    $log = fopen("history_of_visits/".$date.".txt", "a+");<br>

                    $zap=fwrite($log, date("j.M.Y")."____|".$ip."|__|".$home.$user."\r\n");<br>
                    $mas = file("history_of_visits/".$date.'.txt');<br>
                    $uuu = count($mas);<br>
                    $uuu_unique = array_unique($mas);<br>
                    $count_uuu_unique= count($uuu_unique);<br>
                    echo "обновлений : ".$uuu." раз!"; // это как раз та строчка которую нужно закоментить и следующая тоже кстати.<br>
                    echo " ".$count_uuu_unique. " человек<br>";<br>
                    fclose;<br>
                } <br>

                ?><br>
            </p>
            </div>
            <br>
            <p class="black-color">Вот и Все!... В теории этих простых знаний должно хватить чтобы вычислить по ip. ) Вам только останется решить, что делать с таким багажом умений. И стоит ли оно вообще тоGO!... ВычислЯть по IP</p>
        </div>
        <a href="https://x5x.host/i/8-yyg73gj5" alt="хостинг быстрее быстрого"><div class="baner"></div></a>
        <br>
        <br>
    <div class="fece"><a href="https://qucu.ru/">На главную.</a></div>
    </div>
</body>
</script>

</html>
