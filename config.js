exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
     'mongodb://admin:qweqweqwe@ds161262.mlab.com:61262/nutrition-app' :
     'mongodb://admin:qweqweqwe@ds161262.mlab.com:61262/nutrition-app');
exports.PORT = process.env.PORT || 5001;