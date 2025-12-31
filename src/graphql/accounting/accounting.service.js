const mongoose = require("mongoose");
const Accounting = require("./accounting.model");
const Stock = require("../stock/stock.model");
const { paginate } = require("@utils/paginate");
const { AppError } = require("@utils/appErrors");
const { calculateNetChange, calculateLeastSale } = require("@utils/accounting");
//Get all accountings
exports.getAllAccountings = async (page, limit, filter) => {
  try {
    return await paginate(Accounting, {
      page,
      limit,
      filter,
      populate: "stock",
    });
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get accounting by id
exports.getAccountingById = async (filter) => {
  try {
    return Accounting.findOne(filter).populate({
      path: "stock",
      select: "name category status",
      populate: [
        {
          path: "owner",
          select: "username email role",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Update accounting
exports.updateAccounting = async (id, updates) => {
  try {
    const stock = await Stock.findById(updates.stock).select("totalUnit");

    if (!stock) throw AppError.notFound("Stock not found");

    const netChange = calculateNetChange(
      updates.amountAfterExpense,
      updates.amountSold
    );
    const remark =
      netChange > 0 ? "profit" : netChange < 0 ? "loss" : "neutral";

    const leastSale = calculateLeastSale(updates.amountSold, stock.totalUnit);
    updates.netChange = netChange;
    updates.leastSale = leastSale;
    updates.remark = remark;
    stock.status = "closed";

    const [updatedAccounting, closedStcok] = await Promise.all([
      Accounting.findOneAndUpdate(
        { id, owner: updates.owner },
        { ...updates },
        { new: true }
      ),
      stock.save(),
    ]);
    return updatedAccounting;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Delete accounting
exports.deleteAccounting = async (filter) => {
  try {
    await Accounting.findOneAndDelete(filter);
    return "Accounting deleted";
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getaccountingStats = async (filter) => {
  try {
    const [total, profit, loss, neutral, initial] = await Promise.all([
      Accounting.countDocuments(filter),
      Accounting.countDocuments({ ...filter, remark: "profit" }),
      Accounting.countDocuments({ ...filter, remark: "loss" }),
      Accounting.countDocuments({ ...filter, remark: "neutral" }),
      Accounting.countDocuments({ ...filter, remark: "initial" }),
    ]);
    return {
      total,
      profit,
      loss,
      neutral,
      initial,
    };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get accounting stats
exports.getAccountingStatsByFilter = async (filter) => {
  try {
    const total = await Accounting.countDocuments(filter);
    if (typeof total !== "number")
      throw AppError.notFound("Unable to fetch accounting stats");
    return { total };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//account summary by remark, stock, owner
exports.getAccountingSummaryByRemark = async (filter = {}) => {
  try {
    // Ensure ObjectId fields are properly cast
    if (filter.owner) {
      filter.owner = new mongoose.Types.ObjectId(filter.owner);
    }

    if (filter.stock) {
      filter.stock = new mongoose.Types.ObjectId(filter.stock);
    }

    const result = await Accounting.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$remark",
          totalAmount: { $sum: "$netChange" },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      profit: 0,
      loss: 0,
      neutral: 0,
    };

    result.forEach((item) => {
      summary[item._id] = item.totalAmount;
    });

    return summary;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getAllTimeProfit = async (filter) => {
  try {
    if (filter.owner) {
      filter.owner = new mongoose.Types.ObjectId(filter.owner);
    }

    const result = await Accounting.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null,
          allTimeProfit: { $sum: "$netChange" },
        },
      },
    ]);
    return {
      allTimeProfit: result[0]?.allTimeProfit || 0,
    };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getTotalNetChangeByYearAndRemark = async (filter) => {
  try {
    const { year, remark } = filter;

    if (!year || !remark) {
      throw AppError.badRequest("year and remark are required");
    }
    if (filter.owner) {
      filter.owner = new mongoose.Types.ObjectId(filter.owner);
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const result = await Accounting.aggregate([
      {
        $match: {
          remark,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalNetChange: { $sum: "$netChange" },
        },
      },
    ]);

    return {
      year: Number(year),
      remark,
      totalNetChange: result[0]?.totalNetChange || 0,
    };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getYearlyAccountingBreakdown = async (filter) => {
  try {
    const { year } = filter;

    if (!year) {
      throw AppError.badRequest("year is required");
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const result = await Accounting.aggregate([
      {
        $match: {
          dateSold: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$remark",
          totalNetChange: { $sum: "$netChange" },
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown = {
      profit: 0,
      loss: 0,
      neutral: 0,
    };

    result.forEach((item) => {
      breakdown[item._id] = item.totalNetChange;
    });

    return {
      year: Number(year),
      breakdown,
    };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
