"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var twilio_1 = require("twilio");
function Shotor(username, password, documentSid) {
    var _this = this;
    if (!username || !password) {
        throw new Error('username/password are required');
    }
    if (!documentSid) {
        throw new Error('Document identifier is required');
    }
    var twilio = new twilio_1.Twilio(username, password);
    var syncDocument = twilio.sync.services('default').documents(documentSid);
    var getState = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, syncDocument.fetch()];
    }); }); };
    var getData = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, getState().then(function (resp) { return resp.data; })];
    }); }); };
    var getAnimalData = function (animal) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, getData().then(function (data) { return data[animal]; })];
    }); }); };
    var setState = function (animal, state, value) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getData()];
                case 1:
                    data = _a.sent();
                    data[animal][state] = value;
                    return [2, syncDocument.update({ data: data }).then(function (resp) { return resp.data[animal]; })];
            }
        });
    }); };
    var incrementCount = function (animal) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getAnimalData(animal)];
                case 1:
                    data = _a.sent();
                    return [2, setState(animal, 'count', data.count + 1)];
            }
        });
    }); };
    var decrementCount = function (animal) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getAnimalData(animal)];
                case 1:
                    data = _a.sent();
                    return [2, setState(animal, 'count', Math.max(0, data.count - 1))];
            }
        });
    }); };
    var hasTimer = function (animal) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, getAnimalData(animal).then(function (data) { return data.timer > Date.now(); })];
    }); }); };
    var setTimer = function (animal, amount) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, hasTimer(animal)];
                case 1:
                    if (_a.sent()) {
                        throw new Error('A timer is already set');
                    }
                    return [2, setState(animal, 'timer', amount)];
            }
        });
    }); };
    return {
        getState: getState,
        getData: getData,
        getAnimalData: getAnimalData,
        setState: setState,
        incrementCount: incrementCount,
        decrementCount: decrementCount,
        hasTimer: hasTimer,
        setTimer: setTimer,
    };
}
exports.default = Shotor;
Shotor('ACf0b163b92e4a1cc99c63d040d6668549', '4b41bf30262e67e2ae957e9e0b51d0f3', 'ET4859bd1660b143a3965952a7884a36df')
    .hasTimer('shotor')
    .then(console.log);
//# sourceMappingURL=index.js.map