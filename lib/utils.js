module.exports = {
    isArray: function (obj) {
        return obj.constructor === Array;
    },

    getModelName: function (obj) {
        return obj.tableName || obj.__options && obj.__options.name.plural || false;
    }
};