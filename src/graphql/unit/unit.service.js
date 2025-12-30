const Unit = require("./unit.model");
const { paginate } = require("@utils/paginate");
const { AppError } = require("@utils/appErrors");
//Add new unit
exports.addUnit = async (unit) => {
  try {
    return await Unit.create(unit);
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get all units
exports.getAllUnits = async (page, limit) => {
  try {
    return await paginate(Unit, {
      page,
      limit,
    });
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get unit by id
exports.getUnitById = async (id) => {
  try {
    return await Unit.findById(id);
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Update unit
exports.updateUnit = async (id, updates) => {
  try {
    return Unit.findOneAndUpdate(
      { id, owner: updates.owner },
      { ...updates },
      { new: true }
    );
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Delete unit
exports.deleteUnit = async (id) => {
  try {
    await Unit.findOneAndDelete({ id });
    return "Unit deleted";
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get unit stats
exports.getUnitStats = async () => {
  try {
    const total = await Unit.countDocuments();
    if (typeof total !== "number")
      throw AppError.notFound("Unable to fetch unit stats");
    return { total };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
