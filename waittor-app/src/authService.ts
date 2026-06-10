// Переменная объявлена на уровне модуля.
// Она недоступна из window и скрыта от внешнего кода.
let accessToken: string | null = null;

export const authService = {
  setToken(token: string): void {
    console.log("setToken=", token)
    accessToken = token;
  },

  getToken(): string | null {
    return accessToken;
  },

  clearToken(): void {
    accessToken = null;
  },
};
