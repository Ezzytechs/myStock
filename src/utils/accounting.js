exports.calculateTotalAmount = (totalUnit, amountPerUnit) =>
  Number(totalUnit) * Number(amountPerUnit);

exports.calculateNetChange = (amountSold, amountAfterExpense) =>
  Number(amountSold) - Number(amountAfterExpense);

exports.calculateTotalExpenses = (expenses) =>
  expenses.reduce((total, expense) => total + Number(expense.price), 0);

exports.calculateLeastSales = (totalUnit, amountAfterExpense) =>
  Number(amountAfterExpense) / Number(totalUnit);

exports.calculateAmountAfterExpense = (totalAmount, totalExpenses) =>
  Number(totalAmount) + Number(totalExpenses);
