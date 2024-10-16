// Function to reset all calculators (both regular and WR calculators)
function resetCalculators() {
  // Clear all calculator data from local storage
  localStorage.removeItem('wrCalculators');      // Clears WR calculators from storage
  localStorage.removeItem('regularCalculators'); // Clears regular calculators from storage (assuming this key stores regular calculator data)

  // Clear all calculator instances from the DOM
  const wrCalcContainer = document.getElementById('newcalcOcean');    // Container for WR calculators
  const regularCalcContainer = document.getElementById('newcalcAir'); // Container for regular calculators (change ID to match your regular calculators container)
  
  if (wrCalcContainer) wrCalcContainer.innerHTML = '';    // Clears WR calculators from the page
  if (regularCalcContainer) regularCalcContainer.innerHTML = ''; // Clears regular calcu lators from the page

  // Update the combined total
  updateCombinedTotal(); // Call the existing function that updates the combined total

  console.log('All calculators have been reset.');
}

// Function to load all calculators (both WR and regular) from localStorage
// Function to load all calculators (both WR and regular) from localStorage
function loadCalculatorsFromLocalStorage() {
  const wrCalculatorsData = JSON.parse(localStorage.getItem('wrCalculators')) || [];
  const regularCalculatorsData = JSON.parse(localStorage.getItem('regularCalculators')) || [];

  // Load WR calculators
  wrCalculatorsData.forEach(calc => {
      addCalculatorSharedWROcean(calc.id);
      document.getElementById(`totalAmount-${calc.id}`).value = calc.totalAmount;
      document.getElementById(`totalVolumeWeight-${calc.id}`).value = calc.totalVolumeWeight;

      // Add sub-calculators for each WR calculator
      calc.subCalculators.forEach(subCalc => {
          addSubCalculator(calc.id, subCalc.subCalcId, subCalc.subInvendproReceipt, subCalc.subWeight);
      });
  });

  // Load regular calculators
  regularCalculatorsData.forEach(calc => {
      addCalculatorAir(calc.id); // Assuming you have a function to add regular calculators
      document.getElementById(`invendpro-${calc.id}`).value = calc.invendproReceipt;
      document.getElementById(`weight-${calc.id}`).value = calc.weight;
      document.getElementById(`totalAmount-${calc.id}`).value = calc.totalAmount;
  });

  updateCombinedTotal(); // Ensure combined total is updated after loading
}

// Load calculators from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadCalculatorsFromLocalStorage);


// Function to save all calculators (WR and regular) to localStorage
// Function to save all calculators (WR and regular) to localStorage
function saveCalculatorsToLocalStorage() {
  const wrCalculators = document.querySelectorAll('.calculator-instance.shared-wr');
  const regularCalculators = document.querySelectorAll('.calculator-instance:not(.shared-wr)');
  const wrCalculatorsData = [];
  const regularCalculatorsData = [];

  // Save WR calculators
  wrCalculators.forEach(calculator => {
      const id = calculator.id.split('-')[1];
      const invendproReceipt = calculator.querySelector('.invendproInput').value;
      const totalAmount = calculator.querySelector(`#totalAmount-${id}`).value;
      const totalVolumeWeight = document.getElementById(`totalVolumeWeight-${id}`).value;

      // Sub-calculators
      const subCalculators = [];
      calculator.querySelectorAll('.sub-calculator').forEach(subCalc => {
          const subCalcId = subCalc.id.split('-')[1];
          const subInvendproReceipt = subCalc.querySelector('.invendproInput').value;
          const subWeight = subCalc.querySelector('.weightInput').value;
          subCalculators.push({ subCalcId, subInvendproReceipt, subWeight });
      });

      wrCalculatorsData.push({
          id, invendproReceipt, totalAmount, totalVolumeWeight, subCalculators
      });
  });

  // Save regular calculators
  regularCalculators.forEach(calculator => {
      const id = calculator.id.split('-')[1];
      const invendproReceipt = calculator.querySelector('.invendproInput').value;
      const weight = calculator.querySelector('.weightInput').value;
      const totalAmount = calculator.querySelector('.totalamount .value').innerHTML;
      regularCalculatorsData.push({ id, invendproReceipt, weight, totalAmount });
  });

  // Store the calculators in localStorage
  localStorage.setItem('wrCalculators', JSON.stringify(wrCalculatorsData));
  localStorage.setItem('regularCalculators', JSON.stringify(regularCalculatorsData));
}


// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', resetCalculators);

// Load calculators from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadCalculatorsFromLocalStorage);
