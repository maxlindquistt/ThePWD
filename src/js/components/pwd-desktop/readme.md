# `pwd-desktop` Web Component

A simple custom web component that represents a desktop container with a dock element positioned at the bottom center.

## Features

- Full viewport sized desktop container (`100vw` x `100vh`).
- Contains a `<pwd-dock>` element positioned at the bottom center.
- Uses Shadow DOM for style encapsulation.
- Responsive and fixed layout with overflow hidden.

## Usage

### Installation

Include the script defining the component and use the `<pwd-desktop>` tag in your HTML:

```html
<script type="module" src="path/to/pwd-desktop.js"></script>

<pwd-desktop></pwd-desktop>
