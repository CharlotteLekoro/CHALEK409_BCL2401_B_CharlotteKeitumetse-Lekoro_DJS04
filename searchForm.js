import { authors, genres } from "./data.js";

class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Attach shadow DOM
  }

  connectedCallback() {
    this.render(); // Render the component's HTML
    this.addEventListeners(); // Add event listeners
  }

  render() {
    const genreOptions = this.createOptions(genres, "All Genres"); // Create genre options
    const authorOptions = this.createOptions(authors, "All Authors"); // Create author options

    this.shadowRoot.innerHTML = `
      <style>
        /* Add your CSS styles here */
      </style>
      <form data-search-form>
        <input type="text" data-search-title placeholder="Search by title">
        <select data-search-genres>
          ${genreOptions}  // Insert genre options
        </select>
        <select data-search-authors>
          ${authorOptions}  // Insert author options
        </select>
        <button type="submit">Search</button>
        <button type="button" data-search-cancel>Cancel</button>
      </form>
    `;
  }

  createOptions(data, defaultText) {
    let options = `<option value="any">${defaultText}</option>`;
    for (const [id, name] of Object.entries(data)) {
      options += `<option value="${id}">${name}</option>`;
    }
    return options;
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector("[data-search-form]")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const filters = Object.fromEntries(new FormData(event.target));
        this.dispatchEvent(new CustomEvent("search", { detail: filters }));
      });

    this.shadowRoot
      .querySelector("[data-search-cancel]")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("cancel"));
      });
  }
}

customElements.define("search-form", SearchForm); // Define the custom element
