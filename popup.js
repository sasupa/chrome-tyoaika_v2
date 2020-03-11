// RENDATAAN NAPIT AVATESSA
chrome.storage.sync.get('annaBtn', function(result) {
  if (result.annaBtn == true) { $( "#aStop" ).show(); $( "#aStart" ).hide(); }
  else { $( "#aStart" ).show(); $( "#aStop" ).hide(); }
});
chrome.storage.sync.get('benjaminBtn', function(result) {
  if (result.benjaminBtn == true) { $( "#bStop" ).show(); $( "#bStart" ).hide(); }
  else { $( "#bStart" ).show(); $( "#bStop" ).hide(); }
});
chrome.storage.sync.get('idaBtn', function(result) {
  if (result.idaBtn == true) { $( "#iStop" ).show(); $( "#iStart" ).hide(); }
  else { $( "#iStart" ).show(); $( "#iStop" ).hide(); }
});

// AVATAAN KOMMUNIKAATIO BACKGROUND.JS KANSSA
var port = chrome.runtime.connect({name: "refresh"});
var refresh = setInterval(function () {
  port.postMessage({msg: "Times"})
}, 1000);
port.onMessage.addListener(function(msg) {

  // TÄSSÄ OTETAAN VASTAAN JA RENDATAAN AIKA BACKGROUND.JS:STÄ
  $('#aTime').html(msg.annaTime);
  $('#bTime').html(msg.benjaminTime);
  $('#iTime').html(msg.idaTime);

});

// TÄSSÄ ROUTATAAN FRONTIN NAPIT

// ANNA
$( "#aStart, #aStop" ).click(function() {
  $( "#aStart, #aStop" ).toggle();
  port.postMessage({msg: "aStartStop"});
});

$( "#aReset" ).click(function() {
  var resetOK = confirm("Haluatko varmasti tyhjentää laskurin tallentamatta?");
      if (resetOK) {
        $( "#aStart" ).show(); $( "#aStop" ).hide();
        port.postMessage({ msg: "aReset" });
      };
});

$( "#aTallenna" ).click(function() {
  var tyo = prompt("Mitä teit?");
    if (tyo !== null) { 
      $( "#aStart" ).show(); $( "#aStop" ).hide();
      port.postMessage({msg: "aTallenna", kuvaus: tyo });
    };
});


// BENJAMIN
$( "#bStart, #bStop" ).click(function() {
  $( "#bStart, #bStop" ).toggle();
  port.postMessage({msg: "bStartStop"})
});

$( "#bReset" ).click(function() {
  var resetOK = confirm("Haluatko varmasti tyhjentää laskurin tallentamatta?");
      if (resetOK) {
        $( "#bStart" ).show(); $( "#bStop" ).hide();
        port.postMessage({ msg: "bReset" });
      };
});

$( "#bTallenna" ).click(function() {
  var tyo = prompt("Mitä teit?");
    if (tyo !== null) {
      $( "#bStart" ).show(); $( "#bStop" ).hide();
      port.postMessage({ msg: "bTallenna", kuvaus: tyo });
    };
});

// IDA
$( "#iStart, #iStop" ).click(function() {
  $( "#iStart, #iStop" ).toggle();
  port.postMessage({msg: "iStartStop"})
});

$( "#iReset" ).click(function() {
  var resetOK = confirm("Haluatko varmasti tyhjentää laskurin tallentamatta?");
      if (resetOK) {
        $( "#iStart" ).show(); $( "#iStop" ).hide();
        port.postMessage({ msg: "iReset" });
      };
});

$( "#iTallenna" ).click(function() {
  var tyo = prompt("Mitä teit?");
    if (tyo !== null) {
      $( "#iStart" ).show(); $( "#iStop" ).hide();
      port.postMessage({ msg: "iTallenna", kuvaus: tyo });
    };
});