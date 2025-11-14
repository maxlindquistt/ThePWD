const template = document.createElement('template')
template.innerHTML = `
<style>
        :host {
          display: block;
          position: relative;
          width: 100vw;
          height: 100vh;
        }
        .desktop {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        pwd-dock {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
      </style>
      <div class="desktop">
        <pwd-dock></pwd-dock>
      </div>
`
customElements.define('pwd-desktop',
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
  }
)
