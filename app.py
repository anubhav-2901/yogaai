from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os


path = "/Users/anubhav/Documents/UTokyo/Doctors/Multimedia Interface/yogapy/instructions/"

app = Flask(__name__)

# Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
client = OpenAI(
    api_key="xxxx",
)

messages = [ {"role": "system", "content":
    "You are a intelligent assistant."} ]

def generate_yoga_instructions(duration, mood, level):
    prompt = f"Generate yoga instructions for a {duration}-minute session that is {mood} and suitable for {level}-level practitioners."
    messages.append(
        {"role": "user", "content": prompt},
    )
    chat = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=messages
    )
    reply = chat.choices[0].message.content
    return reply


def text_to_speech(text):
    speech_file_path = path+"speech.mp3"
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text
    )
    return response.stream_to_file(speech_file_path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_instructions', methods=['POST'])
def generate_instructions():
    data = request.get_json()
    duration = data['duration']
    mood = data['mood']
    level = data['level']
    print('generating text')
    with open(path+'sample.txt','r') as f:
        instructions = f.read()
    #instructions = generate_yoga_instructions(duration, mood, level)
    print('text generated')
    #audio_content = text_to_speech(instructions)

    return jsonify({'instructions': instructions})

if __name__ == '__main__':
    app.run(debug=True)
