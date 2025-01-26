import { selector } from "recoil";
import axiosInstance from "../api/axiosInstance.js";

export const campaignListQuery = selector({
    key: "campaignListQuery",
    get: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get("/campaigns");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
});