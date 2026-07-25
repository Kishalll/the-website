/**
 * Custom hook for theme management — always dark in ZBC website.
 */

export function useTheme() {
  const theme = "dark";

  const toggleTheme = () => {
    // No-op: ZBC website is always dark
  };

  return { theme, toggleTheme };
}
