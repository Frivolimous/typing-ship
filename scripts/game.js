var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("JMGE/JMBL", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initialized = false;
    exports.interactionMode = 'desktop';
    function setInteractionMode(s) {
        this.interactionMode = s;
    }
    exports.setInteractionMode = setInteractionMode;
    function init(app) {
        app.ticker.add(exports.events.onTick);
        exports.textures.renderer = app.renderer;
        exports.inputManager.init(app);
        exports.initialized = true;
    }
    exports.init = init;
    exports.textures = new (function () {
        function class_1() {
            this.cache = {};
        }
        class_1.prototype.addTextureFromGraphic = function (graphic, id) {
            var m = this.renderer.generateTexture(graphic);
            if (id) {
                this.cache[id] = m;
            }
            return m;
        };
        class_1.prototype.getTexture = function (id) {
            if (this.cache[id]) {
                return this.cache[id];
            }
            else {
                return PIXI.Texture.WHITE;
            }
        };
        return class_1;
    }());
    exports.utils = new (function () {
        function class_2() {
        }
        class_2.prototype.clone = function (obj) {
            if (Array.isArray(obj)) {
                var m = [];
                for (var i = 0; i < obj.length; i++) {
                    m.push(obj[i]);
                }
                return m;
            }
            else if (obj === Object(obj)) {
                var m = {};
                for (var v in obj) {
                    m[v] = obj[v];
                }
                return m;
            }
            return obj;
        };
        class_2.prototype.deep = function (obj) {
            if (Array.isArray(obj)) {
                var m = [];
                for (var i = 0; i < obj.length; i += 1) {
                    m.push(this.deep(obj[i]));
                }
                return m;
            }
            else if (obj === Object(obj)) {
                var m = {};
                for (var v in obj) {
                    m[v] = this.deep(obj[v]);
                }
                return m;
            }
            return obj;
        };
        class_2.prototype.default = function (options, defaults) {
            var op = options;
            for (var v in defaults) {
                op[v] = (op[v] || op[v] === 0 || op[v] === false) ? op[v] : defaults[v];
            }
            return op;
        };
        class_2.prototype.pull = function (element, array) {
            for (var i = 0; i < array.length; i += 1) {
                if (array[i] === element) {
                    array.splice(i, 1);
                    return array;
                }
            }
            return array;
        };
        class_2.prototype.find = function (array, condition) {
            for (var i = 0; i < array.length; i++) {
                if (condition(array[i])) {
                    return array[i];
                }
            }
            return null;
        };
        class_2.prototype.diminish = function (n, p, i) {
            return n * Math.pow(1 - p, i - 1);
        };
        class_2.prototype.compound = function (n, p, i) {
            return n * Math.pow(1 + p, i - 1);
        };
        class_2.prototype.mult = function (n1, n2) {
            return (1 - (1 - n1) * (1 - n2));
        };
        class_2.prototype.div = function (n1, n2) {
            return (1 - (1 - n1) / (1 - n2));
        };
        class_2.prototype.toPercent = function (n, precision) {
            if (precision === void 0) { precision = 0; }
            var tens = Math.pow(10, precision);
            return String(Math.round(n * 100 * tens) / tens) + "%";
        };
        class_2.prototype.hitTestPolygon = function (point, polygon) {
            var numCrosses = 0;
            var i = 0;
            var j = polygon.length - 1;
            if (polygon[i].x === polygon[j].x && polygon[i].y === polygon[j].y) {
                i = 1;
                j = 0;
            }
            for (i = i; i < polygon.length; i += 1) {
                if (point.x >= Math.min(polygon[i].x, polygon[j].x) && point.x <= Math.max(polygon[i].x, polygon[j].x)) {
                    var dx = polygon[i].x - polygon[j].x;
                    var dy = polygon[i].y - polygon[j].y;
                    var ratio = dy / dx;
                    var d2x = point.x - polygon[j].x;
                    var d2y = ratio * d2x;
                    var yAtX = polygon[j].y + d2y;
                    if (yAtX > point.y) {
                        numCrosses += 1;
                    }
                }
                j = i;
            }
            return (numCrosses % 2 === 1);
        };
        return class_2;
    }());
    exports.tween = new (function () {
        function Tween() {
            var _this = this;
            this.wait = function (object, ticks, config) {
                if (config === void 0) { config = {}; }
                var cTicks = 0;
                function _tickThis() {
                    cTicks += 1;
                    if (config.onUpdate)
                        config.onUpdate(object);
                    if (cTicks > ticks) {
                        exports.events.ticker.remove(_tickThis);
                        if (config.onComplete)
                            config.onComplete(object);
                    }
                }
                exports.events.ticker.add(_tickThis);
            };
            this.to = function (object, ticks, props, config) {
                if (config === void 0) { config = {}; }
                if (props == null)
                    return;
                var properties = {};
                var cTicks = 0;
                for (var v in props) {
                    if (v == "delay") {
                        cTicks = -props[v];
                    }
                    else {
                        properties[v] = { start: object[v], end: props[v], inc: (props[v] - object[v]) / ticks };
                    }
                }
                function _tickThis() {
                    cTicks += 1;
                    if (config.onUpdate)
                        config.onUpdate(object);
                    if (cTicks > ticks) {
                        for (var v in properties) {
                            object[v] = properties[v].end;
                        }
                        exports.events.ticker.remove(_tickThis);
                        if (config.onComplete)
                            config.onComplete(object);
                    }
                    else if (cTicks >= 0) {
                        for (var v in properties) {
                            object[v] = properties[v].start + properties[v].inc * cTicks;
                        }
                    }
                }
                exports.events.ticker.add(_tickThis);
            };
            this.from = function (object, ticks, props, config) {
                if (config === void 0) { config = {}; }
                if (props == null)
                    return;
                var newProps = {};
                for (var v in props) {
                    if (v == "delay") {
                        newProps[v] = props[v];
                    }
                    else {
                        newProps[v] = object[v];
                        object[v] = props[v];
                    }
                }
                _this.to(object, ticks, props, config);
            };
            this.colorTo = function (object, ticks, props, config) {
                if (config === void 0) { config = {}; }
                if (!props)
                    return;
                var properties = {};
                var cTicks = 0;
                for (var v in props) {
                    if (v == "delay") {
                        cTicks = -props[v];
                    }
                    else {
                        properties[v] = { start: object[v], end: props[v],
                            incR: Math.floor(props[v] / 0x010000) - Math.floor(object[v] / 0x010000) / ticks,
                            incG: Math.floor((props[v] % 0x010000) / 0x000100) - Math.floor((object[v] % 0x010000) / 0x000100) / ticks,
                            incB: Math.floor(props[v] % 0x000100) - Math.floor(object[v] % 0x000100) / ticks,
                        };
                    }
                }
                function _tickThis() {
                    cTicks += 1;
                    if (config.onUpdate)
                        config.onUpdate(object);
                    if (cTicks > ticks) {
                        for (var v_1 in properties) {
                            object[v_1] = properties[v_1].end;
                        }
                        exports.events.ticker.remove(_tickThis);
                        if (config.onComplete)
                            config.onComplete(object);
                    }
                    else if (cTicks >= 0) {
                        for (var v in properties) {
                            object[v] = properties[v].start + Math.floor(properties[v].incR * cTicks) * 0x010000 + Math.floor(properties[v].incG * cTicks) * 0x000100 + Math.floor(properties[v].incB * cTicks);
                        }
                    }
                }
                exports.events.ticker.add(_tickThis);
            };
        }
        return Tween;
    }());
    var EventType;
    (function (EventType) {
        EventType["MOUSE_MOVE"] = "mouseMove";
        EventType["MOUSE_DOWN"] = "mouseDown";
        EventType["MOUSE_UP"] = "mouseUp";
        EventType["MOUSE_CLICK"] = "mouseClick";
        EventType["MOUSE_WHEEL"] = "mouseWheel";
        EventType["KEY_DOWN"] = "keyDown";
        EventType["KEY_UP"] = "keyUp";
        EventType["UI_OVER"] = "uiOver";
        EventType["UI_OFF"] = "uiOff";
    })(EventType = exports.EventType || (exports.EventType = {}));
    exports.events = new (function () {
        function class_3() {
            var _this = this;
            this.registry = {};
            this.activeRegistry = [];
            this.tickEvents = [];
            this.ticker = {
                add: function (output) { return exports.events.tickEvents.push(output); },
                remove: function (output) { return exports.utils.pull(output, exports.events.tickEvents); }
            };
            this.onTick = function () {
                while (_this.activeRegistry.length > 0) {
                    var register = _this.activeRegistry.shift();
                    register.active = false;
                    var _loop_1 = function () {
                        var event_1 = register.events.shift();
                        register.listeners.forEach(function (output) { return output(event_1); });
                        while (register.once.length > 0) {
                            register.once.shift()(event_1);
                        }
                    };
                    while (register.events.length > 0) {
                        _loop_1();
                    }
                }
                _this.tickEvents.forEach(function (output) { return output(); });
            };
        }
        class_3.prototype.clearAllEvents = function () {
            this.registry = {};
            this.activeRegistry = [];
            this.tickEvents = [];
        };
        class_3.prototype.createRegister = function (type) {
            this.registry[type] = new JMERegister;
        };
        class_3.prototype.add = function (type, output) {
            if (!this.registry[type])
                this.createRegister(type);
            this.registry[type].listeners.push(output);
        };
        class_3.prototype.addOnce = function (type, output) {
            if (!this.registry[type])
                this.createRegister(type);
            this.registry[type].once.push(output);
        };
        class_3.prototype.remove = function (type, output) {
            if (this.registry[type]) {
                exports.utils.pull(output, this.registry[type].listeners);
            }
        };
        class_3.prototype.publish = function (type, event) {
            if (!this.registry[type])
                this.createRegister(type);
            this.registry[type].events.push(event);
            if (!this.registry[type].active) {
                this.registry[type].active = true;
                this.activeRegistry.push(this.registry[type]);
            }
        };
        class_3.prototype.selfPublish = function (register, event, replaceCurrent) {
            if (replaceCurrent) {
                register.events = [event];
            }
            else {
                register.events.push(event);
            }
            if (!register.active) {
                register.active = true;
                this.activeRegistry.push(register);
            }
        };
        return class_3;
    }());
    var JMERegister = (function () {
        function JMERegister() {
            this.listeners = [];
            this.once = [];
            this.events = [];
            this.active = false;
        }
        return JMERegister;
    }());
    var SelfRegister = (function (_super) {
        __extends(SelfRegister, _super);
        function SelfRegister(onlyLast) {
            var _this = _super.call(this) || this;
            _this.onlyLast = onlyLast;
            return _this;
        }
        SelfRegister.prototype.add = function (output) {
            this.listeners.push(output);
        };
        SelfRegister.prototype.remove = function (output) {
            exports.utils.pull(output, this.listeners);
        };
        SelfRegister.prototype.addOnce = function (output) {
            this.once.push(output);
        };
        SelfRegister.prototype.publish = function (event) {
            exports.events.selfPublish(this, event, this.onlyLast);
        };
        return SelfRegister;
    }(JMERegister));
    exports.SelfRegister = SelfRegister;
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Rect.prototype.setLeft = function (n) {
            this.width += this.x - n;
            this.x = n;
        };
        Rect.prototype.setRight = function (n) {
            this.width += n - this.right;
        };
        Rect.prototype.setTop = function (n) {
            this.height -= n - this.y;
            this.y = n;
        };
        Rect.prototype.setBot = function (n) {
            this.height += n - this.top;
        };
        return Rect;
    }(PIXI.Rectangle));
    exports.Rect = Rect;
    exports.inputManager = new (function () {
        function class_4() {
            var _this = this;
            this.MOUSE_HOLD = 200;
            this.onWheel = function (e) {
                exports.events.publish(EventType.MOUSE_WHEEL, { mouse: _this.mouse, deltaY: e.deltaY });
            };
            this.onKeyDown = function (e) {
                switch (e.key) {
                    case "a":
                    case "A": break;
                    case "Control":
                        _this.mouse.ctrlKey = true;
                        break;
                }
                exports.events.publish(EventType.KEY_DOWN, { key: e.key });
            };
            this.onKeyUp = function (e) {
                switch (e.key) {
                    case "Control":
                        _this.mouse.ctrlKey = false;
                        break;
                }
                exports.events.publish(EventType.KEY_UP, { key: e.key });
            };
        }
        class_4.prototype.init = function (app) {
            this.app = app;
            this.mouse = new MouseObject();
            this.mouse.addCanvas(app.stage);
            window.addEventListener("keydown", this.onKeyDown);
            window.addEventListener("keyup", this.onKeyUp);
            window.addEventListener("mousewheel", this.onWheel);
        };
        return class_4;
    }());
    var MouseObject = (function (_super) {
        __extends(MouseObject, _super);
        function MouseObject(config) {
            if (config === void 0) { config = {}; }
            var _this = _super.call(this, config.x, config.y) || this;
            _this.clickMode = false;
            _this.down = false;
            _this.ctrlKey = false;
            _this.timerRunning = false;
            _this.onUI = false;
            _this.disabled = false;
            _this.touchMode = false;
            _this.enableTouchMode = function () {
                _this.touchMode = true;
                _this.canvas.removeListener("touchstart", _this.enableTouchMode);
                _this.canvas.addListener("mousedown", _this.disableTouchMode);
                _this.canvas.removeListener("pointerup", _this.onUp);
                _this.canvas.addListener("touchend", _this.onUp);
            };
            _this.disableTouchMode = function () {
                _this.touchMode = false;
                _this.canvas.removeListener("mousedown", _this.disableTouchMode);
                _this.canvas.addListener("touchstart", _this.enableTouchMode);
                _this.canvas.removeListener("touchend", _this.onUp);
                _this.canvas.addListener("pointerup", _this.onUp);
            };
            _this.startDrag = function (target, onMove, onRelease, onDown, offset) {
                target.selected = true;
                _this.drag = new DragObject(target, onMove, onRelease, onDown, offset);
            };
            _this.endDrag = function () {
                if (_this.drag) {
                    if (_this.drag.release(_this)) {
                        _this.drag = null;
                    }
                }
            };
            _this.onDown = function (e) {
                _this.onMove(e);
                _this.down = true;
                if (_this.disabled || _this.timerRunning) {
                    return;
                }
                if (_this.drag) {
                    if (_this.drag.down && _this.drag.down(_this)) {
                        _this.drag = null;
                    }
                }
                else {
                    if (_this.clickMode) {
                        _this.timerRunning = true;
                        setTimeout(function () {
                            _this.timerRunning = false;
                            if (_this.down) {
                                exports.events.publish(EventType.MOUSE_DOWN, _this);
                            }
                        }, MouseObject.HOLD);
                    }
                    else {
                        exports.events.publish(EventType.MOUSE_DOWN, _this);
                    }
                }
            };
            _this.onUp = function (e) {
                _this.onMove(e);
                _this.down = false;
                if (_this.disabled) {
                    return;
                }
                if (_this.drag) {
                    _this.endDrag();
                }
                else {
                    if (_this.clickMode && _this.timerRunning) {
                        exports.events.publish(EventType.MOUSE_CLICK, _this);
                    }
                    else {
                        exports.events.publish(EventType.MOUSE_UP, _this);
                    }
                }
            };
            _this.onMove = function (e) {
                _this.target = e.target;
                if (e.target && e.target.isUI) {
                    _this.onUI = true;
                }
                else {
                    _this.onUI = false;
                }
                var point = e.data.getLocalPosition(_this.canvas);
                if (_this.locationFilter) {
                    point = _this.locationFilter(point, _this.drag ? _this.drag.object : null);
                }
                _this.set(point.x, point.y);
                if (_this.disabled) {
                    return;
                }
                if (_this.drag != null) {
                    if (_this.drag.move) {
                        _this.drag.move(_this);
                    }
                }
                exports.events.publish(EventType.MOUSE_MOVE, _this);
            };
            _this.down = config.down || false;
            _this.drag = config.drag || null;
            _this.id = config.id || 0;
            return _this;
        }
        MouseObject.prototype.addCanvas = function (canvas) {
            this.canvas = canvas;
            canvas.addListener("touchstart", this.enableTouchMode);
            canvas.addListener("pointerdown", this.onDown);
            canvas.addListener("pointermove", this.onMove);
            canvas.addListener("pointerup", this.onUp);
            canvas.addListener("pointerupoutside", this.onUp);
        };
        MouseObject.HOLD = 200;
        return MouseObject;
    }(PIXI.Point));
    exports.MouseObject = MouseObject;
    var DragObject = (function () {
        function DragObject(object, onMove, onRelease, onDown, offset) {
            this.object = object;
            this.onRelease = onRelease || this.nullFunc;
            this.onDown = onDown || this.nullFunc;
            this.onMove = onMove || this.nullFunc;
            this.offset = offset;
        }
        DragObject.prototype.setOffset = function (x, y) {
            this.offset = new PIXI.Point(x, y);
        };
        DragObject.prototype.nullFunc = function (object, e) {
            return true;
        };
        ;
        DragObject.prototype.release = function (e) {
            var m = this.onRelease(this.object, e);
            this.object.selected = !m;
            return m;
        };
        DragObject.prototype.move = function (e) {
            return this.onMove(this.object, e);
        };
        DragObject.prototype.down = function (e) {
            var m = this.onDown(this.object, e);
            this.object.selected = !m;
            return m;
        };
        return DragObject;
    }());
    exports.DragObject = DragObject;
});
define("GraphicData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageRepo = (function () {
        function ImageRepo() {
        }
        ImageRepo.sm = "./Bitmaps/Separate/sm.png";
        ImageRepo.mm = "./Bitmaps/Separate/mm.png";
        ImageRepo.lm = "./Bitmaps/Separate/lm.png";
        ImageRepo.sl = "./Bitmaps/Separate/sl.png";
        ImageRepo.ml = "./Bitmaps/Separate/ml.png";
        ImageRepo.ll = "./Bitmaps/Separate/ll.png";
        ImageRepo.ss = "./Bitmaps/Separate/ss.png";
        ImageRepo.ms = "./Bitmaps/Separate/ms.png";
        ImageRepo.ls = "./Bitmaps/Separate/ls.png";
        ImageRepo.turret = "./Bitmaps/Separate/turret.png";
        ImageRepo.superman = "./Bitmaps/Separate/superman.png";
        ImageRepo.player = "./Bitmaps/Separate/player/red 1.png";
        ImageRepo.playerMissile = "./Bitmaps/Separate/missiles/p mi.png";
        ImageRepo.enemyMissile = "./Bitmaps/Separate/missiles/me ship 1.png";
        ImageRepo.boss0 = "./Bitmaps/Separate/boss/boss0.png";
        ImageRepo.boss1 = "./Bitmaps/Separate/boss/boss1.png";
        ImageRepo.boss2 = "./Bitmaps/Separate/boss/boss2.png";
        ImageRepo.boss0Over0 = "./Bitmaps/doors2.png";
        ImageRepo.boss0Over1 = "./Bitmaps/doors3.png";
        ImageRepo.boss0Over2 = "./Bitmaps/doors4.png";
        return ImageRepo;
    }());
    exports.ImageRepo = ImageRepo;
    var TextureData = (function () {
        function TextureData() {
        }
        TextureData.init = function (_renderer) {
            var _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff);
            _graphic.drawCircle(-25, -25, 25);
            this.circle = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff);
            _graphic.drawCircle(-5, -5, 5);
            this.smallCircle = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xcccccc);
            _graphic.drawRoundedRect(0, 0, 30, 30, 5);
            this.itemRect = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0, 0.3);
            _graphic.drawEllipse(0, 0, 5, 2);
            this.genericShadow = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff, 0.5);
            _graphic.lineStyle(2, 0xffffff, 0.7);
            _graphic.drawCircle(0, 0, 25);
            this.clearCircle = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff);
            _graphic.drawRect(0, 0, 28, 28);
            _graphic.beginFill(0x333333);
            _graphic.drawCircle(14, 14, 14);
            _graphic.beginFill(0xffffff);
            _graphic.drawCircle(14, 14, 7);
            this.mediumCircle = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff);
            _graphic.drawRect(0, 0, 28, 28);
            _graphic.endFill();
            _graphic.lineStyle(5, 0x333333);
            _graphic.moveTo(2, 2);
            _graphic.lineTo(26, 26);
            _graphic.moveTo(26, 2);
            _graphic.lineTo(2, 26);
            this.wall = _renderer.generateTexture(_graphic);
            _graphic = new PIXI.Graphics;
            _graphic.beginFill(0xffffff);
            _graphic.drawRect(0, 0, 28, 28);
            _graphic.endFill();
            _graphic.lineStyle(5, 0x333333);
            _graphic.moveTo(13, 2);
            _graphic.lineTo(26, 13);
            _graphic.lineTo(13, 26);
            _graphic.lineTo(2, 13);
            _graphic.lineTo(13, 2);
            this.nova = _renderer.generateTexture(_graphic);
            _graphic.clear();
            _graphic.beginFill(0xffffff);
            _graphic.drawRect(0, 0, 30, 30);
            this.square = _renderer.generateTexture(_graphic);
            _graphic.clear();
            _graphic.beginFill(0xffffff);
            _graphic.drawCircle(0, 0, 2);
            this.bullet = _renderer.generateTexture(_graphic);
            _graphic.clear();
            _graphic.beginFill(0xffffff);
            _graphic.moveTo(-5, 0);
            _graphic.lineTo(-10, 20);
            _graphic.lineTo(10, 20);
            _graphic.lineTo(5, 0);
            _graphic.lineTo(-5, 0);
            _graphic.drawCircle(0, 0, 10);
            this.medal = _renderer.generateTexture(_graphic);
        };
        TextureData.cache = {};
        return TextureData;
    }());
    exports.TextureData = TextureData;
});
define("JMGE/JMBUI", ["require", "exports", "JMGE/JMBL"], function (require, exports, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayState;
    (function (DisplayState) {
        DisplayState[DisplayState["NORMAL"] = 0] = "NORMAL";
        DisplayState[DisplayState["DARKENED"] = 1] = "DARKENED";
        DisplayState[DisplayState["BLACKENED"] = 2] = "BLACKENED";
        DisplayState[DisplayState["GREYED"] = 3] = "GREYED";
        DisplayState[DisplayState["BRIGHTENED"] = 4] = "BRIGHTENED";
    })(DisplayState = exports.DisplayState || (exports.DisplayState = {}));
    exports.UICONFIG = {
        CLICK_DELAY: 200,
    };
    var BasicElement = (function (_super) {
        __extends(BasicElement, _super);
        function BasicElement(options) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this.isUI = true;
            _this.graphics = new PIXI.Graphics;
            _this.baseTint = 0xffffff;
            _this.getWidth = function () {
                return _this.graphics.width;
            };
            _this.getHeight = function () {
                return _this.graphics.height;
            };
            options = options || {};
            _this.addChild(_this.graphics);
            if (options.width != null) {
                _this.graphics.beginFill(options.fill || 0xffffff);
                if (options.rounding != null) {
                    _this.graphics.drawRoundedRect(0, 0, options.width, options.height, options.rounding);
                }
                else {
                    _this.graphics.drawRect(0, 0, options.width, options.height);
                }
                _this.graphics.alpha = options.alpha == null ? 1 : options.alpha;
                _this.graphics.tint = _this.baseTint = options.bgColor || 0x808080;
            }
            _this.x = options.x || 0;
            _this.y = options.y || 0;
            if (options.label != null) {
                _this.addLabel(options.label, options.labelStyle);
            }
            return _this;
        }
        BasicElement.prototype.addLabel = function (s, style) {
            if (this.label) {
                this.label.text = s;
                if (style)
                    this.label.style = new PIXI.TextStyle(style);
                this.label.scale.set(1, 1);
            }
            else {
                this.label = new PIXI.Text(s, style || {});
                this.addChild(this.label);
            }
            if (this.label.width > this.graphics.width * 0.9) {
                this.label.width = this.graphics.width * 0.9;
            }
            this.label.scale.y = this.label.scale.x;
            this.label.x = (this.getWidth() - this.label.width) / 2;
            this.label.y = (this.getHeight() - this.label.height) / 2;
        };
        BasicElement.prototype.colorFlash = function (color, ticksUp, wait, ticksDown) {
            var _this = this;
            if (this.flashing)
                return;
            this.flashing = true;
            JMBL.tween.colorTo(this.graphics, ticksUp, { tint: color }, { onComplete: function () { return JMBL.tween.colorTo(_this.graphics, ticksDown, { delay: wait, tint: _this.baseTint }, { onComplete: function () { return (_this.flashing = false); } }); } });
        };
        return BasicElement;
    }(PIXI.Container));
    exports.BasicElement = BasicElement;
    var InteractiveElement = (function (_super) {
        __extends(InteractiveElement, _super);
        function InteractiveElement(options) {
            var _this = _super.call(this, options) || this;
            _this.setDisplayState = function (_state) {
                if (_this.displayState == _state)
                    return;
                _this.displayState = _state;
                switch (_state) {
                    case DisplayState.DARKENED:
                        _this.overlay.tint = 0;
                        _this.overlay.alpha = 0.5;
                        _this.addChild(_this.overlay);
                        break;
                    case DisplayState.BLACKENED:
                        _this.overlay.tint = 0;
                        _this.overlay.alpha = 0.8;
                        _this.addChild(_this.overlay);
                        break;
                    case DisplayState.GREYED:
                        _this.overlay.tint = 0x999999;
                        _this.overlay.alpha = 0.5;
                        _this.addChild(_this.overlay);
                        break;
                    case DisplayState.BRIGHTENED:
                        _this.overlay.tint = 0xffffff;
                        _this.overlay.alpha = 0.3;
                        _this.addChild(_this.overlay);
                        break;
                    case DisplayState.NORMAL:
                    default:
                        _this.overlay.alpha = 0;
                }
            };
            _this.overlay = new PIXI.Graphics();
            _this.overlay.beginFill(0xffffff);
            _this.overlay.drawRect(0, 0, _this.graphics.width, _this.graphics.height);
            options = options || {};
            _this.interactive = true;
            if (options.downFunction != null) {
                _this.downFunction = options.downFunction;
                _this.on("pointerdown", _this.downFunction);
            }
            options.displayState = options.displayState || DisplayState.NORMAL;
            _this.setDisplayState(options.displayState);
            return _this;
        }
        Object.defineProperty(InteractiveElement.prototype, "selected", {
            get: function () {
                return this._Selected;
            },
            set: function (b) {
                if (b) {
                    if (this.selectRect == null) {
                        this.selectRect = new PIXI.Graphics;
                        this.selectRect.lineStyle(3, 0xffff00);
                        this.selectRect.drawRect(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
                    }
                    this.addChild(this.selectRect);
                }
                else {
                    if (this.selectRect != null && this.selectRect.parent != null)
                        this.selectRect.parent.removeChild(this.selectRect);
                }
                this._Selected = b;
            },
            enumerable: true,
            configurable: true
        });
        return InteractiveElement;
    }(BasicElement));
    exports.InteractiveElement = InteractiveElement;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(options) {
            var _this = _super.call(this, JMBL.utils.default(options, {
                x: 50, y: 50, width: 200, height: 50, bgColor: 0x8080ff,
            })) || this;
            _this.downOnThis = false;
            _this.timeout = null;
            _this.output = options.output;
            _this.onOut = options.onOut;
            _this.onOver = options.onOver;
            _this.buttonMode = true;
            if (JMBL.interactionMode === "desktop") {
                _this.addListener("pointerover", function (e) {
                    if (!_this.disabled) {
                        _this.setDisplayState(DisplayState.DARKENED);
                        if (_this.onOver) {
                            _this.onOver();
                        }
                    }
                });
                _this.addListener("pointerout", function (e) {
                    if (!_this.disabled) {
                        _this.setDisplayState(DisplayState.NORMAL);
                        if (_this.onOut) {
                            _this.onOut();
                        }
                    }
                    _this.downOnThis = false;
                });
                _this.addListener("pointerdown", function () {
                    if (!_this.disabled)
                        _this.setDisplayState(DisplayState.BRIGHTENED);
                    _this.downOnThis = true;
                    if (_this.timeout === false) {
                        _this.timeout = true;
                        window.setTimeout(function () { _this.timeout = false; }, exports.UICONFIG.CLICK_DELAY);
                    }
                });
                _this.addListener("pointerup", function () {
                    if (!_this.disabled)
                        _this.setDisplayState(DisplayState.DARKENED);
                    if (_this.downOnThis && !_this.disabled && _this.output != null && _this.timeout !== false)
                        _this.output();
                    _this.downOnThis = false;
                });
            }
            else {
                _this.addListener("touchend", function () {
                    if (!_this.disabled && _this.output != null)
                        _this.output();
                });
            }
            return _this;
        }
        Object.defineProperty(Button.prototype, "disabled", {
            get: function () {
                return this._Disabled;
            },
            set: function (b) {
                this._Disabled = b;
                if (b) {
                    this.setDisplayState(DisplayState.BLACKENED);
                }
                else {
                    this.setDisplayState(DisplayState.NORMAL);
                }
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(InteractiveElement));
    exports.Button = Button;
    var HorizontalStack = (function (_super) {
        __extends(HorizontalStack, _super);
        function HorizontalStack(width) {
            if (width === void 0) { width = -1; }
            var _this = _super.call(this) || this;
            _this.padding = 5;
            return _this;
        }
        HorizontalStack.prototype.addElement = function (v) {
            this.addChild(v);
        };
        HorizontalStack.prototype.alignAll = function () {
            var children = this.children;
            var cX = 0;
            for (var i = 0; i < children.length; i++) {
                children[i].x = cX;
                cX += children[i].width + this.padding;
            }
        };
        return HorizontalStack;
    }(PIXI.Container));
    exports.HorizontalStack = HorizontalStack;
    var ClearButton = (function (_super) {
        __extends(ClearButton, _super);
        function ClearButton(options) {
            var _this = _super.call(this, JMBL.utils.default(options, {
                bgColor: 0x00ff00,
                alpha: 0.01,
                width: 190,
                height: 50,
                x: 0,
                y: 0,
            })) || this;
            _this.buttonMode = true;
            return _this;
        }
        return ClearButton;
    }(InteractiveElement));
    exports.ClearButton = ClearButton;
    var SelectButton = (function (_super) {
        __extends(SelectButton, _super);
        function SelectButton(index, selectList, selectFunction, options) {
            if (options === void 0) { options = null; }
            var _this = _super.call(this, options) || this;
            _this.index = index;
            _this.myList = selectList;
            _this.output = _this.selectThis;
            _this.selectFunction = selectFunction;
            return _this;
        }
        SelectButton.prototype.selectThis = function () {
            if (this.selected)
                return;
            for (var i = 0; i < this.myList.length; i += 1) {
                this.myList[i].selected = this.myList[i] === this;
            }
            this.selectFunction(this.index);
        };
        return SelectButton;
    }(Button));
    exports.SelectButton = SelectButton;
    var MaskedWindow = (function (_super) {
        __extends(MaskedWindow, _super);
        function MaskedWindow(container, options) {
            var _this = _super.call(this, options) || this;
            _this.mask = new PIXI.Graphics;
            _this.objects = [];
            _this.offset = 0;
            _this.goalY = 1;
            _this.scrollbar = null;
            _this.vY = 0;
            _this.sortMargin = 5;
            _this.dragging = false;
            _this.scrollHeight = 0;
            _this.horizontal = false;
            _this.addScrollbar = function (_scrollbar) {
                _this.scrollbar = _scrollbar;
                _scrollbar.output = _this.setScroll;
            };
            _this.onWheel = function (e) {
                if (e.mouse.x > _this.x && e.mouse.x < _this.x + _this.mask.width && e.mouse.y > _this.y && e.mouse.y < _this.y + _this.mask.height) {
                    _this.vY -= e.delta * 0.008;
                }
            };
            _this.setScroll = function (p) {
                if (_this.horizontal) {
                    if (_this.scrollHeight > _this.mask.width) {
                        _this.container.x = p * (_this.mask.width - _this.scrollHeight);
                        if (_this.container.x > 0)
                            _this.container.x = 0;
                        if (_this.container.x < _this.mask.width - _this.scrollHeight)
                            _this.container.x = _this.mask.width - _this.scrollHeight;
                    }
                    else {
                        _this.container.x = 0;
                    }
                }
                else {
                    if (_this.scrollHeight > _this.mask.height) {
                        _this.container.y = p * (_this.mask.height - _this.scrollHeight);
                        if (_this.container.y > 0)
                            _this.container.y = 0;
                        if (_this.container.y < _this.mask.height - _this.scrollHeight)
                            _this.container.y = _this.mask.height - _this.scrollHeight;
                    }
                    else {
                        _this.container.y = 0;
                    }
                }
            };
            _this.getRatio = function () {
                if (_this.horizontal) {
                    return Math.min(1, _this.mask.width / _this.scrollHeight);
                }
                else {
                    return Math.min(1, _this.mask.height / _this.scrollHeight);
                }
            };
            _this.update = function () {
                if (_this.horizontal) {
                    if (_this.goalY <= 0) {
                        _this.vY = (_this.goalY - _this.container.x) / 4;
                    }
                    if (_this.vY != 0) {
                        if (Math.abs(_this.vY) < 0.1)
                            _this.vY = 0;
                        else {
                            var _y = _this.container.x + _this.vY;
                            _y = Math.min(0, Math.max(_y, _this.mask.width - _this.scrollHeight));
                            _this.vY *= 0.95;
                            if (_this.scrollbar != null)
                                _this.scrollbar.setPosition(_y / (_this.mask.width - _this.scrollHeight));
                            else
                                _this.setScroll(_y / (_this.mask.width - _this.scrollHeight));
                        }
                    }
                }
                else {
                    if (_this.goalY <= 0) {
                        _this.vY = (_this.goalY - _this.container.y) / 4;
                    }
                    if (_this.vY != 0) {
                        if (Math.abs(_this.vY) < 0.1)
                            _this.vY = 0;
                        else {
                            var _y = _this.container.y + _this.vY;
                            _y = Math.min(0, Math.max(_y, _this.mask.height - _this.scrollHeight));
                            _this.vY *= 0.95;
                            if (_this.scrollbar != null)
                                _this.scrollbar.setPosition(_y / (_this.mask.height - _this.scrollHeight));
                            else
                                _this.setScroll(_y / (_this.mask.height - _this.scrollHeight));
                        }
                    }
                }
            };
            _this.addObject = function (_object) {
                _this.objects.push(_object);
                _object.x -= _this.x - _this.container.x;
                _object.y -= _this.y - _this.container.y;
                _this.container.addChild(_object);
                if (_this.autoSort)
                    _this.sortObjects();
            };
            _this.removeObject = function (_object) {
                for (var i = 0; i < _this.objects.length; i += 1) {
                    if (_this.objects[i] == _object) {
                        _this.removeObjectAt(i);
                        return;
                    }
                }
            };
            _this.removeObjectAt = function (i) {
                _this.container.removeChild(_this.objects[i]);
                _this.objects.splice(i, 1);
                if (_this.autoSort)
                    _this.sortObjects();
            };
            _this.sortObjects = function () {
                _this.scrollHeight = _this.sortMargin;
                for (var i = 0; i < _this.objects.length; i += 1) {
                    if (_this.horizontal) {
                        _this.objects[i].x = _this.scrollHeight;
                        _this.objects[i].timeout = false;
                        _this.objects[i].y = 0;
                        _this.scrollHeight += _this.objects[i].graphics.width + _this.sortMargin;
                    }
                    else {
                        _this.objects[i].y = _this.scrollHeight;
                        _this.objects[i].timeout = false;
                        _this.objects[i].x = 0;
                        _this.scrollHeight += _this.objects[i].graphics.height + _this.sortMargin;
                    }
                }
            };
            options = options || {};
            if (container) {
                _this.container = container;
            }
            else {
                _this.container = new PIXI.Sprite;
            }
            _this.addChild(_this.container);
            _this.addChild(_this.mask);
            _this.mask.beginFill(0);
            _this.mask.drawRect(0, 0, options.width || 50, options.height || 100);
            _this.autoSort = options.autoSort || false;
            _this.interactive = true;
            _this.sortMargin = options.sortMargin || 5;
            _this.horizontal = options.horizontal;
            _this.on("mousedown", function (e) {
                if (e.target !== _this) {
                    return;
                }
                var point = e.data.getLocalPosition(_this);
                if (_this.horizontal) {
                    _this.offset = point.x - _this.x - _this.container.x;
                }
                else {
                    _this.offset = point.y - _this.y - _this.container.y;
                }
                _this.dragging = true;
            });
            _this.on("mouseup", function () {
                _this.goalY = 1;
                _this.dragging = false;
            });
            _this.on("mouseupoutside", function () {
                _this.goalY = 1;
                _this.dragging = false;
            });
            _this.on("mousemove", function (e) {
                var point = e.data.getLocalPosition(_this);
                if (_this.dragging) {
                    if (_this.horizontal) {
                        _this.goalY = point.x - _this.x - _this.offset;
                        _this.vY = (_this.goalY - _this.container.x) / 4;
                    }
                    else {
                        _this.goalY = point.y - _this.y - _this.offset;
                        _this.vY = (_this.goalY - _this.container.y) / 4;
                    }
                }
            });
            JMBL.events.ticker.add(_this.update);
            return _this;
        }
        MaskedWindow.prototype.updateScrollHeight = function () {
            if (this.horizontal) {
                this.scrollHeight = this.container.getWidth();
            }
            else {
                this.scrollHeight = this.container.getHeight();
            }
        };
        return MaskedWindow;
    }(BasicElement));
    exports.MaskedWindow = MaskedWindow;
    var Gauge = (function (_super) {
        __extends(Gauge, _super);
        function Gauge(color, options) {
            if (color === void 0) { color = 0x00ff00; }
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, JMBL.utils.default(options, {
                width: 100, height: 20, bgColor: 0x101010
            })) || this;
            _this.front = new PIXI.Graphics();
            _this.front.beginFill(color);
            _this.front.drawRect(_this.graphics.x, _this.graphics.y, _this.graphics.width, _this.graphics.height);
            _this.addChild(_this.front);
            return _this;
        }
        Gauge.prototype.setValue = function (value, max) {
            if (max === void 0) { max = -1; }
            if (max >= 1)
                this.max = max;
            this.value = value;
            this.percent = this.value / this.max;
            this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
        };
        Gauge.prototype.setMax = function (max) {
            if (max >= 1)
                this.max = max;
            this.percent = this.value / this.max;
            this.front.width = Math.floor(Math.max(1, Math.min(this.percent * this.graphics.width, this.graphics.width)));
        };
        return Gauge;
    }(BasicElement));
    exports.Gauge = Gauge;
    var Scrollbar = (function (_super) {
        __extends(Scrollbar, _super);
        function Scrollbar(options) {
            var _this = _super.call(this, JMBL.utils.default(options, {
                x: 100, y: 50, width: 10, height: 100, rounding: 5, bgColor: 0x404080, horizontal: false,
            })) || this;
            _this.mover = new PIXI.Graphics();
            _this.topY = 0;
            _this.bottomY = 40;
            _this.offset = 0;
            _this.horizontal = false;
            _this.drawMover = function (p) {
                p = Math.min(1, Math.max(0, p));
                if (p >= 1)
                    _this.visible = false;
                else
                    _this.visible = true;
                _this.mover.clear();
                _this.mover.beginFill(_this.moverColor);
                if (_this.horizontal) {
                    _this.mover.drawRoundedRect(0, 0, p * _this.graphics.width, _this.graphics.height, _this.graphics.height / 2);
                    _this.bottomY = _this.graphics.width - _this.mover.width;
                }
                else {
                    _this.mover.drawRoundedRect(0, 0, _this.graphics.width, p * _this.graphics.height, _this.graphics.width / 2);
                    _this.bottomY = _this.graphics.height - _this.mover.height;
                }
            };
            _this.setPosition = function (p) {
                if (_this.horizontal) {
                    var _x = p * (_this.bottomY - _this.topY) + _this.topY;
                    _this.mover.x = _x;
                }
                else {
                    var _y = p * (_this.bottomY - _this.topY) + _this.topY;
                    _this.mover.y = _y;
                }
                if (_this.output != null)
                    _this.output(p);
            };
            _this.getPosition = function () {
                if (_this.horizontal) {
                    return (_this.mover.x - _this.topY) / (_this.bottomY - _this.topY);
                }
                else {
                    return (_this.mover.y - _this.topY) / (_this.bottomY - _this.topY);
                }
            };
            _this.startMove = function (e) {
                if (_this.horizontal) {
                    _this.offset = e.x - _this.x - _this.mover.x;
                }
                else {
                    _this.offset = e.y - _this.y - _this.mover.y;
                }
                _this.dragging = true;
            };
            _this.addChild(_this.mover);
            _this.output = options.output;
            _this.horizontal = options.horizontal;
            _this.interactive = true;
            _this.buttonMode = true;
            _this.moverColor = options.moverColor || 0x333333;
            _this.ratio = options.ratio || 0.5;
            _this.drawMover(_this.ratio);
            _this.setPosition(options.position || 0);
            _this.on("mousedown", function (e) {
                var point = e.data.getLocalPosition(_this);
                _this.dragging = true;
                if (_this.horizontal) {
                    _this.offset = point.x - _this.x - _this.mover.x;
                }
                else {
                    _this.offset = point.y - _this.y - _this.mover.y;
                }
            });
            _this.on("mouseup", function () {
                _this.dragging = false;
            });
            _this.on("mouseupoutside", function () {
                _this.dragging = false;
            });
            _this.on("mousemove", function (e) {
                if (_this.dragging) {
                    var point = e.data.getLocalPosition(_this);
                    if (_this.horizontal) {
                        var _x = point.x - _this.x - _this.offset;
                        _x = Math.max(_x, _this.topY);
                        _x = Math.min(_x, _this.bottomY);
                        _this.mover.x = _x;
                    }
                    else {
                        var _y = point.y - _this.y - _this.offset;
                        _y = Math.max(_y, _this.topY);
                        _y = Math.min(_y, _this.bottomY);
                        _this.mover.y = _y;
                    }
                    if (_this.output)
                        _this.output(_this.getPosition());
                }
            });
            return _this;
        }
        return Scrollbar;
    }(BasicElement));
    exports.Scrollbar = Scrollbar;
});
define("JMGE/UI/BaseUI", ["require", "exports", "JMGE/JMBUI"], function (require, exports, JMBUI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseUI = (function (_super) {
        __extends(BaseUI, _super);
        function BaseUI(UIConfig) {
            var _this = _super.call(this, UIConfig) || this;
            _this.navBack = function () {
                if (!_this.previousUI) {
                    return;
                }
                if (_this.saveCallback) {
                    _this.saveCallback(function () {
                        _this.parent.addChild(_this.previousUI);
                        _this.dispose();
                    });
                }
                else {
                    _this.parent.addChild(_this.previousUI);
                    _this.dispose();
                }
            };
            _this.navForward = function (nextUI, previousUI) {
                nextUI.previousUI = previousUI || _this;
                if (_this.saveCallback) {
                    nextUI.saveCallback = _this.saveCallback;
                    _this.saveCallback(function () {
                        _this.parent.addChild(nextUI);
                        _this.parent.removeChild(_this);
                    });
                }
                else {
                    _this.parent.addChild(nextUI);
                    _this.parent.removeChild(_this);
                }
            };
            _this.dispose = function () {
                _this.destroy();
            };
            return _this;
        }
        return BaseUI;
    }(JMBUI.BasicElement));
    exports.BaseUI = BaseUI;
});
define("game/data/WordList10k", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.words10k = [[], [], [], ["aaa", "abc", "abs", "abu", "acc", "ace", "acm", "act", "ada", "add", "ads", "age", "ago", "aid", "aim", "air", "aka", "ala", "ali", "all", "alt", "amd", "amp", "amy", "ana", "and", "ann", "ant", "any", "aol", "api", "app", "apr", "apt", "arc", "are", "arg", "arm", "art", "ash", "ask", "asn", "asp", "ata", "ate", "ati", "atm", "aud", "aug", "aus", "ave", "avg", "avi", "aye", "bad", "bag", "ban", "bar", "bat", "bay", "bbc", "bbs", "bed", "bee", "ben", "bet", "bid", "big", "bin", "bio", "bit", "biz", "bmw", "bob", "boc", "bon", "bow", "box", "boy", "bra", "buf", "bug", "bus", "but", "buy", "bye", "cab", "cad", "cal", "cam", "can", "cap", "car", "cas", "cat", "cbs", "ccd", "cds", "cdt", "ceo", "cet", "cfr", "cgi", "chi", "cho", "cia", "cio", "cir", "cms", "cnn", "cod", "col", "com", "con", "cop", "cos", "cow", "cpu", "crm", "cry", "css", "cst", "cup", "cut", "cvs", "dad", "dam", "dan", "das", "dat", "day", "ddr", "dec", "dee", "def", "del", "dem", "den", "der", "des", "dev", "did", "die", "dig", "dim", "dip", "dir", "dis", "div", "diy", "dna", "dns", "doc", "dod", "doe", "dog", "dom", "don", "dos", "dot", "dow", "dpi", "dry", "dsc", "dsl", "dts", "due", "dui", "duo", "dvd", "ear", "eat", "eau", "eco", "eds", "edt", "egg", "enb", "end", "eng", "ent", "eos", "epa", "era", "erp", "est", "etc", "eur", "eva", "eve", "exp", "ext", "eye", "fan", "faq", "far", "fat", "fax", "fbi", "fcc", "fda", "feb", "fed", "fee", "few", "fig", "fin", "fit", "fix", "flu", "fly", "fog", "foo", "for", "fox", "fri", "ftp", "fun", "fur", "fwd", "gap", "gas", "gay", "gba", "gbp", "gcc", "gdp", "gel", "gem", "gen", "geo", "get", "ghz", "gif", "gig", "gis", "gmc", "gmt", "gnu", "got", "gpl", "gps", "gsm", "gst", "gtk", "gui", "gun", "guy", "gym", "had", "ham", "has", "hat", "hay", "her", "hey", "him", "hip", "his", "hit", "hiv", "hon", "hop", "hot", "how", "hrs", "hub", "hwy", "ian", "ibm", "ice", "icq", "ict", "ide", "ids", "iii", "ill", "img", "inc", "ind", "inf", "ing", "ink", "inn", "ins", "int", "ion", "ips", "ira", "irc", "irs", "isa", "iso", "isp", "ist", "its", "jam", "jan", "jar", "jay", "jet", "jim", "job", "joe", "jon", "joy", "jpg", "jul", "jun", "jvc", "kai", "kay", "kde", "ken", "key", "kid", "kim", "kit", "lab", "lan", "lap", "las", "lat", "law", "lay", "lbs", "lcd", "led", "lee", "leg", "len", "leo", "les", "let", "leu", "lib", "lid", "lie", "lil", "lip", "lit", "liz", "llc", "llp", "loc", "log", "lol", "los", "lot", "lou", "low", "ltd", "mac", "mad", "mae", "mag", "mai", "man", "map", "mar", "mas", "mat", "max", "may", "mba", "med", "mel", "mem", "men", "met", "mhz", "mia", "mic", "mid", "mil", "min", "mit", "mix", "mlb", "mls", "mod", "mom", "mon", "mpg", "mph", "mrs", "msg", "msn", "mtv", "mud", "mug", "nam", "nat", "nav", "nba", "nbc", "nec", "neo", "net", "new", "nfl", "nhl", "nhs", "nil", "non", "nor", "not", "nov", "now", "nsw", "nut", "nyc", "oak", "obj", "oct", "odd", "oem", "off", "oil", "old", "one", "ons", "ooo", "opt", "org", "our", "out", "own", "pac", "pad", "pal", "pam", "pan", "par", "pas", "pat", "pay", "pci", "pcs", "pct", "pda", "pdf", "pdt", "pee", "pen", "per", "pet", "pgp", "phd", "phi", "php", "pic", "pie", "pig", "pin", "pit", "pix", "plc", "pmc", "pod", "pop", "por", "pos", "pot", "ppc", "ppm", "pre", "pro", "psi", "psp", "pst", "pts", "pty", "pub", "put", "pvc", "qld", "qty", "que", "qui", "ram", "ran", "rap", "rat", "raw", "ray", "rca", "rec", "red", "ref", "reg", "rep", "res", "rev", "rfc", "rid", "rim", "rio", "rip", "rna", "rob", "rod", "rom", "ron", "row", "roy", "rpg", "rpm", "rrp", "rss", "rug", "run", "sad", "sam", "san", "sao", "sap", "sas", "sat", "saw", "say", "sci", "sea", "sec", "see", "sen", "seo", "sep", "seq", "ser", "set", "she", "sic", "sie", "sig", "sim", "sin", "sip", "sir", "sit", "six", "ski", "sku", "sky", "sms", "soa", "soc", "sol", "son", "sox", "spa", "spy", "sql", "src", "sri", "ssl", "std", "ste", "str", "sub", "sue", "sum", "sun", "sur", "sys", "tab", "tag", "tan", "tap", "tar", "tax", "tba", "tcp", "tea", "ted", "tee", "tel", "ten", "tex", "tft", "tgp", "the", "thu", "thy", "tie", "til", "tim", "tin", "tip", "tmp", "toe", "tom", "ton", "too", "top", "toy", "tri", "try", "tub", "tue", "tvs", "two", "una", "und", "une", "uni", "upc", "ups", "uri", "url", "urw", "usa", "usb", "usc", "usd", "use", "usr", "utc", "val", "van", "var", "vat", "vcr", "ver", "vhs", "via", "vic", "vid", "vii", "vip", "vol", "von", "vpn", "wal", "wan", "war", "was", "wav", "wax", "way", "web", "wed", "wet", "who", "why", "win", "wit", "wma", "won", "wow", "wto", "www", "xml", "yea", "yen", "yes", "yet", "you", "yrs", "zen", "zip", "zoo", "zum", "zus"], ["able", "acer", "acid", "acne", "acre", "acts", "adam", "adds", "adsl", "aged", "ages", "aids", "aims", "alan", "alex", "alot", "also", "alto", "andy", "anna", "anne", "anti", "apps", "aqua", "arab", "arch", "area", "arms", "army", "arts", "asia", "asin", "asks", "asus", "atom", "audi", "auto", "avon", "away", "axis", "babe", "baby", "back", "bags", "bald", "bali", "ball", "band", "bang", "bank", "bare", "barn", "bars", "base", "bass", "bath", "beam", "bean", "bear", "beat", "beds", "beef", "been", "beer", "bell", "belt", "bend", "bent", "benz", "best", "beta", "beth", "bias", "bids", "bike", "bill", "bind", "biol", "bios", "bird", "bite", "bits", "blah", "blog", "blow", "blue", "blvd", "boat", "body", "bold", "bolt", "bomb", "bond", "bone", "book", "bool", "boom", "boot", "born", "boss", "both", "bowl", "boys", "brad", "bras", "buck", "bugs", "bulk", "bull", "burn", "bush", "busy", "buys", "buzz", "byte", "cafe", "cage", "cake", "call", "calm", "came", "camp", "cams", "cant", "cape", "caps", "carb", "card", "care", "carl", "cars", "cart", "casa", "case", "cash", "cast", "cats", "cave", "cdna", "cell", "cent", "chad", "chan", "char", "chat", "chef", "chem", "chen", "chip", "ciao", "cite", "city", "clan", "clay", "clip", "club", "cnet", "coal", "coat", "code", "coin", "cold", "cole", "come", "comm", "comp", "conf", "cons", "cook", "cool", "cope", "copy", "cord", "core", "cork", "corn", "corp", "cost", "cove", "crew", "crop", "cruz", "ctrl", "cuba", "cube", "cult", "cups", "cure", "cute", "cuts", "dale", "dame", "dana", "dans", "dare", "dark", "dash", "data", "date", "dave", "dawn", "days", "dead", "deaf", "deal", "dean", "dear", "debt", "deck", "deep", "deer", "dell", "demo", "deny", "dept", "desk", "dial", "dice", "died", "dies", "diet", "diff", "dirt", "disc", "dish", "disk", "dist", "dive", "divx", "dock", "docs", "does", "dogs", "doll", "dome", "done", "dont", "doom", "door", "dose", "doug", "down", "drag", "draw", "drew", "drop", "drug", "drum", "dual", "duck", "dude", "duke", "dumb", "dump", "dust", "duty", "dvds", "each", "earl", "earn", "ears", "ease", "east", "easy", "ebay", "echo", "eden", "edge", "edit", "eggs", "else", "emma", "ends", "epic", "eric", "erik", "espn", "euro", "eval", "even", "ever", "evil", "exam", "exec", "exit", "expo", "eyed", "eyes", "face", "fact", "fail", "fair", "fake", "fall", "fame", "fans", "faqs", "fare", "farm", "fast", "fate", "fear", "feat", "feed", "feel", "fees", "feet", "fell", "felt", "feof", "fiji", "file", "fill", "film", "find", "fine", "fire", "firm", "fish", "fist", "fits", "five", "flag", "flat", "flex", "flip", "flow", "flux", "foam", "fold", "folk", "font", "food", "fool", "foot", "ford", "fork", "form", "fort", "foto", "foul", "four", "fred", "free", "frog", "from", "fuel", "fuji", "full", "fund", "funk", "gage", "gain", "gale", "game", "gang", "gaps", "gary", "gate", "gave", "gays", "gear", "geek", "gene", "gets", "gift", "girl", "give", "glad", "glen", "glow", "gmbh", "goal", "goat", "gods", "goes", "gold", "golf", "gone", "good", "gore", "goto", "grab", "grad", "gras", "gray", "greg", "grew", "grey", "grid", "grip", "grow", "guam", "gulf", "guns", "guru", "guys", "gzip", "hack", "hair", "half", "hall", "halo", "hand", "hang", "hans", "hard", "harm", "hart", "hash", "hate", "hats", "have", "hawk", "hdtv", "head", "hear", "heat", "heel", "held", "help", "herb", "here", "hero", "hide", "high", "hill", "hint", "hire", "hist", "hits", "hold", "hole", "holy", "home", "hong", "hood", "hook", "hope", "horn", "hose", "host", "hour", "href", "html", "http", "huge", "hugh", "hugo", "hull", "hung", "hunt", "hurt", "icon", "idea", "idle", "idol", "ieee", "inch", "incl", "info", "inns", "intl", "into", "iowa", "ipaq", "ipod", "iran", "iraq", "iron", "isbn", "isle", "issn", "item", "jack", "jade", "jail", "jake", "jane", "java", "jazz", "jean", "jeep", "jeff", "jets", "jews", "jill", "joan", "jobs", "joel", "john", "join", "joke", "jose", "josh", "jpeg", "juan", "judy", "july", "jump", "june", "junk", "jury", "just", "karl", "kate", "keen", "keep", "keno", "kent", "kept", "keys", "kick", "kids", "kill", "kind", "king", "kirk", "kiss", "kits", "knee", "knew", "knit", "know", "kong", "kurt", "kyle", "labs", "lace", "lack", "lady", "laid", "lake", "lamb", "lamp", "land", "lane", "lang", "laos", "last", "late", "lawn", "laws", "lazy", "lead", "leaf", "lean", "left", "legs", "lens", "leon", "less", "lets", "levy", "libs", "lies", "life", "lift", "like", "lime", "line", "link", "lion", "lips", "lisa", "list", "lite", "live", "load", "loan", "lock", "logo", "logs", "lone", "long", "look", "loop", "lord", "lose", "loss", "lost", "lots", "loud", "love", "lows", "luck", "lucy", "luis", "luke", "lung", "lynn", "made", "mail", "main", "make", "male", "mali", "mall", "many", "maps", "marc", "mark", "mars", "mart", "mary", "mask", "mass", "mate", "math", "mats", "matt", "maui", "meal", "mean", "meat", "meet", "mega", "memo", "mens", "ment", "menu", "mere", "mesa", "mesh", "mess", "meta", "mice", "midi", "mike", "mild", "mile", "milk", "mill", "mime", "mind", "mine", "mini", "mins", "mint", "misc", "miss", "mode", "mods", "mold", "moms", "mono", "mood", "moon", "more", "moss", "most", "move", "mpeg", "mrna", "msie", "much", "must", "muze", "myth", "nail", "name", "nano", "nasa", "nato", "navy", "ncaa", "near", "neck", "need", "neil", "neon", "nest", "news", "next", "nice", "nick", "nike", "nine", "node", "none", "noon", "norm", "nose", "note", "nova", "ntsc", "nuke", "null", "nuts", "oaks", "oclc", "odds", "oecd", "ohio", "oils", "okay", "oman", "once", "ones", "only", "onto", "oops", "open", "oral", "ours", "oval", "oven", "over", "owen", "owns", "pace", "pack", "pads", "page", "paid", "pain", "pair", "pale", "palm", "para", "park", "part", "paso", "pass", "past", "path", "paul", "pays", "pdas", "peak", "peas", "peer", "penn", "pens", "perl", "peru", "pest", "pete", "pets", "phil", "phys", "pick", "pics", "pike", "pill", "pine", "ping", "pink", "pins", "pipe", "plan", "play", "plot", "plug", "plus", "pmid", "poem", "poet", "pole", "poll", "polo", "poly", "pond", "pool", "poor", "pope", "pork", "port", "pose", "post", "pour", "pray", "prep", "prev", "prix", "proc", "pros", "prot", "pubs", "pull", "pump", "punk", "pure", "push", "puts", "quad", "quit", "quiz", "race", "rack", "rage", "raid", "rail", "rain", "rand", "rank", "rare", "rate", "rats", "rays", "read", "real", "rear", "reed", "reef", "reel", "reid", "rely", "reno", "rent", "rest", "rica", "rice", "rich", "rick", "rico", "ride", "ring", "ripe", "rise", "risk", "road", "rock", "role", "roll", "rome", "roof", "room", "root", "rope", "rosa", "rose", "ross", "rows", "ruby", "rugs", "rule", "runs", "rush", "ruth", "ryan", "safe", "sage", "said", "sail", "sake", "sale", "salt", "same", "sand", "sans", "sara", "save", "says", "scan", "scsi", "seal", "sean", "seas", "seat", "seed", "seek", "seem", "seen", "sees", "sega", "self", "sell", "semi", "send", "sent", "sept", "sets", "shaw", "shed", "ship", "shoe", "shop", "shot", "show", "shut", "sick", "side", "sign", "silk", "sims", "sing", "sink", "site", "size", "skin", "skip", "slim", "slip", "slot", "slow", "smtp", "snap", "snow", "soap", "sofa", "soft", "soil", "sold", "sole", "solo", "soma", "some", "song", "sons", "sony", "soon", "sort", "soul", "soup", "spam", "span", "spas", "spec", "spin", "spot", "stan", "star", "stat", "stay", "stem", "step", "stop", "stud", "such", "suit", "sure", "surf", "suse", "swap", "swim", "sync", "tabs", "tags", "tail", "take", "tale", "talk", "tall", "tank", "tape", "task", "taxi", "team", "tear", "tech", "teen", "tell", "temp", "tend", "tent", "term", "test", "text", "thai", "than", "that", "thee", "them", "then", "they", "thin", "this", "thou", "thru", "thus", "tide", "tied", "tier", "ties", "tile", "till", "time", "tiny", "tion", "tips", "tire", "todd", "told", "toll", "tone", "tons", "tony", "took", "tool", "tops", "tour", "town", "toys", "trap", "tray", "tree", "trek", "treo", "trim", "trio", "trip", "troy", "true", "tube", "tune", "turn", "twin", "type", "ugly", "undo", "unit", "univ", "unix", "unto", "upon", "urge", "urls", "usda", "used", "user", "uses", "usgs", "usps", "utah", "vary", "vast", "very", "vice", "vids", "view", "viii", "visa", "void", "voip", "volt", "vote", "wage", "wait", "wake", "walk", "wall", "walt", "want", "ward", "ware", "warm", "wars", "wash", "watt", "wave", "ways", "weak", "wear", "weed", "week", "well", "went", "were", "west", "what", "when", "whom", "wide", "wife", "wifi", "wiki", "wild", "will", "wind", "wine", "wing", "wins", "wire", "wise", "wish", "with", "wolf", "wood", "wool", "word", "work", "worm", "worn", "wrap", "xbox", "yale", "yang", "yard", "yarn", "yeah", "year", "yoga", "york", "your", "zero", "zinc", "zone", "zoom", "zope"], ["aaron", "about", "above", "abuse", "acids", "acres", "actor", "acute", "adams", "added", "admin", "admit", "adobe", "adopt", "adult", "after", "again", "agent", "aging", "agree", "ahead", "aimed", "alarm", "album", "alert", "alias", "alice", "alien", "align", "alike", "alive", "allah", "allan", "allen", "allow", "alloy", "alone", "along", "alpha", "alter", "amber", "amend", "amino", "among", "angel", "anger", "angle", "angry", "anime", "annex", "annie", "apart", "apnic", "apple", "apply", "april", "arbor", "areas", "arena", "argue", "arise", "armed", "armor", "array", "arrow", "aruba", "ascii", "asian", "aside", "asked", "asset", "atlas", "audio", "audit", "autos", "avoid", "award", "aware", "awful", "babes", "bacon", "badge", "badly", "baker", "bands", "banks", "barry", "based", "bases", "basic", "basin", "basis", "batch", "baths", "beach", "beads", "beans", "bears", "beast", "beats", "began", "begin", "begun", "being", "belle", "belly", "below", "belts", "bench", "berry", "betty", "bible", "bikes", "bills", "billy", "bingo", "birds", "birth", "black", "blade", "blair", "blake", "blame", "blank", "blast", "blend", "bless", "blind", "blink", "block", "blogs", "blond", "blood", "bloom", "blues", "board", "boats", "bobby", "bonds", "bones", "bonus", "books", "boost", "booth", "boots", "booty", "bored", "bound", "boxed", "boxes", "brain", "brake", "brand", "brass", "brave", "bread", "break", "breed", "brian", "brick", "bride", "brief", "bring", "broad", "broke", "brook", "brown", "bruce", "brush", "bryan", "bucks", "buddy", "build", "built", "bunch", "bunny", "burke", "burns", "burst", "buses", "butts", "buyer", "bytes", "cabin", "cable", "cache", "cakes", "calls", "camel", "camps", "canal", "candy", "canon", "cards", "carey", "cargo", "carlo", "carol", "carry", "cases", "casey", "casio", "catch", "cause", "cedar", "cells", "cents", "chain", "chair", "chaos", "charm", "chart", "chase", "cheap", "cheat", "check", "chess", "chest", "chevy", "chick", "chief", "child", "chile", "china", "chips", "choir", "chose", "chris", "chuck", "cindy", "cisco", "cited", "civic", "civil", "claim", "clara", "clark", "class", "clean", "clear", "clerk", "click", "cliff", "climb", "clips", "clock", "clone", "close", "cloth", "cloud", "clubs", "coach", "coast", "codes", "cohen", "coins", "colin", "colon", "color", "combo", "comes", "comic", "condo", "congo", "const", "coral", "corps", "costa", "costs", "could", "count", "court", "cover", "crack", "craft", "craig", "craps", "crash", "crazy", "cream", "creek", "crest", "crime", "crops", "cross", "crowd", "crown", "crude", "cubic", "curve", "cyber", "cycle", "czech", "daddy", "daily", "dairy", "daisy", "dance", "danny", "dated", "dates", "david", "davis", "deals", "dealt", "death", "debug", "debut", "decor", "delay", "delhi", "delta", "dense", "depot", "depth", "derby", "derek", "devel", "devil", "devon", "diana", "diane", "diary", "dicke", "dicks", "diego", "diffs", "digit", "dirty", "disco", "discs", "disks", "dodge", "doing", "dolls", "donna", "donor", "doors", "doubt", "dover", "dozen", "draft", "drain", "drama", "drawn", "draws", "dream", "dress", "dried", "drill", "drink", "drive", "drops", "drove", "drugs", "drums", "drunk", "dryer", "dubai", "dutch", "dying", "dylan", "eagle", "early", "earth", "ebony", "ebook", "eddie", "edgar", "edges", "egypt", "eight", "elder", "elect", "elite", "ellen", "ellis", "elvis", "emacs", "email", "emily", "empty", "ended", "endif", "enemy", "enjoy", "enter", "entry", "epson", "equal", "error", "essay", "essex", "euros", "evans", "event", "every", "exact", "exams", "excel", "exist", "extra", "faced", "faces", "facts", "fails", "fairy", "faith", "falls", "false", "fancy", "fares", "farms", "fatal", "fatty", "fault", "favor", "fears", "feeds", "feels", "fence", "ferry", "fever", "fewer", "fiber", "fibre", "field", "fifth", "fifty", "fight", "filed", "files", "filme", "films", "final", "finds", "fired", "fires", "firms", "first", "fixed", "fixes", "flags", "flame", "flash", "fleet", "flesh", "float", "flood", "floor", "flour", "flows", "floyd", "fluid", "flush", "flyer", "focal", "focus", "folks", "fonts", "foods", "force", "forge", "forms", "forth", "forty", "forum", "fotos", "found", "frame", "frank", "fraud", "fresh", "front", "frost", "fruit", "fully", "funds", "funky", "funny", "fuzzy", "gains", "games", "gamma", "gates", "gauge", "genes", "genre", "ghana", "ghost", "giant", "gifts", "girls", "given", "gives", "glass", "glenn", "globe", "glory", "gnome", "goals", "going", "gonna", "goods", "gotta", "grace", "grade", "grain", "grams", "grand", "grant", "graph", "grass", "grave", "great", "greek", "green", "grill", "gross", "group", "grove", "grown", "grows", "guard", "guess", "guest", "guide", "guild", "hairy", "haiti", "hands", "handy", "happy", "harry", "haven", "hayes", "heads", "heard", "heart", "heath", "heavy", "helen", "hello", "helps", "hence", "henry", "herbs", "highs", "hills", "hindu", "hints", "hired", "hobby", "holds", "holes", "holly", "homes", "honda", "honey", "honor", "hoped", "hopes", "horse", "hosts", "hotel", "hours", "house", "howto", "human", "humor", "icons", "idaho", "ideal", "ideas", "image", "inbox", "index", "india", "indie", "inner", "input", "intel", "inter", "intro", "iraqi", "irish", "isaac", "islam", "issue", "italy", "items", "ivory", "jacob", "james", "jamie", "janet", "japan", "jason", "jeans", "jenny", "jerry", "jesse", "jesus", "jewel", "jimmy", "johns", "joins", "joint", "jokes", "jones", "joyce", "judge", "juice", "julia", "julie", "karen", "karma", "kathy", "katie", "keeps", "keith", "kelly", "kenny", "kenya", "kerry", "kevin", "kills", "kinda", "kinds", "kings", "kitty", "klein", "knife", "knock", "known", "knows", "kodak", "korea", "label", "labor", "laden", "lakes", "lamps", "lance", "lands", "lanes", "lanka", "large", "larry", "laser", "later", "latex", "latin", "laugh", "laura", "layer", "leads", "learn", "lease", "least", "leave", "leeds", "legal", "lemon", "leone", "level", "lewis", "lexus", "light", "liked", "likes", "limit", "linda", "lined", "lines", "links", "linux", "lions", "lists", "lived", "liver", "lives", "lloyd", "loads", "loans", "lobby", "local", "locks", "lodge", "logan", "logic", "login", "logos", "looks", "loops", "loose", "lopez", "lotus", "louis", "loved", "lover", "loves", "lower", "lucas", "lucia", "lucky", "lunch", "lycos", "lying", "lyric", "macro", "magic", "mails", "maine", "major", "maker", "makes", "males", "malta", "mambo", "manga", "manor", "maple", "march", "marco", "mardi", "maria", "marie", "mario", "marks", "marsh", "mason", "match", "maybe", "mayor", "mazda", "meals", "means", "meant", "medal", "media", "meets", "menus", "mercy", "merge", "merit", "merry", "metal", "meter", "metro", "meyer", "miami", "micro", "might", "milan", "miles", "mills", "minds", "mines", "minor", "minus", "mixed", "mixer", "model", "modem", "modes", "money", "monte", "month", "moore", "moral", "moses", "motel", "motor", "mount", "mouse", "mouth", "moved", "moves", "movie", "mpegs", "msgid", "multi", "music", "myers", "mysql", "nails", "naked", "named", "names", "nancy", "nasty", "naval", "needs", "nepal", "nerve", "never", "newer", "newly", "niger", "night", "nikon", "noble", "nodes", "noise", "nokia", "north", "noted", "notes", "notre", "novel", "nurse", "nylon", "oasis", "occur", "ocean", "offer", "often", "older", "olive", "omaha", "omega", "onion", "opens", "opera", "orbit", "order", "organ", "oscar", "other", "ought", "outer", "owned", "owner", "oxide", "ozone", "packs", "pages", "paint", "pairs", "panel", "panic", "pants", "paper", "papua", "paris", "parks", "parts", "party", "pasta", "paste", "patch", "paths", "patio", "paxil", "peace", "pearl", "peers", "penny", "perry", "perth", "peter", "phase", "phone", "photo", "phpbb", "piano", "picks", "piece", "pills", "pilot", "pipes", "pitch", "pixel", "pizza", "place", "plain", "plane", "plans", "plant", "plate", "plays", "plaza", "plots", "poems", "point", "poker", "polar", "polls", "pools", "ports", "posts", "pound", "power", "press", "price", "pride", "prime", "print", "prior", "prize", "probe", "promo", "proof", "proud", "prove", "proxy", "pulse", "pumps", "punch", "puppy", "purse", "qatar", "queen", "query", "quest", "queue", "quick", "quiet", "quilt", "quite", "quote", "races", "racks", "radar", "radio", "raise", "rally", "ralph", "ranch", "randy", "range", "ranks", "rapid", "rated", "rates", "ratio", "reach", "reads", "ready", "realm", "rebel", "refer", "rehab", "relax", "relay", "remix", "renew", "reply", "reset", "retro", "rhode", "ricky", "rider", "rides", "ridge", "right", "rings", "risks", "river", "roads", "robin", "robot", "rocks", "rocky", "roger", "roles", "rolls", "roman", "rooms", "roots", "roses", "rouge", "rough", "round", "route", "rover", "royal", "rugby", "ruled", "rules", "rural", "safer", "sagem", "saint", "salad", "salem", "sales", "sally", "salon", "samba", "samoa", "sandy", "santa", "sanyo", "sarah", "satin", "sauce", "saudi", "saved", "saver", "saves", "sbjct", "scale", "scary", "scene", "scoop", "scope", "score", "scott", "scout", "screw", "scuba", "seats", "seeds", "seeks", "seems", "sells", "sends", "sense", "serum", "serve", "setup", "seven", "shade", "shaft", "shake", "shall", "shame", "shape", "share", "shark", "sharp", "sheep", "sheer", "sheet", "shelf", "shell", "shift", "shine", "ships", "shirt", "shock", "shoes", "shoot", "shops", "shore", "short", "shots", "shown", "shows", "sides", "sight", "sigma", "signs", "silly", "simon", "since", "singh", "sites", "sixth", "sized", "sizes", "skill", "skins", "skirt", "skype", "slave", "sleep", "slide", "slope", "slots", "small", "smart", "smell", "smile", "smith", "smoke", "snake", "socks", "solar", "solid", "solve", "songs", "sonic", "sorry", "sorts", "souls", "sound", "south", "space", "spain", "spank", "sparc", "spare", "speak", "specs", "speed", "spell", "spend", "spent", "sperm", "spice", "spies", "spine", "split", "spoke", "sport", "spots", "spray", "squad", "stack", "staff", "stage", "stake", "stamp", "stand", "stars", "start", "state", "stats", "stays", "steal", "steam", "steel", "steps", "steve", "stick", "still", "stock", "stone", "stood", "stops", "store", "storm", "story", "strap", "strip", "stuck", "study", "stuff", "style", "sudan", "sugar", "suite", "suits", "sunny", "super", "surge", "susan", "sweet", "swift", "swing", "swiss", "sword", "syria", "table", "tahoe", "taken", "takes", "tales", "talks", "tamil", "tampa", "tanks", "tapes", "tasks", "taste", "taxes", "teach", "teams", "tears", "teddy", "teens", "teeth", "tells", "terms", "terry", "tests", "texas", "texts", "thank", "thats", "theft", "their", "theme", "there", "these", "theta", "thick", "thing", "think", "third", "thong", "those", "three", "throw", "thumb", "tiger", "tight", "tiles", "timer", "times", "tions", "tired", "tires", "title", "today", "token", "tokyo", "tommy", "toner", "tones", "tools", "tooth", "topic", "total", "touch", "tough", "tours", "tower", "towns", "toxic", "trace", "track", "tract", "tracy", "trade", "trail", "train", "trans", "trash", "treat", "trees", "trend", "trial", "tribe", "trick", "tried", "tries", "trips", "trout", "truck", "truly", "trunk", "trust", "truth", "tubes", "tulsa", "tumor", "tuner", "tunes", "turbo", "turns", "twice", "twiki", "twins", "twist", "tyler", "types", "ultra", "uncle", "under", "union", "units", "unity", "until", "upper", "upset", "urban", "usage", "users", "using", "usual", "utils", "valid", "value", "valve", "vault", "vegas", "venue", "verde", "verse", "video", "views", "villa", "vinyl", "viral", "virus", "visit", "vista", "vital", "vocal", "voice", "volvo", "voted", "votes", "vsnet", "wages", "wagon", "wales", "walks", "walls", "wanna", "wants", "waste", "watch", "water", "watts", "waves", "wayne", "weeks", "weird", "wells", "welsh", "wendy", "whale", "whats", "wheat", "wheel", "where", "which", "while", "white", "whole", "whose", "wider", "width", "wiley", "winds", "wines", "wings", "wired", "wires", "witch", "wives", "woman", "women", "woods", "words", "works", "world", "worry", "worse", "worst", "worth", "would", "wound", "wrist", "write", "wrong", "wrote", "xanax", "xerox", "xhtml", "yacht", "yahoo", "yards", "years", "yeast", "yemen", "yield", "young", "yours", "youth", "yukon", "zdnet", "zones"], ["abroad", "absent", "accent", "accept", "access", "across", "acting", "action", "active", "actors", "actual", "adding", "adidas", "adipex", "adjust", "adrian", "adults", "advert", "advice", "advise", "adware", "aerial", "affair", "affect", "afford", "afraid", "africa", "agency", "agenda", "agents", "agreed", "agrees", "alaska", "albany", "albert", "albums", "alerts", "alfred", "allied", "allows", "almost", "alpine", "alumni", "always", "amanda", "amazon", "ambien", "amount", "analog", "anchor", "andale", "andrea", "andrew", "angela", "angels", "angola", "animal", "annual", "answer", "anyone", "anyway", "apache", "apollo", "appeal", "appear", "approx", "arabia", "arabic", "arcade", "arctic", "argued", "arnold", "around", "arrest", "arrive", "arthur", "artist", "ashley", "asking", "aspect", "assess", "assets", "assign", "assist", "assume", "assure", "asthma", "asylum", "athens", "atomic", "attach", "attack", "attend", "auburn", "august", "aurora", "austin", "author", "autumn", "avatar", "avenue", "awards", "babies", "backed", "backup", "bailey", "baking", "ballet", "ballot", "banana", "banned", "banner", "barbie", "barely", "barnes", "barrel", "basics", "basket", "batman", "battle", "beauty", "beaver", "became", "become", "before", "begins", "behalf", "behind", "beings", "belief", "belize", "belkin", "belong", "berlin", "beside", "better", "beyond", "bhutan", "bidder", "bigger", "bikini", "binary", "bishop", "blacks", "blades", "blocks", "blonde", "boards", "bodies", "border", "boring", "bosnia", "boston", "bother", "bottle", "bottom", "bought", "boxing", "brakes", "branch", "brands", "brazil", "breach", "breaks", "breast", "breath", "breeds", "bridal", "bridge", "briefs", "bright", "brings", "broken", "broker", "bronze", "brooks", "browse", "brunei", "brutal", "bryant", "bubble", "budget", "buffer", "bufing", "builds", "bullet", "bumper", "bundle", "burden", "bureau", "buried", "burner", "burton", "butler", "butter", "button", "buyers", "buying", "cables", "cached", "called", "calvin", "camera", "campus", "canada", "cancel", "cancer", "candle", "cannon", "canvas", "canyon", "carbon", "career", "caring", "carlos", "carmen", "carpet", "carter", "casino", "castle", "casual", "cattle", "caught", "caused", "causes", "cayman", "celebs", "celtic", "cement", "census", "center", "centre", "chains", "chairs", "chance", "change", "chapel", "charge", "charms", "charts", "cheats", "checks", "cheers", "cheese", "cheque", "cherry", "chicks", "choice", "choose", "chorus", "chosen", "christ", "chrome", "chubby", "church", "cialis", "cinema", "circle", "circus", "cities", "claims", "claire", "clarke", "clause", "clicks", "client", "clinic", "clocks", "closed", "closer", "closes", "clouds", "cloudy", "coated", "coding", "coffee", "collar", "colony", "colors", "colour", "column", "combat", "comedy", "comics", "coming", "commit", "common", "compaq", "comply", "condos", "config", "cooked", "cookie", "cooler", "cooper", "copied", "copies", "copper", "corner", "corpus", "cotton", "counts", "county", "couple", "coupon", "course", "courts", "covers", "cowboy", "cradle", "crafts", "create", "credit", "crimes", "crisis", "cruise", "cursor", "curtis", "curves", "custom", "cycles", "cyprus", "dakota", "dallas", "damage", "danger", "daniel", "danish", "darwin", "dating", "dayton", "deadly", "dealer", "deaths", "debate", "debian", "decade", "decent", "decide", "deemed", "deeper", "deeply", "defeat", "defend", "define", "degree", "delays", "delete", "deluxe", "demand", "denial", "denied", "dennis", "dental", "denver", "depend", "deputy", "desert", "design", "desire", "detail", "detect", "device", "dialog", "diesel", "differ", "digest", "dining", "dinner", "direct", "dishes", "disney", "divide", "divine", "diving", "doctor", "dollar", "domain", "donald", "donate", "donors", "dosage", "double", "dozens", "dragon", "dreams", "drinks", "driven", "driver", "drives", "dublin", "duncan", "durham", "during", "duties", "eagles", "earned", "easier", "easily", "easter", "eating", "ebooks", "edited", "editor", "edward", "effect", "effort", "either", "eleven", "emails", "eminem", "empire", "employ", "enable", "ending", "energy", "engage", "engine", "enough", "ensure", "enters", "entire", "entity", "enzyme", "equity", "errors", "escape", "essays", "estate", "ethics", "ethnic", "eugene", "europe", "events", "exceed", "except", "excess", "excuse", "exempt", "exists", "exotic", "expand", "expect", "expert", "export", "extend", "extent", "extras", "fabric", "facial", "facing", "factor", "failed", "fairly", "fallen", "family", "famous", "farmer", "faster", "father", "favors", "favour", "fellow", "female", "fetish", "fields", "figure", "filing", "filled", "filter", "finals", "finder", "finest", "finger", "finish", "finite", "fiscal", "fisher", "fitted", "flavor", "fleece", "flickr", "flight", "floors", "floppy", "floral", "flower", "flying", "folder", "follow", "forbes", "forced", "forces", "forest", "forget", "forgot", "formal", "format", "formed", "former", "forums", "fossil", "foster", "fought", "fourth", "framed", "frames", "france", "fraser", "freely", "freeze", "french", "friday", "fridge", "friend", "frozen", "fruits", "funded", "fusion", "future", "gained", "galaxy", "gaming", "garage", "garcia", "garden", "garlic", "garmin", "gather", "gender", "geneva", "genius", "genome", "genres", "gentle", "gently", "george", "gerald", "german", "giants", "gibson", "giving", "glance", "global", "gloves", "golden", "google", "gordon", "gospel", "gossip", "gothic", "gotten", "grades", "graham", "grande", "granny", "grants", "graphs", "gratis", "greece", "greene", "groove", "ground", "groups", "growth", "guards", "guests", "guided", "guides", "guilty", "guinea", "guitar", "guyana", "habits", "hacker", "hammer", "handed", "handle", "hansen", "happen", "harbor", "harder", "hardly", "harley", "harold", "harper", "harris", "harvey", "having", "hawaii", "hazard", "headed", "header", "health", "hearts", "heated", "heater", "heaven", "hebrew", "height", "helena", "helmet", "helped", "herald", "herbal", "hereby", "herein", "heroes", "hidden", "higher", "highly", "hiking", "hilton", "hiring", "hockey", "holdem", "holder", "hollow", "holmes", "honest", "honors", "hoping", "horror", "horses", "hosted", "hostel", "hotels", "hourly", "houses", "howard", "hudson", "hughes", "humans", "hunger", "hungry", "hunter", "hybrid", "ignore", "images", "immune", "impact", "import", "impose", "inches", "income", "indeed", "indian", "indoor", "infant", "inform", "injury", "inkjet", "inline", "inputs", "insert", "inside", "intake", "intend", "intent", "invest", "invite", "island", "israel", "issued", "issues", "italia", "italic", "itself", "itunes", "jacket", "jackie", "jaguar", "jeremy", "jersey", "jewish", "johnny", "joined", "jordan", "joseph", "joshua", "judges", "julian", "jungle", "junior", "justin", "kansas", "kelkoo", "kernel", "kidney", "kijiji", "killed", "killer", "kinase", "knight", "knives", "korean", "kruger", "kuwait", "labels", "labour", "ladder", "ladies", "lambda", "laptop", "larger", "lately", "latest", "latina", "latino", "latter", "latvia", "launch", "lauren", "lawyer", "layers", "layout", "leader", "league", "leaves", "legacy", "legend", "lender", "length", "lenses", "leslie", "lesser", "lesson", "letter", "levels", "liable", "lights", "likely", "limits", "linear", "linked", "liquid", "listed", "listen", "little", "living", "loaded", "locale", "locate", "locked", "logged", "london", "lonely", "longer", "looked", "lookup", "losing", "losses", "louise", "lounge", "lovely", "lovers", "loving", "lowest", "luther", "luxury", "lyrics", "madrid", "magnet", "maiden", "mailed", "mailto", "mainly", "makers", "makeup", "making", "malawi", "manage", "manner", "manual", "marble", "marcus", "margin", "mariah", "marina", "marine", "marion", "marked", "marker", "market", "martha", "martin", "marvel", "master", "mating", "matrix", "matter", "mature", "median", "medium", "meetup", "member", "memory", "mental", "mentor", "merely", "merger", "metals", "meters", "method", "metres", "metric", "mexico", "michel", "middle", "mighty", "miller", "milton", "mining", "minute", "mirror", "missed", "mixing", "mobile", "models", "modems", "modern", "modify", "module", "moment", "monaco", "monday", "monica", "monkey", "monroe", "months", "morgan", "morris", "moscow", "mostly", "motels", "mother", "motion", "motors", "mounts", "movers", "movies", "moving", "msgstr", "mumbai", "munich", "murder", "murphy", "murray", "muscle", "museum", "muslim", "mutual", "myrtle", "myself", "namely", "naples", "narrow", "nascar", "nasdaq", "nathan", "nation", "native", "nature", "nearby", "nearly", "needed", "needle", "nelson", "nested", "neural", "nevada", "newark", "newbie", "newest", "newman", "newton", "nextel", "nickel", "nicole", "nights", "nissan", "nobody", "normal", "norman", "norton", "norway", "notice", "notify", "notion", "novels", "nudist", "number", "nurses", "nutten", "nvidia", "object", "obtain", "occurs", "offers", "office", "offset", "oldest", "oliver", "online", "opened", "optics", "option", "oracle", "orange", "orders", "oregon", "origin", "others", "ottawa", "outlet", "output", "owners", "oxford", "oxygen", "packed", "packet", "palace", "palmer", "pamela", "panama", "panels", "papers", "parade", "parcel", "parent", "parish", "parker", "partly", "passed", "passes", "pastor", "patent", "patrol", "payday", "paying", "paypal", "peeing", "pencil", "people", "pepper", "period", "permit", "person", "petite", "phases", "philip", "phones", "photos", "phrase", "picked", "pickup", "picnic", "pieces", "pierce", "pierre", "pillow", "pixels", "placed", "places", "plains", "planes", "planet", "plants", "plasma", "plates", "played", "player", "please", "pledge", "plenty", "plugin", "pocket", "poetry", "points", "poison", "poland", "police", "policy", "polish", "portal", "porter", "posing", "postal", "posted", "poster", "potato", "potter", "pounds", "powder", "powell", "powers", "prague", "praise", "prayer", "prefer", "prefix", "pretty", "priced", "prices", "priest", "prince", "prints", "prison", "prizes", "profit", "prompt", "proper", "proved", "proven", "prozac", "public", "pubmed", "puerto", "pulled", "pupils", "purple", "pursue", "pushed", "puzzle", "python", "quebec", "queens", "quoted", "quotes", "rabbit", "rachel", "racial", "racing", "radios", "radius", "raised", "raises", "random", "ranger", "ranges", "ranked", "rapids", "rarely", "rather", "rating", "ratios", "reader", "really", "realty", "reason", "rebate", "recall", "recent", "recipe", "record", "redeem", "reduce", "refers", "refine", "reform", "refund", "refuse", "regard", "reggae", "regime", "region", "reject", "relate", "relief", "reload", "remain", "remark", "remedy", "remind", "remote", "remove", "render", "rental", "repair", "repeat", "report", "rescue", "resist", "resort", "result", "resume", "retail", "retain", "return", "reveal", "review", "reward", "rhythm", "ribbon", "riders", "riding", "rights", "rising", "rivers", "robbie", "robert", "robots", "robust", "rocket", "rogers", "roland", "rolled", "roller", "ronald", "roster", "rotary", "rounds", "router", "routes", "rubber", "ruling", "runner", "russia", "rwanda", "sacred", "saddam", "safari", "safely", "safety", "saints", "salary", "salmon", "sample", "samuel", "sandra", "saturn", "savage", "saving", "saying", "scales", "scared", "scenes", "scenic", "schema", "scheme", "school", "scored", "scores", "scotia", "screen", "script", "scroll", "sealed", "search", "season", "second", "secret", "sector", "secure", "seeing", "seeker", "seemed", "select", "seller", "senate", "sender", "senior", "sensor", "serbia", "serial", "series", "served", "server", "serves", "settle", "severe", "sewing", "sexual", "shades", "shadow", "shaped", "shapes", "shared", "shares", "sharon", "shaved", "sheets", "shield", "shirts", "shorts", "should", "showed", "shower", "sierra", "signal", "signed", "signup", "silent", "silver", "simple", "simply", "singer", "single", "sister", "skiing", "skills", "skirts", "sleeps", "sleeve", "slides", "slight", "slovak", "slowly", "smooth", "soccer", "social", "socket", "sodium", "solely", "solved", "sorted", "sought", "sounds", "source", "soviet", "spaces", "speaks", "spears", "speech", "speeds", "sphere", "spider", "spirit", "spoken", "sports", "spouse", "spread", "spring", "sprint", "square", "stable", "stages", "stamps", "stands", "starts", "stated", "states", "static", "status", "stayed", "steady", "stereo", "steven", "sticks", "sticky", "stocks", "stolen", "stones", "stored", "stores", "strain", "strand", "stream", "street", "stress", "strict", "strike", "string", "strips", "stroke", "strong", "struck", "struct", "stuart", "studio", "stupid", "styles", "stylus", "subaru", "submit", "subtle", "sudden", "suffer", "suited", "suites", "summer", "summit", "sunday", "sunset", "superb", "supply", "surely", "surrey", "survey", "sussex", "suzuki", "sweden", "switch", "sydney", "symbol", "syntax", "system", "tables", "tablet", "tackle", "tagged", "taiwan", "taking", "talent", "talked", "target", "tariff", "tattoo", "taught", "taylor", "techno", "temple", "tenant", "tender", "tennis", "terror", "tested", "thanks", "thehun", "themes", "theory", "thesis", "things", "thinks", "thirty", "thomas", "thongs", "though", "thread", "threat", "throat", "thrown", "throws", "thumbs", "ticket", "tigers", "timber", "timely", "timing", "tissue", "titans", "titled", "titles", "titten", "tobago", "toilet", "tomato", "tongue", "topics", "totals", "toward", "towers", "toyota", "tracks", "trader", "trades", "trails", "trains", "trance", "trauma", "travel", "travis", "treaty", "trembl", "trends", "trials", "tribal", "tribes", "tricks", "triple", "trivia", "troops", "trucks", "trusts", "trying", "tucson", "tuning", "tunnel", "turkey", "turned", "turner", "turtle", "twelve", "twenty", "typing", "uganda", "ultram", "unable", "unions", "unique", "united", "unless", "unlike", "unlock", "unwrap", "update", "upload", "urgent", "useful", "vacuum", "valium", "valley", "valued", "values", "valves", "varied", "varies", "vector", "velvet", "vendor", "venice", "venues", "verbal", "verify", "vernon", "versus", "vertex", "vessel", "victim", "victor", "videos", "vienna", "viewed", "viewer", "viking", "villas", "violin", "virgin", "virtue", "vision", "visits", "visual", "vocals", "voices", "volume", "voters", "voting", "voyuer", "wagner", "waiver", "walked", "walker", "wallet", "walnut", "walter", "wanted", "warned", "warner", "warren", "washer", "waters", "watson", "wealth", "weapon", "webcam", "weblog", "weekly", "weight", "wesley", "wheels", "whilst", "wicked", "widely", "willow", "wilson", "window", "winner", "winter", "wiring", "wisdom", "wishes", "within", "wizard", "womens", "wonder", "wooden", "worked", "worker", "worlds", "worthy", "wright", "writer", "writes", "yamaha", "yearly", "yellow", "yields", "zambia", "zoloft", "zoning", "zshops"], ["ability", "abraham", "absence", "academy", "accepts", "account", "accused", "achieve", "acquire", "acrobat", "acrylic", "actions", "actress", "adapted", "adapter", "adaptor", "address", "adopted", "advance", "adverse", "advised", "advisor", "affairs", "affects", "african", "against", "airfare", "airline", "airport", "alabama", "albania", "alberta", "alcohol", "algebra", "algeria", "alleged", "allergy", "allowed", "already", "altered", "amateur", "amazing", "ambient", "amended", "america", "amongst", "amounts", "ampland", "anaheim", "analyst", "analyze", "anatomy", "ancient", "andorra", "andreas", "andrews", "angeles", "animals", "another", "answers", "antenna", "anthony", "antigua", "antique", "antonio", "anxiety", "anybody", "anymore", "anytime", "apparel", "appeals", "appears", "applied", "applies", "approve", "aquatic", "archive", "arising", "arizona", "armenia", "arrange", "arrival", "arrived", "arrives", "article", "artists", "artwork", "aspects", "assault", "assists", "assumed", "assumes", "assured", "atlanta", "attacks", "attempt", "attract", "auction", "auditor", "austria", "authors", "average", "awarded", "awesome", "backing", "baghdad", "bahamas", "bahrain", "balance", "balloon", "bangkok", "banking", "banners", "baptist", "barbara", "bargain", "barrier", "baskets", "battery", "beaches", "bearing", "beatles", "because", "becomes", "bedding", "bedford", "bedroom", "beijing", "belarus", "belfast", "belgium", "beliefs", "believe", "belongs", "beneath", "benefit", "bennett", "bermuda", "bernard", "besides", "betting", "between", "beverly", "bicycle", "bidding", "biggest", "billing", "billion", "binding", "biology", "bizarre", "bizrate", "blanket", "blessed", "blocked", "blogger", "blowing", "boating", "bolivia", "booking", "boolean", "borders", "borough", "bottles", "boulder", "bouquet", "bowling", "bracket", "bradley", "brandon", "bridges", "briefly", "bristol", "britain", "british", "britney", "broader", "brokers", "brother", "brought", "browser", "budgets", "buffalo", "builder", "burning", "buttons", "cabinet", "calcium", "calgary", "calling", "cameras", "cameron", "camping", "candles", "capable", "capital", "capitol", "captain", "capture", "cardiac", "cardiff", "careers", "careful", "carried", "carrier", "carries", "carroll", "cartoon", "casinos", "casting", "catalog", "causing", "caution", "ceiling", "centers", "central", "centres", "century", "ceramic", "certain", "chamber", "chances", "changed", "changes", "channel", "chapter", "charged", "charger", "charges", "charity", "charles", "charlie", "charter", "chassis", "cheaper", "checked", "chelsea", "chester", "chicago", "chicken", "chinese", "choices", "chronic", "circles", "circuit", "citizen", "claimed", "clarity", "classes", "classic", "cleaner", "cleanup", "cleared", "clearly", "clients", "climate", "clinics", "clinton", "closely", "closest", "closing", "closure", "clothes", "cluster", "coaches", "coastal", "coating", "coleman", "collect", "college", "collins", "cologne", "colored", "colours", "columns", "combine", "comfort", "command", "comment", "commons", "compact", "company", "compare", "compete", "compile", "complex", "compute", "concept", "concern", "concert", "concord", "conduct", "confirm", "connect", "consent", "consist", "console", "consult", "contact", "contain", "content", "contest", "context", "control", "convert", "cookies", "cooking", "cooling", "copying", "cornell", "corners", "correct", "costume", "cottage", "council", "counsel", "counted", "counter", "country", "coupled", "couples", "coupons", "courage", "courier", "courses", "covered", "created", "creates", "creator", "credits", "cricket", "critics", "croatia", "crucial", "cruises", "crystal", "cuisine", "culture", "curious", "current", "custody", "customs", "cutting", "cycling", "damaged", "damages", "dancing", "dealers", "dealing", "deborah", "decades", "decided", "decimal", "declare", "decline", "default", "defects", "defence", "defense", "deficit", "defined", "defines", "degrees", "delayed", "deleted", "delight", "deliver", "demands", "denmark", "density", "depends", "deposit", "derived", "deserve", "designs", "desired", "desktop", "despite", "destiny", "destroy", "details", "detroit", "deutsch", "develop", "deviant", "devices", "devoted", "diagram", "diamond", "dietary", "digital", "diploma", "disable", "discuss", "disease", "display", "dispute", "distant", "diverse", "divided", "divorce", "doctors", "dollars", "domains", "donated", "douglas", "drawing", "dressed", "dresses", "drivers", "driving", "dropped", "durable", "dynamic", "earlier", "earning", "eastern", "eclipse", "ecology", "economy", "ecuador", "editing", "edition", "editors", "edwards", "effects", "efforts", "elderly", "elected", "electro", "elegant", "element", "elliott", "embassy", "emerald", "emperor", "enabled", "enables", "endless", "enemies", "engaged", "engines", "england", "english", "enhance", "enjoyed", "enlarge", "enquiry", "ensures", "entered", "entries", "episode", "equally", "erotica", "escorts", "essence", "estates", "estonia", "eternal", "ethical", "evening", "evident", "exactly", "examine", "example", "excerpt", "excited", "exclude", "execute", "exhaust", "exhibit", "existed", "expects", "expedia", "expense", "experts", "expired", "expires", "explain", "explore", "exports", "exposed", "express", "extends", "extract", "extreme", "fabrics", "factors", "factory", "faculty", "failing", "failure", "falling", "fantasy", "farmers", "farming", "fashion", "fastest", "fathers", "feature", "federal", "feeding", "feeling", "females", "ferrari", "fiction", "fifteen", "fighter", "figured", "figures", "filling", "filters", "finally", "finance", "finding", "findlaw", "fingers", "finland", "finnish", "firefox", "fishing", "fitness", "fitting", "flights", "florida", "florist", "flowers", "focused", "focuses", "folders", "folding", "follows", "footage", "foreign", "forests", "forever", "formats", "forming", "formula", "fortune", "forward", "founded", "founder", "framing", "francis", "freebsd", "freedom", "freight", "friends", "fujitsu", "funding", "funeral", "further", "futures", "gabriel", "gadgets", "gallery", "garbage", "gardens", "gateway", "gazette", "general", "generic", "genesis", "genetic", "genuine", "geology", "georgia", "germany", "getting", "gilbert", "glasgow", "glasses", "glucose", "gourmet", "grammar", "granted", "graphic", "gratuit", "gravity", "greater", "greatly", "gregory", "grenada", "griffin", "grocery", "grounds", "growing", "guitars", "habitat", "halifax", "hamburg", "hampton", "handled", "handles", "hanging", "happens", "harbour", "harmful", "harmony", "harvard", "harvest", "hazards", "headers", "heading", "headset", "healing", "healthy", "hearing", "heather", "heating", "heavily", "heights", "helpful", "helping", "herself", "hewlett", "highest", "highway", "himself", "history", "hitachi", "hitting", "hobbies", "holders", "holding", "holiday", "holland", "hopkins", "horizon", "hormone", "hostels", "hosting", "hotmail", "hottest", "housing", "houston", "however", "hundred", "hungary", "hunting", "husband", "hygiene", "hyundai", "iceland", "ignored", "illegal", "illness", "imagine", "imaging", "impacts", "implied", "implies", "imports", "imposed", "improve", "include", "indexed", "indexes", "indiana", "indians", "indices", "induced", "infants", "initial", "injured", "inquire", "inquiry", "insects", "insider", "insight", "install", "instant", "instead", "insulin", "insured", "integer", "intense", "interim", "invalid", "invited", "invoice", "involve", "ireland", "islamic", "islands", "israeli", "italian", "jackets", "jackson", "jamaica", "january", "jeffrey", "jelsoft", "jessica", "jewelry", "johnson", "joining", "journal", "journey", "jumping", "justice", "justify", "karaoke", "katrina", "keeping", "kennedy", "kenneth", "keyword", "killing", "kingdom", "kissing", "kitchen", "knights", "knowing", "labeled", "landing", "laptops", "largely", "largest", "lasting", "latinas", "laundry", "lawsuit", "lawyers", "leaders", "leading", "learned", "leasing", "leather", "leaving", "lebanon", "lecture", "legally", "legends", "leisure", "lenders", "lending", "leonard", "lesbian", "lessons", "letters", "letting", "levitra", "lexmark", "liberal", "liberia", "liberty", "library", "licence", "license", "licking", "lighter", "limited", "lincoln", "lindsay", "linking", "listing", "livecam", "loading", "locally", "located", "locator", "locking", "lodging", "logging", "logical", "longest", "looking", "lottery", "luggage", "machine", "madison", "madness", "madonna", "magical", "mailing", "mailman", "managed", "manager", "mandate", "manuals", "mapping", "marilyn", "markers", "markets", "marking", "married", "martial", "massage", "massive", "masters", "matched", "matches", "matters", "matthew", "maximum", "meaning", "measure", "medical", "medline", "meeting", "melissa", "members", "memphis", "mention", "mercury", "message", "methods", "mexican", "michael", "midwest", "mileage", "million", "mineral", "minimal", "minimum", "minolta", "minutes", "miracle", "mirrors", "missile", "missing", "mission", "mistake", "mixture", "mobiles", "modular", "modules", "moldova", "moments", "monitor", "monster", "montana", "monthly", "morning", "morocco", "mothers", "mounted", "mozilla", "muscles", "museums", "musical", "muslims", "mustang", "myanmar", "mysimon", "myspace", "mystery", "namibia", "nations", "natural", "naughty", "nearest", "neither", "nervous", "network", "neutral", "newport", "niagara", "nigeria", "nirvana", "norfolk", "nothing", "noticed", "notices", "novelty", "nowhere", "nuclear", "numbers", "numeric", "nursery", "nursing", "oakland", "obesity", "objects", "observe", "obvious", "october", "offense", "offered", "officer", "offices", "offline", "olympic", "olympus", "ongoing", "ontario", "opening", "operate", "opinion", "opposed", "optical", "optimal", "optimum", "options", "ordered", "organic", "origins", "orlando", "orleans", "outcome", "outdoor", "outlets", "outline", "outlook", "outputs", "outside", "overall", "pacific", "package", "packard", "packets", "packing", "painful", "painted", "parents", "parking", "partial", "parties", "partner", "passage", "passing", "passion", "passive", "patches", "patents", "patient", "patrick", "pattern", "payable", "payment", "payroll", "penalty", "pendant", "pending", "penguin", "pension", "pentium", "peoples", "percent", "perfect", "perform", "perfume", "perhaps", "periods", "permits", "persian", "persons", "phantom", "philips", "phoenix", "phrases", "physics", "picking", "picture", "pioneer", "pirates", "placing", "planets", "planned", "planner", "plastic", "players", "playing", "pleased", "plugins", "pockets", "podcast", "pointed", "pointer", "pokemon", "polymer", "pontiac", "popular", "porsche", "portion", "possess", "postage", "posters", "posting", "pottery", "poultry", "poverty", "powered", "prairie", "prayers", "precise", "predict", "prefers", "premier", "premium", "prepaid", "prepare", "present", "pressed", "preston", "prevent", "preview", "pricing", "primary", "printed", "printer", "privacy", "private", "problem", "proceed", "process", "produce", "product", "profile", "profits", "program", "project", "promise", "promote", "prophet", "propose", "protect", "protein", "protest", "proudly", "provide", "publish", "pulling", "purpose", "pursuit", "pushing", "putting", "puzzles", "qualify", "quality", "quantum", "quarter", "queries", "quickly", "quizzes", "radical", "railway", "rainbow", "raising", "raleigh", "rangers", "ranging", "ranking", "rapidly", "ratings", "raymond", "reached", "reaches", "readers", "readily", "reading", "reality", "realize", "realtor", "reasons", "rebates", "rebecca", "rebound", "receipt", "receive", "recipes", "records", "recover", "redhead", "reduced", "reduces", "refined", "reflect", "reforms", "refresh", "refused", "regards", "regions", "regular", "related", "relates", "release", "relying", "remains", "remarks", "removal", "removed", "renewal", "rentals", "repairs", "replace", "replica", "replied", "replies", "reports", "reprint", "request", "require", "reserve", "resolve", "resorts", "respect", "respond", "restore", "results", "resumes", "retired", "retreat", "returns", "reunion", "reuters", "reveals", "revenge", "revenue", "reverse", "reviews", "revised", "rewards", "richard", "roberts", "rolling", "romance", "romania", "roughly", "routers", "routine", "routing", "royalty", "running", "runtime", "russell", "russian", "sailing", "samples", "samsung", "satisfy", "savings", "scanned", "scanner", "schemes", "scholar", "schools", "science", "scoring", "scratch", "screens", "scripts", "seafood", "seasons", "seating", "seattle", "seconds", "secrets", "section", "sectors", "secured", "seekers", "seeking", "segment", "sellers", "selling", "seminar", "senator", "sending", "senegal", "seniors", "sensors", "serious", "servers", "service", "serving", "session", "setting", "settled", "seventh", "several", "shadows", "shakira", "shannon", "sharing", "shelter", "sheriff", "sherman", "shipped", "shopper", "shorter", "shortly", "showers", "showing", "shuttle", "siemens", "signals", "signing", "silence", "silicon", "similar", "simpson", "singing", "singles", "sisters", "sitemap", "sitting", "skating", "skilled", "smaller", "smilies", "smoking", "society", "solaris", "soldier", "solomon", "solving", "somalia", "somehow", "someone", "soonest", "sources", "spanish", "spatial", "speaker", "special", "species", "specify", "spencer", "spirits", "sponsor", "springs", "spyware", "stadium", "stanley", "started", "starter", "startup", "stating", "station", "statute", "staying", "stephen", "stevens", "stewart", "sticker", "stomach", "stopped", "storage", "stories", "strange", "streams", "streets", "stretch", "strikes", "strings", "stripes", "student", "studied", "studies", "studios", "stuffed", "stylish", "subject", "sublime", "succeed", "success", "sucking", "suggest", "suicide", "summary", "sunrise", "support", "suppose", "supreme", "surface", "surfing", "surgeon", "surgery", "surname", "surplus", "surveys", "survive", "suspect", "swedish", "symbols", "systems", "tablets", "tactics", "talking", "targets", "teacher", "teaches", "teenage", "telecom", "telling", "tension", "terrace", "terrain", "testing", "textile", "texture", "theater", "theatre", "theorem", "therapy", "thereby", "thereof", "thermal", "thomson", "thought", "threads", "threats", "through", "thunder", "tickets", "tiffany", "timothy", "tobacco", "toddler", "tonight", "toolbar", "toolbox", "toolkit", "toronto", "torture", "toshiba", "totally", "touched", "touring", "tourism", "tourist", "towards", "tracked", "tracker", "tractor", "trading", "traffic", "tragedy", "trailer", "trained", "trainer", "transit", "travels", "treated", "tribune", "tribute", "trigger", "trinity", "triumph", "trouble", "trusted", "trustee", "tsunami", "tuesday", "tuition", "tunisia", "turkish", "turning", "twisted", "typical", "ukraine", "unified", "uniform", "unknown", "unusual", "updated", "updates", "upgrade", "uruguay", "usually", "utility", "utilize", "vaccine", "vampire", "vanilla", "variety", "various", "varying", "vatican", "vehicle", "vendors", "venture", "verizon", "vermont", "version", "vessels", "veteran", "victims", "victory", "vietnam", "viewers", "viewing", "village", "vincent", "vintage", "violent", "virtual", "viruses", "visible", "visited", "visitor", "vitamin", "voltage", "volumes", "waiting", "walking", "wallace", "wanting", "warming", "warning", "warrant", "warrior", "washing", "watched", "watches", "weapons", "wearing", "weather", "webcams", "webcast", "weblogs", "webpage", "website", "webster", "wedding", "weekend", "weights", "welcome", "welding", "welfare", "western", "whereas", "whether", "wichita", "william", "willing", "windows", "windsor", "winners", "winning", "winston", "wishing", "without", "witness", "workers", "working", "workout", "worried", "worship", "wrapped", "writers", "writing", "written", "wyoming", "younger", "zealand"], ["aberdeen", "abortion", "absolute", "abstract", "academic", "accepted", "accessed", "accident", "accounts", "accuracy", "accurate", "achieved", "acoustic", "acquired", "actively", "activity", "actually", "adapters", "adaptive", "addition", "adelaide", "adequate", "adjacent", "adjusted", "admitted", "adoption", "advanced", "advances", "advisors", "advisory", "advocacy", "advocate", "affected", "agencies", "aircraft", "airlines", "airplane", "airports", "alliance", "allowing", "although", "aluminum", "american", "americas", "analyses", "analysis", "analysts", "analyzed", "anderson", "animated", "announce", "annoying", "annually", "answered", "antibody", "antiques", "anything", "anywhere", "apparent", "appeared", "appendix", "applying", "approach", "approval", "approved", "aquarium", "archived", "archives", "argument", "arkansas", "arranged", "arrested", "arrivals", "articles", "artistic", "asbestos", "assembly", "assessed", "assigned", "assisted", "assuming", "athletes", "athletic", "atlantic", "attached", "attacked", "attempts", "attended", "attitude", "attorney", "auckland", "auctions", "audience", "aviation", "avoiding", "bachelor", "bacteria", "balanced", "barbados", "bargains", "barriers", "baseball", "baseline", "basement", "basename", "bathroom", "becoming", "bedrooms", "beginner", "behavior", "believed", "believes", "benefits", "benjamin", "berkeley", "beverage", "biblical", "birthday", "bleeding", "blocking", "bloggers", "blogging", "bookings", "bookmark", "botswana", "boundary", "boutique", "bracelet", "bradford", "branches", "breaking", "breeding", "briefing", "brighton", "bringing", "brisbane", "broadway", "brochure", "brooklyn", "brothers", "browsers", "browsing", "brunette", "brussels", "budapest", "builders", "building", "bulgaria", "bulletin", "business", "cabinets", "cadillac", "calendar", "cambodia", "cameroon", "campaign", "campbell", "canadian", "canberra", "capacity", "captured", "carnival", "carolina", "caroline", "carriers", "carrying", "cartoons", "cashiers", "cassette", "catalogs", "catalyst", "category", "catering", "catholic", "cellular", "cemetery", "centered", "ceremony", "chairman", "chambers", "champion", "changing", "channels", "chapters", "chargers", "charging", "charming", "cheapest", "checking", "checkout", "chemical", "children", "choosing", "chrysler", "churches", "cingular", "circuits", "circular", "citation", "citizens", "civilian", "classics", "cleaners", "cleaning", "clearing", "clicking", "climbing", "clinical", "clothing", "clusters", "coaching", "cocktail", "collapse", "colleges", "colombia", "colonial", "colorado", "columbia", "columbus", "combined", "combines", "commands", "comments", "commerce", "commonly", "compared", "compiled", "compiler", "complete", "composed", "composer", "compound", "computed", "computer", "concepts", "concerns", "concerts", "conclude", "concrete", "conflict", "confused", "congress", "consider", "consists", "consoles", "constant", "consumer", "contacts", "contains", "contents", "contests", "continue", "contract", "contrary", "contrast", "controls", "cookbook", "cordless", "cornwall", "cosmetic", "costumes", "cottages", "councils", "counters", "counties", "counting", "courtesy", "coverage", "covering", "crawford", "creating", "creation", "creative", "creature", "criminal", "criteria", "critical", "crossing", "cultural", "cultures", "currency", "customer", "cylinder", "darkness", "database", "daughter", "davidson", "deadline", "dealtime", "december", "decision", "declared", "declined", "decrease", "deferred", "defining", "delaware", "delivers", "delivery", "democrat", "dentists", "deposits", "describe", "designed", "designer", "desktops", "detailed", "detected", "detector", "deutsche", "develops", "diabetes", "dialogue", "diameter", "diamonds", "directed", "directly", "director", "disabled", "disagree", "disaster", "disclose", "discount", "discover", "discrete", "diseases", "disorder", "dispatch", "displays", "disposal", "disputes", "distance", "distinct", "district", "dividend", "division", "doctrine", "document", "domestic", "dominant", "donation", "download", "downtown", "drainage", "dramatic", "drawings", "dressing", "drilling", "drinking", "duration", "dynamics", "earliest", "earnings", "earrings", "economic", "editions", "edmonton", "educated", "egyptian", "election", "electric", "electron", "elements", "elephant", "eligible", "embedded", "emerging", "emirates", "emission", "emotions", "emphasis", "employed", "employee", "employer", "enabling", "enclosed", "encoding", "endorsed", "engaging", "engineer", "enhanced", "enjoying", "enormous", "enrolled", "ensemble", "ensuring", "entering", "entirely", "entities", "entitled", "entrance", "envelope", "epinions", "episodes", "equality", "equation", "equipped", "ericsson", "estimate", "ethernet", "ethiopia", "european", "evaluate", "everyday", "everyone", "evidence", "examined", "examines", "examples", "exchange", "exciting", "excluded", "executed", "exercise", "exhibits", "existing", "expanded", "expansys", "expected", "expenses", "explains", "explicit", "explorer", "exposure", "extended", "exterior", "external", "fabulous", "facility", "failures", "familiar", "families", "favorite", "featured", "features", "february", "feedback", "feelings", "festival", "fighters", "fighting", "filename", "finances", "findings", "finished", "fioricet", "firewall", "firewire", "firmware", "fixtures", "flashers", "flashing", "flexible", "floating", "flooring", "florence", "florists", "focusing", "followed", "football", "footwear", "forecast", "forestry", "formerly", "fountain", "fraction", "franklin", "freeware", "frequent", "friendly", "frontier", "function", "gambling", "gamecube", "gamespot", "gasoline", "gathered", "generate", "generous", "genetics", "geometry", "glossary", "gorgeous", "governor", "graduate", "graphics", "grateful", "greatest", "greeting", "guardian", "guidance", "hamilton", "handbags", "handbook", "handheld", "handling", "handmade", "happened", "hardware", "hardwood", "harrison", "hartford", "hawaiian", "headline", "hearings", "heritage", "highland", "highways", "hispanic", "historic", "holdings", "holidays", "homeland", "homeless", "homepage", "hometown", "homework", "honduras", "honolulu", "horrible", "hospital", "humanity", "humidity", "hundreds", "hydrogen", "identify", "identity", "illinois", "impaired", "imperial", "imported", "improved", "incident", "included", "includes", "incoming", "increase", "incurred", "indicate", "indirect", "industry", "infected", "infinite", "informal", "informed", "infrared", "injuries", "innocent", "inserted", "insights", "inspired", "instance", "integral", "intended", "interact", "interest", "interior", "internal", "internet", "interval", "intimate", "intranet", "invasion", "investor", "invision", "involved", "involves", "isolated", "istanbul", "italiano", "japanese", "jennifer", "johnston", "jonathan", "journals", "judgment", "judicial", "junction", "juvenile", "kentucky", "keyboard", "keywords", "kingston", "knitting", "language", "latitude", "laughing", "launched", "launches", "lawrence", "learners", "learning", "lectures", "lesbians", "licensed", "licenses", "lifetime", "lightbox", "lighting", "likewise", "limiting", "lingerie", "listings", "literacy", "literary", "location", "logitech", "machines", "magazine", "magnetic", "mainland", "maintain", "majority", "malaysia", "maldives", "managers", "managing", "manitoba", "manually", "marathon", "margaret", "maritime", "marriage", "marriott", "marshall", "maryland", "matching", "material", "mattress", "maximize", "mcdonald", "measured", "measures", "medicaid", "medicare", "medicine", "medieval", "meetings", "membrane", "memorial", "memories", "mercedes", "merchant", "messages", "metadata", "metallic", "michelle", "michigan", "midlands", "midnight", "military", "millions", "minerals", "minimize", "minister", "ministry", "minority", "missions", "missouri", "mistakes", "mistress", "mitchell", "mobility", "modeling", "moderate", "modified", "moisture", "momentum", "monetary", "mongolia", "monitors", "monsters", "montreal", "moreover", "morrison", "mortgage", "motorola", "mountain", "mounting", "movement", "multiple", "musician", "national", "naturals", "navigate", "nebraska", "necklace", "negative", "neighbor", "netscape", "networks", "nicholas", "nickname", "nintendo", "nitrogen", "normally", "northern", "notebook", "notified", "november", "numerous", "observed", "observer", "obtained", "occasion", "occupied", "occurred", "offering", "officers", "official", "offshore", "oklahoma", "olympics", "openings", "operated", "operates", "operator", "opinions", "opponent", "opposite", "optimize", "optional", "ordering", "ordinary", "organize", "oriental", "oriented", "original", "outcomes", "outdoors", "outlined", "outreach", "overcome", "overhead", "overseas", "overview", "packages", "painting", "pakistan", "paradise", "paraguay", "parallel", "parental", "particle", "partners", "passport", "password", "patients", "patricia", "patterns", "pavilion", "payments", "peaceful", "pensions", "performs", "periodic", "personal", "peterson", "petition", "pharmacy", "phillips", "physical", "pictures", "pipeline", "planners", "planning", "plastics", "platform", "platinum", "playback", "playlist", "pleasant", "pleasure", "plumbing", "plymouth", "podcasts", "pointing", "policies", "polished", "politics", "portable", "portions", "portland", "portrait", "portugal", "position", "positive", "possible", "possibly", "postcard", "postings", "potatoes", "powerful", "practice", "precious", "pregnant", "premiere", "premises", "prepared", "presence", "presents", "preserve", "pressing", "pressure", "previews", "previous", "princess", "printers", "printing", "priority", "prisoner", "probably", "problems", "proceeds", "produced", "producer", "produces", "products", "profiles", "programs", "progress", "projects", "promised", "promises", "promoted", "promotes", "promptly", "propecia", "properly", "property", "proposal", "proposed", "prospect", "prostate", "proteins", "protocol", "provided", "provider", "provides", "province", "publicly", "purchase", "purposes", "pursuant", "quantity", "quarters", "question", "railroad", "rankings", "rational", "reaching", "reaction", "readings", "realized", "realtors", "received", "receiver", "receives", "recently", "receptor", "recorded", "recorder", "recovery", "reducing", "referral", "referred", "reflects", "refugees", "regarded", "regional", "register", "registry", "rejected", "relating", "relation", "relative", "released", "releases", "relevant", "reliable", "reliance", "religion", "remained", "remedies", "remember", "reminder", "removing", "rendered", "repeated", "replaced", "reported", "reporter", "reprints", "republic", "requests", "required", "requires", "research", "reseller", "reserved", "reserves", "resident", "resolved", "resource", "response", "restored", "restrict", "resulted", "retailer", "retained", "retrieve", "returned", "revealed", "revenues", "reviewed", "reviewer", "revision", "reynolds", "richards", "richmond", "ringtone", "robinson", "romantic", "roommate", "rotation", "roulette", "routines", "salaries", "salvador", "sampling", "sandwich", "sapphire", "saturday", "savannah", "scanners", "scanning", "scenario", "schedule", "scholars", "sciences", "scotland", "scottish", "searched", "searches", "seasonal", "sections", "securely", "security", "segments", "selected", "semester", "seminars", "senators", "sentence", "separate", "sequence", "services", "sessions", "settings", "sexually", "shanghai", "shepherd", "shipment", "shipping", "shooting", "shoppers", "shopping", "shoulder", "showcase", "simpsons", "situated", "sleeping", "slightly", "slovakia", "slovenia", "smallest", "snapshot", "softball", "software", "soldiers", "solution", "somebody", "somerset", "somewhat", "southern", "spanking", "speakers", "speaking", "specials", "specific", "spectrum", "speeches", "spelling", "spending", "sponsors", "sporting", "springer", "staffing", "standard", "standing", "stanford", "starring", "starting", "stations", "statutes", "steering", "sterling", "stickers", "stopping", "straight", "stranger", "strategy", "strength", "strictly", "striking", "stronger", "strongly", "struggle", "students", "studying", "stunning", "subjects", "suburban", "suddenly", "suffered", "suggests", "suitable", "sullivan", "sunshine", "superior", "supplied", "supplier", "supplies", "supports", "supposed", "surfaces", "surgeons", "surgical", "surprise", "surround", "survival", "survivor", "swimming", "swingers", "switched", "switches", "symantec", "sympathy", "symphony", "symptoms", "syndrome", "synopsis", "syracuse", "talented", "tanzania", "targeted", "taxation", "teachers", "teaching", "template", "temporal", "terminal", "terrible", "textbook", "textiles", "thailand", "theaters", "theology", "theories", "thinking", "thinkpad", "thompson", "thorough", "thoughts", "thousand", "threaded", "thriller", "throwing", "thursday", "timeline", "titanium", "together", "tomatoes", "tomorrow", "township", "tracking", "trailers", "trainers", "training", "tramadol", "transfer", "transmit", "traveler", "travesti", "treasure", "treasury", "treating", "triangle", "tribunal", "trinidad", "tropical", "trustees", "tutorial", "ultimate", "universe", "unlikely", "unsigned", "untitled", "upcoming", "updating", "upgrades", "uploaded", "username", "vacation", "validity", "valuable", "variable", "variance", "vehicles", "velocity", "ventures", "verified", "versions", "vertical", "veterans", "victoria", "villages", "violence", "virginia", "visiting", "visitors", "vitamins", "warcraft", "warnings", "warranty", "warriors", "watching", "webshots", "websites", "weddings", "weekends", "weighted", "wellness", "whatever", "whenever", "wherever", "wildlife", "williams", "wireless", "wishlist", "workflow", "workshop", "worldcat", "wrapping", "writings", "yourself", "zimbabwe"], ["abandoned", "abilities", "abstracts", "academics", "accepting", "accessing", "accessory", "accidents", "according", "achieving", "activated", "activists", "addiction", "additions", "addressed", "addresses", "admission", "advantage", "adventure", "advertise", "aerospace", "affecting", "affiliate", "afternoon", "aggregate", "agreement", "alexander", "algorithm", "alignment", "allocated", "allowance", "alternate", "aluminium", "amendment", "amenities", "americans", "amplifier", "amsterdam", "animation", "annotated", "announced", "announces", "anonymous", "answering", "antivirus", "apartment", "apparatus", "appearing", "appliance", "applicant", "appointed", "appraisal", "arbitrary", "architect", "argentina", "arguments", "arlington", "armstrong", "arthritis", "assembled", "assessing", "assistant", "associate", "assurance", "astrology", "astronomy", "athletics", "attempted", "attending", "attention", "attitudes", "attorneys", "attribute", "australia", "authentic", "authority", "automated", "automatic", "available", "awareness", "bacterial", "baltimore", "bandwidth", "barcelona", "basically", "bathrooms", "batteries", "beautiful", "beginners", "beginning", "behaviour", "benchmark", "beverages", "biography", "blackjack", "bloomberg", "bluetooth", "bookmarks", "bookstore", "boulevard", "bracelets", "brazilian", "breakdown", "breakfast", "breathing", "brilliant", "broadband", "broadcast", "brochures", "brunswick", "buildings", "bulgarian", "butterfly", "calculate", "calendars", "cambridge", "camcorder", "campaigns", "cancelled", "candidate", "carefully", "caribbean", "cartridge", "catalogue", "cathedral", "catherine", "celebrate", "celebrity", "centuries", "certainly", "certified", "challenge", "champagne", "champions", "changelog", "character", "charlotte", "checklist", "chemicals", "chemistry", "chevrolet", "childhood", "childrens", "chocolate", "christian", "christina", "christine", "christmas", "chronicle", "cigarette", "citations", "classical", "classroom", "clearance", "cleveland", "coalition", "cognitive", "colleague", "collected", "collector", "combining", "commander", "commented", "committed", "committee", "commodity", "communist", "community", "companies", "companion", "comparing", "competent", "competing", "complaint", "completed", "compliant", "component", "composite", "compounds", "computers", "computing", "concerned", "concluded", "condition", "conducted", "confident", "configure", "confirmed", "conflicts", "confusion", "connected", "connector", "conscious", "consensus", "considers", "construct", "consumers", "contacted", "contained", "container", "continent", "continued", "continues", "contracts", "converted", "converter", "convicted", "convinced", "copyright", "corporate", "corrected", "correctly", "cosmetics", "countries", "creations", "creatures", "criterion", "criticism", "crossword", "currently", "customers", "customise", "customize", "dangerous", "databases", "daughters", "decisions", "decreased", "dedicated", "defendant", "defensive", "delicious", "delivered", "demanding", "democracy", "democrats", "departure", "dependent", "depending", "described", "describes", "designers", "designing", "desirable", "desperate", "destroyed", "detection", "detective", "determine", "developed", "developer", "deviation", "diagnosis", "different", "difficult", "dimension", "direction", "directive", "directors", "directory", "discharge", "discounts", "discovery", "discussed", "discusses", "disorders", "displayed", "distances", "districts", "disturbed", "diversity", "divisions", "documents", "dominican", "donations", "downloads", "duplicate", "ecommerce", "economics", "economies", "edinburgh", "editorial", "education", "educators", "effective", "efficient", "elections", "electoral", "elevation", "eliminate", "elizabeth", "elsewhere", "emergency", "emissions", "emotional", "empirical", "employees", "employers", "enclosure", "encounter", "encourage", "engineers", "enhancing", "enquiries", "equations", "equipment", "essential", "establish", "estimated", "estimates", "evaluated", "everybody", "evolution", "examining", "excellent", "exception", "excessive", "exchanges", "excluding", "exclusion", "exclusive", "execution", "executive", "exemption", "exercises", "existence", "expanding", "expansion", "expensive", "expertise", "explained", "exploring", "explosion", "expressed", "extending", "extension", "extensive", "extremely", "fairfield", "fantastic", "favorites", "favourite", "featuring", "festivals", "filtering", "financial", "financing", "finishing", "fireplace", "fisheries", "following", "forbidden", "forecasts", "forgotten", "formation", "fragrance", "framework", "franchise", "francisco", "frankfurt", "frederick", "freelance", "frequency", "frontpage", "functions", "furnished", "furniture", "galleries", "gardening", "gathering", "genealogy", "generally", "generated", "generates", "generator", "gentleman", "geography", "gibraltar", "governing", "gradually", "graduated", "graduates", "graphical", "greetings", "guarantee", "guatemala", "guestbook", "halloween", "hampshire", "handhelds", "happening", "happiness", "hardcover", "hazardous", "headlines", "henderson", "hepatitis", "hierarchy", "highlight", "hollywood", "holocaust", "hopefully", "hospitals", "household", "hungarian", "hurricane", "hydraulic", "identical", "immediate", "implement", "important", "impressed", "improving", "incentive", "incidence", "incidents", "including", "inclusion", "inclusive", "incorrect", "increased", "increases", "indicated", "indicates", "indicator", "indonesia", "induction", "infection", "inflation", "influence", "inherited", "initially", "initiated", "injection", "inquiries", "insertion", "inspector", "installed", "instances", "instantly", "institute", "insurance", "integrate", "integrity", "intensity", "intensive", "intention", "interests", "interface", "intervals", "interview", "introduce", "invention", "inventory", "investing", "investors", "invisible", "involving", "isolation", "jefferson", "jerusalem", "jewellery", "keyboards", "knowledge", "lafayette", "lancaster", "landscape", "languages", "legendary", "lexington", "liability", "librarian", "libraries", "licensing", "lifestyle", "lightning", "listening", "listprice", "literally", "lithuania", "liverpool", "livestock", "locations", "logistics", "longitude", "looksmart", "louisiana", "macedonia", "machinery", "macintosh", "magazines", "magnitude", "maintains", "mandatory", "manhattan", "marijuana", "marketing", "materials", "maternity", "mauritius", "meanwhile", "measuring", "mechanics", "mechanism", "mediawiki", "medicines", "melbourne", "mentioned", "merchants", "messaging", "messenger", "metallica", "microsoft", "microwave", "migration", "milwaukee", "miniature", "ministers", "minnesota", "modelling", "moderator", "molecular", "molecules", "monitored", "mortality", "mortgages", "motivated", "mountains", "movements", "municipal", "musicians", "namespace", "narrative", "nashville", "naturally", "navigator", "necessary", "necessity", "neighbors", "newcastle", "newspaper", "nicaragua", "nightlife", "nightmare", "nominated", "nonprofit", "northeast", "northwest", "norwegian", "notebooks", "numerical", "nutrition", "objective", "obtaining", "obviously", "occasions", "occurring", "offensive", "offerings", "officials", "omissions", "operating", "operation", "operators", "opponents", "orchestra", "ordinance", "organised", "organisms", "organized", "organizer", "otherwise", "ourselves", "overnight", "ownership", "packaging", "paintball", "paintings", "palestine", "panasonic", "pantyhose", "paperback", "paragraph", "parameter", "parenting", "partially", "particles", "partition", "passenger", "passwords", "pathology", "pediatric", "penalties", "peninsula", "perceived", "perfectly", "performed", "performer", "permalink", "permanent", "permitted", "personals", "personnel", "petroleum", "photoshop", "physician", "pichunter", "placement", "plaintiff", "platforms", "political", "pollution", "polyester", "porcelain", "portfolio", "portraits", "positions", "postcards", "potential", "practical", "practices", "preceding", "precisely", "precision", "predicted", "preferred", "pregnancy", "preparing", "presented", "presently", "president", "primarily", "princeton", "principal", "principle", "printable", "prisoners", "privilege", "procedure", "processed", "processes", "processor", "producers", "producing", "professor", "programme", "projected", "projector", "prominent", "promising", "promoting", "promotion", "proposals", "prospects", "prostores", "protected", "protocols", "prototype", "providers", "providing", "provinces", "provision", "publicity", "published", "publisher", "purchased", "purchases", "qualified", "qualities", "quarterly", "questions", "radiation", "reactions", "realistic", "reasoning", "receivers", "receiving", "reception", "receptors", "recipient", "recognize", "recommend", "recorders", "recording", "recovered", "recycling", "reduction", "reference", "referrals", "referring", "refinance", "reflected", "regarding", "registrar", "regularly", "regulated", "relations", "relatives", "relevance", "religions", "religious", "remainder", "remaining", "removable", "rendering", "renewable", "replacing", "reporters", "reporting", "represent", "reproduce", "requested", "requiring", "reservoir", "residence", "residents", "resistant", "resources", "respected", "responded", "responses", "resulting", "retailers", "retention", "retrieval", "retrieved", "returning", "reviewing", "revisions", "ringtones", "riverside", "robertson", "rochester", "roommates", "sacrifice", "salvation", "satellite", "satisfied", "scenarios", "scheduled", "schedules", "scientist", "screening", "scripting", "sculpture", "searching", "secondary", "secretary", "selecting", "selection", "selective", "sensitive", "sentences", "separated", "september", "sequences", "seriously", "sexuality", "shareware", "sheffield", "shipments", "shopzilla", "shortcuts", "showtimes", "signature", "similarly", "singapore", "situation", "slideshow", "snowboard", "societies", "sociology", "solutions", "something", "sometimes", "somewhere", "southeast", "southwest", "specially", "specialty", "specifics", "specified", "specifies", "spiritual", "spokesman", "sponsored", "spotlight", "spreading", "stability", "stainless", "standards", "standings", "statement", "statewide", "statutory", "stephanie", "stockholm", "stockings", "strategic", "streaming", "strengths", "structure", "submitted", "subscribe", "substance", "suffering", "suggested", "summaries", "suppliers", "supported", "surprised", "survivors", "suspected", "suspended", "sustained", "swaziland", "switching", "symposium", "syndicate", "synthesis", "synthetic", "technical", "technique", "telephone", "telephony", "telescope", "templates", "temporary", "tennessee", "terminals", "territory", "terrorism", "terrorist", "testament", "testimony", "textbooks", "therapist", "therefore", "thesaurus", "thickness", "thousands", "threshold", "thumbnail", "tolerance", "trackback", "trademark", "tradition", "transfers", "transform", "translate", "transport", "travelers", "traveling", "traveller", "treasurer", "treasures", "treatment", "tutorials", "typically", "undefined", "undertake", "underwear", "uniprotkb", "universal", "unlimited", "upgrading", "utilities", "vacancies", "vacations", "valentine", "valuation", "vancouver", "variables", "variation", "varieties", "vbulletin", "vegetable", "venezuela", "victorian", "violation", "virtually", "voluntary", "volunteer", "voyeurweb", "wallpaper", "warehouse", "watershed", "webmaster", "wednesday", "wholesale", "wikipedia", "wisconsin", "witnesses", "wonderful", "wondering", "worcester", "wordpress", "workforce", "workplace", "workshops", "worldwide", "wrestling", "yesterday", "yorkshire"], ["aboriginal", "absolutely", "absorption", "acceptable", "acceptance", "accessible", "accomplish", "accordance", "accounting", "accredited", "accurately", "acdbentity", "activation", "activities", "adaptation", "additional", "addressing", "adjustable", "adjustment", "admissions", "adolescent", "advantages", "adventures", "advertiser", "affiliated", "affiliates", "affordable", "afterwards", "aggressive", "agreements", "alexandria", "algorithms", "allocation", "ambassador", "amendments", "analytical", "annotation", "antarctica", "antibodies", "apartments", "apparently", "appearance", "appliances", "applicable", "applicants", "appreciate", "approaches", "architects", "artificial", "assessment", "assignment", "assistance", "associated", "associates", "assumption", "atmosphere", "attachment", "attempting", "attendance", "attraction", "attractive", "attributes", "australian", "authorized", "automation", "automobile", "automotive", "azerbaijan", "background", "bangladesh", "bankruptcy", "basketball", "beastality", "behavioral", "beneficial", "biological", "birmingham", "blackberry", "boundaries", "britannica", "burlington", "businesses", "calculated", "calculator", "california", "camcorders", "candidates", "capability", "cartridges", "categories", "challenged", "challenges", "chancellor", "characters", "charitable", "charleston", "christians", "chronicles", "cigarettes", "cincinnati", "citysearch", "classified", "colleagues", "collecting", "collection", "collective", "collectors", "columnists", "commentary", "commercial", "commission", "commitment", "committees", "comparable", "comparison", "compatible", "complaints", "complement", "completely", "completing", "completion", "complexity", "compliance", "components", "compressed", "compromise", "conceptual", "concerning", "conclusion", "conditions", "conducting", "conference", "confidence", "configured", "connecting", "connection", "connectors", "considered", "consistent", "consisting", "consortium", "conspiracy", "constantly", "constitute", "constraint", "consultant", "consulting", "contacting", "containers", "containing", "continuing", "continuity", "continuous", "contractor", "contribute", "controlled", "controller", "convenient", "convention", "conversion", "conviction", "coordinate", "copyrights", "correction", "corruption", "counseling", "creativity", "cumulative", "currencies", "curriculum", "customized", "decorating", "decorative", "definitely", "definition", "delegation", "delivering", "democratic", "department", "dependence", "deployment", "depression", "descending", "describing", "designated", "determined", "determines", "developers", "developing", "diagnostic", "dictionary", "difference", "difficulty", "dimensions", "directions", "disability", "discipline", "disclaimer", "disclosure", "discounted", "discovered", "discretion", "discussing", "discussion", "dispatched", "displaying", "distribute", "documented", "downloaded", "earthquake", "ecological", "editorials", "efficiency", "electrical", "electronic", "elementary", "employment", "encouraged", "encourages", "encryption", "endangered", "engagement", "enrollment", "enterprise", "equivalent", "especially", "essentials", "estimation", "evaluating", "evaluation", "eventually", "everything", "everywhere", "excellence", "exceptions", "excitement", "executives", "exhibition", "experience", "experiment", "expiration", "explaining", "explicitly", "expression", "extensions", "extraction", "facilitate", "facilities", "favourites", "federation", "fellowship", "formatting", "forwarding", "foundation", "fragrances", "frequently", "friendship", "functional", "generating", "generation", "generators", "geographic", "geological", "girlfriend", "governance", "government", "graduation", "greenhouse", "greensboro", "guaranteed", "guarantees", "guidelines", "harassment", "headphones", "healthcare", "helicopter", "highlights", "historical", "horizontal", "households", "housewares", "housewives", "humanities", "huntington", "hypothesis", "identified", "identifier", "identifies", "immigrants", "immunology", "importance", "impossible", "impression", "impressive", "incentives", "incomplete", "increasing", "incredible", "indicating", "indication", "indicators", "indigenous", "individual", "indonesian", "industrial", "industries", "infections", "infectious", "influenced", "influences", "initiative", "innovation", "innovative", "inspection", "installing", "institutes", "instructor", "instrument", "insulation", "integrated", "interested", "interfaces", "internship", "interstate", "interviews", "introduced", "introduces", "investment", "invitation", "irrigation", "javascript", "journalism", "journalist", "kazakhstan", "kilometers", "laboratory", "landscapes", "lauderdale", "leadership", "legitimate", "likelihood", "limitation", "limousines", "literature", "litigation", "louisville", "luxembourg", "macromedia", "madagascar", "mainstream", "maintained", "management", "manchester", "mastercard", "meaningful", "mechanical", "mechanisms", "medication", "meditation", "membership", "metabolism", "microphone", "millennium", "ministries", "mitsubishi", "moderators", "monitoring", "montgomery", "motivation", "motorcycle", "mozambique", "multimedia", "mysterious", "nationally", "nationwide", "navigation", "networking", "newsletter", "newspapers", "nomination", "nottingham", "obituaries", "objectives", "obligation", "occasional", "occupation", "occurrence", "officially", "operations", "opposition", "organizing", "originally", "paperbacks", "paragraphs", "parameters", "parliament", "particular", "passengers", "percentage", "perception", "performing", "peripheral", "permission", "persistent", "personally", "petersburg", "pharmacies", "phenomenon", "philosophy", "photograph", "physically", "physicians", "physiology", "pittsburgh", "polyphonic", "popularity", "population", "portsmouth", "portuguese", "possession", "postposted", "powerpoint", "prediction", "preference", "prescribed", "presenting", "preventing", "prevention", "previously", "principles", "priorities", "privileges", "procedures", "proceeding", "processing", "processors", "production", "productive", "profession", "programmer", "programmes", "prohibited", "projection", "projectors", "promotions", "properties", "proportion", "protecting", "protection", "protective", "providence", "provincial", "provisions", "psychiatry", "psychology", "publishers", "publishing", "punishment", "purchasing", "qualifying", "quantities", "queensland", "quotations", "reasonable", "reasonably", "recipients", "recognised", "recognized", "recommends", "recordings", "recreation", "recruiting", "reductions", "referenced", "references", "reflection", "regardless", "registered", "regression", "regulation", "regulatory", "relatively", "relaxation", "relocation", "remarkable", "remembered", "repository", "represents", "reproduced", "republican", "reputation", "requesting", "researcher", "resistance", "resolution", "respective", "respondent", "responding", "restaurant", "restricted", "retirement", "revelation", "revolution", "richardson", "sacramento", "scheduling", "scientific", "scientists", "screenshot", "securities", "selections", "separately", "separation", "settlement", "signatures", "simplified", "simulation", "situations", "soundtrack", "specialist", "statements", "stationery", "statistics", "strategies", "strengthen", "structural", "structured", "structures", "subjective", "submission", "submitting", "subscriber", "subsection", "subsequent", "subsidiary", "substances", "substitute", "successful", "sufficient", "suggesting", "suggestion", "sunglasses", "supervisor", "supplement", "supporters", "supporting", "surprising", "surrounded", "suspension", "systematic", "technician", "techniques", "technology", "television", "terrorists", "themselves", "thereafter", "thoroughly", "threatened", "throughout", "thumbnails", "thumbzilla", "tournament", "trackbacks", "trademarks", "traditions", "transcript", "transexual", "transition", "translated", "translator", "travelling", "treatments", "tremendous", "ultimately", "underlying", "understand", "understood", "undertaken", "unexpected", "university", "uzbekistan", "validation", "variations", "vegetables", "vegetarian", "vegetation", "veterinary", "vietnamese", "violations", "visibility", "vocabulary", "vocational", "volkswagen", "volleyball", "volunteers", "vulnerable", "wallpapers", "warranties", "washington", "waterproof", "webmasters", "wellington", "widescreen", "widespread", "wilderness", "withdrawal", "yugoslavia"], ["accessories", "accommodate", "accompanied", "accordingly", "achievement", "acknowledge", "acquisition", "adjustments", "advancement", "advertisers", "advertising", "affiliation", "afghanistan", "agriculture", "albuquerque", "alternative", "anniversary", "anticipated", "application", "appointment", "appreciated", "appropriate", "approximate", "arbitration", "arrangement", "assessments", "assignments", "association", "assumptions", "atmospheric", "attachments", "attractions", "authorities", "automobiles", "backgrounds", "battlefield", "beautifully", "bestsellers", "biographies", "calculation", "calculators", "calibration", "celebration", "celebrities", "certificate", "challenging", "cholesterol", "christopher", "circulation", "citizenship", "classifieds", "collectible", "collections", "combination", "comfortable", "commissions", "commitments", "commodities", "communicate", "communities", "comparative", "comparisons", "competition", "competitive", "competitors", "compilation", "complicated", "composition", "compression", "computation", "concentrate", "conclusions", "conditional", "conferences", "configuring", "conjunction", "connecticut", "connections", "consecutive", "consequence", "considering", "consistency", "constitutes", "constraints", "constructed", "consultancy", "consultants", "consumption", "continental", "continually", "contracting", "contractors", "contributed", "contributor", "controllers", "controlling", "controversy", "convenience", "conventions", "convergence", "convertible", "cooperation", "cooperative", "coordinated", "coordinates", "coordinator", "copyrighted", "corporation", "corrections", "correlation", "declaration", "definitions", "demographic", "demonstrate", "departments", "description", "designation", "destination", "destruction", "determining", "deutschland", "development", "differences", "differently", "dimensional", "directories", "disciplines", "disclaimers", "discussions", "disposition", "distinction", "distributed", "distributor", "documentary", "downloading", "educational", "effectively", "efficiently", "electricity", "electronics", "eligibility", "elimination", "encountered", "encouraging", "endorsement", "enforcement", "engineering", "enhancement", "enlargement", "enterprises", "environment", "equilibrium", "essentially", "established", "evaluations", "evanescence", "examination", "exceptional", "exclusively", "exhibitions", "expenditure", "experienced", "experiences", "experiments", "explanation", "exploration", "expressions", "fascinating", "flexibility", "foundations", "frequencies", "functioning", "fundamental", "fundraising", "furnishings", "furthermore", "generations", "governments", "groundwater", "highlighted", "hospitality", "hydrocodone", "identifying", "illustrated", "imagination", "immediately", "immigration", "implemented", "importantly", "improvement", "incorporate", "independent", "individuals", "inexpensive", "information", "informative", "ingredients", "initiatives", "innovations", "inspections", "inspiration", "institution", "instruction", "instructors", "instruments", "integrating", "integration", "intelligent", "interaction", "interactive", "interesting", "interpreted", "interracial", "introducing", "investigate", "investments", "invitations", "involvement", "journalists", "legislation", "legislative", "legislature", "liabilities", "lightweight", "limitations", "magnificent", "maintaining", "maintenance", "malpractice", "manufacture", "marketplace", "mathematics", "measurement", "medications", "memorabilia", "merchandise", "methodology", "minneapolis", "mississippi", "motherboard", "motorcycles", "necessarily", "negotiation", "netherlands", "newsletters", "nominations", "nutritional", "obligations", "observation", "occupations", "operational", "opportunity", "orientation", "outsourcing", "outstanding", "palestinian", "participant", "participate", "partnership", "penetration", "performance", "peripherals", "permissions", "personality", "perspective", "phentermine", "philippines", "photographs", "photography", "playstation", "politicians", "populations", "positioning", "possibility", "potentially", "powerseller", "predictions", "preferences", "preliminary", "preparation", "probability", "proceedings", "procurement", "productions", "programmers", "programming", "progressive", "promotional", "proposition", "proprietary", "prospective", "publication", "recognition", "recommended", "recruitment", "reflections", "refurbished", "regulations", "reliability", "renaissance", "replacement", "replication", "represented", "republicans", "requirement", "researchers", "reservation", "residential", "resolutions", "respiratory", "respondents", "responsible", "restaurants", "restoration", "restriction", "scholarship", "screensaver", "screenshots", "secretariat", "sensitivity", "shakespeare", "significant", "simulations", "smithsonian", "southampton", "specialists", "specialized", "specialties", "spectacular", "sponsorship", "springfield", "statistical", "subdivision", "submissions", "subscribers", "substantial", "suggestions", "supervision", "supervisors", "supplements", "surrounding", "sustainable", "switzerland", "syndication", "telecharger", "televisions", "temperature", "temporarily", "termination", "terminology", "territories", "theoretical", "therapeutic", "threatening", "tournaments", "traditional", "transaction", "transcripts", "transferred", "translation", "transmitted", "transparent", "transsexual", "tripadvisor", "unavailable", "uncertainty", "underground", "unnecessary", "unsubscribe", "utilization", "verzeichnis", "viewpicture", "westminster", "workstation"], ["accompanying", "accomplished", "achievements", "acknowledged", "acquisitions", "additionally", "administered", "agricultural", "alphabetical", "alternatives", "announcement", "anthropology", "applications", "appointments", "appreciation", "architecture", "arrangements", "associations", "availability", "bibliography", "biodiversity", "broadcasting", "calculations", "cancellation", "capabilities", "certificates", "championship", "christianity", "civilization", "collectables", "collectibles", "combinations", "commissioner", "commonwealth", "compensation", "competitions", "conditioning", "conferencing", "confidential", "confirmation", "connectivity", "consequences", "consequently", "conservation", "conservative", "considerable", "consistently", "consolidated", "constitution", "construction", "consultation", "contemporary", "continuously", "contributing", "contribution", "contributors", "conventional", "conversation", "coordination", "corporations", "demonstrated", "demonstrates", "departmental", "descriptions", "destinations", "developments", "dictionaries", "differential", "difficulties", "disabilities", "disappointed", "disciplinary", "distribution", "distributors", "downloadable", "dramatically", "encyclopedia", "enhancements", "entertaining", "entrepreneur", "environments", "establishing", "examinations", "expectations", "expenditures", "experiencing", "experimental", "findarticles", "fundamentals", "geographical", "governmental", "headquarters", "humanitarian", "hypothetical", "illustration", "implementing", "implications", "improvements", "incorporated", "increasingly", "independence", "indianapolis", "individually", "infringement", "installation", "institutions", "instructions", "instrumental", "intellectual", "intelligence", "interactions", "interference", "intermediate", "intersection", "intervention", "introduction", "introductory", "investigated", "investigator", "jacksonville", "jurisdiction", "laboratories", "manufactured", "manufacturer", "masturbating", "masturbation", "mathematical", "measurements", "metropolitan", "modification", "municipality", "negotiations", "neighborhood", "nevertheless", "newfoundland", "notification", "observations", "occasionally", "occupational", "optimization", "organisation", "organization", "participants", "participated", "particularly", "partnerships", "pennsylvania", "performances", "periodically", "personalized", "perspectives", "pharmacology", "philadelphia", "photographer", "photographic", "practitioner", "prerequisite", "prescription", "presentation", "preservation", "presidential", "productivity", "professional", "publications", "quantitative", "recreational", "refrigerator", "registration", "relationship", "representing", "reproduction", "reproductive", "requirements", "reservations", "respectively", "restrictions", "saskatchewan", "satisfaction", "satisfactory", "scholarships", "screensavers", "shareholders", "significance", "specializing", "specifically", "spirituality", "stakeholders", "subcommittee", "subscription", "subsequently", "subsidiaries", "successfully", "sufficiently", "supplemental", "surveillance", "technologies", "techrepublic", "temperatures", "testimonials", "thanksgiving", "transactions", "transexuales", "translations", "transmission", "transparency", "unauthorized", "unemployment", "universities", "verification"], ["accessibility", "accommodation", "accreditation", "administrator", "advertisement", "alternatively", "announcements", "approximately", "architectural", "authorization", "automatically", "bibliographic", "biotechnology", "certification", "championships", "characterized", "circumstances", "collaboration", "collaborative", "commissioners", "communication", "compatibility", "complications", "complimentary", "comprehensive", "computational", "concentration", "configuration", "congressional", "consciousness", "consideration", "consolidation", "contamination", "contributions", "controversial", "conversations", "corresponding", "demonstration", "determination", "developmental", "distinguished", "distributions", "documentation", "effectiveness", "entertainment", "entrepreneurs", "environmental", "establishment", "extraordinary", "functionality", "illustrations", "inappropriate", "independently", "informational", "installations", "institutional", "instructional", "international", "interventions", "investigation", "investigators", "liechtenstein", "manufacturers", "manufacturing", "massachusetts", "mediterranean", "miscellaneous", "modifications", "notifications", "opportunities", "organisations", "organizations", "parliamentary", "participating", "participation", "photographers", "possibilities", "practitioners", "precipitation", "presentations", "professionals", "psychological", "qualification", "questionnaire", "relationships", "restructuring", "revolutionary", "semiconductor", "significantly", "sophisticated", "specification", "starsmerchant", "strengthening", "subscriptions", "substantially", "technological", "transcription", "undergraduate", "understanding", "unfortunately", "vulnerability"], ["accommodations", "accountability", "administration", "administrative", "administrators", "advertisements", "appropriations", "authentication", "cardiovascular", "characteristic", "classification", "communications", "concentrations", "configurations", "considerations", "constitutional", "correspondence", "discrimination", "identification", "implementation", "infrastructure", "interpretation", "investigations", "knowledgestorm", "organizational", "pharmaceutical", "qualifications", "recommendation", "reconstruction", "rehabilitation", "representation", "representative", "responsibility", "simultaneously", "specifications", "superintendent", "sustainability", "transformation", "transportation"], ["characteristics", "confidentiality", "congratulations", "instrumentation", "internationally", "pharmaceuticals", "recommendations", "representations", "representatives", "troubleshooting"], ["characterization", "responsibilities"]];
});
define("game/data/RAW-WORDS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.raw = ["the", "of", "and", "to", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page", "my", "has", "search", "free", "but", "our", "one", "other", "do", "no", "information", "time", "they", "site", "he", "up", "may", "what", "which", "their", "news", "out", "use", "any", "there", "see", "only", "so", "his", "when", "contact", "here", "business", "who", "web", "also", "now", "help", "get", "pm", "view", "online", "c", "e", "first", "am", "been", "would", "how", "were", "me", "s", "services", "some", "these", "click", "its", "like", "service", "x", "than", "find", "price", "date", "back", "top", "people", "had", "list", "name", "just", "over", "state", "year", "day", "into", "email", "two", "health", "n", "world", "re", "next", "used", "go", "b", "work", "last", "most", "products", "music", "buy", "data", "make", "them", "should", "product", "system", "post", "her", "city", "t", "add", "policy", "number", "such", "please", "available", "copyright", "support", "message", "after", "best", "software", "then", "jan", "good", "video", "well", "d", "where", "info", "rights", "public", "books", "high", "school", "through", "m", "each", "links", "she", "review", "years", "order", "very", "privacy", "book", "items", "company", "r", "read", "group", "need", "many", "user", "said", "de", "does", "set", "under", "general", "research", "university", "january", "mail", "full", "map", "reviews", "program", "life", "know", "games", "way", "days", "management", "p", "part", "could", "great", "united", "hotel", "real", "f", "item", "international", "center", "ebay", "must", "store", "travel", "comments", "made", "development", "report", "off", "member", "details", "line", "terms", "before", "hotels", "did", "send", "right", "type", "because", "local", "those", "using", "results", "office", "education", "national", "car", "design", "take", "posted", "internet", "address", "community", "within", "states", "area", "want", "phone", "dvd", "shipping", "reserved", "subject", "between", "forum", "family", "l", "long", "based", "w", "code", "show", "o", "even", "black", "check", "special", "prices", "website", "index", "being", "women", "much", "sign", "file", "link", "open", "today", "technology", "south", "case", "project", "same", "pages", "uk", "version", "section", "own", "found", "sports", "house", "related", "security", "both", "g", "county", "american", "photo", "game", "members", "power", "while", "care", "network", "down", "computer", "systems", "three", "total", "place", "end", "following", "download", "h", "him", "without", "per", "access", "think", "north", "resources", "current", "posts", "big", "media", "law", "control", "water", "history", "pictures", "size", "art", "personal", "since", "including", "guide", "shop", "directory", "board", "location", "change", "white", "text", "small", "rating", "rate", "government", "children", "during", "usa", "return", "students", "v", "shopping", "account", "times", "sites", "level", "digital", "profile", "previous", "form", "events", "love", "old", "john", "main", "call", "hours", "image", "department", "title", "description", "non", "k", "y", "insurance", "another", "why", "shall", "property", "class", "cd", "still", "money", "quality", "every", "listing", "content", "country", "private", "little", "visit", "save", "tools", "low", "reply", "customer", "december", "compare", "movies", "include", "college", "value", "article", "york", "man", "card", "jobs", "provide", "j", "food", "source", "author", "different", "press", "u", "learn", "sale", "around", "print", "course", "job", "canada", "process", "teen", "room", "stock", "training", "too", "credit", "point", "join", "science", "men", "categories", "advanced", "west", "sales", "look", "english", "left", "team", "estate", "box", "conditions", "select", "windows", "photos", "gay", "thread", "week", "category", "note", "live", "large", "gallery", "table", "register", "however", "june", "october", "november", "market", "library", "really", "action", "start", "series", "model", "features", "air", "industry", "plan", "human", "provided", "tv", "yes", "required", "second", "hot", "accessories", "cost", "movie", "forums", "march", "la", "september", "better", "say", "questions", "july", "yahoo", "going", "medical", "test", "friend", "come", "dec", "server", "pc", "study", "application", "cart", "staff", "articles", "san", "feedback", "again", "play", "looking", "issues", "april", "never", "users", "complete", "street", "topic", "comment", "financial", "things", "working", "against", "standard", "tax", "person", "below", "mobile", "less", "got", "blog", "party", "payment", "equipment", "login", "student", "let", "programs", "offers", "legal", "above", "recent", "park", "stores", "side", "act", "problem", "red", "give", "memory", "performance", "social", "q", "august", "quote", "language", "story", "sell", "options", "experience", "rates", "create", "key", "body", "young", "america", "important", "field", "few", "east", "paper", "single", "ii", "age", "activities", "club", "example", "girls", "additional", "password", "z", "latest", "something", "road", "gift", "question", "changes", "night", "ca", "hard", "texas", "oct", "pay", "four", "poker", "status", "browse", "issue", "range", "building", "seller", "court", "february", "always", "result", "audio", "light", "write", "war", "nov", "offer", "blue", "groups", "al", "easy", "given", "files", "event", "release", "analysis", "request", "fax", "china", "making", "picture", "needs", "possible", "might", "professional", "yet", "month", "major", "star", "areas", "future", "space", "committee", "hand", "sun", "cards", "problems", "london", "washington", "meeting", "rss", "become", "interest", "id", "child", "keep", "enter", "california", "share", "similar", "garden", "schools", "million", "added", "reference", "companies", "listed", "baby", "learning", "energy", "run", "delivery", "net", "popular", "term", "film", "stories", "put", "computers", "journal", "reports", "co", "try", "welcome", "central", "images", "president", "notice", "original", "head", "radio", "until", "cell", "color", "self", "council", "away", "includes", "track", "australia", "discussion", "archive", "once", "others", "entertainment", "agreement", "format", "least", "society", "months", "log", "safety", "friends", "sure", "faq", "trade", "edition", "cars", "messages", "marketing", "tell", "further", "updated", "association", "able", "having", "provides", "david", "fun", "already", "green", "studies", "close", "common", "drive", "specific", "several", "gold", "feb", "living", "sep", "collection", "called", "short", "arts", "lot", "ask", "display", "limited", "powered", "solutions", "means", "director", "daily", "beach", "past", "natural", "whether", "due", "et", "electronics", "five", "upon", "period", "planning", "database", "says", "official", "weather", "mar", "land", "average", "done", "technical", "window", "france", "pro", "region", "island", "record", "direct", "microsoft", "conference", "environment", "records", "st", "district", "calendar", "costs", "style", "url", "front", "statement", "update", "parts", "aug", "ever", "downloads", "early", "miles", "sound", "resource", "present", "applications", "either", "ago", "document", "word", "works", "material", "bill", "apr", "written", "talk", "federal", "hosting", "rules", "final", "adult", "tickets", "thing", "centre", "requirements", "via", "cheap", "kids", "finance", "true", "minutes", "else", "mark", "third", "rock", "gifts", "europe", "reading", "topics", "bad", "individual", "tips", "plus", "auto", "cover", "usually", "edit", "together", "videos", "percent", "fast", "function", "fact", "unit", "getting", "global", "tech", "meet", "far", "economic", "en", "player", "projects", "lyrics", "often", "subscribe", "submit", "germany", "amount", "watch", "included", "feel", "though", "bank", "risk", "thanks", "everything", "deals", "various", "words", "linux", "jul", "production", "commercial", "james", "weight", "town", "heart", "advertising", "received", "choose", "treatment", "newsletter", "archives", "points", "knowledge", "magazine", "error", "camera", "jun", "girl", "currently", "construction", "toys", "registered", "clear", "golf", "receive", "domain", "methods", "chapter", "makes", "protection", "policies", "loan", "wide", "beauty", "manager", "india", "position", "taken", "sort", "listings", "models", "michael", "known", "half", "cases", "step", "engineering", "florida", "simple", "quick", "none", "wireless", "license", "paul", "friday", "lake", "whole", "annual", "published", "later", "basic", "sony", "shows", "corporate", "google", "church", "method", "purchase", "customers", "active", "response", "practice", "hardware", "figure", "materials", "fire", "holiday", "chat", "enough", "designed", "along", "among", "death", "writing", "speed", "html", "countries", "loss", "face", "brand", "discount", "higher", "effects", "created", "remember", "standards", "oil", "bit", "yellow", "political", "increase", "advertise", "kingdom", "base", "near", "environmental", "thought", "stuff", "french", "storage", "oh", "japan", "doing", "loans", "shoes", "entry", "stay", "nature", "orders", "availability", "africa", "summary", "turn", "mean", "growth", "notes", "agency", "king", "monday", "european", "activity", "copy", "although", "drug", "pics", "western", "income", "force", "cash", "employment", "overall", "bay", "river", "commission", "ad", "package", "contents", "seen", "players", "engine", "port", "album", "regional", "stop", "supplies", "started", "administration", "bar", "institute", "views", "plans", "double", "dog", "build", "screen", "exchange", "types", "soon", "sponsored", "lines", "electronic", "continue", "across", "benefits", "needed", "season", "apply", "someone", "held", "ny", "anything", "printer", "condition", "effective", "believe", "organization", "effect", "asked", "eur", "mind", "sunday", "selection", "casino", "pdf", "lost", "tour", "menu", "volume", "cross", "anyone", "mortgage", "hope", "silver", "corporation", "wish", "inside", "solution", "mature", "role", "rather", "weeks", "addition", "came", "supply", "nothing", "certain", "usr", "executive", "running", "lower", "necessary", "union", "jewelry", "according", "dc", "clothing", "mon", "com", "particular", "fine", "names", "robert", "homepage", "hour", "gas", "skills", "six", "bush", "islands", "advice", "career", "military", "rental", "decision", "leave", "british", "teens", "pre", "huge", "sat", "woman", "facilities", "zip", "bid", "kind", "sellers", "middle", "move", "cable", "opportunities", "taking", "values", "division", "coming", "tuesday", "object", "lesbian", "appropriate", "machine", "logo", "length", "actually", "nice", "score", "statistics", "client", "ok", "returns", "capital", "follow", "sample", "investment", "sent", "shown", "saturday", "christmas", "england", "culture", "band", "flash", "ms", "lead", "george", "choice", "went", "starting", "registration", "fri", "thursday", "courses", "consumer", "hi", "airport", "foreign", "artist", "outside", "furniture", "levels", "channel", "letter", "mode", "phones", "ideas", "wednesday", "structure", "fund", "summer", "allow", "degree", "contract", "button", "releases", "wed", "homes", "super", "male", "matter", "custom", "virginia", "almost", "took", "located", "multiple", "asian", "distribution", "editor", "inn", "industrial", "cause", "potential", "song", "cnet", "ltd", "los", "hp", "focus", "late", "fall", "featured", "idea", "rooms", "female", "responsible", "inc", "communications", "win", "associated", "thomas", "primary", "cancer", "numbers", "reason", "tool", "browser", "spring", "foundation", "answer", "voice", "eg", "friendly", "schedule", "documents", "communication", "purpose", "feature", "bed", "comes", "police", "everyone", "independent", "ip", "approach", "cameras", "brown", "physical", "operating", "hill", "maps", "medicine", "deal", "hold", "ratings", "chicago", "forms", "glass", "happy", "tue", "smith", "wanted", "developed", "thank", "safe", "unique", "survey", "prior", "telephone", "sport", "ready", "feed", "animal", "sources", "mexico", "population", "pa", "regular", "secure", "navigation", "operations", "therefore", "simply", "evidence", "station", "christian", "round", "paypal", "favorite", "understand", "option", "master", "valley", "recently", "probably", "thu", "rentals", "sea", "built", "publications", "blood", "cut", "worldwide", "improve", "connection", "publisher", "hall", "larger", "anti", "networks", "earth", "parents", "nokia", "impact", "transfer", "introduction", "kitchen", "strong", "tel", "carolina", "wedding", "properties", "hospital", "ground", "overview", "ship", "accommodation", "owners", "disease", "tx", "excellent", "paid", "italy", "perfect", "hair", "opportunity", "kit", "classic", "basis", "command", "cities", "william", "express", "award", "distance", "tree", "peter", "assessment", "ensure", "thus", "wall", "ie", "involved", "el", "extra", "especially", "interface", "partners", "budget", "rated", "guides", "success", "maximum", "ma", "operation", "existing", "quite", "selected", "boy", "amazon", "patients", "restaurants", "beautiful", "warning", "wine", "locations", "horse", "vote", "forward", "flowers", "stars", "significant", "lists", "technologies", "owner", "retail", "animals", "useful", "directly", "manufacturer", "ways", "est", "son", "providing", "rule", "mac", "housing", "takes", "iii", "gmt", "bring", "catalog", "searches", "max", "trying", "mother", "authority", "considered", "told", "xml", "traffic", "programme", "joined", "input", "strategy", "feet", "agent", "valid", "bin", "modern", "senior", "ireland", "teaching", "door", "grand", "testing", "trial", "charge", "units", "instead", "canadian", "cool", "normal", "wrote", "enterprise", "ships", "entire", "educational", "md", "leading", "metal", "positive", "fl", "fitness", "chinese", "opinion", "mb", "asia", "football", "abstract", "uses", "output", "funds", "mr", "greater", "likely", "develop", "employees", "artists", "alternative", "processing", "responsibility", "resolution", "java", "guest", "seems", "publication", "pass", "relations", "trust", "van", "contains", "session", "multi", "photography", "republic", "fees", "components", "vacation", "century", "academic", "assistance", "completed", "skin", "graphics", "indian", "prev", "ads", "mary", "il", "expected", "ring", "grade", "dating", "pacific", "mountain", "organizations", "pop", "filter", "mailing", "vehicle", "longer", "consider", "int", "northern", "behind", "panel", "floor", "german", "buying", "match", "proposed", "default", "require", "iraq", "boys", "outdoor", "deep", "morning", "otherwise", "allows", "rest", "protein", "plant", "reported", "hit", "transportation", "mm", "pool", "mini", "politics", "partner", "disclaimer", "authors", "boards", "faculty", "parties", "fish", "membership", "mission", "eye", "string", "sense", "modified", "pack", "released", "stage", "internal", "goods", "recommended", "born", "unless", "richard", "detailed", "japanese", "race", "approved", "background", "target", "except", "character", "usb", "maintenance", "ability", "maybe", "functions", "ed", "moving", "brands", "places", "php", "pretty", "trademarks", "phentermine", "spain", "southern", "yourself", "etc", "winter", "battery", "youth", "pressure", "submitted", "boston", "debt", "keywords", "medium", "television", "interested", "core", "break", "purposes", "throughout", "sets", "dance", "wood", "msn", "itself", "defined", "papers", "playing", "awards", "fee", "studio", "reader", "virtual", "device", "established", "answers", "rent", "las", "remote", "dark", "programming", "external", "apple", "le", "regarding", "instructions", "min", "offered", "theory", "enjoy", "remove", "aid", "surface", "minimum", "visual", "host", "variety", "teachers", "isbn", "martin", "manual", "block", "subjects", "agents", "increased", "repair", "fair", "civil", "steel", "understanding", "songs", "fixed", "wrong", "beginning", "hands", "associates", "finally", "az", "updates", "desktop", "classes", "paris", "ohio", "gets", "sector", "capacity", "requires", "jersey", "un", "fat", "fully", "father", "electric", "saw", "instruments", "quotes", "officer", "driver", "businesses", "dead", "respect", "unknown", "specified", "restaurant", "mike", "trip", "pst", "worth", "mi", "procedures", "poor", "teacher", "eyes", "relationship", "workers", "farm", "georgia", "peace", "traditional", "campus", "tom", "showing", "creative", "coast", "benefit", "progress", "funding", "devices", "lord", "grant", "sub", "agree", "fiction", "hear", "sometimes", "watches", "careers", "beyond", "goes", "families", "led", "museum", "themselves", "fan", "transport", "interesting", "blogs", "wife", "evaluation", "accepted", "former", "implementation", "ten", "hits", "zone", "complex", "th", "cat", "galleries", "references", "die", "presented", "jack", "flat", "flow", "agencies", "literature", "respective", "parent", "spanish", "michigan", "columbia", "setting", "dr", "scale", "stand", "economy", "highest", "helpful", "monthly", "critical", "frame", "musical", "definition", "secretary", "angeles", "networking", "path", "australian", "employee", "chief", "gives", "kb", "bottom", "magazines", "packages", "detail", "francisco", "laws", "changed", "pet", "heard", "begin", "individuals", "colorado", "royal", "clean", "switch", "russian", "largest", "african", "guy", "titles", "relevant", "guidelines", "justice", "connect", "bible", "dev", "cup", "basket", "applied", "weekly", "vol", "installation", "described", "demand", "pp", "suite", "vegas", "na", "square", "chris", "attention", "advance", "skip", "diet", "army", "auction", "gear", "lee", "os", "difference", "allowed", "correct", "charles", "nation", "selling", "lots", "piece", "sheet", "firm", "seven", "older", "illinois", "regulations", "elements", "species", "jump", "cells", "module", "resort", "facility", "random", "pricing", "dvds", "certificate", "minister", "motion", "looks", "fashion", "directions", "visitors", "documentation", "monitor", "trading", "forest", "calls", "whose", "coverage", "couple", "giving", "chance", "vision", "ball", "ending", "clients", "actions", "listen", "discuss", "accept", "automotive", "naked", "goal", "successful", "sold", "wind", "communities", "clinical", "situation", "sciences", "markets", "lowest", "highly", "publishing", "appear", "emergency", "developing", "lives", "currency", "leather", "determine", "temperature", "palm", "announcements", "patient", "actual", "historical", "stone", "bob", "commerce", "ringtones", "perhaps", "persons", "difficult", "scientific", "satellite", "fit", "tests", "village", "accounts", "amateur", "ex", "met", "pain", "xbox", "particularly", "factors", "coffee", "www", "settings", "buyer", "cultural", "steve", "easily", "oral", "ford", "poster", "edge", "functional", "root", "au", "fi", "closed", "holidays", "ice", "pink", "zealand", "balance", "monitoring", "graduate", "replies", "shot", "nc", "architecture", "initial", "label", "thinking", "scott", "llc", "sec", "recommend", "canon", "league", "waste", "minute", "bus", "provider", "optional", "dictionary", "cold", "accounting", "manufacturing", "sections", "chair", "fishing", "effort", "phase", "fields", "bag", "fantasy", "po", "letters", "motor", "va", "professor", "context", "install", "shirt", "apparel", "generally", "continued", "foot", "mass", "crime", "count", "breast", "techniques", "ibm", "rd", "johnson", "sc", "quickly", "dollars", "websites", "religion", "claim", "driving", "permission", "surgery", "patch", "heat", "wild", "measures", "generation", "kansas", "miss", "chemical", "doctor", "task", "reduce", "brought", "himself", "nor", "component", "enable", "exercise", "bug", "santa", "mid", "guarantee", "leader", "diamond", "israel", "se", "processes", "soft", "servers", "alone", "meetings", "seconds", "jones", "arizona", "keyword", "interests", "flight", "congress", "fuel", "username", "walk", "produced", "italian", "paperback", "classifieds", "wait", "supported", "pocket", "saint", "rose", "freedom", "argument", "competition", "creating", "jim", "drugs", "joint", "premium", "providers", "fresh", "characters", "attorney", "upgrade", "di", "factor", "growing", "thousands", "km", "stream", "apartments", "pick", "hearing", "eastern", "auctions", "therapy", "entries", "dates", "generated", "signed", "upper", "administrative", "serious", "prime", "samsung", "limit", "began", "louis", "steps", "errors", "shops", "del", "efforts", "informed", "ga", "ac", "thoughts", "creek", "ft", "worked", "quantity", "urban", "practices", "sorted", "reporting", "essential", "myself", "tours", "platform", "load", "affiliate", "labor", "immediately", "admin", "nursing", "defense", "machines", "designated", "tags", "heavy", "covered", "recovery", "joe", "guys", "integrated", "configuration", "merchant", "comprehensive", "expert", "universal", "protect", "drop", "solid", "cds", "presentation", "languages", "became", "orange", "compliance", "vehicles", "prevent", "theme", "rich", "im", "campaign", "marine", "improvement", "vs", "guitar", "finding", "pennsylvania", "examples", "ipod", "saying", "spirit", "ar", "claims", "challenge", "motorola", "acceptance", "strategies", "mo", "seem", "affairs", "touch", "intended", "towards", "sa", "goals", "hire", "election", "suggest", "branch", "charges", "serve", "affiliates", "reasons", "magic", "mount", "smart", "talking", "gave", "ones", "latin", "multimedia", "xp", "avoid", "certified", "manage", "corner", "rank", "computing", "oregon", "element", "birth", "virus", "abuse", "interactive", "requests", "separate", "quarter", "procedure", "leadership", "tables", "define", "racing", "religious", "facts", "breakfast", "kong", "column", "plants", "faith", "chain", "developer", "identify", "avenue", "missing", "died", "approximately", "domestic", "sitemap", "recommendations", "moved", "houston", "reach", "comparison", "mental", "viewed", "moment", "extended", "sequence", "inch", "attack", "sorry", "centers", "opening", "damage", "lab", "reserve", "recipes", "cvs", "gamma", "plastic", "produce", "snow", "placed", "truth", "counter", "failure", "follows", "eu", "weekend", "dollar", "camp", "ontario", "automatically", "des", "minnesota", "films", "bridge", "native", "fill", "williams", "movement", "printing", "baseball", "owned", "approval", "draft", "chart", "played", "contacts", "cc", "jesus", "readers", "clubs", "lcd", "wa", "jackson", "equal", "adventure", "matching", "offering", "shirts", "profit", "leaders", "posters", "institutions", "assistant", "variable", "ave", "dj", "advertisement", "expect", "parking", "headlines", "yesterday", "compared", "determined", "wholesale", "workshop", "russia", "gone", "codes", "kinds", "extension", "seattle", "statements", "golden", "completely", "teams", "fort", "cm", "wi", "lighting", "senate", "forces", "funny", "brother", "gene", "turned", "portable", "tried", "electrical", "applicable", "disc", "returned", "pattern", "ct", "boat", "named", "theatre", "laser", "earlier", "manufacturers", "sponsor", "classical", "icon", "warranty", "dedicated", "indiana", "direction", "harry", "basketball", "objects", "ends", "delete", "evening", "assembly", "nuclear", "taxes", "mouse", "signal", "criminal", "issued", "brain", "sexual", "wisconsin", "powerful", "dream", "obtained", "false", "da", "cast", "flower", "felt", "personnel", "passed", "supplied", "identified", "falls", "pic", "soul", "aids", "opinions", "promote", "stated", "stats", "hawaii", "professionals", "appears", "carry", "flag", "decided", "nj", "covers", "hr", "em", "advantage", "hello", "designs", "maintain", "tourism", "priority", "newsletters", "adults", "clips", "savings", "iv", "graphic", "atom", "payments", "rw", "estimated", "binding", "brief", "ended", "winning", "eight", "anonymous", "iron", "straight", "script", "served", "wants", "miscellaneous", "prepared", "void", "dining", "alert", "integration", "atlanta", "dakota", "tag", "interview", "mix", "framework", "disk", "installed", "queen", "vhs", "credits", "clearly", "fix", "handle", "sweet", "desk", "criteria", "pubmed", "dave", "massachusetts", "diego", "hong", "vice", "associate", "ne", "truck", "behavior", "enlarge", "ray", "frequently", "revenue", "measure", "changing", "votes", "du", "duty", "looked", "discussions", "bear", "gain", "festival", "laboratory", "ocean", "flights", "experts", "signs", "lack", "depth", "iowa", "whatever", "logged", "laptop", "vintage", "train", "exactly", "dry", "explore", "maryland", "spa", "concept", "nearly", "eligible", "checkout", "reality", "forgot", "handling", "origin", "knew", "gaming", "feeds", "billion", "destination", "scotland", "faster", "intelligence", "dallas", "bought", "con", "ups", "nations", "route", "followed", "specifications", "broken", "tripadvisor", "frank", "alaska", "zoom", "blow", "battle", "residential", "anime", "speak", "decisions", "industries", "protocol", "query", "clip", "partnership", "editorial", "nt", "expression", "es", "equity", "provisions", "speech", "wire", "principles", "suggestions", "rural", "shared", "sounds", "replacement", "tape", "strategic", "judge", "spam", "economics", "acid", "bytes", "cent", "forced", "compatible", "fight", "apartment", "height", "null", "zero", "speaker", "filed", "gb", "netherlands", "obtain", "bc", "consulting", "recreation", "offices", "designer", "remain", "managed", "pr", "failed", "marriage", "roll", "korea", "banks", "fr", "participants", "secret", "bath", "aa", "kelly", "leads", "negative", "austin", "favorites", "toronto", "theater", "springs", "missouri", "andrew", "var", "perform", "healthy", "translation", "estimates", "font", "assets", "injury", "mt", "joseph", "ministry", "drivers", "lawyer", "figures", "married", "protected", "proposal", "sharing", "philadelphia", "portal", "waiting", "birthday", "beta", "fail", "gratis", "banking", "officials", "brian", "toward", "won", "slightly", "assist", "conduct", "contained", "lingerie", "legislation", "calling", "parameters", "jazz", "serving", "bags", "profiles", "miami", "comics", "matters", "houses", "doc", "postal", "relationships", "tennessee", "wear", "controls", "breaking", "combined", "ultimate", "wales", "representative", "frequency", "introduced", "minor", "finish", "departments", "residents", "noted", "displayed", "mom", "reduced", "physics", "rare", "spent", "performed", "extreme", "samples", "davis", "daniel", "bars", "reviewed", "row", "oz", "forecast", "removed", "helps", "singles", "administrator", "cycle", "amounts", "contain", "accuracy", "dual", "rise", "usd", "sleep", "mg", "bird", "pharmacy", "brazil", "creation", "static", "scene", "hunter", "addresses", "lady", "crystal", "famous", "writer", "chairman", "violence", "fans", "oklahoma", "speakers", "drink", "academy", "dynamic", "gender", "eat", "permanent", "agriculture", "dell", "cleaning", "constitutes", "portfolio", "practical", "delivered", "collectibles", "infrastructure", "exclusive", "seat", "concerns", "colour", "vendor", "originally", "intel", "utilities", "philosophy", "regulation", "officers", "reduction", "aim", "bids", "referred", "supports", "nutrition", "recording", "regions", "junior", "toll", "les", "cape", "ann", "rings", "meaning", "tip", "secondary", "wonderful", "mine", "ladies", "henry", "ticket", "announced", "guess", "agreed", "prevention", "whom", "ski", "soccer", "math", "import", "posting", "presence", "instant", "mentioned", "automatic", "healthcare", "viewing", "maintained", "ch", "increasing", "majority", "connected", "christ", "dan", "dogs", "sd", "directors", "aspects", "austria", "ahead", "moon", "participation", "scheme", "utility", "preview", "fly", "manner", "matrix", "containing", "combination", "devel", "amendment", "despite", "strength", "guaranteed", "turkey", "libraries", "proper", "distributed", "degrees", "singapore", "enterprises", "delta", "fear", "seeking", "inches", "phoenix", "rs", "convention", "shares", "principal", "daughter", "standing", "comfort", "colors", "wars", "cisco", "ordering", "kept", "alpha", "appeal", "cruise", "bonus", "certification", "previously", "hey", "bookmark", "buildings", "specials", "beat", "disney", "household", "batteries", "adobe", "smoking", "bbc", "becomes", "drives", "arms", "alabama", "tea", "improved", "trees", "avg", "achieve", "positions", "dress", "subscription", "dealer", "contemporary", "sky", "utah", "nearby", "rom", "carried", "happen", "exposure", "panasonic", "hide", "permalink", "signature", "gambling", "refer", "miller", "provision", "outdoors", "clothes", "caused", "luxury", "babes", "frames", "certainly", "indeed", "newspaper", "toy", "circuit", "layer", "printed", "slow", "removal", "easier", "src", "liability", "trademark", "hip", "printers", "faqs", "nine", "adding", "kentucky", "mostly", "eric", "spot", "taylor", "trackback", "prints", "spend", "factory", "interior", "revised", "grow", "americans", "optical", "promotion", "relative", "amazing", "clock", "dot", "hiv", "identity", "suites", "conversion", "feeling", "hidden", "reasonable", "victoria", "serial", "relief", "revision", "broadband", "influence", "ratio", "pda", "importance", "rain", "onto", "dsl", "planet", "webmaster", "copies", "recipe", "zum", "permit", "seeing", "proof", "dna", "diff", "tennis", "bass", "prescription", "bedroom", "empty", "instance", "hole", "pets", "ride", "licensed", "orlando", "specifically", "tim", "bureau", "maine", "sql", "represent", "conservation", "pair", "ideal", "specs", "recorded", "don", "pieces", "finished", "parks", "dinner", "lawyers", "sydney", "stress", "cream", "ss", "runs", "trends", "yeah", "discover", "ap", "patterns", "boxes", "louisiana", "hills", "javascript", "fourth", "nm", "advisor", "mn", "marketplace", "nd", "evil", "aware", "wilson", "shape", "evolution", "irish", "certificates", "objectives", "stations", "suggested", "gps", "op", "remains", "acc", "greatest", "firms", "concerned", "euro", "operator", "structures", "generic", "encyclopedia", "usage", "cap", "ink", "charts", "continuing", "mixed", "census", "interracial", "peak", "tn", "competitive", "exist", "wheel", "transit", "suppliers", "salt", "compact", "poetry", "lights", "tracking", "angel", "bell", "keeping", "preparation", "attempt", "receiving", "matches", "accordance", "width", "noise", "engines", "forget", "array", "discussed", "accurate", "stephen", "elizabeth", "climate", "reservations", "pin", "playstation", "alcohol", "greek", "instruction", "managing", "annotation", "sister", "raw", "differences", "walking", "explain", "smaller", "newest", "establish", "gnu", "happened", "expressed", "jeff", "extent", "sharp", "lesbians", "ben", "lane", "paragraph", "kill", "mathematics", "aol", "compensation", "ce", "export", "managers", "aircraft", "modules", "sweden", "conflict", "conducted", "versions", "employer", "occur", "percentage", "knows", "mississippi", "describe", "concern", "backup", "requested", "citizens", "connecticut", "heritage", "personals", "immediate", "holding", "trouble", "spread", "coach", "kevin", "agricultural", "expand", "supporting", "audience", "assigned", "jordan", "collections", "ages", "participate", "plug", "specialist", "cook", "affect", "virgin", "experienced", "investigation", "raised", "hat", "institution", "directed", "dealers", "searching", "sporting", "helping", "perl", "affected", "lib", "bike", "totally", "plate", "expenses", "indicate", "blonde", "ab", "proceedings", "favourite", "transmission", "anderson", "utc", "characteristics", "der", "lose", "organic", "seek", "experiences", "albums", "cheats", "extremely", "verzeichnis", "contracts", "guests", "hosted", "diseases", "concerning", "developers", "equivalent", "chemistry", "tony", "neighborhood", "nevada", "kits", "thailand", "variables", "agenda", "anyway", "continues", "tracks", "advisory", "cam", "curriculum", "logic", "template", "prince", "circle", "soil", "grants", "anywhere", "psychology", "responses", "atlantic", "wet", "circumstances", "edward", "investor", "identification", "ram", "leaving", "wildlife", "appliances", "matt", "elementary", "cooking", "speaking", "sponsors", "fox", "unlimited", "respond", "sizes", "plain", "exit", "entered", "iran", "arm", "keys", "launch", "wave", "checking", "costa", "belgium", "printable", "holy", "acts", "guidance", "mesh", "trail", "enforcement", "symbol", "crafts", "highway", "buddy", "hardcover", "observed", "dean", "setup", "poll", "booking", "glossary", "fiscal", "celebrity", "styles", "denver", "unix", "filled", "bond", "channels", "ericsson", "appendix", "notify", "blues", "chocolate", "pub", "portion", "scope", "hampshire", "supplier", "cables", "cotton", "bluetooth", "controlled", "requirement", "authorities", "biology", "dental", "killed", "border", "ancient", "debate", "representatives", "starts", "pregnancy", "causes", "arkansas", "biography", "leisure", "attractions", "learned", "transactions", "notebook", "explorer", "historic", "attached", "opened", "tm", "husband", "disabled", "authorized", "crazy", "upcoming", "britain", "concert", "retirement", "scores", "financing", "efficiency", "sp", "comedy", "adopted", "efficient", "weblog", "linear", "commitment", "specialty", "bears", "jean", "hop", "carrier", "edited", "constant", "visa", "mouth", "jewish", "meter", "linked", "portland", "interviews", "concepts", "nh", "gun", "reflect", "pure", "deliver", "wonder", "lessons", "fruit", "begins", "qualified", "reform", "lens", "alerts", "treated", "discovery", "draw", "mysql", "classified", "relating", "assume", "confidence", "alliance", "fm", "confirm", "warm", "neither", "lewis", "howard", "offline", "leaves", "engineer", "lifestyle", "consistent", "replace", "clearance", "connections", "inventory", "converter", "organisation", "babe", "checks", "reached", "becoming", "safari", "objective", "indicated", "sugar", "crew", "legs", "sam", "stick", "securities", "allen", "pdt", "relation", "enabled", "genre", "slide", "montana", "volunteer", "tested", "rear", "democratic", "enhance", "switzerland", "exact", "bound", "parameter", "adapter", "processor", "node", "formal", "dimensions", "contribute", "lock", "hockey", "storm", "micro", "colleges", "laptops", "mile", "showed", "challenges", "editors", "mens", "threads", "bowl", "supreme", "brothers", "recognition", "presents", "ref", "tank", "submission", "dolls", "estimate", "encourage", "navy", "kid", "regulatory", "inspection", "consumers", "cancel", "limits", "territory", "transaction", "manchester", "weapons", "paint", "delay", "pilot", "outlet", "contributions", "continuous", "db", "czech", "resulting", "cambridge", "initiative", "novel", "pan", "execution", "disability", "increases", "ultra", "winner", "idaho", "contractor", "ph", "episode", "examination", "potter", "dish", "plays", "bulletin", "ia", "pt", "indicates", "modify", "oxford", "adam", "truly", "epinions", "painting", "committed", "extensive", "affordable", "universe", "candidate", "databases", "patent", "slot", "psp", "outstanding", "ha", "eating", "perspective", "planned", "watching", "lodge", "messenger", "mirror", "tournament", "consideration", "ds", "discounts", "sterling", "sessions", "kernel", "stocks", "buyers", "journals", "gray", "catalogue", "ea", "jennifer", "antonio", "charged", "broad", "taiwan", "und", "chosen", "demo", "greece", "lg", "swiss", "sarah", "clark", "labour", "hate", "terminal", "publishers", "nights", "behalf", "caribbean", "liquid", "rice", "nebraska", "loop", "salary", "reservation", "foods", "gourmet", "guard", "properly", "orleans", "saving", "nfl", "remaining", "empire", "resume", "twenty", "newly", "raise", "prepare", "avatar", "gary", "depending", "illegal", "expansion", "vary", "hundreds", "rome", "arab", "lincoln", "helped", "premier", "tomorrow", "purchased", "milk", "decide", "consent", "drama", "visiting", "performing", "downtown", "keyboard", "contest", "collected", "nw", "bands", "boot", "suitable", "ff", "absolutely", "millions", "lunch", "audit", "push", "chamber", "guinea", "findings", "muscle", "featuring", "iso", "implement", "clicking", "scheduled", "polls", "typical", "tower", "yours", "sum", "misc", "calculator", "significantly", "chicken", "temporary", "attend", "shower", "alan", "sending", "jason", "tonight", "dear", "sufficient", "holdem", "shell", "province", "catholic", "oak", "vat", "awareness", "vancouver", "governor", "beer", "seemed", "contribution", "measurement", "swimming", "spyware", "formula", "constitution", "packaging", "solar", "jose", "catch", "jane", "pakistan", "ps", "reliable", "consultation", "northwest", "sir", "doubt", "earn", "finder", "unable", "periods", "classroom", "tasks", "democracy", "attacks", "kim", "wallpaper", "merchandise", "const", "resistance", "doors", "symptoms", "resorts", "biggest", "memorial", "visitor", "twin", "forth", "insert", "baltimore", "gateway", "ky", "dont", "alumni", "drawing", "candidates", "charlotte", "ordered", "biological", "fighting", "transition", "happens", "preferences", "spy", "romance", "instrument", "bruce", "split", "themes", "powers", "heaven", "br", "bits", "pregnant", "twice", "classification", "focused", "egypt", "physician", "hollywood", "bargain", "wikipedia", "cellular", "norway", "vermont", "asking", "blocks", "normally", "lo", "spiritual", "hunting", "diabetes", "suit", "ml", "shift", "chip", "res", "sit", "bodies", "photographs", "cutting", "wow", "simon", "writers", "marks", "flexible", "loved", "favourites", "mapping", "numerous", "relatively", "birds", "satisfaction", "represents", "char", "indexed", "pittsburgh", "superior", "preferred", "saved", "paying", "cartoon", "shots", "intellectual", "moore", "granted", "choices", "carbon", "spending", "comfortable", "magnetic", "interaction", "listening", "effectively", "registry", "crisis", "outlook", "massive", "denmark", "employed", "bright", "treat", "header", "cs", "poverty", "formed", "piano", "echo", "que", "grid", "sheets", "patrick", "experimental", "puerto", "revolution", "consolidation", "displays", "plasma", "allowing", "earnings", "voip", "mystery", "landscape", "dependent", "mechanical", "journey", "delaware", "bidding", "consultants", "risks", "banner", "applicant", "charter", "fig", "barbara", "cooperation", "counties", "acquisition", "ports", "implemented", "sf", "directories", "recognized", "dreams", "blogger", "notification", "kg", "licensing", "stands", "teach", "occurred", "textbooks", "rapid", "pull", "hairy", "diversity", "cleveland", "ut", "reverse", "deposit", "seminar", "investments", "latina", "nasa", "wheels", "specify", "accessibility", "dutch", "sensitive", "templates", "formats", "tab", "depends", "boots", "holds", "router", "concrete", "si", "editing", "poland", "folder", "womens", "css", "completion", "upload", "pulse", "universities", "technique", "contractors", "voting", "courts", "notices", "subscriptions", "calculate", "mc", "detroit", "alexander", "broadcast", "converted", "metro", "toshiba", "anniversary", "improvements", "strip", "specification", "pearl", "accident", "nick", "accessible", "accessory", "resident", "plot", "qty", "possibly", "airline", "typically", "representation", "regard", "pump", "exists", "arrangements", "smooth", "conferences", "uniprotkb", "strike", "consumption", "birmingham", "flashing", "lp", "narrow", "afternoon", "threat", "surveys", "sitting", "putting", "consultant", "controller", "ownership", "committees", "legislative", "researchers", "vietnam", "trailer", "anne", "castle", "gardens", "missed", "malaysia", "unsubscribe", "antique", "labels", "willing", "bio", "molecular", "acting", "heads", "stored", "exam", "logos", "residence", "attorneys", "antiques", "density", "hundred", "ryan", "operators", "strange", "sustainable", "philippines", "statistical", "beds", "mention", "innovation", "pcs", "employers", "grey", "parallel", "honda", "amended", "operate", "bills", "bold", "bathroom", "stable", "opera", "definitions", "von", "doctors", "lesson", "cinema", "asset", "ag", "scan", "elections", "drinking", "reaction", "blank", "enhanced", "entitled", "severe", "generate", "stainless", "newspapers", "hospitals", "vi", "deluxe", "humor", "aged", "monitors", "exception", "lived", "duration", "bulk", "successfully", "indonesia", "pursuant", "sci", "fabric", "edt", "visits", "primarily", "tight", "domains", "capabilities", "pmid", "contrast", "recommendation", "flying", "recruitment", "sin", "berlin", "cute", "organized", "ba", "para", "siemens", "adoption", "improving", "cr", "expensive", "meant", "capture", "pounds", "buffalo", "organisations", "plane", "pg", "explained", "seed", "programmes", "desire", "expertise", "mechanism", "camping", "ee", "jewellery", "meets", "welfare", "peer", "caught", "eventually", "marked", "driven", "measured", "medline", "bottle", "agreements", "considering", "innovative", "marshall", "massage", "rubber", "conclusion", "closing", "tampa", "thousand", "meat", "legend", "grace", "susan", "ing", "ks", "adams", "python", "monster", "alex", "bang", "villa", "bone", "columns", "disorders", "bugs", "collaboration", "hamilton", "detection", "ftp", "cookies", "inner", "formation", "tutorial", "med", "engineers", "entity", "cruises", "gate", "holder", "proposals", "moderator", "sw", "tutorials", "settlement", "portugal", "lawrence", "roman", "duties", "valuable", "tone", "collectables", "ethics", "forever", "dragon", "busy", "captain", "fantastic", "imagine", "brings", "heating", "leg", "neck", "hd", "wing", "governments", "purchasing", "scripts", "abc", "stereo", "appointed", "taste", "dealing", "commit", "tiny", "operational", "rail", "airlines", "liberal", "livecam", "jay", "trips", "gap", "sides", "tube", "turns", "corresponding", "descriptions", "cache", "belt", "jacket", "determination", "animation", "oracle", "er", "matthew", "lease", "productions", "aviation", "hobbies", "proud", "excess", "disaster", "console", "commands", "jr", "telecommunications", "instructor", "giant", "achieved", "injuries", "shipped", "seats", "approaches", "biz", "alarm", "voltage", "anthony", "nintendo", "usual", "loading", "stamps", "appeared", "franklin", "angle", "rob", "vinyl", "highlights", "mining", "designers", "melbourne", "ongoing", "worst", "imaging", "betting", "scientists", "liberty", "wyoming", "blackjack", "argentina", "era", "convert", "possibility", "analyst", "commissioner", "dangerous", "garage", "exciting", "reliability", "thongs", "gcc", "unfortunately", "respectively", "volunteers", "attachment", "ringtone", "finland", "morgan", "derived", "pleasure", "honor", "asp", "oriented", "eagle", "desktops", "pants", "columbus", "nurse", "prayer", "appointment", "workshops", "hurricane", "quiet", "luck", "postage", "producer", "represented", "mortgages", "dial", "responsibilities", "cheese", "comic", "carefully", "jet", "productivity", "investors", "crown", "par", "underground", "diagnosis", "maker", "crack", "principle", "picks", "vacations", "gang", "semester", "calculated", "fetish", "applies", "casinos", "appearance", "smoke", "apache", "filters", "incorporated", "nv", "craft", "cake", "notebooks", "apart", "fellow", "blind", "lounge", "mad", "algorithm", "semi", "coins", "andy", "gross", "strongly", "cafe", "valentine", "hilton", "ken", "proteins", "horror", "su", "exp", "familiar", "capable", "douglas", "debian", "till", "involving", "pen", "investing", "christopher", "admission", "epson", "shoe", "elected", "carrying", "victory", "sand", "madison", "terrorism", "joy", "editions", "cpu", "mainly", "ethnic", "ran", "parliament", "actor", "finds", "seal", "situations", "fifth", "allocated", "citizen", "vertical", "corrections", "structural", "municipal", "describes", "prize", "sr", "occurs", "jon", "absolute", "disabilities", "consists", "anytime", "substance", "prohibited", "addressed", "lies", "pipe", "soldiers", "nr", "guardian", "lecture", "simulation", "layout", "initiatives", "ill", "concentration", "classics", "lbs", "lay", "interpretation", "horses", "lol", "dirty", "deck", "wayne", "donate", "taught", "bankruptcy", "mp", "worker", "optimization", "alive", "temple", "substances", "prove", "discovered", "wings", "breaks", "genetic", "restrictions", "participating", "waters", "promise", "thin", "exhibition", "prefer", "ridge", "cabinet", "modem", "harris", "mph", "bringing", "sick", "dose", "evaluate", "tiffany", "tropical", "collect", "bet", "composition", "toyota", "streets", "nationwide", "vector", "definitely", "shaved", "turning", "buffer", "purple", "existence", "commentary", "larry", "limousines", "developments", "def", "immigration", "destinations", "lets", "mutual", "pipeline", "necessarily", "syntax", "li", "attribute", "prison", "skill", "chairs", "nl", "everyday", "apparently", "surrounding", "mountains", "moves", "popularity", "inquiry", "ethernet", "checked", "exhibit", "throw", "trend", "sierra", "visible", "cats", "desert", "postposted", "ya", "oldest", "rhode", "nba", "coordinator", "obviously", "mercury", "steven", "handbook", "greg", "navigate", "worse", "summit", "victims", "epa", "spaces", "fundamental", "burning", "escape", "coupons", "somewhat", "receiver", "substantial", "tr", "progressive", "cialis", "bb", "boats", "glance", "scottish", "championship", "arcade", "richmond", "sacramento", "impossible", "ron", "russell", "tells", "obvious", "fiber", "depression", "graph", "covering", "platinum", "judgment", "bedrooms", "talks", "filing", "foster", "modeling", "passing", "awarded", "testimonials", "trials", "tissue", "nz", "memorabilia", "clinton", "masters", "bonds", "cartridge", "alberta", "explanation", "folk", "org", "commons", "cincinnati", "subsection", "fraud", "electricity", "permitted", "spectrum", "arrival", "okay", "pottery", "emphasis", "roger", "aspect", "workplace", "awesome", "mexican", "confirmed", "counts", "priced", "wallpapers", "hist", "crash", "lift", "desired", "inter", "closer", "assumes", "heights", "shadow", "riding", "infection", "firefox", "lisa", "expense", "grove", "eligibility", "venture", "clinic", "korean", "healing", "princess", "mall", "entering", "packet", "spray", "studios", "involvement", "dad", "buttons", "placement", "observations", "vbulletin", "funded", "thompson", "winners", "extend", "roads", "subsequent", "pat", "dublin", "rolling", "fell", "motorcycle", "yard", "disclosure", "establishment", "memories", "nelson", "te", "arrived", "creates", "faces", "tourist", "av", "mayor", "murder", "sean", "adequate", "senator", "yield", "presentations", "grades", "cartoons", "pour", "digest", "reg", "lodging", "tion", "dust", "hence", "wiki", "entirely", "replaced", "radar", "rescue", "undergraduate", "losses", "combat", "reducing", "stopped", "occupation", "lakes", "donations", "associations", "citysearch", "closely", "radiation", "diary", "seriously", "kings", "shooting", "kent", "adds", "nsw", "ear", "flags", "pci", "baker", "launched", "elsewhere", "pollution", "conservative", "guestbook", "shock", "effectiveness", "walls", "abroad", "ebony", "tie", "ward", "drawn", "arthur", "ian", "visited", "roof", "walker", "demonstrate", "atmosphere", "suggests", "kiss", "beast", "ra", "operated", "experiment", "targets", "overseas", "purchases", "dodge", "counsel", "federation", "pizza", "invited", "yards", "assignment", "chemicals", "gordon", "mod", "farmers", "rc", "queries", "bmw", "rush", "ukraine", "absence", "nearest", "cluster", "vendors", "mpeg", "whereas", "yoga", "serves", "woods", "surprise", "lamp", "rico", "partial", "shoppers", "phil", "everybody", "couples", "nashville", "ranking", "jokes", "cst", "http", "ceo", "simpson", "twiki", "sublime", "counseling", "palace", "acceptable", "satisfied", "glad", "wins", "measurements", "verify", "globe", "trusted", "copper", "milwaukee", "rack", "medication", "warehouse", "shareware", "ec", "rep", "dicke", "kerry", "receipt", "supposed", "ordinary", "nobody", "ghost", "violation", "configure", "stability", "mit", "applying", "southwest", "boss", "pride", "institutional", "expectations", "independence", "knowing", "reporter", "metabolism", "keith", "champion", "cloudy", "linda", "ross", "personally", "chile", "anna", "plenty", "solo", "sentence", "throat", "ignore", "maria", "uniform", "excellence", "wealth", "tall", "rm", "somewhere", "vacuum", "dancing", "attributes", "recognize", "brass", "writes", "plaza", "pdas", "outcomes", "survival", "quest", "publish", "sri", "screening", "toe", "thumbnail", "trans", "jonathan", "whenever", "nova", "lifetime", "api", "pioneer", "booty", "forgotten", "acrobat", "plates", "acres", "venue", "athletic", "thermal", "essays", "behaviour", "vital", "telling", "fairly", "coastal", "config", "cf", "charity", "intelligent", "edinburgh", "vt", "excel", "modes", "obligation", "campbell", "wake", "stupid", "harbor", "hungary", "traveler", "urw", "segment", "realize", "regardless", "lan", "enemy", "puzzle", "rising", "aluminum", "wells", "wishlist", "opens", "insight", "sms", "restricted", "republican", "secrets", "lucky", "latter", "merchants", "thick", "trailers", "repeat", "syndrome", "philips", "attendance", "penalty", "drum", "glasses", "enables", "nec", "iraqi", "builder", "vista", "jessica", "chips", "terry", "flood", "foto", "ease", "arguments", "amsterdam", "arena", "adventures", "pupils", "stewart", "announcement", "tabs", "outcome", "appreciate", "expanded", "casual", "grown", "polish", "lovely", "extras", "gm", "centres", "jerry", "clause", "smile", "lands", "ri", "troops", "indoor", "bulgaria", "armed", "broker", "charger", "regularly", "believed", "pine", "cooling", "tend", "gulf", "rt", "rick", "trucks", "cp", "mechanisms", "divorce", "laura", "shopper", "tokyo", "partly", "nikon", "customize", "tradition", "candy", "pills", "tiger", "donald", "folks", "sensor", "exposed", "telecom", "hunt", "angels", "deputy", "indicators", "sealed", "thai", "emissions", "physicians", "loaded", "fred", "complaint", "scenes", "experiments", "afghanistan", "dd", "boost", "spanking", "scholarship", "governance", "mill", "founded", "supplements", "chronic", "icons", "moral", "den", "catering", "aud", "finger", "keeps", "pound", "locate", "camcorder", "pl", "trained", "burn", "implementing", "roses", "labs", "ourselves", "bread", "tobacco", "wooden", "motors", "tough", "roberts", "incident", "gonna", "dynamics", "lie", "crm", "rf", "conversation", "decrease", "chest", "pension", "billy", "revenues", "emerging", "worship", "capability", "ak", "fe", "craig", "herself", "producing", "churches", "precision", "damages", "reserves", "contributed", "solve", "shorts", "reproduction", "minority", "td", "diverse", "amp", "ingredients", "sb", "ah", "johnny", "sole", "franchise", "recorder", "complaints", "facing", "sm", "nancy", "promotions", "tones", "passion", "rehabilitation", "maintaining", "sight", "laid", "clay", "defence", "patches", "weak", "refund", "usc", "towns", "environments", "trembl", "divided", "blvd", "reception", "amd", "wise", "emails", "cyprus", "wv", "odds", "correctly", "insider", "seminars", "consequences", "makers", "hearts", "geography", "appearing", "integrity", "worry", "ns", "discrimination", "eve", "carter", "legacy", "marc", "pleased", "danger", "vitamin", "widely", "processed", "phrase", "genuine", "raising", "implications", "functionality", "paradise", "hybrid", "reads", "roles", "intermediate", "emotional", "sons", "leaf", "pad", "glory", "platforms", "ja", "bigger", "billing", "diesel", "versus", "combine", "overnight", "geographic", "exceed", "bs", "rod", "saudi", "fault", "cuba", "hrs", "preliminary", "districts", "introduce", "silk", "promotional", "kate", "chevrolet", "babies", "bi", "karen", "compiled", "romantic", "revealed", "specialists", "generator", "albert", "examine", "jimmy", "graham", "suspension", "bristol", "margaret", "compaq", "sad", "correction", "wolf", "slowly", "authentication", "communicate", "rugby", "supplement", "showtimes", "cal", "portions", "infant", "promoting", "sectors", "samuel", "fluid", "grounds", "fits", "kick", "regards", "meal", "ta", "hurt", "machinery", "bandwidth", "unlike", "equation", "baskets", "probability", "pot", "dimension", "wright", "img", "barry", "proven", "schedules", "admissions", "cached", "warren", "slip", "studied", "reviewer", "involves", "quarterly", "rpm", "profits", "devil", "grass", "comply", "marie", "florist", "illustrated", "cherry", "continental", "alternate", "deutsch", "achievement", "limitations", "kenya", "webcam", "cuts", "funeral", "nutten", "earrings", "enjoyed", "automated", "chapters", "pee", "charlie", "quebec", "passenger", "convenient", "dennis", "mars", "francis", "tvs", "sized", "manga", "noticed", "socket", "silent", "literary", "egg", "mhz", "signals", "caps", "orientation", "pill", "theft", "childhood", "swing", "symbols", "lat", "meta", "humans", "analog", "facial", "choosing", "talent", "dated", "flexibility", "seeker", "wisdom", "shoot", "boundary", "mint", "packard", "offset", "payday", "philip", "elite", "gi", "spin", "holders", "believes", "swedish", "poems", "deadline", "jurisdiction", "robot", "displaying", "witness", "collins", "equipped", "stages", "encouraged", "sur", "winds", "powder", "broadway", "acquired", "assess", "wash", "cartridges", "stones", "entrance", "gnome", "roots", "declaration", "losing", "attempts", "gadgets", "noble", "glasgow", "automation", "impacts", "rev", "gospel", "advantages", "shore", "loves", "induced", "ll", "knight", "preparing", "loose", "aims", "recipient", "linking", "extensions", "appeals", "cl", "earned", "illness", "islamic", "athletics", "southeast", "ieee", "ho", "alternatives", "pending", "parker", "determining", "lebanon", "corp", "personalized", "kennedy", "gt", "sh", "conditioning", "teenage", "soap", "ae", "triple", "cooper", "nyc", "vincent", "jam", "secured", "unusual", "answered", "partnerships", "destruction", "slots", "increasingly", "migration", "disorder", "routine", "toolbar", "basically", "rocks", "conventional", "titans", "applicants", "wearing", "axis", "sought", "genes", "mounted", "habitat", "firewall", "median", "guns", "scanner", "herein", "occupational", "animated", "judicial", "rio", "hs", "adjustment", "hero", "integer", "treatments", "bachelor", "attitude", "camcorders", "engaged", "falling", "basics", "montreal", "carpet", "rv", "struct", "lenses", "binary", "genetics", "attended", "difficulty", "punk", "collective", "coalition", "pi", "dropped", "enrollment", "duke", "walter", "ai", "pace", "besides", "wage", "producers", "ot", "collector", "arc", "hosts", "interfaces", "advertisers", "moments", "atlas", "strings", "dawn", "representing", "observation", "feels", "torture", "carl", "deleted", "coat", "mitchell", "mrs", "rica", "restoration", "convenience", "returning", "ralph", "opposition", "container", "yr", "defendant", "warner", "confirmation", "app", "embedded", "inkjet", "supervisor", "wizard", "corps", "actors", "liver", "peripherals", "liable", "brochure", "morris", "bestsellers", "petition", "eminem", "recall", "antenna", "picked", "assumed", "departure", "minneapolis", "belief", "killing", "bikini", "memphis", "shoulder", "decor", "lookup", "texts", "harvard", "brokers", "roy", "ion", "diameter", "ottawa", "doll", "ic", "podcast", "seasons", "peru", "interactions", "refine", "bidder", "singer", "evans", "herald", "literacy", "fails", "aging", "nike", "intervention", "fed", "plugin", "attraction", "diving", "invite", "modification", "alice", "latinas", "suppose", "customized", "reed", "involve", "moderate", "terror", "younger", "thirty", "mice", "opposite", "understood", "rapidly", "dealtime", "ban", "temp", "intro", "mercedes", "zus", "assurance", "clerk", "happening", "vast", "mills", "outline", "amendments", "tramadol", "holland", "receives", "jeans", "metropolitan", "compilation", "verification", "fonts", "ent", "odd", "wrap", "refers", "mood", "favor", "veterans", "quiz", "mx", "sigma", "gr", "attractive", "xhtml", "occasion", "recordings", "jefferson", "victim", "demands", "sleeping", "careful", "ext", "beam", "gardening", "obligations", "arrive", "orchestra", "sunset", "tracked", "moreover", "minimal", "polyphonic", "lottery", "tops", "framed", "aside", "outsourcing", "licence", "adjustable", "allocation", "michelle", "essay", "discipline", "amy", "ts", "demonstrated", "dialogue", "identifying", "alphabetical", "camps", "declared", "dispatched", "aaron", "handheld", "trace", "disposal", "shut", "florists", "packs", "ge", "installing", "switches", "romania", "voluntary", "ncaa", "thou", "consult", "phd", "greatly", "blogging", "mask", "cycling", "midnight", "ng", "commonly", "pe", "photographer", "inform", "turkish", "coal", "cry", "messaging", "pentium", "quantum", "murray", "intent", "tt", "zoo", "largely", "pleasant", "announce", "constructed", "additions", "requiring", "spoke", "aka", "arrow", "engagement", "sampling", "rough", "weird", "tee", "refinance", "lion", "inspired", "holes", "weddings", "blade", "suddenly", "oxygen", "cookie", "meals", "canyon", "goto", "meters", "merely", "calendars", "arrangement", "conclusions", "passes", "bibliography", "pointer", "compatibility", "stretch", "durham", "furthermore", "permits", "cooperative", "muslim", "xl", "neil", "sleeve", "netscape", "cleaner", "cricket", "beef", "feeding", "stroke", "township", "rankings", "measuring", "cad", "hats", "robin", "robinson", "jacksonville", "strap", "headquarters", "sharon", "crowd", "tcp", "transfers", "surf", "olympic", "transformation", "remained", "attachments", "dv", "dir", "entities", "customs", "administrators", "personality", "rainbow", "hook", "roulette", "decline", "gloves", "israeli", "medicare", "cord", "skiing", "cloud", "facilitate", "subscriber", "valve", "val", "hewlett", "explains", "proceed", "flickr", "feelings", "knife", "jamaica", "priorities", "shelf", "bookstore", "timing", "liked", "parenting", "adopt", "denied", "fotos", "incredible", "britney", "freeware", "donation", "outer", "crop", "deaths", "rivers", "commonwealth", "pharmaceutical", "manhattan", "tales", "katrina", "workforce", "islam", "nodes", "tu", "fy", "thumbs", "seeds", "cited", "lite", "ghz", "hub", "targeted", "organizational", "skype", "realized", "twelve", "founder", "decade", "gamecube", "rr", "dispute", "portuguese", "tired", "titten", "adverse", "everywhere", "excerpt", "eng", "steam", "discharge", "ef", "drinks", "ace", "voices", "acute", "halloween", "climbing", "stood", "sing", "tons", "perfume", "carol", "honest", "albany", "hazardous", "restore", "stack", "methodology", "somebody", "sue", "ep", "housewares", "reputation", "resistant", "democrats", "recycling", "hang", "gbp", "curve", "creator", "amber", "qualifications", "museums", "coding", "slideshow", "tracker", "variation", "passage", "transferred", "trunk", "hiking", "lb", "pierre", "jelsoft", "headset", "photograph", "oakland", "colombia", "waves", "camel", "distributor", "lamps", "underlying", "hood", "wrestling", "suicide", "archived", "photoshop", "jp", "chi", "bt", "arabia", "gathering", "projection", "juice", "chase", "mathematical", "logical", "sauce", "fame", "extract", "specialized", "diagnostic", "panama", "indianapolis", "af", "payable", "corporations", "courtesy", "criticism", "automobile", "confidential", "rfc", "statutory", "accommodations", "athens", "northeast", "downloaded", "judges", "sl", "seo", "retired", "isp", "remarks", "detected", "decades", "paintings", "walked", "arising", "nissan", "bracelet", "ins", "eggs", "juvenile", "injection", "yorkshire", "populations", "protective", "afraid", "acoustic", "railway", "cassette", "initially", "indicator", "pointed", "hb", "jpg", "causing", "mistake", "norton", "locked", "eliminate", "tc", "fusion", "mineral", "sunglasses", "ruby", "steering", "beads", "fortune", "preference", "canvas", "threshold", "parish", "claimed", "screens", "cemetery", "planner", "croatia", "flows", "stadium", "venezuela", "exploration", "mins", "fewer", "sequences", "coupon", "nurses", "ssl", "stem", "proxy", "astronomy", "lanka", "opt", "edwards", "drew", "contests", "flu", "translate", "announces", "mlb", "costume", "tagged", "berkeley", "voted", "killer", "bikes", "gates", "adjusted", "rap", "tune", "bishop", "pulled", "corn", "gp", "shaped", "compression", "seasonal", "establishing", "farmer", "counters", "puts", "constitutional", "grew", "perfectly", "tin", "slave", "instantly", "cultures", "norfolk", "coaching", "examined", "trek", "encoding", "litigation", "submissions", "oem", "heroes", "painted", "lycos", "ir", "zdnet", "broadcasting", "horizontal", "artwork", "cosmetic", "resulted", "portrait", "terrorist", "informational", "ethical", "carriers", "ecommerce", "mobility", "floral", "builders", "ties", "struggle", "schemes", "suffering", "neutral", "fisher", "rat", "spears", "prospective", "bedding", "ultimately", "joining", "heading", "equally", "artificial", "bearing", "spectacular", "coordination", "connector", "brad", "combo", "seniors", "worlds", "guilty", "affiliated", "activation", "naturally", "haven", "tablet", "jury", "dos", "tail", "subscribers", "charm", "lawn", "violent", "mitsubishi", "underwear", "basin", "soup", "potentially", "ranch", "constraints", "crossing", "inclusive", "dimensional", "cottage", "drunk", "considerable", "crimes", "resolved", "mozilla", "byte", "toner", "nose", "latex", "branches", "anymore", "oclc", "delhi", "holdings", "alien", "locator", "selecting", "processors", "pantyhose", "plc", "broke", "nepal", "zimbabwe", "difficulties", "juan", "complexity", "msg", "constantly", "browsing", "resolve", "barcelona", "presidential", "documentary", "cod", "territories", "melissa", "moscow", "thesis", "thru", "jews", "nylon", "palestinian", "discs", "rocky", "bargains", "frequent", "trim", "nigeria", "ceiling", "pixels", "ensuring", "hispanic", "cv", "cb", "legislature", "hospitality", "gen", "anybody", "procurement", "diamonds", "espn", "fleet", "untitled", "bunch", "totals", "marriott", "singing", "theoretical", "afford", "exercises", "starring", "referral", "nhl", "surveillance", "optimal", "quit", "distinct", "protocols", "lung", "highlight", "substitute", "inclusion", "hopefully", "brilliant", "turner", "sucking", "cents", "reuters", "ti", "fc", "gel", "todd", "spoken", "omega", "evaluated", "stayed", "civic", "assignments", "fw", "manuals", "doug", "sees", "termination", "watched", "saver", "thereof", "grill", "households", "gs", "redeem", "rogers", "grain", "aaa", "authentic", "regime", "wanna", "wishes", "bull", "montgomery", "architectural", "louisville", "depend", "differ", "macintosh", "movements", "ranging", "monica", "repairs", "breath", "amenities", "virtually", "cole", "mart", "candle", "hanging", "colored", "authorization", "tale", "verified", "lynn", "formerly", "projector", "bp", "situated", "comparative", "std", "seeks", "herbal", "loving", "strictly", "routing", "docs", "stanley", "psychological", "surprised", "retailer", "vitamins", "elegant", "gains", "renewal", "vid", "genealogy", "opposed", "deemed", "scoring", "expenditure", "brooklyn", "liverpool", "sisters", "critics", "connectivity", "spots", "oo", "algorithms", "hacker", "madrid", "similarly", "margin", "coin", "solely", "fake", "salon", "collaborative", "norman", "fda", "excluding", "turbo", "headed", "voters", "cure", "madonna", "commander", "arch", "ni", "murphy", "thinks", "thats", "suggestion", "hdtv", "soldier", "phillips", "asin", "aimed", "justin", "bomb", "harm", "interval", "mirrors", "spotlight", "tricks", "reset", "brush", "investigate", "thy", "expansys", "panels", "repeated", "assault", "connecting", "spare", "logistics", "deer", "kodak", "tongue", "bowling", "tri", "danish", "pal", "monkey", "proportion", "filename", "skirt", "florence", "invest", "honey", "um", "analyses", "drawings", "significance", "scenario", "ye", "fs", "lovers", "atomic", "approx", "symposium", "arabic", "gauge", "essentials", "junction", "protecting", "nn", "faced", "mat", "rachel", "solving", "transmitted", "weekends", "screenshots", "produces", "oven", "ted", "intensive", "chains", "kingston", "sixth", "engage", "deviant", "noon", "switching", "quoted", "adapters", "correspondence", "farms", "imports", "supervision", "cheat", "bronze", "expenditures", "sandy", "separation", "testimony", "suspect", "celebrities", "macro", "sender", "mandatory", "boundaries", "crucial", "syndication", "gym", "celebration", "kde", "adjacent", "filtering", "tuition", "spouse", "exotic", "viewer", "signup", "threats", "luxembourg", "puzzles", "reaching", "vb", "damaged", "cams", "receptor", "laugh", "joel", "surgical", "destroy", "citation", "pitch", "autos", "yo", "premises", "perry", "proved", "offensive", "imperial", "dozen", "benjamin", "deployment", "teeth", "cloth", "studying", "colleagues", "stamp", "lotus", "salmon", "olympus", "separated", "proc", "cargo", "tan", "directive", "fx", "salem", "mate", "dl", "starter", "upgrades", "likes", "butter", "pepper", "weapon", "luggage", "burden", "chef", "tapes", "zones", "races", "isle", "stylish", "slim", "maple", "luke", "grocery", "offshore", "governing", "retailers", "depot", "kenneth", "comp", "alt", "pie", "blend", "harrison", "ls", "julie", "occasionally", "cbs", "attending", "emission", "pete", "spec", "finest", "realty", "janet", "bow", "penn", "recruiting", "apparent", "instructional", "phpbb", "autumn", "traveling", "probe", "midi", "permissions", "biotechnology", "toilet", "ranked", "jackets", "routes", "packed", "excited", "outreach", "helen", "mounting", "recover", "tied", "lopez", "balanced", "prescribed", "catherine", "timely", "talked", "debug", "delayed", "chuck", "reproduced", "hon", "dale", "explicit", "calculation", "villas", "ebook", "consolidated", "exclude", "peeing", "occasions", "brooks", "equations", "newton", "oils", "sept", "exceptional", "anxiety", "bingo", "whilst", "spatial", "respondents", "unto", "lt", "ceramic", "prompt", "precious", "minds", "annually", "considerations", "scanners", "atm", "xanax", "eq", "pays", "fingers", "sunny", "ebooks", "delivers", "je", "queensland", "necklace", "musicians", "leeds", "composite", "unavailable", "cedar", "arranged", "lang", "theaters", "advocacy", "raleigh", "stud", "fold", "essentially", "designing", "threaded", "uv", "qualify", "blair", "hopes", "assessments", "cms", "mason", "diagram", "burns", "pumps", "footwear", "sg", "vic", "beijing", "peoples", "victor", "mario", "pos", "attach", "licenses", "utils", "removing", "advised", "brunswick", "spider", "phys", "ranges", "pairs", "sensitivity", "trails", "preservation", "hudson", "isolated", "calgary", "interim", "assisted", "divine", "streaming", "approve", "chose", "compound", "intensity", "technological", "syndicate", "abortion", "dialog", "venues", "blast", "wellness", "calcium", "newport", "antivirus", "addressing", "pole", "discounted", "indians", "shield", "harvest", "membrane", "prague", "previews", "bangladesh", "constitute", "locally", "concluded", "pickup", "desperate", "mothers", "nascar", "iceland", "demonstration", "governmental", "manufactured", "candles", "graduation", "mega", "bend", "sailing", "variations", "moms", "sacred", "addiction", "morocco", "chrome", "tommy", "springfield", "refused", "brake", "exterior", "greeting", "ecology", "oliver", "congo", "glen", "botswana", "nav", "delays", "synthesis", "olive", "undefined", "unemployment", "cyber", "verizon", "scored", "enhancement", "newcastle", "clone", "dicks", "velocity", "lambda", "relay", "composed", "tears", "performances", "oasis", "baseline", "cab", "angry", "fa", "societies", "silicon", "brazilian", "identical", "petroleum", "compete", "ist", "norwegian", "lover", "belong", "honolulu", "beatles", "lips", "retention", "exchanges", "pond", "rolls", "thomson", "barnes", "soundtrack", "wondering", "malta", "daddy", "lc", "ferry", "rabbit", "profession", "seating", "dam", "cnn", "separately", "physiology", "lil", "collecting", "das", "exports", "omaha", "tire", "participant", "scholarships", "recreational", "dominican", "chad", "electron", "loads", "friendship", "heather", "passport", "motel", "unions", "treasury", "warrant", "sys", "solaris", "frozen", "occupied", "josh", "royalty", "scales", "rally", "observer", "sunshine", "strain", "drag", "ceremony", "somehow", "arrested", "expanding", "provincial", "investigations", "icq", "ripe", "yamaha", "rely", "medications", "hebrew", "gained", "rochester", "dying", "laundry", "stuck", "solomon", "placing", "stops", "homework", "adjust", "assessed", "advertiser", "enabling", "encryption", "filling", "downloadable", "sophisticated", "imposed", "silence", "scsi", "focuses", "soviet", "possession", "cu", "laboratories", "treaty", "vocal", "trainer", "organ", "stronger", "volumes", "advances", "vegetables", "lemon", "toxic", "dns", "thumbnails", "darkness", "pty", "ws", "nuts", "nail", "bizrate", "vienna", "implied", "span", "stanford", "sox", "stockings", "joke", "respondent", "packing", "statute", "rejected", "satisfy", "destroyed", "shelter", "chapel", "gamespot", "manufacture", "layers", "wordpress", "guided", "vulnerability", "accountability", "celebrate", "accredited", "appliance", "compressed", "bahamas", "powell", "mixture", "bench", "univ", "tub", "rider", "scheduling", "radius", "perspectives", "mortality", "logging", "hampton", "christians", "borders", "therapeutic", "pads", "butts", "inns", "bobby", "impressive", "sheep", "accordingly", "architect", "railroad", "lectures", "challenging", "wines", "nursery", "harder", "cups", "ash", "microwave", "cheapest", "accidents", "travesti", "relocation", "stuart", "contributors", "salvador", "ali", "salad", "np", "monroe", "tender", "violations", "foam", "temperatures", "paste", "clouds", "competitions", "discretion", "tft", "tanzania", "preserve", "jvc", "poem", "unsigned", "staying", "cosmetics", "easter", "theories", "repository", "praise", "jeremy", "venice", "concentrations", "estonia", "christianity", "veteran", "streams", "landing", "signing", "executed", "katie", "negotiations", "realistic", "dt", "cgi", "showcase", "integral", "asks", "relax", "namibia", "generating", "christina", "congressional", "synopsis", "hardly", "prairie", "reunion", "composer", "bean", "sword", "absent", "photographic", "sells", "ecuador", "hoping", "accessed", "spirits", "modifications", "coral", "pixel", "float", "colin", "bias", "imported", "paths", "bubble", "por", "acquire", "contrary", "millennium", "tribune", "vessel", "acids", "focusing", "viruses", "cheaper", "admitted", "dairy", "admit", "mem", "fancy", "equality", "samoa", "gc", "achieving", "tap", "stickers", "fisheries", "exceptions", "reactions", "leasing", "lauren", "beliefs", "ci", "macromedia", "companion", "squad", "analyze", "ashley", "scroll", "relate", "divisions", "swim", "wages", "additionally", "suffer", "forests", "fellowship", "nano", "invalid", "concerts", "martial", "males", "victorian", "retain", "colours", "execute", "tunnel", "genres", "cambodia", "patents", "copyrights", "yn", "chaos", "lithuania", "mastercard", "wheat", "chronicles", "obtaining", "beaver", "updating", "distribute", "readings", "decorative", "kijiji", "confused", "compiler", "enlargement", "eagles", "bases", "vii", "accused", "bee", "campaigns", "unity", "loud", "conjunction", "bride", "rats", "defines", "airports", "instances", "indigenous", "begun", "cfr", "brunette", "packets", "anchor", "socks", "validation", "parade", "corruption", "stat", "trigger", "incentives", "cholesterol", "gathered", "essex", "slovenia", "notified", "differential", "beaches", "folders", "dramatic", "surfaces", "terrible", "routers", "cruz", "pendant", "dresses", "baptist", "scientist", "starsmerchant", "hiring", "clocks", "arthritis", "bios", "females", "wallace", "nevertheless", "reflects", "taxation", "fever", "pmc", "cuisine", "surely", "practitioners", "transcript", "myspace", "theorem", "inflation", "thee", "nb", "ruth", "pray", "stylus", "compounds", "pope", "drums", "contracting", "arnold", "structured", "reasonably", "jeep", "chicks", "bare", "hung", "cattle", "mba", "radical", "graduates", "rover", "recommends", "controlling", "treasure", "reload", "distributors", "flame", "levitra", "tanks", "assuming", "monetary", "elderly", "pit", "arlington", "mono", "particles", "floating", "extraordinary", "tile", "indicating", "bolivia", "spell", "hottest", "stevens", "coordinate", "kuwait", "exclusively", "emily", "alleged", "limitation", "widescreen", "compile", "webster", "struck", "rx", "illustration", "plymouth", "warnings", "construct", "apps", "inquiries", "bridal", "annex", "mag", "gsm", "inspiration", "tribal", "curious", "affecting", "freight", "rebate", "meetup", "eclipse", "sudan", "ddr", "downloading", "rec", "shuttle", "aggregate", "stunning", "cycles", "affects", "forecasts", "detect", "actively", "ciao", "ampland", "knee", "prep", "pb", "complicated", "chem", "fastest", "butler", "shopzilla", "injured", "decorating", "payroll", "cookbook", "expressions", "ton", "courier", "uploaded", "shakespeare", "hints", "collapse", "americas", "connectors", "unlikely", "oe", "gif", "pros", "conflicts", "techno", "beverage", "tribute", "wired", "elvis", "immune", "latvia", "travelers", "forestry", "barriers", "cant", "jd", "rarely", "gpl", "infected", "offerings", "martha", "genesis", "barrier", "argue", "incorrect", "trains", "metals", "bicycle", "furnishings", "letting", "arise", "guatemala", "celtic", "thereby", "irc", "jamie", "particle", "perception", "minerals", "advise", "humidity", "bottles", "boxing", "wy", "dm", "bangkok", "renaissance", "pathology", "sara", "bra", "ordinance", "hughes", "photographers", "infections", "jeffrey", "chess", "operates", "brisbane", "configured", "survive", "oscar", "festivals", "menus", "joan", "possibilities", "duck", "reveal", "canal", "amino", "phi", "contributing", "herbs", "clinics", "mls", "cow", "manitoba", "analytical", "missions", "watson", "lying", "costumes", "strict", "dive", "saddam", "circulation", "drill", "offense", "bryan", "cet", "protest", "assumption", "jerusalem", "hobby", "tries", "transexuales", "invention", "nickname", "fiji", "technician", "inline", "executives", "enquiries", "washing", "audi", "staffing", "cognitive", "exploring", "trick", "enquiry", "closure", "raid", "ppc", "timber", "volt", "intense", "div", "playlist", "registrar", "showers", "supporters", "ruling", "steady", "dirt", "statutes", "withdrawal", "myers", "drops", "predicted", "wider", "saskatchewan", "jc", "cancellation", "plugins", "enrolled", "sensors", "screw", "ministers", "publicly", "hourly", "blame", "geneva", "freebsd", "veterinary", "acer", "prostores", "reseller", "dist", "handed", "suffered", "intake", "informal", "relevance", "incentive", "butterfly", "tucson", "mechanics", "heavily", "swingers", "fifty", "headers", "mistakes", "numerical", "ons", "geek", "uncle", "defining", "counting", "reflection", "sink", "accompanied", "assure", "invitation", "devoted", "princeton", "jacob", "sodium", "randy", "spirituality", "hormone", "meanwhile", "proprietary", "timothy", "childrens", "brick", "grip", "naval", "thumbzilla", "medieval", "porcelain", "avi", "bridges", "pichunter", "captured", "watt", "thehun", "decent", "casting", "dayton", "translated", "shortly", "cameron", "columnists", "pins", "carlos", "reno", "donna", "andreas", "warrior", "diploma", "cabin", "innocent", "scanning", "ide", "consensus", "polo", "valium", "copying", "rpg", "delivering", "cordless", "patricia", "horn", "eddie", "uganda", "fired", "journalism", "pd", "prot", "trivia", "adidas", "perth", "frog", "grammar", "intention", "syria", "disagree", "klein", "harvey", "tires", "logs", "undertaken", "tgp", "hazard", "retro", "leo", "statewide", "semiconductor", "gregory", "episodes", "boolean", "circular", "anger", "diy", "mainland", "illustrations", "suits", "chances", "interact", "snap", "happiness", "arg", "substantially", "bizarre", "glenn", "ur", "auckland", "olympics", "fruits", "identifier", "geo", "ribbon", "calculations", "doe", "jpeg", "conducting", "startup", "suzuki", "trinidad", "ati", "kissing", "wal", "handy", "swap", "exempt", "crops", "reduces", "accomplished", "calculators", "geometry", "impression", "abs", "slovakia", "flip", "guild", "correlation", "gorgeous", "capitol", "sim", "dishes", "rna", "barbados", "chrysler", "nervous", "refuse", "extends", "fragrance", "mcdonald", "replica", "plumbing", "brussels", "tribe", "neighbors", "trades", "superb", "buzz", "transparent", "nuke", "rid", "trinity", "charleston", "handled", "legends", "boom", "calm", "champions", "floors", "selections", "projectors", "inappropriate", "exhaust", "comparing", "shanghai", "speaks", "burton", "vocational", "davidson", "copied", "scotia", "farming", "gibson", "pharmacies", "fork", "troy", "ln", "roller", "introducing", "batch", "organize", "appreciated", "alter", "nicole", "latino", "ghana", "edges", "uc", "mixing", "handles", "skilled", "fitted", "albuquerque", "harmony", "distinguished", "asthma", "projected", "assumptions", "shareholders", "twins", "developmental", "rip", "zope", "regulated", "triangle", "amend", "anticipated", "oriental", "reward", "windsor", "zambia", "completing", "gmbh", "buf", "ld", "hydrogen", "webshots", "sprint", "comparable", "chick", "advocate", "sims", "confusion", "copyrighted", "tray", "inputs", "warranties", "genome", "escorts", "documented", "thong", "medal", "paperbacks", "coaches", "vessels", "harbour", "walks", "sol", "keyboards", "sage", "knives", "eco", "vulnerable", "arrange", "artistic", "bat", "honors", "booth", "indie", "reflected", "unified", "bones", "breed", "detector", "ignored", "polar", "fallen", "precise", "sussex", "respiratory", "notifications", "msgid", "transexual", "mainstream", "invoice", "evaluating", "lip", "subcommittee", "sap", "gather", "suse", "maternity", "backed", "alfred", "colonial", "mf", "carey", "motels", "forming", "embassy", "cave", "journalists", "danny", "rebecca", "slight", "proceeds", "indirect", "amongst", "wool", "foundations", "msgstr", "arrest", "volleyball", "mw", "adipex", "horizon", "nu", "deeply", "toolbox", "ict", "marina", "liabilities", "prizes", "bosnia", "browsers", "decreased", "patio", "dp", "tolerance", "surfing", "creativity", "lloyd", "describing", "optics", "pursue", "lightning", "overcome", "eyed", "ou", "quotations", "grab", "inspector", "attract", "brighton", "beans", "bookmarks", "ellis", "disable", "snake", "succeed", "leonard", "lending", "oops", "reminder", "xi", "searched", "behavioral", "riverside", "bathrooms", "plains", "sku", "ht", "raymond", "insights", "abilities", "initiated", "sullivan", "za", "midwest", "karaoke", "trap", "lonely", "fool", "ve", "nonprofit", "lancaster", "suspended", "hereby", "observe", "julia", "containers", "attitudes", "karl", "berry", "collar", "simultaneously", "racial", "integrate", "bermuda", "amanda", "sociology", "mobiles", "screenshot", "exhibitions", "kelkoo", "confident", "retrieved", "exhibits", "officially", "consortium", "dies", "terrace", "bacteria", "pts", "replied", "seafood", "novels", "rh", "rrp", "recipients", "ought", "delicious", "traditions", "fg", "jail", "safely", "finite", "kidney", "periodically", "fixes", "sends", "durable", "mazda", "allied", "throws", "moisture", "hungarian", "roster", "referring", "symantec", "spencer", "wichita", "nasdaq", "uruguay", "ooo", "hz", "transform", "timer", "tablets", "tuning", "gotten", "educators", "tyler", "futures", "vegetable", "verse", "highs", "humanities", "independently", "wanting", "custody", "scratch", "launches", "ipaq", "alignment", "masturbating", "henderson", "bk", "britannica", "comm", "ellen", "competitors", "nhs", "rocket", "aye", "bullet", "towers", "racks", "lace", "nasty", "visibility", "latitude", "consciousness", "ste", "tumor", "ugly", "deposits", "beverly", "mistress", "encounter", "trustees", "watts", "duncan", "reprints", "hart", "bernard", "resolutions", "ment", "accessing", "forty", "tubes", "attempted", "col", "midlands", "priest", "floyd", "ronald", "analysts", "queue", "dx", "sk", "trance", "locale", "nicholas", "biol", "yu", "bundle", "hammer", "invasion", "witnesses", "runner", "rows", "administered", "notion", "sq", "skins", "mailed", "oc", "fujitsu", "spelling", "arctic", "exams", "rewards", "beneath", "strengthen", "defend", "aj", "frederick", "medicaid", "treo", "infrared", "seventh", "gods", "une", "welsh", "belly", "aggressive", "tex", "advertisements", "quarters", "stolen", "cia", "soonest", "haiti", "disturbed", "determines", "sculpture", "poly", "ears", "dod", "wp", "fist", "naturals", "neo", "motivation", "lenders", "pharmacology", "fitting", "fixtures", "bloggers", "mere", "agrees", "passengers", "quantities", "petersburg", "consistently", "powerpoint", "cons", "surplus", "elder", "sonic", "obituaries", "cheers", "dig", "taxi", "punishment", "appreciation", "subsequently", "om", "belarus", "nat", "zoning", "gravity", "providence", "thumb", "restriction", "incorporate", "backgrounds", "treasurer", "guitars", "essence", "flooring", "lightweight", "ethiopia", "tp", "mighty", "athletes", "humanity", "transcription", "jm", "holmes", "complications", "scholars", "dpi", "scripting", "gis", "remembered", "galaxy", "chester", "snapshot", "caring", "loc", "worn", "synthetic", "shaw", "vp", "segments", "testament", "expo", "dominant", "twist", "specifics", "itunes", "stomach", "partially", "buried", "cn", "newbie", "minimize", "darwin", "ranks", "wilderness", "debut", "generations", "tournaments", "bradley", "deny", "anatomy", "bali", "judy", "sponsorship", "headphones", "fraction", "trio", "proceeding", "cube", "defects", "volkswagen", "uncertainty", "breakdown", "milton", "marker", "reconstruction", "subsidiary", "strengths", "clarity", "rugs", "sandra", "adelaide", "encouraging", "furnished", "monaco", "settled", "folding", "emirates", "terrorists", "airfare", "comparisons", "beneficial", "distributions", "vaccine", "belize", "fate", "viewpicture", "promised", "volvo", "penny", "robust", "bookings", "threatened", "minolta", "republicans", "discusses", "gui", "porter", "gras", "jungle", "ver", "rn", "responded", "rim", "abstracts", "zen", "ivory", "alpine", "dis", "prediction", "pharmaceuticals", "andale", "fabulous", "remix", "alias", "thesaurus", "individually", "battlefield", "literally", "newer", "kay", "ecological", "spice", "oval", "implies", "cg", "soma", "ser", "cooler", "appraisal", "consisting", "maritime", "periodic", "submitting", "overhead", "ascii", "prospect", "shipment", "breeding", "citations", "geographical", "donor", "mozambique", "tension", "href", "benz", "trash", "shapes", "wifi", "tier", "fwd", "earl", "manor", "envelope", "diane", "homeland", "disclaimers", "championships", "excluded", "andrea", "breeds", "rapids", "disco", "sheffield", "bailey", "aus", "endif", "finishing", "emotions", "wellington", "incoming", "prospects", "lexmark", "cleaners", "bulgarian", "hwy", "eternal", "cashiers", "guam", "cite", "aboriginal", "remarkable", "rotation", "nam", "preventing", "productive", "boulevard", "eugene", "ix", "gdp", "pig", "metric", "compliant", "minus", "penalties", "bennett", "imagination", "hotmail", "refurbished", "joshua", "armenia", "varied", "grande", "closest", "activated", "actress", "mess", "conferencing", "assign", "armstrong", "politicians", "trackbacks", "lit", "accommodate", "tigers", "aurora", "una", "slides", "milan", "premiere", "lender", "villages", "shade", "chorus", "christine", "rhythm", "digit", "argued", "dietary", "symphony", "clarke", "sudden", "accepting", "precipitation", "marilyn", "lions", "findlaw", "ada", "pools", "tb", "lyric", "claire", "isolation", "speeds", "sustained", "matched", "approximate", "rope", "carroll", "rational", "programmer", "fighters", "chambers", "dump", "greetings", "inherited", "warming", "incomplete", "vocals", "chronicle", "fountain", "chubby", "grave", "legitimate", "biographies", "burner", "yrs", "foo", "investigator", "gba", "plaintiff", "finnish", "gentle", "bm", "prisoners", "deeper", "muslims", "hose", "mediterranean", "nightlife", "footage", "howto", "worthy", "reveals", "architects", "saints", "entrepreneur", "carries", "sig", "freelance", "duo", "excessive", "devon", "screensaver", "helena", "saves", "regarded", "valuation", "unexpected", "cigarette", "fog", "characteristic", "marion", "lobby", "egyptian", "tunisia", "metallica", "outlined", "consequently", "headline", "treating", "punch", "appointments", "str", "gotta", "cowboy", "narrative", "bahrain", "enormous", "karma", "consist", "betty", "queens", "academics", "pubs", "quantitative", "lucas", "screensavers", "subdivision", "tribes", "vip", "defeat", "clicks", "distinction", "honduras", "naughty", "hazards", "insured", "harper", "livestock", "mardi", "exemption", "tenant", "sustainability", "cabinets", "tattoo", "shake", "algebra", "shadows", "holly", "formatting", "silly", "nutritional", "yea", "mercy", "hartford", "freely", "marcus", "sunrise", "wrapping", "mild", "fur", "nicaragua", "weblogs", "timeline", "tar", "belongs", "rj", "readily", "affiliation", "soc", "fence", "nudist", "infinite", "diana", "ensures", "relatives", "lindsay", "clan", "legally", "shame", "satisfactory", "revolutionary", "bracelets", "sync", "civilian", "telephony", "mesa", "fatal", "remedy", "realtors", "breathing", "briefly", "thickness", "adjustments", "graphical", "genius", "discussing", "aerospace", "fighter", "meaningful", "flesh", "retreat", "adapted", "barely", "wherever", "estates", "rug", "democrat", "borough", "maintains", "failing", "shortcuts", "ka", "retained", "voyeurweb", "pamela", "andrews", "marble", "extending", "jesse", "specifies", "hull", "logitech", "surrey", "briefing", "belkin", "dem", "accreditation", "wav", "blackberry", "highland", "meditation", "modular", "microphone", "macedonia", "combining", "brandon", "instrumental", "giants", "organizing", "shed", "balloon", "moderators", "winston", "memo", "ham", "solved", "tide", "kazakhstan", "hawaiian", "standings", "partition", "invisible", "gratuit", "consoles", "funk", "fbi", "qatar", "magnet", "translations", "porsche", "cayman", "jaguar", "reel", "sheer", "commodity", "posing", "kilometers", "rp", "bind", "thanksgiving", "rand", "hopkins", "urgent", "guarantees", "infants", "gothic", "cylinder", "witch", "buck", "indication", "eh", "congratulations", "tba", "cohen", "sie", "usgs", "puppy", "kathy", "acre", "graphs", "surround", "cigarettes", "revenge", "expires", "enemies", "lows", "controllers", "aqua", "chen", "emma", "consultancy", "finances", "accepts", "enjoying", "conventions", "eva", "patrol", "smell", "pest", "hc", "italiano", "coordinates", "rca", "fp", "carnival", "roughly", "sticker", "promises", "responding", "reef", "physically", "divide", "stakeholders", "hydrocodone", "gst", "consecutive", "cornell", "satin", "bon", "deserve", "attempting", "mailto", "promo", "jj", "representations", "chan", "worried", "tunes", "garbage", "competing", "combines", "mas", "beth", "bradford", "len", "phrases", "kai", "peninsula", "chelsea", "boring", "reynolds", "dom", "jill", "accurately", "speeches", "reaches", "schema", "considers", "sofa", "catalogs", "ministries", "vacancies", "quizzes", "parliamentary", "obj", "prefix", "lucia", "savannah", "barrel", "typing", "nerve", "dans", "planets", "deficit", "boulder", "pointing", "renew", "coupled", "viii", "myanmar", "metadata", "harold", "circuits", "floppy", "texture", "handbags", "jar", "ev", "somerset", "incurred", "acknowledge", "thoroughly", "antigua", "nottingham", "thunder", "tent", "caution", "identifies", "questionnaire", "qualification", "locks", "modelling", "namely", "miniature", "dept", "hack", "dare", "euros", "interstate", "pirates", "aerial", "hawk", "consequence", "rebel", "systematic", "perceived", "origins", "hired", "makeup", "textile", "lamb", "madagascar", "nathan", "tobago", "presenting", "cos", "troubleshooting", "uzbekistan", "indexes", "pac", "rl", "erp", "centuries", "gl", "magnitude", "ui", "richardson", "hindu", "dh", "fragrances", "vocabulary", "licking", "earthquake", "vpn", "fundraising", "fcc", "markers", "weights", "albania", "geological", "assessing", "lasting", "wicked", "eds", "introduces", "kills", "roommate", "webcams", "pushed", "webmasters", "ro", "df", "computational", "acdbentity", "participated", "junk", "handhelds", "wax", "lucy", "answering", "hans", "impressed", "slope", "reggae", "failures", "poet", "conspiracy", "surname", "theology", "nails", "evident", "whats", "rides", "rehab", "epic", "saturn", "organizer", "nut", "allergy", "sake", "twisted", "combinations", "preceding", "merit", "enzyme", "cumulative", "zshops", "planes", "edmonton", "tackle", "disks", "condo", "pokemon", "amplifier", "ambien", "arbitrary", "prominent", "retrieve", "lexington", "vernon", "sans", "worldcat", "titanium", "irs", "fairy", "builds", "contacted", "shaft", "lean", "bye", "cdt", "recorders", "occasional", "leslie", "casio", "deutsche", "ana", "postings", "innovations", "kitty", "postcards", "dude", "drain", "monte", "fires", "algeria", "blessed", "luis", "reviewing", "cardiff", "cornwall", "favors", "potato", "panic", "explicitly", "sticks", "leone", "transsexual", "ez", "citizenship", "excuse", "reforms", "basement", "onion", "strand", "pf", "sandwich", "uw", "lawsuit", "alto", "informative", "girlfriend", "bloomberg", "cheque", "hierarchy", "influenced", "banners", "reject", "eau", "abandoned", "bd", "circles", "italic", "beats", "merry", "mil", "scuba", "gore", "complement", "cult", "dash", "passive", "mauritius", "valued", "cage", "checklist", "requesting", "courage", "verde", "lauderdale", "scenarios", "gazette", "hitachi", "divx", "extraction", "batman", "elevation", "hearings", "coleman", "hugh", "lap", "utilization", "beverages", "calibration", "jake", "eval", "efficiently", "anaheim", "ping", "textbook", "dried", "entertaining", "prerequisite", "luther", "frontier", "settle", "stopping", "refugees", "knights", "hypothesis", "palmer", "medicines", "flux", "derby", "sao", "peaceful", "altered", "pontiac", "regression", "doctrine", "scenic", "trainers", "muze", "enhancements", "renewable", "intersection", "passwords", "sewing", "consistency", "collectors", "conclude", "recognised", "munich", "oman", "celebs", "gmc", "propose", "hh", "azerbaijan", "lighter", "rage", "adsl", "uh", "prix", "astrology", "advisors", "pavilion", "tactics", "trusts", "occurring", "supplemental", "travelling", "talented", "annie", "pillow", "induction", "derek", "precisely", "shorter", "harley", "spreading", "provinces", "relying", "finals", "paraguay", "steal", "parcel", "refined", "fd", "bo", "fifteen", "widespread", "incidence", "fears", "predict", "boutique", "acrylic", "rolled", "tuner", "avon", "incidents", "peterson", "rays", "asn", "shannon", "toddler", "enhancing", "flavor", "alike", "walt", "homeless", "horrible", "hungry", "metallic", "acne", "blocked", "interference", "warriors", "palestine", "listprice", "libs", "undo", "cadillac", "atmospheric", "malawi", "wm", "pk", "sagem", "knowledgestorm", "dana", "halo", "ppm", "curtis", "parental", "referenced", "strikes", "lesser", "publicity", "marathon", "ant", "proposition", "gays", "pressing", "gasoline", "apt", "dressed", "scout", "belfast", "exec", "dealt", "niagara", "inf", "eos", "warcraft", "charms", "catalyst", "trader", "bucks", "allowance", "vcr", "denial", "uri", "designation", "thrown", "prepaid", "raises", "gem", "duplicate", "electro", "criterion", "badge", "wrist", "civilization", "analyzed", "vietnamese", "heath", "tremendous", "ballot", "lexus", "varying", "remedies", "validity", "trustee", "maui", "weighted", "angola", "performs", "plastics", "realm", "corrected", "jenny", "helmet", "salaries", "postcard", "elephant", "yemen", "encountered", "tsunami", "scholar", "nickel", "internationally", "surrounded", "psi", "buses", "expedia", "geology", "pct", "wb", "creatures", "coating", "commented", "wallet", "cleared", "smilies", "vids", "accomplish", "boating", "drainage", "shakira", "corners", "broader", "vegetarian", "rouge", "yeast", "yale", "newfoundland", "sn", "qld", "pas", "clearing", "investigated", "dk", "ambassador", "coated", "intend", "stephanie", "contacting", "vegetation", "doom", "findarticles", "louise", "kenny", "specially", "owen", "routines", "hitting", "yukon", "beings", "bite", "issn", "aquatic", "reliance", "habits", "striking", "myth", "infectious", "podcasts", "singh", "gig", "gilbert", "sas", "ferrari", "continuity", "brook", "fu", "outputs", "phenomenon", "ensemble", "insulin", "assured", "biblical", "weed", "conscious", "accent", "mysimon", "eleven", "wives", "ambient", "utilize", "mileage", "oecd", "prostate", "adaptor", "auburn", "unlock", "hyundai", "pledge", "vampire", "angela", "relates", "nitrogen", "xerox", "dice", "merger", "softball", "referrals", "quad", "dock", "differently", "firewire", "mods", "nextel", "framing", "organised", "musician", "blocking", "rwanda", "sorts", "integrating", "vsnet", "limiting", "dispatch", "revisions", "papua", "restored", "hint", "armor", "riders", "chargers", "remark", "dozens", "varies", "msie", "reasoning", "wn", "liz", "rendered", "picking", "charitable", "guards", "annotated", "ccd", "sv", "convinced", "openings", "buys", "burlington", "replacing", "researcher", "watershed", "councils", "occupations", "acknowledged", "kruger", "pockets", "granny", "pork", "zu", "equilibrium", "viral", "inquire", "pipes", "characterized", "laden", "aruba", "cottages", "realtor", "merge", "privilege", "edgar", "develops", "qualifying", "chassis", "dubai", "estimation", "barn", "pushing", "llp", "fleece", "pediatric", "boc", "fare", "dg", "asus", "pierce", "allan", "dressing", "techrepublic", "sperm", "vg", "bald", "filme", "craps", "fuji", "frost", "leon", "institutes", "mold", "dame", "fo", "sally", "yacht", "tracy", "prefers", "drilling", "brochures", "herb", "tmp", "alot", "ate", "breach", "whale", "traveller", "appropriations", "suspected", "tomatoes", "benchmark", "beginners", "instructors", "highlighted", "bedford", "stationery", "idle", "mustang", "unauthorized", "clusters", "antibody", "competent", "momentum", "fin", "wiring", "io", "pastor", "mud", "calvin", "uni", "shark", "contributor", "demonstrates", "phases", "grateful", "emerald", "gradually", "laughing", "grows", "cliff", "desirable", "tract", "ul", "ballet", "ol", "journalist", "abraham", "js", "bumper", "afterwards", "webpage", "religions", "garlic", "hostels", "shine", "senegal", "explosion", "pn", "banned", "wendy", "briefs", "signatures", "diffs", "cove", "mumbai", "ozone", "disciplines", "casa", "mu", "daughters", "conversations", "radios", "tariff", "nvidia", "opponent", "pasta", "simplified", "muscles", "serum", "wrapped", "swift", "motherboard", "runtime", "inbox", "focal", "bibliographic", "eden", "distant", "incl", "champagne", "ala", "decimal", "hq", "deviation", "superintendent", "propecia", "dip", "nbc", "samba", "hostel", "housewives", "employ", "mongolia", "penguin", "magical", "influences", "inspections", "irrigation", "miracle", "manually", "reprint", "reid", "wt", "hydraulic", "centered", "robertson", "flex", "yearly", "penetration", "wound", "belle", "rosa", "conviction", "hash", "omissions", "writings", "hamburg", "lazy", "mv", "mpg", "retrieval", "qualities", "cindy", "fathers", "carb", "charging", "cas", "marvel", "lined", "cio", "dow", "prototype", "importantly", "rb", "petite", "apparatus", "upc", "terrain", "dui", "pens", "explaining", "yen", "strips", "gossip", "rangers", "nomination", "empirical", "mh", "rotary", "worm", "dependence", "discrete", "beginner", "boxed", "lid", "sexuality", "polyester", "cubic", "deaf", "commitments", "suggesting", "sapphire", "kinase", "skirts", "mats", "remainder", "crawford", "labeled", "privileges", "televisions", "specializing", "marking", "commodities", "pvc", "serbia", "sheriff", "griffin", "declined", "guyana", "spies", "blah", "mime", "neighbor", "motorcycles", "elect", "highways", "thinkpad", "concentrate", "intimate", "reproductive", "preston", "deadly", "feof", "bunny", "chevy", "molecules", "rounds", "longest", "refrigerator", "tions", "intervals", "sentences", "dentists", "usda", "exclusion", "workstation", "holocaust", "keen", "flyer", "peas", "dosage", "receivers", "urls", "customise", "disposition", "variance", "navigator", "investigators", "cameroon", "baking", "marijuana", "adaptive", "computed", "needle", "baths", "enb", "gg", "cathedral", "brakes", "og", "nirvana", "ko", "fairfield", "owns", "til", "invision", "sticky", "destiny", "generous", "madness", "emacs", "climb", "blowing", "fascinating", "landscapes", "heated", "lafayette", "jackie", "wto", "computation", "hay", "cardiovascular", "ww", "sparc", "cardiac", "salvation", "dover", "adrian", "predictions", "accompanying", "vatican", "brutal", "learners", "gd", "selective", "arbitration", "configuring", "token", "editorials", "zinc", "sacrifice", "seekers", "guru", "isa", "removable", "convergence", "yields", "gibraltar", "levy", "suited", "numeric", "anthropology", "skating", "kinda", "aberdeen", "emperor", "grad", "malpractice", "dylan", "bras", "belts", "blacks", "educated", "rebates", "reporters", "burke", "proudly", "pix", "necessity", "rendering", "mic", "inserted", "pulling", "basename", "kyle", "obesity", "curves", "suburban", "touring", "clara", "vertex", "bw", "hepatitis", "nationally", "tomato", "andorra", "waterproof", "expired", "mj", "travels", "flush", "waiver", "pale", "specialties", "hayes", "humanitarian", "invitations", "functioning", "delight", "survivor", "garcia", "cingular", "economies", "alexandria", "bacterial", "moses", "counted", "undertake", "declare", "continuously", "johns", "valves", "gaps", "impaired", "achievements", "donors", "tear", "jewel", "teddy", "lf", "convertible", "ata", "teaches", "ventures", "nil", "bufing", "stranger", "tragedy", "julian", "nest", "pam", "dryer", "painful", "velvet", "tribunal", "ruled", "nato", "pensions", "prayers", "funky", "secretariat", "nowhere", "cop", "paragraphs", "gale", "joins", "adolescent", "nominations", "wesley", "dim", "lately", "cancelled", "scary", "mattress", "mpegs", "brunei", "likewise", "banana", "introductory", "slovak", "cakes", "stan", "reservoir", "occurrence", "idol", "mixer", "remind", "wc", "worcester", "sbjct", "demographic", "charming", "mai", "tooth", "disciplinary", "annoying", "respected", "stays", "disclose", "affair", "drove", "washer", "upset", "restrict", "springer", "beside", "mines", "portraits", "rebound", "logan", "mentor", "interpreted", "evaluations", "fought", "baghdad", "elimination", "metres", "hypothetical", "immigrants", "complimentary", "helicopter", "pencil", "freeze", "hk", "performer", "abu", "titled", "commissions", "sphere", "powerseller", "moss", "ratios", "concord", "graduated", "endorsed", "ty", "surprising", "walnut", "lance", "ladder", "italia", "unnecessary", "dramatically", "liberia", "sherman", "cork", "maximize", "cj", "hansen", "senators", "workout", "mali", "yugoslavia", "bleeding", "characterization", "colon", "likelihood", "lanes", "purse", "fundamentals", "contamination", "mtv", "endangered", "compromise", "masturbation", "optimize", "stating", "dome", "caroline", "leu", "expiration", "namespace", "align", "peripheral", "bless", "engaging", "negotiation", "crest", "opponents", "triumph", "nominated", "confidentiality", "electoral", "changelog", "welding", "deferred", "alternatively", "heel", "alloy", "condos", "plots", "polished", "yang", "gently", "greensboro", "tulsa", "locking", "casey", "controversial", "draws", "fridge", "blanket", "bloom", "qc", "simpsons", "lou", "elliott", "recovered", "fraser", "justify", "upgrading", "blades", "pgp", "loops", "surge", "frontpage", "trauma", "aw", "tahoe", "advert", "possess", "demanding", "defensive", "sip", "flashers", "subaru", "forbidden", "tf", "vanilla", "programmers", "pj", "monitored", "installations", "deutschland", "picnic", "souls", "arrivals", "spank", "cw", "practitioner", "motivated", "wr", "dumb", "smithsonian", "hollow", "vault", "securely", "examining", "fioricet", "groove", "revelation", "rg", "pursuit", "delegation", "wires", "bl", "dictionaries", "mails", "backing", "greenhouse", "sleeps", "vc", "blake", "transparency", "dee", "travis", "wx", "endless", "figured", "orbit", "currencies", "niger", "bacon", "survivors", "positioning", "heater", "colony", "cannon", "circus", "promoted", "forbes", "mae", "moldova", "mel", "descending", "paxil", "spine", "trout", "enclosed", "feat", "temporarily", "ntsc", "cooked", "thriller", "transmit", "apnic", "fatty", "gerald", "pressed", "frequencies", "scanned", "reflections", "hunger", "mariah", "sic", "municipality", "usps", "joyce", "detective", "surgeon", "cement", "experiencing", "fireplace", "endorsement", "bg", "planners", "disputes", "textiles", "missile", "intranet", "closes", "seq", "psychiatry", "persistent", "deborah", "conf", "marco", "assists", "summaries", "glow", "gabriel", "auditor", "wma", "aquarium", "violin", "prophet", "cir", "bracket", "looksmart", "isaac", "oxide", "oaks", "magnificent", "erik", "colleague", "naples", "promptly", "modems", "adaptation", "hu", "harmful", "paintball", "prozac", "sexually", "enclosure", "acm", "dividend", "newark", "kw", "paso", "glucose", "phantom", "norm", "playback", "supervisors", "westminster", "turtle", "ips", "distances", "absorption", "treasures", "dsc", "warned", "neural", "ware", "fossil", "mia", "hometown", "badly", "transcripts", "apollo", "wan", "disappointed", "persian", "continually", "communist", "collectible", "handmade", "greene", "entrepreneurs", "robots", "grenada", "creations", "jade", "scoop", "acquisitions", "foul", "keno", "gtk", "earning", "mailman", "sanyo", "nested", "biodiversity", "excitement", "somalia", "movers", "verbal", "blink", "presently", "seas", "carlo", "workflow", "mysterious", "novelty", "bryant", "tiles", "voyuer", "librarian", "subsidiaries", "switched", "stockholm", "tamil", "garmin", "ru", "pose", "fuzzy", "indonesian", "grams", "therapist", "richards", "mrna", "budgets", "toolkit", "promising", "relaxation", "goat", "render", "carmen", "ira", "sen", "thereafter", "hardwood", "erotica", "temporal", "sail", "forge", "commissioners", "dense", "dts", "brave", "forwarding", "qt", "awful", "nightmare", "airplane", "reductions", "southampton", "istanbul", "impose", "organisms", "sega", "telescope", "viewers", "asbestos", "portsmouth", "cdna", "meyer", "enters", "pod", "savage", "advancement", "wu", "harassment", "willow", "resumes", "bolt", "gage", "throwing", "existed", "generators", "lu", "wagon", "barbie", "dat", "favour", "soa", "knock", "urge", "smtp", "generates", "potatoes", "thorough", "replication", "inexpensive", "kurt", "receptors", "peers", "roland", "optimum", "neon", "interventions", "quilt", "huntington", "creature", "ours", "mounts", "syracuse", "internship", "lone", "refresh", "aluminium", "snowboard", "beastality", "webcast", "michel", "evanescence", "subtle", "coordinated", "notre", "shipments", "maldives", "stripes", "firmware", "antarctica", "cope", "shepherd", "lm", "canberra", "cradle", "chancellor", "mambo", "lime", "kirk", "flour", "controversy", "legendary", "bool", "sympathy", "choir", "avoiding", "beautifully", "blond", "expects", "cho", "jumping", "fabrics", "antibodies", "polymer", "hygiene", "wit", "poultry", "virtue", "burst", "examinations", "surgeons", "bouquet", "immunology", "promotes", "mandate", "wiley", "departmental", "bbs", "spas", "ind", "corpus", "johnston", "terminology", "gentleman", "fibre", "reproduce", "convicted", "shades", "jets", "indices", "roommates", "adware", "qui", "intl", "threatening", "spokesman", "zoloft", "activists", "frankfurt", "prisoner", "daisy", "halifax", "encourages", "ultram", "cursor", "assembled", "earliest", "donated", "stuffed", "restructuring", "insects", "terminals", "crude", "morrison", "maiden", "simulations", "cz", "sufficiently", "examines", "viking", "myrtle", "bored", "cleanup", "yarn", "knit", "conditional", "mug", "crossword", "bother", "budapest", "conceptual", "knitting", "attacked", "hl", "bhutan", "liechtenstein", "mating", "compute", "redhead", "arrives", "translator", "automobiles", "tractor", "allah", "continent", "ob", "unwrap", "fares", "longitude", "resist", "challenged", "telecharger", "hoped", "pike", "safer", "insertion", "instrumentation", "ids", "hugo", "wagner", "constraint", "groundwater", "touched", "strengthening", "cologne", "gzip", "wishing", "ranger", "smallest", "insulation", "newman", "marsh", "ricky", "ctrl", "scared", "theta", "infringement", "bent", "laos", "subjective", "monsters", "asylum", "lightbox", "robbie", "stake", "cocktail", "outlets", "swaziland", "varieties", "arbor", "mediawiki", "configurations", "poison"];
});
define("game/data/WordList", ["require", "exports", "game/data/WordList10k"], function (require, exports, WordList10k_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var words1k = [[],
        [],
        [],
        ['act', 'air', 'all', 'and', 'ant', 'any', 'arm', 'art', 'bad', 'bag', 'bed', 'bee', 'bit', 'box', 'boy', 'but', 'cat', 'cow', 'cry', 'cup', 'cup', 'day', 'dog', 'dry', 'ear', 'egg', 'end', 'eye', 'far', 'fat', 'fly', 'for', 'get', 'gun', 'hat', 'how', 'ice', 'ill', 'ink', 'key', 'law', 'leg', 'let', 'lip', 'low', 'man', 'map', 'may', 'net', 'new', 'not', 'now', 'nut', 'off', 'oil', 'old', 'out', 'pen', 'pig', 'pin', 'pot', 'put', 'rat', 'ray', 'red', 'rod', 'rub', 'run', 'sad', 'say', 'sea', 'see', 'sky', 'son', 'sun', 'tax', 'the', 'tin', 'toe', 'top', 'use', 'war', 'wax', 'way', 'wet', 'who', 'why', 'yes', 'you'],
        ['able', 'acid', 'arch', 'army', 'baby', 'back', 'ball', 'band', 'base', 'bath', 'bell', 'bent', 'bird', 'bite', 'blow', 'blue', 'boat', 'body', 'bone', 'book', 'boot', 'bulb', 'burn', 'cake', 'card', 'care', 'cart', 'chin', 'coal', 'coat', 'cold', 'comb', 'come', 'cook', 'copy', 'cord', 'cork', 'dark', 'dead', 'dear', 'debt', 'deep', 'door', 'down', 'drop', 'dust', 'east', 'edge', 'even', 'ever', 'face', 'fact', 'fall', 'farm', 'fear', 'fire', 'fish', 'flag', 'flat', 'fold', 'food', 'foot', 'fork', 'form', 'fowl', 'free', 'from', 'full', 'girl', 'give', 'goat', 'gold', 'good', 'grey', 'grip', 'hair', 'hand', 'hard', 'hate', 'have', 'head', 'hear', 'heat', 'help', 'high', 'hole', 'hook', 'hope', 'horn', 'hose', 'hour', 'idea', 'iron', 'join', 'jump', 'keep', 'kick', 'kind', 'kiss', 'knee', 'knot', 'land', 'last', 'late', 'lead', 'leaf', 'left', 'lift', 'like', 'line', 'list', 'lock', 'long', 'look', 'loss', 'loud', 'love', 'make', 'male', 'mark', 'mass', 'meal', 'meat', 'milk', 'mind', 'mine', 'mist', 'moon', 'move', 'much', 'nail', 'name', 'near', 'neck', 'need', 'news', 'nose', 'note', 'only', 'open', 'oven', 'over', 'page', 'pain', 'part', 'past', 'pipe', 'play', 'poor', 'pull', 'pump', 'push', 'rail', 'rain', 'rate', 'rest', 'rice', 'ring', 'road', 'roll', 'roof', 'room', 'root', 'rule', 'safe', 'sail', 'salt', 'same', 'sand', 'seat', 'seed', 'seem', 'self', 'send', 'ship', 'shoe', 'shut', 'side', 'sign', 'silk', 'size', 'skin', 'slip', 'slow', 'snow', 'soap', 'sock', 'soft', 'some', 'song', 'sort', 'soup', 'star', 'stem', 'step', 'stop', 'such', 'swim', 'tail', 'take', 'talk', 'tall', 'test', 'than', 'that', 'then', 'thin', 'this', 'till', 'time', 'town', 'tray', 'tree', 'true', 'turn', 'unit', 'very', 'view', 'walk', 'wall', 'warm', 'wash', 'wave', 'week', 'well', 'west', 'when', 'whip', 'wide', 'will', 'wind', 'wine', 'wing', 'wire', 'wise', 'with', 'wood', 'wool', 'word', 'work', 'worm', 'year'],
        ['about', 'after', 'again', 'among', 'angle', 'angry', 'apple', 'awake', 'basin', 'berry', 'birth', 'black', 'blade', 'blood', 'board', 'brain', 'brake', 'brass', 'bread', 'brick', 'brown', 'brush', 'burst', 'cause', 'chain', 'chalk', 'cheap', 'chest', 'chief', 'clean', 'clear', 'clock', 'cloth', 'cloud', 'cough', 'cover', 'crack', 'crime', 'cruel', 'crush', 'curve', 'death', 'dirty', 'doubt', 'drain', 'dress', 'drink', 'early', 'earth', 'equal', 'error', 'event', 'every', 'false', 'field', 'fight', 'first', 'fixed', 'flame', 'floor', 'force', 'frame', 'front', 'fruit', 'glass', 'glove', 'grain', 'grass', 'great', 'green', 'group', 'guide', 'happy', 'heart', 'horse', 'house', 'jelly', 'jewel', 'judge', 'knife', 'laugh', 'level', 'light', 'limit', 'linen', 'loose', 'match', 'metal', 'mixed', 'money', 'month', 'mouth', 'music', 'nerve', 'night', 'noise', 'north', 'offer', 'order', 'other', 'owner', 'paint', 'paper', 'paste', 'peace', 'place', 'plane', 'plant', 'plate', 'point', 'power', 'price', 'print', 'prose', 'quick', 'quiet', 'quite', 'range', 'ready', 'right', 'river', 'rough', 'round', 'scale', 'screw', 'sense', 'shade', 'shake', 'shame', 'sharp', 'sheep', 'shelf', 'shirt', 'shock', 'short', 'skirt', 'sleep', 'slope', 'small', 'smash', 'smell', 'smile', 'smoke', 'snake', 'solid', 'sound', 'south', 'space', 'spade', 'spoon', 'stage', 'stamp', 'start', 'steam', 'steel', 'stick', 'stiff', 'still', 'stone', 'store', 'story', 'sugar', 'sweet', 'table', 'taste', 'there', 'thick', 'thing', 'thumb', 'tight', 'tired', 'tooth', 'touch', 'trade', 'train', 'trick', 'twist', 'under', 'value', 'verse', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'while', 'white', 'woman', 'wound', 'wrong', 'young'],
        ['across', 'almost', 'amount', 'animal', 'answer', 'attack', 'basket', 'before', 'belief', 'bitter', 'bottle', 'branch', 'breath', 'bridge', 'bright', 'broken', 'bucket', 'butter', 'button', 'camera', 'canvas', 'chance', 'change', 'cheese', 'church', 'circle', 'collar', 'colour', 'common', 'copper', 'cotton', 'credit', 'damage', 'danger', 'degree', 'design', 'desire', 'detail', 'drawer', 'effect', 'engine', 'enough', 'expert', 'family', 'father', 'feeble', 'female', 'finger', 'flight', 'flower', 'friend', 'future', 'garden', 'growth', 'hammer', 'hollow', 'humour', 'insect', 'island', 'kettle', 'letter', 'liquid', 'little', 'living', 'market', 'memory', 'middle', 'minute', 'monkey', 'mother', 'motion', 'muscle', 'narrow', 'nation', 'needle', 'normal', 'number', 'office', 'orange', 'parcel', 'pencil', 'person', 'please', 'plough', 'pocket', 'poison', 'polish', 'porter', 'potato', 'powder', 'prison', 'profit', 'public', 'reason', 'record', 'regret', 'reward', 'rhythm', 'school', 'second', 'secret', 'silver', 'simple', 'sister', 'smooth', 'sneeze', 'sponge', 'spring', 'square', 'sticky', 'stitch', 'street', 'strong', 'sudden', 'summer', 'system', 'theory', 'thread', 'throat', 'ticket', 'tongue', 'vessel', 'weight', 'window', 'winter', 'yellow'],
        ['account', 'against', 'attempt', 'balance', 'because', 'between', 'boiling', 'brother', 'certain', 'comfort', 'company', 'complex', 'control', 'country', 'current', 'curtain', 'cushion', 'disease', 'disgust', 'driving', 'elastic', 'example', 'feather', 'feeling', 'fertile', 'fiction', 'foolish', 'forward', 'general', 'hanging', 'harbour', 'harmony', 'healthy', 'hearing', 'history', 'impulse', 'journey', 'leather', 'library', 'machine', 'manager', 'married', 'measure', 'medical', 'meeting', 'morning', 'natural', 'opinion', 'payment', 'picture', 'present', 'private', 'process', 'produce', 'protest', 'purpose', 'quality', 'reading', 'receipt', 'regular', 'request', 'respect', 'science', 'serious', 'servant', 'society', 'special', 'station', 'stomach', 'strange', 'stretch', 'support', 'thought', 'through', 'through', 'thunder', 'trouble', 'violent', 'waiting', 'weather', 'whistle', 'writing'],
        ['addition', 'approval', 'argument', 'building', 'business', 'carriage', 'chemical', 'complete', 'daughter', 'decision', 'delicate', 'distance', 'division', 'electric', 'exchange', 'frequent', 'hospital', 'increase', 'industry', 'interest', 'language', 'learning', 'material', 'military', 'mountain', 'opposite', 'ornament', 'parallel', 'physical', 'pleasure', 'position', 'possible', 'probable', 'property', 'question', 'reaction', 'relation', 'religion', 'scissors', 'separate', 'stocking', 'straight', 'surprise', 'teaching', 'tendency', 'together', 'tomorrow', 'trousers', 'umbrella'],
        ['agreement', 'amusement', 'apparatus', 'attention', 'authority', 'automatic', 'beautiful', 'behaviour', 'committee', 'condition', 'conscious', 'dependent', 'different', 'digestion', 'direction', 'discovery', 'education', 'existence', 'expansion', 'important', 'insurance', 'invention', 'knowledge', 'necessary', 'operation', 'political', 'secretary', 'selection', 'statement', 'structure', 'substance', 'transport', 'yesterday'],
        ['adjustment', 'attraction', 'comparison', 'connection', 'discussion', 'experience', 'government', 'instrument', 'punishment', 'suggestion', 'competition', 'destruction', 'development', 'observation', 'responsible', 'distribution', 'organization']
    ];
    var list = WordList10k_1.words10k;
    function shift(i) {
        return list[i].splice(Math.floor(Math.random() * (list[i].length - 5)), 1)[0];
    }
    exports.shift = shift;
    function push(s) {
        if (s.length > 10) {
            list[10].push(s);
        }
        else {
            list[s.length].push(s);
        }
    }
    exports.push = push;
    function healSize() {
        return 8 + Math.floor(Math.random() * 2);
    }
    exports.healSize = healSize;
});
define("game/data/Fonts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WORD_FONT = "Consolas", exports.SPACE_FONT = "Quixley LET", exports.TITLE_FONT = "Rocket Script", exports.TINY_FONT = "Lily UPC", exports.ROSE_FONT = "RosewoodStd-Regular", exports.GAME_FONT = "Arial";
});
define("game/text/TextObject", ["require", "exports", "game/data/WordList", "game/data/Fonts"], function (require, exports, WordList, Fonts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextObject = (function (_super) {
        __extends(TextObject, _super);
        function TextObject(wordSize, priority, following, onWordComplete) {
            if (wordSize === void 0) { wordSize = 0; }
            if (priority === void 0) { priority = 0; }
            var _this = _super.call(this) || this;
            _this.following = following;
            _this.onWordComplete = onWordComplete;
            _this.priority = -1;
            _this.frontText = new PIXI.Text("", { fontSize: 14, fill: 0xffffff, fontFamily: Fonts.WORD_FONT, stroke: 0, strokeThickness: 2 });
            _this.addChild(_this.frontText);
            _this.setPriority(priority);
            if (wordSize > 0) {
                _this.newWord(wordSize);
            }
            else {
                _this.frontText.visible = false;
            }
            TextObject.allTextObjects.push(_this);
            return _this;
        }
        TextObject.prototype.newWord = function (wordSize) {
            if (this.getText()) {
                WordList.push(this.getText());
            }
            this.word = WordList.shift(wordSize);
            this.frontText.text = this.word;
            this.frontText.visible = true;
        };
        TextObject.prototype.hasWord = function () {
            return Boolean(this.getText());
        };
        TextObject.prototype.getText = function () {
            return this.word ? this.word.trim() : "";
        };
        TextObject.prototype.setPriority = function (i) {
            if (i === this.priority)
                return;
            this.priority = i;
            switch (i) {
                case 0:
                    this.frontText.tint = 0xffffff;
                    break;
                case 1:
                    this.frontText.tint = 0xffff99;
                    break;
                case 2:
                    this.frontText.tint = 0xffbb99;
                    break;
                case 3:
                    this.frontText.tint = 0xff8877;
                    break;
            }
        };
        TextObject.prototype.update = function () {
            if (this.following) {
                var point = this.parent.toLocal(this.following.wordOffset, this.following);
                this.x = point.x;
                this.y = point.y;
                this.setPriority(this.following.priority);
            }
        };
        TextObject.prototype.dispose = function () {
            if (this.hasWord) {
                WordList.push(this.getText());
                this.word = "";
                this.frontText.text = this.word;
                this.frontText.visible = false;
            }
        };
        TextObject.prototype.remove = function () {
            this.dispose();
            this.destroy();
            TextObject.allTextObjects.splice(TextObject.allTextObjects.indexOf(this), 1);
        };
        TextObject.prototype.matchAndReturnWord = function (s) {
            var text = this.getText();
            if (text === s.substring(s.length - text.length)) {
                this.dispose();
                return text;
            }
            else {
                return null;
            }
        };
        TextObject.prototype.triggerWordComplete = function () {
            if (this.onWordComplete) {
                this.onWordComplete(this.getText());
            }
        };
        TextObject.allTextObjects = [];
        return TextObject;
    }(PIXI.Container));
    exports.TextObject = TextObject;
});
define("game/data/Misc", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameEvents;
    (function (GameEvents) {
        GameEvents["REQUEST_HEAL_PLAYER"] = "healPlayer";
        GameEvents["REQUEST_PAUSE_GAME"] = "requestPauseGame";
        GameEvents["REQUEST_OVERFLOW_WORD"] = "overflowWord";
        GameEvents["NOTIFY_UPDATE_INPUT_WORD"] = "updateInputWord";
        GameEvents["NOTIFY_LETTER_DELETED"] = "letterDeleted";
        GameEvents["NOTIFY_WORD_COMPLETED"] = "wordComplete";
        GameEvents["NOTIFY_OBJECT_WORD_COMPLETED"] = "ObjectWordCompleted";
        GameEvents["NOTIFY_SET_SCORE"] = "setScore";
        GameEvents["NOTIFY_SET_PROGRESS"] = "setProgress";
        GameEvents["NOTIFY_SET_HEALTH"] = "setHealth";
        GameEvents["NOTIFY_BOSS_DAMAGED"] = "bossDamaged";
        GameEvents["NOTIFY_COMMANDS_COMPLETE"] = "commandsComplete";
    })(GameEvents = exports.GameEvents || (exports.GameEvents = {}));
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["MISSILE"] = 0] = "MISSILE";
        ActionType[ActionType["LASER"] = 1] = "LASER";
        ActionType[ActionType["SUICIDE"] = 2] = "SUICIDE";
        ActionType[ActionType["AUTO_MISSILE"] = 3] = "AUTO_MISSILE";
        ActionType[ActionType["EMP"] = 4] = "EMP";
        ActionType[ActionType["INSTANT"] = 5] = "INSTANT";
    })(ActionType = exports.ActionType || (exports.ActionType = {}));
});
define("game/objects/BaseObject", ["require", "exports", "game/text/TextObject", "game/engine/ObjectManager", "game/data/Misc", "JMGE/JMBL"], function (require, exports, TextObject_1, ObjectManager_1, Misc_1, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseObject = (function (_super) {
        __extends(BaseObject, _super);
        function BaseObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layer = ObjectManager_1.DisplayLayer.DEFAULT;
            _this.toDestroy = false;
            _this.wordSize = -1;
            _this.wordOffset = new PIXI.Point(0, 0);
            _this.priority = 0;
            _this.update = function (speed) {
            };
            _this.getDistance = function (p) {
                var dx = p.x - _this.x;
                var dy = p.y - _this.y;
                return Math.sqrt(dx * dx + dy * dy);
            };
            _this.wordComplete = function () {
                JMBL.events.publish(Misc_1.GameEvents.NOTIFY_OBJECT_WORD_COMPLETED, _this);
                if (_this.onWordComplete) {
                    _this.onWordComplete(_this);
                }
            };
            return _this;
        }
        BaseObject.prototype.makeDisplay = function (image, scale) {
            this.display = PIXI.Sprite.fromImage(image);
            this.display.anchor.set(0.5);
            this.display.scale.set(scale);
            this.addChild(this.display);
        };
        BaseObject.prototype.dispose = function () {
            this.toDestroy = true;
        };
        BaseObject.prototype.addWord = function (i, priority) {
            if (i === void 0) { i = 0; }
            if (priority === void 0) { priority = 1; }
            this.priority = priority;
            if (i <= 0)
                i = this.wordSize;
            if (i >= 0) {
                if (!this.textObject) {
                    this.textObject = new TextObject_1.TextObject((i === 0) ? this.wordSize : i, this.priority, this, this.wordComplete);
                }
                else {
                    this.textObject.newWord(i === 0 ? this.wordSize : i);
                }
            }
        };
        return BaseObject;
    }(PIXI.Container));
    exports.BaseObject = BaseObject;
});
define("JMGE/effects/FlyingText", ["require", "exports", "JMGE/JMBL"], function (require, exports, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlyingText = (function (_super) {
        __extends(FlyingText, _super);
        function FlyingText(s, style, x, y, parent) {
            var _this = _super.call(this, s, JMBL.utils.default(style, { fontSize: 15, fontWeight: 'bold', dropShadow: true, fill: 0xffffff, dropShadowDistance: 2 })) || this;
            _this.anchor.set(0.5, 0.5);
            _this.position.set(x, y);
            if (parent)
                parent.addChild(_this);
            JMBL.tween.to(_this, 60, { delay: 20, alpha: 0 });
            JMBL.tween.to(_this, 80, { y: (_this.y - 20) }, { onComplete: function () { return _this.destroy(); } });
            return _this;
        }
        return FlyingText;
    }(PIXI.Text));
    exports.FlyingText = FlyingText;
});
define("JMGE/effects/Firework", ["require", "exports", "JMGE/JMBL"], function (require, exports, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Firework = (function () {
        function Firework(stage, x, y, count) {
            if (!Firework.initialized)
                Firework.initialize();
            for (var i = 0; i < count; i += 1) {
                var particle = new FireworkParticle(x, y);
                Firework.particles.push(particle);
                stage.addChild(particle);
            }
        }
        Firework.initialize = function () {
            if (!this.initialized) {
                var firework = new PIXI.Graphics;
                firework.beginFill(0xffffff);
                firework.drawCircle(0, 0, 5);
                Firework.TEXTURE = JMBL.textures.addTextureFromGraphic(firework);
                JMBL.events.ticker.add(this.onTick.bind(this));
                this.initialized = true;
            }
        };
        Firework.onTick = function () {
            for (var i = 0; i < this.particles.length; i += 1) {
                this.particles[i].update();
                if (this.particles[i].alpha < 0.1) {
                    this.particles[i].destroy();
                    this.particles.splice(i, 1);
                    i -= 1;
                }
            }
        };
        Firework.particles = [];
        Firework.initialized = false;
        return Firework;
    }());
    exports.Firework = Firework;
    var FireworkParticle = (function (_super) {
        __extends(FireworkParticle, _super);
        function FireworkParticle(x, y) {
            var _this = _super.call(this, Firework.TEXTURE) || this;
            _this.fade = 0.01;
            _this.vX = 0.6;
            _this.vY = 0.6;
            _this.update = function () {
                _this.x += _this.vX;
                _this.y += _this.vY;
                _this.alpha -= _this.fade;
            };
            _this.x = x;
            _this.y = y;
            _this.vX = Math.random() * _this.vX - _this.vX / 2;
            _this.vY = Math.random() * _this.vY - _this.vY / 2;
            _this.alpha = 1 + Math.random() * 0.5;
            var size = 2 + Math.random() * 8;
            _this.width = size;
            _this.height = size;
            _this.tint = 0xcccccc;
            return _this;
        }
        return FireworkParticle;
    }(PIXI.Sprite));
});
define("JMGE/others/Colors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorGradient = (function () {
        function ColorGradient(startColor, endColor) {
            var _this = this;
            this.startColor = startColor;
            this.getColorAt = function (percent) {
                percent = Math.min(1, Math.max(0, percent));
                return _this.startColor + Math.floor(_this.R * percent) * 0x010000 + Math.floor(_this.G * percent) * 0x000100 + Math.floor(_this.B * percent);
            };
            this.R = Math.floor(endColor / 0x010000) - Math.floor(startColor / 0x010000);
            this.G = Math.floor((endColor % 0x010000) / 0x000100) - Math.floor((startColor % 0x010000) / 0x000100);
            this.B = Math.floor(endColor % 0x000100) - Math.floor(startColor % 0x000100);
        }
        return ColorGradient;
    }());
    exports.ColorGradient = ColorGradient;
    function colorLuminance(hex, lum) {
        if (lum === void 0) { lum = 0; }
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }
    exports.colorLuminance = colorLuminance;
    function adjustLightness(color, add) {
        var obj = new ColorObject(color);
        obj.lightness += add;
        return obj.color;
    }
    exports.adjustLightness = adjustLightness;
    function adjustSaturation(color, add) {
        var obj = new ColorObject(color);
        obj.saturation += add;
        return obj.color;
    }
    exports.adjustSaturation = adjustSaturation;
    function changeHue(color, replaceWith) {
        var obj = new ColorObject(color);
        obj.hue = replaceWith;
        return obj.color;
    }
    exports.changeHue = changeHue;
    var ColorObject = (function () {
        function ColorObject(color) {
            color = parseColor(color);
            this.color = color;
        }
        ColorObject.prototype.toNumber = function () {
            return this.color;
        };
        ColorObject.prototype.setColorFromString = function (color) {
            this.color = parseColor(color);
        };
        Object.defineProperty(ColorObject.prototype, "color", {
            get: function () {
                return Math.floor(this.R) * 0x010000 + Math.floor(this.G) * 0x0100 + Math.floor(this.B);
            },
            set: function (n) {
                this.R = Math.floor(n / 0x010000);
                this.G = Math.floor((n % 0x010000) / 0x000100);
                this.B = Math.floor(n % 0x000100);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorObject.prototype, "hue", {
            get: function () {
                return this.toHSL()[0];
            },
            set: function (n) {
                var hsl = this.toHSL();
                hsl[0] = n;
                this.fromHSL(hsl);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorObject.prototype, "saturation", {
            get: function () {
                return this.toHSL()[1];
            },
            set: function (n) {
                var hsl = this.toHSL();
                hsl[1] = n;
                this.fromHSL(hsl);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorObject.prototype, "lightness", {
            get: function () {
                var lightness = this.toHSL()[2];
                return lightness;
            },
            set: function (n) {
                var hsl = this.toHSL();
                hsl[2] = n;
                this.fromHSL(hsl);
            },
            enumerable: true,
            configurable: true
        });
        ColorObject.prototype.toHSL = function () {
            var r = this.R / 255;
            var g = this.G / 255;
            var b = this.B / 255;
            var maxC = Math.max(r, g, b);
            var minC = Math.min(r, g, b);
            var c = maxC - minC;
            var h;
            var s;
            var l;
            l = (maxC + minC) / 2;
            if (c === 0) {
                h = 0;
                s = 0;
            }
            else {
                switch (maxC) {
                    case r:
                        h = ((g - b) / c) % 6;
                        break;
                    case g:
                        h = (b - r) / c + 2;
                        break;
                    case b:
                        h = (r - g) / c + 4;
                        break;
                }
                h *= 60;
                if (h < 0) {
                    h += 360;
                }
                s = c / (1 - Math.abs(2 * l - 1));
            }
            return [h, s * 100, l * 100];
        };
        ColorObject.prototype.fromHSL = function (_a) {
            var h = _a[0], s = _a[1], l = _a[2];
            h /= 360;
            s /= 100;
            l /= 100;
            h = Math.max(0, Math.min(1, h));
            s = Math.max(0, Math.min(1, s));
            l = Math.max(0, Math.min(1, l));
            if (s === 0) {
                this.R = this.G = this.B = l * 255;
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                this.R = this.hue2rgb(p, q, h + 1 / 3) * 255;
                this.G = this.hue2rgb(p, q, h) * 255;
                this.B = this.hue2rgb(p, q, h - 1 / 3) * 255;
            }
            return this.color;
        };
        ColorObject.prototype.hue2rgb = function (p, q, t) {
            if (t < 0) {
                t += 1;
            }
            else if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            else if (t < 1 / 2) {
                return q;
            }
            else if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            else {
                return p;
            }
        };
        return ColorObject;
    }());
    exports.ColorObject = ColorObject;
    function parseColor(color) {
        if (typeof color === 'string') {
            var hashI = color.indexOf("#");
            if (hashI >= 0) {
                color = color.substr(hashI + 1);
                var c = parseInt("0x" + color, 16);
                return parseInt("0x" + color, 16);
            }
            else {
                return parseInt(color, 10);
            }
        }
        return color;
    }
    exports.parseColor = parseColor;
});
define("JMGE/effects/Laser", ["require", "exports", "JMGE/JMBL", "JMGE/others/Colors"], function (require, exports, JMBL, Colors) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Laser = (function (_super) {
        __extends(Laser, _super);
        function Laser(origin, target, color, thickness, parent) {
            if (color === void 0) { color = 0xffffff; }
            if (thickness === void 0) { thickness = 1; }
            var _this = _super.call(this) || this;
            if (parent)
                parent.addChild(_this);
            _this.lineStyle(thickness * 2, Colors.adjustLightness(color, 0.3));
            _this.moveTo(origin.x, origin.y);
            _this.lineTo(target.x, target.y);
            _this.lineStyle(thickness, color);
            _this.lineTo(origin.x, origin.y);
            _this.alpha = 2;
            JMBL.tween.to(_this, 30, { alpha: 0 }, { onComplete: function () { return _this.destroy(); } });
            return _this;
        }
        return Laser;
    }(PIXI.Graphics));
    exports.Laser = Laser;
});
define("Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CONFIG = {
        INIT: {
            SCREEN_WIDTH: 500,
            SCREEN_HEIGHT: 500,
            STAGE_WIDTH: 560,
            STAGE_HEIGHT: 560,
            RESOLUTION: 1,
            BACKGROUND_COLOR: 0,
            MOUSE_HOLD: 200,
            FPS: 60,
        },
        TILEMAP: {
            TILE_SIZE: 30,
        },
        GAME: {
            skillPerLevel: 0.2,
        },
        toPS: function (n) {
            return Math.floor(exports.CONFIG.INIT.FPS * 10 / n) / 10;
        },
        fromPS: function (n) {
            return Math.floor(n / exports.CONFIG.INIT.FPS * 10) / 10;
        },
        toDur: function (n) {
            return Math.floor(n * 10 / exports.CONFIG.INIT.FPS) / 10;
        },
        pixelToTile: function (n, minusHalf) {
            if (minusHalf === void 0) { minusHalf = true; }
            return Math.floor(n * 10 / exports.CONFIG.TILEMAP.TILE_SIZE - (minusHalf ? 5 : 0)) / 10;
        },
        toTPS: function (n) {
            return Math.floor(n * exports.CONFIG.INIT.FPS / exports.CONFIG.TILEMAP.TILE_SIZE * 10) / 10;
        },
    };
});
define("game/GameUI", ["require", "exports", "Config", "JMGE/JMBL", "JMGE/effects/FlyingText", "JMGE/JMBUI", "game/data/Misc"], function (require, exports, Config_1, JMBL, FlyingText_1, JMBUI_1, Misc_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameUI = (function (_super) {
        __extends(GameUI, _super);
        function GameUI() {
            var _this = _super.call(this) || this;
            _this.update = function () {
            };
            _this.updateProgress = function (e) {
                var progress = Math.min(100, Math.round(e.current / e.total * 100));
                _this.progress.text = String(progress) + "%";
            };
            _this.updateText = function (s) {
                _this.wordDisplay.text = s;
            };
            _this.showMinusText = function () {
                new FlyingText_1.FlyingText("-1", { fontFamily: "Arial", fontSize: 14, fill: 0xff0000 }, _this.wordDisplay.x + _this.wordDisplay.width, _this.wordDisplay.y, _this);
            };
            _this.setScore = function (score) {
                _this.score.text = String(score);
            };
            _this.setPlayerHealth = function (i) {
                _this.healthBar.setValue(i, 5);
            };
            _this.addHealWord = function (healWord) {
                _this.addChild(healWord);
                healWord.x = _this.healthBar.x + _this.healthBar.getWidth();
                healWord.y = _this.healthBar.y + _this.healthBar.getHeight();
            };
            _this.wordDisplay = new PIXI.Text("", { fontSize: 16, fontFamily: "Arial", fill: 0xffaaaa, stroke: 0, strokeThickness: 2 });
            _this.addChild(_this.wordDisplay);
            _this.wordDisplay.y = Config_1.CONFIG.INIT.SCREEN_HEIGHT - 50;
            _this.progress = new PIXI.Text("", { fontSize: 16, fontFamily: "Arial", fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
            _this.addChild(_this.progress);
            _this.progress.y = Config_1.CONFIG.INIT.SCREEN_HEIGHT - 50;
            _this.progress.x = Config_1.CONFIG.INIT.SCREEN_WIDTH - 100;
            _this.score = new PIXI.Text("0", { fontSize: 16, fontFamily: "Arial", fill: 0xaaffaa, stroke: 0, strokeThickness: 2 });
            _this.score.y = Config_1.CONFIG.INIT.SCREEN_HEIGHT - 100;
            _this.addChild(_this.score);
            _this.healthBar = new JMBUI_1.Gauge(0xff0000);
            _this.healthBar.x = (Config_1.CONFIG.INIT.SCREEN_WIDTH - _this.healthBar.getWidth()) / 2;
            _this.healthBar.y = Config_1.CONFIG.INIT.SCREEN_HEIGHT - 50;
            _this.addChild(_this.healthBar);
            JMBL.events.ticker.add(_this.update);
            JMBL.events.add(Misc_2.GameEvents.NOTIFY_UPDATE_INPUT_WORD, _this.updateText);
            JMBL.events.add(Misc_2.GameEvents.NOTIFY_LETTER_DELETED, _this.showMinusText);
            JMBL.events.add(Misc_2.GameEvents.NOTIFY_SET_SCORE, _this.setScore);
            JMBL.events.add(Misc_2.GameEvents.NOTIFY_SET_PROGRESS, _this.updateProgress);
            JMBL.events.add(Misc_2.GameEvents.NOTIFY_SET_HEALTH, _this.setPlayerHealth);
            return _this;
        }
        GameUI.prototype.dispose = function () {
            JMBL.events.ticker.remove(this.update);
            JMBL.events.remove(Misc_2.GameEvents.NOTIFY_UPDATE_INPUT_WORD, this.updateText);
            JMBL.events.remove(Misc_2.GameEvents.NOTIFY_LETTER_DELETED, this.showMinusText);
            JMBL.events.remove(Misc_2.GameEvents.NOTIFY_SET_SCORE, this.setScore);
            JMBL.events.remove(Misc_2.GameEvents.NOTIFY_SET_PROGRESS, this.updateProgress);
            JMBL.events.remove(Misc_2.GameEvents.NOTIFY_SET_HEALTH, this.setPlayerHealth);
            this.destroy();
        };
        return GameUI;
    }(PIXI.Container));
    exports.GameUI = GameUI;
});
define("game/objects/Shield", ["require", "exports", "JMGE/JMBL"], function (require, exports, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Shield = (function (_super) {
        __extends(Shield, _super);
        function Shield() {
            var _this = _super.call(this) || this;
            _this.beginFill(0x00aaff, 0.5);
            _this.drawCircle(0, 0, 100);
            _this.alpha = 0;
            return _this;
        }
        Shield.prototype.fadeIn = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.alpha = 0;
            JMBL.tween.to(this, 13, { alpha: alpha });
        };
        Shield.prototype.fadeTo = function (alpha) {
            JMBL.tween.to(this, 13, { alpha: alpha });
        };
        Shield.prototype.fadeOut = function () {
            var _this = this;
            JMBL.tween.to(this, 13, { alpha: 0 }, { onComplete: function () { return _this.parent.removeChild(_this); } });
        };
        return Shield;
    }(PIXI.Graphics));
    exports.Shield = Shield;
});
define("game/objects/Turret", ["require", "exports", "game/objects/GameSprite", "GraphicData", "game/data/Misc"], function (require, exports, GameSprite_1, GraphicData_1, Misc_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Turret = (function (_super) {
        __extends(Turret, _super);
        function Turret() {
            var _this = _super.call(this) || this;
            _this.wordSize = 3;
            _this.addWord(3, 0);
            _this.killBy = Misc_3.ActionType.LASER;
            _this.makeDisplay(GraphicData_1.ImageRepo.turret, 0.1);
            return _this;
        }
        Turret.prototype.targetInRange = function (target) {
            this.rotation = Math.atan2(target.y - (this.y + this.parent.y), target.x - (this.x + this.parent.x));
            if (Math.sqrt((target.y - this.parent.y) * (target.y - this.parent.y) + (target.x - this.parent.x) * (target.x - this.parent.x)) < 100) {
                return true;
            }
            else {
                return false;
            }
        };
        return Turret;
    }(GameSprite_1.GameSprite));
    exports.Turret = Turret;
});
define("game/objects/GameSprite", ["require", "exports", "game/objects/BaseObject", "game/objects/Shield"], function (require, exports, BaseObject_1, Shield_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Animation;
    (function (Animation) {
        Animation[Animation["IDLE"] = 0] = "IDLE";
        Animation[Animation["FIRE"] = 1] = "FIRE";
        Animation[Animation["CHARGE"] = 2] = "CHARGE";
        Animation[Animation["MIDLE"] = 3] = "MIDLE";
        Animation[Animation["LIDLE"] = 4] = "LIDLE";
        Animation[Animation["EIDLE"] = 5] = "EIDLE";
        Animation[Animation["MFIRE"] = 6] = "MFIRE";
        Animation[Animation["LFIRE"] = 7] = "LFIRE";
        Animation[Animation["EFIRE"] = 8] = "EFIRE";
        Animation[Animation["MCHANGE"] = 9] = "MCHANGE";
        Animation[Animation["LCHANGE"] = 10] = "LCHANGE";
        Animation[Animation["ECHANGE"] = 11] = "ECHANGE";
        Animation[Animation["LCHARGE"] = 12] = "LCHARGE";
        Animation[Animation["ECHARGE"] = 13] = "ECHARGE";
        Animation[Animation["MIN"] = 14] = "MIN";
        Animation[Animation["MOUT"] = 15] = "MOUT";
        Animation[Animation["LIN"] = 16] = "LIN";
        Animation[Animation["LOUT"] = 17] = "LOUT";
        Animation[Animation["EIN"] = 18] = "EIN";
        Animation[Animation["EOUT"] = 19] = "EOUT";
    })(Animation = exports.Animation || (exports.Animation = {}));
    var GameSprite = (function (_super) {
        __extends(GameSprite, _super);
        function GameSprite() {
            var _this = _super.call(this) || this;
            _this.vX = 0;
            _this.vY = 0;
            _this.vT = 0;
            _this.walkMult = 1;
            _this.legFrame = 0;
            _this.torsoFrame = 0;
            _this.frame = 0;
            _this.cAnim = Animation.IDLE;
            _this.health = 1;
            _this.shieldView = new Shield_1.Shield();
            _this.firePoint = new PIXI.Point(0, 0);
            _this.update = function (speed) {
                return;
            };
            _this.addChild(_this.shieldView);
            return _this;
        }
        GameSprite.prototype.getFirePoint = function () {
            var cos = Math.cos(this.rotation);
            var sin = Math.sin(this.rotation);
            var x = this.x + this.firePoint.x * cos - this.firePoint.y * sin;
            var y = this.y + this.firePoint.x * sin + this.firePoint.y * cos;
            return new PIXI.Point(x, y);
        };
        GameSprite.prototype.moreUpdate = function () {
            return true;
        };
        GameSprite.prototype.homeTarget = function (_target) {
            var tDiff = Math.atan2(_target.y - this.y, _target.x - this.x) - this.n;
            while (tDiff < (0 - Math.PI)) {
                tDiff += 2 * Math.PI;
            }
            while (tDiff > Math.PI) {
                tDiff -= 2 * Math.PI;
            }
            if (tDiff > 0) {
                this.n += (tDiff > this.turnRate) ? this.turnRate : tDiff;
            }
            else if (tDiff < 0) {
                this.n += (tDiff < -this.turnRate) ? (0 - this.turnRate) : tDiff;
            }
            else {
                return;
            }
        };
        GameSprite.prototype.addShield = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.shieldOn = true;
            this.shieldView.fadeIn(alpha);
        };
        GameSprite.prototype.shieldTo = function (alpha) {
            this.shieldOn = true;
            this.shieldView.fadeTo(alpha);
        };
        GameSprite.prototype.removeShield = function () {
            if (this.shieldOn) {
                this.shieldOn = false;
                this.shieldView.fadeOut();
            }
        };
        return GameSprite;
    }(BaseObject_1.BaseObject));
    exports.GameSprite = GameSprite;
});
define("game/engine/ObjectManager", ["require", "exports", "JMGE/JMBL", "JMGE/effects/FlyingText", "JMGE/effects/Firework", "JMGE/effects/Laser", "game/GameUI", "Config", "game/data/Misc", "game/text/TextObject"], function (require, exports, JMBL, FlyingText_2, Firework_1, Laser_1, GameUI_1, Config_2, Misc_4, TextObject_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayLayer;
    (function (DisplayLayer) {
        DisplayLayer[DisplayLayer["DEFAULT"] = 0] = "DEFAULT";
        DisplayLayer[DisplayLayer["EXPLOSIONS"] = 1] = "EXPLOSIONS";
        DisplayLayer[DisplayLayer["ENEMIES"] = 2] = "ENEMIES";
        DisplayLayer[DisplayLayer["PROJECTILES"] = 3] = "PROJECTILES";
        DisplayLayer[DisplayLayer["TEXT"] = 4] = "TEXT";
    })(DisplayLayer = exports.DisplayLayer || (exports.DisplayLayer = {}));
    var ObjectManager = (function (_super) {
        __extends(ObjectManager, _super);
        function ObjectManager() {
            var _this = _super.call(this) || this;
            _this.objects = [];
            _this.layers = [];
            _this.objectsByLayer = [];
            _this.gameUI = new GameUI_1.GameUI;
            _this.updateAll = function (param) {
                for (var i = 0; i < _this.objects.length; i += 1) {
                    if (_this.objects[i].toDestroy) {
                        _this.removeObjectAt(i, true);
                        i -= 1;
                    }
                    else {
                        _this.objects[i].update(param);
                    }
                }
                for (var i = 0; i < TextObject_2.TextObject.allTextObjects.length; i++) {
                    var object = TextObject_2.TextObject.allTextObjects[i];
                    if (object.following) {
                        if (object.following.toDestroy) {
                            var text = object.getText();
                            if (text) {
                                JMBL.events.publish(Misc_4.GameEvents.REQUEST_OVERFLOW_WORD, text);
                            }
                            object.remove();
                            i--;
                        }
                        else {
                            if (!object.parent) {
                                _this.layers[DisplayLayer.TEXT].addChild(object);
                            }
                            object.update();
                        }
                    }
                }
            };
            _this.newLayer();
            _this.newLayer();
            _this.newLayer();
            _this.newLayer();
            _this.addChild(_this.gameUI);
            _this.newLayer();
            return _this;
        }
        ObjectManager.prototype.dispose = function () {
            while (this.layers.length > 0) {
                this.layers.shift().destroy();
            }
            this.objectsByLayer = null;
            while (this.objects.length > 0) {
                this.objects[0].dispose();
                this.objects.shift().destroy();
            }
            this.gameUI.dispose();
            this.destroy();
        };
        ObjectManager.prototype.newLayer = function () {
            var layer = new PIXI.Container;
            layer.x = layer.y = (Config_2.CONFIG.INIT.SCREEN_WIDTH - Config_2.CONFIG.INIT.STAGE_WIDTH) / 2;
            this.layers.push(layer);
            this.addChild(layer);
            this.objectsByLayer.push([]);
        };
        ObjectManager.prototype.addObject = function (object, layer, top) {
            if (layer === void 0) { layer = DisplayLayer.DEFAULT; }
            if (top === void 0) { top = true; }
            if (top) {
                this.layers[layer].addChild(object);
            }
            else {
                this.layers[layer].addChildAt(object, 0);
            }
            this.objects.push(object);
            this.objectsByLayer[object.layer].push(object);
            object.layer = layer;
            return object;
        };
        ObjectManager.prototype.removeObject = function (object, andDestroy) {
            return this.removeObjectAt(this.getObjectIndex(object), andDestroy);
        };
        ObjectManager.prototype.removeObjectAt = function (i, andDestroy) {
            var object = this.objects[i];
            if (andDestroy) {
                object.dispose();
                object.destroy();
            }
            this.objects.splice(i, 1);
            JMBL.utils.pull(object, this.objectsByLayer[object.layer]);
            return object;
        };
        ObjectManager.prototype.numObjects = function (layer) {
            if (layer === void 0) { layer = null; }
            if (layer) {
                return this.objectsByLayer[layer].length;
            }
            return this.objects.length;
        };
        ObjectManager.prototype.getObjectAt = function (i) {
            return this.objects[i];
        };
        ObjectManager.prototype.getObjectIndex = function (object) {
            for (var i = 0; i < this.objects.length; i += 1) {
                if (this.objects[i] === object) {
                    return i;
                }
            }
            return -1;
        };
        ObjectManager.prototype.getClosestObject = function (point, maxDist, filter) {
            if (filter === void 0) { filter = {}; }
            var objects;
            if (filter.layer) {
                if (this.objectsByLayer[filter.layer] == null)
                    return;
                objects = this.objectsByLayer[filter.layer];
            }
            else
                objects = this.objects;
            var m = null;
            var distance = maxDist;
            var distance2 = 0;
            main: for (var i = 0; i < objects.length; i += 1) {
                var object = objects[i];
                if (filter.notThis && filter.notThis === object)
                    continue main;
                if (filter.has) {
                    for (var v in filter.has) {
                        if (object[v] !== filter.has[v])
                            continue main;
                    }
                }
                if (filter.greater) {
                    for (var v in filter.greater) {
                        if (object[v] <= filter.greater[v])
                            continue main;
                    }
                }
                if (filter.less) {
                    for (var v in filter.less) {
                        if (object[v] >= filter.less[v])
                            continue main;
                    }
                }
                if (filter.not) {
                    for (var v in filter.not) {
                        if (object[v] === filter.not[v])
                            continue main;
                    }
                }
                distance2 = objects[i].getDistance(point);
                if (distance2 <= distance) {
                    distance = distance2;
                    m = objects[i];
                }
            }
            return m;
        };
        ObjectManager.prototype.forEach = function (_function, layer) {
            if (layer === void 0) { layer = -1; }
            if (layer >= 0) {
                this.objectsByLayer[layer].forEach(_function);
            }
            else {
                this.objects.forEach(_function);
            }
        };
        ObjectManager.prototype.makeScoreDisplay = function (x, y, value) {
            if (value > 0) {
                new FlyingText_2.FlyingText("+" + String(value), { fontFamily: "Arial", fontSize: 14 + value / 20, fill: 0x00ff00 }, x, y, this.layers[DisplayLayer.TEXT]);
            }
            else if (value < 0) {
                new FlyingText_2.FlyingText(String(value), { fontFamily: "Arial", fontSize: 14 - value / 20, fill: 0xff0000 }, x, y, this.layers[DisplayLayer.TEXT]);
            }
        };
        ObjectManager.prototype.makeExplosionAt = function (x, y, size) {
            if (size === void 0) { size = 40; }
            new Firework_1.Firework(this.layers[DisplayLayer.EXPLOSIONS], x, y, size);
        };
        ObjectManager.prototype.makeLaser = function (origin, target, color) {
            new Laser_1.Laser(origin.getFirePoint(), target, color, 1, this.layers[DisplayLayer.PROJECTILES]);
        };
        ObjectManager.prototype.makeEMP = function (origin, target) {
            new Laser_1.Laser(origin.getFirePoint(), target, 0x99ffff, 3, this.layers[DisplayLayer.PROJECTILES]);
        };
        return ObjectManager;
    }(PIXI.Container));
    exports.ObjectManager = ObjectManager;
});
define("JMGE/effects/Starfield", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Starfield = (function (_super) {
        __extends(Starfield, _super);
        function Starfield(canvasWidth, canvasHeight) {
            var _this = _super.call(this) || this;
            _this.canvasWidth = canvasWidth;
            _this.canvasHeight = canvasHeight;
            _this.stars = [];
            _this.objects = [];
            _this.back = new PIXI.Graphics();
            _this.setBack(0);
            _this.addChild(_this.back);
            for (var i = 0; i < 40; i += 1) {
                _this.stars.push(new Star(1 + Math.random() * 1, Math.floor(Math.random() * _this.canvasWidth), Math.random() * _this.canvasHeight));
            }
            _this.nebTick = 9000;
            return _this;
        }
        Starfield.prototype.setBack = function (i) {
        };
        Starfield.prototype.spawnStar = function () {
            var newStar = new Star(1 + Math.random() * 3, Math.floor(Math.random() * this.canvasWidth));
            this.stars.push(newStar);
            this.addChild(newStar);
        };
        Starfield.prototype.spawnNebula = function () {
        };
        Starfield.prototype.update = function (speed) {
            var spawn = speed * 0.3;
            while (spawn > 1) {
                spawn -= 1;
                this.spawnStar();
            }
            if (Math.random() < spawn) {
                this.spawnStar();
            }
            if (this.nebTick > 10000 / speed) {
                this.spawnNebula();
                this.nebTick = 0;
            }
            else {
                this.nebTick += 1;
            }
            var i = 0;
            while (i < this.stars.length) {
                this.stars[i].y += this.stars[i].v * speed;
                if (this.stars[i].y > this.canvasHeight) {
                    this.removeChild(this.stars[i]);
                    this.stars.splice(i, 1);
                }
                else {
                    i += 1;
                }
            }
            i = 0;
            while (i < this.objects.length) {
                this.objects[i].y += speed * 0.6;
                if (this.objects[i].y > this.canvasHeight) {
                    this.objects[i].parent.removeChild(this.objects[i]);
                    this.objects.splice(i, 1);
                }
                else {
                    i += 1;
                }
            }
            i = 0;
        };
        return Starfield;
    }(PIXI.Container));
    exports.Starfield = Starfield;
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(v, x, y) {
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this.v = v;
            _this.x = x;
            _this.y = y;
            _this.beginFill(0xffffff);
            _this.drawCircle(0, 0, v / 2);
            return _this;
        }
        return Star;
    }(PIXI.Graphics));
});
define("game/data/LevelData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventType;
    (function (EventType) {
        EventType[EventType["LOOP"] = 0] = "LOOP";
        EventType[EventType["WAIT"] = 1] = "WAIT";
        EventType[EventType["JUMP"] = 2] = "JUMP";
        EventType[EventType["SPAWN"] = 3] = "SPAWN";
        EventType[EventType["BOSS"] = 4] = "BOSS";
    })(EventType = exports.EventType || (exports.EventType = {}));
    function getLevel(level, wpm) {
        if (wpm === void 0) { wpm = 60; }
        var pack = new MethodPack(Math.max(1 - wpm / 300, 0.5));
        switch (level) {
            case -1:
                pack.boss(0.01, 0);
                break;
            case 0:
                pack.missile("sn", 0.05, 5, 0, 5, 6, 4, 12);
                pack.mirror();
                pack.missile("sn", 0.15, 0, 3, 7, 3, 12, 3);
                pack.missile("sn", 0.01, 12, 6, 5, 6, 0, 6);
                pack.repeat(0.01, 3, 2);
                pack.laser("sn", 0.1, 6, 0);
                pack.missile("sn", 0.1, 3, 0, 7, 5, 4, 5, 7, 0);
                pack.repeat(0.01, 5);
                pack.laser("sn", 0, 12, 5);
                pack.missile("sn", 0.13, 2, 0, 2, 4, 12, 9);
                pack.repeat(0.01, 7, 1, true);
                pack.laser("sn", 0, 0, 6);
                pack.insert(-4);
                pack.laser("sn", 0, 12, 6);
                pack.insert(-4);
                pack.laser("sn", 0.15, 0, 3);
                pack.laser("sn", 0.005, 12, 3);
                pack.laser("sn", 0.005, 0, 6);
                pack.laser("sn", 0.005, 12, 6);
                pack.missile("sn", 0.13, 3, 0, 4, 4, 7, 0);
                pack.missile("sn", 0.01, 12, 5, 7, 6, 0, 5);
                pack.repeat(0.02, 4, 2);
                pack.laser("sn", 0.04, 0, 2);
                pack.laser("sn", 0.01, 12, 2);
                pack.laser("sn", 0.02, 0, 4);
                pack.laser("sn", 0.01, 12, 4);
                pack.missile("sn", 0.07, 9, 0, 8, 4, 5, 0);
                pack.missile("sn", 0.01, 0, 5, 5, 6, 12, 5);
                pack.repeat(0.02, 4, 2);
                break;
            case 1:
                pack.missile("sn", 0.1, 4, 0, 4, 7, 0, 12);
                pack.missile("sn", 0, 2, 0, 2, 6, 0, 9);
                pack.repeat(0, 1, 2, true);
                pack.missile("sn", 0.12, 0, 3, 7, 3, 12, 3);
                pack.offset(0, 0, 1);
                pack.repeat(0.015, 1, 2);
                pack.missile("sn", 0.02, 12, 5, 5, 5, 0, 5);
                pack.offset(0, 0, 1);
                pack.repeat(0.015, 1, 2);
                pack.laser("ss", 0, 6, 0);
                pack.suicide("mn", 0.14, 3, 0, 3, 3);
                pack.repeat(0.008, 3, 1, true);
                pack.suicide("mn", 0.1, 0, 2, 8, 2);
                pack.mirror(0.005);
                pack.suicide("mn", 0.03, 3, 0, 3, 3);
                pack.mirror(0.001);
                pack.repeat(0.01, 5, 4);
                pack.missile("sn", 0.15, 0, 3, 7, 4, 12, 7);
                pack.repeat(0.02, 9, 1, true);
                pack.laser("ss", 0, 4, 0);
                pack.insert(-6);
                pack.laser("ss", 0, 8, 0);
                pack.insert(-2);
                pack.suicide("mn", 0.05, 1, 0, 4, 4);
                pack.repeat(0.01, 3, 1, true);
                pack.laser("ss", 0.12, 0, 3);
                pack.laser("ss", 0.005, 12, 3);
                pack.laser("ss", 0.01, 0, 6);
                pack.laser("ss", 0.005, 12, 6);
                pack.missile("sn", 0.18, 2, 0, 2, 6, 0, 7);
                pack.missile("sn", 0, 3, 0, 3, 6, 12, 9);
                pack.repeat(0.03, 4, 2, true);
                pack.suicide("mn", 0.04, 0, 3, 4, 5);
                pack.repeat(0.005, 3, 1, true);
                pack.laser("sn", 0.13, 0, 3);
                pack.laser("sn", 0.005, 12, 3);
                pack.laser("sn", 0.01, 0, 6);
                pack.laser("sn", 0.005, 12, 6);
                pack.suicide("mn", 0.025, 2, 12, 3, 4);
                pack.repeat(0.005, 7, 1, true);
                pack.suicide("mn", 0.2, 0, 7, 3, 6);
                pack.mirror();
                pack.suicide("mn", 0.01, 0, 2, 6, 3);
                pack.mirror();
                pack.suicide("mn", 0.01, 0, 4, 4, 3);
                pack.mirror();
                pack.suicide("mn", 0.01, 5, 0, 5, 1);
                pack.mirror();
                pack.missile("sn", 0.12, 3, 0, 6, 7, 12, 8);
                pack.repeat(0.02, 11, 1, true);
                pack.laser("ss", 0, 0, 6);
                pack.insert(-7);
                pack.laser("ss", 0, 12, 6);
                pack.insert(-3);
                pack.laser("mn", 0, 6, 0);
                pack.suicide("mn", 0.03, 0, 2, 6, 3);
                pack.repeat(0.01, 3, 1, true);
                break;
            case 2:
                pack.missile("sn", 0.1, 6, 0, 6, 5, 0, 9);
                pack.repeat(0.01, 5, 1, true);
                pack.missile("sn", 0.1, 0, 1, 5, 4, 0, 8);
                pack.mirror();
                pack.repeat(0.03, 3, 2, true);
                pack.laser("sn", 0, 0, 6);
                pack.insert(-6);
                pack.laser("sn", 0, 12, 6);
                pack.insert(-4);
                pack.laser("mn", 0, 6, 0);
                pack.missile("sn", 0.17, 3, 0, 3, 4, 12, 11);
                pack.missile("sn", 0, 4, 0, 5, 4, 8, 0);
                pack.repeat(0.025, 3, 2);
                pack.laser("sn", 0.01, 2, 0);
                pack.mirror();
                pack.missile("sn", 0.09, 12, 3, 8, 3, 1, 12);
                pack.missile("sn", 0, 12, 4, 8, 5, 12, 8);
                pack.repeat(0.025, 3, 2);
                pack.laser("sn", 0.01, 0, 6);
                pack.mirror();
                pack.suicide("mn", 0.09, 0, 3, 3, 3);
                pack.repeat(0.01, 3);
                pack.laser("sn", 0.13, 0, 3);
                pack.mirror();
                pack.laser("mn", 0, 6, 0);
                pack.laser("sn", 0.01, 0, 6);
                pack.mirror();
                pack.missile("sn", 0.18, 2, 0, 2, 7, 2, 12);
                pack.offset(0, 1, 0);
                pack.repeat(0.015, 1, 2);
                pack.repeat(0.05, 1, 4, true);
                pack.laser("mn", 0, 0, 4);
                pack.missile("sn", 0.05, 0, 2, 7, 2, 12, 2);
                pack.offset(0, 0, 1);
                pack.repeat(0.015, 1, 2);
                pack.laser("mn", 0, 12, 4);
                pack.missile("sn", 0.05, 12, 5, 5, 5, 0, 5);
                pack.offset(0, 0, 1);
                pack.repeat(0.015, 1, 2);
                pack.missile("sn", 0.2, 0, 12, 4, 4, 12, 9);
                pack.repeat(0.006, 3, 1, true);
                pack.laser("mn", 0.01, 4, 0);
                pack.mirror(0.01);
                pack.suicide("mn", 0.05, 0, 3, 3, 3);
                pack.repeat(0.015, 7, 1, true);
                pack.laser("mn", 0.15, 0, 7);
                pack.mirror();
                pack.laser("sn", 0.015, 0, 4);
                pack.mirror();
                pack.laser("mn", 0.02, 3, 0);
                pack.mirror();
                pack.laser("sn", 0.015, 5, 0);
                pack.mirror();
                pack.missile("sn", 0.2, 6, 0, 6, 4, 0, 0);
                pack.mirror(0.027);
                pack.missile("sn", 0.027, 6, 0, 6, 6, 0, 9);
                pack.mirror(0.028);
                pack.repeat(0.028, 4, 4);
                pack.laser("sn", 0, 0, 3);
                pack.insert(-18);
                pack.laser("sn", 0, 12, 3);
                pack.insert(-15);
                pack.laser("sn", 0, 0, 6);
                pack.insert(-12);
                pack.laser("sn", 0, 12, 6);
                pack.insert(-9);
                pack.laser("mn", 0, 3, 0);
                pack.insert(-6);
                pack.laser("mn", 0, 9, 0);
                pack.insert(-3);
                pack.suicide("ms", 0.08, 0, 12, 3, 4);
                pack.repeat(0.015, 7, 1, true);
                break;
            case 3:
                pack.missile("sn", 0.1, 0, 3, 3, 5, 8, 0);
                pack.repeat(0.02, 5, 1, true);
                pack.laser("ss", 0.02, 5, 0);
                pack.mirror(0.02);
                pack.suicide("mn", 0.02, 0, 2, 6, 3);
                pack.mirror(0.02);
                pack.suicide("mn", 0.02, 0, 4, 6, 5);
                pack.mirror(0.02);
                pack.repeat(0.02, 1, 4);
                pack.laser("ms", 0.02, 0, 2);
                pack.mirror(0.02);
                pack.boss(0.2, 0);
                break;
            case 4:
                pack.missile("sn", 0.05, 5, 0, 5, 6, 4, 12);
                pack.mirror();
                pack.missile("sn", 0.15, 0, 3, 7, 3, 12, 3);
                pack.missile("sn", 0.01, 12, 6, 5, 6, 0, 6);
                pack.repeat(0.01, 3, 2);
                pack.laser("ss", 0.03, 3, 0);
                pack.mirror();
                pack.laser("ss", 0.02, 0, 9);
                pack.mirror();
                pack.missile("sn", 0.25, 6, 0, 6, 5, 0, 10);
                pack.repeat(0.015, 7, 1, true);
                pack.laser("ss", 0.015, 0, 3);
                pack.mirror();
                pack.missile("sn", 0.015, 1, 0, 5, 4, 12, 5);
                pack.repeat(0.015, 5, 1, true);
                pack.laser("ss", 0.02, 3, 0);
                pack.mirror();
                pack.missile("sn", 0.2, 5, 0, 5, 6, 1, 12);
                pack.mirror();
                pack.repeat(0.03, 3, 2);
                pack.laser("ms", 0.03, 0, 9);
                pack.mirror();
                pack.laser("ms", 0.25, 6, 0);
                pack.laser("ss", 0.01, 0, 3);
                pack.mirror(0.01);
                pack.offset(0.02, 0, 3);
                pack.mirror(0.02);
                pack.suicide("sn", 0.25, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.suicide("sn", 0.028, 3, 0, 3, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.repeat(0.028, 3, 7);
                pack.missile("sn", 0.25, 0, 4, 3, 6, 6, 0);
                pack.repeat(0.03, 11, 1, true);
                pack.laser("ss", 0, 2, 0);
                pack.insert(-9);
                pack.laser("ss", 0, 4, 0);
                pack.insert(-6);
                pack.laser("ss", 0, 10, 0);
                pack.insert(-3);
                pack.laser("ss", 0, 8, 0);
                pack.missile("sn", 0.25, 12, 2, 7, 3, 0, 2);
                pack.missile("sn", 0.015, 1, 12, 5, 6, 12, 8);
                pack.repeat(0.03, 5, 2);
                pack.laser("ms", 0, 0, 6);
                pack.insert(-8);
                pack.laser("ms", 0, 12, 6);
                pack.insert(-6);
                pack.laser("ms", 0, 6, 0);
                pack.insert(-4);
                break;
            case 5:
                pack.missile("ss", 0.05, 5, 0, 5, 4, 2, 0);
                pack.mirror();
                pack.repeat(0.03, 1, 2);
                pack.missile("sn", 0.03, 5, 0, 5, 4, 2, 0);
                pack.mirror();
                pack.repeat(0.03, 1, 2);
                pack.missile("ss", 0.1, 6, 0, 6, 5, 0, 10);
                pack.repeat(0.06, 5, 1, true);
                pack.missile("sn", 0, 1, 0, 2, 4, 3, 0);
                pack.missile("sn", 0, 2, 0, 3, 4, 4, 0);
                pack.repeat(0, 1, 2);
                pack.insert(-10);
                pack.insert(-9);
                pack.insert(-7);
                pack.insert(-6);
                pack.missile("sn", 0, 12, 1, 8, 2, 12, 3);
                pack.missile("sn", 0, 12, 2, 8, 3, 12, 4);
                pack.repeat(0, 1, 2);
                pack.insert(-6);
                pack.insert(-5);
                pack.insert(-3);
                pack.insert(-2);
                pack.missile("ss", 0.15, 9, 0, 9, 6, 9, 12);
                pack.offset(0, 1);
                pack.missile("mn", 0.02, 2, 0, 2, 6, 2, 12);
                pack.offset(0, 2);
                pack.missile("sn", 0.04, 0, 2, 5, 4, 12, 7);
                pack.repeat(0.01, 3, 1, true);
                pack.missile("sn", 0.15, 1, 0, 1, 6, 1, 12);
                pack.offset(0, 1);
                pack.repeat(0.04, 1, 2);
                pack.missile("mn", 0.02, 10, 0, 10, 6, 10, 12);
                pack.repeat(0.03, 3, 3);
                pack.laser("ms", 0, 5, 0);
                pack.mirror();
                pack.insert(-4);
                pack.suicide("sn", 0.32, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.repeat(0.035, 7, 4, true);
                pack.missile("ss", 0.3, 6, 0, 6, 5, 0, 9);
                pack.missile("mn", 0.01, 0, 8, 4, 5, 5, 0);
                pack.mirror();
                pack.repeat(0.07, 3, 3, true);
                pack.laser("ms", 0, 2, 0);
                pack.insert(-9);
                pack.laser("ms", 0, 10, 0);
                pack.insert(-6);
                pack.missile("mn", 0.2, 2, 0, 2, 5, 2, 12);
                pack.missile("ss", 0, 3, 0, 3.5, 5, 7, 0);
                pack.repeat(0.05, 3, 2);
                pack.missile("mn", 0.03, 12, 2, 5, 5, 2, 12);
                pack.missile("ss", 0, 12, 3.5, 7, 5, 12, 7);
                pack.repeat(0.05, 3, 2);
                pack.suicide("ms", 0.06, 0, 12, 3, 4);
                pack.repeat(0.015, 3, 1, true);
                break;
            case 6:
                pack.missile("mn", 0.05, 2, 0, 2, 7, 2, 12);
                pack.mirror();
                pack.missile("mn", 0, 4, 0, 4, 6, 2, 12);
                pack.mirror();
                pack.missile("ms", 0.15, 1, 0, 5, 4, 11, 12);
                pack.mirror();
                pack.missile("mn", 0.01, 0, 10, 3, 6, 0, 3);
                pack.repeat(0.01, 3, 1, true);
                pack.missile("ms", 0.2, 0, 4, 7, 4, 12, 4);
                pack.offset(0.02, 0, 2);
                pack.repeat(0.03, 3, 2);
                pack.laser("ms", 0.04, 0, 2);
                pack.laser("ms", 0.04, 0, 8);
                pack.missile("ms", 0.25, 2, 0, 2, 7, 2, 12);
                pack.missile("ms", 0.01, 3, 0, 5, 5, 12, 7);
                pack.repeat(0.06, 1, 2);
                pack.missile("mn", 0.05, 2, 0, 2, 7, 2, 12);
                pack.missile("mn", 0.01, 3, 0, 5, 5, 12, 7);
                pack.repeat(0.06, 3, 2);
                pack.laser("ss", 0, 12, 3);
                pack.insert(-7);
                pack.laser("ss", 0, 8, 0);
                pack.insert(-4);
                pack.laser("ss", 0, 6, 0);
                pack.insert(-1);
                pack.missile("ms", 0.2, 5, 0, 5, 6, 0, 10);
                pack.mirror();
                pack.missile("mn", 0.02, 3, 0, 3, 4, 0, 7);
                pack.repeat(0.035, 11, 1, true);
                pack.laser("ms", 0, 0, 3);
                pack.insert(-8);
                pack.laser("ms", 0, 12, 3);
                pack.insert(-6);
                pack.missile("ms", 0.2, 3, 0, 3, 7, 2, 12);
                pack.mirror();
                pack.missile("ms", 0.04, 4, 0, 4, 6, 2, 12);
                pack.mirror();
                pack.missile("ms", 0.04, 5, 0, 5, 5, 2, 12);
                pack.mirror();
                pack.missile("mn", 0.07, 3, 0, 3, 7, 2, 12);
                pack.mirror();
                pack.missile("mn", 0.04, 4, 0, 4, 6, 2, 12);
                pack.mirror();
                pack.missile("mn", 0.04, 5, 0, 5, 5, 2, 12);
                pack.mirror();
                pack.laser("mn", 0.2, 0, 3);
                pack.mirror();
                pack.laser("sn", 0.01, 0, 6);
                pack.mirror();
                pack.laser("ln", 0, 6, 0);
                pack.suicide("ss", 0.35, 1.4, 0, 1.4, 6);
                pack.offset(0, 3.8);
                pack.offset(0, 3.8);
                pack.repeat(0.05, 4, 3, true);
                break;
            case 7:
                pack.suicide("sn", 0.1, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.laser("ms", 0.04, 3, 0);
                pack.mirror();
                pack.suicide("sn", 0.09, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.missile("mn", 0.02, 0, 2, 6, 2, 12, 2);
                pack.missile("mn", 0.02, 12, 4, 6, 4, 0, 4);
                pack.suicide("sn", 0.09, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.missile("ss", 0.02, 3, 0, 3, 6, 2, 12);
                pack.mirror(0.02);
                pack.suicide("ss", 0.09, 1.5, 0, 1.5, 6);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.offset(0, 3);
                pack.missile("ms", 0.02, 0, 2, 3, 6, 0, 9);
                pack.mirror(0.02);
                pack.boss(0.2, 1);
                break;
            case 8:
                pack.missile("sn", 0.07, 0, 2, 4, 2, 0, 7);
                pack.repeat(0.008, 5, 1, true);
                pack.missile("sn", 0.05, 0, 3, 5, 4, 12, 8);
                pack.repeat(0.015, 9, 1, true);
                pack.laser("ln", 0, 3, 0);
                pack.insert(-7);
                pack.laser("ln", 0, 9, 0);
                pack.insert(-5);
                pack.laser("ln", 0, 6, 0);
                pack.missile("sn", 0.02, 1, 12, 4, 6, 12, 2);
                pack.repeat(0.02, 5, 1, true);
                pack.missile("sn", 0.17, 12, 12, 8, 3, 2, 6, 12, 7);
                pack.repeat(0.01, 12, 1);
                pack.laser("ln", 0, 3, 0);
                pack.insert(-10);
                pack.laser("ln", 0, 9, 0);
                pack.insert(-5);
                pack.suicide("mn", 0.05, 0, 0, 3, 4);
                pack.repeat(0.01, 3);
                pack.laser("ms", 0.23, 4, 0);
                pack.mirror(0.01);
                pack.laser("ls", 0.01, 6, 0);
                pack.laser("ss", 0.04, 0, 4);
                pack.mirror(0.022);
                pack.offset(0.022, 0, 3);
                pack.mirror(0.022);
                pack.missile("ss", 0.22, 0, 12, 4, 3, 10, 6, 0, 6);
                pack.repeat(0.03, 7, 1);
                pack.laser("ls", 0, 5, 0);
                pack.insert(-5);
                pack.laser("ls", 0, 7, 0);
                pack.insert(-1);
                pack.suicide("mn", 0.13, 12, 0, 9, 4);
                pack.repeat(0.01, 3);
                pack.laser("ls", 0.3, 2, 0);
                pack.offset(0.01, 2);
                pack.offset(0.01, 2);
                pack.offset(0.01, 2);
                pack.offset(0.01, 2);
                pack.suicide("mn", 0.13, 0, 12, 2, 5);
                pack.repeat(0.01, 7, 1, true);
                break;
            case 9:
                pack.missile("ln", 0.05, -1, -1, 5, 6, 13, 13);
                pack.mirror(0.01);
                pack.missile("mn", 0.1, 0, 1, 9, 3, 0, 6);
                pack.missile("mn", 0.013, 12, 8, 3, 6, 12, 3);
                pack.repeat(0.013, 3, 2);
                pack.missile("ln", 0.03, -1, 3, 6, 5, 13, 3);
                pack.missile("ln", 0, 13, 5, 6, 3, -1, 4);
                pack.laser("lb", 0.06, 4.5, 0);
                pack.laser("lb", 0.01, 7.5, 0);
                pack.missile("ln", 0.3, 3, -1, 3, 5, 3, 13);
                pack.mirror();
                pack.missile("ln", 0.04, -1, 1, 6, 3, 9, 13);
                pack.mirror();
                pack.laser("lt", 0.04, 0, 5);
                pack.mirror();
                pack.missile("mn", 0.14, 0, 1, 5, 5, 12, 1);
                pack.missile("mn", 0, 0, 9, 6, 6, 0, 3);
                pack.missile("mn", 0, 12, 9, 7, 5, 0, 9);
                pack.missile("mn", 0, 12, 1, 6, 4, 12, 10);
                pack.missile("ss", 0.14, 2, 12, 2, 3, 9, 2.5, 10, 12);
                pack.repeat(0.01, 7);
                pack.missile("ls", 0.07, -1, 6, 8, 6, 13, 6);
                pack.offset(0, 0, 2);
                pack.laser("lb", 0.05, 0, 7);
                pack.ship("lmt", 0.1, 3, 0, [pack.move(3, 3), pack.halt(15), pack.halt(10, true), pack.move(0, 3)]);
                pack.mirror();
                pack.ship("lmt", 0.05, 5, 0, [pack.move(5, 3), pack.halt(15), pack.halt(10, true), pack.move(0, 3)]);
                pack.mirror();
                pack.missile("mn", 0.06, 0, 12, 4, 7, 4, 0);
                pack.mirror();
                pack.missile("mn", 0.03, 6, 0, 6, 5, 1, 12);
                pack.mirror();
                pack.missile("ms", 0.23, 2, 0, 2, 6, 6, 4, 10, 12);
                pack.mirror(0.018);
                pack.missile("mn", 0.018, 2, 0, 2, 6, 6, 4, 10, 12);
                pack.repeat(0.018, 5, 1, true);
                pack.missile("ln", 0.04, -1, -1, 2, 3, -1, 13);
                pack.mirror();
                pack.laser("lb", 0.05, 6, 0);
                pack.laser("lb", 0.35, 4, 0);
                pack.mirror();
                pack.stealth(0.05, 3, 5, 0, 12);
                pack.mirror(0.01);
                pack.stealth(0.01, 6, 4, 6, 0);
                break;
            case 10:
                pack.missile("lb", 0.03, 2, -1, 2, 13);
                pack.mirror();
                pack.missile("lb", 0.05, -1, 2, 13, 2);
                pack.mirror();
                pack.laser("lb", 0.05, 0, 5);
                pack.mirror();
                pack.missile("lb", 0.05, 3, -1, 3, 6, 1, 13);
                pack.mirror();
                pack.missile("ss", 0.03, 6, 0, 6, 5, 1, 0);
                pack.repeat(0.03, 3, 1, true);
                pack.missile("sn", 0.1, 2, 12, 2, 3, 8, 4, 10, 12);
                pack.repeat(0.01, 13, 1, true);
                pack.laser("ss", 0.02, 5, 0);
                pack.mirror();
                pack.missile("sn", 0.05, 2, 0, 2, 7, 2, 12);
                pack.repeat(0.01, 5, 1, true);
                pack.stealth(0.05, 6, 7, 6, 0);
                pack.missile("sn", 0.1, 6, 0, 6, 5, 3, 2, 12, 7);
                pack.repeat(0.014, 9);
                pack.missile("lb", 0.03, 2, -1, 2, 7, 2, 13);
                pack.mirror(0.02);
                pack.laser("ss", 0.04, 4, 0);
                pack.mirror(0.02);
                pack.stealth(0.07, 5, 3, 0, 6);
                pack.stealth(0.02, 8, 5, 12, 7);
                pack.missile("lb", 0.2, 2, -1, 5, 4, 2, 13);
                pack.mirror();
                pack.laser("sn", 0.02, 0, 7);
                pack.mirror(0.015);
                pack.offset(0.015, 0, -2);
                pack.mirror(0.015);
                pack.offset(0.015, 0, -2);
                pack.mirror(0.015);
                pack.laser("sn", 0.015, 3, 0);
                pack.mirror(0.015);
                pack.laser("sn", 0.015, 7, 0);
                pack.mirror(0.015);
                pack.missile("mn", 0.2, 0, 2, 6, 4, 12, 2);
                pack.repeat(0.02, 3);
                pack.missile("sn", 0.01, 12, 3, 6, 5, 0, 3);
                pack.clone(0.01, -2);
                pack.repeat(0.01, 4, 2);
                pack.clone(0.01, -2);
                pack.repeat(0.02, 3);
                pack.laser("lb", 0.01, 0, 6);
                pack.mirror(0.01);
                pack.stealth(0.05, 5, 5, 5, 0);
                pack.mirror(0.03);
                pack.suicide("sn", 0.3, 1.4, 0, 1.4, 6);
                pack.offset(0, 3.8);
                pack.offset(0, 3.8);
                pack.repeat(0.03, 2, 3, true);
                pack.missile("sn", 0, 0, 6, 6, 7, 12, 10);
                pack.repeat(0.01, 7);
                pack.missile("mn", 0, 2, 0, 2, 5, 1, 12);
                pack.mirror();
                pack.missile("mn", 0.06, 4, 0, 4, 5, 1, 12);
                pack.mirror();
                pack.missile("ln", 0, 13, 5, 6, 7, -1, 10);
                pack.laser("ms", 0.18, 4, 0);
                pack.mirror(0.01);
                pack.laser("ls", 0.01, 6, 0);
                pack.laser("ss", 0.06, 0, 4);
                pack.mirror(0.02);
                pack.offset(0.02, 0, 3);
                pack.mirror(0.02);
                pack.stealth(0.05, 4, 5, 0, 12);
                pack.mirror(0.02);
                pack.suicide("mn", 0.2, 3, 0, 5, 2);
                pack.mirror();
                pack.repeat(0.06, 1, 2);
                pack.suicide("mn", 0, 0, 0, 2, 2);
                pack.mirror();
                pack.repeat(0.06, 1, 4);
                pack.suicide("mn", 0, 0, 7, 3, 6);
                pack.mirror();
                pack.repeat(0.06, 1, 6);
                pack.suicide("ms", 0, 5, 0, 5, 3);
                pack.mirror();
                break;
            case 11:
                pack.missile("ln", 0.1, 1, -1, 4, 6, -1, 13);
                pack.mirror();
                pack.laser("ln", 0.06, 0, 5);
                pack.mirror();
                pack.missile("ls", 0.09, -1, 2, 6, 3.5, 13, 5);
                pack.missile("ls", 0, 13, 8, 6, 6.5, -1, 5);
                pack.laser("ls", 0.06, 3, 0);
                pack.mirror();
                pack.missile("lt", 0.09, 5, -1, 5, 4, -1, 8);
                pack.mirror();
                pack.laser("lt", 0.09, 0, 3);
                pack.mirror();
                pack.missile("lb", 0.09, -1, 1, 4, 2, -1, 12);
                pack.mirror();
                pack.laser("lb", 0.09, 5, 0);
                pack.mirror();
                pack.stealth(0.2, 3, 4, 0, 5);
                pack.mirror(0.024);
                pack.stealth(0.024, 6, 3, 6, 0, true);
                pack.boss(0.02, 2);
                break;
            default: throw (new Error("Level number OOB: " + level));
        }
        return pack.array;
    }
    exports.getLevel = getLevel;
    function boss0Suicides(wpm) {
        if (wpm === void 0) { wpm = 60; }
        var pack = new MethodPack(Math.max(1 - wpm / 300, 0.5));
        pack.ship("msn", 0, 1.6, 3, [pack.halt(16), pack.fire()]);
        pack.ship("msn", 0, 2.2, 3.4, [pack.halt(13), pack.fire()]);
        pack.ship("msn", 0, 2.8, 3.7, [pack.halt(10), pack.fire()]);
        pack.ship("msn", 0, 6.8, 3.7, [pack.halt(10), pack.fire()]);
        pack.ship("msn", 0, 7.4, 3.4, [pack.halt(13), pack.fire()]);
        pack.ship("msn", 0, 8, 3, [pack.halt(16), pack.fire()]);
        return pack.array;
    }
    exports.boss0Suicides = boss0Suicides;
    function getBossLoop(bossType, wpm) {
        if (wpm === void 0) { wpm = 60; }
        var pack = new MethodPack(Math.max(1 - wpm / 300, 0.5));
        switch (bossType) {
            case 0:
                pack.missile("sn", 0.3, 0, 4, 7, 6, 12, 6);
                pack.missile("sn", 0.015, 12, 3, 5, 5, 0, 5);
                pack.repeat(0.015, 2, 2);
                pack.laser("ss", 0.2, 0, 9);
                pack.mirror(0.01);
                break;
            case 1:
                pack.missile("mn", 0.25, 0, 3 + Math.random() * 3, 5, 6, 12, 7);
                pack.mirror();
                pack.repeat(0.03, 1, 2);
                pack.laser("ms", 0.35, 0, 8);
                pack.mirror(0.01);
                break;
            case 2:
                pack.laser("ms", 0.3, 0, 6 + Math.random() * 3);
                pack.mirror();
                pack.missile("mn", 0.3, 0, 0, 2, 4, 5, 6, 12, 10);
                pack.repeat(0.02, 5, 1, true);
                pack.stealth(0.3, 2 + Math.random() * 8, 5 + Math.random() * 2, (Math.random() > 0.5 ? 0 : 12), 5);
                break;
        }
        return pack.array;
    }
    exports.getBossLoop = getBossLoop;
    var MethodPack = (function () {
        function MethodPack(mult) {
            this.array = [];
            this.distance = 0;
        }
        MethodPack.prototype.setDist = function (distance) {
            this.distance += distance;
        };
        MethodPack.prototype.loopBack = function (jumpIndex) {
            if (jumpIndex === void 0) { jumpIndex = 0; }
            if (jumpIndex < 0) {
                jumpIndex = this.array.length + jumpIndex;
            }
            this.array.push({ type: EventType.LOOP, distance: this.distance, jumpIndex: jumpIndex });
        };
        MethodPack.prototype.wait = function (distance) {
            if (distance === void 0) { distance = 0; }
            this.setDist(distance);
            var m = { type: EventType.WAIT, distance: this.distance, waitTime: distance };
            this.array.push(m);
            return m;
        };
        MethodPack.prototype.jump = function (jumpIndex) {
            if (jumpIndex === void 0) { jumpIndex = 0; }
            this.array.push({ distance: this.distance, type: EventType.JUMP, jumpIndex: jumpIndex });
        };
        MethodPack.prototype.insert = function (insertAt) {
            if (insertAt < 0) {
                insertAt = this.array.length + insertAt;
            }
            this.array[this.array.length - 1].distance = this.array[insertAt].distance;
            this.array.splice(insertAt, 0, this.array.pop());
        };
        MethodPack.prototype.ship = function (type, distance, x, y, commands) {
            if (commands === void 0) { commands = null; }
            this.setDist(distance);
            this.array.push({ type: EventType.SPAWN, distance: this.distance, spawnEvent: { type: type, x: x, y: y, commands: commands } });
        };
        MethodPack.prototype.laser = function (type, distance, x, y, speed) {
            if (speed === void 0) { speed = 0; }
            var commands;
            if (x == 0) {
                commands = [this.move(2, y), this.halt(10 - speed), this.halt(20 - speed, true), this.move(-2, y)];
            }
            else if (x == 12) {
                commands = [this.move(10, y), this.halt(10 - speed), this.halt(20 - speed, true), this.move(14, y)];
            }
            else if (y == 0) {
                commands = [this.move(x, 2), this.halt(10 - speed), this.halt(20 - speed, true), this.move(x, -2)];
            }
            else if (y == 12) {
                commands = [this.move(x, 10), this.halt(10 - speed), this.halt(20 - speed, true), this.move(x, 14)];
            }
            else {
                throw (new Error("Invalid spawn location: " + x + " " + y));
            }
            this.ship(type.charAt(0) + "l" + type.charAt(1), distance, x, y, commands);
        };
        MethodPack.prototype.suicide = function (_type, _distance, _x, _y, _xTo, _yTo) {
            this.ship(_type.charAt(0) + "s" + _type.charAt(1), _distance, _x, _y, [this.move(_xTo, _yTo), this.fire()]);
        };
        MethodPack.prototype.stealth = function (_distance, _x, _y, _xTo, _yTo, _shield) {
            if (_shield === void 0) { _shield = false; }
            this.ship(_shield ? "xms" : "xmn", _distance, _x, _y, [this.halt(8), this.halt(10, true), this.halt(10, true), this.halt(10, true), this.halt(10, true), this.halt(5, true), this.move(_xTo, _yTo)]);
        };
        MethodPack.prototype.missile = function (_type, _distance, _x, _y, _xTo1, _yTo1, _xTo2, _yTo2, _xTo3, _yTo3) {
            if (_xTo2 === void 0) { _xTo2 = -1; }
            if (_yTo2 === void 0) { _yTo2 = -1; }
            if (_xTo3 === void 0) { _xTo3 = -1; }
            if (_yTo3 === void 0) { _yTo3 = -1; }
            this.ship(_type.charAt(0) + "m" + _type.charAt(1), _distance, _x, _y, [this.move(_xTo1, _yTo1), this.move(_xTo2, _yTo2, ((_xTo3 == -1) ? true : false)), ((_xTo3 != -1) ? this.move(_xTo3, _yTo3, true) : this.halt(1))]);
        };
        MethodPack.prototype.boss = function (_distance, _type) {
            this.setDist(_distance);
            this.array.push({ type: EventType.BOSS, distance: this.distance, bossType: _type });
        };
        MethodPack.prototype.clone = function (_distance, index) {
            if (_distance === void 0) { _distance = 0; }
            if (index === void 0) { index = -1; }
            this.setDist(_distance);
            if (index < 0) {
                index = this.array.length + index;
            }
            var oldSpawn = this.array[index].spawnEvent;
            var commands = this.cloneCommands(oldSpawn.commands);
            this.array.push({ type: EventType.SPAWN, distance: this.distance, spawnEvent: { type: oldSpawn.type, x: oldSpawn.x, y: oldSpawn.y, commands: commands } });
        };
        MethodPack.prototype.mirror = function (distance, index) {
            if (distance === void 0) { distance = 0; }
            if (index === void 0) { index = -1; }
            this.setDist(distance);
            if (index < 0) {
                index = this.array.length + index;
            }
            var oldSpawn = this.array[index].spawnEvent;
            var commands = this.mirrorCommands(oldSpawn.commands);
            this.array.push({ type: EventType.SPAWN, distance: this.distance, spawnEvent: { type: oldSpawn.type, x: 12 - oldSpawn.x, y: oldSpawn.y, commands: commands } });
        };
        MethodPack.prototype.offset = function (_distance, xOff, yOff, index) {
            if (_distance === void 0) { _distance = 0; }
            if (xOff === void 0) { xOff = 0; }
            if (yOff === void 0) { yOff = 0; }
            if (index === void 0) { index = -1; }
            this.setDist(_distance);
            if (index < 0) {
                index = this.array.length + index;
            }
            var oldSpawn = this.array[index].spawnEvent;
            var commands = this.cloneCommands(oldSpawn.commands, xOff, yOff);
            this.array.push({ type: EventType.SPAWN, distance: this.distance, spawnEvent: { type: oldSpawn.type, x: oldSpawn.x + xOff, y: oldSpawn.y + yOff, commands: commands } });
        };
        MethodPack.prototype.repeat = function (distance, repeatN, repeatC, reverse) {
            if (repeatN === void 0) { repeatN = 1; }
            if (repeatC === void 0) { repeatC = 1; }
            for (var i = 0; i < repeatN * repeatC; i++) {
                if (i % repeatC == 0) {
                    if (reverse) {
                        this.mirror(distance, 0 - repeatC);
                    }
                    else {
                        this.clone(distance, 0 - repeatC);
                    }
                }
                else {
                    if (reverse) {
                        this.mirror((this.array[this.array.length - repeatC].distance - this.array[this.array.length - repeatC - 1].distance), 0 - repeatC);
                    }
                    else {
                        this.clone((this.array[this.array.length - repeatC].distance - this.array[this.array.length - repeatC - 1].distance), 0 - repeatC);
                    }
                }
            }
        };
        MethodPack.prototype.move = function (x, y, fire) {
            if (fire === void 0) { fire = false; }
            return { x: x, y: y, fire: fire, move: true, timer: 0 };
        };
        MethodPack.prototype.halt = function (timer, fire) {
            if (fire === void 0) { fire = false; }
            return { x: 6, y: 12, timer: timer, fire: fire, move: false };
        };
        MethodPack.prototype.fire = function () {
            return { timer: 1, move: false, fire: true };
        };
        MethodPack.prototype.cloneCommand = function (command, xOff, yOff) {
            if (xOff === void 0) { xOff = 0; }
            if (yOff === void 0) { yOff = 0; }
            return { x: command.x + xOff, y: command.y + yOff, timer: command.timer, move: command.move, fire: command.fire };
        };
        MethodPack.prototype.mirrorCommand = function (command) {
            return { x: 12 - command.x, y: command.y, timer: command.timer, move: command.move, fire: command.fire };
        };
        MethodPack.prototype.cloneCommands = function (commands, xOff, yOff) {
            if (xOff === void 0) { xOff = 0; }
            if (yOff === void 0) { yOff = 0; }
            var m = [];
            for (var i = 0; i < commands.length; i++) {
                m.push(this.cloneCommand(commands[i], xOff, yOff));
            }
            return m;
        };
        MethodPack.prototype.mirrorCommands = function (commands, xOff, yOff) {
            if (xOff === void 0) { xOff = 0; }
            if (yOff === void 0) { yOff = 0; }
            var m = [];
            for (var i = 0; i < commands.length; i++) {
                m.push(this.mirrorCommand(commands[i]));
            }
            return m;
        };
        return MethodPack;
    }());
});
define("JMGE/effects/Charge", ["require", "exports", "JMGE/others/Colors"], function (require, exports, Colors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Charge = (function (_super) {
        __extends(Charge, _super);
        function Charge(endRadius, time, color) {
            if (endRadius === void 0) { endRadius = 10; }
            if (time === void 0) { time = 30; }
            if (color === void 0) { color = 0xff0000; }
            var _this = _super.call(this) || this;
            _this.endRadius = endRadius;
            _this.time = time;
            _this.count = -1;
            _this.running = false;
            _this.redraw = function () {
                if (Math.random() < 0.5) {
                    var color = _this.gradient1.getColorAt(Math.random() * 0.5 + 0.5);
                }
                else {
                    color = _this.gradient2.getColorAt(Math.random() * 0.5 + 0.5);
                }
                _this.clear();
                _this.beginFill(color);
                _this.drawCircle(0, 0, _this.endRadius * _this.count / _this.time);
            };
            _this.endCharge = function () {
                if (_this.callback)
                    _this.callback();
                _this.callback = null;
                _this.count = -1;
                _this.clear();
                _this.running = false;
            };
            _this.gradient1 = new Colors_1.ColorGradient(0, color);
            _this.gradient2 = new Colors_1.ColorGradient(0xffffff, color);
            return _this;
        }
        Charge.prototype.startCharge = function (callback) {
            this.count = 0;
            this.callback = callback;
            this.redraw();
            this.running = true;
        };
        Charge.prototype.update = function (speed) {
            if (this.count === -1)
                return;
            if (this.count < this.time) {
                this.count += speed;
                this.redraw();
            }
            else {
                this.endCharge();
            }
        };
        return Charge;
    }(PIXI.Graphics));
    exports.Charge = Charge;
});
define("game/data/EnemyData", ["require", "exports", "GraphicData", "game/data/Misc"], function (require, exports, GraphicData_2, Misc_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EnemyData = {
        sm: {
            textureUrl: GraphicData_2.ImageRepo.sm,
            textureScale: 0.7,
            shield: new PIXI.Rectangle(0, 0, 45, 45),
            health: 1,
            wordSize: 4,
            value: 5,
            moveSpeed: 1,
            fires: Misc_5.ActionType.MISSILE,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(0, 0),
        },
        sl: {
            textureUrl: GraphicData_2.ImageRepo.sl,
            textureScale: 0.5,
            shield: new PIXI.Rectangle(0, 5, 55, 55),
            health: 1,
            wordSize: 5,
            value: 6,
            moveSpeed: 0.9,
            fires: Misc_5.ActionType.LASER,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(0, -18),
        },
        ss: {
            textureUrl: GraphicData_2.ImageRepo.ss,
            textureScale: 0.1,
            shield: new PIXI.Rectangle(0, 0, 30, 30),
            health: 1,
            wordSize: 3,
            value: 5,
            moveSpeed: 0.8,
            fires: Misc_5.ActionType.SUICIDE,
            killBy: Misc_5.ActionType.LASER,
            firePoint: new PIXI.Point(0, 0),
        },
        mm: {
            textureUrl: GraphicData_2.ImageRepo.mm,
            textureScale: 0.8,
            shield: new PIXI.Rectangle(2, 0, 60, 60),
            health: 2,
            wordSize: 6,
            value: 6,
            moveSpeed: 0.8,
            fires: Misc_5.ActionType.MISSILE,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(0, 0),
        },
        ml: {
            textureUrl: GraphicData_2.ImageRepo.ml,
            textureScale: 0.6,
            shield: new PIXI.Rectangle(0, 2, 70, 70),
            health: 2,
            wordSize: 7,
            value: 7,
            moveSpeed: 0.7,
            fires: Misc_5.ActionType.LASER,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(-1, -28),
        },
        ms: {
            textureUrl: GraphicData_2.ImageRepo.ms,
            textureScale: 0.2,
            shield: new PIXI.Rectangle(0, 0, 35, 35),
            health: 1,
            wordSize: 3,
            value: 6,
            moveSpeed: 1,
            fires: Misc_5.ActionType.SUICIDE,
            killBy: Misc_5.ActionType.LASER,
            firePoint: new PIXI.Point(0, 0),
        },
        lm: {
            textureUrl: GraphicData_2.ImageRepo.lm,
            textureScale: 1,
            shield: new PIXI.Rectangle(1, 7, 82, 116),
            health: 4,
            wordSize: 8,
            value: 8,
            moveSpeed: 0.75,
            fires: Misc_5.ActionType.MISSILE,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(0, 0),
        },
        ll: {
            textureUrl: GraphicData_2.ImageRepo.ll,
            textureScale: 0.7,
            shield: new PIXI.Rectangle(0, 8, 65, 110),
            health: 4,
            wordSize: 9,
            value: 9,
            moveSpeed: 0.65,
            fires: Misc_5.ActionType.LASER,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(-3, -35),
        },
        xm: {
            textureUrl: GraphicData_2.ImageRepo.ls,
            textureScale: 0.5,
            shield: new PIXI.Rectangle(0, 0, 35, 50),
            health: 1,
            wordSize: 7,
            value: 8,
            moveSpeed: 0.9,
            fires: Misc_5.ActionType.AUTO_MISSILE,
            killBy: Misc_5.ActionType.MISSILE,
            firePoint: new PIXI.Point(0, 0),
        },
        nl: {
            textureUrl: null,
            textureScale: 1,
            shield: new PIXI.Rectangle(0, 0, 35, 50),
            health: 1,
            wordSize: 7,
            value: 0,
            moveSpeed: 1,
            fires: Misc_5.ActionType.LASER,
            killBy: Misc_5.ActionType.EMP,
            firePoint: new PIXI.Point(0, -10),
            turnRate: 0
        },
    };
    exports.MissileData = {
        player: {
            textureUrl: GraphicData_2.ImageRepo.playerMissile,
            textureScale: 0.1,
            wordSize: -1,
            value: 0,
            moveSpeed: 7,
            turnRate: 2,
            killBy: Misc_5.ActionType.LASER,
            health: 1
        },
        enemy: {
            textureUrl: GraphicData_2.ImageRepo.enemyMissile,
            textureScale: 0.1,
            wordSize: 3,
            value: 1,
            moveSpeed: 2,
            turnRate: 2,
            killBy: Misc_5.ActionType.LASER,
            health: 1
        },
    };
});
define("game/objects/EnemyShip", ["require", "exports", "game/objects/GameSprite", "JMGE/effects/Charge", "game/data/EnemyData", "game/data/Misc", "game/objects/Turret", "JMGE/JMBL"], function (require, exports, GameSprite_2, Charge_1, EnemyData_1, Misc_6, Turret_1, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnemyShip = (function (_super) {
        __extends(EnemyShip, _super);
        function EnemyShip(config, callbacks) {
            var _this = _super.call(this) || this;
            _this.config = config;
            _this.callbacks = callbacks;
            _this.charge = new Charge_1.Charge();
            _this.update = function (speed) {
                _this.checkNextCommand(speed);
                if (!_this.toDestroy) {
                    if (_this.charge.running) {
                        _this.charge.update(speed);
                    }
                    if (_this.config.commands[0].move) {
                        var command = _this.config.commands[0];
                        var dx = command.x - _this.x;
                        var dy = command.y - _this.y;
                        var angle = Math.atan2(dy, dx);
                        _this.x += speed * Math.cos(angle);
                        _this.y += speed * Math.sin(angle);
                    }
                    if (_this.config.commands[0].x !== undefined && _this.config.commands[0].y !== undefined) {
                        var angle = Math.atan2(_this.config.commands[0].y - _this.y, _this.config.commands[0].x - _this.x);
                        _this.rotation = angle + Math.PI / 2;
                    }
                    if (_this.turret) {
                        _this.turret.update(speed);
                    }
                }
            };
            _this.onWordComplete = function () {
                if (_this.callbacks.onWordComplete) {
                    _this.callbacks.onWordComplete(_this);
                }
            };
            var enemyConfig;
            switch (config.type.substring(0, 2)) {
                case "sm":
                    enemyConfig = EnemyData_1.EnemyData.sm;
                    break;
                case "sl":
                    enemyConfig = EnemyData_1.EnemyData.sl;
                    break;
                case "ss":
                    enemyConfig = EnemyData_1.EnemyData.ss;
                    break;
                case "mm":
                    enemyConfig = EnemyData_1.EnemyData.mm;
                    break;
                case "ml":
                    enemyConfig = EnemyData_1.EnemyData.ml;
                    break;
                case "ms":
                    enemyConfig = EnemyData_1.EnemyData.ms;
                    break;
                case "lm":
                    enemyConfig = EnemyData_1.EnemyData.lm;
                    break;
                case "ll":
                    enemyConfig = EnemyData_1.EnemyData.ll;
                    break;
                case "xm":
                    enemyConfig = EnemyData_1.EnemyData.xm;
                    break;
                case "nl":
                    enemyConfig = EnemyData_1.EnemyData.nl;
                    break;
                default: throw (new Error(config.type.substring(0, 2) + " is not a recognized ship code."));
            }
            if (enemyConfig.textureUrl) {
                _this.makeDisplay(enemyConfig.textureUrl, enemyConfig.textureScale);
            }
            _this.wordSize = enemyConfig.wordSize;
            _this.value = enemyConfig.value;
            _this.a = enemyConfig.moveSpeed;
            _this.fires = enemyConfig.fires;
            _this.killBy = enemyConfig.killBy;
            _this.firePoint.set(enemyConfig.firePoint.x, enemyConfig.firePoint.y);
            _this.health = enemyConfig.health;
            if (enemyConfig.turnRate || enemyConfig.turnRate === 0) {
                _this.turnRate = enemyConfig.turnRate;
            }
            _this.addChild(_this.charge);
            _this.shieldView.scale.set(enemyConfig.shield.width / 200, enemyConfig.shield.height / 200);
            _this.shieldView.position.set(enemyConfig.shield.x, enemyConfig.shield.y);
            _this.addWord();
            switch (config.type.charAt(2)) {
                case "s":
                    _this.addShield();
                    _this.value += 2;
                    break;
                case "t":
                    _this.addTurret();
                    _this.value += 2;
                    break;
                case "b":
                    _this.addShield();
                    _this.addTurret();
                    _this.value += 5;
                    break;
                default: break;
            }
            if (_this.fires === Misc_6.ActionType.LASER) {
                _this.charge.time = 200;
                _this.charge.x = _this.firePoint.x;
                _this.charge.y = _this.firePoint.y;
            }
            _this.x = config.x;
            _this.y = config.y;
            return _this;
        }
        EnemyShip.prototype.startCharge = function (callback) {
            this.charge.startCharge(callback);
        };
        EnemyShip.prototype.replaceCommands = function (commands) {
            this.config.commands = commands;
        };
        EnemyShip.prototype.checkNextCommand = function (speed) {
            if (this.config.commands.length === 0) {
                this.toDestroy = true;
                return;
            }
            var command = this.config.commands[0];
            if (command.move) {
                if (Math.abs(this.x - command.x) > 20 || Math.abs(this.y - command.y) > 20) {
                    return;
                }
            }
            else {
                if (command.timer > 0) {
                    command.timer -= speed * .4;
                    return;
                }
            }
            this.config.commands.shift();
            if (this.config.commands.length === 0) {
                this.toDestroy = true;
                if (this.callbacks.onFinishCommands) {
                    this.callbacks.onFinishCommands(this);
                }
                JMBL.events.publish(Misc_6.GameEvents.NOTIFY_COMMANDS_COMPLETE, this);
                return;
            }
            command = this.config.commands[0];
            if (command.fire && this.callbacks.onFire) {
                this.callbacks.onFire(this, this.fires);
            }
        };
        EnemyShip.prototype.addShield = function () {
            this.shieldOn = true;
            this.addChild(this.shieldView);
            this.shieldView.fadeIn();
            this.addWord(3);
        };
        EnemyShip.prototype.removeShield = function () {
            if (this.shieldOn) {
                this.shieldOn = false;
                this.shieldView.fadeOut();
                this.addWord();
            }
        };
        EnemyShip.prototype.addTurret = function () {
            if (!this.turret) {
                this.turret = new Turret_1.Turret();
                this.addChild(this.turret);
            }
        };
        EnemyShip.prototype.removeTurret = function () {
            if (this.turret) {
                this.turret.dispose();
                this.turret.destroy();
            }
        };
        return EnemyShip;
    }(GameSprite_2.GameSprite));
    exports.EnemyShip = EnemyShip;
});
define("game/objects/Scanner", ["require", "exports", "game/objects/GameSprite"], function (require, exports, GameSprite_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scanner = (function (_super) {
        __extends(Scanner, _super);
        function Scanner(boss) {
            var _this = _super.call(this) || this;
            _this.boss = boss;
            _this.STARTING_COUNT = 300;
            _this.COUNT_CHANGE = 30;
            _this.COUNT_RATE = 3;
            _this.graphic = new PIXI.Graphics;
            _this.update = function () {
                if (_this.count > _this.toCount && _this.count > 5) {
                    _this.count = Math.max(_this.count - 3, _this.toCount, 5);
                    _this.redrawCircle();
                }
            };
            _this.wordSize = 3;
            _this.addWord(3, 0);
            _this.count = _this.STARTING_COUNT;
            _this.addChild(_this.graphic);
            _this.redrawCircle();
            _this.onWordComplete = _this.scan;
            return _this;
        }
        Scanner.prototype.scan = function () {
            this.toCount = this.count - this.COUNT_CHANGE;
            if (this.toCount < 0) {
                this.boss.scan(true);
                this.dispose();
            }
            if (this.toCount <= 5) {
                this.toCount = 0;
                this.addWord(10, 1);
            }
            else {
                this.addWord(3, 1);
            }
        };
        Scanner.prototype.redrawCircle = function () {
            this.graphic.clear();
            this.graphic.lineStyle(3, 0xff5500);
            this.graphic.drawCircle(0, 0, this.count);
            this.graphic.drawCircle(0, 0, 1);
        };
        return Scanner;
    }(GameSprite_3.GameSprite));
    exports.Scanner = Scanner;
});
define("game/objects/ClearObject", ["require", "exports", "game/objects/GameSprite", "game/data/Misc"], function (require, exports, GameSprite_4, Misc_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClearObject = (function (_super) {
        __extends(ClearObject, _super);
        function ClearObject(wordSize, onWordComplete) {
            var _this = _super.call(this) || this;
            _this.addWord(wordSize);
            _this.onWordComplete = onWordComplete;
            _this.killBy = Misc_7.ActionType.INSTANT;
            return _this;
        }
        return ClearObject;
    }(GameSprite_4.GameSprite));
    exports.ClearObject = ClearObject;
});
define("game/objects/BossShip", ["require", "exports", "game/objects/GameSprite", "game/data/LevelData", "Config", "game/objects/Scanner", "JMGE/JMBL", "game/data/Misc", "game/objects/ClearObject", "GraphicData", "game/engine/ObjectManager"], function (require, exports, GameSprite_5, LevelData_1, Config_3, Scanner_1, JMBL, Misc_8, ClearObject_1, GraphicData_3, ObjectManager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BossShip = (function (_super) {
        __extends(BossShip, _super);
        function BossShip(bossType, manager) {
            var _this = _super.call(this) || this;
            _this.bossType = bossType;
            _this.manager = manager;
            _this.commands = [{ x: Config_3.CONFIG.INIT.STAGE_WIDTH / 2, y: 200, move: true }, { x: Config_3.CONFIG.INIT.STAGE_WIDTH / 2, y: 500, timer: 6, move: false, fire: true }];
            _this.overOffset = new PIXI.Point(0, 0);
            _this.delay = -1;
            _this.moveWith = [];
            _this.update = function (speed) {
                if (!_this.scanner) {
                    if (_this.commands.length <= 1) {
                        "";
                        _this.scanner = new Scanner_1.Scanner(_this);
                        var loc = _this.getRandomCollisionPoint();
                        _this.scanner.x = loc.x;
                        _this.scanner.y = loc.y;
                        _this.addChild(_this.scanner);
                    }
                }
                else {
                    _this.scanner.update();
                }
                _this.bossUpdate(speed);
                _this.checkNextCommand(speed);
                var diffX = 0;
                var diffY = 0;
                if (_this.commands.length > 0 && _this.commands[0].move) {
                    var command = _this.commands[0];
                    var dx = command.x - _this.x;
                    var dy = command.y - _this.y;
                    var angle = Math.atan2(dy, dx);
                    diffX = speed * Math.cos(angle);
                    diffY = speed * Math.sin(angle);
                    _this.x += diffX;
                    _this.y += diffY;
                }
                _this.moveWith.forEach(function (object) { return (object.x += diffX, object.y += diffY); });
                if (_this.over) {
                    _this.over.x = _this.x + _this.overOffset.x;
                    _this.over.y = _this.y + _this.overOffset.y;
                }
            };
            _this.scan = function (lastWord) {
                if (lastWord) {
                    _this.scanner.dispose();
                    _this.scanner.destroy();
                    _this.scanner = null;
                    _this.injure();
                }
            };
            _this.injure = function () {
                _this.health--;
                JMBL.events.publish(Misc_8.GameEvents.NOTIFY_BOSS_DAMAGED, _this.health);
                if (_this.health === 0) {
                    _this.toDestroy = true;
                }
            };
            _this.health = 3;
            _this.wordSize = -1;
            _this.x = Config_3.CONFIG.INIT.STAGE_WIDTH / 2;
            _this.y = -50;
            return _this;
        }
        BossShip.prototype.dispose = function () {
            if (this.over) {
                this.over.destroy();
                this.over = null;
            }
            this.toDestroy = true;
        };
        BossShip.prototype.getRandomCollisionPoint = function () {
            var point = new PIXI.Point(this.hitBounds.x + Math.random() * this.hitBounds.width, this.hitBounds.y + Math.random() * this.hitBounds.height);
            return point;
        };
        BossShip.prototype.replaceCommands = function (commands) {
            this.commands = commands;
        };
        BossShip.prototype.checkNextCommand = function (speed) {
            if (this.commands.length === 0) {
                this.newCommands();
            }
            var command = this.commands[0];
            if (command.move) {
                if (Math.abs(this.x - command.x) > 20 || Math.abs(this.y - command.y) > 20) {
                    return;
                }
            }
            else {
                if (command.timer > 0) {
                    command.timer -= speed * .4;
                    return;
                }
            }
            this.commands.shift();
        };
        BossShip.prototype.bossUpdate = function (speed) {
        };
        BossShip.prototype.bossFire = function () {
        };
        BossShip.prototype.newCommands = function () {
        };
        return BossShip;
    }(GameSprite_5.GameSprite));
    exports.BossShip = BossShip;
    var BossShip0 = (function (_super) {
        __extends(BossShip0, _super);
        function BossShip0(bossType, manager) {
            var _this = _super.call(this, bossType, manager) || this;
            _this.objects = [];
            _this.makeDisplay(GraphicData_3.ImageRepo.boss0, 0.5);
            _this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
            _this.over = PIXI.Sprite.fromImage(GraphicData_3.ImageRepo.boss0Over0);
            _this.over.anchor.set(0.5);
            _this.over.scale.set(0.5);
            _this.overOffset.set(-3, 14);
            manager.container.layers[ObjectManager_2.DisplayLayer.EXPLOSIONS].addChild(_this.over);
            return _this;
        }
        BossShip0.prototype.bossUpdate = function (speed) {
            if (this.delay > 0) {
                if (this.delay === 10) {
                    if (this.objects.length === 0) {
                    }
                }
                else if (this.delay === 1) {
                    if (this.objects.length > 0) {
                    }
                    else {
                    }
                }
                this.delay -= speed;
            }
            else {
                if (this.objects.length > 0) {
                    while (true) {
                        if (this.objects[0].config.commands.length <= 1 || this.objects[0].toDestroy) {
                            console.log("GONE");
                            this.objects.shift();
                            if (this.objects.length === 0) {
                                this.manager.container.layers[ObjectManager_2.DisplayLayer.EXPLOSIONS].addChild(this.over);
                            }
                            break;
                        }
                        else {
                            break;
                        }
                    }
                }
                if (this.objects.length === 0) {
                    this.delay = 20;
                }
            }
        };
        BossShip0.prototype.bossFire = function () {
            console.log("FIRE!");
            var a = LevelData_1.boss0Suicides();
            while (a.length > 0) {
                var newShip = this.manager.addEnemy(a.shift().spawnEvent);
                this.objects.push(newShip);
            }
            this.manager.container.layers[ObjectManager_2.DisplayLayer.PROJECTILES].addChild(this.over);
            this.delay = 20;
        };
        BossShip0.prototype.newCommands = function () {
            this.bossFire();
            this.commands.push({ x: Config_3.CONFIG.INIT.STAGE_WIDTH / 2, y: 500, timer: 480, move: false, fire: true });
        };
        return BossShip0;
    }(BossShip));
    exports.BossShip0 = BossShip0;
    var BossShip1 = (function (_super) {
        __extends(BossShip1, _super);
        function BossShip1(bossType, manager) {
            var _this = _super.call(this, bossType, manager) || this;
            _this.firePoints = [{ x: 2.3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3.5 }, { x: 6, y: 3.5 }, { x: 7, y: 4 }, { x: 9.7, y: 3 }];
            _this.makeDisplay(GraphicData_3.ImageRepo.boss1, 0.5);
            _this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
            return _this;
        }
        BossShip1.prototype.bossUpdate = function (speed) {
            if (this.delay <= 0) {
                this.delay = 36;
            }
            else {
                this.delay -= speed;
                if (this.delay === 35) {
                }
                else if (this.delay === 20) {
                }
            }
        };
        BossShip1.prototype.bossFire = function () {
            var point = this.firePoints[Math.floor(Math.random() * 6)];
            var spawn = { type: this.health > 1 ? "nln" : "nls", x: point.x, y: point.y, commands: [{ timer: this.health > 1 ? 21 : 23 }, { timer: 20, fire: true }] };
            var e = this.manager.addEnemy(spawn);
        };
        BossShip1.prototype.newCommands = function () {
            this.bossFire();
            this.commands.push({ x: Config_3.CONFIG.INIT.STAGE_WIDTH / 2, y: 500, timer: 138 + this.health * 18, move: false, fire: true });
        };
        return BossShip1;
    }(BossShip));
    exports.BossShip1 = BossShip1;
    var BossShip2 = (function (_super) {
        __extends(BossShip2, _super);
        function BossShip2(bossType, manager) {
            var _this = _super.call(this, bossType, manager) || this;
            _this.objects = [];
            _this.shieldCount = 0;
            _this.addPlayerShield = function () {
                _this.shieldCount++;
                if (_this.shieldCount === 1) {
                    _this.manager.player.addShield(0.2);
                }
                else {
                    _this.manager.player.shieldTo(0.2 * _this.shieldCount);
                }
            };
            _this.makeDisplay(GraphicData_3.ImageRepo.boss2, 0.5);
            _this.hitBounds = new PIXI.Rectangle(-150, -30, 300, 60);
            return _this;
        }
        BossShip2.prototype.makeCounter = function (x, y) {
            var object = new ClearObject_1.ClearObject(11 - this.health, this.addPlayerShield);
            object.x = this.manager.player.x + x - 5;
            object.y = this.manager.player.y + y;
            this.objects.unshift(object);
            this.manager.container.addObject(object);
        };
        BossShip2.prototype.bossUpdate = function (speed) {
            if (this.delay >= 0) {
                switch (this.delay) {
                    case 215:
                        this.makeCounter(30, 20);
                        break;
                    case 210:
                        this.makeCounter(-75, 20);
                        break;
                    case 205:
                        this.makeCounter(30, -20);
                        break;
                    case 200:
                        this.makeCounter(-75, -20);
                        break;
                    case 180:
                        break;
                    case 140:
                        break;
                    case 100:
                        break;
                    default:
                        if (this.delay < 75) {
                            if (this.delay % 5 === 0) {
                                if (this.shieldCount === 0) {
                                }
                                else {
                                }
                            }
                            if (this.delay % 20 === 0) {
                                if (this.delay > 0) {
                                }
                                if (this.shieldCount > 0) {
                                    this.shieldCount--;
                                    if (this.shieldCount === 0) {
                                        this.manager.player.removeShield();
                                    }
                                    else {
                                        this.manager.player.shieldTo(this.shieldCount * 0.2);
                                    }
                                }
                                else {
                                    this.manager.player.addHealth(-1);
                                }
                            }
                            if (this.delay === 0) {
                                this.manager.player.removeShield();
                                while (this.objects.length > 0) {
                                    this.objects.shift().dispose();
                                }
                            }
                        }
                }
                this.delay -= 0.5;
            }
        };
        BossShip2.prototype.bossFire = function () {
            this.shieldCount = 0;
            this.delay = 220;
        };
        BossShip2.prototype.newCommands = function () {
            this.bossFire();
            this.commands.push({ x: Config_3.CONFIG.INIT.STAGE_WIDTH / 2, y: 500, timer: 820, move: false, fire: true });
        };
        return BossShip2;
    }(BossShip));
    exports.BossShip2 = BossShip2;
});
define("game/objects/PlayerShip", ["require", "exports", "game/objects/GameSprite", "JMGE/JMBL", "game/data/Misc", "JMGE/effects/Charge", "GraphicData"], function (require, exports, GameSprite_6, JMBL, Misc_9, Charge_2, GraphicData_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerShip = (function (_super) {
        __extends(PlayerShip, _super);
        function PlayerShip() {
            var _this = _super.call(this) || this;
            _this.animA = [];
            _this.targetA = [];
            _this.empCharge = new Charge_2.Charge(20, 5, 0xcccccc);
            _this.laserCharge = new Charge_2.Charge(10, 5, 0x00ffff);
            _this.setHealth = function (i) {
                _this.health = Math.max(Math.min(i, 5), 0);
                JMBL.events.publish(Misc_9.GameEvents.NOTIFY_SET_HEALTH, i);
            };
            _this.addHealth = function (i) {
                _this.setHealth(_this.health + i);
            };
            _this.update = function (speed) {
                if (_this.laserCharge.running) {
                    _this.laserCharge.update(speed);
                }
                if (_this.empCharge.running) {
                    _this.empCharge.update(speed);
                }
            };
            _this.makeDisplay(GraphicData_4.ImageRepo.player, 0.1);
            _this.addChild(_this.laserCharge, _this.empCharge, _this.shieldView);
            _this.shieldView.scale.set(0.35, 0.35);
            _this.firePoint.set(0, -20);
            _this.laserCharge.y = _this.firePoint.y;
            _this.empCharge.y = _this.firePoint.y;
            return _this;
        }
        PlayerShip.MAX_HEALTH = 5;
        return PlayerShip;
    }(GameSprite_6.GameSprite));
    exports.PlayerShip = PlayerShip;
});
define("game/engine/EventInterpreter", ["require", "exports", "game/data/LevelData"], function (require, exports, LevelData_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventInterpreter = (function () {
        function EventInterpreter(addShipCallback, addBossCallback) {
            this.addShipCallback = addShipCallback;
            this.addBossCallback = addBossCallback;
            this.DISTANCE_MULT = 0.0002;
        }
        EventInterpreter.prototype.loadLevel = function (level, wpm) {
            this.level = level;
            this.wpm = wpm;
            this.data = LevelData_2.getLevel(level, wpm);
            this.finalDistance = this.data[this.data.length - 1].distance;
            this.distance = 0;
        };
        EventInterpreter.prototype.loadBossLoop = function (bossType) {
            var _this = this;
            this.data = LevelData_2.getBossLoop(bossType, this.wpm);
            this.data.forEach(function (event) { return event.distance += _this.distance; });
        };
        EventInterpreter.prototype.addDistance = function (inc) {
            this.distance += inc * this.DISTANCE_MULT;
            while (this.data.length > 0 && this.distance > this.data[0].distance) {
                var nextEvent = this.data.shift();
                switch (nextEvent.type) {
                    case LevelData_2.EventType.JUMP:
                        this.distance += nextEvent.jumpIndex;
                        break;
                    case LevelData_2.EventType.LOOP:
                        var tArray = LevelData_2.getLevel(this.level, this.wpm).splice(nextEvent.jumpIndex);
                        this.data = this.data.concat(tArray);
                        break;
                    case LevelData_2.EventType.SPAWN:
                        this.addShipCallback(nextEvent.spawnEvent);
                        break;
                    case LevelData_2.EventType.BOSS:
                        this.boss = this.addBossCallback(nextEvent.bossType);
                        break;
                    case LevelData_2.EventType.WAIT: break;
                }
            }
            if (this.boss) {
                if (this.boss.toDestroy) {
                    this.boss = null;
                    this.data = [];
                }
                else {
                    if (this.data.length === 0 && this.boss.commands.length === 0) {
                        this.loadBossLoop(this.boss.bossType);
                    }
                }
            }
            return this.distance;
        };
        EventInterpreter.prototype.isComplete = function () {
            if (this.boss) {
                return false;
            }
            return (this.data.length === 0);
        };
        return EventInterpreter;
    }());
    exports.EventInterpreter = EventInterpreter;
});
define("game/objects/Missile", ["require", "exports", "game/objects/GameSprite", "game/objects/PlayerShip", "game/data/EnemyData"], function (require, exports, GameSprite_7, PlayerShip_1, EnemyData_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Missile = (function (_super) {
        __extends(Missile, _super);
        function Missile(origin, target, config) {
            var _this = _super.call(this) || this;
            _this.target = target;
            _this.config = config;
            _this.update = function (speed) {
                if (_this.config.delay > 0) {
                    _this.config.delay -= speed;
                }
                else {
                    if (_this.target.toDestroy) {
                        _this.toDestroy = true;
                    }
                    var dx = _this.target.x - _this.x;
                    var dy = _this.target.y - _this.y;
                    var angle = Math.atan2(dy, dx);
                    _this.rotation = angle + Math.PI / 2;
                    var distance = Math.sqrt(dy * dy + dx * dx);
                    if (distance < Math.max(30, speed * _this.speed * 2)) {
                        _this.config.onComplete(_this.target);
                        _this.toDestroy = true;
                    }
                    else {
                        _this.x += speed * _this.speed * Math.cos(angle);
                        _this.y += speed * _this.speed * Math.sin(angle);
                        if (_this.target.turret) {
                            if (_this.target.turret.targetInRange(_this)) {
                                _this.toDestroy = true;
                                _this.target.addWord();
                            }
                        }
                    }
                }
            };
            _this.onWordComplete = function () {
                if (_this.config.onWordComplete) {
                    _this.config.onWordComplete(_this);
                }
            };
            if (origin instanceof PlayerShip_1.PlayerShip) {
                var missileConfig = EnemyData_2.MissileData.player;
            }
            else {
                missileConfig = EnemyData_2.MissileData.enemy;
            }
            if (missileConfig.textureUrl) {
                _this.makeDisplay(missileConfig.textureUrl, missileConfig.textureScale);
            }
            _this.wordSize = missileConfig.wordSize;
            _this.value = missileConfig.value;
            _this.speed = missileConfig.moveSpeed;
            _this.killBy = missileConfig.killBy;
            _this.health = missileConfig.health;
            if (missileConfig.turnRate || missileConfig.turnRate === 0) {
                _this.turnRate = missileConfig.turnRate;
            }
            if (_this.wordSize > 0) {
                _this.addWord();
            }
            _this.x = origin.x;
            _this.y = origin.y;
            return _this;
        }
        return Missile;
    }(GameSprite_7.GameSprite));
    exports.Missile = Missile;
});
define("game/engine/ActionControl", ["require", "exports", "game/engine/ObjectManager", "game/objects/Missile", "game/data/Misc"], function (require, exports, ObjectManager_3, Missile_1, Misc_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActionControl = (function () {
        function ActionControl(manager) {
            var _this = this;
            this.manager = manager;
            this.missileCount = 0;
            this.missileRate = 1;
            this.playerFires = function (player, enemy) {
                if (enemy.shieldOn) {
                    _this.shootEMP(player, enemy);
                }
                else {
                    switch (enemy.killBy) {
                        case Misc_10.ActionType.MISSILE:
                            _this.shootPlayerMissile(player, enemy);
                            break;
                        case Misc_10.ActionType.LASER:
                            _this.shootPlayerLaser(player, enemy);
                            break;
                        case Misc_10.ActionType.INSTANT:
                        default:
                            enemy.dispose();
                            break;
                    }
                }
            };
            this.enemyFires = function (player, enemy) {
                switch (enemy.fires) {
                    case Misc_10.ActionType.MISSILE:
                        _this.shootEnemyMissile(enemy, player);
                        break;
                    case Misc_10.ActionType.AUTO_MISSILE:
                        _this.shootEnemyMissile(enemy, player, true);
                        break;
                    case Misc_10.ActionType.LASER:
                        _this.shootEnemyLaser(enemy, player);
                        break;
                    case Misc_10.ActionType.SUICIDE:
                        _this.shootSuicide(enemy, player);
                        break;
                }
            };
            this.enemyDestroyed = function (enemy) {
                enemy.toDestroy = true;
                var size = enemy.wordSize === 3 ? 20 : 40;
                _this.manager.container.makeExplosionAt(enemy.x, enemy.y, size);
                _this.manager.container.makeScoreDisplay(enemy.x, enemy.y, enemy.value);
                _this.manager.addScore(enemy.value);
            };
        }
        ActionControl.prototype.shootPlayerMissile = function (origin, target) {
            this.manager.container.addObject(new Missile_1.Missile(origin, target, { onComplete: this.enemyDestroyed }), ObjectManager_3.DisplayLayer.DEFAULT, false);
        };
        ActionControl.prototype.shootPlayerLaser = function (origin, target) {
            var _this = this;
            origin.laserCharge.startCharge(function () {
                _this.manager.container.makeLaser(origin, target, 0x00ffff);
                _this.enemyDestroyed(target);
            });
        };
        ActionControl.prototype.shootEnemyMissile = function (origin, target, auto) {
            var _this = this;
            if (auto) {
                this.missileCount += 1;
            }
            else {
                this.missileCount += this.missileRate;
                switch (origin.health) {
                    case 2:
                        this.missileCount += this.missileRate * 1.5;
                        break;
                    case 3:
                        this.missileCount += this.missileRate * 2;
                        break;
                    case 4:
                        this.missileCount += this.missileRate * 2.5;
                        break;
                    default:
                        this.missileCount += this.missileRate;
                        break;
                }
            }
            if (this.missileCount >= 1) {
                origin.priority = 0;
                origin.value -= 1;
                this.missileCount -= 1;
                this.manager.container.addObject(new Missile_1.Missile(origin, target, { onComplete: function () { return _this.manager.player.addHealth(-1); }, onWordComplete: function (missile) { return _this.playerFires(_this.manager.player, missile); } }), ObjectManager_3.DisplayLayer.PROJECTILES, false);
            }
        };
        ActionControl.prototype.shootEnemyLaser = function (origin, target, instant) {
            var _this = this;
            if (instant) {
                this.manager.container.makeLaser(origin, target, 0xff0000);
                this.manager.player.addHealth(-1);
                origin.priority = 0;
            }
            else {
                origin.priority = 2;
                origin.startCharge(function () {
                    _this.manager.container.makeLaser(origin, target, 0xff0000);
                    _this.manager.player.addHealth(-1);
                    origin.priority = 0;
                });
            }
        };
        ActionControl.prototype.shootEMP = function (origin, target) {
            var _this = this;
            origin.empCharge.startCharge(function () {
                _this.manager.container.makeEMP(origin, target);
                target.removeShield();
            });
        };
        ActionControl.prototype.shootSuicide = function (origin, target) {
            var _this = this;
            origin.replaceCommands([{ x: target.x, y: target.y, move: true }]);
            origin.callbacks.onFinishCommands = function () { return _this.manager.player.addHealth(-1); };
            ;
            origin.priority = 3;
        };
        return ActionControl;
    }());
    exports.ActionControl = ActionControl;
});
define("game/engine/WordInput", ["require", "exports", "game/text/TextObject", "JMGE/JMBL", "game/data/Misc", "game/objects/PlayerShip"], function (require, exports, TextObject_3, JMBL, Misc_11, PlayerShip_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WordInput = (function () {
        function WordInput() {
            var _this = this;
            this.text = "";
            this.healWord = new TextObject_3.TextObject(0, 0, null, function () {
                _this.healWord.dispose();
                JMBL.events.publish(Misc_11.GameEvents.REQUEST_HEAL_PLAYER, 1);
            });
            this.overflow = [];
            this.overflowTimer = 0;
            this.checkHealth = function (health) {
                if (health < PlayerShip_2.PlayerShip.MAX_HEALTH) {
                    if (!_this.healWord.hasWord()) {
                        _this.healWord.newWord(8);
                    }
                    _this.healWord.setPriority(Math.min(3, 4 - health));
                }
                else if (health >= PlayerShip_2.PlayerShip.MAX_HEALTH) {
                    if (_this.healWord) {
                        _this.healWord.dispose();
                    }
                }
            };
            this.addOverflow = function (word) {
                _this.overflow.push([word, (_this.overflowTimer + WordInput.OVERFLOW_DURATION - 1) % WordInput.OVERFLOW_DURATION]);
            };
            this.update = function () {
                if (_this.overflow.length > 0) {
                    _this.overflowTimer = (_this.overflowTimer + 1) % WordInput.OVERFLOW_DURATION;
                    while (_this.overflow.length > 0 && _this.overflow[0][1] === _this.overflowTimer) {
                        _this.overflow.shift();
                    }
                }
            };
            JMBL.events.add(Misc_11.GameEvents.NOTIFY_SET_HEALTH, this.checkHealth);
            JMBL.events.add(Misc_11.GameEvents.REQUEST_OVERFLOW_WORD, this.addOverflow);
            JMBL.events.ticker.add(this.update);
        }
        WordInput.prototype.dispose = function () {
            if (this.healWord) {
                this.healWord.dispose();
            }
            JMBL.events.remove(Misc_11.GameEvents.NOTIFY_SET_HEALTH, this.checkHealth);
            JMBL.events.remove(Misc_11.GameEvents.REQUEST_OVERFLOW_WORD, this.addOverflow);
            JMBL.events.ticker.remove(this.update);
        };
        WordInput.prototype.addLetter = function (letter) {
            if (this.checkLetter(letter)) {
                this.text += letter;
                for (var i = 0; i < TextObject_3.TextObject.allTextObjects.length; i++) {
                    var text = TextObject_3.TextObject.allTextObjects[i].matchAndReturnWord(this.text);
                    if (text) {
                        this.removeWord(text);
                        TextObject_3.TextObject.allTextObjects[i].triggerWordComplete();
                        this.finishAddLetter();
                        return;
                    }
                }
                for (var i = 0; i < this.overflow.length; i++) {
                    if (this.testWord(this.overflow[i][0])) {
                        this.removeWord(this.overflow[i][0]);
                        this.overflow.splice(i, 1);
                        this.finishAddLetter();
                        return;
                    }
                }
                if (this.testWord("pause")) {
                    this.removeWord("pause");
                    JMBL.events.publish(Misc_11.GameEvents.REQUEST_PAUSE_GAME, true);
                    this.finishAddLetter();
                    return;
                }
            }
            this.finishAddLetter();
        };
        WordInput.prototype.deleteLetters = function (i) {
            if (this.text.length > 0) {
                this.text = this.text.substr(0, this.text.length - i);
                JMBL.events.publish(Misc_11.GameEvents.NOTIFY_LETTER_DELETED, i);
                JMBL.events.publish(Misc_11.GameEvents.NOTIFY_UPDATE_INPUT_WORD, this.text);
            }
        };
        WordInput.prototype.checkLetter = function (letter) {
            if (letter.length > 1) {
                return false;
            }
            letter = letter.toLowerCase();
            if (letter >= "a" && letter <= "z") {
                return true;
            }
            else {
                return false;
            }
        };
        WordInput.prototype.finishAddLetter = function () {
            if (this.text.length > 20) {
                var i = this.text.length - 20;
                this.text = this.text.substring(i);
                JMBL.events.publish(Misc_11.GameEvents.NOTIFY_LETTER_DELETED, i);
            }
            JMBL.events.publish(Misc_11.GameEvents.NOTIFY_UPDATE_INPUT_WORD, this.text);
        };
        WordInput.prototype.testWord = function (word) {
            return word === this.text.substring(this.text.length - word.length);
        };
        WordInput.prototype.removeWord = function (word) {
            JMBL.events.publish(Misc_11.GameEvents.NOTIFY_WORD_COMPLETED, word);
            this.text = this.text.substr(0, this.text.length - word.length);
        };
        WordInput.OVERFLOW_DURATION = 100;
        return WordInput;
    }());
    exports.WordInput = WordInput;
});
define("game/GameManager", ["require", "exports", "game/engine/ObjectManager", "JMGE/UI/BaseUI", "JMGE/effects/Starfield", "JMGE/JMBL", "Config", "game/objects/EnemyShip", "game/objects/BossShip", "game/objects/PlayerShip", "game/engine/EventInterpreter", "game/engine/ActionControl", "game/engine/WordInput", "game/data/Misc", "game/text/TextObject"], function (require, exports, ObjectManager_4, BaseUI_1, Starfield_1, JMBL, Config_4, EnemyShip_1, BossShip_1, PlayerShip_3, EventInterpreter_1, ActionControl_1, WordInput_1, Misc_12, TextObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameManager = (function (_super) {
        __extends(GameManager, _super);
        function GameManager(level, difficulty) {
            if (level === void 0) { level = 0; }
            if (difficulty === void 0) { difficulty = 1; }
            var _this = _super.call(this) || this;
            _this.running = true;
            _this.container = new ObjectManager_4.ObjectManager();
            _this.actionC = new ActionControl_1.ActionControl(_this);
            _this.player = new PlayerShip_3.PlayerShip();
            _this.wordInput = new WordInput_1.WordInput();
            _this.score = 0;
            _this.gameSpeed = 1;
            _this.levelEnded = false;
            _this.dispose = function () {
                JMBL.events.ticker.remove(_this.onTick);
                JMBL.events.remove(JMBL.EventType.KEY_DOWN, _this.keyDown);
                JMBL.events.remove(Misc_12.GameEvents.NOTIFY_LETTER_DELETED, function (i) { return _this.addScore(-i); });
                JMBL.events.remove(Misc_12.GameEvents.REQUEST_HEAL_PLAYER, _this.player.addHealth);
                JMBL.events.remove(Misc_12.GameEvents.REQUEST_PAUSE_GAME, _this.togglePause);
                _this.player.dispose();
                _this.container.dispose();
                _this.wordInput.dispose();
                _this.destroy();
            };
            _this.keyDown = function (e) {
                if (!_this.running) {
                    if (e.key === " ") {
                        _this.togglePause();
                    }
                    return;
                }
                switch (e.key) {
                    case "Escape":
                        _this.navBack();
                        break;
                    case " ":
                        _this.togglePause();
                        break;
                    case "=":
                        _this.gameSpeed += 1;
                        break;
                    case "-":
                        _this.gameSpeed -= 1;
                        break;
                    case "Backspace":
                        _this.wordInput.deleteLetters(1);
                        break;
                    default:
                        _this.wordInput.addLetter(e.key);
                        break;
                }
            };
            _this.onTick = function () {
                if (!_this.running)
                    return;
                _this.starfield.update(_this.gameSpeed);
                _this.container.updateAll(_this.gameSpeed);
                if (_this.levelEvents.isComplete()) {
                    if (_this.container.numObjects() <= 1) {
                        if (!_this.levelEnded) {
                            _this.levelEnded = true;
                            console.log("END LEVEL");
                        }
                    }
                }
                else {
                    _this.levelEvents.addDistance(_this.gameSpeed);
                }
                JMBL.events.publish(Misc_12.GameEvents.NOTIFY_SET_PROGRESS, { current: _this.levelEvents.distance, total: _this.levelEvents.finalDistance });
            };
            _this.togglePause = function () {
                _this.running = !_this.running;
                TextObject_4.TextObject.allTextObjects.forEach(function (object) { return object.visible = _this.running; });
            };
            _this.setScore = function (score) {
                _this.score = score;
                JMBL.events.publish(Misc_12.GameEvents.NOTIFY_SET_SCORE, _this.score);
            };
            _this.addScore = function (add) {
                _this.score += add;
                JMBL.events.publish(Misc_12.GameEvents.NOTIFY_SET_SCORE, _this.score);
            };
            _this.addEnemy = function (spawnEvent) {
                spawnEvent.x *= Config_4.CONFIG.INIT.STAGE_WIDTH / 12;
                spawnEvent.y *= Config_4.CONFIG.INIT.STAGE_HEIGHT / 12;
                spawnEvent.commands.forEach(function (command) {
                    command.x *= Config_4.CONFIG.INIT.STAGE_WIDTH / 12;
                    command.y *= Config_4.CONFIG.INIT.STAGE_HEIGHT / 12;
                    command.timer *= 6;
                });
                var newShip = new EnemyShip_1.EnemyShip(spawnEvent, { onFire: function (enemy) { return _this.actionC.enemyFires(_this.player, enemy); }, onWordComplete: function (enemy) { return _this.actionC.playerFires(_this.player, enemy); } });
                _this.container.addObject(newShip, ObjectManager_4.DisplayLayer.ENEMIES);
                return newShip;
            };
            _this.addBoss = function (bossType) {
                var boss;
                switch (bossType) {
                    case 0:
                        boss = new BossShip_1.BossShip0(bossType, _this);
                        break;
                    case 1:
                        boss = new BossShip_1.BossShip1(bossType, _this);
                        break;
                    case 2:
                        boss = new BossShip_1.BossShip2(bossType, _this);
                        break;
                }
                _this.container.addObject(boss, ObjectManager_4.DisplayLayer.DEFAULT);
                return boss;
            };
            _this.gameSpeed = difficulty * 0.5;
            _this.container.gameUI.addHealWord(_this.wordInput.healWord);
            _this.starfield = new Starfield_1.Starfield(Config_4.CONFIG.INIT.SCREEN_WIDTH, Config_4.CONFIG.INIT.SCREEN_HEIGHT);
            _this.actionC.missileRate = 0.4;
            _this.levelEvents = new EventInterpreter_1.EventInterpreter(_this.addEnemy, _this.addBoss);
            _this.levelEvents.loadLevel(level, 60);
            _this.player.x = Config_4.CONFIG.INIT.STAGE_WIDTH / 2;
            _this.player.y = Config_4.CONFIG.INIT.STAGE_HEIGHT - 150;
            _this.player.setHealth(5);
            _this.setScore(0);
            _this.addChild(_this.starfield, _this.container);
            _this.container.addObject(_this.player, ObjectManager_4.DisplayLayer.DEFAULT);
            JMBL.events.ticker.add(_this.onTick);
            JMBL.events.add(JMBL.EventType.KEY_DOWN, _this.keyDown);
            JMBL.events.add(Misc_12.GameEvents.NOTIFY_LETTER_DELETED, function (i) { return _this.addScore(-i); });
            JMBL.events.add(Misc_12.GameEvents.REQUEST_HEAL_PLAYER, _this.player.addHealth);
            JMBL.events.add(Misc_12.GameEvents.REQUEST_PAUSE_GAME, _this.togglePause);
            return _this;
        }
        return GameManager;
    }(BaseUI_1.BaseUI));
    exports.GameManager = GameManager;
});
define("game/data/StringData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SOLDIER = "SOLDIER", exports.CONQUEROR = "CONQUEROR", exports.PERFECTIONIST = "PERFECTION", exports.RIDDLER = "RIDDLER", exports.EXPLORER = "EXPLORER", exports.DEFENDER = "DEFENDER", exports.BRONZE = "BRONZE", exports.SILVER = "SILVER", exports.GOLD = "GOLD", exports.DONE = "DONE", exports.LEVEL_SCORE = "LEVEL SCORE: ", exports.DIFF_BONUS = "DIFFICULTY BONUS x", exports.HEALTH_BONUS = "HEALTH BONUS x", exports.HEALTH_PERFECT = "PERFECT HEALTH x", exports.ACC_BONUS = "ACCURACY BONUS x", exports.ACC_PERFECT = "PERFECT ACCURACY x", exports.FINAL_SCORE = "FINAL SCORE: ", exports.SPACEBAR = "HIT SPACEBAR TO CONTINUE", exports.SCORE = "SCORE:", exports.PAUSED = "-PAUSED-", exports.YES = "YES", exports.NO = "NO", exports.LOW_HEALTH = "Low Health!", exports.EASY = "EASY", exports.NORMAL = "NORMAL", exports.HARD = "HARD", exports.EXTREME = "EXTREME", exports.INSANE = "INSANE", exports.MENU = "MENU", exports.HS_SUBMIT = "SUBMIT SCORE", exports.MORE_GAMES = "MORE GAMES", exports.WON_GAME = "Congratulations!  You won the game!", exports.LOSE_GAME = "You have been destroyed!", exports.MUTE = "mute", exports.UNMUTE = "unmute", exports.SUPERMAN = "superman", exports.KAMIKAZE = "kamikaze", exports.CHAMELEON = "chameleon", exports.PAUSE = "pause", exports.UNPAUSE = "unpause", exports.HEALTH = "HEALTH", exports.ACCURACY = "ACCURACY", exports.START_GAME = "START GAME", exports.HIGHSCORE = "HIGH SCORE", exports.ACHIEVE = "ACHIEVEMENTS", exports.CREDITS = "CREDITS", exports.TITLE0 = "MILLENIUM", exports.TITLE1 = "TYPER", exports.NEW_ACHIEVE = "New Achievement!", exports.SKIP = "SKIP", exports.FINAL_CREDITS = "As the debris settles in the depths of space a heavy sigh of relief washes across all the people of earth.  The evil emperor has been defeated and the planet freed... an age of peace and prosperity is sure to follow.\n\n\nConcept and Design by:\nYermiyah Hornick\n\n\nProgramming by:\nYermiyah Hornick\n\n\nArt by:\nAvi Kentridge\n\n\nMusic By:\nBinyamin Hornick\n\n\nSound Effects by:\nYermiyah Hornick\nAvi Kentridge\n\n\nThank you for playing!";
    function getAchieveArray(s) {
        switch (s) {
            case exports.SOLDIER: return ["DESTROY 10 ENEMY SHIPS", "DESTROY 1,000 ENEMY SHIPS", "DESTROY 20,000 ENEMY SHIPS"];
            case exports.CONQUEROR: return ["DEFEAT THE FIRST BOSS", "DEFEAT THE SECOND BOSS", "FINISH THE GAME"];
            case exports.PERFECTIONIST: return ["COMPLETE ANY LEVEL KILLING EVERY SHIP", "ACHIEVE 5 GOLD ACCURACY MEDALS", "FINISH EVERY LEVEL WITH PERFECT ACCURACY"];
            case exports.RIDDLER: return ["IT'S A BIRD, IT'S A PLANE, IT'S...", "JAPANESE DEATH PILOT'S SCREAM", "NATURE'S MASTER OF DISGUISE"];
            case exports.EXPLORER: return ["VISIT OUR SPONSORS", "PAUSE THE GAME WITHOUT CLICKING", "KILL SUPERMAN"];
            case exports.DEFENDER: return ["COMPLETE ANY LEVEL WITH PERFECT HEALTH", "ACHIEVE 5 GOLD HEALTH MEDALS", "FINISH EVERY LEVEL WITH PERFECT HEALTH"];
            default: return null;
        }
    }
    exports.getAchieveArray = getAchieveArray;
    function levelComplete(i) {
        return "Level " + String(i) + " Complete!";
    }
    exports.levelComplete = levelComplete;
});
define("menus/DifficultyPopup", ["require", "exports", "JMGE/JMBUI", "game/data/StringData"], function (require, exports, JMBUI, StringData) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DifficultyPopup = (function (_super) {
        __extends(DifficultyPopup, _super);
        function DifficultyPopup(highscore, callback) {
            var _this = _super.call(this) || this;
            _this.callback = callback;
            var background = new PIXI.Graphics;
            background.beginFill(0);
            background.lineStyle(2, 0xf1f1f1);
            background.drawRoundedRect(0, 0, 80, 210, 3);
            _this.addChild(background);
            var hsText = new PIXI.Text(String(highscore), { fill: 0xffee33, fontSize: 13 });
            hsText.x = 80 - hsText.width - 5;
            hsText.y = 5;
            _this.addChild(hsText);
            _this.makeButton(StringData.EASY, 1, 35, 0xf1f1f1);
            _this.makeButton(StringData.NORMAL, 1, 70, 0xf1f1f1);
            _this.makeButton(StringData.HARD, 1, 105, 0xf1f1f1);
            _this.makeButton(StringData.EXTREME, 1, 140, 0xf1f1f1);
            _this.makeButton(StringData.INSANE, 1, 175, 0xf1f1f1);
            return _this;
        }
        DifficultyPopup.prototype.makeButton = function (text, index, y, color) {
            var _this = this;
            var _button = new JMBUI.Button({ width: 70, height: 30, x: 5, y: y, label: text, output: function () { return _this.callback(index); } });
            this.addChild(_button);
        };
        return DifficultyPopup;
    }(PIXI.Container));
    exports.DifficultyPopup = DifficultyPopup;
});
define("menus/LevelSelectUI", ["require", "exports", "JMGE/JMBUI", "Config", "JMGE/UI/BaseUI", "game/GameManager", "menus/DifficultyPopup"], function (require, exports, JMBUI, Config_5, BaseUI_2, GameManager_1, DifficultyPopup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LevelSelectUI = (function (_super) {
        __extends(LevelSelectUI, _super);
        function LevelSelectUI() {
            var _this = _super.call(this, { width: Config_5.CONFIG.INIT.STAGE_WIDTH, height: Config_5.CONFIG.INIT.STAGE_HEIGHT, bgColor: 0x666666 }) || this;
            _this.currentLevel = 0;
            _this.currentDifficulty = 1;
            _this.NUMSHOWN = 3;
            _this.C_SHOWN = 0;
            _this.changeLevelAndStartGame = function (level, button) {
                _this.currentLevel = level;
                if (_this.difficultyPopup) {
                    _this.difficultyPopup.destroy();
                }
                _this.difficultyPopup = new DifficultyPopup_1.DifficultyPopup(100, _this.changeDifficultyAndStartGame);
                _this.difficultyPopup.x = button.x + 50;
                _this.difficultyPopup.y = button.y + 30;
                _this.addChild(_this.difficultyPopup);
            };
            _this.changeDifficultyAndStartGame = function (difficulty) {
                _this.currentDifficulty = difficulty;
                _this.startGame();
            };
            _this.startGame = function () {
                _this.navForward(new GameManager_1.GameManager(_this.currentLevel, _this.currentDifficulty));
                if (_this.difficultyPopup) {
                    _this.difficultyPopup.destroy();
                    _this.difficultyPopup = null;
                }
            };
            _this.leave = function () {
                _this.navBack();
            };
            var _button = new JMBUI.Button({ width: 100, height: 30, x: 20, y: Config_5.CONFIG.INIT.STAGE_HEIGHT - 50, label: "Menu", output: _this.leave });
            _this.addChild(_button);
            _button = new JMBUI.Button({ width: 100, height: 30, x: Config_5.CONFIG.INIT.STAGE_WIDTH - 120, y: Config_5.CONFIG.INIT.STAGE_HEIGHT - 50, label: "Start", output: _this.startGame });
            _this.addChild(_button);
            for (var i = 0; i < 12; i++) {
                _this.makeLevelButton(i, 5 + Math.floor(i / 6) * 60, 20 + (i % 6) * 40);
            }
            return _this;
        }
        LevelSelectUI.prototype.makeLevelButton = function (i, x, y) {
            var _this = this;
            var _button = new JMBUI.Button({ width: 50, height: 30, x: x, y: y, label: "Level " + i, output: function () { return _this.changeLevelAndStartGame(i, _button); } });
            this.addChild(_button);
        };
        return LevelSelectUI;
    }(BaseUI_2.BaseUI));
    exports.LevelSelectUI = LevelSelectUI;
});
define("JMGE/UI/InventoryUI", ["require", "exports", "JMGE/JMBUI", "JMGE/JMBL"], function (require, exports, JMBUI, JMBL) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function baseEquipFunction(data, index) {
        this.applyData(data);
        this.inventory[index] = data;
    }
    function baseUnequipFunction(data, index) {
        this.removeData(data);
        this.inventory[index] = null;
    }
    var InventoryWindow = (function (_super) {
        __extends(InventoryWindow, _super);
        function InventoryWindow(options) {
            var _this = _super.call(this, options) || this;
            _this.options = options;
            _this.slots = [];
            _this.getHeight = function () {
                return _this.slotStart.y + _this.slotHeight * Math.floor(_this.options.numSlots / _this.options.numAcross);
            };
            _this.getWidth = function () {
                return _this.slotStart.x + _this.slotWidth * (_this.options.numAcross);
            };
            _this.mouseDown = function (e) {
                var index = _this.getIndexAtLoc(e.x, e.y);
                if (_this.slots[index]) {
                    var item = _this.slots[index].stored;
                    if (item) {
                        _this.dragLayer.addChild(item);
                        e.startDrag(item, _this.moveDrag, _this.endDrag, null, new PIXI.Point(-item.getWidth() / 2, -item.getHeight() / 2));
                        _this.moveDrag(item, e);
                    }
                }
            };
            _this.moveDrag = function (object, e) {
                object.x = e.x + e.drag.offset.x;
                object.y = e.y + e.drag.offset.y;
                return true;
            };
            _this.endDrag = function (object, e) {
                var index = _this.getIndexAtLoc(e.x, e.y);
                if (_this.slots[index]) {
                    _this.dropItem(object, index);
                }
                else {
                    index = _this.otherInventory.getIndexAtLoc(e.x, e.y);
                    if (_this.otherInventory.slots[index]) {
                        _this.otherInventory.dropItem(object, index);
                    }
                    else {
                        _this.returnItem(object);
                    }
                }
                return true;
            };
            _this.addItemAt = function (item, index) {
                if (!item || index === -1) {
                    return true;
                }
                if (_this.slots[index].stored) {
                    _this.removeItemAt(index);
                }
                _this.slots[index].stored = item;
                item.index = index;
                item.location = _this;
                var loc = _this.getLocAtIndex(index);
                item.x = loc.x - item.getWidth() / 2;
                item.y = loc.y - item.getHeight() / 2;
                _this.addChild(item);
                if (_this.equipFunction) {
                    _this.equipFunction(item.data, index);
                }
                return true;
            };
            _this.dragLayer = options.dragLayer;
            _this.equipFunction = options.equipFunction;
            _this.unequipFunction = options.unequipFunction;
            _this.alsoUpdate = options.alsoUpdate;
            _this.locked = options.locked;
            _this.slotStart = new PIXI.Point(options.startX - options.padding / 2, options.startY - options.padding / 2);
            _this.slotWidth = options.slotOptions.width + options.padding;
            _this.slotHeight = options.slotOptions.height + options.padding;
            for (var i = 0; i < options.numSlots; i++) {
                _this.slots[i] = new ItemSlot(i, _this, null, options.slotOptions);
                _this.slots[i].x = options.startX + (i % options.numAcross) * _this.slotWidth;
                _this.slots[i].y = options.startY + Math.floor(i / options.numAcross) * _this.slotHeight;
                _this.addChild(_this.slots[i]);
            }
            JMBL.events.add(JMBL.EventType.MOUSE_DOWN, _this.mouseDown);
            return _this;
        }
        InventoryWindow.prototype.linkWindows = function (window) {
            this.otherInventory = window;
            window.otherInventory = this;
        };
        InventoryWindow.prototype.getIndexAtLoc = function (x, y) {
            var local = this.toLocal(new PIXI.Point(x, y));
            if (local.x < this.slotStart.x || (local.x - this.slotStart.x) / this.slotWidth > this.options.numAcross) {
                return -1;
            }
            return Math.floor((local.x - this.slotStart.x) / this.slotWidth) + Math.floor((local.y - this.slotStart.y) / this.slotHeight) * this.options.numAcross;
        };
        InventoryWindow.prototype.getLocAtIndex = function (index) {
            return new PIXI.Point(this.slotStart.x + (index % this.options.numAcross + 0.5) * this.slotWidth, this.slotStart.y + (Math.floor(index / this.options.numAcross) + 0.5) * this.slotHeight);
        };
        InventoryWindow.prototype.clear = function () {
            for (var i = 0; i < this.slots.length; i++) {
                if (this.slots[i].stored) {
                    this.removeItemAt(i).destroy();
                }
            }
        };
        InventoryWindow.prototype.addItem = function (item) {
            for (var i = 0; i < this.slots.length; i++) {
                if (!this.slots[i].stored) {
                    this.addItemAt(item, i);
                    return true;
                }
            }
            return false;
        };
        InventoryWindow.prototype.removeItem = function (item) {
            if (item.location !== this) {
                return null;
            }
            return this.removeItemAt(item.index);
        };
        InventoryWindow.prototype.removeItemAt = function (index) {
            var m = this.slots[index].stored;
            this.slots[index].stored = null;
            if (this.unequipFunction) {
                this.unequipFunction(m.data, index);
            }
            return m;
        };
        InventoryWindow.prototype.check = function (item, index) {
            return this.slots[index].check(item);
        };
        InventoryWindow.prototype.returnItem = function (item) {
            if (this.slots[item.index].stored === item) {
                item.location.addItemAt(item, item.index);
            }
            else {
                this.addItemAt(item, item.index);
            }
        };
        InventoryWindow.prototype.dropItem = function (item, index) {
            var prevLocation = item.location;
            var prevIndex = item.index;
            if (!this.check(item, index)) {
                prevLocation.returnItem(item);
                return;
            }
            if (!prevLocation.removeItem(item)) {
                prevLocation.returnItem(item);
                return;
            }
            var item2 = this.slots[index].stored;
            if (this.slots[index].stored) {
                item2 = this.removeItemAt(index);
                this.addItemAt(item, index);
                if (prevLocation.check(item2, prevIndex) && !prevLocation.slots[prevIndex].stored) {
                    prevLocation.addItemAt(item2, prevIndex);
                }
                else if (!prevLocation.addItem(item2)) {
                    if (!this.addItem(item2)) {
                        this.removeItemAt(index);
                        item.index = prevIndex;
                        prevLocation.returnItem(item);
                        this.addItemAt(item2, index);
                    }
                }
            }
            else {
                this.addItemAt(item, index);
            }
            if (this.alsoUpdate) {
                this.alsoUpdate();
            }
        };
        return InventoryWindow;
    }(JMBUI.BasicElement));
    exports.InventoryWindow = InventoryWindow;
    var ItemSlot = (function (_super) {
        __extends(ItemSlot, _super);
        function ItemSlot(index, location, type, options) {
            var _this = _super.call(this, options || {}) || this;
            _this.type = type;
            _this.interactive = false;
            return _this;
        }
        ItemSlot.prototype.check = function (item) {
            if (this.disabled) {
                return false;
            }
            if (this.type && item.type && this.type !== item.type) {
                return false;
            }
            return true;
        };
        ItemSlot.prototype.toggleDisabled = function (b) {
            if (b) {
                this.setDisplayState(JMBUI.DisplayState.DARKENED);
                this.disabled = true;
            }
            else if (b === false) {
                this.setDisplayState(JMBUI.DisplayState.NORMAL);
                this.disabled = false;
            }
            else {
                this.toggleDisabled(!this.disabled);
            }
        };
        return ItemSlot;
    }(JMBUI.InteractiveElement));
    exports.ItemSlot = ItemSlot;
    var ItemObject = (function (_super) {
        __extends(ItemObject, _super);
        function ItemObject(data, config) {
            var _this = _super.call(this, config) || this;
            _this.index = -1;
            _this.data = data;
            _this.buttonMode = true;
            _this.draggable = true;
            return _this;
        }
        ItemObject.prototype.update = function (data) {
            this.data = data;
        };
        Object.defineProperty(ItemObject.prototype, "tooltipName", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemObject.prototype, "tooltipDesc", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        return ItemObject;
    }(JMBUI.InteractiveElement));
    exports.ItemObject = ItemObject;
});
define("game/data/PlayerData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BadgeState;
    (function (BadgeState) {
        BadgeState[BadgeState["NONE"] = 0] = "NONE";
        BadgeState[BadgeState["BRONZE"] = 1] = "BRONZE";
        BadgeState[BadgeState["SILVER"] = 2] = "SILVER";
        BadgeState[BadgeState["GOLD"] = 3] = "GOLD";
        BadgeState[BadgeState["PLATINUM"] = 4] = "PLATINUM";
    })(BadgeState = exports.BadgeState || (exports.BadgeState = {}));
    var Badges;
    (function (Badges) {
        Badges[Badges["SOLDIER_BRONZE"] = 0] = "SOLDIER_BRONZE";
        Badges[Badges["SOLDIER_SILVER"] = 1] = "SOLDIER_SILVER";
        Badges[Badges["SOLDIER_GOLD"] = 2] = "SOLDIER_GOLD";
        Badges[Badges["CONQUEROR_BRONZE"] = 3] = "CONQUEROR_BRONZE";
        Badges[Badges["CONQUEROR_SILVER"] = 4] = "CONQUEROR_SILVER";
        Badges[Badges["CONQUEROR_GOLD"] = 5] = "CONQUEROR_GOLD";
        Badges[Badges["RIDDLER_BRONZE"] = 6] = "RIDDLER_BRONZE";
        Badges[Badges["RIDDLER_SILVER"] = 7] = "RIDDLER_SILVER";
        Badges[Badges["RIDDLER_GOLD"] = 8] = "RIDDLER_GOLD";
        Badges[Badges["DEFENDER_BRONZE"] = 9] = "DEFENDER_BRONZE";
        Badges[Badges["DEFENDER_SILVER"] = 10] = "DEFENDER_SILVER";
        Badges[Badges["DEFENDER_GOLD"] = 11] = "DEFENDER_GOLD";
        Badges[Badges["PERFECTION_BRONZE"] = 12] = "PERFECTION_BRONZE";
        Badges[Badges["PERFECTION_SILVER"] = 13] = "PERFECTION_SILVER";
        Badges[Badges["PERFECTION_GOLD"] = 14] = "PERFECTION_GOLD";
        Badges[Badges["EXPLORER_BRONZE"] = 15] = "EXPLORER_BRONZE";
        Badges[Badges["EXPLORER_SILVER"] = 16] = "EXPLORER_SILVER";
        Badges[Badges["EXPLORER_GOLD"] = 17] = "EXPLORER_GOLD";
    })(Badges = exports.Badges || (exports.Badges = {}));
    var ExtrinsicModel = (function () {
        function ExtrinsicModel(data) {
            if (data === void 0) { data = {}; }
            this.data = data;
        }
        ExtrinsicModel.loadExtrinsic = function (data) {
            return new ExtrinsicModel(data);
        };
        return ExtrinsicModel;
    }());
    exports.ExtrinsicModel = ExtrinsicModel;
});
define("utils/SaveData", ["require", "exports", "game/data/PlayerData"], function (require, exports, PlayerData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveData = (function () {
        function SaveData() {
        }
        SaveData.init = function () {
            this.loadVersion(function (version) {
                if (version < SaveData.VERSION) {
                    SaveData.confirmReset();
                    SaveData.saveVersion(SaveData.VERSION);
                    SaveData.saveExtrinsic();
                }
                else {
                    SaveData.loadExtrinsic(function (extrinsic) {
                        if (extrinsic) {
                            SaveData.extrinsic = extrinsic;
                        }
                        else {
                            SaveData.confirmReset();
                        }
                    });
                }
            });
        };
        SaveData.resetData = function () {
            return this.confirmReset;
        };
        SaveData.getExtrinsic = function () {
            return SaveData.extrinsic;
        };
        SaveData.saveExtrinsic = function (callback, extrinsic) {
            extrinsic = extrinsic || this.extrinsic;
            SaveData.saveExtrinsicToLocal(extrinsic);
            if (callback) {
                callback(extrinsic);
            }
        };
        SaveData.loadExtrinsic = function (callback) {
            var extrinsic = this.loadExtrinsicFromLocal();
            if (callback) {
                callback(extrinsic);
            }
        };
        SaveData.saveExtrinsicToLocal = function (extrinsic) {
            extrinsic = extrinsic || this.extrinsic;
            if (typeof (Storage) !== "undefined") {
                window.localStorage.setItem("Extrinsic", JSON.stringify(extrinsic.data));
            }
            else {
                console.log("NO STORAGE!");
            }
        };
        SaveData.loadExtrinsicFromLocal = function () {
            if (typeof (Storage) !== "undefined") {
                return PlayerData_1.ExtrinsicModel.loadExtrinsic(JSON.parse(window.localStorage.getItem("Extrinsic")));
            }
            else {
                console.log("NO STORAGE!");
            }
        };
        SaveData.loadVersion = function (callback) {
            if (typeof (Storage) !== "undefined") {
                callback(Number(window.localStorage.getItem("Version")));
            }
            else {
                console.log("NO STORAGE!");
                callback(0);
            }
        };
        SaveData.saveVersion = function (version) {
            if (typeof (Storage) !== "undefined") {
                window.localStorage.setItem("Version", String(version));
            }
            else {
                console.log("NO STORAGE!");
            }
        };
        SaveData.VERSION = 6;
        SaveData.confirmReset = function () {
            SaveData.extrinsic = new PlayerData_1.ExtrinsicModel();
        };
        return SaveData;
    }());
    exports.SaveData = SaveData;
});
define("menus/BadgesUI", ["require", "exports", "JMGE/JMBUI", "Config", "GraphicData", "game/data/PlayerData", "JMGE/UI/BaseUI"], function (require, exports, JMBUI, Config_6, GraphicData_5, PlayerData_2, BaseUI_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BadgesUI = (function (_super) {
        __extends(BadgesUI, _super);
        function BadgesUI() {
            var _this = _super.call(this, { width: Config_6.CONFIG.INIT.STAGE_WIDTH, height: Config_6.CONFIG.INIT.STAGE_HEIGHT, bgColor: 0x666666 }) || this;
            _this.leave = function () {
                _this.navBack();
            };
            var _button = new JMBUI.Button({ width: 100, height: 30, x: Config_6.CONFIG.INIT.STAGE_WIDTH - 120, y: Config_6.CONFIG.INIT.STAGE_HEIGHT - 50, label: "Menu", output: _this.leave });
            _this.addChild(_button);
            var scrollCanvas = new PIXI.Container;
            var scroll = new JMBUI.MaskedWindow(scrollCanvas, { x: 20, y: 20, width: 300, height: 300, autoSort: true });
            var scrollbar = new JMBUI.Scrollbar({ height: 300, x: 320, y: 20 });
            scroll.addScrollbar(scrollbar);
            _this.addChild(scroll);
            _this.addChild(scrollbar);
            var badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.NONE);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.BRONZE);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.SILVER);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.GOLD);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.PLATINUM);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.PLATINUM);
            scroll.addObject(badge);
            badge = new BadgeLine("EMPTY", PlayerData_2.BadgeState.PLATINUM);
            scroll.addObject(badge);
            return _this;
        }
        return BadgesUI;
    }(BaseUI_3.BaseUI));
    exports.BadgesUI = BadgesUI;
    var BadgeLine = (function (_super) {
        __extends(BadgeLine, _super);
        function BadgeLine(label, state) {
            if (label === void 0) { label = "Hello World!"; }
            if (state === void 0) { state = PlayerData_2.BadgeState.NONE; }
            var _this = _super.call(this, { width: 100, height: 50, label: label }) || this;
            _this.symbol = new PIXI.Sprite(GraphicData_5.TextureData.medal);
            _this.label.x = 30;
            _this.addChild(_this.symbol);
            _this.setState(state);
            return _this;
        }
        BadgeLine.prototype.setState = function (state) {
            this.symbol.tint = state;
        };
        return BadgeLine;
    }(JMBUI.BasicElement));
});
define("menus/MuterOverlay", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MuterOverlay = (function (_super) {
        __extends(MuterOverlay, _super);
        function MuterOverlay() {
            var _this = _super.call(this) || this;
            _this.beginFill(0x666666);
            _this.lineStyle(2);
            _this.drawRect(0, 0, 100, 50);
            return _this;
        }
        MuterOverlay.prototype.getWidth = function () {
            return 100;
        };
        MuterOverlay.prototype.getHeight = function () {
            return 50;
        };
        return MuterOverlay;
    }(PIXI.Graphics));
    exports.MuterOverlay = MuterOverlay;
});
define("menus/MenuUI", ["require", "exports", "JMGE/JMBUI", "JMGE/UI/BaseUI", "menus/LevelSelectUI", "Config", "menus/BadgesUI", "menus/MuterOverlay"], function (require, exports, JMBUI, BaseUI_4, LevelSelectUI_1, Config_7, BadgesUI_1, MuterOverlay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuUI = (function (_super) {
        __extends(MenuUI, _super);
        function MenuUI() {
            var _this = _super.call(this, { width: Config_7.CONFIG.INIT.STAGE_WIDTH, height: Config_7.CONFIG.INIT.STAGE_HEIGHT, bgColor: 0x666666, label: "Millenium\nTyper", labelStyle: { fontSize: 30, fill: 0x3333ff } }) || this;
            _this.nullFunc = function () { };
            _this.startGame = function () {
                _this.navForward(new LevelSelectUI_1.LevelSelectUI);
            };
            _this.navBadges = function () {
                _this.navForward(new BadgesUI_1.BadgesUI);
            };
            _this.label.x += 50;
            var _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 200, label: "Start", output: _this.startGame });
            _this.addChild(_button);
            _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 240, label: "High Score", output: _this.nullFunc });
            _this.addChild(_button);
            _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 280, label: "View Badges", output: _this.navBadges });
            _this.addChild(_button);
            _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 320, label: "More Games", output: _this.nullFunc });
            _this.addChild(_button);
            _button = new JMBUI.Button({ width: 100, height: 30, x: 200, y: 360, label: "Credits", output: _this.nullFunc });
            _this.addChild(_button);
            var muter = new MuterOverlay_1.MuterOverlay();
            muter.x = _this.getWidth() - muter.getWidth();
            muter.y = _this.getHeight() - muter.getHeight();
            _this.addChild(muter);
            return _this;
        }
        return MenuUI;
    }(BaseUI_4.BaseUI));
    exports.MenuUI = MenuUI;
});
define("index", ["require", "exports", "JMGE/JMBL", "GraphicData", "menus/MenuUI", "Config", "utils/SaveData"], function (require, exports, JMBL, GraphicData_6, MenuUI_1, Config_8, SaveData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new (_a = (function () {
            function Facade() {
                var _this = this;
                this._Resolution = Config_8.CONFIG.INIT.RESOLUTION;
                this.init = function () {
                    initializeDatas();
                    SaveData_1.SaveData.init();
                    _this.currentModule = new MenuUI_1.MenuUI();
                    _this.currentModule.navOut = _this.updateCurrentModule;
                    _this.app.stage.addChild(_this.currentModule);
                };
                this.updateCurrentModule = function (o) {
                    SaveData_1.SaveData.saveExtrinsic(function () {
                        if (_this.currentModule.dispose) {
                            _this.currentModule.dispose();
                        }
                        else if (_this.currentModule.destroy) {
                            _this.currentModule.destroy();
                        }
                        _this.currentModule = o;
                        o.navOut = _this.updateCurrentModule;
                        _this.app.stage.addChild(o);
                    });
                };
                this.saveCallback = function (finish) {
                    SaveData_1.SaveData.saveExtrinsic(finish);
                };
                if (Facade.exists)
                    throw "Cannot instatiate more than one Facade Singleton.";
                Facade.exists = true;
                try {
                    document.createEvent("TouchEvent");
                    JMBL.setInteractionMode("mobile");
                }
                catch (e) {
                }
                this.stageBorders = new JMBL.Rect(0, 0, Config_8.CONFIG.INIT.SCREEN_WIDTH / this._Resolution, Config_8.CONFIG.INIT.SCREEN_HEIGHT / this._Resolution);
                this.app = new PIXI.Application(this.stageBorders.width, this.stageBorders.height, {
                    backgroundColor: 0xff0000,
                    antialias: true,
                    resolution: this._Resolution,
                    roundPixels: true,
                });
                document.getElementById("game-canvas").append(this.app.view);
                this.stageBorders.width *= this._Resolution;
                this.stageBorders.height *= this._Resolution;
                this.app.stage.scale.x = 1 / this._Resolution;
                this.app.stage.scale.y = 1 / this._Resolution;
                this.stageBorders.x = this.app.view.offsetLeft;
                this.stageBorders.y = this.app.view.offsetTop;
                this.app.stage.interactive = true;
                var _background = new PIXI.Graphics();
                _background.beginFill(Config_8.CONFIG.INIT.BACKGROUND_COLOR);
                _background.drawRect(0, 0, this.stageBorders.width, this.stageBorders.height);
                this.app.stage.addChild(_background);
                JMBL.init(this.app);
                GraphicData_6.TextureData.init(this.app.renderer);
                window.setTimeout(this.init, 10);
            }
            return Facade;
        }()),
        _a.exists = false,
        _a);
    function initializeDatas() {
    }
    var _a;
});
