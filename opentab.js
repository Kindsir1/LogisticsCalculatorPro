function openTab(evt, tabName) {
  // Hide all tabcontent
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the "active" class from all tablinks
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab and add the "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  // Change background based on the tab
  if (tabName === 'ByOcean') {
    document.body.className = 'by-sea';  // Apply sea background
  } else if (tabName === 'ByAir') {
    document.body.className = 'by-air';  // Apply air background
  } else {
    document.body.className = '';  // Reset to default if needed
  }
}

// Open the "By Air" tab by default
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("ByAir").style.display = "block";
  document.body.className = 'by-air';  // Default to By Air background
});
