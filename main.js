import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

class BookList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.dataStore = { books, authors, genres, matches: books, page: 1 };
    this.BOOKS_PER_PAGE = BOOKS_PER_PAGE;
    this.render();
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Your styles here */
      </style>
      <div>
        <div data-list-items></div>
        <button data-list-button>Show more</button>
      </div>
    `;

    this.selectors = {
      listItems: this.shadowRoot.querySelector("[data-list-items]"),
      listButton: this.shadowRoot.querySelector("[data-list-button]"),
    };

    this.renderBooks(
      this.dataStore.matches.slice(0, this.BOOKS_PER_PAGE),
      this.selectors.listItems
    );
    this.updateShowMoreButton();
  }

  renderBooks(booksToRender, container) {
    const fragment = document.createDocumentFragment();
    booksToRender.forEach((book) =>
      fragment.appendChild(this.createBookElement(book))
    );
    container.innerHTML = "";
    container.appendChild(fragment);
  }

  createBookElement({ author, id, image, title }) {
    const element = document.createElement("button");
    element.classList.add("preview");
    element.setAttribute("data-preview", id);

    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${this.dataStore.authors[author]}</div>
      </div>
    `;
    return element;
  }

  updateShowMoreButton() {
    const remaining =
      this.dataStore.matches.length - this.dataStore.page * this.BOOKS_PER_PAGE;
    this.selectors.listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;
    this.selectors.listButton.disabled = remaining <= 0;
  }

  addEventListeners() {
    this.selectors.listButton.addEventListener("click", () => {
      const start = this.dataStore.page * this.BOOKS_PER_PAGE;
      const end = (this.dataStore.page + 1) * this.BOOKS_PER_PAGE;
      this.renderBooks(
        this.dataStore.matches.slice(start, end),
        this.selectors.listItems
      );
      this.dataStore.page += 1;
      this.updateShowMoreButton();
    });
  }
}

customElements.define("book-list", BookList);

// Similarly define other components like SearchForm, BookDetails, and SettingsForm
