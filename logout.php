<?php
session_start();
session_unset();
session_destroy();
header("Location: /CodeQuest/Frontend/html/homepage.html");  // leading slash = root of localhost
exit();
?>
