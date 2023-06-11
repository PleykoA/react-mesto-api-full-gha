const allowedCors = [
  'https://pleykoa.nomoredomains.rocks',
  'http://pleykoa.nomoredomains.rocks',
  'localhost:3000',
];

// eslint-disable-next-line consistent-return
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');

  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
};

module.exports = cors;
