import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    dashboard: "Dashboard",
    registerLand: "Register Land",
    profile: "Profile",
    earnings: "Earnings",
    verification: "Verification",
    farmName: "Farm Name",
    landType: "Land Type",
    polygonControls: "Polygon Controls",
    drawBoundary: "Draw Boundary",
    reset: "Reset",
    undo: "Undo",
    confirmLandArea: "Confirm Land Area",
    estimatedArea: "Estimated Area",
    location: "Location",
    perimeter: "Perimeter",
    mappingTip: "Mapping Tip",
    mappingTipText: "Click on the map to place vertices. Connect the last point to the first to close the polygon.",
    searchLocation: "Search Location",
    myLocation: "My Location",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్",
    registerLand: "భూమిని నమోదు చేయండి",
    profile: "ప్రొఫైల్",
    earnings: "సంపాదన",
    verification: "ధృవీకరణ",
    farmName: "ఫారం పేరు",
    landType: "భూమి రకం",
    polygonControls: "పాలిగాన్ నియంత్రణలు",
    drawBoundary: "సరిహద్దును గీయండి",
    reset: "రీసెట్",
    undo: "అన్డూ",
    confirmLandArea: "భూమి ప్రాంతాన్ని ధృవీకరించండి",
    estimatedArea: "అంచనా వేసిన ప్రాంతం",
    location: "స్థానం",
    perimeter: "చుట్టుకొలత",
    mappingTip: "మ్యాపింగ్ చిట్కా",
    mappingTipText: "శీర్షాలను ఉంచడానికి మ్యాప్‌పై క్లిక్ చేయండి. పాలిగాన్‌ను మూసివేయడానికి చివరి పాయింట్‌ను మొదటి దానికి కనెక్ట్ చేయండి.",
    searchLocation: "స్థానాన్ని శోధించండి",
    myLocation: "నా స్థానం",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    registerLand: "भूमि पंजीकरण",
    profile: "प्रोफ़ाइल",
    earnings: "कमाई",
    verification: "सत्यापन",
    farmName: "खेत का नाम",
    landType: "भूमि का प्रकार",
    polygonControls: "पॉलीगॉन नियंत्रण",
    drawBoundary: "सीमा खींचें",
    reset: "रीसेट",
    undo: "पूर्ववत करें",
    confirmLandArea: "भूमि क्षेत्र की पुष्टि करें",
    estimatedArea: "अनुमानित क्षेत्र",
    location: "स्थान",
    perimeter: "परिधि",
    mappingTip: "मैपिंग टिप",
    mappingTipText: "शीर्ष रखने के लिए मानचित्र पर क्लिक करें। बहुभुज को बंद करने के लिए अंतिम बिंदु को पहले बिंदु से जोड़ें।",
    searchLocation: "स्थान खोजें",
    myLocation: "मेरा स्थान",
  }
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = (key) => translations[lang][key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
