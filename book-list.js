import { books, authors } from "./data.js";

class BookList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.page = 1;
    this.booksPerPage = 10;
  }

  connectedCallback() {
    this.render();
    this.updateShowMoreButton();
  }

  render() {
    const booksToRender = this.getBooksToRender();
    const bookElements = booksToRender.map(this.createBookElement).join("");
    this.shadowRoot.innerHTML = `
      <style>
        /* Add your CSS styles here */
      </style>
      <div data-list-items>${bookElements}</div>
      <button data-list-button>Show more</button>
    `;
    this.addEventListeners();
  }

  getBooksToRender() {
    return books.slice(0, this.page * this.booksPerPage);
  }

  createBookElement({ author, id, image, title }) {
    return `
      <button class="preview" data-preview="${id}">
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      </button>
    `;
  }

  addEventListeners() {
    this.shadowRoot
      .querySelector("[data-list-button]")
      .addEventListener("click", () => {
        this.page += 1;
        this.render();
      });

    this.shadowRoot
      .querySelector("[data-list-items]")
      .addEventListener("click", (event) => {
        const activePreview = event.target.closest(".preview");
        if (activePreview) {
          const book = books.find(
            (book) => book.id === activePreview.dataset.preview
          );
          if (book) {
            this.dispatchEvent(
              new CustomEvent("bookSelected", { detail: book })
            );
          }
        }
      });
  }

  updateShowMoreButton() {
    const remaining = books.length - this.page * this.booksPerPage;
    const button = this.shadowRoot.querySelector("[data-list-button]");
    button.innerHTML = `Show more (${remaining > 0 ? remaining : 0})`;
    button.disabled = remaining <= 0;
  }
}

customElements.define("book-list", BookList);
