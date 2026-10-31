import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Cada test empieza sin sesión guardada, como un visitante nuevo
beforeEach(() => {
  localStorage.clear();
});

// Sin token en localStorage, la aplicación debe mostrar la pantalla de login
test('muestra la pantalla de inicio de sesión cuando no hay sesión', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
});

// El botón "Regístrate" debe mostrar el formulario de registro
test('permite pasar al formulario de registro', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /regístrate/i }));
  expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /volver al login/i })).toBeInTheDocument();
});
