import basket_icon from './basket_icon.png';
import logo from './logo.png';
import header_img from './header_img.png';
import search_icon from './search_icon.png';

import product_1 from './product_1.png';
import product_2 from './product_2.png';
import product_3 from './product_3.png';
import product_4 from './product_4.png';
import product_5 from './product_5.png';
import product_6 from './product_6.png';
import product_7 from './product_7.png';
import product_8 from './product_8.png';

// Grocery item images
import item_1 from './item_1.png';
import item_2 from './item_2.png';
import item_3 from './item_3.png';
import item_4 from './item_4.png';
import item_5 from './item_5.png';
import item_6 from './item_6.png';
import item_7 from './item_7.png';
import item_8 from './item_8.png';
import item_9 from './item_9.png';
import item_10 from './item_10.png';
import item_11 from './item_11.png';
import item_12 from './item_12.png';
import item_13 from './item_13.png';
import item_14 from './item_14.png';
import item_15 from './item_15.png';
import item_16 from './item_16.png';
import item_17 from './item_17.png';
import item_18 from './item_18.png';
import item_19 from './item_19.png';
import item_20 from './item_20.png';
import item_21 from './item_21.png';
import item_22 from './item_22.png';
import item_23 from './item_23.png';
import item_24 from './item_24.png';
import item_25 from './item_25.png';
import item_26 from './item_26.png';
import item_27 from './item_27.png';
import item_28 from './item_28.png';
import item_29 from './item_29.png';
import item_30 from './item_30.png';
import item_31 from './item_31.png';
import item_32 from './item_32.png';

// Icons and misc assets
import add_icon_white from './add_icon_white.png';
import add_icon_green from './add_icon_green.png';
import remove_icon_red from './remove_icon_red.png';
import app_store from './app_store.png';
import play_store from './play_store.png';
import linkedin_icon from './linkedin_icon.png';
import facebook_icon from './facebook_icon.png';
import twitter_icon from './twitter_icon.png';
import cross_icon from './cross_icon.png';
import selector_icon from './selector_icon.png';
import rating_starts from './rating_starts.png';
import profile_icon from './profile_icon.png';
import bag_icon from './bag_icon.png';
import logout_icon from './logout_icon.png';
import parcel_icon from './parcel_icon.png';


export const assets = {
  logo,
  basket_icon,
  header_img,
  search_icon,
  rating_starts,
  add_icon_green,
  add_icon_white,
  remove_icon_red,
  app_store,
  play_store,
  linkedin_icon,
  facebook_icon,
  twitter_icon,
  cross_icon,
  selector_icon,
  profile_icon,
  logout_icon,
  bag_icon,
  parcel_icon,
};


export const product_list = [
  { product_name: "Fresh Produce", product_image: product_1 },
  { product_name: "Fruits", product_image: product_2 },
  { product_name: "Roots and Tubers", product_image: product_3 },
  { product_name: "Grains and Staple Foods", product_image: product_4 },
  { product_name: "Proteins", product_image: product_5 },
  { product_name: "Oils and Spices", product_image: product_6 },
  { product_name: "Packaged Foods and Beverages", product_image: product_7 },
  { product_name: "Household Essentials", product_image: product_8 },
];


export const merchant_list = [
  {
    _id: "m1",
    name: "GreenLeaf Farms",
    category: "Fresh Produce",
    description: "Supplies fresh vegetables and farm produce directly from local growers.",
    contact_email: "greenleaffarms@grundyllc.com",
    contact_phone: "+234 810 555 2489",
    split_code: "SPL_4r4WjviXjN",
    product_ids: ["1", "2", "3", "4"], // Tomatoes, Onions, Spinach, Okra
  },
  {
    _id: "m2",
    name: "Fruitopia Distributors",
    category: "Fruits",
    description: "Specializes in sourcing and packaging premium tropical fruits across Nigeria.",
    contact_email: "fruitopia@grundyllc.com",
    contact_phone: "+234 816 932 4421",
    split_code: "SPL_WGPImCuqMU",
    product_ids: ["5", "6", "7", "8"], // Bananas, Oranges, Pineapple, Watermelon
  },
  {
    _id: "m3",
    name: "Root Harvest",
    category: "Roots and Tubers",
    description: "Delivers quality yams, potatoes, cassava, and ginger from local farms.",
    contact_email: "rootharvest@grundyllc.com",
    contact_phone: "+234 803 777 9910",
    split_code: "SPL_P5G2HML1MG",
    product_ids: ["9", "10", "11", "12"], // Yam, Sweet Potatoes, Cassava, Ginger
  },
  {
    _id: "m4",
    name: "GrainHub Stores",
    category: "Grains and Staple Foods",
    description: "Supplier of rice, beans, garri, and other essential staple foods.",
    contact_email: "grainhub@grundyllc.com",
    contact_phone: "+234 905 200 4412",
    split_code: "SPL_UCK8eEal9B",
    product_ids: ["13", "14", "15", "16"], // Rice, Beans, Maize, Garri
  },
  {
    _id: "m5",
    name: "Prime Proteins Ltd",
    category: "Proteins",
    description: "Sells fresh meat, fish, poultry, and eggs sourced from trusted suppliers.",
    contact_email: "primeproteins@grundyllc.com",
    contact_phone: "+234 701 881 6624",
    split_code: "SPL_dXzPNqQnp1",
    product_ids: ["17", "18", "19", "20"], // Fish, Beef, Goat Meat, Eggs
  },
  {
    _id: "m6",
    name: "SpiceRoute Traders",
    category: "Oils and Spices",
    description: "Distributors of palm oil, groundnut oil, crayfish, and essential seasonings.",
    contact_email: "spiceroute@grundyllc.com",
    contact_phone: "+234 802 450 3122",
    split_code: "SPL_9MX9IYlyp6",
    product_ids: ["21", "22", "23", "24"], // Palm oil, Groundnut oil, Crayfish, Seasoning Cubes
  },
  {
    _id: "m7",
    name: "FoodieMart Distributions",
    category: "Packaged Foods and Beverages",
    description: "Wholesaler of packaged food, beverages, and branded grocery products.",
    contact_email: "foodiemart@grundyllc.com",
    contact_phone: "+234 809 932 1145",
    split_code: "SPL_F8uoNuG19a",
    product_ids: ["25", "26", "27", "28"], // Indomie, Milo, Coca-Cola, Yogurt
  },
  {
    _id: "m8",
    name: "HomeEase Essentials",
    category: "Household Essentials",
    description: "Offers everyday household products like detergents, soaps, and toiletries.",
    contact_email: "homeease@grundyllc.com",
    contact_phone: "+234 806 993 7851",
    split_code: "SPL_TEdHT4AdwU",
    product_ids: ["29", "30", "31", "32"], // Dettol, Omo, Sunlight, Tissue
  },
];

// Grocery list (linked by merchant_id)
export const grocery_list = [
  // Fresh Produce
  { _id: "1", name: "Tomatoes (Basket)", image: item_1, price: "15,000", description: "Fresh red tomatoes sold in bulk basket.", category: "Fresh Produce", merchant_id: "m1" },
  { _id: "2", name: "Onions (Bag)", image: item_2, price: "20,000", description: "Full bag of onions sourced from local markets.", category: "Fresh Produce", merchant_id: "m1" },
  { _id: "3", name: "Spinach / Ugu (Bunch)", image: item_3, price: "400", description: "Fresh leafy vegetables rich in iron.", category: "Fresh Produce", merchant_id: "m1" },
  { _id: "4", name: "Okra (Paint Bucket)", image: item_4, price: "3,000", description: "Bulk okra pods sold per paint bucket.", category: "Fresh Produce", merchant_id: "m1" },

  // Fruits
  { _id: "5", name: "Bananas (Dozen)", image: item_5, price: "1,200", description: "Sweet ripe bananas per dozen.", category: "Fruits", merchant_id: "m2" },
  { _id: "6", name: "Oranges (Dozen)", image: item_6, price: "1,000", description: "Fresh juicy oranges rich in Vitamin C.", category: "Fruits", merchant_id: "m2" },
  { _id: "7", name: "Pineapple (Large)", image: item_7, price: "1,500", description: "Large tropical pineapple, freshly harvested.", category: "Fruits", merchant_id: "m2" },
  { _id: "8", name: "Watermelon (Large)", image: item_8, price: "2,000", description: "Big juicy watermelon perfect for sharing.", category: "Fruits", merchant_id: "m2" },

  // Roots and Tubers
  { _id: "9", name: "Yam Tuber", image: item_9, price: "1,000", description: "Fresh yam tuber, staple for pounded yam.", category: "Roots and Tubers", merchant_id: "m3" },
  { _id: "10", name: "Sweet Potatoes (Basket)", image: item_10, price: "5,000", description: "Basket of sweet potatoes, versatile use.", category: "Roots and Tubers", merchant_id: "m3" },
  { _id: "11", name: "Cassava (Tubers)", image: item_11, price: "600", description: "Raw cassava tubers for garri or fufu.", category: "Roots and Tubers", merchant_id: "m3" },
  { _id: "12", name: "Ginger (Kg)", image: item_12, price: "1,500", description: "Fresh aromatic ginger root, per kg.", category: "Roots and Tubers", merchant_id: "m3" },

  // Grains and Staple Foods
  { _id: "13", name: "Rice (50kg Bag)", image: item_13, price: "50,000", description: "50kg bag of long-grain parboiled rice.", category: "Grains and Staple Foods", merchant_id: "m4" },
  { _id: "14", name: "Beans (50kg Bag)", image: item_14, price: "65,000", description: "Premium brown beans, perfect for akara.", category: "Grains and Staple Foods", merchant_id: "m4" },
  { _id: "15", name: "Maize (Paint Bucket)", image: item_15, price: "1,800", description: "Dried maize grains for pap or roasting.", category: "Grains and Staple Foods", merchant_id: "m4" },
  { _id: "16", name: "Garri (Paint Bucket)", image: item_16, price: "1,800", description: "Yellow garri, a Nigerian staple.", category: "Grains and Staple Foods", merchant_id: "m4" },

  // Proteins
  { _id: "17", name: "Fresh Fish (Kg)", image: item_17, price: "3,000", description: "Freshly caught fish per kilogram.", category: "Proteins", merchant_id: "m5" },
  { _id: "18", name: "Beef (Kg)", image: item_18, price: "5,000", description: "Fresh butchered beef cuts, per kilogram.", category: "Proteins", merchant_id: "m5" },
  { _id: "19", name: "Goat Meat (Kg)", image: item_19, price: "6,000", description: "Tender goat meat, ideal for soups.", category: "Proteins", merchant_id: "m5" },
  { _id: "20", name: "Eggs (Crate, 30)", image: item_20, price: "3,200", description: "One crate of 30 farm-fresh eggs.", category: "Proteins", merchant_id: "m5" },

  // Oils and Spices
  { _id: "21", name: "Palm Oil (25L Jerrycan)", image: item_21, price: "30,000", description: "25L Jerrycan of red palm oil.", category: "Oils and Spices", merchant_id: "m6" },
  { _id: "22", name: "Groundnut Oil (25L Jerrycan)", image: item_22, price: "40,000", description: "Pure groundnut oil for cooking.", category: "Oils and Spices", merchant_id: "m6" },
  { _id: "23", name: "Crayfish (Paint Bucket)", image: item_23, price: "8,000", description: "Dried crayfish, key Nigerian ingredient.", category: "Oils and Spices", merchant_id: "m6" },
  { _id: "24", name: "Seasoning Cubes (Pack of 50)", image: item_24, price: "1,800", description: "Pack of 50 rich flavor seasoning cubes.", category: "Oils and Spices", merchant_id: "m6" },

  // Packaged Foods and Beverages
  { _id: "25", name: "Indomie Instant Noodles (Carton)", image: item_25, price: "9,000", description: "Carton of Indomie chicken flavor noodles.", category: "Packaged Foods and Beverages", merchant_id: "m7" },
  { _id: "26", name: "Milo (500g Tin)", image: item_26, price: "2,000", description: "Nestle Milo chocolate beverage powder.", category: "Packaged Foods and Beverages", merchant_id: "m7" },
  { _id: "27", name: "Coca-Cola (50cl Bottle)", image: item_27, price: "300", description: "Chilled Coca-Cola soft drink bottle.", category: "Packaged Foods and Beverages", merchant_id: "m7" },
  { _id: "28", name: "Hollandia Yogurt (1L Pack)", image: item_28, price: "1,700", description: "1L pack of Hollandia drinking yogurt.", category: "Packaged Foods and Beverages", merchant_id: "m7" },

  // Household Essentials
  { _id: "29", name: "Dettol Soap (Bar)", image: item_29, price: "450", description: "Antibacterial Dettol soap bar.", category: "Household Essentials", merchant_id: "m8" },
  { _id: "30", name: "Omo Detergent (2kg)", image: item_30, price: "2,800", description: "2kg pack of Omo washing powder.", category: "Household Essentials", merchant_id: "m8" },
  { _id: "31", name: "Sunlight Dishwashing Liquid (1.5L)", image: item_31, price: "1,600", description: "1.5L Sunlight lemon dishwashing liquid.", category: "Household Essentials", merchant_id: "m8" },
  { _id: "32", name: "Tissue Paper (4 Rolls)", image: item_32, price: "1,200", description: "Pack of 4 soft tissue rolls.", category: "Household Essentials", merchant_id: "m8" },
];
