const Stock = require("./stock.model");
const { paginate } = require("../../utils/paginate");

exports.addStock = async (stock) => await Stock.create(stock);

exports.getAllStocks = async (page, limit) => {
  return await paginate(Stock, {
    page,
    limit,
  });
};

exports.getStockById = async (id) => await Stock.findById(id);

exports.updateStock = async (id, updates, userId) => {
  const filter = userId ? { id, owner: userId } : { id };
  return Stock.findOneAndUpdate({ ...filter }, { ...updates }, { new: true });
};

exports.deleteStock = async (id, userId) => {
  const filter = userId ? { id, owner: userId } : { id };
  await Stock.findOneAndDelete(filter);
  return "Stock deleted";
};

exports.getStocks = async (id) => {
  const filter = id ? { owner: id } : {};
  return Stock.find(filter);
};

exports.getStocksByStatus = async (id, status) => {
  const filter = id ? { owner: id, status } : { status };
  return Stock.find(filter);
};

exports.getStocksByCategory = async (id, category) => {
  const filter = id ? { owner: id, category } : { category };
  return Stock.find(filter);
};

exports.getStocksByUnit = async (id, unit) => {
  const filter = id ? { owner: id, unit } : { unit };
  return Stock.find(filter);
};

exports.getStockStats = async (id) => {
  const filter = id ? { owner: id } : {};
  const [all, open, closed] = await Promise.all([
    Stock.countDocuments(),
    Stock.countDocuments({ status: "open", ...filter }),
    Stock.countDocuments({ status: "closed", ...filter }),
  ]);
  return { all, open, closed };
};

exports.getStockByYear = async (id, year) => {
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
  return Stock.find(filter);
};
