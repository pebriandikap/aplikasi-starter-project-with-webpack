import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
  this.#drawerButton.addEventListener("click", () => {
    const isOpen = this.#navigationDrawer.classList.toggle("open");
    this.#drawerButton.setAttribute("aria-expanded", isOpen);
  });

  document.body.addEventListener("click", (event) => {
    if (
      !this.#navigationDrawer.contains(event.target) &&
      !this.#drawerButton.contains(event.target)
    ) {
      this.#navigationDrawer.classList.remove("open");
      this.#drawerButton.setAttribute("aria-expanded", "false");
    }

    this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
      if (link.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }
    });
  });
}


  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    const mainContent = this.#content;

    //efek
    mainContent.classList.add("fade-out");
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Render
    mainContent.innerHTML = await page.render();
    await page.afterRender();

    mainContent.classList.remove("fade-out");
    mainContent.classList.add("fade-in");

    setTimeout(() => mainContent.classList.remove("fade-in"), 300);
  }
}

export function updateAuthLinks() {
  const navList = document.querySelector('.nav-list');
  navList.innerHTML = `
    <li><a href="#/">Home</a></li>
    <li><a href="#/map">Map</a></li>
    <li><a href="#/about">About</a></li>
  `;

  const token = localStorage.getItem('authToken');
  if (token) {
    navList.innerHTML +=`
    <li><a href="#/add-story">Tambah Story</a></li>
    `;
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = () => {
      localStorage.removeItem('authToken');
      alert('Berhasil logout');
      window.location.hash = '#/login';
      updateAuthLinks();
    };
    navList.appendChild(logoutBtn);
  } 
  else {
    navList.innerHTML += `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}


document.addEventListener('DOMContentLoaded', updateAuthLinks);


export default App;
