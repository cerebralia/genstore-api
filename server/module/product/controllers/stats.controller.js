
exports.stats = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin' || req.headers.platform !== 'admin') {
      query.shopId = req.user.shopId;
    }
    const total = await DB.Product.count(query);

    res.locals.stats = { total };
    next();
  } catch (e) {
    next(e);
  }
};
