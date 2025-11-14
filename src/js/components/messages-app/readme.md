# `messages-app` Web Component

A custom web component that provides a real-time chat interface with emoji support using a WebSocket backend and the `emoji-picker-element` for emoji selection.

## Features

- Real-time messaging via WebSocket connection.
- Persistent username stored in `localStorage`.
- Emoji picker integration for easy emoji insertion.
- Keyboard support: press Enter to send messages.
- Displays last 20 messages.
- Responsive design with scrollable message area.
- Simple user-friendly interface.

## Usage

### Installation

No build tools or bundlers required. Simply import and use the component in any modern web browser.

```html
<script type="module" src="path/to/messages-app.js"></script>

<messages-app></messages-app>
