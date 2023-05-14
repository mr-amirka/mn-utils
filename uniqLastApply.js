/**
 * @overview uniqLastApply
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isNext = (prev, next) => {
	if (!prev) return true;
	const length = Math.max(prev.length, next.length);
	for (let i = 0; i < length; i++) {
		if (prev[i] !== next[i]) return true;
	}
	return false;
};
module.exports = fn => {
	let lastArgs, result;
	return function() {
		if (isNext(lastArgs, arguments)) result = fn.apply(this, lastArgs = arguments);
		return result;
	};
};
