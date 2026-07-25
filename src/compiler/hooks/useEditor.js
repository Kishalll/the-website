/**
 * Custom hook for managing editor state.
 */
import { useState, useCallback } from "react";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../types/languages";

export function useEditor() {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(
    () => LANGUAGES.find((l) => l.id === DEFAULT_LANGUAGE)?.template ?? ""
  );
  const [stdin, setStdin] = useState("");

  const changeLanguage = useCallback((newLang) => {
    setLanguageState(newLang);
    const langDef = LANGUAGES.find((l) => l.id === newLang);
    if (langDef) {
      setCode(langDef.template);
    }
  }, []);

  return {
    language,
    setLanguage: changeLanguage,
    code,
    setCode,
    stdin,
    setStdin,
  };
}
