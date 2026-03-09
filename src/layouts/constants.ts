import { SIGN_IN_PATH, SIGN_UP_PATH } from '../constants/routes.constant';
import type { AuthLayoutMode, ModeConfig } from '../types/auth-layout.type';

export const modeConstants: Record<AuthLayoutMode, ModeConfig> = {
  signin: {
    footerText: 'Ещё нет аккаунта?',
    footerSubText: 'Зарегистрироваться',
    footerNavigateTo: SIGN_UP_PATH,
  },
  signup: {
    footerText: 'Уже есть аккаунт?',
    footerSubText: 'Войти',
    footerNavigateTo: SIGN_IN_PATH,
  },
};
