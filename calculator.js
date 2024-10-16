// Arrays to store the total amounts for By Air calculators and Shared WR calculators
let totalAmountsAir = [];
let totalAmountsSharedWR = [];

// Function to calculate values and update the total amounts for By Air calculators and Shared WR calculators
function calculateAllAir() {
  totalAmountsAir.length = 0; // Clear previous totals for By Air
  totalAmountsSharedWR.length = 0; // Clear previous totals for Shared WR

  // Select both By Air and Shared WR calculators
  const allCalculators = document.querySelectorAll(`#newcalcAir .calculator-instance`);

  const rate = 4.50; // Rate is constant at 4.50
  const warehouseFeeTotal = 3.50; // Total warehouse fee to be split among Shared WR calculators
  const sharedWRCalculators = document.querySelectorAll(`#newcalcAir .calculator-instance.shared-wr`);
  const numSharedWRCalculators = sharedWRCalculators.length;
  const warehouseFeePerCalc = warehouseFeeTotal / numSharedWRCalculators || 0; // Avoid divide by 0

  allCalculators.forEach((calc) => {
    const weightInput = calc.querySelector('.weightInput');
    const invendproInput = calc.querySelector('.invendproInput');
    const warehouseInput = calc.querySelector('.warehouseInput');

    const weight = parseFloat(weightInput.value) || 0;
    const invendproReceipt = invendproInput.value;
    const warehouseNumber = warehouseInput.value;

   
    // Calculate the amount (weight * rate)
    const amount = weight * rate;
    calc.querySelector('.amount .value').innerHTML = amount.toFixed(2);

    // Calculate the BTW (10% of (weight * rate))
    const btw = (10 / 100) * amount;
    const amountWithBtw = amount + btw;
    calc.querySelector('.btw .value').innerHTML = btw.toFixed(2);

    // Check if the calculator is a Shared WR calculator
    if (calc.classList.contains('shared-wr')) {
      // Shared WR logic: Warehouse fee is split by the number of calculators
      calc.querySelector('.warehouse').innerHTML = `Warehouse = ${warehouseFeePerCalc.toFixed(2)}`;

      // Final total amount (amountWithBtw + shared warehouse fee)
      const totalAmountSharedWR = amountWithBtw + warehouseFeePerCalc;
      calc.querySelector('.totalamount .value').innerHTML = totalAmountSharedWR.toFixed(2);

      // Store the total amount for this Shared WR calculator
      totalAmountsSharedWR.push(totalAmountSharedWR);
    } else {
      // Regular By Air calculator - Fixed warehouse fee of 3.50
      const warehouse = 3.50;
      calc.querySelector('.warehouse').innerHTML = `Warehouse = ${warehouse.toFixed(2)}`;

      // Final total amount (amountWithBtw + fixed warehouse fee)
      const totalAmountAir = amountWithBtw + warehouse;
      calc.querySelector('.totalamount .value').innerHTML = totalAmountAir.toFixed(2);

      // Store the total amount for this By Air calculator
      totalAmountsAir.push(totalAmountAir);
    }
  });

  // Update the combined total for all calculators (By Air + Shared WR)
  updateCombinedTotalAirAndSharedWR();
}

// Function to update the combined total of all total amounts for By Air and Shared WR calculators
function updateCombinedTotalAirAndSharedWR() {
  const combinedTotalAir = totalAmountsAir.reduce((acc, cur) => acc + cur, 0);
  const combinedTotalSharedWR = totalAmountsSharedWR.reduce((acc, cur) => acc + cur, 0);
  const combinedTotal = combinedTotalAir + combinedTotalSharedWR;

  document.getElementById(`combinedTotalAir`).innerHTML = combinedTotal.toFixed(2);
}

// Function to add a single calculator instance for By Air
function addCalculatorAir() {
  const uniqueId = Math.random().toString(36).substr(2, 9);

  const addCalcHTML = `
    <div class="calculator-instance" id="calc-${uniqueId}">
      <input type="text" class="weightInput" placeholder="Weight">
      <input type="text" class="invendproInput" placeholder="Invendpro Receipt Number">
      <input type="text" class="warehouseInput" placeholder="Warehouse Number">
      <div class="results">
        <div class="rate">Rate/p = 4.50</div>
        <div class="btw">BTW = <span class="value"></span></div>
        <div class="warehouse">Warehouse = 3.50</div>
        <div class="amount">Freight = <span class="value"></span></div>
        <div class="totalamount">Total amount = <span class="value"></span></div>
      </div>
      <button class="deleteCalc" onclick="deleteCalculatorAir('${uniqueId}')">Delete</button>
    </div>
  `;

  // Instead of using innerHTML +=, use insertAdjacentHTML
  document.getElementById('newcalcAir').insertAdjacentHTML('beforeend', addCalcHTML);
}


// Function to add a single calculator instance for Shared WR and immediately display split warehouse fee
function addCalculatorSharedWR() {
  const uniqueId = Math.random().toString(36).substr(2, 9);

  const addCalcHTML = `
    <div class="calculator-instance shared-wr" id="calc-${uniqueId}">
      <input type="text" class="weightInput" placeholder="Weight">
      <input type="text" class="invendproInput" placeholder="Invendpro Receipt Number">
      <input type="text" class="warehouseInput" placeholder="Warehouse Number">
      <div class="results">
        <div class="rate">Rate/p = 4.50</div>
        <div class="btw">BTW = <span class="value"></span></div>
        <div class="warehouse">Warehouse = 0.00</div> <!-- Warehouse will be updated -->
        <div class="amount">Freight = <span class="value"></span></div>
        <div class="totalamount">Total amount = <span class="value"></span></div>
      </div>
      <button class="deleteCalc" onclick="deleteCalculatorSharedWR('${uniqueId}')">Delete</button>
    </div>
  `;

  document.getElementById(`newcalcAir`).innerHTML += addCalcHTML;

  // Immediately recalculate the warehouse split for all Shared WR calculators and update the fee
  recalculateWarehouseSplitAndDisplay();
}

// Function to recalculate and display the split warehouse fee for all Shared WR calculators
function recalculateWarehouseSplitAndDisplay() {
  const sharedWRCalculators = document.querySelectorAll(`#newcalcAir .calculator-instance.shared-wr`);
  const warehouseFeeTotal = 3.50;
  const numSharedWRCalculators = sharedWRCalculators.length;
  const warehouseFeePerCalc = warehouseFeeTotal / numSharedWRCalculators;

  // Update each Shared WR calculator with the split warehouse fee
  sharedWRCalculators.forEach(calc => {
    calc.querySelector('.warehouse').innerHTML = `Warehouse = ${warehouseFeePerCalc.toFixed(2)}`;
  });

  // Recalculate totals for all Shared WR calculators
  calculateAllSharedWR();
}

// Add new calculator instances for By Air
document.getElementById('addCalcAir').addEventListener('click', () => {
  const numCalculators = parseInt(document.getElementById('numCalculatorsAir').value, 10);
  for (let i = 0; i < numCalculators; i++) {
    addCalculatorAir();
  }
});

// Add new calculator instances for Shared WR
document.getElementById('addCalcSharedWR').addEventListener('click', () => {
  const numCalculators = parseInt(document.getElementById('numCalculatorsAir').value, 10);
  for (let i = 0; i < numCalculators; i++) {
    addCalculatorSharedWR();
  }
});

// Function to delete a calculator for By Air
function deleteCalculatorAir(calcId) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    calculator.remove();
    calculateAllAir(); // Recalculate after deletion

  }
}

// Function to delete a calculator for Shared WR
function deleteCalculatorSharedWR(calcId) {
  const calculator = document.getElementById(`calc-${calcId}`);
  if (calculator) {
    // Remove the calculator from the DOM
    calculator.remove();

    // Recalculate the warehouse split and update the total amounts after deletion
    recalculateWarehouseSplitAndDisplay();
  }
}

// Function to recalculate and display the split warehouse fee for all Shared WR calculators
function recalculateWarehouseSplitAndDisplay() {
  const sharedWRCalculators = document.querySelectorAll(`#newcalcAir .calculator-instance.shared-wr`);
  const warehouseFeeTotal = 3.50;
  const numSharedWRCalculators = sharedWRCalculators.length;
  const warehouseFeePerCalc = warehouseFeeTotal / numSharedWRCalculators;

  // Update each Shared WR calculator with the split warehouse fee
  sharedWRCalculators.forEach(calc => {
    calc.querySelector('.warehouse').innerHTML = `Warehouse = ${warehouseFeePerCalc.toFixed(2)}`;
  });

  // Recalculate totals for all Shared WR calculators and update the total
  calculateAllAir();  // This function recalculates both By Air and Shared WR calculators
}


// Function to download all calculators (By Air + Shared WR) as an Excel file
function downloadExcel() {
  const calculators = document.querySelectorAll(`#newcalcAir .calculator-instance`);
  const invoiceNumber = document.getElementById('invoiceNumberAir').value.trim(); // Fetch the invoice number
  const invoiceDate = document.getElementById('invoiceDateAir').value.trim(); // Fetch the date
  const data = [];

  // Header row for the Excel file (now including Invoice Number and Date)
  data.push(["Invendpro Receipt", "Warehouse Number", "Invoice Number", "Date", "Weight", "Freight", "BTW", "Warehouse Fee", "Total Amount"]);

  // Collect data from each calculator (By Air and Shared WR)
  calculators.forEach((calc) => {
    const invendproReceipt = calc.querySelector('.invendproInput').value;
    const warehouseNumber = calc.querySelector('.warehouseInput').value;
    const weight = calc.querySelector('.weightInput').value;
    const freight = calc.querySelector('.amount .value').innerHTML;
    const btw = calc.querySelector('.btw .value').innerHTML;
    const warehouseFee = calc.querySelector('.warehouse').innerHTML.split('=')[1].trim();
    const totalAmount = calc.querySelector('.totalamount .value').innerHTML;

    // Add a row for each calculator, including invoice number and date
    data.push([invendproReceipt, warehouseNumber, invoiceNumber, invoiceDate, weight, freight, btw, warehouseFee, totalAmount]);
  });

  // Add a row for the combined total
  const combinedTotal = document.getElementById('combinedTotalAir').innerHTML;
  data.push([]);
  data.push(["Combined Total of All Calculators:", "", "", "", "", "", "", "", combinedTotal]);

  // Create a new workbook and add the data
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Calculators");

  // Format the file name using both the invoice number and date
  const fileName = `${invoiceNumber ? invoiceNumber : 'calculators'} ${invoiceDate ? invoiceDate : 'no-date'}.xlsx`;

  // Download the Excel file using the constructed file name
  XLSX.writeFile(wb, fileName);
}

// Add event listener for the "Download Excel" button
document.getElementById('downloadExcelAir').addEventListener('click', downloadExcel);
