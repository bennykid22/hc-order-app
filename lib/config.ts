export const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwMG2cXdyoHEooupQnApCEIMT3I7Je2LLJzzFBp8SmtdNJKCLtK8Hg-2ImKFXGe7gt2TA/exec";

export const MENU_ITEMS = [
  {
    name: "Butter Croissant",
    price: 4.50,
    description: "Premium Isigny butter",
    image: "/menu/Butter Croissant.JPG",
    imageLarge: "/menu/large/Butter Croissant.JPG",
  },
  {
    name: "Pain Au Chocolat",
    price: 5.00,
    description: "Callebaut chocolate batons",
    image: "/menu/Pain Au Chocolat.JPG",
    imageLarge: "/menu/large/Pain Au Chocolat.JPG",
  },
  {
    name: "Potato & Sea Salt",
    price: 5.50,
    description: "Peleton Estate EVOO & sea salt — signature best seller",
    image: "/menu/Potato & Sea Salt.JPG",
    imageLarge: "/menu/large/Potato & Sea Salt.JPG",
  },
  {
    name: "Ham & Cheese",
    price: 8.00,
    description: "Emilio's butchery ham, King Island smoked cheddar",
    image: "/menu/Ham & Cheese.JPG",
    imageLarge: "/menu/large/Ham & Cheese.JPG",
  },
  {
    name: "Bacon & Maple",
    price: 8.00,
    description: "Kazcanowski smoked bacon, redgum salt & maple glaze",
    image: "/menu/Bacon & Maple.JPG",
    imageLarge: "/menu/large/Bacon & Maple.JPG",
  },
  {
    name: "Apple Crumble",
    price: 7.00,
    description: "Wild Mother apple cider vinegar, cinnamon crumble & mascarpone cream",
    image: "/menu/Apple Crumble.JPG",
    imageLarge: "/menu/large/Apple Crumble.JPG",
  },
  {
    name: "Cardamom Kouign-Amann",
    price: 5.50,
    description: "Brown butter & vanilla bean syrup glaze",
    image: "/menu/Cardamom Kouign Amann.JPG",
    imageLarge: "/menu/large/Cardamom Kouign Amann.JPG",
  },
];

export const CUSTOMERS: Record<string, { name: string; email: string }> = {
  "beta-coffee": {
    name: "Beta Coffee",
    email: "hello@betacoffee.com.au",
  },
  "algorithm-potts-point": {
    name: "Algorithm Potts Point",
    email: "",
  },
  "diggy-doos": {
    name: "Diggy Doos",
    email: "",
  },
};

export const DELIVERY_FEE = 20;
export const FREE_DELIVERY_THRESHOLD = 120;
export const VOLUME_DISCOUNT_THRESHOLD = 40;
export const VOLUME_DISCOUNT_RATE = 0.10;
export const BEN_EMAIL = "ben@homecroissanterie.com.au";
