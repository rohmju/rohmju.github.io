from google import genai
import os


file = open("APIKey.txt", "r")
# Open the file in read mode
with open('APIKey.txt', 'r') as file:
    # Read the contents of the file
    api_key = file.read()

# Print the contents (API key or other data)
print(api_key)


#client = genai.Client(api_key="example")

#response = client.models.generate_content(
#    model="gemini-2.0-flash",
#    contents="Give me 10 Random Words to Guess in a game of HAngman. Difficultys: Easy (3-5 letters), Medium (6-8 letters), Hard (9+ letters). Make Sure to write the 10 Words only of the choosen Difficulty in JSON Format Difficulty : Easy"
#)

#print(response.text)