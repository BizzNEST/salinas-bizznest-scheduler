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

/*export function apiCall() {
  fetch("http://localhost:8000/apicall")
    .then(console.log("hello console"))
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
}*/

export async function asyncApiCall() {
  try {
    const response = await fetch("http://localhost:8000/apicall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ x: 5 }),
    });
    if (!response.ok) {
      throw new Error("Networking Error");
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
