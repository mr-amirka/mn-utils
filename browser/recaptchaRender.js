const moduleRecaptcha = require('./module/recaptcha');


module.exports = (node, sitekey) => {
  return moduleRecaptcha().then((grecaptcha) => {
    grecaptcha.render(node, {
      sitekey,
    });
  });
};
