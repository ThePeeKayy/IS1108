from flask import Flask, request, jsonify
import requests
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Initialize and load resources
HF_API_KEY = ''

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
    You are a compassionate healthcare chatbot. You have the ability to contact a healthcare provider only if the user expresses distress or mental health concerns.
    Be empathetic and comforting in responses, keeping sentences grammatically correct and complete. Avoid making assumptions or predicting user statements.
    Main task: Respond appropriately based on user input. 
    - If the user input is a simple greeting (like "hi" or "hello"), reply with a friendly greeting back, without bringing up health topics.
    - If the user expresses feelings of distress or being overwhelmed, respond empathetically and offer comfort, following up if needed to encourage seeking support if they choose.
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
