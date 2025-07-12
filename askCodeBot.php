<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(E_ALL);//detect all type of errors
ini_set('display_errors', 0);//the error will not show to the user
ini_set('log_errors', 1);//save error to file instead
ini_set('error_log', 'php-error.log');//if error occurs then store in this file

// Read user input
$data = json_decode(file_get_contents("php://input"), true);
$userMessage = trim($data['message'] ?? '');

if (!$userMessage) {
    echo json_encode(['reply' => "⚠️ No message received."]);
    exit;
}

// 🟦 OpenRouter API setup
$apiKey = "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";//api key created on openrouter
$url    = "https://openrouter.ai/api/v1/chat/completions";//url of openrouter
$payload = [
    "model"    => "openai/gpt-3.5-turbo",  // ChatGPT-like (integrate this model using operrouter)
    "messages" => [
        ["role" => "system", "content" => "You are a helpful coding assistant."],
        ["role" => "user", "content" => $userMessage]
    ]
];

$headers = [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
];

// cURL request
$ch = curl_init($url);//initialize request to the api
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,//returns response as string
    CURLOPT_POST           => true,//post request
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => $headers
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['reply' => "❌ API Error (HTTP $httpCode)"]);
    exit;
}

$result = json_decode($response, true);
$reply = $result['choices'][0]['message']['content'] ?? "⚠️ No reply received.";
echo json_encode(['reply' => $reply]);
