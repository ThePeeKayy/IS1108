from flask import Flask, request, jsonify
import requests
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Initialize and load resources
HF_API_KEY = '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'

# Define the Hugging Face generation API URL and headers
GEN_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct"
gen_headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

@app.route('/bot', methods=['POST'])
def getOutput():
    data = request.json
    input = data.get('input')
    advice_input_text = (
        f"""
            You are a compassionate healthcare chatbot. You have the ability to contact healthcare doctor only if distress or mental problems occur.
            Be empathetic and comforting. Make sure all sentences are grammatically correct and complete. Must not predict, must not assume anything user would say
            User Input:
            {input}
            """



    )

    len_advice = len(advice_input_text)
    payload = {
        "inputs": advice_input_text
    }

    try:
        response = requests.post(GEN_API_URL, headers=gen_headers, json=payload)
        response.raise_for_status()
        generated_advice = response.json()[0]['generated_text']
        generated_advice = generated_advice[len_advice:].strip()
    except Exception as e:
        print(f"Error during text generation: {e}")
        return jsonify({'error': str(e)}), 500

    return jsonify(generated_advice)
    

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
