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
//PRACTICE API Calls (from zoom tutorials)
/*export function apiCall() {
  fetch("http://localhost:8000/apicall")
    .then(console.log("hello console"))
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
}*/

/*export async function asyncApiCall() {
  try {
    const response = await fetch("http://localhost:8000/apicall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ x: 5, y: 3 }),
    });

    if (!response.ok) {
      throw new Error("Networking Error");
    }
    //const data = await response.json();
    //console.log(data);

    return response.json();
  } catch (error) {
    console.log(error);
  }
}*/

export async function generatePairs(interns, pairingType) {
  try {
    const response = await fetch("http://localhost:8000/generate-pairs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interns, pairingType }),
    });

    if (!response.ok) {
      throw new Error("Response Error");
    }

    const res = response.json();
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function exportPairs() {
  try {
    const response = await fetch("http://localhost:8000/export-pairs");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    //get the anchor tag and add the file url
    const aTag = document.getElementById("fileTag");
    aTag.setAttribute("href", response.url);
  } catch (error) {
    console.error("There was a problem fetching the data:", error);
  }
}
