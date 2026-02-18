// googleTranslateUtils.ts

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
      translateElementInit: any;
    };
    googleTranslateElementInit: any;
  }
}

export const loadGoogleTranslateScript = () => {
  if (!document.querySelector("script[src*='//translate.google.com']")) {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
  }
};

export const googleTranslateElementInit = () => {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "sa",
      autoDisplay: false,
    },
    "google_translate_element"
  );
};
