// Arrays to store the total amounts for By Ocean calculators
let totalAmountsOcean = [];

// Function to calculate values and update the total amounts for By Ocean calculators
function calculateAllOcean() {
  totalAmountsOcean.length = 0; // Clear previous totals (this resets the array)

  const calculators = document.querySelectorAll(`#newcalcOcean .calculator-instance:not(.shared-wr)`);
  const rate = 10.45; // Rate is constant at 10.45

  calculators.forEach((calc) => {
    const weightInput = calc.querySelector('.weightInput');
    const weight = parseFloat(weightInput.value) || 0; // Handle invalid numbers
    const amount = weight * rate;
    calc.querySelector('.amount .value').innerHTML = amount.toFixed(2);

    // Calculate the BTW (10% of (weight * rate))
    const btw = (10 / 100) * amount;
    const amountWithBtw = amount + btw;
    calc.querySelector('.btw .value').innerHTML = btw.toFixed(2);

    // Warehouse fee is fixed at 3.50
    const warehouse = 3.50;

    // Final total amount (amountWithBtw + warehouse)
    const totalAmount = amountWithBtw + warehouse;
    calc.querySelector('.totalamount .value').innerHTML = totalAmount.toFixed(2);

    // Store the total amount for this calculator
    totalAmountsOcean.push(totalAmount);
  });

  // Update the combined total after calculating all individual totals
  updateCombinedTotalOcean();
}

// Function to update the combined total of all total amounts for By Ocean (including WR)
function updateCombinedTotalOcean() {
  let combinedTotal = 0;

  // Sum totals from regular By Ocean calculators
  const regularCalculators = document.querySelectorAll(`#newcalcOcean .calculator-instance:not(.shared-wr)`);
  regularCalculators.forEach(calc => {
    const totalAmount = parseFloat(calc.querySelector('.totalamount .value').innerHTML) || 0;
    combinedTotal += totalAmount;
  });

  // Sum totals from Shared WR calculators
  const wrCalculators = document.querySelectorAll(`#newcalcOcean .calculator-instance.shared-wr`);
  wrCalculators.forEach(wrCalc => {
    const wrTotalAmount = parseFloat(wrCalc.querySelector('.totalamount input').value) || 0; // Adjust if the value is in an input
    combinedTotal += wrTotalAmount;
  });

  // Update the combined total element
  document.getElementById(`combinedTotalOcean`).innerHTML = combinedTotal.toFixed(2);
}

// Function to add event listeners to input fields for instant calculation
function addInputListenersOcean() {
  const weightInputs = document.querySelectorAll(`#newcalcOcean .weightInput`);
  weightInputs.forEach(input => {
    input.addEventListener('input', calculateAllOcean); // Recalculate when input changes
  });
}

function addCalculatorOcean() {
  const uniqueId = Math.random().toString(36).substr(2, 9);

  // Generate the HTML for a new By Ocean calculator instance
  const addCalcHTML = `
    <div class="calculator-instance" id="calc-${uniqueId}">
      <input type="text" class="weightInput" placeholder="Weight (pounds)">
      <input type="text" class="invendproInput" placeholder="Invendpro Receipt Number">
      <input type="text" class="warehouseInput" placeholder="Warehouse Number">
      <div class="results">
        <div class="rate">Rate/p = 10.45</div>
        <div class="btw">BTW = <span class="value">0.00</span></div>
        <div class="warehouse">Warehouse = 3.50</div>
        <div class="amount">Freight = <span class="value">0.00</span></div>
        <div class="totalamount">Total amount = <span class="value">0.00</span></div>
      </div>
      <button class="deleteCalc" onclick="deleteCalculatorOcean('${uniqueId}')">Delete</button>
    </div>
  `;

  // Use insertAdjacentHTML to append the new calculator without resetting existing ones
  document.getElementById(`newcalcOcean`).insertAdjacentHTML('beforeend', addCalcHTML);

  // Add input listeners to the newly added calculator for instant calculations
  addInputListenersOcean();
}


// Function to delete a specific calculator for By Ocean and recalculate total
function deleteCalculatorOcean(calcId) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    calculator.remove();
    calculateAllOcean(); // Recalculate the combined total after deletion
  }
}

// Add event listeners for adding new By Ocean calculators
document.getElementById('addCalcOcean').addEventListener('click', addCalculatorOcean);
document.getElementById('downloadExcelOcean').addEventListener('click', downloadExcelOcean);


function downloadExcelOcean() {
  console.log("Download button clicked");

  const data = [];

  // Main title for the spreadsheet
  data.push(["Logistics Calculators Summary"]);
  data.push([]);

  // Header for regular calculators section
  data.push(["Regular Calculators"]);
  data.push([
      "Invendpro Receipt",
      "Warehouse Number",
      "Invoice Number",
      "Weight",
      "Rate/p",
      "Freight",
      "BTW",
      "Warehouse Fee",
      "Total Amount"
  ]);

  // Fetching invoice number and date inputs
  const invoiceNumber = document.getElementById(`invoiceNumberOcean`).value || "no-invoice";
  const invoiceDate = document.getElementById(`invoiceDateOcean`).value || "no-date";

  const ratePerPound = 10.45; // Rate/pound is constant
  const warehouseFee = 3.50; // Warehouse fee is constant

  // Collect data from regular By Ocean calculators
  const regularCalculators = document.querySelectorAll(`#newcalcOcean .calculator-instance:not(.shared-wr)`);
  regularCalculators.forEach((calc) => {
      const invendproReceipt = calc.querySelector('.invendproInput') ? calc.querySelector('.invendproInput').value : "N/A";
      const warehouseNumber = calc.querySelector('.warehouseInput') ? calc.querySelector('.warehouseInput').value : "N/A";
      const weight = calc.querySelector('.weightInput') ? calc.querySelector('.weightInput').value : "N/A";
      const freight = calc.querySelector('.amount .value') ? calc.querySelector('.amount .value').innerHTML : "0.00";
      const btw = calc.querySelector('.btw .value') ? calc.querySelector('.btw .value').innerHTML : "0.00";
      const totalAmount = calc.querySelector('.totalamount .value') ? calc.querySelector('.totalamount .value').innerHTML : "0.00";

      // Add a row for each regular calculator
      data.push([
          invendproReceipt,
          warehouseNumber,  // Ensure warehouse number is captured
          invoiceNumber,
          weight,
          ratePerPound,
          freight,
          btw,
          warehouseFee,
          totalAmount
      ]);
  });

  // Add some space before WR calculators
  data.push([]);
  data.push(["Shared WR Calculators"]);
  data.push([
      "Invendpro Receipt",
      "Warehouse Number",
      "Invoice Number",
      "Total Amount"
  ]);

  // Collect data from Shared WR calculators and their sub-calculators
  const wrCalculators = document.querySelectorAll(`#newcalcOcean .calculator-instance.shared-wr`);
  wrCalculators.forEach((wrCalc) => {
      const invendproReceipt = wrCalc.querySelector('.invendproInput') ? wrCalc.querySelector('.invendproInput').value : "N/A";
      const warehouseNumber = wrCalc.querySelector('.warehouseInput') ? wrCalc.querySelector('.warehouseInput').value : "N/A";
      const totalAmount = wrCalc.querySelector('.totalamount input') ? wrCalc.querySelector('.totalamount input').value : "0.00";

      // Add a row for the WR calculator itself
      data.push([
          invendproReceipt,
          warehouseNumber,  // Ensure warehouse number is captured
          invoiceNumber,
          totalAmount
      ]);

      // Sub-calculators
      data.push(["Sub-Calculators"]); // Header for sub-calculators within WR calculator
      data.push([
          "Sub Invendpro Receipt",
          "Warehouse Number",
          "Weight",
          "Weight in Square Feet",
          "Total Ocean Freight"
      ]);

      const subCalculators = wrCalc.querySelectorAll(`.sub-calculator`);
      subCalculators.forEach((subCalc) => {
          const subInvendproReceipt = subCalc.querySelector('.invendproInput') ? subCalc.querySelector('.invendproInput').value : "N/A";
          const subWeight = subCalc.querySelector('.weightInput') ? subCalc.querySelector('.weightInput').value : "N/A"; // Sub-calc weight from input
          const weightSqFtDisplay = subCalc.querySelector('.weight-sqft-display') ? subCalc.querySelector('.weight-sqft-display').innerHTML.split('=')[1].trim() : "0.00";
          const totalOceanFreight = subCalc.querySelector('.total-ocean-freight-display') ? subCalc.querySelector('.total-ocean-freight-display').innerHTML.split('=')[1].trim() : "0.00";

          // Add a row for each sub-calculator under the WR calculator
          data.push([
              subInvendproReceipt,
              warehouseNumber,  // Ensure warehouse number is carried over for sub-calculators
              subWeight,  // Weight from input in sub-calculator
              weightSqFtDisplay,  // Weight in square feet for sub-calculators
              totalOceanFreight  // Total ocean freight for sub-calculators
          ]);
      });
  });

  // Add some space before the combined total
  data.push([]);
  data.push([
      "Combined Total of All Calculators:",
      "", "", "", "", "", "", "", totalAmountsOcean.reduce((acc, cur) => acc + cur, 0).toFixed(2)
  ]);

  // Create a new workbook and add the data
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Apply some basic styling (bold headers, merge cells for main titles, etc.)
  const wscols = [
      { wch: 20 }, // Width of the first column
      { wch: 20 }, // Width of the second column
      { wch: 20 }, // And so on for other columns...
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
  ];
  ws['!cols'] = wscols;

  // Merge the first row for the title
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

  // Add borders around each cell
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell) {
              cell.s = {
                  border: {
                      top: { style: "thin", color: { rgb: "000000" } },
                      bottom: { style: "thin", color: { rgb: "000000" } },
                      left: { style: "thin", color: { rgb: "000000" } },
                      right: { style: "thin", color: { rgb: "000000" } }
                  }
              };
          }
      }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Calculators");

  // Format the file name using both the invoice number and date
  const fileName = `${invoiceNumber ? invoiceNumber : 'calculators'} ${invoiceDate ? invoiceDate : 'no-date'}.xlsx`;

  // Download the Excel file using the constructed file name
  XLSX.writeFile(wb, fileName);

  console.log("Excel file generated with improved organization");
}






// Add event listeners for adding new By Ocean calculators
document.getElementById('addCalcOcean').addEventListener('click', addCalculatorOcean);
document.getElementById('downloadExcelOcean').addEventListener('click', downloadExcelOcean);
