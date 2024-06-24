import { useAppleLogin } from '@/features/apple';
import { useEmailLogin } from '@/features/email';
import { useGoogleLogin } from '@/features/Google';
import { useUserStore } from '@/store';

export type loginParams =
  | {
      provider: 'google' | 'apple';
    }
  | {
      provider: 'email';
      email: string;
      onLoginComplete: () => void;
    };

export const useLogin = () => {
  const { login: loginGoogle } = useGoogleLogin();
  const { login: loginApple } = useAppleLogin();
  const { login: loginEmail } = useEmailLogin();
  const clear = useUserStore((state) => state.clear);

  const login = async (options: loginParams) => {
    const { provider } = options;
    switch (provider) {
      case 'google': {
        await loginGoogle();

        break;
      }
      case 'apple': {
        await loginApple();

        break;
      }
      case 'email': {
        await loginEmail(options.email, options.onLoginComplete);

        break;
      }
      // No default
    }
  };

  const logout = () => {
    clear();
  };

  return { login, logout };
};
