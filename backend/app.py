import os
import sys
from flask import Flask, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '../frontend'))
PAGES_DIR = os.path.join(FRONTEND_DIR, 'pages')

# Evitamos colocar static_url_path='' porque secuestra el comportamiento 404 de los html
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='/static_assets__')

@app.route('/')
def home():
    return send_from_directory(PAGES_DIR, 'index.html')

@app.route('/<path:path>')
def serve_pages(path):
    # Si detectamos que es un html en la raíz, le hacemos dispatch a PAGES_DIR
    if path.endswith('.html'):
        page_name = os.path.basename(path)
        if os.path.exists(os.path.join(PAGES_DIR, page_name)):
            return send_from_directory(PAGES_DIR, page_name)
    # Para el CSS, JS, e Imagenes
    return send_from_directory(FRONTEND_DIR, path)

if __name__ == '__main__':
    print("\n" + "="*50)
    print(" SERVIDOR FUNDACREDESA INICIADO ")
    print(" URL: http://localhost:8080 ")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=8080, debug=True)