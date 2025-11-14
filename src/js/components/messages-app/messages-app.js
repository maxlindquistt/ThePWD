import 'emoji-picker-element'

customElements.define('messages-app',
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
      this.messages = []
      this.username = ''
      this.socket = null
    }

    /**
     * Runs when the element is connected to the DOM.
     */
    connectedCallback () {
      this.loadUsername()
    }

    /**
     * Loads the username from localStorage and initializes the socket connection.
     */
    loadUsername () {
      const stored = localStorage.getItem('pwd-username')
      if (stored) {
        this.username = stored
        this.initSocket()
      } else {
        this.askForUsername()
      }
    }

    /**
     * Prompts the user for a username and initializes the socket connection.
     */
    askForUsername () {
      this.shadowRoot.innerHTML = `
      <style>
        input { padding: 5px; font-size: 1rem; }
        button { padding: 5px 10px; margin-left: 5px; }
      </style>
      <div>
        <label>Enter your username:
          <input id="usernameInput" type="text" />
          <button id="submitUsername">Join</button>
        </label>
      </div>
    `
      this.shadowRoot.querySelector('#submitUsername')
        .addEventListener('click', () => {
          const val = this.shadowRoot.querySelector('#usernameInput').value.trim()
          if (val) {
            this.username = val
            localStorage.setItem('pwd-username', val)
            this.initSocket()
          }
        })
    }

    /**
     * Initializes the WebSocket connection and sets up event listeners.
     */
    initSocket () {
      this.renderChatUI()

      if (!customElements.get('emoji-picker')) {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://cdn.jsdelivr.net/npm/emoji-picker-element'
        document.head.appendChild(script)
      }

      this.socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

      this.socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data)
        if (data.data !== '') {
          this.messages.push(data)
          if (this.messages.length > 20) this.messages.shift()
          this.renderMessages()
        }
      })

      this.shadowRoot.querySelector('#sendButton')
        .addEventListener('click', () => this.sendMessage())

      this.shadowRoot.querySelector('#messageInput')
        .addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            this.sendMessage()
          }
        })

      /**
       * Waits for the emoji picker to be loaded and sets up the emoji click event.
       */
      const waitForPicker = () => {
        const picker = this.shadowRoot.querySelector('emoji-picker')
        if (picker) {
          picker.addEventListener('emoji-click', event => {
            const emoji = event.detail.unicode
            const input = this.shadowRoot.querySelector('#messageInput')
            input.value += emoji
            input.focus()
          })
        } else {
          setTimeout(waitForPicker, 100)
        }
      }
      waitForPicker()
    }

    /**
     * Sends a message to the WebSocket server.
     */
    sendMessage () {
      const input = this.shadowRoot.querySelector('#messageInput')
      const text = input.value.trim()
      if (text && this.socket?.readyState === WebSocket.OPEN) {
        const message = { type: 'message', data: text, username: this.username, key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd' }
        this.socket.send(JSON.stringify(message))
        input.value = ''
      }
    }

    /**
     * Renders the chat UI with styles and structure.
     */
    renderChatUI () {
      this.shadowRoot.innerHTML = `
      <style>
        .chat {
          display: flex;
          flex-direction: column;
          height: 350px;
          width: 45%;
          background: #111;
          color: white;
          padding: 10px;
          box-sizing: border-box;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          font-family: monospace;
          font-size: 0.9rem;
          padding: 5px;
          border: 1px solid #333;
          margin-bottom: 10px;
          background: #222;
        }
        .input-area {
          display: flex;
          gap: 10px;
        }
        textarea {
          flex: 1;
          resize: none;
          height: 50px;
          padding: 5px;
        }
        button {
          padding: 5px 10px;
        }
        emoji-picker {
          width: 50%;
          max-height: 300px;
          overflow: auto;
          right: 10px;
          position: absolute;
        }
      </style>
      <div class="chat">
        <div class="messages" id="messages"></div>
          <emoji-picker></emoji-picker>
        <div class="input-area">
          <textarea id="messageInput" placeholder="Type a message..."></textarea>
          <button id="sendButton">Send</button>
        </div>
      </div>
    `
    }

    /**
     * Renders the chat messages in the UI.
     */
    renderMessages () {
      const container = this.shadowRoot.querySelector('#messages')
      if (!container) return
      container.innerHTML = this.messages.map(msg => `
      <div><strong>${msg.username}:</strong> ${msg.data}</div>
    `).join('')
      container.scrollTop = container.scrollHeight
    }
  })
