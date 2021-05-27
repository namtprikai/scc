/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
	var type = typeof value
	return value != null && (type == 'object' || type == 'function')
}

var isObject_1 = isObject

var commonjsGlobal =
	typeof window !== 'undefined'
		? window
		: typeof global !== 'undefined'
		? global
		: typeof self !== 'undefined'
		? self
		: {}

function unwrapExports(x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
		? x.default
		: x
}

function createCommonjsModule(fn, module) {
	return (module = { exports: {} }), fn(module, module.exports), module.exports
}

/** Detect free variable `global` from Node.js. */
var freeGlobal =
	typeof commonjsGlobal == 'object' &&
	commonjsGlobal &&
	commonjsGlobal.Object === Object &&
	commonjsGlobal

var _freeGlobal = freeGlobal

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')()

var _root = root

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function () {
	return _root.Date.now()
}

var now_1 = now

/** Built-in value references. */
var Symbol$1 = _root.Symbol

var _Symbol = Symbol$1

/** Used for built-in method references. */
var objectProto = Object.prototype

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
	var isOwn = hasOwnProperty.call(value, symToStringTag),
		tag = value[symToStringTag]

	try {
		value[symToStringTag] = undefined
	} catch (e) {}

	var result = nativeObjectToString.call(value)
	{
		if (isOwn) {
			value[symToStringTag] = tag
		} else {
			delete value[symToStringTag]
		}
	}
	return result
}

var _getRawTag = getRawTag

/** Used for built-in method references. */
var objectProto$1 = Object.prototype

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
	return nativeObjectToString$1.call(value)
}

var _objectToString = objectToString

/** `Object#toString` result references. */
var nullTag = '[object Null]',
	undefinedTag = '[object Undefined]'

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
	if (value == null) {
		return value === undefined ? undefinedTag : nullTag
	}
	return symToStringTag$1 && symToStringTag$1 in Object(value)
		? _getRawTag(value)
		: _objectToString(value)
}

var _baseGetTag = baseGetTag

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
	return value != null && typeof value == 'object'
}

var isObjectLike_1 = isObjectLike

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]'

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
	return (
		typeof value == 'symbol' ||
		(isObjectLike_1(value) && _baseGetTag(value) == symbolTag)
	)
}

var isSymbol_1 = isSymbol

/** Used as references for various `Number` constants. */
var NAN = 0 / 0

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
	if (typeof value == 'number') {
		return value
	}
	if (isSymbol_1(value)) {
		return NAN
	}
	if (isObject_1(value)) {
		var other = typeof value.valueOf == 'function' ? value.valueOf() : value
		value = isObject_1(other) ? other + '' : other
	}
	if (typeof value != 'string') {
		return value === 0 ? value : +value
	}
	value = value.replace(reTrim, '')
	var isBinary = reIsBinary.test(value)
	return isBinary || reIsOctal.test(value)
		? freeParseInt(value.slice(2), isBinary ? 2 : 8)
		: reIsBadHex.test(value)
		? NAN
		: +value
}

var toNumber_1 = toNumber

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function'

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
	nativeMin = Math.min

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
	var lastArgs,
		lastThis,
		maxWait,
		result,
		timerId,
		lastCallTime,
		lastInvokeTime = 0,
		leading = false,
		maxing = false,
		trailing = true

	if (typeof func != 'function') {
		throw new TypeError(FUNC_ERROR_TEXT)
	}
	wait = toNumber_1(wait) || 0
	if (isObject_1(options)) {
		leading = !!options.leading
		maxing = 'maxWait' in options
		maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait
		trailing = 'trailing' in options ? !!options.trailing : trailing
	}

	function invokeFunc(time) {
		var args = lastArgs,
			thisArg = lastThis

		lastArgs = lastThis = undefined
		lastInvokeTime = time
		result = func.apply(thisArg, args)
		return result
	}

	function leadingEdge(time) {
		// Reset any `maxWait` timer.
		lastInvokeTime = time
		// Start the timer for the trailing edge.
		timerId = setTimeout(timerExpired, wait)
		// Invoke the leading edge.
		return leading ? invokeFunc(time) : result
	}

	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime,
			timeWaiting = wait - timeSinceLastCall

		return maxing
			? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
			: timeWaiting
	}

	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime,
			timeSinceLastInvoke = time - lastInvokeTime

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= maxWait)
		)
	}

	function timerExpired() {
		var time = now_1()
		if (shouldInvoke(time)) {
			return trailingEdge(time)
		}
		// Restart the timer.
		timerId = setTimeout(timerExpired, remainingWait(time))
	}

	function trailingEdge(time) {
		timerId = undefined

		// Only invoke if we have `lastArgs` which means `func` has been
		// debounced at least once.
		if (trailing && lastArgs) {
			return invokeFunc(time)
		}
		lastArgs = lastThis = undefined
		return result
	}

	function cancel() {
		if (timerId !== undefined) {
			clearTimeout(timerId)
		}
		lastInvokeTime = 0
		lastArgs = lastCallTime = lastThis = timerId = undefined
	}

	function flush() {
		return timerId === undefined ? result : trailingEdge(now_1())
	}

	function debounced() {
		var time = now_1(),
			isInvoking = shouldInvoke(time)

		lastArgs = arguments
		lastThis = this
		lastCallTime = time

		if (isInvoking) {
			if (timerId === undefined) {
				return leadingEdge(lastCallTime)
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				timerId = setTimeout(timerExpired, wait)
				return invokeFunc(lastCallTime)
			}
		}
		if (timerId === undefined) {
			timerId = setTimeout(timerExpired, wait)
		}
		return result
	}
	debounced.cancel = cancel
	debounced.flush = flush
	return debounced
}

var debounce_1 = debounce

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function'

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
	var leading = true,
		trailing = true

	if (typeof func != 'function') {
		throw new TypeError(FUNC_ERROR_TEXT$1)
	}
	if (isObject_1(options)) {
		leading = 'leading' in options ? !!options.leading : leading
		trailing = 'trailing' in options ? !!options.trailing : trailing
	}
	return debounce_1(func, wait, {
		leading: leading,
		maxWait: wait,
		trailing: trailing,
	})
}

var throttle_1 = throttle

var utils = createCommonjsModule(function (module, exports) {
	;(function (global, factory) {
		{
			factory(exports)
		}
	})(commonjsGlobal, function (exports) {
		Object.defineProperty(exports, '__esModule', {
			value: true,
		})

		var _extends =
			Object.assign ||
			function (target) {
				var arguments$1 = arguments

				for (var i = 1; i < arguments.length; i++) {
					var source = arguments$1[i]

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key]
						}
					}
				}

				return target
			}

		var _typeof =
			typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
				? function (obj) {
						return typeof obj
				  }
				: function (obj) {
						return obj &&
							typeof Symbol === 'function' &&
							obj.constructor === Symbol &&
							obj !== Symbol.prototype
							? 'symbol'
							: typeof obj
				  }

		var isDate = (exports.isDate = function isDate(d) {
			return d instanceof Date
		})
		var isEmpty = (exports.isEmpty = function isEmpty(o) {
			return Object.keys(o).length === 0
		})
		var isObject = (exports.isObject = function isObject(o) {
			return (
				o != null &&
				(typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object'
			)
		})
		var properObject = (exports.properObject = function properObject(o) {
			return isObject(o) && !o.hasOwnProperty ? _extends({}, o) : o
		})
	})
})

unwrapExports(utils)

var diff = createCommonjsModule(function (module, exports) {
	;(function (global, factory) {
		{
			factory(module, exports, utils)
		}
	})(commonjsGlobal, function (module, exports, _utils) {
		Object.defineProperty(exports, '__esModule', {
			value: true,
		})

		function _defineProperty(obj, key, value) {
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				})
			} else {
				obj[key] = value
			}

			return obj
		}

		var _extends =
			Object.assign ||
			function (target) {
				var arguments$1 = arguments

				for (var i = 1; i < arguments.length; i++) {
					var source = arguments$1[i]

					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key]
						}
					}
				}

				return target
			}

		var diff = function diff(lhs, rhs) {
			if (lhs === rhs) {
				return {}
			} // equal return no diff

			if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) {
				return rhs
			} // return updated rhs

			var l = (0, _utils.properObject)(lhs)
			var r = (0, _utils.properObject)(rhs)

			var deletedValues = Object.keys(l).reduce(function (acc, key) {
				return r.hasOwnProperty(key)
					? acc
					: _extends({}, acc, _defineProperty({}, key, undefined))
			}, {})

			if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
				if (l.valueOf() == r.valueOf()) {
					return {}
				}
				return r
			}

			return Object.keys(r).reduce(function (acc, key) {
				if (!l.hasOwnProperty(key)) {
					return _extends({}, acc, _defineProperty({}, key, r[key]))
				} // return added r key

				var difference = diff(l[key], r[key])

				if (
					(0, _utils.isObject)(difference) &&
					(0, _utils.isEmpty)(difference) &&
					!(0, _utils.isDate)(difference)
				) {
					return acc
				} // return no diff

				return _extends({}, acc, _defineProperty({}, key, difference)) // return updated key
			}, deletedValues)
		}

		exports.default = diff
		module.exports = exports['default']
	})
})

var diff$1 = unwrapExports(diff)

var getBrowser = function () {
	var ua = navigator.userAgent.toLowerCase()

	if (ua.indexOf('chrome') > -1) {
		return 'google-chrome'
	}

	if (ua.indexOf('safari') > -1) {
		return 'safari'
	}

	return 'general'
}

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
	if (typeof Map !== 'undefined') {
		return Map
	}
	/**
	 * Returns index in provided array that matches the specified key.
	 *
	 * @param {Array<Array>} arr
	 * @param {*} key
	 * @returns {number}
	 */
	function getIndex(arr, key) {
		var result = -1
		arr.some(function (entry, index) {
			if (entry[0] === key) {
				result = index
				return true
			}
			return false
		})
		return result
	}
	return /** @class */ (function () {
		function class_1() {
			this.__entries__ = []
		}
		Object.defineProperty(class_1.prototype, 'size', {
			/**
			 * @returns {boolean}
			 */
			get: function () {
				return this.__entries__.length
			},
			enumerable: true,
			configurable: true,
		})
		/**
		 * @param {*} key
		 * @returns {*}
		 */
		class_1.prototype.get = function (key) {
			var index = getIndex(this.__entries__, key)
			var entry = this.__entries__[index]
			return entry && entry[1]
		}
		/**
		 * @param {*} key
		 * @param {*} value
		 * @returns {void}
		 */
		class_1.prototype.set = function (key, value) {
			var index = getIndex(this.__entries__, key)
			if (~index) {
				this.__entries__[index][1] = value
			} else {
				this.__entries__.push([key, value])
			}
		}
		/**
		 * @param {*} key
		 * @returns {void}
		 */
		class_1.prototype.delete = function (key) {
			var entries = this.__entries__
			var index = getIndex(entries, key)
			if (~index) {
				entries.splice(index, 1)
			}
		}
		/**
		 * @param {*} key
		 * @returns {void}
		 */
		class_1.prototype.has = function (key) {
			return !!~getIndex(this.__entries__, key)
		}
		/**
		 * @returns {void}
		 */
		class_1.prototype.clear = function () {
			this.__entries__.splice(0)
		}
		/**
		 * @param {Function} callback
		 * @param {*} [ctx=null]
		 * @returns {void}
		 */
		class_1.prototype.forEach = function (callback, ctx) {
			if (ctx === void 0) {
				ctx = null
			}
			for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
				var entry = _a[_i]
				callback.call(ctx, entry[1], entry[0])
			}
		}
		return class_1
	})()
})()

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser =
	typeof window !== 'undefined' &&
	typeof document !== 'undefined' &&
	window.document === document

// Returns global object of a current environment.
var global$1 = (function () {
	if (typeof global !== 'undefined' && global.Math === Math) {
		return global
	}
	if (typeof self !== 'undefined' && self.Math === Math) {
		return self
	}
	if (typeof window !== 'undefined' && window.Math === Math) {
		return window
	}
	// eslint-disable-next-line no-new-func
	return Function('return this')()
})()

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
	if (typeof requestAnimationFrame === 'function') {
		// It's required to use a bounded function because IE sometimes throws
		// an "Invalid calling object" error if rAF is invoked without the global
		// object on the left hand side.
		return requestAnimationFrame.bind(global$1)
	}
	return function (callback) {
		return setTimeout(function () {
			return callback(Date.now())
		}, 1000 / 60)
	}
})()

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle$1(callback, delay) {
	var leadingCall = false,
		trailingCall = false,
		lastCallTime = 0
	/**
	 * Invokes the original callback function and schedules new invocation if
	 * the "proxy" was called during current request.
	 *
	 * @returns {void}
	 */
	function resolvePending() {
		if (leadingCall) {
			leadingCall = false
			callback()
		}
		if (trailingCall) {
			proxy()
		}
	}
	/**
	 * Callback invoked after the specified delay. It will further postpone
	 * invocation of the original function delegating it to the
	 * requestAnimationFrame.
	 *
	 * @returns {void}
	 */
	function timeoutCallback() {
		requestAnimationFrame$1(resolvePending)
	}
	/**
	 * Schedules invocation of the original function.
	 *
	 * @returns {void}
	 */
	function proxy() {
		var timeStamp = Date.now()
		if (leadingCall) {
			// Reject immediately following calls.
			if (timeStamp - lastCallTime < trailingTimeout) {
				return
			}
			// Schedule new call to be in invoked when the pending one is resolved.
			// This is important for "transitions" which never actually start
			// immediately so there is a chance that we might miss one if change
			// happens amids the pending invocation.
			trailingCall = true
		} else {
			leadingCall = true
			trailingCall = false
			setTimeout(timeoutCallback, delay)
		}
		lastCallTime = timeStamp
	}
	return proxy
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = [
	'top',
	'right',
	'bottom',
	'left',
	'width',
	'height',
	'size',
	'weight',
]
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined'
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
	/**
	 * Creates a new instance of ResizeObserverController.
	 *
	 * @private
	 */
	function ResizeObserverController() {
		/**
		 * Indicates whether DOM listeners have been added.
		 *
		 * @private {boolean}
		 */
		this.connected_ = false
		/**
		 * Tells that controller has subscribed for Mutation Events.
		 *
		 * @private {boolean}
		 */
		this.mutationEventsAdded_ = false
		/**
		 * Keeps reference to the instance of MutationObserver.
		 *
		 * @private {MutationObserver}
		 */
		this.mutationsObserver_ = null
		/**
		 * A list of connected observers.
		 *
		 * @private {Array<ResizeObserverSPI>}
		 */
		this.observers_ = []
		this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)
		this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY)
	}
	/**
	 * Adds observer to observers list.
	 *
	 * @param {ResizeObserverSPI} observer - Observer to be added.
	 * @returns {void}
	 */
	ResizeObserverController.prototype.addObserver = function (observer) {
		if (!~this.observers_.indexOf(observer)) {
			this.observers_.push(observer)
		}
		// Add listeners if they haven't been added yet.
		if (!this.connected_) {
			this.connect_()
		}
	}
	/**
	 * Removes observer from observers list.
	 *
	 * @param {ResizeObserverSPI} observer - Observer to be removed.
	 * @returns {void}
	 */
	ResizeObserverController.prototype.removeObserver = function (observer) {
		var observers = this.observers_
		var index = observers.indexOf(observer)
		// Remove observer if it's present in registry.
		if (~index) {
			observers.splice(index, 1)
		}
		// Remove listeners if controller has no connected observers.
		if (!observers.length && this.connected_) {
			this.disconnect_()
		}
	}
	/**
	 * Invokes the update of observers. It will continue running updates insofar
	 * it detects changes.
	 *
	 * @returns {void}
	 */
	ResizeObserverController.prototype.refresh = function () {
		var changesDetected = this.updateObservers_()
		// Continue running updates if changes have been detected as there might
		// be future ones caused by CSS transitions.
		if (changesDetected) {
			this.refresh()
		}
	}
	/**
	 * Updates every observer from observers list and notifies them of queued
	 * entries.
	 *
	 * @private
	 * @returns {boolean} Returns "true" if any observer has detected changes in
	 *      dimensions of it's elements.
	 */
	ResizeObserverController.prototype.updateObservers_ = function () {
		// Collect observers that have active observations.
		var activeObservers = this.observers_.filter(function (observer) {
			return observer.gatherActive(), observer.hasActive()
		})
		// Deliver notifications in a separate cycle in order to avoid any
		// collisions between observers, e.g. when multiple instances of
		// ResizeObserver are tracking the same element and the callback of one
		// of them changes content dimensions of the observed target. Sometimes
		// this may result in notifications being blocked for the rest of observers.
		activeObservers.forEach(function (observer) {
			return observer.broadcastActive()
		})
		return activeObservers.length > 0
	}
	/**
	 * Initializes DOM listeners.
	 *
	 * @private
	 * @returns {void}
	 */
	ResizeObserverController.prototype.connect_ = function () {
		// Do nothing if running in a non-browser environment or if listeners
		// have been already added.
		if (!isBrowser || this.connected_) {
			return
		}
		// Subscription to the "Transitionend" event is used as a workaround for
		// delayed transitions. This way it's possible to capture at least the
		// final state of an element.
		document.addEventListener('transitionend', this.onTransitionEnd_)
		window.addEventListener('resize', this.refresh)
		if (mutationObserverSupported) {
			this.mutationsObserver_ = new MutationObserver(this.refresh)
			this.mutationsObserver_.observe(document, {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true,
			})
		} else {
			document.addEventListener('DOMSubtreeModified', this.refresh)
			this.mutationEventsAdded_ = true
		}
		this.connected_ = true
	}
	/**
	 * Removes DOM listeners.
	 *
	 * @private
	 * @returns {void}
	 */
	ResizeObserverController.prototype.disconnect_ = function () {
		// Do nothing if running in a non-browser environment or if listeners
		// have been already removed.
		if (!isBrowser || !this.connected_) {
			return
		}
		document.removeEventListener('transitionend', this.onTransitionEnd_)
		window.removeEventListener('resize', this.refresh)
		if (this.mutationsObserver_) {
			this.mutationsObserver_.disconnect()
		}
		if (this.mutationEventsAdded_) {
			document.removeEventListener('DOMSubtreeModified', this.refresh)
		}
		this.mutationsObserver_ = null
		this.mutationEventsAdded_ = false
		this.connected_ = false
	}
	/**
	 * "Transitionend" event handler.
	 *
	 * @private
	 * @param {TransitionEvent} event
	 * @returns {void}
	 */
	ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
		var _b = _a.propertyName,
			propertyName = _b === void 0 ? '' : _b
		// Detect whether transition may affect dimensions of an element.
		var isReflowProperty = transitionKeys.some(function (key) {
			return !!~propertyName.indexOf(key)
		})
		if (isReflowProperty) {
			this.refresh()
		}
	}
	/**
	 * Returns instance of the ResizeObserverController.
	 *
	 * @returns {ResizeObserverController}
	 */
	ResizeObserverController.getInstance = function () {
		if (!this.instance_) {
			this.instance_ = new ResizeObserverController()
		}
		return this.instance_
	}
	/**
	 * Holds reference to the controller's instance.
	 *
	 * @private {ResizeObserverController}
	 */
	ResizeObserverController.instance_ = null
	return ResizeObserverController
})()

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = function (target, props) {
	for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
		var key = _a[_i]
		Object.defineProperty(target, key, {
			value: props[key],
			enumerable: false,
			writable: false,
			configurable: true,
		})
	}
	return target
}

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = function (target) {
	// Assume that the element is an instance of Node, which means that it
	// has the "ownerDocument" property from which we can retrieve a
	// corresponding global object.
	var ownerGlobal =
		target && target.ownerDocument && target.ownerDocument.defaultView
	// Return the local global object if it's not possible extract one from
	// provided element.
	return ownerGlobal || global$1
}

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0)
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
	return parseFloat(value) || 0
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
	var arguments$1 = arguments

	var positions = []
	for (var _i = 1; _i < arguments.length; _i++) {
		positions[_i - 1] = arguments$1[_i]
	}
	return positions.reduce(function (size, position) {
		var value = styles['border-' + position + '-width']
		return size + toFloat(value)
	}, 0)
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
	var positions = ['top', 'right', 'bottom', 'left']
	var paddings = {}
	for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
		var position = positions_1[_i]
		var value = styles['padding-' + position]
		paddings[position] = toFloat(value)
	}
	return paddings
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
	var bbox = target.getBBox()
	return createRectInit(0, 0, bbox.width, bbox.height)
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
	// Client width & height properties can't be
	// used exclusively as they provide rounded values.
	var clientWidth = target.clientWidth,
		clientHeight = target.clientHeight
	// By this condition we can catch all non-replaced inline, hidden and
	// detached elements. Though elements with width & height properties less
	// than 0.5 will be discarded as well.
	//
	// Without it we would need to implement separate methods for each of
	// those cases and it's not possible to perform a precise and performance
	// effective test for hidden elements. E.g. even jQuery's ':visible' filter
	// gives wrong results for elements with width & height less than 0.5.
	if (!clientWidth && !clientHeight) {
		return emptyRect
	}
	var styles = getWindowOf(target).getComputedStyle(target)
	var paddings = getPaddings(styles)
	var horizPad = paddings.left + paddings.right
	var vertPad = paddings.top + paddings.bottom
	// Computed styles of width & height are being used because they are the
	// only dimensions available to JS that contain non-rounded values. It could
	// be possible to utilize the getBoundingClientRect if only it's data wasn't
	// affected by CSS transformations let alone paddings, borders and scroll bars.
	var width = toFloat(styles.width),
		height = toFloat(styles.height)
	// Width & height include paddings and borders when the 'border-box' box
	// model is applied (except for IE).
	if (styles.boxSizing === 'border-box') {
		// Following conditions are required to handle Internet Explorer which
		// doesn't include paddings and borders to computed CSS dimensions.
		//
		// We can say that if CSS dimensions + paddings are equal to the "client"
		// properties then it's either IE, and thus we don't need to subtract
		// anything, or an element merely doesn't have paddings/borders styles.
		if (Math.round(width + horizPad) !== clientWidth) {
			width -= getBordersSize(styles, 'left', 'right') + horizPad
		}
		if (Math.round(height + vertPad) !== clientHeight) {
			height -= getBordersSize(styles, 'top', 'bottom') + vertPad
		}
	}
	// Following steps can't be applied to the document's root element as its
	// client[Width/Height] properties represent viewport area of the window.
	// Besides, it's as well not necessary as the <html> itself neither has
	// rendered scroll bars nor it can be clipped.
	if (!isDocumentElement(target)) {
		// In some browsers (only in Firefox, actually) CSS width & height
		// include scroll bars size which can be removed at this step as scroll
		// bars are the only difference between rounded dimensions + paddings
		// and "client" properties, though that is not always true in Chrome.
		var vertScrollbar = Math.round(width + horizPad) - clientWidth
		var horizScrollbar = Math.round(height + vertPad) - clientHeight
		// Chrome has a rather weird rounding of "client" properties.
		// E.g. for an element with content width of 314.2px it sometimes gives
		// the client width of 315px and for the width of 314.7px it may give
		// 314px. And it doesn't happen all the time. So just ignore this delta
		// as a non-relevant.
		if (Math.abs(vertScrollbar) !== 1) {
			width -= vertScrollbar
		}
		if (Math.abs(horizScrollbar) !== 1) {
			height -= horizScrollbar
		}
	}
	return createRectInit(paddings.left, paddings.top, width, height)
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
	// Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
	// interface.
	if (typeof SVGGraphicsElement !== 'undefined') {
		return function (target) {
			return target instanceof getWindowOf(target).SVGGraphicsElement
		}
	}
	// If it's so, then check that element is at least an instance of the
	// SVGElement and that it has the "getBBox" method.
	// eslint-disable-next-line no-extra-parens
	return function (target) {
		return (
			target instanceof getWindowOf(target).SVGElement &&
			typeof target.getBBox === 'function'
		)
	}
})()
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
	return target === getWindowOf(target).document.documentElement
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
	if (!isBrowser) {
		return emptyRect
	}
	if (isSVGGraphicsElement(target)) {
		return getSVGContentRect(target)
	}
	return getHTMLElementContentRect(target)
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
	var x = _a.x,
		y = _a.y,
		width = _a.width,
		height = _a.height
	// If DOMRectReadOnly is available use it as a prototype for the rectangle.
	var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object
	var rect = Object.create(Constr.prototype)
	// Rectangle's properties are not writable and non-enumerable.
	defineConfigurable(rect, {
		x: x,
		y: y,
		width: width,
		height: height,
		top: y,
		right: x + width,
		bottom: height + y,
		left: x,
	})
	return rect
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
	return { x: x, y: y, width: width, height: height }
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
	/**
	 * Creates an instance of ResizeObservation.
	 *
	 * @param {Element} target - Element to be observed.
	 */
	function ResizeObservation(target) {
		/**
		 * Broadcasted width of content rectangle.
		 *
		 * @type {number}
		 */
		this.broadcastWidth = 0
		/**
		 * Broadcasted height of content rectangle.
		 *
		 * @type {number}
		 */
		this.broadcastHeight = 0
		/**
		 * Reference to the last observed content rectangle.
		 *
		 * @private {DOMRectInit}
		 */
		this.contentRect_ = createRectInit(0, 0, 0, 0)
		this.target = target
	}
	/**
	 * Updates content rectangle and tells whether it's width or height properties
	 * have changed since the last broadcast.
	 *
	 * @returns {boolean}
	 */
	ResizeObservation.prototype.isActive = function () {
		var rect = getContentRect(this.target)
		this.contentRect_ = rect
		return (
			rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight
		)
	}
	/**
	 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
	 * from the corresponding properties of the last observed content rectangle.
	 *
	 * @returns {DOMRectInit} Last observed content rectangle.
	 */
	ResizeObservation.prototype.broadcastRect = function () {
		var rect = this.contentRect_
		this.broadcastWidth = rect.width
		this.broadcastHeight = rect.height
		return rect
	}
	return ResizeObservation
})()

var ResizeObserverEntry = /** @class */ (function () {
	/**
	 * Creates an instance of ResizeObserverEntry.
	 *
	 * @param {Element} target - Element that is being observed.
	 * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
	 */
	function ResizeObserverEntry(target, rectInit) {
		var contentRect = createReadOnlyRect(rectInit)
		// According to the specification following properties are not writable
		// and are also not enumerable in the native implementation.
		//
		// Property accessors are not being used as they'd require to define a
		// private WeakMap storage which may cause memory leaks in browsers that
		// don't support this type of collections.
		defineConfigurable(this, { target: target, contentRect: contentRect })
	}
	return ResizeObserverEntry
})()

var ResizeObserverSPI = /** @class */ (function () {
	/**
	 * Creates a new instance of ResizeObserver.
	 *
	 * @param {ResizeObserverCallback} callback - Callback function that is invoked
	 *      when one of the observed elements changes it's content dimensions.
	 * @param {ResizeObserverController} controller - Controller instance which
	 *      is responsible for the updates of observer.
	 * @param {ResizeObserver} callbackCtx - Reference to the public
	 *      ResizeObserver instance which will be passed to callback function.
	 */
	function ResizeObserverSPI(callback, controller, callbackCtx) {
		/**
		 * Collection of resize observations that have detected changes in dimensions
		 * of elements.
		 *
		 * @private {Array<ResizeObservation>}
		 */
		this.activeObservations_ = []
		/**
		 * Registry of the ResizeObservation instances.
		 *
		 * @private {Map<Element, ResizeObservation>}
		 */
		this.observations_ = new MapShim()
		if (typeof callback !== 'function') {
			throw new TypeError(
				'The callback provided as parameter 1 is not a function.',
			)
		}
		this.callback_ = callback
		this.controller_ = controller
		this.callbackCtx_ = callbackCtx
	}
	/**
	 * Starts observing provided element.
	 *
	 * @param {Element} target - Element to be observed.
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.observe = function (target) {
		if (!arguments.length) {
			throw new TypeError('1 argument required, but only 0 present.')
		}
		// Do nothing if current environment doesn't have the Element interface.
		if (typeof Element === 'undefined' || !(Element instanceof Object)) {
			return
		}
		if (!(target instanceof getWindowOf(target).Element)) {
			throw new TypeError('parameter 1 is not of type "Element".')
		}
		var observations = this.observations_
		// Do nothing if element is already being observed.
		if (observations.has(target)) {
			return
		}
		observations.set(target, new ResizeObservation(target))
		this.controller_.addObserver(this)
		// Force the update of observations.
		this.controller_.refresh()
	}
	/**
	 * Stops observing provided element.
	 *
	 * @param {Element} target - Element to stop observing.
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.unobserve = function (target) {
		if (!arguments.length) {
			throw new TypeError('1 argument required, but only 0 present.')
		}
		// Do nothing if current environment doesn't have the Element interface.
		if (typeof Element === 'undefined' || !(Element instanceof Object)) {
			return
		}
		if (!(target instanceof getWindowOf(target).Element)) {
			throw new TypeError('parameter 1 is not of type "Element".')
		}
		var observations = this.observations_
		// Do nothing if element is not being observed.
		if (!observations.has(target)) {
			return
		}
		observations.delete(target)
		if (!observations.size) {
			this.controller_.removeObserver(this)
		}
	}
	/**
	 * Stops observing all elements.
	 *
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.disconnect = function () {
		this.clearActive()
		this.observations_.clear()
		this.controller_.removeObserver(this)
	}
	/**
	 * Collects observation instances the associated element of which has changed
	 * it's content rectangle.
	 *
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.gatherActive = function () {
		var _this = this
		this.clearActive()
		this.observations_.forEach(function (observation) {
			if (observation.isActive()) {
				_this.activeObservations_.push(observation)
			}
		})
	}
	/**
	 * Invokes initial callback function with a list of ResizeObserverEntry
	 * instances collected from active resize observations.
	 *
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.broadcastActive = function () {
		// Do nothing if observer doesn't have active observations.
		if (!this.hasActive()) {
			return
		}
		var ctx = this.callbackCtx_
		// Create ResizeObserverEntry instance for every active observation.
		var entries = this.activeObservations_.map(function (observation) {
			return new ResizeObserverEntry(
				observation.target,
				observation.broadcastRect(),
			)
		})
		this.callback_.call(ctx, entries, ctx)
		this.clearActive()
	}
	/**
	 * Clears the collection of active observations.
	 *
	 * @returns {void}
	 */
	ResizeObserverSPI.prototype.clearActive = function () {
		this.activeObservations_.splice(0)
	}
	/**
	 * Tells whether observer has active observations.
	 *
	 * @returns {boolean}
	 */
	ResizeObserverSPI.prototype.hasActive = function () {
		return this.activeObservations_.length > 0
	}
	return ResizeObserverSPI
})()

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim()
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
	/**
	 * Creates a new instance of ResizeObserver.
	 *
	 * @param {ResizeObserverCallback} callback - Callback that is invoked when
	 *      dimensions of the observed elements change.
	 */
	function ResizeObserver(callback) {
		if (!(this instanceof ResizeObserver)) {
			throw new TypeError('Cannot call a class as a function.')
		}
		if (!arguments.length) {
			throw new TypeError('1 argument required, but only 0 present.')
		}
		var controller = ResizeObserverController.getInstance()
		var observer = new ResizeObserverSPI(callback, controller, this)
		observers.set(this, observer)
	}
	return ResizeObserver
})()
// Expose public methods of ResizeObserver.
;['observe', 'unobserve', 'disconnect'].forEach(function (method) {
	ResizeObserver.prototype[method] = function () {
		var _a
		return (_a = observers.get(this))[method].apply(_a, arguments)
	}
})

var index$1 = (function () {
	// Export existing implementation if available.
	if (typeof global$1.ResizeObserver !== 'undefined') {
		return global$1.ResizeObserver
	}
	return ResizeObserver
})()

//

var script = {
	data: function data() {
		return {
			dimension: null,
		}
	},
	props: {
		id: {
			type: String,
		},
		index: {
			type: Number,
			required: true,
		},
		maxIndex: {
			type: Number,
			required: true,
		},
		disableResizer: {
			type: Boolean,
			default: false,
		},
	},
	mounted: function mounted() {
		var this$1 = this

		this.$parent.$on('dimensions', function (d) {
			this$1.dimension = d[this$1.id] ? d[this$1.id] : null
		})

		if (!this.disableResizer) {
			this.ro = new index$1(function (elements) {
				elements.forEach(function (el, i) {
					if (this$1 && this$1.id) {
						var payload = {
							id: this$1.id,
							dimensions: {
								w: el.target.offsetWidth,
								h: el.target.offsetHeight,
							},
						}
						this$1.$parent.$emit('resize-item', payload)
					}
				})
			})

			this.ro.observe(this.$el)
		}
	},
	computed: {
		styles: function styles() {
			if (!this.dimension || !this.id) {
				return 'transform: translate3d(0, -9999999999999px, 0);'
			}
			var top = !this.$parent.reversed
				? this.dimension.top
				: this.dimension.top * -1
			var position = !this.$parent.reversed ? 'top: 0;' : 'bottom: 0;'
			return 'transform: translate3d(0, ' + top + 'px, 0); ' + position
		},
	},
}

/* script */
var __vue_script__ = script

/* template */
var __vue_render__ = function () {
	var _vm = this
	var _h = _vm.$createElement
	var _c = _vm._self._c || _h
	return _c(
		'div',
		{
			ref: 'item',
			staticClass: 'VirtualStream__Item',
			style: _vm.styles,
			attrs: { 'data-id': 'id' },
		},
		[_vm._t('default')],
		2,
	)
}
var __vue_staticRenderFns__ = []
__vue_render__._withStripped = true

/* style */
var __vue_inject_styles__ = function (inject) {
	if (!inject) {
		return
	}
	inject('data-v-92721bce_0', {
		source:
			'\n.VirtualStream__Item[data-v-92721bce] {\n    position: absolute;\n    left: 0;\n    right: 0;\n}\n',
		map: {
			version: 3,
			sources: [
				'/Users/andhy/Downloads/vue-virtual-stream-master/src/components/Item.vue',
			],
			names: [],
			mappings: ';AAoEA;IACA,mBAAA;IACA,QAAA;IACA,SAAA;CACA',
			file: 'Item.vue',
			sourcesContent: [
				'<template>\n    <div class="VirtualStream__Item" ref="item" :style="styles" data-id="id">\n        <slot />\n    </div>\n</template>\n\n<script>\nimport ResizeObserver from \'resize-observer-polyfill\'\n\nexport default {\n    data() {\n        return {\n            dimension: null,\n        }\n    },\n    props: {\n        id: {\n            type: String,\n        },\n        index: {\n            type: Number,\n            required: true,\n        },\n        maxIndex: {\n            type: Number,\n            required: true,\n        },\n        disableResizer: {\n            type: Boolean,\n            default: false,\n        }\n    },\n    mounted() {\n        this.$parent.$on(\'dimensions\', (d) => {\n            this.dimension = (d[this.id]) ? d[this.id] : null\n        })\n\n        if (!this.disableResizer) {\n            this.ro = new ResizeObserver(elements => {\n                elements.forEach((el, i) => {\n                    if (this && this.id) {\n                        const payload = {\n                            id: this.id,\n                            dimensions: {\n                                w: el.target.offsetWidth,\n                                h: el.target.offsetHeight,\n                            }\n                        }\n                        this.$parent.$emit(\'resize-item\', payload)\n                    }\n                })\n            })\n\n            this.ro.observe(this.$el)\n        }\n    },\n    computed: {\n        styles() {\n            if (!this.dimension || !this.id) return \'transform: translate3d(0, -9999999999999px, 0);\'\n            const top = (!this.$parent.reversed) ? this.dimension.top : this.dimension.top * -1\n            const position = (!this.$parent.reversed) ? `top: 0;` : `bottom: 0;`\n            return `transform: translate3d(0, ${top}px, 0); ${position}`\n        }\n    }\n}\n</script>\n\n<style scoped>\n    .VirtualStream__Item {\n        position: absolute;\n        left: 0;\n        right: 0;\n    }\n</style>\n',
			],
		},
		media: undefined,
	})
}
/* scoped */
var __vue_scope_id__ = 'data-v-92721bce'
/* module identifier */
var __vue_module_identifier__ = undefined
/* functional template */
var __vue_is_functional_template__ = false
/* component normalizer */
function __vue_normalize__(
	template,
	style,
	script$$1,
	scope,
	functional,
	moduleIdentifier,
	createInjector,
	createInjectorSSR,
) {
	var component =
		(typeof script$$1 === 'function' ? script$$1.options : script$$1) || {}

	// For security concerns, we use only base name in production mode.
	component.__file =
		'/Users/andhy/Downloads/vue-virtual-stream-master/src/components/Item.vue'

	if (!component.render) {
		component.render = template.render
		component.staticRenderFns = template.staticRenderFns
		component._compiled = true

		if (functional) {
			component.functional = true
		}
	}

	component._scopeId = scope

	{
		var hook
		if (style) {
			hook = function (context) {
				style.call(this, createInjector(context))
			}
		}

		if (hook !== undefined) {
			if (component.functional) {
				// register for functional component in vue file
				var originalRender = component.render
				component.render = function renderWithStyleInjection(h, context) {
					hook.call(context)
					return originalRender(h, context)
				}
			} else {
				// inject component registration as beforeCreate hook
				var existing = component.beforeCreate
				component.beforeCreate = existing ? [].concat(existing, hook) : [hook]
			}
		}
	}

	return component
}
/* style inject */
function __vue_create_injector__() {
	var head = document.head || document.getElementsByTagName('head')[0]
	var styles =
		__vue_create_injector__.styles || (__vue_create_injector__.styles = {})
	var isOldIE =
		typeof navigator !== 'undefined' &&
		/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase())

	return function addStyle(id, css) {
		if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) {
			return
		} // SSR styles are present.

		var group = isOldIE ? css.media || 'default' : id
		var style =
			styles[group] || (styles[group] = { ids: [], parts: [], element: undefined })

		if (!style.ids.includes(id)) {
			var code = css.source
			var index = style.ids.length

			style.ids.push(id)

			if (isOldIE) {
				style.element =
					style.element || document.querySelector('style[data-group=' + group + ']')
			}

			if (!style.element) {
				var el = (style.element = document.createElement('style'))
				el.type = 'text/css'

				if (css.media) {
					el.setAttribute('media', css.media)
				}
				if (isOldIE) {
					el.setAttribute('data-group', group)
					el.setAttribute('data-next-index', '0')
				}

				head.appendChild(el)
			}

			if (isOldIE) {
				index = parseInt(style.element.getAttribute('data-next-index'))
				style.element.setAttribute('data-next-index', index + 1)
			}

			if (style.element.styleSheet) {
				style.parts.push(code)
				style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n')
			} else {
				var textNode = document.createTextNode(code)
				var nodes = style.element.childNodes
				if (nodes[index]) {
					style.element.removeChild(nodes[index])
				}
				if (nodes.length) {
					style.element.insertBefore(textNode, nodes[index])
				} else {
					style.element.appendChild(textNode)
				}
			}
		}
	}
}
/* style inject SSR */

var Item = __vue_normalize__(
	{ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	__vue_inject_styles__,
	__vue_script__,
	__vue_scope_id__,
	__vue_is_functional_template__,
	__vue_module_identifier__,
	__vue_create_injector__,
	undefined,
)

//

var browser = getBrowser()

var script$1 = {
	name: 'VirtualStream',
	components: {
		Item: Item,
	},
	props: {
		items: {
			type: Array,
			required: true,
		},
		reversed: {
			type: Boolean,
			default: false,
		},
		reverseItems: {
			type: Boolean,
			default: false,
		},
		count: {
			type: Number,
			default: 40,
		},
		offset: {
			type: Number,
			default: 5,
		},
		watchResizes: {
			type: Boolean,
			default: true,
		},
		attachToStart: {
			type: Boolean,
			default: false,
		},
		attachToEnd: {
			type: Boolean,
			default: false,
		},
	},
	data: function data() {
		return {
			currentView: [],
			identifier: {
				ids: {},
				indexes: [],
			},
			position: 0,
			oldPosition: 0,
			oldScrollTop: 0,
			dimensions: {},
			totalHeight: 0,
			ready: false,
			trigger: {
				start: false,
				end: false,
			},
			triggerDimensions: false,
			newItems: [],
			receivedNewItems: false,
			scrollAttachedTo: false,
			oldWindowSize: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
		}
	},
	computed: {
		renderedItems: function renderedItems() {
			var output = [].concat(this.items)
			if (this.reverseItems) {
				output.reverse()
			}
			return output
		},
		itemCount: function itemCount() {
			return this.items.length
		},
		correctedCount: function correctedCount() {
			return Math.round(this.count / 2)
		},
	},
	methods: {
		/**
		 * retreives the current scroll positions for the screen start and end edges
		 * @returns {object}
		 */
		getScrollPosition: function getScrollPosition() {
			var positions = {}
			positions.start = !this.reversed
				? this.$refs.wrapper.scrollTop
				: this.totalHeight -
				  (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)

			positions.end = !this.reversed
				? this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop
				: this.totalHeight - this.$refs.wrapper.scrollTop

			return positions
		},

		/**
		 * calculates and updates the current position dependend on the current scroll position
		 * @param {boolean} force
		 * @returns {void}
		 */
		updateCurrentPosition: function updateCurrentPosition(force) {
			if (!this.ready && !force) {
				return false
			}

			var positions = this.getScrollPosition()
			if (positions.end === this.totalHeight) {
				this.$emit('scroll', 'end')
			}

			if (positions.start <= 0) {
				this.$emit('scroll', 'start')
				this.scrollAttachedTo = 'start'
			} else if (positions.end === this.totalHeight) {
				this.$emit('scroll', 'end')
				this.scrollAttachedTo = 'end'
			} else {
				this.$emit('scroll', positions)
				this.scrollAttachedTo = false
			}

			if (this.triggerDimensions && this.triggerDimensions.start) {
				if (
					this.position > 0 &&
					positions.start <= this.triggerDimensions.start.end
				) {
					this.updatePosition(this.trigger.start.id)
				}
			} else if (this.triggerDimensions && this.triggerDimensions.end) {
				if (positions.end >= this.triggerDimensions.end.start) {
					this.updatePosition(this.trigger.end.id)
				}
			}

			if (
				positions.start < this.triggerDimensions.start.start ||
				positions.end > this.triggerDimensions.end.end
			) {
				this.updatePositionFromUnknownScrollPosition(positions)
			}
		},

		/**
		 * updates the virtualization position when the scroll position is not in any dimension of the currently rendered items
		 * (when scrolled very fast to a speficic position)
		 * @param {object} positions
		 * @returns {void}
		 */
		updatePositionFromUnknownScrollPosition: function updatePositionFromUnknownScrollPosition(
			positions,
		) {
			var dimensions = Object.values(this.dimensions)
			var currentPosition = []
			for (var i = 0; i < dimensions.length; i++) {
				var dimension = dimensions[i]
				if (this.filterCurrentPosition(dimension, positions)) {
					currentPosition.push(dimension)
				}
			}
			if (currentPosition[0]) {
				this.updatePosition(currentPosition[0].id)
			}
		},

		/**
		 * filters through all positions
		 * @param {object} dimension
		 * @param {object} positions
		 * @returns {boolean}
		 */
		filterCurrentPosition: function filterCurrentPosition(dimension, positions) {
			var dimensionEnd = dimension.top + dimension.height
			return positions.end >= dimension.top && positions.end <= dimensionEnd
		},

		/**
		 * handles the scroll position when the wrapper is scrolled
		 * @returns {void}
		 */
		handleScroll: throttle_1(function () {
			var this$1 = this

			this.updateCurrentPosition()
			window.setTimeout(function () {
				this$1.updateCurrentPosition()
			}, 150)
		}, 100),

		/**
		 * updates the current virtualization position to a specific id
		 * @param {number} id
		 * @returns {void}
		 */
		updatePosition: function updatePosition(id) {
			this.position = this.identifier.ids[id]
		},

		/**
		 * gets the item height of the previous item
		 * @param {object} item
		 * @returns {number}
		 */
		getPreviousItemHeight: function getPreviousItemHeight(item) {
			var this$1 = this

			var id = item.id

			var previousIndex = (function () {
				var index = this$1.identifier.ids[id] - 1
				return index >= 0 ? index : false
			})()

			var previousId = (function () {
				var id =
					previousIndex !== false ? this$1.identifier.indexes[previousIndex] : false
				return id ? id : false
			})()

			return this.getItemHeight(previousId)
		},

		/**
		 * Gets the height from an item via the dimensions object
		 * @param {number} id
		 * @returns {number}
		 */
		getItemHeight: function getItemHeight(id) {
			var dimensionItem = this.dimensions[id] || false
			return dimensionItem ? dimensionItem.top + dimensionItem.height : 0
		},

		/**
		 * Updates item dimensions known to the component via mapping through the currently rendered items and recalculating their heights and top positions
		 */
		updateItemDimensions: function updateItemDimensions() {
			var this$1 = this

			this.ready = false
			var sortedItems = this.$refs.items
				.filter(function (item) {
					return item.id !== null
				})
				.sort(function (a, b) {
					if (a.index > b.index) {
						return 1
					}
					if (a.index < b.index) {
						return -1
					}
					return 0
				})

			sortedItems.forEach(function (item, i) {
				var top = this$1.getPreviousItemHeight(item)
				this$1.dimensions[item.id] = {
					height: item.$el.offsetHeight,
					width: item.$el.offsetWidth,
					id: item.id,
					top: top,
				}
			})

			var oldTotalHeight = this.totalHeight
			this.oldScrollTop = this.$refs.wrapper
				? this.$refs.wrapper.scrollTop
				: this.oldScrollTop

			var dimensionArray = Object.values(this.dimensions)
			this.totalHeight = !dimensionArray.length
				? 0
				: dimensionArray.reduce(function (dimensionA, dimensionB) {
						var aVal = typeof dimensionA === 'object' ? dimensionA.height : dimensionA
						var bVal = typeof dimensionB === 'object' ? dimensionB.height : dimensionB
						return aVal + bVal
				  })
			if (dimensionArray.length === 1) {
				this.totalHeight = dimensionArray[0].height
			}

			if (this.receivedNewItems) {
				if (!this.reversed) {
					if (this.oldScrollTop !== 0) {
						if (oldTotalHeight < this.totalHeight) {
							var heightDiff = Math.abs(this.totalHeight - oldTotalHeight)
							window.requestAnimationFrame(function () {
								this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
								this$1.$refs.wrapper.scrollTop = this$1.oldScrollTop + heightDiff
								this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
							})
						}
					}
				}
			} else {
				if (this.oldScrollTop !== 0) {
					if (this.reversed && oldTotalHeight < this.totalHeight) {
						var heightDiff$1 = Math.abs(this.totalHeight - oldTotalHeight)
						window.requestAnimationFrame(function () {
							this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
							this$1.$refs.wrapper.scrollTop = this$1.oldScrollTop + heightDiff$1
							this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
						})
					}
				}
			}

			var startIndex = 0
			var endIndex =
				sortedItems.length - 1 - (this.count - this.offset) < 0
					? sortedItems.length === 1
						? 1
						: sortedItems.length - 1
					: this.count - this.offset

			this.trigger = {
				start: sortedItems[startIndex],
				end: sortedItems[sortedItems.length - endIndex],
			}

			if (dimensionArray.length) {
				this.triggerDimensions = {
					full: {
						start: this.dimensions[this.trigger.start.id],
						end: this.dimensions[this.trigger.end.id],
					},
					start: {
						start: this.dimensions[this.trigger.start.id].top,
						end:
							this.dimensions[this.trigger.start.id].top +
							this.dimensions[this.trigger.start.id].height,
					},
					end: {
						start: this.dimensions[this.trigger.end.id].top,
						end:
							this.dimensions[this.trigger.end.id].top +
							this.dimensions[this.trigger.end.id].height,
					},
				}
			}

			this.$refs.track.style.height = this.totalHeight + 'px'
			this.$emit('dimensions', this.dimensions)

			window.setTimeout(function () {
				this$1.ready = true
				this$1.receivedNewItems = false
			}, 100)
		},

		/**
		 * update the dimension of a specific item
		 * @param {object} item
		 */
		updateItemDimension: function updateItemDimension(item) {
			Object.assign(this.dimensions[item.id], item.dimensions)
		},

		/**
		 * update all dimensions with the height of all new items
		 * used when new items are added to the list of virtualized items
		 * @returns {void}
		 */
		updateAllDimensions: function updateAllDimensions() {
			var this$1 = this

			var sortedItems = this.$refs.items
				.filter(function (item) {
					return item.id !== null
				})
				.sort(function (a, b) {
					if (a.index > b.index) {
						return 1
					}
					if (a.index < b.index) {
						return -1
					}
					return 0
				})

			if (this.$refs.newItems) {
				this.$refs.newItems.forEach(function (item, i) {
					this$1.dimensions[item.id] = {
						height: item.$el.offsetHeight,
						width: item.$el.offsetWidth,
						id: item.id,
						top: 0,
					}
				})
			}

			var newItemHeight = !this.$refs.newItems
				? false
				: (this.$refs.newItems || []).reduce(function (a, b) {
						var aVal = typeof a === 'number' ? a : a.$el.offsetHeight
						var bVal = typeof b === 'number' ? b : b.$el.offsetHeight
						return aVal + bVal
				  }, 0)

			Object.keys(this.dimensions).forEach(function (key, i) {
				var dimension = this$1.dimensions[key]
				Object.assign(this$1.dimensions[key], {
					top: dimension.top + newItemHeight,
				})
			})
		},
		getCurrentView: function getCurrentView(position, items) {
			var startPos =
				position - this.correctedCount < 0 ? 0 : position - this.correctedCount
			var endPos =
				position + this.count > items.length ? items.length : position + this.count
			return this.renderedItems.slice(startPos, endPos)
		},
		getIdentifiers: function getIdentifiers(items) {
			var indexes = []
			var ids = {}

			for (var i = 0; i < items.length; i++) {
				indexes[i] = items[i].id
				ids[items[i].id] = i
			}
			return { indexes: indexes, ids: ids }
		},
		getUpdatedIdentifiers: function getUpdatedIdentifiers(itemDiff) {
			var indexes = Object.keys(itemDiff)
			var currentIdentifiers = this.identifier

			for (var i = 0; i < indexes.length; i++) {
				var index = indexes[i]
				var id = itemDiff[index].id
					? itemDiff[index].id
					: this.renderedItems[index].id

				currentIdentifiers.indexes[index] = id
				currentIdentifiers.ids[id] = index
			}

			return currentIdentifiers
		},
	},
	watch: {
		items: function items(newItems, oldItems) {
			var itemDiff = diff$1(oldItems, newItems)
			if (Object.keys(itemDiff).length > 0) {
				this.currentView = this.getCurrentView(this.position, newItems)
			}
		},
		position: function position(newPosition, oldPosition) {
			if (oldPosition !== newPosition) {
				this.currentView = this.getCurrentView(newPosition, this.items)
			}
		},
		renderedItems: function renderedItems(newRenderedItems, oldRenderedItems) {
			var itemDiff = diff$1(oldRenderedItems, newRenderedItems)
			if (Object.keys(itemDiff).length > 0) {
				this.identifier = this.getUpdatedIdentifiers(itemDiff)
			}
		},
		currentView: function currentView(n) {
			var this$1 = this

			this.$nextTick(function () {
				this$1.updateItemDimensions()
				this$1.$nextTick(function () {
					this$1.updateCurrentPosition()
				})
			})
		},
		itemCount: function itemCount(newVal, oldVal) {
			var this$1 = this

			if (newVal !== oldVal) {
				var diffCount = Math.abs(newVal - oldVal)
				var index = !this.reverseItems ? 0 : this.renderedItems.length - diffCount
				this.newItems = this.renderedItems.slice(index, diffCount)
				this.receivedNewItems = true
				this.$emit('newitem')
			} else {
				this.newItems = []
				this.receivedNewItems = false
			}

			this.updateAllDimensions()

			this.$nextTick(function () {
				if (newVal > oldVal) {
					if (this$1.attachToStart && this$1.scrollAttachedTo === 'start') {
						this$1.$refs.wrapper.scrollTop = !this$1.reversed ? 0 : this$1.totalHeight
					}

					if (this$1.attachToEnd && this$1.scrollAttachedTo === 'end') {
						this$1.$refs.wrapper.scrollTop = !this$1.reversed ? this$1.totalHeight : 0
					}
				}
				this$1.updateCurrentPosition(true)
			})
		},
	},
	created: function created() {
		var this$1 = this

		this.$on('resize-item', function (data) {
			if (this$1.watchResizes) {
				if (
					data.dimensions.w !== this$1.dimensions[data.id].width ||
					data.dimensions.h !== this$1.dimensions[data.id].height
				) {
					if (this$1.position === this$1.oldPosition) {
						this$1.updateItemDimensions()
					}
					window.setTimeout(function () {
						this$1.oldPosition = this$1.position
					}, 50)
				}
			}
		})
	},
	mounted: function mounted() {
		var this$1 = this

		this.currentView = this.getCurrentView(0, this.items)
		this.identifier = this.getIdentifiers(this.renderedItems)
		this.$nextTick(function () {
			this$1.updateItemDimensions()
			this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
			if (this$1.reversed) {
				this$1.$refs.wrapper.scrollTop = this$1.totalHeight
			}
			this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'

			this$1.updateCurrentPosition()

			window.setTimeout(function () {
				this$1.ready = true
			}, 100)

			window.addEventListener(
				'resize',
				debounce_1(function () {
					var windowSize = {
						width: window.innerWidth,
						height: window.innerHeight,
					}

					if (windowSize.width !== this$1.oldWindowSize.width) {
						this$1.position = 0
						this$1.dimensions = {}
						this$1.newItems = []
						this$1.oldPosition = 0
						this$1.totalHeight = 0
						this$1.trigger = {
							start: false,
							end: false,
						}
						this$1.triggerDimensions = {
							start: false,
							end: false,
						}

						this$1.updateItemDimensions()
						this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
						if (this$1.$refs.wrapper && this$1.reversed) {
							this$1.$refs.wrapper.scrollTop = this$1.totalHeight
						}
						this$1.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
					}

					this$1.oldWindowSize = windowSize
				}, 60),
			)
		})
	},
}

/* script */
var __vue_script__$1 = script$1

/* template */
var __vue_render__$1 = function () {
	var _vm = this
	var _h = _vm.$createElement
	var _c = _vm._self._c || _h
	return _c(
		'div',
		{ ref: 'container', staticClass: 'VirtualStream__Scroller' },
		[
			_c(
				'div',
				{
					ref: 'wrapper',
					staticClass: 'VirtualStream__Wrapper',
					on: {
						'&scroll': function ($event) {
							return _vm.handleScroll($event)
						},
					},
				},
				[
					_c(
						'div',
						{
							ref: 'newItemsList',
							staticClass: 'VirtualStream__Track VirtualStream__Track--newItems',
						},
						_vm._l(_vm.newItems, function (item, index) {
							return _c(
								'Item',
								{
									key: item.id,
									ref: 'newItems',
									refInFor: true,
									attrs: {
										id: item.id,
										index: index,
										maxIndex: _vm.newItems.length,
										disableResizer: '',
									},
								},
								[_vm._t('default', null, { item: item, index: index })],
								2,
							)
						}),
						1,
					),
					_vm._v(' '),
					_c(
						'div',
						{ ref: 'track', staticClass: 'VirtualStream__Track' },
						_vm._l(_vm.count, function (index) {
							return _c(
								'Item',
								{
									key: _vm.currentView[index - 1] ? _vm.currentView[index - 1].id : null,
									ref: 'items',
									refInFor: true,
									attrs: {
										id: _vm.currentView[index - 1] ? _vm.currentView[index - 1].id : null,
										index: index - 1,
										maxIndex: _vm.currentView.length - 1,
									},
								},
								[
									_vm.currentView[index - 1]
										? _vm._t('default', null, {
												item: _vm.currentView[index - 1],
												index: index - 1,
										  })
										: _vm._e(),
								],
								2,
							)
						}),
						1,
					),
				],
			),
		],
	)
}
var __vue_staticRenderFns__$1 = []
__vue_render__$1._withStripped = true

/* style */
var __vue_inject_styles__$1 = function (inject) {
	if (!inject) {
		return
	}
	inject('data-v-ccc9d96c_0', {
		source:
			'\n.VirtualStream__Scroller[data-v-ccc9d96c] {\n  height: 100%;\n  left: 0;\n  overflow: auto;\n  position: absolute;\n  top: 0;\n  transform: translate3d(0,0,0);\n  width: 100%;\n}\n.VirtualStream__Wrapper[data-v-ccc9d96c] {\n  /* -webkit-overflow-scrolling: touch; */\n  height: 100%;\n  overflow: auto;\n  transform: translate3d(0,0,0);\n  width: 100%;\n}\n.VirtualStream__Track[data-v-ccc9d96c] {\n  position: relative;\n}\n.VirtualStream__Track--newItems[data-v-ccc9d96c] {\n  left: -99999px;\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  transform: translateX(-99999999px);\n  width: 100%;\n}\n.VirtualStream__Items[data-v-ccc9d96c] {\n  transform: translate3d(0,0,0);\n}\n',
		map: {
			version: 3,
			sources: [
				'/Users/andhy/Downloads/vue-virtual-stream-master/src/components/VirtualStream.vue',
			],
			names: [],
			mappings:
				';AA+gBA;EACA,aAAA;EACA,QAAA;EACA,eAAA;EACA,mBAAA;EACA,OAAA;EACA,8BAAA;EACA,YAAA;CACA;AAEA;EACA,wCAAA;EACA,aAAA;EACA,eAAA;EACA,8BAAA;EACA,YAAA;CACA;AAEA;EACA,mBAAA;CACA;AAEA;EACA,eAAA;EACA,WAAA;EACA,qBAAA;EACA,mBAAA;EACA,OAAA;EACA,mCAAA;EACA,YAAA;CACA;AAEA;EACA,8BAAA;CACA',
			file: 'VirtualStream.vue',
			sourcesContent: [
				"<template>\n  <div class=\"VirtualStream__Scroller\" ref=\"container\">\n    <div class=\"VirtualStream__Wrapper\" ref=\"wrapper\" @scroll.passive=\"handleScroll\">\n      <div class=\"VirtualStream__Track VirtualStream__Track--newItems\" ref=\"newItemsList\">\n        <Item v-for=\"(item, index) in newItems\" :id=\"item.id\" :index=\"index\" :maxIndex=\"newItems.length\" :key=\"item.id\" ref=\"newItems\" disableResizer>\n          <slot :item=\"item\" :index=\"index\" />\n        </Item>\n      </div>\n      <div class=\"VirtualStream__Track\" ref=\"track\">\n        <Item\n          v-for=\"index in count\"\n          :key=\"(currentView[index - 1]) ? currentView[index - 1].id : null\"\n          :id=\"(currentView[index - 1]) ? currentView[index - 1].id : null\"\n          :index=\"index - 1\"\n          :maxIndex=\"currentView.length - 1\"\n          ref=\"items\"\n        >\n          <slot v-if=\"currentView[index - 1]\" :item=\"currentView[index -1]\" :index=\"index - 1\" />\n        </Item>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\n  import throttle from 'lodash/throttle'\n  import debounce from 'lodash/debounce'\n  import diff from 'deep-object-diff/dist/diff'\n  import getBrowser from '../utils/getBrowser'\n  import Item from './Item.vue'\n\n  const browser = getBrowser()\n  let locked = false\n\n  export default {\n    name: 'VirtualStream',\n    components: {\n      Item\n    },\n    props: {\n      items: {\n        type: Array,\n        required: true,\n      },\n      reversed: {\n        type: Boolean,\n        default: false,\n      },\n      reverseItems: {\n        type: Boolean,\n        default: false,\n      },\n      count: {\n        type: Number,\n        default: 40,\n      },\n      offset: {\n        type: Number,\n        default: 5,\n      },\n      watchResizes: {\n        type: Boolean,\n        default: true,\n      },\n      attachToStart: {\n        type: Boolean,\n        default: false,\n      },\n      attachToEnd: {\n        type: Boolean,\n        default: false,\n      },\n    },\n    data() {\n      return {\n        currentView: [],\n        identifier: {\n          ids: {},\n          indexes: [],\n        },\n        position: 0,\n        oldPosition: 0,\n        oldScrollTop: 0,\n        dimensions: {},\n        totalHeight: 0,\n        ready: false,\n        trigger: {\n          start: false,\n          end: false,\n        },\n        triggerDimensions: false,\n        newItems: [],\n        receivedNewItems: false,\n        scrollAttachedTo: false,\n        oldWindowSize: {\n          width: window.innerWidth,\n          height: window.innerHeight,\n        },\n      }\n    },\n    computed: {\n      renderedItems() {\n        const output = [...this.items]\n        if (this.reverseItems) output.reverse()\n        return output\n      },\n      itemCount() {\n        return this.items.length\n      },\n      correctedCount() {\n        return Math.round(this.count / 2)\n      },\n    },\n    methods: {\n      \n      /**\n       * retreives the current scroll positions for the screen start and end edges\n       * @returns {object}\n       */\n      getScrollPosition() {\n        const positions = {}\n        positions.start = (!this.reversed) ?\n          this.$refs.wrapper.scrollTop :\n          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)\n\n        positions.end = (!this.reversed) ?\n          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :\n          this.totalHeight - this.$refs.wrapper.scrollTop\n        \n        return positions\n      },\n\n      /**\n       * calculates and updates the current position dependend on the current scroll position\n       * @param {boolean} force\n       * @returns {void}\n       */\n      updateCurrentPosition(force) {\n        if (!this.ready && !force) return false\n        \n        const positions = this.getScrollPosition()\n        if (positions.end === this.totalHeight) this.$emit('scroll', 'end')\n\n        if (positions.start <= 0) {\n          this.$emit('scroll', 'start')\n          this.scrollAttachedTo = 'start'\n        } else if (positions.end === this.totalHeight) {\n          this.$emit('scroll', 'end')\n          this.scrollAttachedTo = 'end'\n        } else {\n          this.$emit('scroll', positions)\n          this.scrollAttachedTo = false\n        }\n        \n        if (this.triggerDimensions && this.triggerDimensions.start) {\n          if (this.position > 0 && (positions.start <= this.triggerDimensions.start.end)) {\n            this.updatePosition(this.trigger.start.id)\n          }\n        } else if (this.triggerDimensions && this.triggerDimensions.end) {\n          if (positions.end >= this.triggerDimensions.end.start) {\n            this.updatePosition(this.trigger.end.id)\n          }\n        }\n\n        if (positions.start < this.triggerDimensions.start.start || positions.end > this.triggerDimensions.end.end) {\n          this.updatePositionFromUnknownScrollPosition(positions)\n        }\n      },\n\n      /**\n       * updates the virtualization position when the scroll position is not in any dimension of the currently rendered items\n       * (when scrolled very fast to a speficic position)\n       * @param {object} positions\n       * @returns {void}\n       */\n      updatePositionFromUnknownScrollPosition(positions) {\n        const dimensions = Object.values(this.dimensions)\n        let currentPosition = []\n        for (let i = 0; i < dimensions.length; i++) {\n          const dimension = dimensions[i]\n          if (this.filterCurrentPosition(dimension, positions)) currentPosition.push(dimension)\n        }\n        if (currentPosition[0]) {\n          this.updatePosition(currentPosition[0].id)\n        }\n      },\n\n      /**\n       * filters through all positions\n       * @param {object} dimension\n       * @param {object} positions\n       * @returns {boolean}\n       */\n      filterCurrentPosition(dimension, positions) {\n        const dimensionEnd = dimension.top + dimension.height\n        return ((positions.end >= dimension.top && positions.end <= dimensionEnd))\n      },\n      \n      /**\n       * handles the scroll position when the wrapper is scrolled\n       * @returns {void}\n       */\n      handleScroll: throttle(function() {\n        this.updateCurrentPosition()\n        window.setTimeout(() => {\n          this.updateCurrentPosition()\n        }, 150)\n      }, 100),\n      \n      /**\n       * updates the current virtualization position to a specific id\n       * @param {number} id\n       * @returns {void}\n       */\n      updatePosition(id) {\n        this.position = this.identifier.ids[id]\n      },\n\n      /**\n       * gets the item height of the previous item\n       * @param {object} item\n       * @returns {number}\n       */\n      getPreviousItemHeight(item) {\n        const id = item.id\n\n        const previousIndex = (() => {\n          const index = this.identifier.ids[id] - 1\n          return (index >= 0) ? index : false\n        })()\n\n        const previousId = (() => {\n          const id = (previousIndex !== false) ? this.identifier.indexes[previousIndex] : false\n          return (id) ? id : false\n        })()\n\n        return this.getItemHeight(previousId)\n      },\n      \n      /**\n       * Gets the height from an item via the dimensions object\n       * @param {number} id\n       * @returns {number}\n       */\n      getItemHeight(id) {\n        const dimensionItem = this.dimensions[id] || false\n        return (dimensionItem) ? dimensionItem.top + dimensionItem.height : 0\n      },\n      \n      /**\n       * Updates item dimensions known to the component via mapping through the currently rendered items and recalculating their heights and top positions\n       */\n      updateItemDimensions() {\n        this.ready = false\n        const sortedItems = this.$refs.items.filter((item) => {\n          return (item.id !== null)\n        }).sort((a, b) => {\n          if (a.index > b.index) return 1\n          if (a.index < b.index) return -1\n          return 0\n        })\n\n        sortedItems.forEach((item, i) => {\n          const top = this.getPreviousItemHeight(item)\n          this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top }\n        })\n\n        const oldTotalHeight = this.totalHeight\n        this.oldScrollTop = (this.$refs.wrapper) ? this.$refs.wrapper.scrollTop : this.oldScrollTop\n\n        const dimensionArray = Object.values(this.dimensions)\n        this.totalHeight = (!dimensionArray.length) ? 0 : dimensionArray.reduce((dimensionA, dimensionB) => {\n          const aVal = (typeof dimensionA === 'object') ? dimensionA.height : dimensionA\n          const bVal = (typeof dimensionB === 'object') ? dimensionB.height : dimensionB\n          return aVal + bVal\n        })\n        if (dimensionArray.length === 1) this.totalHeight = dimensionArray[0].height\n\n        if (this.receivedNewItems) {\n          if (!this.reversed) {\n            if (this.oldScrollTop !== 0) {\n              if (oldTotalHeight < this.totalHeight) {\n                const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)\n                window.requestAnimationFrame(() => {\n                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n                  this.$refs.wrapper.scrollTop = this.oldScrollTop + heightDiff\n                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n                })\n              }\n            }  \n          }\n        } else {\n          if (this.oldScrollTop !== 0) {\n            if (this.reversed && oldTotalHeight < this.totalHeight) {\n              const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)\n              window.requestAnimationFrame(() => {\n                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n                this.$refs.wrapper.scrollTop = this.oldScrollTop + heightDiff\n                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n              })\n            }\n          }\n        }\n\n        const startIndex = 0\n        const endIndex = ((sortedItems.length - 1) - (this.count - this.offset) < 0) ?  (sortedItems.length === 1) ? 1 : sortedItems.length - 1 : this.count - this.offset\n\n        this.trigger = {\n          start: sortedItems[startIndex],\n          end: sortedItems[sortedItems.length - endIndex]\n        }\n\n        if (dimensionArray.length) {\n          this.triggerDimensions = {\n            full: {\n              start: this.dimensions[this.trigger.start.id],\n              end: this.dimensions[this.trigger.end.id],\n            },\n            start: {\n              start: this.dimensions[this.trigger.start.id].top,\n              end: this.dimensions[this.trigger.start.id].top + this.dimensions[this.trigger.start.id].height\n            },\n            end: {\n              start: this.dimensions[this.trigger.end.id].top,\n              end: this.dimensions[this.trigger.end.id].top + this.dimensions[this.trigger.end.id].height\n            }\n          }\n        }\n\n        this.$refs.track.style.height = this.totalHeight + 'px'\n        this.$emit('dimensions', this.dimensions)\n\n        window.setTimeout(() => {\n          this.ready = true\n          this.receivedNewItems = false\n        }, 100)\n      },\n\n      /**\n       * update the dimension of a specific item\n       * @param {object} item\n       */\n      updateItemDimension(item) {\n        Object.assign(this.dimensions[item.id], item.dimensions)\n      },\n\n      /**\n       * update all dimensions with the height of all new items\n       * used when new items are added to the list of virtualized items\n       * @returns {void}\n       */\n      updateAllDimensions() {\n        const sortedItems = this.$refs.items.filter((item) => {\n          return (item.id !== null)\n        }).sort((a, b) => {\n          if (a.index > b.index) return 1\n          if (a.index < b.index) return -1\n          return 0\n        })\n\n        if (this.$refs.newItems) {\n          this.$refs.newItems.forEach((item, i) => {\n            this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top: 0 }\n          })\n        }\n\n        const newItemHeight = (!this.$refs.newItems) ? false : (this.$refs.newItems || []).reduce((a, b) => {\n          const aVal = (typeof a === 'number') ? a : a.$el.offsetHeight\n          const bVal = (typeof b === 'number') ? b : b.$el.offsetHeight\n          return aVal + bVal\n        }, 0)\n\n        const newDimensions = {}\n\n        Object.keys(this.dimensions).forEach((key, i) => {\n          const dimension = this.dimensions[key]\n          Object.assign(this.dimensions[key], { top: dimension.top + newItemHeight })\n        })\n      },\n      getCurrentView(position, items) {\n        const startPos = (position - this.correctedCount < 0) ? 0 : position - this.correctedCount\n        const endPos = (position + this.count > items.length) ? items.length : position + this.count\n        return this.renderedItems.slice(startPos, endPos)\n      },\n      getIdentifiers(items) {\n        let indexes = []\n        let ids = {}\n\n        for(let i = 0; i < items.length; i++) {\n          indexes[i] = items[i].id\n          ids[items[i].id] = i\n        }\n        return { indexes, ids }\n      },\n      getUpdatedIdentifiers(itemDiff) {\n        const indexes = Object.keys(itemDiff)\n        const currentIdentifiers = this.identifier\n\n        for (let i = 0; i < indexes.length; i++) {\n          const index = indexes[i]\n          const id = (itemDiff[index].id) ? itemDiff[index].id : this.renderedItems[index].id\n          \n          currentIdentifiers.indexes[index] = id\n          currentIdentifiers.ids[id] = index\n        }\n\n        return currentIdentifiers\n      },\n    },\n    watch: {\n      items(newItems, oldItems) {\n        const itemDiff = diff(oldItems, newItems)\n        if (Object.keys(itemDiff).length > 0) {\n          this.currentView = this.getCurrentView(this.position, newItems)\n        }\n      },\n      position(newPosition, oldPosition) {\n        if (oldPosition !== newPosition) {\n          this.currentView = this.getCurrentView(newPosition, this.items)\n        }\n      },\n      renderedItems(newRenderedItems, oldRenderedItems) {\n        const itemDiff = diff(oldRenderedItems, newRenderedItems)\n        if (Object.keys(itemDiff).length > 0) {\n          this.identifier = this.getUpdatedIdentifiers(itemDiff)\n        }\n      },\n      currentView(n) {\n        this.$nextTick(() => {\n          this.updateItemDimensions()\n          this.$nextTick(() => {\n            this.updateCurrentPosition()\n          })\n        })\n      },\n      itemCount(newVal, oldVal) {\n        if (newVal !== oldVal) {\n          const diffCount = Math.abs(newVal - oldVal)\n          const index = (!this.reverseItems) ? 0 : this.renderedItems.length - diffCount\n          this.newItems = this.renderedItems.slice(index, diffCount)\n          this.receivedNewItems = true\n          this.$emit('newitem')\n        } else {\n          this.newItems = []\n          this.receivedNewItems = false\n        }\n\n        this.updateAllDimensions()\n        \n        this.$nextTick(() => {\n          if (newVal > oldVal) {\n            if (this.attachToStart && this.scrollAttachedTo === 'start') {\n              this.$refs.wrapper.scrollTop = (!this.reversed) ? 0 : this.totalHeight\n            }\n\n            if (this.attachToEnd && this.scrollAttachedTo === 'end') {\n              this.$refs.wrapper.scrollTop = (!this.reversed) ? this.totalHeight : 0\n            }\n          }\n          this.updateCurrentPosition(true)\n        })\n      }\n    },\n    created() {\n      this.$on('resize-item', (data) => {\n        if (this.watchResizes) {\n          if (data.dimensions.w !== this.dimensions[data.id].width || data.dimensions.h !== this.dimensions[data.id].height) {\n            if (this.position === this.oldPosition) {\n              this.updateItemDimensions()\n            }\n            window.setTimeout(() => {\n              this.oldPosition = this.position\n            }, 50)\n          }\n        }\n      })\n    },\n    mounted() {\n      this.currentView = this.getCurrentView(0, this.items)\n      this.identifier = this.getIdentifiers(this.renderedItems)\n      this.$nextTick(() => {\n        this.updateItemDimensions()\n        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n        if (this.reversed) this.$refs.wrapper.scrollTop = this.totalHeight\n        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n\n        this.updateCurrentPosition()\n\n        window.setTimeout(() => {\n          this.ready = true\n        }, 100)\n\n        window.addEventListener('resize', debounce(() => {\n          const windowSize = {\n            width: window.innerWidth,\n            height: window.innerHeight,\n          }\n\n          if (windowSize.width !== this.oldWindowSize.width) {\n            this.position = 0\n            this.dimensions = {}\n            this.newItems = []\n            this.oldPosition = 0\n            this.totalHeight = 0\n            this.trigger = {\n              start: false,\n              end: false,\n            }\n            this.triggerDimensions = {\n              start: false,\n              end: false,\n            }\n  \n            this.updateItemDimensions()\n            this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'\n            if (this.$refs.wrapper && this.reversed) this.$refs.wrapper.scrollTop = this.totalHeight\n            this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'\n          }\n\n          this.oldWindowSize = windowSize\n        }, 60))\n      })\n    }\n  }\n</script>\n\n<style scoped>\n  .VirtualStream__Scroller {\n    height: 100%;\n    left: 0;\n    overflow: auto;\n    position: absolute;\n    top: 0;\n    transform: translate3d(0,0,0);\n    width: 100%;\n  }\n\n  .VirtualStream__Wrapper {\n    /* -webkit-overflow-scrolling: touch; */\n    height: 100%;\n    overflow: auto;\n    transform: translate3d(0,0,0);\n    width: 100%;\n  }\n\n  .VirtualStream__Track {\n    position: relative;\n  }\n\n  .VirtualStream__Track--newItems {\n    left: -99999px;\n    opacity: 0;\n    pointer-events: none;\n    position: absolute;\n    top: 0;\n    transform: translateX(-99999999px);\n    width: 100%;\n  }\n\n  .VirtualStream__Items {\n    transform: translate3d(0,0,0);\n  }\n</style>\n",
			],
		},
		media: undefined,
	})
}
/* scoped */
var __vue_scope_id__$1 = 'data-v-ccc9d96c'
/* module identifier */
var __vue_module_identifier__$1 = undefined
/* functional template */
var __vue_is_functional_template__$1 = false
/* component normalizer */
function __vue_normalize__$1(
	template,
	style,
	script,
	scope,
	functional,
	moduleIdentifier,
	createInjector,
	createInjectorSSR,
) {
	var component = (typeof script === 'function' ? script.options : script) || {}

	// For security concerns, we use only base name in production mode.
	component.__file =
		'/Users/andhy/Downloads/vue-virtual-stream-master/src/components/VirtualStream.vue'

	if (!component.render) {
		component.render = template.render
		component.staticRenderFns = template.staticRenderFns
		component._compiled = true

		if (functional) {
			component.functional = true
		}
	}

	component._scopeId = scope

	{
		var hook
		if (style) {
			hook = function (context) {
				style.call(this, createInjector(context))
			}
		}

		if (hook !== undefined) {
			if (component.functional) {
				// register for functional component in vue file
				var originalRender = component.render
				component.render = function renderWithStyleInjection(h, context) {
					hook.call(context)
					return originalRender(h, context)
				}
			} else {
				// inject component registration as beforeCreate hook
				var existing = component.beforeCreate
				component.beforeCreate = existing ? [].concat(existing, hook) : [hook]
			}
		}
	}

	return component
}
/* style inject */
function __vue_create_injector__$1() {
	var head = document.head || document.getElementsByTagName('head')[0]
	var styles =
		__vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {})
	var isOldIE =
		typeof navigator !== 'undefined' &&
		/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase())

	return function addStyle(id, css) {
		if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) {
			return
		} // SSR styles are present.

		var group = isOldIE ? css.media || 'default' : id
		var style =
			styles[group] || (styles[group] = { ids: [], parts: [], element: undefined })

		if (!style.ids.includes(id)) {
			var code = css.source
			var index = style.ids.length

			style.ids.push(id)

			if (isOldIE) {
				style.element =
					style.element || document.querySelector('style[data-group=' + group + ']')
			}

			if (!style.element) {
				var el = (style.element = document.createElement('style'))
				el.type = 'text/css'

				if (css.media) {
					el.setAttribute('media', css.media)
				}
				if (isOldIE) {
					el.setAttribute('data-group', group)
					el.setAttribute('data-next-index', '0')
				}

				head.appendChild(el)
			}

			if (isOldIE) {
				index = parseInt(style.element.getAttribute('data-next-index'))
				style.element.setAttribute('data-next-index', index + 1)
			}

			if (style.element.styleSheet) {
				style.parts.push(code)
				style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n')
			} else {
				var textNode = document.createTextNode(code)
				var nodes = style.element.childNodes
				if (nodes[index]) {
					style.element.removeChild(nodes[index])
				}
				if (nodes.length) {
					style.element.insertBefore(textNode, nodes[index])
				} else {
					style.element.appendChild(textNode)
				}
			}
		}
	}
}
/* style inject SSR */

var VirtualStream = __vue_normalize__$1(
	{ render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
	__vue_inject_styles__$1,
	__vue_script__$1,
	__vue_scope_id__$1,
	__vue_is_functional_template__$1,
	__vue_module_identifier__$1,
	__vue_create_injector__$1,
	undefined,
)

function install(Vue) {
	if (install.installed) {
		return
	}
	install.installed = true
	Vue.component('VirtualStream', VirtualStream)
}

var plugin = {
	install: install,
}

var GlobalVue = null
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}

if (GlobalVue) {
	GlobalVue.use(plugin)
}

export default VirtualStream
export { install }
