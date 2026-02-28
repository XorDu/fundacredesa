from flask import Flask, request, jsonify, send_from_directory
import requests
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="static", static_url_path="/")
CORS(app)

# Configuración de MagicLoops
MAGICLOOPS_API_KEY = os.environ.get("MAGICLOOPS_API_KEY") or "https://magicloops.dev/loop/b0a77adb-d5f4-4a25-974b-0604c96891bc"
MAGICLOOPS_URL = os.environ.get("MAGICLOOPS_URL") or "https://api.magicloops.dev"

# Ruta a la carpeta de PDFs
PDF_FOLDER = "./Estudios de Fundacredesa"

# Función para subir un PDF a MagicLoops y obtener el ID del documento
def upload_pdf_to_magicloops(pdf_path):
    try:
        with open(pdf_path, "rb") as f:
            files = {"file": (os.path.basename(pdf_path), f, "application/pdf")}
            headers = {"Authorization": f"Bearer {MAGICLOOPS_API_KEY}"}
            response = requests.post(f"{MAGICLOOPS_URL}/upload", headers=headers, files=files)
            if response.status_code == 200:
                return response.json().get("document_id")
            else:
                print(f"Error al subir {pdf_path}: {response.text}")
                return None
    except Exception as e:
        print(f"Error al subir {pdf_path}: {e}")
        return None

# Subir todos los PDFs al iniciar y guardar sus IDs
pdf_ids = []
for filename in os.listdir(PDF_FOLDER):
    if filename.lower().endswith(".pdf"):
        full_path = os.path.join(PDF_FOLDER, filename)
        doc_id = upload_pdf_to_magicloops(full_path)
        if doc_id:
            pdf_ids.append(doc_id)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Mensaje vacío"}), 400

        # Consulta a MagicLoops con los IDs de los PDFs
        headers = {
            "Authorization": f"Bearer {MAGICLOOPS_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "document_ids": pdf_ids,
            "question": user_message
        }
        response = requests.post(f"{MAGICLOOPS_URL}/run", headers=headers, json=data)

        if response.status_code == 200:
            response_json = response.json()
            answer = response_json.get("answer", "No se recibió respuesta.")
            return jsonify({"answer": answer})
        else:
            return jsonify({
                "error": "Error en la API de MagicLoops",
                "status_code": response.status_code,
                "details": response.text
            }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
