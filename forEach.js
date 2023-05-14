const __forEach = [].forEach;

module.exports = __forEach ? ((src, fn, ctx) => {
  src && __forEach.call(src, fn, ctx);
}) : ((src, fn, ctx) => {
  for (let l = src && src.length || 0, i = 0; i < l; i++) {
    fn.call(ctx, src[i], i, src);
  }
});
