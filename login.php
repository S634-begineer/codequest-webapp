<?php
include("connection.php");
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");

    if ($stmt) {
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();

            if (password_verify($password, $row['password'])) {
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['username'] = $row['username'];
                $_SESSION['email'] = $row['email'];

                $stmt->close();
                $conn->close();

                header("Location: /CodeQuest/Frontend/html/homepage.html?status=success");
                exit();
            } else {
                header("Location: /CodeQuest/Frontend/html/homepage.html?status=wrongpass");
                exit();
            }
        } else {
            header("Location: /CodeQuest/Frontend/html/homepage.html?status=notfound");
            exit();
        }

        $stmt->close();
    } else {
        // Optional: Debug if prepare() fails
        die("Database error: " . $conn->error);
    }

    $conn->close();
}
?>