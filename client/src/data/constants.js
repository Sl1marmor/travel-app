// src/data/constants.js

export const CATEGORIES = [
  { icon: "🏨", label: "Готелі",      type: "hotel" },
  { icon: "🏠", label: "Апартаменти", type: "apart" },
  { icon: "🏕️", label: "Курорти",     type: "resort" },
  { icon: "🛥️", label: "Яхти",        type: "yacht" },
  { icon: "🏡", label: "Котеджі",     type: "cottage" },
  { icon: "🌿", label: "Глемпінг",    type: "glamping" },
];

export const SORT_OPTIONS = [
  { value: "rating",     label: "За рейтингом" },
  { value: "price_asc",  label: "Ціна: від низької" },
  { value: "price_desc", label: "Ціна: від високої" },
];

export const TABS = [
  { key: "stays",   label: "🏨 Житло" },
  { key: "flights", label: "✈️ Авіа" },
  { key: "cars",    label: "🚗 Авто" },
  { key: "tours",   label: "🗺️ Тури" },
];
