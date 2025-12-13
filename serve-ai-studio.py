#!/usr/bin/env python3
"""
Serveur simple pour servir l'application comme dans AI Studio
Utilise l'importmap au lieu du bundling Vite
"""
import http.server
import socketserver
import os
from pathlib import Path

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les headers CORS et MIME types pour les modules ES6
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Headers pour les modules ES6
        if self.path.endswith('.tsx') or self.path.endswith('.ts'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.jsx'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        
        super().end_headers()

    def do_GET(self):
        # Rediriger la racine vers index-ai-studio.html
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index-ai-studio.html'
        return super().do_GET()

if __name__ == "__main__":
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Serveur démarré sur http://localhost:{PORT}")
        print(f"📱 Application accessible comme dans AI Studio")
        print(f"🛑 Appuyez sur Ctrl+C pour arrêter")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Serveur arrêté")

