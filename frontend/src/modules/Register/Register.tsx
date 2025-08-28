import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // Путь может быть другим, например ../../context/AuthContext
import { useAuth } from '../../contexts/AuthContext';
import style from './Register.module.scss';
const API_URL = 'http://localhost:4000';

type User = {
  email: string;
  password: string;
};

export const Register: React.FC = () => {
  const { isLoggedIn, login } = useAuth(); // Получаем и статус, и функцию
  const navigate = useNavigate(); // Хук для перенаправления

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/myProducts'); // или navigate('/')
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Ошибка');
        return;
      }

      if (mode === 'login') {
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          login(); // Сообщаем всему приложению, что вход выполнен!
          // Редирект произойдет автоматически благодаря useEffect выше.
          // Сообщение об успехе не нужно, т.к. пользователь сразу покинет страницу.
        } else {
          setMessage('Ошибка: не удалось получить токены от сервера.');
        }
      } else {
        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setMode('login');
      }
    } catch (error) {
      setMessage('Ошибка соединения с сервером');
      console.error(error);
    }
  };

  // Этот компонент теперь рендерит ТОЛЬКО форму.
  // Логика "что показать, если залогинен" отсюда убрана.
  return (
    <section className={style.register}>
      <div
        style={{
          maxWidth: 400,
          margin: '2rem auto',
          padding: 20,
          border: '1px solid #ccc',
          borderRadius: 8,
        }}
      >
        <h2 className={style.title}>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h2>

        {message && (
          <p
            style={{
              color: message.includes('ошиб') ? 'red' : 'green',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={user.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: 10 }}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ marginTop: 12, textAlign: 'center' }}>
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже зарегистрированы?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage('');
            }}
            className={style.loginOption}
            // style={{
            //   background: 'none',
            //   border: 'none',
            //   color: 'blue',
            //   cursor: 'pointer',
            //   padding: 0,
            // }}
          >
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войти'}
          </button>
        </p>
      </div>
    </section>
  );
};
