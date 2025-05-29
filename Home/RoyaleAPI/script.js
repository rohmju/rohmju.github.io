const axios = require('axios');
const fs = require('fs');

const endpoint = '/your-endpoint-here'; // Beispiel: "/players/%23PLAYERID"
const apiKey = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY5NzdkMTA5LWQ5ODItNDk3NC04NmY4LTc1YWFmYWRhN2MzMyIsImlhdCI6MTc0ODUzOTY2MSwic3ViIjoiZGV2ZWxvcGVyLzY0OWIwMTUzLTAxOTAtNjYwYy1hMTI5LWZiZjUxNWQ3NTZmNSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4Ny4xNDMuMjI3LjE3NSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.9MTuhT5MJ8erR_u2uVHXHhZlamV0dG7oqq7OH0hoAqYTm1NqJgvGmruKf9MK8t-pElfCUXfcq028rRkGgpmlaA';  // Ersetze mit deinem tatsächlichen API-Key

axios.get('https://api.clashroyale.com/v1' + endpoint, {
    headers: {
        'Authorization': apiKey
    }
})
.then(response => {
    const jsonData = response.data;
    const prettyJson = JSON.stringify(jsonData, null, 4);

    fs.writeFile('example_response.json', prettyJson, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben der Datei:', err);
        } else {
            console.log('Antwort erfolgreich in example_response.json gespeichert.');
        }
    });
})
.catch(error => {
    console.error('Fehler bei der Anfrage:', error.response ? error.response.data : error.message);
});
