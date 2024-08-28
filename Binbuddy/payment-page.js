document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const upiId = document.getElementById('upiId').value;
    const amount = document.getElementById('amount').value;

    if (!upiId || !amount) {
        alert('Please fill in both fields.');
        return;
    }

    // Fetch mess UPI ID from server
    fetch('/api/getMessUpiId')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const messUpiId = data.upiId;
                // Create UPI payment URL
                const upiUrl = `upi://pay?pa=${messUpiId}&pn=Mess&am=${amount}&cu=INR&tn=Mess%20Payment`;
                
                // Log the UPI URL for debugging
                console.log('UPI URL:', upiUrl);

                // Open the UPI payment URL
                window.location.href = upiUrl;

                // Add virtual credits to the student's profile
                addVirtualCredits(amount);
            } else {
                alert('Error fetching mess UPI ID');
            }
        })
        .catch(error => {
            console.error('Error fetching mess UPI ID:', error);
            alert('Error fetching mess UPI ID');
        });
});

function addVirtualCredits(amount) {
    fetch('/api/addVirtualCredits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Virtual credits added successfully');
        } else {
            alert('Error adding virtual credits');
        }
    })
    .catch(error => {
        console.error('Error adding virtual credits:', error);
        alert('Error adding virtual credits');
    });
}