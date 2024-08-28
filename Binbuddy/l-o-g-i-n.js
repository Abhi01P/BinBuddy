async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
          throw new Error('Login failed: ' + response.statusText);
      }

      const result = await response.json();

      if (result.success) {
          const role = result.role;
          let redirectUrl = '';

          switch(role) {
              case 'student':
                  redirectUrl = "student-page.html";
                  break;
              case 'mess':
                  redirectUrl = 'mess-page.html';
                  break;
              case 'ngo':
                  redirectUrl = "ngo-page.html";
                  break;
              default:
                  throw new Error('Unknown role');
          }

          window.location.href = redirectUrl;
      } else {
          alert('Login failed');
      }
  } catch (error) {
      console.error('Error:', error);
      alert(error.message);
  }
}