import React from "react";

function App() {
  const handleClick = async () => {
    try {
      // 1. Get temporary token
      const tokenResponse = await fetch("http://localhost:4000/get-token");
      if (!tokenResponse.ok) {
        alert("Error fetching token: " + tokenResponse.status);
        return;
      }
      const { token } = await tokenResponse.json();

      // 2. Call backend via proxy with token
      const response = await fetch("http://localhost:4000/api/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`API Error ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.text();
      alert(data); // should show backend message
    } catch (err) {
      alert("Fetch failed: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>SecureApp Frontend</h1>
      <button onClick={handleClick}>Ping API with Token</button>
    </div>
  );
}

export default App;
