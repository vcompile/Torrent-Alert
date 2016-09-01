console.log('process.env.PROXY', process.env.PROXY);
console.log('process.env.TORRENTZ_URL', process.env.TORRENTZ_URL);

_proxy = (process.env.PROXY ? process.env.PROXY.split('|').filter(Boolean) : []);
_torrentz_url = (process.env.TORRENTZ_URL ? process.env.TORRENTZ_URL.split('|').filter(Boolean) : []);
