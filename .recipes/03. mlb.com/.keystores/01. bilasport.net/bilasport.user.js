// ==UserScript==
// @name BilaSport MLB Keystore
// @description Extract information about MLB stream
// @version 0.2.0
// @match *://bilasport.net/mlb/*
// @icon http://bilasport.net/img/e2f33d2d006318df9fb1636fd2851df6.png
// ==/UserScript==

// https://www.chromium.org/developers/design-documents/user-scripts

var payload = function(){
  if (top.location != self.location){
    top.location = self.location.href
  }
  else {
    try {
      if (window.data.source && (window.data.source.toLowerCase().indexOf('.m3u8') >= 0)) {
        let msg = ''
        msg += 'video stream:'    + "\n"
        msg += '============='    + "\n"
        msg += window.data.source + "\n\n"

        msg += 'video stream (HLS-Proxy):' + "\n"
        msg += '=========================' + "\n"
        msg += 'https://warren-bank.github.io/crx-webcast-reloaded/external_website/proxy.html#/watch/' + encodeURIComponent(encodeURIComponent( btoa(window.data.source) ))  // yes, the base64 value was url-encoded twice intentionally.. you can thank AngularJS (1.x) router

        let keystore
        try {
          keystore = XMLHttpRequest.prototype.open.toString()

          let pattern = /^.*?rewrittenU(rl\.replace\([^\)]+\)).*$/im
          if (pattern.test(keystore)) {
            keystore = keystore.replace(/[\r\n\t]/g, ' ').replace(pattern, 'u$1')
          }
        }
        catch(e) {
          keystore = ''
        }

        if (keystore) {
          msg += "\n\n"
          msg += 'keystore:' + "\n"
          msg += '=========' + "\n"
          msg += keystore
        }

        let msg_with_instructions = ''
        msg_with_instructions    += 'instructions:' + "\n"
        msg_with_instructions    += '=============' + "\n"
        msg_with_instructions    += 'the following text can be copied from the DevTools console (Ctrl+Shift+I)' + "\n\n"
        msg_with_instructions    += msg

        console.clear()
        console.log(msg)

        alert(msg_with_instructions)
      }
    }
    catch(e){}
  }
}

var inject_payload = function(){
  var inline, script, head

  inline = document.createTextNode(
    '(' + payload.toString() + ')()'
  )

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.getElementsByTagName('head')[0]
  head.appendChild(script)
}

if (document.readyState === 'complete'){
  inject_payload()
}
else {
  document.onreadystatechange = function(){
    if (document.readyState === 'complete'){
      inject_payload()
    }
  }
}