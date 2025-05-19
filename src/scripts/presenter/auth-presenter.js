// presenter/auth-presenter.js
import { loginUser, registerUser } from '../data/api.js';

export async function doLogin(email, password, onSuccess, onError) {
  try {
    const response = await loginUser({ email, password });
    onSuccess(response); //callback sukses
  } catch (error) {
    console.error('Login gagal:', error);
    onError({ error: true, message: 'Login gagal. Silakan coba lagi.' }); //callback error
  }
}

export async function doRegister(name, email, password, onSuccess, onError) {
  try {
    const response = await registerUser({ name, email, password });
    onSuccess(response);
  } catch (error) {
    console.error('Registrasi gagal:', error);
    onError({ error: true, message: 'Registrasi gagal. Silakan coba lagi.' });
  }
}
