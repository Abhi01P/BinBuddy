async function submitForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        hostel: document.getElementById("hostel").value,
        mess: document.getElementById("mess").value,
        upiId: document.getElementById("upiId").value,
        password: document.getElementById("password").value,
        mealCost: document.getElementById("mealCost").value
    };
  
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
        alert("Phone number must be exactly 10 digits and should start with digits 6-9");
        return;
    }
  
    try {
        const response = await fetch('/submit-mess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
  
        const responseText = await response.text();
        console.log('Server response:', responseText);
  
        if (response.ok) {
            window.location.href = "mess-page.html";
        } else {
            alert("Error submitting form: " + responseText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Error submitting form: " + error.message);
    }
  }