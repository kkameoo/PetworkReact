export const getCategory = async () => {
    try {
        const response = await fetch("src/data/category.json");
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to Fetch categoryData");
        }
    } catch (error) {
        console.error("Error fetching JSON:", error);
        throw error;
    }
};