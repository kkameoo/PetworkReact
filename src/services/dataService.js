const url = "src/data/category.json";

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
};