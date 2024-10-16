// Function to add a single WR calculator instance for By Ocean
function addCalculatorSharedWROcean() {
  const uniqueId = Math.random().toString(36).substr(2, 9);

  // Generate the HTML for the WR calculator
  const addCalcHTML = `
    <div class="calculator-instance shared-wr" id="calc-${uniqueId}">
      <input type="text" class="invendproInput" placeholder="Warehouse Number">
      <div class="results">
        <div class="rate">Rate per square foot = 10.45</div>
        <div class="totalamount">
          Total amount = <input type="number" id="totalAmount-${uniqueId}" class="value" value="0.00" 
          oninput="manualEditTotalAmount('${uniqueId}')">
        </div>
      </div>
      <button class="addCalcButton" onclick="addSubCalculator('${uniqueId}')">Add Sub-Calculator</button>
      <div id="subcalc-${uniqueId}"></div>
      <div class="total-weight" id="totalWeight-${uniqueId}">Total weight in pounds: 0</div>
      <div class="volume-weight">
        <label for="totalVolumeWeight-${uniqueId}">Total Volume Weight:</label>
        <input type="number" id="totalVolumeWeight-${uniqueId}" 
        placeholder="Enter volume weight" oninput="recalculateAllSqFt('${uniqueId}')">
      </div>
      <button class="deleteCalc" onclick="deleteCalculatorOcean('${uniqueId}')">Delete</button>
    </div>
  `;

  // Use insertAdjacentHTML to append the new WR calculator without removing the existing ones
  document.getElementById(`newcalcOcean`).insertAdjacentHTML('beforeend', addCalcHTML);

  // Ensure the combined total is updated after adding the new WR calculator
  updateCombinedTotal();
}


// Function to add a sub-calculator within the WR calculator field
function addSubCalculator(parentId) {
  const tempId = Math.random().toString(36).substr(2, 9);

  // HTML for the new sub-calculator inside the WR section
  const subCalcHTML = `
      <div class="sub-calculator" id="subcalc-${tempId}">
          <input type="text" class="invendproInput" placeholder="IP Receipt Number (als laatst invullen)" onblur="updateSubCalculatorId(this, '${tempId}')">
          <input type="number" class="weightInput" placeholder="Weight (pounds)" oninput="calculateTotalWeight('${parentId}'); calculateWeightInSqFt('${tempId}', '${parentId}')">
          <!-- Display for calculated weight in square feet -->
          <div id="weightSqFtDisplay-${tempId}" class="weight-sqft-display">Weight in Square Feet = 0</div>
          <!-- Display for calculated total ocean freight -->
          <div id="totalOceanFreightDisplay-${tempId}" class="total-ocean-freight-display">Total Ocean Freight = 0</div>
          <button class="deleteCalc" onclick="deleteSubCalculator('subcalc-${tempId}', '${parentId}')">Delete Sub-Calculator</button>
      </div>
  `;

  // Append the new sub-calculator to the specific WR calculator's subcalc section
  document.getElementById(`subcalc-${parentId}`).innerHTML += subCalcHTML;

  // Add event listener to trigger recalculation when the invendpro receipt number is entered
  const invendproInput = document.querySelector(`#subcalc-${tempId} .invendproInput`);
  invendproInput.addEventListener('blur', () => {
      // Trigger the weight calculation when the invendpro receipt is entered
      calculateWeightInSqFt(tempId, parentId);
  });
}

// Track whether the total amount is being manually edited
let isManualEdit = {};

// Function to handle manual edits of the total amount
function manualEditTotalAmount(parentId) {
  isManualEdit[parentId] = true; // Set the manual edit flag to true
  updateCombinedTotal(); // Update the combined total after manual edit
}

// Function to calculate the weight in square feet and total ocean freight
function calculateWeightInSqFt(subCalcId, parentId) {
  const weightInput = document.querySelector(`#subcalc-${subCalcId} .weightInput`).value;
  const totalWeightPounds = parseFloat(document.getElementById(`totalWeight-${parentId}`).innerText.replace('Total weight in pounds: ', '')) || 0;
  const enteredVolumeWeight = document.getElementById(`totalVolumeWeight-${parentId}`).value;

  // Ensure valid inputs before calculating
  if (weightInput && totalWeightPounds > 0 && enteredVolumeWeight) {
    const weightInSqFt = (parseFloat(weightInput) / totalWeightPounds) * parseFloat(enteredVolumeWeight);

    // Update the "Weight in Square Feet" display
    document.getElementById(`weightSqFtDisplay-${subCalcId}`).innerHTML = `Weight in Square Feet = ${weightInSqFt.toFixed(2)}`;

    const ratePerSqFt = 10.45;
    const totalOceanFreight = weightInSqFt * ratePerSqFt;

    // Update the "Total Ocean Freight" display
    document.getElementById(`totalOceanFreightDisplay-${subCalcId}`).innerHTML = `Total Ocean Freight = ${totalOceanFreight.toFixed(2)}`;

    // If the total amount is not being edited manually, recalculate the total amount
    if (!isManualEdit[parentId]) {
      recalculateTotalAmount(parentId);
    }

    updateCombinedTotal(); // Update the combined total when sub-calculator changes
    return totalOceanFreight;
  } else {
    document.getElementById(`weightSqFtDisplay-${subCalcId}`).innerHTML = 'Weight in Square Feet = 0';
    document.getElementById(`totalOceanFreightDisplay-${subCalcId}`).innerHTML = 'Total Ocean Freight = 0';

    return 0;
  }
}

// Function to recalculate the total amount for a WR calculator
function recalculateTotalAmount(parentId) {
  let totalAmount = 0;

  // Get all sub-calculators for this WR calculator
  const subCalculators = document.querySelectorAll(`#subcalc-${parentId} .sub-calculator`);

  // Sum the Total Ocean Freight for each sub-calculator
  subCalculators.forEach(subCalc => {
    const subCalcId = subCalc.id.split('-')[1];
    const totalOceanFreight = parseFloat(document.querySelector(`#totalOceanFreightDisplay-${subCalcId}`).innerText.replace('Total Ocean Freight = ', '')) || 0;
    totalAmount += totalOceanFreight;
  });

  // If the total amount is not being edited manually, update the total amount at the top
  if (!isManualEdit[parentId]) {
    document.getElementById(`totalAmount-${parentId}`).value = totalAmount.toFixed(2);
  }

  updateCombinedTotal(); // Update the combined total whenever total amount changes
}

// Function to recalculate all "Weight in Square Feet" and "Total Ocean Freight" when the total volume weight changes
function recalculateAllSqFt(parentId) {
  const subCalculators = document.querySelectorAll(`#subcalc-${parentId} .sub-calculator`);
  subCalculators.forEach(subCalc => {
    const subCalcId = subCalc.id.split('-')[1];
    calculateWeightInSqFt(subCalcId, parentId);
  });
}

// Function to calculate the total weight in pounds for all sub-calculators under the WR calculator
function calculateTotalWeight(parentId) {
  const weightInputs = document.querySelectorAll(`#subcalc-${parentId} .weightInput`);
  let totalWeight = 0;

  weightInputs.forEach(input => {
    const weight = parseFloat(input.value) || 0;
    totalWeight += weight;
  });

  // Update the total weight displayed below the sub-calculators
  document.getElementById(`totalWeight-${parentId}`).innerHTML = `Total weight in pounds: ${totalWeight}`;

  // Recalculate all weight in square feet and total ocean freight when the total weight changes
  recalculateAllSqFt(parentId);
}

// Function to delete a sub-calculator and recalculate total weight
function deleteSubCalculator(subCalcId, parentId) {
  const subCalculator = document.getElementById(subCalcId);
  if (subCalculator) {
    subCalculator.remove(); // Remove the sub-calculator from the DOM
    calculateTotalWeight(parentId); // Recalculate the total weight after deletion
    recalculateTotalAmount(parentId); // Recalculate the total amount after deletion
    updateCombinedTotal(); // Update the combined total after deletion
  } 
}

// Function to delete a WR calculator and all its sub-calculators
function deleteCalculatorOcean(calcId) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    calculator.remove();
  }
  updateCombinedTotal(); // Update the combined total after deleting a WR calculator
}

// Function to update the sub-calculator's ID when the Invendpro Receipt Number is entered
function updateSubCalculatorId(inputElement, tempId) {
  const invendproReceipt = inputElement.value.trim();
  if (invendproReceipt) {
    const subCalcDiv = document.getElementById(`subcalc-${tempId}`);
    if (subCalcDiv) {
      subCalcDiv.id = `subcalc-${invendproReceipt}`;
    }
    const deleteButton = subCalcDiv.querySelector('.deleteCalc');
    deleteButton.setAttribute('onclick', `deleteSubCalculator('subcalc-${invendproReceipt}', '${parentId}')`);
  }
}

// Function to update the combined total of all calculators (By Ocean and WR calculators)
function updateCombinedTotal() {
  let combinedTotal = 0;

  // Get all By Ocean regular calculators
  const oceanCalculators = document.querySelectorAll('.calculator-instance:not(.shared-wr)');
  
  // Sum the total amount from regular By Ocean calculators
  oceanCalculators.forEach(oceanCalc => {
    const oceanAmount = parseFloat(oceanCalc.querySelector('.totalamount .value').innerText) || 0;
    combinedTotal += oceanAmount;
  });

  // Get all WR calculators
  const wrCalculators = document.querySelectorAll('.calculator-instance.shared-wr');
  
  // Sum the total amount from WR calculators
  wrCalculators.forEach(wrCalc => {
    const parentId = wrCalc.id.split('-')[1];
    const totalAmount = parseFloat(document.getElementById(`totalAmount-${parentId}`).value) || 0;
    combinedTotal += totalAmount;
  });

  // Display the combined total at the top of the page
  document.getElementById('combinedTotalOcean').innerHTML = combinedTotal.toFixed(2);
}


// Add event listener for the "Add WR Calculator" button
document.getElementById('addCalcSharedWROcean').addEventListener('click', addCalculatorSharedWROcean);
