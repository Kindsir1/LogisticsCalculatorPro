// Function to update the counter based on the active tab
function updateCalcCounter(activeTab) {
  let regularCalcs = 0;
  let wrCalcs = 0;

  if (activeTab === 'ByAir') {
    // Count regular calculators in the Air tab
    regularCalcs = document.querySelectorAll('#ByAir .calculator-instance:not(.shared-wr)').length;
    // WR calculators are 0 for Air tab since only regular calculators exist here
    wrCalcs = document.querySelectorAll('#ByAir .calculator-instance.shared-wr').length; // Should be 0, but added for symmetry
  } else if (activeTab === 'ByOcean') {
    // Count WR calculators in the Ocean tab
    wrCalcs = document.querySelectorAll('#ByOcean .calculator-instance.shared-wr').length;
    // Regular calculators are 0 for Ocean tab since only WR calculators exist here
    regularCalcs = document.querySelectorAll('#ByOcean .calculator-instance:not(.shared-wr)').length; // Should be 0, but added for symmetry
  }

  // Update the counter display for both Regular and WR calculators
  document.getElementById('calcCounter').innerHTML = `
    <div class="counter-item">
      <span class="counter-number">${regularCalcs}</span> Regular Calculators
    </div>
    <div class="counter-item">
      <span class="counter-number">${wrCalcs}</span> WR Calculators
    </div>
  `;
}

// Add event listeners to automatically update the counter after adding or deleting calculators
document.addEventListener('DOMContentLoaded', function() {
  updateCalcCounter('ByAir'); // Default to "By Air" tab on load

  // Ensure the counter is updated when a calculator is added or removed
  document.getElementById('addCalcSharedWROcean').addEventListener('click', function() {
    updateCalcCounter('ByOcean'); // Update for WR calculators when on Ocean tab
  });

  document.getElementById('addCalcAir').addEventListener('click', function() {
    updateCalcCounter('ByAir'); // Update for regular calculators when on Air tab
  });
});

// Function to switch tabs and update the counter based on the selected tab
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Hide all tabcontent
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove('active');
  }

  // Remove the "active" class from all tablinks
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab and add "active" class
  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.className += " active";

  // Update the counter based on the active tab
  updateCalcCounter(tabName);
}

// Call the counter update when calculators are deleted
function deleteCalculatorOcean(calcId, activeTab) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    calculator.remove();
  }
  updateCalcCounter(activeTab); // Update the counter after deletion
  updateCombinedTotal(); // Update the combined total
}
 