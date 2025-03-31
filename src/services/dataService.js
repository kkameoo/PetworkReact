const url = "/src/data/category.json";
const localUrl = "/src/data/localCategory.json";
const cityUrl = "/src/data/cityCategory.json";
// import cityUrl from "../data/cityCategory.json";

export const getCategory = async () => {
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
export const getLocalCategory = async () => {
    try {
        const response = await fetch(localUrl);
        if (response.ok) {
            const data = await response.json();
            return data.localSi;
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
