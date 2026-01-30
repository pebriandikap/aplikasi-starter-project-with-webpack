export default class HomePage {
  async render() {
    return `
      <section class="home container">
        <h1>Selamat Datang di Halaman Home Page</h1>
        <p>Temukan berbagai cerita menarik dari pengguna di sekitar Anda.</p>
      </section>
    `;
  }

  async afterRender() {
    // donothing
  }
}
