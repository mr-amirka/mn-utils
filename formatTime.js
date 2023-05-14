const padStart = require('./padStart');
const isDate = require('./isDate');
const isDefined = require('./isDefined');
const templateProvider = require('./templateProvider');

const REGEXP_TEMPLATE = /\{((?:(?:"[^"]*")|(?:'[^']*')|(?:`[^`]*`)|(?:\{.*?\})|(?:[^}]*?))*?)\}/g; // eslint-disable-line
const DEFAULT_MASK = '{yyyy}-{mm}-{dd} {HH}:{MM}:{ss}';
const I18N = {
  days: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
    'Saturday',
  ],
  months: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
    'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ],
};
const templateRFC3339 = templateProvider(
    '{yyyy}-{mm}-{dd}T{HH}:{MM}:{ss}.{L}{o}', 0, REGEXP_TEMPLATE,
);

function pad(v, len) {
  return padStart(v, len || 2, '0');
}

function formatTime(date, mask, utc, i18n) {
  const ctx = getData(date, utc, i18n);
  return ctx
    ? templateProvider(mask || DEFAULT_MASK, 0, REGEXP_TEMPLATE)(ctx)
    : '';
}

function normalizeDate(date) {
  try {
    return isDefined(date)
      ? (isDate(date) ? date : (
        isNaN(date = new Date(date)) ? null : date
      ))
      : new Date();
  } catch (ex) {
    console.error(ex);
  }
  return null;
}

function getData(date, utc, i18n) {
  date = normalizeDate(date);
  if (!date) return null;
  i18n = i18n || I18N;

  function get(key) {
    return date[prefix + key]();
  }

  const prefix = utc ? 'getUTC' : 'get';
  const d = get('Date');
  const D = get('Day');
  const m = get('Month');
  const y = get('FullYear');
  const H = get('Hours');
  const M = get('Minutes');
  const s = get('Seconds');
  const L = get('Milliseconds');
  const o = utc ? 0 : date.getTimezoneOffset();
  const oA = Math.abs(o);
  const oM = oA % 60;
  const oH = (oA - oM) / 60;
  const {
    days,
    months,
  } = i18n;
  return {
    d: d,
    dd: pad(d),
    ddd: days[D],
    dddd: days[D + 7],
    m: m + 1,
    mm: pad(m + 1),
    mmm: months[m],
    mmmm: months[m + 12],
    yy: ('' + y).slice(2),
    yyyy: y,
    h: H % 12 || 12,
    hh: pad(H % 12 || 12),
    H: H,
    HH: pad(H),
    M: M,
    MM: pad(M),
    s: s,
    ss: pad(s),
    l: pad(L, 3),
    L: pad(Math.round(L / 10)),
    t: H < 12 ? 'a' : 'p',
    tt: H < 12 ? 'am' : 'pm',
    T: H < 12 ? 'A' : 'P',
    TT: H < 12 ? 'AM' : 'PM',
    o: utc ? 'Z' : (o > 0 ? '-' : '+') + pad(oH, 2) + ':' + pad(oM, 2),
  };
}

formatTime.normalizeDate = normalizeDate;
formatTime.getData = getData;
formatTime.getRFC3339 = (time, utc) => templateRFC3339(getData(time, utc));

module.exports = formatTime;
