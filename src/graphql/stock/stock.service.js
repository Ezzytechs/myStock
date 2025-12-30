const Stock = require("./stock.model");
const Accounting = require("../accounting/accounting.model");
const { paginate } = require("@utils/paginate");
const {
  calculateTotalExpenses,
  calculateTotalAmount,
} = require("@utils/accounting");

//Add new stock **least sale
exports.addStock = async (stock) => {
  //calculate initial total expenses
  const totalExpenses = calculateTotalExpenses(stock.expenses);
  //calculate total amount
  const totalAmount = calculateTotalAmount(
    stock.totalUnit,
    stock.amountPerUnit
  );
  //set total expenses and total amount
  stock.totalExpenses = totalExpenses;
  stock.totalAmount = totalAmount;
  //create stock and accounting
  const newStock = await Stock.create(stock);
  const newAccounting = await Accounting.create({
    stock: newStock._id,
    amountBeforeExpense: newStock.totalAmount,
    amountAfterExpense: newStock.totalAmount + newStock.totalExpenses,
    owner: stock.owner,
  });

  newStock.accounting = newAccounting._id;
  await newStock.save();

  return newStock;
};
//Get all stocks
exports.getAllStocks = async (page, limit) => {
  return await paginate(Stock, {
    page,
    limit,
  });
};

//Get stock by id
exports.getStockById = async (id) => await Stock.findById(id);

//Update stock
exports.updateStock = async (id, updates, userId) => {
  const filter = userId ? { id, owner: userId } : { id };
  const totalExpenses = calculateTotalExpenses(updates.expenses);
  const totalAmount = calculateTotalAmount(
    updates.totalUnit,
    updates.amountPerUnit
  );
  updates.totalExpenses = totalExpenses;
  updates.totalAmount = totalAmount;
  return Stock.findOneAndUpdate({ ...filter }, { ...updates }, { new: true });
};

//Delete stock
exports.deleteStock = async (id, userId) => {
  const filter = userId ? { id, owner: userId } : { id };
  await Stock.findOneAndDelete(filter);
  return "Stock deleted";
};

//Get stocks by owner
exports.getUserStocks = async (id) => {
  const filter = id ? { owner: id } : {};
  return paginate(Stock, { filter, page, limit });
};

//Get stocks by status
exports.getStocksByStatus = async (id, status, page, limit) => {
  const filter = id ? { owner: id, status } : { status };
  return paginate(Stock, { filter, page, limit });
};

//Get stocks by category
exports.getStocksByCategory = async (id, category, page, limit) => {
  const filter = id ? { owner: id, category } : { category };
  return paginate(Stock, { filter, page, limit });
};

//Get stocks by unit
exports.getStocksByUnit = async (id, unit, page, limit) => {
  const filter = id ? { owner: id, unit } : { unit };
  return paginate(Stock, { filter, page, limit });
};

//Get stock stats
exports.getStockStats = async (id) => {
  const filter = id ? { owner: id } : {};
  const [all, open, closed] = await Promise.all([
    Stock.countDocuments(),
    Stock.countDocuments({ status: "open", ...filter }),
    Stock.countDocuments({ status: "closed", ...filter }),
  ]);
  return { all, open, closed };
};

//Get stocks by year
exports.getStockByYear = async (id, year, page, limit) => {
  const filter = id
    ? {
        owner: id,
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1),
        },
      }
    : {
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1),
        },
      };
  return paginate(Stock, { filter, page: 1, limit: 10 });
};
