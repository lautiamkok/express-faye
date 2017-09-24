// https://nuxtjs.org/faq/window-document-undefined/
// https://github.com/nuxt/nuxt.js/issues/356
if (process.browser) {
  const Faye = require('faye')
  var client = new Faye.Client('/faye', {
    timeout: 20
  })
}

function subscribe(id, callback) {
  if (process.browser) {
    client.subscribe(id, callback)
  }
}

function publish (id, data) {
  if (process.browser) {
    client.publish(id, data)
  }
}

export { subscribe, publish }

// jQuery example.
// if (process.browser) {
//    const $ = require('jquery')
//    $(function() {
//       console.log('document ready!');
//       // do whatever you want with html and jquery
//    })
// }
