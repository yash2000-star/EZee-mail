async function testClassify() {
  const payload = [
    { id: "new_id_test_999", sender: "Unknown", snippet: "Hello world this is a test email." }
  ];

  try {
    const res = await fetch("http://localhost:3000/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        emails: payload,
        apiKey: "AIzaSyAYqWLNAOvJ9kt_SdwQxh0QKXhGylcbqqU"
      })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testClassify();
