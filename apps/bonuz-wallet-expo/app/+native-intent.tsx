import * as Linking from 'expo-linking';

export const redirectSystemPath = ({ path, initial }: { path: string; initial: boolean }) => {
  try {
    const url = new URL(path);

    if (url.pathname.includes('wc:')) {
      return '/wc';
    }
    return path;
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return '/unexpected-error';
  }
};
