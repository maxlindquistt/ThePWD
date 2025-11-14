const template = document.createElement('template')
template.innerHTML = `
<style>
        .dock {
          display: flex;
          gap: 30px;
          background: rgba(0,0,0,0.6);
          padding: 20px;
          border-radius: 12px;
        }
        button {
          background: gray;
          border: none;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 24px;
        }
      </style>
      <div class="dock">
        <button data-app="memory">🧠</button>
        <button data-app="messages">💬</button>
        <button data-app="hangman">✨</button>
      </div>
`

customElements.define('pwd-dock',
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
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Called when the element is connected to the DOM.
     */
    connectedCallback () {
      this.shadowRoot.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const appType = e.currentTarget.dataset.app
          const appWindow = document.createElement('app-window')
          appWindow.setAttribute('data-app', appType)
          document.querySelector('pwd-desktop').shadowRoot.querySelector('.desktop').appendChild(appWindow)
        })
      })
    }

    /**
     * Called when the element is disconnected from the DOM.
     */
    disconnectedCallback () {
      this.shadowRoot.querySelectorAll('button').forEach(btn => {
        btn.removeEventListener('click', this.handleButtonClick)
      })
    }
  })
