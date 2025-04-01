import os
from google import genai

# Ensure the script checks the correct directory
current_directory = os.path.dirname(__file__)
filename = os.path.join(current_directory, "key.txt")

os.path.exists(filename)
with open(filename, 'r') as file:
	content = file.read()



client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Es gibt 3 Schwirigkeitstufen an wörtern für Hangman Leicht(3-5 Buchstaben), Mittel(6-8 Buchstaben) und Schwer(9-12 Buchstaben). Ich möchte ein Wörter aus der Schwirigkeitstufe "
)

print(response.text)
