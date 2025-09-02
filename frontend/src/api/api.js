/**
 * Функция для полного выхода из системы.
 */
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};

/**
 * Запрашивает новую пару токенов с помощью refresh-токена.
 */
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // const response = await fetch('http://localhost:4000/refresh-token', {
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    // Если даже refresh-токен не сработал (истек или невалиден), то выходим
    throw new Error('Failed to refresh token');
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await response.json();

  localStorage.setItem('accessToken', newAccessToken);
  localStorage.setItem('refreshToken', newRefreshToken);

  return newAccessToken; // Возвращаем новый access токен для повторного запроса
};

/**
 * Главная функция-обертка для всех защищенных API-запросов.
 */
export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');

  if (!options.headers) {
    options.headers = {};
  }
  options.headers['Authorization'] = `Bearer ${token}`;

  if (!(options.body instanceof FormData) && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }

  // Делаем первоначальный запрос
  let response = await fetch(url, options);

  // Если ответ - 401 Unauthorized (токен истек), пытаемся его обновить
  if (response.status === 401) {
    try {
      console.log('Access токен истек, пытаюсь обновить...');
      const newToken = await refreshAuthToken();
      console.log('Токен успешно обновлен.');

      // Обновляем заголовок с новым токеном
      options.headers['Authorization'] = `Bearer ${newToken}`;

      // Повторяем исходный запрос с новым токеном
      console.log('Повторяю исходный запрос...');
      response = await fetch(url, options);
    } catch (error) {
      console.error(
        'Не удалось обновить токен, полный выход из системы.',
        error,
      );
      logout(); // Если обновить токен не удалось - выходим
      throw new Error('Session expired.');
    }
  }

  return response;
};

// при логине получаем accessToken, refreshToken нужно оба сохранить
// в localStorage
// localStorage.setItem('accessToken', data.accessToken);
// localStorage.setItem('refreshToken', data.refreshToken);
