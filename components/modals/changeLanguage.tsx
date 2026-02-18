import { useRef, useEffect } from "react";
import { Icons, Services } from '@/types/enums';
import { useRouter } from "next/router";
import SVGIcon from '@/components/elements/icons';
import { loadGoogleTranslateScript, googleTranslateElementInit } from '@/components/googleTranslateUtils'



const ChangeLanguageModal = () => {
    const modalRef = useRef<HTMLDivElement>(null)

    // const googleTranslateElementInit = () => {
    //     new window.google.translate.TranslateElement(
    //         {
    //             pageLanguage: "sa",
    //             autoDisplay: false
    //         },
    //         "google_translate_element"
    //     );
    // };

    // const hideGoogleTranslate = () => {
    //     const googleTranslate = document.querySelector("#google_translate_element") as HTMLDivElement;
    //     if (googleTranslate) {
    //         googleTranslate.style.opacity = "0";
    //     } else {
    //         console.log("Google translate element not found");
    //     }
    // };

    // useEffect(() => {
    //     var addScript = document.createElement("script");
    //     addScript.setAttribute(
    //         "src",
    //         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    //     );
    //     document.body.appendChild(addScript);
    //     window.googleTranslateElementInit = googleTranslateElementInit;

    //     const handleModalOpen = () => {
    //         hideGoogleTranslate()
    //     }

    //     handleModalOpen()

    //     const existingScript = document.querySelector("script[src*='//translate.google.com']");

    //     if (!existingScript) {
    //         var addScript = document.createElement("script");
    //         addScript.setAttribute(
    //             "src",
    //             "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    //         );
    //         document.body.appendChild(addScript);
    //         window.googleTranslateElementInit = googleTranslateElementInit;
    //     }

    //     return () => {
    //         const scriptElement = document.querySelector("script[src*='//translate.google.com']");

    //         if (scriptElement && scriptElement.parentNode === document.body) {
    //             document.body.removeChild(scriptElement);
    //         }
    //     };
    // }, []);

    // function changeLanguage(languageCode: string) {
    //     let selectField = document.querySelector(".goog-te-combo") as HTMLSelectElement;

    //     // country code references
    //     //https://www.nationsonline.org/oneworld/country_code_list.htm 

    //     if (selectField) {
    //         selectField.value = languageCode;
    //         selectField.dispatchEvent(new Event("change"));
    //     }
    // }

    // const hideGoogleTranslate = () => {
    //     const googleTranslate = document.querySelector("#google_translate_element") as HTMLDivElement;
    //     if (googleTranslate) {
    //         googleTranslate.style.opacity = "0";
    //     } else {
    //         console.log("Google translate element not found");
    //     }
    // };

    // useEffect(() => {
    //     loadGoogleTranslateScript();
    //     window.googleTranslateElementInit = googleTranslateElementInit;

    //     const handleModalOpen = () => {
    //         const scriptElement = document.querySelector("script[src*='//translate.google.com']");
    //         if (scriptElement) {
    //             scriptElement.remove();
    //         }
    //     };

    //     handleModalOpen();

    //     return () => {
    //         hideGoogleTranslate();
    //     };
    // }, []);


    return (
        <div ref={modalRef} className="modal change-language-modal  fade" id="change-language-modal" aria-hidden="true" tabIndex={-1}>
            <div id="google_translate_element"></div>
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="change-language__header-title text-dark">Select your language</h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body text-dark">
                        <div className="change-language">
                            <div className="change-language__box">
                                <div className="change-language__item flex-start"   data-bs-dismiss="modal" aria-label="Close">
                                    <div className="change-language__item-image">
                                        <SVGIcon src={Icons.IDFlag} height={24} width={24} />
                                    </div>
                                    <p className="change-language__item-name ">
                                        Indonesia
                                    </p>
                                </div>
                                <div className="change-language__item flex-start"   data-bs-dismiss="modal" aria-label="Close">
                                    <div className="change-language__item-image">
                                        <SVGIcon src={Icons.USFlag} height={24} width={24} />
                                    </div>
                                    <p className="change-language__item-name ">
                                        English(US)
                                    </p>
                                </div>
                                <div className="change-language__item flex-start"   data-bs-dismiss="modal" aria-label="Close">
                                    <div className="change-language__item-image">
                                        <SVGIcon src={Icons.SAFlag} height={24} width={24} />
                                    </div>
                                    <p className="change-language__item-name ">
                                        Arabic
                                    </p>
                                </div>
                                <div className="change-language__item flex-start"  data-bs-dismiss="modal" aria-label="Close">
                                    <div className="change-language__item-image">
                                        <SVGIcon src={Icons.RUFlag} height={24} width={24} />
                                    </div>
                                    <p className="change-language__item-name ">
                                        Russia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChangeLanguageModal;