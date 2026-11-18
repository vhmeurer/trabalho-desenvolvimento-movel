import { useEffect } from 'react';
import type { MD3Theme } from 'react-native-paper';

const STYLE_ID = 'autofill-theme';

export function useAutofillStyle(theme: MD3Theme) {
  const background = theme.colors.background;
  const text = theme.colors.onSurface;

  useEffect(() => {
    let element = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!element) {
      element = document.createElement('style');
      element.id = STYLE_ID;
      document.head.appendChild(element);
    }
    element.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px ${background} inset !important;
        box-shadow: 0 0 0 1000px ${background} inset !important;
        -webkit-text-fill-color: ${text} !important;
        caret-color: ${text};
        transition: background-color 99999s ease-out 0s;
      }
    `;
  }, [background, text]);
}
