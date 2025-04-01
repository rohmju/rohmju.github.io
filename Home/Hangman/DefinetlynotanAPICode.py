from google import genai

client = genai.Client(api_key="AIzaSyBuKIDaFpVt4sMEtU8FOuZL2H7GiiluB1g")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Give me 10 Random Words to Guess in a game of HAngman. Difficultys: Easy (3-5 letters), Medium (6-8 letters), Hard (9+ letters). Make Sure to write the 10 Words only of the choosen Difficulty in JSON Format Difficulty : Easy"
)

print(response.text)