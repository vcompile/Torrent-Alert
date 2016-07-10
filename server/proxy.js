console.log('process.env.PROXY', process.env.PROXY);
console.log('process.env.TORRENTZ_PROXY', process.env.TORRENTZ_PROXY);

_proxy = (process.env.PROXY ? process.env.PROXY.split(/\|/).filter(Boolean) : []);
_torrentz_proxy = (process.env.TORRENTZ_PROXY ? process.env.TORRENTZ_PROXY.split(/\|/).filter(Boolean) : []);
