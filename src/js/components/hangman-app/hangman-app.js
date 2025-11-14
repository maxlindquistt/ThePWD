const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
      padding: 20px;
      border: 2px solid #333;
      border-radius: 10px;
      max-width: 600px;
      background: #f9f9f9;
    }

    .word {
      font-size: 2rem;
      letter-spacing: 0.5rem;
      margin-bottom: 20px;
    }

    .keyboard button {
      margin: 3px;
      padding: 10px;
      font-size: 1rem;
      cursor: pointer;
    }

    .status {
      margin-top: 20px;
      font-weight: bold;
    }
    .tries {
      margin-top: 10px;
      font-size: 1.2rem;
    }
  </style>
  <div class="word" id="word">Loading...</div>
  <div class="keyboard" id="keyboard"></div>
  <div class="tries" id="tries">Tries left: 6</div>
  <div class="status" id="status"></div>
  <button id="retryBtn" style="display: none; margin-top: 15px; padding: 10px;">🔄 Retry</button>
`

customElements.define('hangman-app',
  /**
   *
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the custom element and attaches a shadow DOM.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.word = ''
      this.guessed = new Set()
      this.maxAttempts = 6
      this.wrongGuesses = 0
    }

    /**
     * Called when the element is connected to the DOM.
     */
    connectedCallback () {
      this.wordEl = this.shadowRoot.getElementById('word')
      this.keyboardEl = this.shadowRoot.getElementById('keyboard')
      this.statusEl = this.shadowRoot.getElementById('status')
      this.triesEl = this.shadowRoot.getElementById('tries')

      this.retryBtn = this.shadowRoot.getElementById('retryBtn')
      this.retryBtn.addEventListener('click', () => this.resetGame())

      this.fetchWord()
    }

    /**
     * Updates the number of tries left based on the maximum attempts and wrong guesses.
     */
    updateTriesLeft () {
      const remaining = this.maxAttempts - this.wrongGuesses
      this.triesEl.textContent = `Tries left: ${remaining}`
    }

    /**
     * Fetches a random word from an external API and initializes the game.
     */
    async fetchWord () {
      try {
        const response = await fetch('https://random-word-api.vercel.app/api?words=1')
        const data = await response.json()
        this.word = data[0].toLowerCase()
        this.renderWord()
        this.renderKeyboard()
        this.updateTriesLeft()
      } catch (err) {
        this.wordEl.textContent = 'Error loading word.'
      }
    }

    /**
     * Renders the current word, showing guessed letters and hiding others.
     */
    renderWord () {
      const display = [...this.word].map(letter =>
        this.guessed.has(letter) ? letter : '_'
      ).join(' ')
      this.wordEl.textContent = display
    }

    /**
     * Renders the keyboard with buttons for each letter of the alphabet.
     */
    renderKeyboard () {
      this.keyboardEl.innerHTML = ''
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      for (const letter of letters) {
        const btn = document.createElement('button')
        btn.textContent = letter
        btn.disabled = this.guessed.has(letter)
        btn.addEventListener('click', () => this.handleGuess(letter))
        this.keyboardEl.appendChild(btn)
      }
    }

    /**
     * Handles a letter guess by the user.
     *
     * @param {string} letter - The letter guessed by the user.
     */
    handleGuess (letter) {
      if (this.guessed.has(letter)) return
      this.guessed.add(letter)

      if (!this.word.includes(letter)) {
        this.wrongGuesses++
      }

      this.renderWord()
      this.renderKeyboard()
      this.updateTriesLeft()
      this.checkGameStatus()
    }

    /**
     * Checks the current game status to determine if the user has won or lost.
     */
    checkGameStatus () {
      if ([...this.word].every(l => this.guessed.has(l))) {
        this.statusEl.textContent = '🎉 You win!'
        this.disableAllButtons()
        this.retryBtn.style.display = 'inline-block'
      } else if (this.wrongGuesses >= this.maxAttempts) {
        this.statusEl.textContent = `💀 Game over! Word was "${this.word}"`
        this.disableAllButtons()
        this.retryBtn.style.display = 'inline-block'
      }
    }

    /**
     * Resets the game state to start a new game.
     */
    resetGame () {
      this.word = ''
      this.guessed = new Set()
      this.wrongGuesses = 0
      this.statusEl.textContent = ''
      this.retryBtn.style.display = 'none'
      this.fetchWord()
    }

    /**
     * Disables all buttons in the keyboard and enables the retry button.
     */
    disableAllButtons () {
      this.shadowRoot.querySelectorAll('button').forEach(btn => { btn.disabled = true })
      this.shadowRoot.getElementById('retryBtn').disabled = false
    }
  }
)
