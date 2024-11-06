export async function getInterns() {
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

export async function generatePairs(interns, rules) {
  try {
    const response = await fetch("http://localhost:8000/api/generate-pairs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interns, rules }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Fetching Error", error);
    throw error;
  }
}

export async function exportPairs(pairs) {
  try {
    const response = await fetch("http://localhost:8000/api/export-pairs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pairs }),
    });
    // Client-Side Download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "pairs.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Fetching error", error);
    throw error;
  }
}
