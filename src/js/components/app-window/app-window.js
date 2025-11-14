let zCounter = 10

customElements.define('app-window',
  /**
   * Extends the HTMLElement
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the custom element and attaches a shadow DOM.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      zCounter++
      this.zIndex = zCounter
    }

    /**
     * Called when the element is connected to the DOM.
     */
    connectedCallback () {
      const appType = this.getAttribute('data-app')
      this.renderApp(appType)
      this.setupEvents()
      const window = this.shadowRoot.querySelector('.window')
      if (appType === 'memory') {
        window.style.width = '300px'
        window.style.height = '370px'
      } else if (appType === 'messages') {
        window.style.width = '800px'
        window.style.height = '405px'
      } else if (appType === 'hangman') {
        window.style.width = '600px'
        window.style.height = '400px'
      }
    }

    /**
     * Renders the application window based on the app type.
     *
     * @param {string} appType - The type of application to render (e.g., 'memory', 'messages', 'youtube').
     */
    renderApp (appType) {
      this.shadowRoot.innerHTML = `
        <style>
          .window {
            position: absolute;
            top: 100px;
            left: 100px;
            width: 300px;
            height: 200px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: auto;
          }
          .title-bar {
            background: #333;
            color: white;
            padding: 5px 10px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .content {
            flex: 1;
            padding: 10px;
          }
        </style>
        <div class="window">
          <div class="title-bar">
            <span>${appType}</span>
            <button id="close">✖️</button>
          </div>
          <div class="content">
            <${appType}-app></${appType}-app>
          </div>
        </div>
      `
    }

    /**
     * Sets up event listeners for the app window.
     */
    setupEvents () {
      const closeBtn = this.shadowRoot.querySelector('#close')
      closeBtn.addEventListener('click', () => this.remove())

      const windowEl = this.shadowRoot.querySelector('.window')
      const titleBar = this.shadowRoot.querySelector('.title-bar')

      windowEl.addEventListener('mousedown', () => {
        zCounter++
        windowEl.style.zIndex = zCounter
      })

      // Drag functionality
      let offsetX; let offsetY; let isDragging = false

      /**
       * Handles the mousedown event on the title bar to initiate dragging.
       *
       * @param {MouseEvent} e The mouse down event object.
       */
      const onMouseDown = (e) => {
        isDragging = true
        const rect = windowEl.getBoundingClientRect()
        offsetX = e.clientX - rect.left
        offsetY = e.clientY - rect.top
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }

      /**
       * Handles the mousemove event to update the position of the window while dragging.
       *
       * @param {MouseEvent} e The mouse move event object.
       */
      const onMouseMove = (e) => {
        if (!isDragging) return
        windowEl.style.left = `${e.clientX - offsetX}px`
        windowEl.style.top = `${e.clientY - offsetY}px`
      }

      /**
       * Handles the mouseup event to stop dragging.
       */
      const onMouseUp = () => {
        isDragging = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      titleBar.addEventListener('mousedown', onMouseDown)
    }
  })
