import { registerUser } from '../../data/api.js';
import { showLoading, hideLoading } from '../../utils/index.js';

const RegisterPage = () => {
  const render = async () => `
    <section class="auth-page">
      <div class="auth-card">
        <h2>Daftar Akun Baru</h2>
        <form id="registerForm" class="auth-form">
          <label>Nama</label>
          <input type="text" id="name" required placeholder="Masukkan nama lengkap" />
          <label>Email</label>
          <input type="email" id="email" required placeholder="Masukkan email aktif" />
          <label>Password</label>
          <input type="password" id="password" required placeholder="Masukkan kata sandi" />
          <button type="submit">Daftar</button>
        </form>
        <p class="auth-text">Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </div>
    </section>
  `;

  const afterRender = async () => {
    const form = document.querySelector('#registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showLoading();
      try {
        await registerUser({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
        });
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
      } catch (err) {
        alert(err.message);
      } finally {
        hideLoading();
      }
    });
  };

  return { render, afterRender };
};

export default RegisterPage;
