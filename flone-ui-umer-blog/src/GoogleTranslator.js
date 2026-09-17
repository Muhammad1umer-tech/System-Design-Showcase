import React, { useEffect } from "react";
import i18n from "./i18n";
import {setCurrency} from '../src/store/slices/currency-slice'
import { useDispatch } from "react-redux";

const GoogleTranslate = () => {
  const dispatch = useDispatch()
  let userLang = navigator.language || navigator.userLanguage;
  let firstPart = userLang.split("-")[0];
  console.log(firstPart);
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.onerror = () => {
        console.error("Failed to load the Google Translate script");
      };
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: firstPart,
            includedLanguages: "en,fr,de",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
      } catch (error) {
        console.error("Error initializing Google Translate:", error);
      }
    };

    addGoogleTranslateScript();

  }, [firstPart]);

  return (
    <div>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;