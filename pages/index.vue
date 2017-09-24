<template>
  <div>
    <span>
      <ul id="messages">
        <li v-for="message in messages">{{message}}</li>
      </ul>
    </span>
    <!-- the submit event will no longer reload the page -->
    <form v-on:submit.prevent="submitMessage">
      <input id="m" autocomplete="off" v-model="inputMessage"/>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import Faye from 'faye'

// Option 1: mounted
// Code that will run only after the entire view has been rendered.
// https://vuejs.org/v2/api/#mounted
export default {
  // You should not use an arrow function to define a lifecycle hook, methods
  // ,... (e.g. mounted: () => this.socket++). The reason is arrow functions
  // bind the parent context, so this will not be the Vue instance as you expect
  // and this.socket will be undefined.
  mounted: function() {
    // You can make it as a custom function and bind it to Vue instance.
    // this.socket = () => {
    //   // return 'socket'
    //   var client = new Faye.Client('/faye', {
    //     timeout: 20
    //   })
    //   return client
    // },

    // Configure Faye client.
    this.socket = new Faye.Client('/faye', {
      timeout: 20
    })

    // Publish a simple message to '/foo'.
    this.socket.publish('/foo', {text: 'Hi there'})

    // Subscribe to'/channelServer' for incoming message.
    this.socket.subscribe('/channelServer', function(data) {
      this.messages.push(data)
      console.log(this.messages)
    }.bind(this))

    console.log('mounted')
  },
  async asyncData () {
    return {
      inputMessage: '',
      messages: ['hello']
    }
  },
  head () {
    return {
      title: 'Chat'
    }
  },
  methods: {
    submitMessage() {
      // Publish submitted message to '/channelClient'.
      this.socket.publish('/channelClient', this.inputMessage)
      this.inputMessage = ''
    }
  }
}

// // Option 2: if (process.browser) {...}
// // Make functions and import it.
// import { subscribe, publish  } from '~/plugins/faye'
// publish('/foo', {text: 'Hi there'})

// export default {
//   async asyncData () {
//     return {
//       inputMessage: '',
//       messages: ['hello']
//     }
//   },
//   head () {
//     return {
//       title: 'Chat'
//     }
//   },
//   created () {
//     subscribe('/channelServer', function(data) {
//       this.messages.push(data)
//       console.log(this.messages)
//     }.bind(this))
//   },
//   methods: {
//     submitMessage() {
//       // Publish submitted message to '/channelClient'.
//       publish('/channelClient', this.inputMessage)
//       this.inputMessage = ''
//     }
//   }
// }

// // Option 3: if (process.browser) {...}
// // Do it everything here.
// // https://nuxtjs.org/faq/window-document-undefined/
// if (process.browser) {
//   const Faye = require('faye')
//   var client = new Faye.Client('/faye', {
//     timeout: 20
//   })
// }

// if (process.browser) {
//   client.publish('/foo', {text: 'Hi there'})
// }

// export default {
//   async asyncData () {
//     return {
//       inputMessage: '',
//       messages: ['hello']
//     }
//   },
//   head () {
//     return {
//       title: 'Chat'
//     }
//   },
//   created () {
//     if (process.browser) {
//       client.subscribe('/channelServer', function(data) {
//         this.messages.push(data)
//         console.log(this.messages)
//       }.bind(this))
//     }
//   },
//   methods: {
//     submitMessage() {
//       // Publish submitted message to '/channelClient'.
//       if (process.browser) {
//         client.publish('/channelClient', this.inputMessage)
//         this.inputMessage = ''
//       }
//     }
//   }
// }
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font: 13px Helvetica, Arial; }
form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
#messages { list-style-type: none; margin: 0; padding: 0; }
#messages li { padding: 5px 10px; }
#messages li:nth-child(odd) { background: #eee; }
</style>
