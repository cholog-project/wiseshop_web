import { atom } from "recoil";

export const userState = atom({
    key: 'userState',
    default: {
        isLoggedIn: false,
        isLoading: true,
        user: null
    }
});

export const campaignListState = atom({
    key: "campaignListState",
    default: [],
});

export const loadingState = atom({
    key: "loadingState",
    default: false,
});

export const errorState = atom({
    key: "errorState",
    default: null,
});

const persistedOrderData = JSON.parse(localStorage.getItem("orderDataState")) || null;

export const orderDataState = atom({
    key: "orderDataState",
    default: persistedOrderData,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                if (newValue === null) {
                    localStorage.removeItem("orderDataState");
                } else {
                    localStorage.setItem("orderDataState", JSON.stringify(newValue));
                }
            });
        },
    ],
});
