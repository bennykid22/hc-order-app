export const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzxL0To4nU_C8TLhS9oEcYX8YvgUWh0upZlasLjhdyzrBdsajPA5Lv8wvL_miE8fsMbvw/exec";

export const MENU_ITEMS = [
  {
    name: "Butter Croissant",
    price: 4.50,
    description: "Premium Isigny butter",
  },
  {
    name: "Pain Au Chocolat",
    price: 5.00,
    description: "Callebaut chocolate batons",
  },
  {
    name: "Potato & Sea Salt",
    price: 5.50,
    description: "Peleton Estate EVOO & sea salt — signature best seller",
  },
  {
    name: "Ham & Cheese",
    price: 8.00,
    description: "Emilio's butchery ham, King Island smoked cheddar",
  },
  {
    name: "Bacon & Maple",
    price: 8.00,
    description: "Kazcanowski smoked bacon, redgum salt & maple glaze",
  },
  {
    name: "Apple Crumble",
    price: 7.00,
    description: "Wild Mother apple cider vinegar, cinnamon crumble & mascarpone cream",
  },
  {
    name: "Cardamom Kouign-Amann",
    price: 5.50,
    description: "Brown butter & vanilla bean syrup glaze",
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
