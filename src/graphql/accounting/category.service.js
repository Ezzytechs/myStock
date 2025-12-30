const Category = require("./accounting.model");
const { paginate } = require("@utils/paginate");
const { AppError } = require("@utils/appErrors");
//Add new category
exports.addCategory = async (category) => {
  try {
    return await Category.create(category);
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get all categories
exports.getAllCategories = async (page, limit) => {
  try {
    return await paginate(Category, {
      page,
      limit,
    });
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get category by id
exports.getCategoryById = async (id) => {
  try {
    return await Category.findById(id);
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Update category
exports.updateCategory = async (id, updates) => {
  try {
    return Category.findOneAndUpdate(
      { id, owner: updates.owner },
      { ...updates },
      { new: true }
    );
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Delete category
exports.deleteCategory = async (id) => {
  try {
    await Category.findOneAndDelete({ id });
    return "Category deleted";
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

//Get category stats
exports.getCategoryStats = async () => {
  try {
    const total = await Category.countDocuments();
    if (typeof total !== "number")
      throw AppError.notFound("Unable to fetch category stats");
    return { total };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
