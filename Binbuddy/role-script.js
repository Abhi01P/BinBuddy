// Get all elements with the class "vuesaxboldtick-square-icon"
const tickIcons = document.querySelectorAll('.vuesaxboldtick-square-icon');

// Get the continue button
const continueButton = document.getElementById('continue-button');

// Define the redirect URLs for each icon
const redirectUrls = {
  'svgStudent': 'student-info.html',
  'svgMess': 'mess-info.html',
  'svgNgo': 'ngo-info.html',
};

// Helper function to handle icon clicks
function handleIconClick(icon, id) {
  // Untick all other icons
  tickIcons.forEach((otherIcon) => {
    if (otherIcon !== icon) {
      otherIcon.setAttribute('fill', 'none');
    }
  });

  // Toggle the fill color of the clicked icon
  if (icon.getAttribute('fill') === 'none' || !icon.getAttribute('fill')) {
    icon.setAttribute('fill', '#0D99FF'); // Change to blue
  } else {
    icon.setAttribute('fill', 'none'); // Change back to original color
  }

  // Get the ID of the ticked icon
  const tickedIcon = Array.from(tickIcons).find((icon) => icon.getAttribute('fill') === '#0D99FF');

  if (tickedIcon) {
    const tickedIconId = tickedIcon.id;

    // Set the redirect URL for the continue button
    continueButton.onclick = () => {
      window.location.href = redirectUrls[tickedIconId];
    };
  } else {
    // If no icon is ticked, remove the click handler from the continue button
    continueButton.onclick = null;
    
  }
}

// Add an event listener to each icon's container
document.querySelectorAll('.rectangle-parent-student, .rectangle-parent-mess, .rectangle-parent-ngo').forEach(container => {
  container.addEventListener('click', () => {
    const icon = container.querySelector('.vuesaxboldtick-square-icon');
    handleIconClick(icon, icon.id);
  });
});
