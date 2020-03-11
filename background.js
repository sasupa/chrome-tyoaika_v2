function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

class Timer {
  constructor(name, init, outInit, key) {
      this.name = name;
      this.x = init;
      this.startstop = init;
      this.sec = init;
      this.min = init;
      this.hour = init;
      this.secOut = outInit;
      this.minOut = outInit;
      this.hourOut = outInit;
      this.key = key;
  }

  timer() {
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);
    this.sec++;
    
    if (this.sec == 60) {
      this.min++;
      this.sec = 0;
    }
  
    if (this.min == 60) {
      this.min = 0;
      this.hour++;
    }

    // TÄSSÄ REMINDERIN AJAN SÄÄTÖ
    if (this.min == 15) {
      clearInterval(this.x);
      var muikkari = confirm("Teetkö edelleen " + this.name + "?");
      if (muikkari) {
        this.start();
      } else {
        this.stop();
      }
    }

  }

  start() { /* Start */
    this.x = setInterval(this.timer.bind(this), 1000);
  };

  stop() { /* Stop */
    clearInterval(this.x);
  };

  reset() { /* Stop */
    clearInterval(this.x);
    this.startstop = 0;
    this.sec = 0;
    this.min = 0;
    this.hour = 0;
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);
    chrome.storage.sync.set({[this.key]: false});
  };

  tallenna(tyo) { /* Tallenna */

    clearInterval(this.x);
    this.startstop = 0;
    var d = new Date();
    var month = d.getMonth();
    var date = d.getDate() + "." + (month + 1) + "." + d.getUTCFullYear();
    var nyt = { tunnit: d.getHours(), minuutit: d.getMinutes() };
    var alkuMinuutit = (nyt.minuutit - this.min);
    var loppuMinuutit = nyt.minuutit;
    var alkuMinuutitOut = checkTime(alkuMinuutit);
    var loppuMinuutitOut = checkTime(loppuMinuutit);
    var alku = (nyt.tunnit - this.hour) + ":" + alkuMinuutitOut;
    var aika = this.hourOut + ":" + this.minOut + ":" + this.secOut;
    var loppu = nyt.tunnit + ":" + loppuMinuutitOut;
    var klo = alku + "-" + loppu;

    $.post(env.url, { name : env.user, kuva : tyo, asiakas : this.name, pvm : date, aika : aika, klo : klo }, 
      function(returnedData) {
        var obj = JSON.parse(returnedData);
        console.log(obj.message);
    });

    this.sec = 0;
    this.min = 0;
    this.hour = 0;
    this.secOut = checkTime(this.sec);
    this.minOut = checkTime(this.min);
    this.hourOut = checkTime(this.hour);

    alert(this.name + ' laskuri nollattu ja tiedot lähetetty seurantaan!');
    chrome.storage.sync.set({[this.key]: false});

  }

  counter() { /* Toggle StartStop */
    this.startstop = this.startstop + 1;
  
    if (this.startstop === 1) {
      this.start();
      chrome.storage.sync.set({[this.key]: true});
    } else if (this.startstop === 2) {
      this.startstop = 0;
      this.stop();
      chrome.storage.sync.set({[this.key]: false});
    }
  }

}


// TÄSSÄ TEHDÄÄN ASIAKKAAN LASKURI
const anna = new Timer(env.client1, 0, '00', "annaBtn");
chrome.storage.sync.set({"annaBtn": false});
const benjamin = new Timer(env.client2, 0, '00', "benjaminBtn");
chrome.storage.sync.set({"benjaminBtn": false});
const ida = new Timer(env.client3, 0, '00', "idaBtn");
chrome.storage.sync.set({"idaBtn": false});


// TÄSSÄ API
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "refresh");
  port.onMessage.addListener(function(e) {

    if (e.msg == "Times") {
      // MUOTOILLAAN FRONTTIIN LÄHETETTÄVÄ AIKA
      var annaCurrent = anna.hourOut + ":" + anna.minOut + ":" + anna.secOut;
      var benjaminCurrent = benjamin.hourOut + ":" + benjamin.minOut + ":" + benjamin.secOut;
      var idaCurrent = ida.hourOut + ":" + ida.minOut + ":" + ida.secOut;

      // LÄHETETÄÄN AIKA
      port.postMessage({
      annaTime: annaCurrent,
      benjaminTime: benjaminCurrent,
      idaTime: idaCurrent

      });

      // ANNAN ROUTERIT
    } else if (e.msg == "aStartStop") {
      anna.counter();

    } else if (e.msg == "aReset") {
      anna.reset();
    
    } else if (e.msg == "aTallenna") {
      anna.tallenna(e.kuvaus);


      // BENJAMININ ROUTERIT
    } else if (e.msg == "bStartStop") {
      benjamin.counter();
    
    } else if (e.msg == "bReset") {
      benjamin.reset();
    
    } else if (e.msg == "bTallenna") {
      benjamin.tallenna(e.kuvaus);


      // IDAN ROUTERIT
    } else if (e.msg == "iStartStop") {
      ida.counter();
    
    } else if (e.msg == "iReset") {
      ida.reset();
    
    } else if (e.msg == "iTallenna") {
      ida.tallenna(e.kuvaus);


      // JOS JOKU ON RIKKI
    } else {
      alert("En osaa tulkita tätä, kokeile uudelleen")
    }
  });
});