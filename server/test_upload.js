async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'rahul@example.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Got token:', token);
        
        const form = new FormData();
        form.append('crimeType', 'Theft');
        form.append('incidentDate', '2023-10-10');
        form.append('location', 'Street');
        form.append('city', 'Delhi');
        form.append('state', 'Delhi');
        form.append('description', 'Test desc');
        form.append('priority', 'Medium');
        form.append('victimInformation', JSON.stringify({name: "", phone: "", address: ""}));
        form.append('suspectInformation', JSON.stringify({name: "", description: "", relationship: ""}));
        
        const res = await fetch('http://localhost:5000/api/complaints', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });
        
        const text = await res.text();
        console.log('Response Status:', res.status);
        console.log('Response Data:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
