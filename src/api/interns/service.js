export default async function getInterns() {
  try {
    const response = await fetch("src/documents/interns.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.interns;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    throw error;
  }
}
