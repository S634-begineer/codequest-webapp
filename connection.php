<?php
$servername = "localhost";
$username = "root";
$password = "saniya36sayyad";
$dbname = "CodequestSignIn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
