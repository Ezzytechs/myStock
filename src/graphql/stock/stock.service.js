const Stock = require("./stock.model");
const { paginate } = require("../../utils/paginate");
//Add new stock
exports.addStock = async (stock) => await Stock.create(stock);

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
