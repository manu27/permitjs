var Ability = require('./ability');

module.exports = (function () {
    function PermitJS(abilities, options) {
        this.abilities = abilities;
        this.options = options || {};
    };

    PermitJS.prototype.can = function (user, action, target) {
        var ability = new Ability();
        ability.setAbilities(this.abilities, user);

        return ability.test(action, target);
    };

    PermitJS.prototype.cannot = function () {
        return !this.can.apply(this, arguments);
    };

    PermitJS.prototype.authorize = function () {
        var isAllowed = this.can.apply(this, arguments);

        if (!isAllowed) {
            var err = new Error("Not authorized!");
            err.status = 401;
            throw err;
        }
    };

    return PermitJS;
})();