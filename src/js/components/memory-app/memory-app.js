customElements.define('memory-app',
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
      this.tiles = []
      this.flipped = []
      this.matched = new Set()
      this.attempts = 0
      this.gridSize = '4x4'
      this.totalPairs = 0
      this.startTime = null
      this.elapsedTime = 0
      this.timerInterval = null
    }

    /**
     * Runs when the element is connected to the DOM.
     */
    connectedCallback () {
      this.render()
      this.initGame()
      this.addEventListener('keydown', (e) => this.handleKeyboardFlip(e))
      this.setAttribute('tabindex', '0') // make host focusable
      this.focus() // optionally auto-focus it
    }

    /**
     * Updates the timer display in the UI.
     */
    updateTimerDisplay () {
      const timerEl = this.shadowRoot.querySelector('#timer')
      if (timerEl) {
        timerEl.textContent = `Time: ${this.elapsedTime}s`
      }
    }

    /**
     * Initializes the game by setting up the tiles and resetting the game state.
     */
    initGame () {
      this.tiles = []
      this.flipped = []
      this.matched = new Set()
      this.attempts = 0

      const sizes = {
        '4x4': 8,
        '4x2': 4,
        '2x2': 2
      }
      const icons = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍒', '🍍', '🥥']
      this.totalPairs = sizes[this.gridSize]
      const tileIcons = icons.slice(0, this.totalPairs)
      const paired = [...tileIcons, ...tileIcons]
      this.tiles = paired.sort(() => 0.5 - Math.random()).map((icon, index) => ({
        id: index,
        icon,
        flipped: false
      }))
      this.startTime = Date.now()
      this.elapsedTime = 0
      clearInterval(this.timerInterval)
      this.timerInterval = setInterval(() => {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
        this.updateTimerDisplay()
      }, 1000)

      this.render()
    }

    /**
     * Flips a tile by its ID.
     *
     * @param {number} id The ID of the tile to flip.
     */
    flipTile (id) {
      const tile = this.tiles[id]
      if (tile.flipped || this.flipped.length === 2 || this.matched.has(tile.id)) return

      tile.flipped = true
      this.flipped.push(tile)
      this.render()

      if (this.flipped.length === 2) {
        this.attempts++
        setTimeout(() => this.checkMatch(), 800)
      }
    }

    /**
     * Checks if the two flipped tiles match.
     */
    checkMatch () {
      const [first, second] = this.flipped
      if (first.icon === second.icon) {
        this.matched.add(first.id)
        this.matched.add(second.id)
      } else {
        first.flipped = false
        second.flipped = false
      }
      this.flipped = []

      if (this.matched.size === this.tiles.length) {
        clearInterval(this.timerInterval)
      }

      this.render()
    }

    /**
     * Handles changes to the grid size selection.
     *
     * @param {event} event The change event object.
     */
    handleGridChange (event) {
      this.gridSize = event.target.value
      this.initGame()
    }

    /**
     * Handles keyboard navigation for flipping tiles.
     *
     * @param {event} event The keyboard event object.
     */
    handleKeyboardFlip (event) {
      const tiles = this.shadowRoot.querySelectorAll('.tile')
      if (!tiles.length) return

      tiles.forEach(tile => { tile.tabIndex = 0 })

      let index = parseInt(this.shadowRoot.activeElement?.dataset.index)
      if (isNaN(index)) index = 0

      switch (event.key) {
        case 'ArrowRight':
          tiles[Math.min(index + 1, tiles.length - 1)].focus()
          break
        case 'ArrowLeft':
          tiles[Math.max(index - 1, 0)].focus()
          break
        case 'Enter':
        case ' ':
          this.flipTile(index)
          break
      }
    }

    /**
     * Renders the game UI.
     */
    render () {
      this.gridSize.replace('x', '-')
      const gameOver = this.matched.size === this.tiles.length

      this.shadowRoot.innerHTML = `
      <style>
      .controls {
        margin-bottom: 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(${this.gridSize.split('x')[0]}, 50px);
        gap: 10px;
      }
      .tile {
        width: 50px;
        height: 50px;
        background: #444;
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
        outline: none;
      }
      .tile.matched {
        background: #2ecc71;
      }
      .tile.flipped {
        background: #3498db;
      }
      .tile:hover,
      .tile:focus {
        outline: 2px solid black;
        outline-offset: 2px;
        box-shadow: none;
      }
      .status {
        margin-top: 10px;
        color: black;
      }
      .button {
        margin-left: 10px;
        padding: 5px 10px;
        cursor: pointer;
      }
      </style>
      <div class="controls">
        <label style="color: white;">
          Grid Size:
          <select id="gridSelector">
            <option value="4x4" ${this.gridSize === '4x4' ? 'selected' : ''}>4x4</option>
            <option value="4x2" ${this.gridSize === '4x2' ? 'selected' : ''}>4x2</option>
            <option value="2x2" ${this.gridSize === '2x2' ? 'selected' : ''}>2x2</option>
          </select>
        </label>
        <button class="button" id="restart">Restart</button>
      </div>
      <div class="grid">
        ${this.tiles.map((tile, i) => `
          <div
            class="tile ${tile.flipped ? 'flipped' : ''} ${this.matched.has(tile.id) ? 'matched' : ''}"
            data-index="${i}"
            tabindex="0"
          >
            ${tile.flipped || this.matched.has(tile.id) ? tile.icon : '?'}
          </div>
        `).join('')}
      </div>
      <div class="status">
        <div id="timer">Time: ${this.elapsedTime}s</div>
        <div>Attempts: ${this.attempts}</div>
        ${gameOver ? `<p>🎉 Game Over! Total Attempts: ${this.attempts} | Time: ${this.elapsedTime}s</p>` : ''}
      </div>
    `

      this.shadowRoot.querySelectorAll('.tile').forEach((el, idx) => {
        el.addEventListener('click', () => this.flipTile(idx))
      })

      this.shadowRoot.querySelector('#gridSelector').addEventListener('change', (e) => this.handleGridChange(e))
      this.shadowRoot.querySelector('#restart').addEventListener('click', () => this.initGame())

      const firstTile = this.shadowRoot.querySelector('.tile')
      if (firstTile) firstTile.focus()

      this.shadowRoot.querySelectorAll('.tile').forEach((el, idx) => {
        el.tabIndex = 0
        el.addEventListener('click', () => this.flipTile(idx))
      })
    }
  })
