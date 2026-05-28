<?php
if($_SERVER['SERVER_NAME']=="localhost"){
  $servername = "localhost"; // Сейчас работает это!
  $database = "nasobe";
  $username = "debian-sys-maint";
  $password = "SVMr3IN8ukUtBIp1";
}
$connect = mysqli_connect($servername, $username, $password,$database);
mysqli_query($connect, "SET NAMES utf8");
$posText=mysqli_query($connect, "SELECT * FROM `barbarians`ORDER BY `id`, `login`,`password`,`email`,`name`  ASC");
$allPostsText=mysqli_fetch_all($posText);
  for($i=0;$i<count($allPostsText);$i++){
    $revers=array_reverse($allPostsText);
  foreach($allPostsText as $posText){
  }
}
//htmlspecialchars
$login=htmlspecialchars($_POST['login']);
$email=htmlspecialchars($_POST['email']);
$GETpassword=htmlspecialchars($_POST['uno_password']);
$name=htmlspecialchars($_POST['Name']);
$lastname=htmlspecialchars($_POST['Lastname']);
$age=htmlspecialchars($_POST['age']);
$gender=htmlspecialchars($_POST['floor']);
$blod_type=htmlspecialchars($_POST['blod_type']);
$profession=htmlspecialchars($_POST['profession']);
$having_children=htmlspecialchars($_POST['having_children']);
$marital_status=htmlspecialchars($_POST['marital_status']);

$hobby=htmlspecialchars($_POST['hobby']);
$education=htmlspecialchars($_POST['education']);

//******************************************************************************
//*******************************URL********************************************
//******************************************************************************
$URL= 'authorization.html';
//******************************************************************************
if(isset($_POST["button"])){
  $connect = mysqli_connect($servername, $username, $password,$database);
  if(!$connect){
    die("Connection failed: " . mysqli_connect_error());
  }else{
    echo "<br>connection successFully";
  }

  mysqli_query($connect, "SET NAMES utf8");
  $logANDemail=mysqli_query($connect, "SELECT `login`, `email`,`password` FROM `barbarians`");
  $LoginANDemail=mysqli_fetch_all($logANDemail);
  for($oj=0;$oj<count($LoginANDemail);$oj++){

    if($LoginANDemail[$oj][0]===$login){
      echo "<br><h1 style='color:red;'>Login ЗАНЯТ!!!</h1><br>";
      echo "<pre>";
      var_dump($LoginANDemail[$oj][0]);
      echo "</pre>";
      return prov();
    }else{
      if($login!==$LoginANDemail[$oj][0]){
        echo "<pre>";
        var_dump($LoginANDemail[$oj][0]);
        echo "</pre>";
        echo "<br><h1 style='color:green;'>Login OK!!!</h1><br>";
        // break;
        mysqli_query($connect, "SET NAMES utf8");
        mysqli_query($connect, "INSERT INTO `barbarians`(`id`, `login`, `password`, `email`, `Name`, `Lastname`,`age`,`floor`,`blod_type`,`profession`,`having_children`,`marital_status`,`hobby`,`education`) VALUES (NULL,'$login','$GETpassword','$email','$name','$lastname','$age','$gender','$blod_type','$profession','$having_children','$marital_status','$hobby','$education')");

        mysqli_close($connect);
        header("refresh: 1; url=$URL");

      }
    }
  }
function prov(){
  echo "<br>Ghjdf</br>";
}
  echo count($LoginANDemail)." <br>";

//******************************************************************************
//*****************************Checking-the-login*******************************
//******************************************************************************

  if(isset($ok)){

  // mysqli_query($connect, "SET NAMES utf8");
  // mysqli_query($connect, "INSERT INTO `barbariand` (`id`, `profession`, `login`, `password`, `email`,`nick`,`name`) VALUES (NULL, '$profession', '$login', '$password', '$email', '$nick', '$name')");

  // mysqli_close($connect);
  //,`hobby`,`education`
  }
echo "ok";
}

if(isset($_POST["authorization"])){
  $connect = mysqli_connect($servername, $username, $password, $database);
  if(!$connect){
    die("Connection failed: " . mysqli_connect_error());
  }else{
    echo "<br>connection successFully<br>";

    mysqli_query($connect, "SET NAMES utf8");
    $logANDemail=mysqli_query($connect, "SELECT `login`, `email`,`password` FROM `barbarians`");
    $LoginANDemail=mysqli_fetch_all($logANDemail);

    echo count($LoginANDemail)." <br>";
    for($iy=0;$iy<count($LoginANDemail);$iy++){
      if($LoginANDemail[$iy][0]===$_POST['login']){

        // echo $LoginANDemail[$iy][0]." ".$_POST['login']. " ----to samoe mesto_";
        // echo $iy." _".$GETpassword;
        // echo "<br>".$LoginANDemail[$iy][2];
        if($LoginANDemail[$iy][2]===$GETpassword){
          echo "<br><pre>";
          var_dump($LoginANDemail[$iy]);
          echo "</pre>";
          echo "<div style='font-size:20; color: red;'>Проход есть!!!! ^_^</div>";
          echo $LoginANDemail[$iy][2]."===".$LoginANDemail[$iy][0]."!!!!!!!!!!!!!";
          header("refresh: 1; url=$URL");
          // header("location:");
          // or header('location:/team/authorization.html);
        }

        if($LoginANDemail[$iy][2]===$_POST['password']){

          echo "<br><span style='color:darkred'>Failed<br>".$GETpassword."</span><hr>";
          echo $LoginANDemail[$iy][2]."<br>";
          echo $_POST['password']."<br>";
          echo $LoginANDemail[$iy][0]."<br>";
          echo $_POST['login']."<br>";
          header("refresh: 1; url=$URL");

          break;
        }else{ //RED
          // echo "<p style='color:red;'>FAtallity</p>";
          header("refresh: 1; url=$URL");

          break;

        }
      }else{ // GREEN
        // echo "<span style='color:green'>^_^<br>".$_POST['login']. "-".$LoginANDemail[$iy][0]."</span><br>";
        header("refresh: 1; url=$URL");

      }
    }
  }
echo "<br>authorization";
// $connect = mysqli_connect($servername, $username, $password,$database);

$login =mysqli_query($connect, "SELECT `login`, `password` FROM `barbarians`");
echo "<br>". $login;

}else{
  echo "Else!";
}
?>
