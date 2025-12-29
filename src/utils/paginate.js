exports.paginate = async (Model, options = {}) => {
  const {
    filter = {},
    populate = "",
    sortField = "createdAt",
    sortOrder = -1,
    select = "",
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  const [totalItems, data] = await Promise.all([
    Model.countDocuments(filter),
    Model.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortOrder })
      .select(select)
      .populate(populate),
  ]);
  const totalPages = Math.ceil(totalItems / limit);
  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
};
