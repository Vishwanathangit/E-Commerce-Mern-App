export const setDataInLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getDataFromLocalStorage = (key) => {
    return key in localStorage ? JSON.parse(localStorage.getItem(key)) : [];
};

export const removeDataFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};