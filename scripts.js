import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Data Store
const dataStore = {
  books,
  authors,
  genres,
  matches: books,
  page: 1,
};

// Query Selectors
const selectors = {
  listItems: document.querySelector("[data-list-items]"),
  searchGenres: document.querySelector("[data-search-genres]"),
  searchAuthors: document.querySelector("[data-search-authors]"),
  settingsTheme: document.querySelector("[data-settings-theme]"),
  settingsOverlay: document.querySelector("[data-settings-overlay]"),
  searchOverlay: document.querySelector("[data-search-overlay]"),
  searchTitle: document.querySelector("[data-search-title]"),
  listButton: document.querySelector("[data-list-button]"),
  listMessage: document.querySelector("[data-list-message]"),
  listActive: document.querySelector("[data-list-active]"),
  listBlur: document.querySelector("[data-list-blur]"),
  listImage: document.querySelector("[data-list-image]"),
  listTitle: document.querySelector("[data-list-title]"),
  listSubtitle: document.querySelector("[data-list-subtitle]"),
  listDescription: document.querySelector("[data-list-description]"),
};

// Utility Functions
const createOptionElement = (value, text) => {
  const element = document.createElement("option");
  element.value = value;
  element.innerText = text;
  return element;
};

const createBookElement = ({ author, id, image, title }) => {
  const element = document.createElement("button");
  element.classList.add("preview");
  element.setAttribute("data-preview", id);

  element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${dataStore.authors[author]}</div>
        </div>
      `;
  return element;
};

const renderOptions = (data, container, defaultText) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createOptionElement("any", defaultText));

  for (const [id, name] of Object.entries(data)) {
    fragment.appendChild(createOptionElement(id, name));
  }

  container.appendChild(fragment);
};

const renderBooks = (booksToRender, container) => {
  const fragment = document.createDocumentFragment();
  booksToRender.forEach((book) =>
    fragment.appendChild(createBookElement(book))
  );
  container.innerHTML = "";
  container.appendChild(fragment);
};

const updateShowMoreButton = () => {
  const remaining = dataStore.matches.length - dataStore.page * BOOKS_PER_PAGE;
  selectors.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
      `;
  selectors.listButton.disabled = remaining <= 0;
};

const setTheme = (theme) => {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
};

const filterBooks = (filters) => {
  return dataStore.books.filter((book) => {
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    const titleMatch =
      !filters.title ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    return genreMatch && titleMatch && authorMatch;
  });
};

const showBookDetails = (book) => {
  selectors.listActive.open = true;
  selectors.listBlur.src = book.image;
  selectors.listImage.src = book.image;
  selectors.listTitle.innerText = book.title;
  selectors.listSubtitle.innerText = `${
    dataStore.authors[book.author]
  } (${new Date(book.published).getFullYear()})`;
  selectors.listDescription.innerText = book.description;
};

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderBooks(dataStore.matches.slice(0, BOOKS_PER_PAGE), selectors.listItems);
  renderOptions(dataStore.genres, selectors.searchGenres, "All Genres");
  renderOptions(dataStore.authors, selectors.searchAuthors, "All Authors");

  const theme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "night"
      : "day";
  selectors.settingsTheme.value = theme;
  setTheme(theme);

  updateShowMoreButton();
});

// Event Handlers
const handleEvents = () => {
  selectors.searchGenres.addEventListener("click", () => {
    selectors.searchOverlay.open = true;
  });

  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      selectors.searchOverlay.open = true;
      selectors.searchTitle.focus();
    });

  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      selectors.settingsOverlay.open = true;
    });

  selectors.listButton.addEventListener("click", () => {
    const start = dataStore.page * BOOKS_PER_PAGE;
    const end = (dataStore.page + 1) * BOOKS_PER_PAGE;
    renderBooks(dataStore.matches.slice(start, end), selectors.listItems);
    dataStore.page += 1;
    updateShowMoreButton();
  });

  selectors.listItems.addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    const activePreview = pathArray.find((node) => node?.dataset?.preview);
    if (activePreview) {
      const book = dataStore.books.find(
        (book) => book.id === activePreview.dataset.preview
      );
      if (book) {
        showBookDetails(book);
      }
    }
  });

  selectors.listActive.addEventListener("click", () => {
    selectors.listActive.open = false;
  });

  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const { theme } = Object.fromEntries(new FormData(event.target));
      setTheme(theme);
      selectors.settingsOverlay.open = false;
    });

  document
    .querySelector("[data-search-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const filters = Object.fromEntries(new FormData(event.target));
      dataStore.matches = filterBooks(filters);
      dataStore.page = 1;
      renderBooks(
        dataStore.matches.slice(0, BOOKS_PER_PAGE),
        selectors.listItems
      );
      updateShowMoreButton();
      window.scrollTo({ top: 0, behavior: "smooth" });
      selectors.searchOverlay.open = false;
    });

  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      selectors.searchOverlay.open = false;
    });

  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      selectors.settingsOverlay.open = false;
    });
};

// Initialize Event Handlers
handleEvents();

selectors.listButton.addEventListener("click", () => {
  const start = dataStore.page * BOOKS_PER_PAGE;
  const end = (dataStore.page + 1) * BOOKS_PER_PAGE;
  renderBooks(dataStore.matches.slice(start, end), selectors.listItems);
  dataStore.page += 1;
  updateShowMoreButton();
});

selectors.listItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.composedPath());
  const activePreview = pathArray.find((node) => node?.dataset?.preview);
  if (activePreview) {
    const book = dataStore.books.find(
      (book) => book.id === activePreview.dataset.preview
    );
    if (book) {
      showBookDetails(book);
    }
  }
});

selectors.listActive.addEventListener("click", () => {
  selectors.listActive.open = false;
});

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const { theme } = Object.fromEntries(new FormData(event.target));
    setTheme(theme);
    selectors.settingsOverlay.open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const filters = Object.fromEntries(new FormData(event.target));
    dataStore.matches = filterBooks(filters);
    dataStore.page = 1;
    renderBooks(
      dataStore.matches.slice(0, BOOKS_PER_PAGE),
      selectors.listItems
    );
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    selectors.searchOverlay.open = false;
  });

document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  selectors.searchOverlay.open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    selectors.settingsOverlay.open = false;
  });

// Initialize Event Handlers
handleEvents();
