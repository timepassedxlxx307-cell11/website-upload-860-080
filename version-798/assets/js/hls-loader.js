if (!window.Hls) {
  import('./hls-vendor-dru42stk.js')
    .then(function(module) {
      window.Hls = module.H;
      document.dispatchEvent(new Event('hls-ready'));
    })
    .catch(function() {
      document.dispatchEvent(new Event('hls-ready'));
    });
} else {
  document.dispatchEvent(new Event('hls-ready'));
}
