const Stock = require("./stock.model");
const Accounting = require("../accounting/accounting.model");
const { paginate } = require("@utils/paginate");
const {
  calculateTotalExpenses,
  calculateTotalAmount,
  calculateLeastSales,
  calculateAmountAfterExpenses,
} = require("@utils/accounting");
const AppError = require("@utils/appErrors");

//Add new stock **least sale
exports.addStock = async (stock) => {
  try {
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
    const amountAfterExpense = calculateAmountAfterExpenses(
      stock.totalAmount,
      stock.totalExpenses
    );
    //create stock and accounting
    const newStock = await Stock.create(stock);
    const newAccounting = await Accounting.create({
      stock: newStock._id,
      amountBeforeExpense: stock.totalAmount,
      amountAfterExpense,
      leastSale: calculateLeastSales(stock.totalUnit, amountAfterExpense),
      owner: stock.owner,
    });

    newStock.accounting = newAccounting._id;
    await newStock.save();

    return newStock;
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};
//Get all stocks
exports.getAllStocks = async (page, limit) => {
  try {
    return await paginate(Stock, {
      page,
      limit,
      populate: "accounting",
    });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stock by id
exports.getStockById = async (id) => {
  try {
    return await Stock.findById(id).populate("accounting");
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Update stock
exports.updateStock = async (id, updates, userId) => {
  try {
    const filter = userId ? { id, owner: userId } : { id };
    const totalExpenses = calculateTotalExpenses(updates.expenses);
    const totalAmount = calculateTotalAmount(
      updates.totalUnit,
      updates.amountPerUnit
    );

    const amountAfterExpense = calculateAmountAfterExpenses(
      totalAmount,
      totalExpenses
    );
    updates.totalExpenses = totalExpenses;
    updates.totalAmount = totalAmount;
    await Accounting.findOneAndUpdate(
      { ...filter },
      {
        amountBeforeExpense: totalAmount,
        amountAfterExpense,
        leastSale: calculateLeastSales(amountAfterExpense, updates.totalUnit),
      }
    );
    return Stock.findOneAndUpdate(
      { ...filter },
      { ...updates },
      { new: true }
    ).populate("accounting");
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Delete stock
exports.deleteStock = async (id, userId) => {
  try {
    const filter = userId ? { id, owner: userId } : { id };
    await Stock.findOneAndDelete(filter);
    await Accounting.findOneAndDelete({ stock: id });
    return "Stock deleted";
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stocks by owner
exports.getUserStocks = async (id) => {
  try {
    const filter = id ? { owner: id } : {};
    return paginate(Stock, { filter, page, limit, populate: "accounting" });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stocks by status
exports.getStocksByStatus = async (id, status, page, limit) => {
  try {
    const filter = id ? { owner: id, status } : { status };
    return paginate(Stock, { filter, page, limit, populate: "accounting" });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stocks by category
exports.getStocksByCategory = async (id, category, page, limit) => {
  try {
    const filter = id ? { owner: id, category } : { category };
    return paginate(Stock, { filter, page, limit, populate: "accounting" });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stocks by unit
exports.getStocksByUnit = async (id, unit, page, limit) => {
  try {
    const filter = id ? { owner: id, unit } : { unit };
    return paginate(Stock, { filter, page, limit, populate: "accounting" });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stock stats
exports.getStockStats = async (id) => {
  try {
    const filter = id ? { owner: id } : {};
    const [all, open, closed] = await Promise.all([
      Stock.countDocuments(),
      Stock.countDocuments({ status: "open", ...filter }),
      Stock.countDocuments({ status: "closed", ...filter }),
    ]);
    return { all, open, closed };
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

//Get stocks by year
exports.getStockByYear = async (id, year, page, limit) => {
  try {
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
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};
