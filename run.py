import http.server
import socketserver
import webbrowser

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server berjalan di http://localhost:{PORT}")
    # otomatis buka browser ke index.html
    webbrowser.open(f"http://localhost:{PORT}/index.html")
    httpd.serve_forever()
