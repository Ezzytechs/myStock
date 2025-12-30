exports.calculateTotalAmount = (totalUnit, amountPerUnit) => {
  return totalUnit * amountPerUnit;
};

exports.calculateNetChange = (amountBeforeExpense, amountAfterExpense) => {
  return amountAfterExpense - amountBeforeExpense;
};

exports.calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.price, 0);
};
