var utils = require('./utils');
var isArray = utils.isArray;
var getModelName = utils.getModelName;

module.exports = (function () {
    function Ability() {
        this.rules = [];
    }

    Ability.prototype.setAbilities = function (abilities, user) {
        abilities[user.role].call(this, user);
    };

    Ability.prototype.can = function (actions, targets, attrs) {
        if (!isArray(actions)) actions = [actions];
        if (!isArray(targets)) targets = [targets];
        var _this = this;
        targets.forEach(function (target) {
            actions.forEach(function (action) {
                registerAbility.call(_this, action, target, attrs);
            });
        });
    };

    Ability.prototype.test = function (action, target) {
        if (!action || !target) return false;

        var rules = this.rules.filter(function (rule) {
            var actionMatches = 'manage' === rule.action || action === rule.action;
            var targetMatches = 'all' === rule.target || getModelName(target) === rule.target || getModelName(target) === getModelName(rule.target);

            var attrsMatch = true;
            if (rule.attrs) {
                if (rule.attrs.constructor === Function) {
                    attrsMatch = rule.attrs(target);
                }

                if (rule.attrs.constructor === Object) {
                    Object.keys(rule.attrs).forEach(function (key) {
                        var expectedValue = rule.attrs[key];
                        var actualValue = target[key];

                        if (actualValue !== expectedValue) attrsMatch = false;
                    });
                }
            }

            return actionMatches && targetMatches && attrsMatch;
        });

        return !!rules.length;
    };

    // private

    var registerAbility = function (action, target, attrs) {
        var rule = {
            action: action,
            target: target,
            attrs: attrs
        };

        this.rules.push(rule);
    };

    return Ability;
})();