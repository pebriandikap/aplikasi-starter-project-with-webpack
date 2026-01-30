import { loginUser } from '../../data/api.js';
import { showLoading, hideLoading } from '../../utils/index.js';
import { updateAuthLinks } from '../app.js';

const LoginPage = () => {
  const render = async () => `
    <section class="auth-page">
      <div class="auth-card">
        <h2>Login</h2>
        <form id="login-form" class="auth-form">
          <label>Email</label>
          <input type="email" id="email" required placeholder="Masukkan email kamu" />
          
          <label>Password</label>
          <input type="password" id="password" required placeholder="Masukkan kata sandi" />

          <button type="submit">Login</button>
        </form>
        <p class="auth-text">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
      </div>
    </section>
  `;

  const afterRender = () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      showLoading();
      try {
        await loginUser({ email, password });
        alert('Login berhasil!');
        updateAuthLinks();
        window.location.hash = '/';
      } catch (err) {
        alert(err.message);
      } finally {
        hideLoading();
      }
    });
  };

  return { render, afterRender };
};

export default LoginPage;
