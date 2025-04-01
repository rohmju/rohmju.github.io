import os

# Ensure the script checks the correct directory
current_directory = os.path.dirname(__file__)
filename = os.path.join(current_directory, "key.txt")

if os.path.exists(filename):
    with open(filename, 'r') as file:
        content = file.read()
        print(content)
else:
    print(f"Error: The file '{filename}' does not exist in the directory '{current_directory}'.")