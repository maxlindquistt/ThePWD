# `pwd-dock` Web Component

A simple dock component providing clickable buttons to launch different apps inside a `pwd-desktop` environment.

## Features

- Displays a dock with three buttons representing different apps:
  - Memory game (🧠)
  - Messages (💬)
  - YouTube (✨)
- Styled with a semi-transparent dark background, rounded corners, and spacing between buttons.
- Buttons have a clean, modern style with hover and click feedback.
- Clicking a button creates and appends an `<app-window>` element to the `.desktop` container inside the `<pwd-desktop>` component.

## Usage

### Installation

Include the script defining the component and use the `<pwd-dock>` tag in your HTML:

```html
<script type="module" src="path/to/pwd-dock.js"></script>

<pwd-dock></pwd-dock>
