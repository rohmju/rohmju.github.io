document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("playerId");
    const main = document.querySelector("main");

    // Add a button to trigger the API call
    const button = document.createElement("button");
    button.textContent = "Get Cards";
    main.appendChild(button);

    // Add a div to display the result
    const resultDiv = document.createElement("div");
    resultDiv.id = "result";
    main.appendChild(resultDiv);

    button.addEventListener("click", async () => {
        const endpoint = "/cards";
        const apiKey = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImYxODkzNGY0LTNhOWEtNGRjMi04MmI2LWI0ODJiOTFhZTVhMyIsImlhdCI6MTc0ODU0NTE5OSwic3ViIjoiZGV2ZWxvcGVyLzY0OWIwMTUzLTAxOTAtNjYwYy1hMTI5LWZiZjUxNWQ3NTZmNSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxODUuMTk5LjEwOC4wIiwiODcuMTQzLjIyNy4xNzUiXSwidHlwZSI6ImNsaWVudCJ9XX0.zSk8RaSQTELndUm4M9quqF-mIoUPfbQ9vYjnzHM9g3dzIpNuJbQ2N0XODArMMgBMOtWCekQL9GulT7xvVOpwyA";

        resultDiv.textContent = "Loading...";

        try {
            const response = await fetch("https://api.clashroyale.com/v1" + endpoint, {
                headers: {
                    "Authorization": apiKey
                }
            });
            if (!response.ok) {
                throw new Error("API error: " + response.status);
            }
            const data = await response.json();
            resultDiv.textContent = JSON.stringify(data, null, 2);
            console.log("API Success:", data);
        } catch (error) {
            resultDiv.textContent = "Error: " + error.message;
            console.error("API Error:", error);
        }
    });
});
button.addEventListener("click", async () => {
    resultDiv.textContent = "Loading...";

    try {
        const response = await fetch("https://clashproxy.onrender.com/cards");
        if (!response.ok) throw new Error("API error: " + response.status);

        const data = await response.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        resultDiv.textContent = "Error: " + error.message;
    }
});