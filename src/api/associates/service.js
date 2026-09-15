export default async function getAssociates() {
  try {
    const response = await fetch("src/documents/associates.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.associates;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    throw error;
  }
}
