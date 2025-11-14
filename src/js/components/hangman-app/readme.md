# `hangman-app` Web Component

A custom web component that implements a classic Hangman word-guessing game.

## Features

- Fetches a random word from an external API for each game.
- Displays the word as underscores, revealing letters as they are guessed.
- On-screen keyboard for letter selection.
- Tracks remaining attempts and disables used letters.
- Displays win/lose status and the correct word if lost.
- "Retry" button to start a new game.
- Responsive and accessible UI.

## Usage

### Installation

Import the component and use the `<hangman-app>` tag in your HTML:

```html
<script type="module" src="path/to/hangman-app.js"></script>

<hangman-app></hangman-app>