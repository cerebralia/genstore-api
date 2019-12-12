require('./components/Braintree');

exports.model = {
  Transaction: require('./models/transaction'),
  Invoice: require('./models/invoice'),
  ShopFeaturedPackage: require('./models/shop-featured-package')
};

exports.router = (router) => {
  require('./routes/transaction')(router);
  require('./routes/paypal')(router);
  require('./routes/invoice')(router);
  require('./routes/shop-featured')(router);
};

exports.services = {
  Payment: require('./services/Payment'),
  ShopFeatured: require('./services/ShopFeatured')
};
