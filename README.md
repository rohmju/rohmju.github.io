*# Rohmju's GitHub.io Project

This project is a simple interactive webpage that includes buttons for various functionalities, such as opening YouTube videos, displaying a cat video, and navigating to a Minesweeper game (work in progress).

## Project Structure

The project consists of the following files:

- **index.html**: The main HTML file that serves as the entry point for the webpage.
- **style.css**: The CSS file that defines the styling for the webpage.
- **script.js**: The JavaScript file that contains the logic for the interactive buttons and animations.

## Features

### Buttons
- **Minesweeper (WIP)**: Redirects to a Minesweeper game (currently under development).
- **YT Video**: Opens a YouTube video in an embedded iframe with autoplay and loop enabled.
- **Cat (WIP)**: Opens a cat video in an embedded iframe (work in progress).

### Animations
- The "Return" button includes a hover effect that moves it across the screen and changes its appearance.

### Styling
- The webpage uses a dark slate grey background with a visually appealing layout.
- Buttons have hover effects, including scaling and color transitions.

## How It Works

### JavaScript Functions
1. **openYT()**: 
   - Clears the current content of the page.
   - Embeds a YouTube video in an iframe.
   - Adds a "Return" button to reload the page.

2. **openCat()**:
   - Similar to `openYT()`, but intended for a cat video.

3. **moving(returnbutton)**:
   - Animates the "Return" button when hovered over, moving it to the right and changing its appearance.

### CSS Highlights
- `.Knopf`: Styles the buttons with hover effects for scaling and color transitions.
- `.container` and `#inside`: Center the content and add a background image for a polished look.

## How to Run
1. Clone the repository or download the files.
2. Open `index.html` in a web browser.
3. Interact with the buttons to explore the features.

## Future Improvements
- Complete the Minesweeper game.
- Enhance the "Cat" button functionality.
- Add more interactive features and animations.

## Credits
- Background image: [Pexels](https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg)
- Cat video: YouTube
- Developed by Rohmju
*