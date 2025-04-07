const url = "/data/category.json";
const localUrl = "/data/localCategory.json";
const cityUrl = "/data/cityCategory.json";
// import cityUrl from "../data/cityCategory.json";

export const getWalkCategory = async () => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.walkCategory;
        } else {
            throw new Error("Failed to Fetch Data");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        throw error;
    }
}
export const getTradeCategory = async () => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.tradeCategory;
        } else {
            throw new Error("Failed to Fetch Data");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        throw error;
    }
}
export const getLocalCategory = async () => {
    try {
        const response = await fetch(localUrl);
        if (response.ok) {
            const data = await response.json();
            return data.regions;
        } else {
            throw new Error("Failed to Fetch Data");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        throw error;
    }
}
export const getCityCategory = async () => {
    try {
        const response = await fetch(cityUrl);
        if (response.ok) {
            const data = await response.json();
            return data.region;
        } else {
            throw new Error("Failed to Fetch Data");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        throw error;
    }
}