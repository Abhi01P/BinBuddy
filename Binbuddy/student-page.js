function domReady(fn) {
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		setTimeout(fn, 1000);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

domReady(function () {

	// If found you qr code
	function onScanSuccess(decodeText, decodeResult) {
		alert("You Qr is : " + decodeText, decodeResult);
	}

	let htmlscanner = new Html5QrcodeScanner(
		"my-qr-reader",
		{ fps: 10, qrbos: 250 }
	);
	htmlscanner.render(onScanSuccess);
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/menu')
    .then(response => response.json())
    .then(data => {
        document.getElementById('displayBreakfast').textContent = data.breakfast;
        document.getElementById('displayLunch').textContent = data.lunch;
        document.getElementById('displayDinner').textContent = data.dinner;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
