// RENDATAAN PROJEKTIT AVATESSA
var x = 1;
var active = "project" + x;
for (let [key, value] of Object.entries(env)) {
  if (key == active) {
    if (value !== "") {
      
      var createId = "#" + active;
      var startBtnId = "#start" + x;
      var stopBtnId = "#stop" + x;
      var resetBtnId = "#reset" + x;
      var tallennaBtnId = "#tallenna" + x;
      var timeId = "#time" + x;

      var row = $('<tr/>', { id : rowId,});
      var col1 = $('<td/>', { id : colId,});
      var col2 = $('<td/>', { class : "className",});
      var col3 = $('<td/>', { class : "className",});
      var startButton =  $('<button/>', { class : "btn-success btn-sm", id : "Start", });
      var stopButton =  $('<button/>', { class : "btn-warning btn-sm", id : "Stop", style : "display: none;"});
      var resetButton =  $('<button/>', { class : "btn-danger btn-sm",});
      var tallennaButton =  $('<button/>', { class : "btn-info btn-sm",});
      var span = $('<span/>', { id : timeId,});

      $(startButton).text("Aloita");
      $(stopButton).text("Tauko");
      $(resetButton).text("Reset");
      $(tallennaButton).text("Kirjaa");
      $("#projektit").append(row);
      $(row).append(col1, col2, col3);
      $(col1).text(value);
      $(col2).append(startButton, stopButton, resetButton, tallennaButton);
      $(col3).append(span);

      x++;
      active = "project" + x;
      activeBtn = "project" + x + "Btn";
    }
  }

  if (key == activeBtn) {
    alert(value);
    activeBtn = "project" + x + "Btn";
  }

}

// RENDATAAN NAPIT AVATESSA
chrome.storage.sync.get(env.project1Btn, function(result) {
  var status = Object.values(result);
  if (status == "true") { $( "#Stop" ).show(); $( "#Start" ).hide(); }
  else { $( "#Start" ).show(); $( "#Stop" ).hide(); };
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
  $('#aTime').html(msg.project1Time);
  $('#bTime').html(msg.benjaminTime);
  $('#iTime').html(msg.idaTime);

});

// TÄSSÄ ROUTATAAN FRONTIN NAPIT

// ANNA
$( "#Start, #Stop" ).click(function() {
  $( "#Start, #Stop" ).toggle();
  var value = $(this).attr("value");
  port.postMessage({msg: "StartStop", project: value});
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