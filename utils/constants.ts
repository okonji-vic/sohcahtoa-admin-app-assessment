export const ROUTE_PATH = Object.freeze({
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: {
    DASHBOARD_PATH: "/dashboard",
    get CALCULATOR_PATH() {
      return `${this.DASHBOARD_PATH}/calculator`;
    },
    get TRANSACTIONS_PATH() {
      return `${this.DASHBOARD_PATH}/transactions`;
    },
    get CARDS_PATH() {
      return `${this.DASHBOARD_PATH}/cards`;
    },
  },
});

