import { useEffect, useState } from "react";

export function useColorScheme() {
  const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  const [colorScheme, setColorScheme] = useState(colorSchemeQueryList.matches ? 'dark' : 'light');
  useEffect(() => {
    const handleSetColorScheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setColorScheme('dark');
      } else {
        setColorScheme('light');
      }
    };
    handleSetColorScheme(colorSchemeQueryList);
    colorSchemeQueryList.addEventListener('change', handleSetColorScheme);
    return () => {
      colorSchemeQueryList.removeEventListener('change', handleSetColorScheme);
    };
  });
  return colorScheme;
}
