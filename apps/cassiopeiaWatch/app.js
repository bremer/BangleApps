const storage = require('Storage');

require("Font6x12").add(Graphics);
require("Font8x12").add(Graphics);
require("Font7x11Numeric7Seg").add(Graphics);

function bigThenSmall(big, small, x, y) {
  g.setFont("7x11Numeric7Seg", 2);
  g.drawString(big, x, y);
  x += g.stringWidth(big);
  g.setFont("8x12");
  g.drawString(small, x, y);
}

function getBackgroundImage() {
  return require("heatshrink").decompress(atob("2GwwkEIf4A/AH4A/AH4AmkdEocQgFEoUAgM0onyAYYLBkEC+lPmAGBC4MgggEBoUEDQIGBkBWwgVEkMjiAEBocAh9CiUyAYZXCmnyiYPBC4M0oJTCKgIDBklEMwIAvig6CgEDp9EBANBBgQDCKARZBgICBAIIaBK400+lAK+EkJQZBBIoVEmUQAYZXBkVEAgP0mBXJMgMkPgYAtmiKDklAmkwgdEolCAYZXBka8BK4chmlBggPBoBXBgVEgdDV+pVBAwUj+g9BAYavHolDkCvFKoJZBCIIAudgIDBdAKnDgCVDAYSoBokgCIMgAIJTDAYcUDwQMCAFr6BkMjidPJ4UfkMTAYhXBkE0+QGEK480+DQCK976BolPj5FBdIMTSgMwAYZQCgX0p4GDKYTHCK4P0BgMkoJXwAH4A/AH4A/AH4AaogAzGrtAKwUEK/5YVK2pXfD8A3/K/4A/K9lAgEEK/BgaKwIABK+47BEbRX6HLZWCghX2SLbKBK/A6CHLJWCZjRXcSLh0cK7jpDKzIjELN5PEdLisED7RXZVwaPZoAaCEIRXyVwaxbEIhXxVwYADWTRX0V45X/K6A4FKzIeDDrRXaVwYkbV2BXJSDauxK4rnCVzgfBK15XIVzitwK5IjcK+5WdAGhXFSGRXkIv5XWAH5X/K/4A/K/5X/K/4A/K9cAAH4A/AFz/uAH4A/AH4AaoEAggEGAH5WOAAIEFAH4ANKIQAFWH5XXWH4ANoBX/K7RbGJX5XQohX/K6sEK4MELwgA/ABhXCKoJaCLwQA/AB5XBAQJD/WCcAolAV34ASKYQDEAH6wSgiu/WC6u/WC6u/WDBX/WC5B/WCxA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4ApgAA/AH4AuZ8AYXoEEHT5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K9w5YK8QDCoAhXC4NAK/AdCgEAXChuBAATSaK7Y6DEAQiUK4geCK+o9BAwbuaK+lAAoQGBgiv/K56sCDoJXYCwIBDK/4eTDARX0DYQ8BK7EAAAhX0LQZXCAwRX/V5wABKgJaDDygBCHrJXcDoYBCV/5XSAYIGCK/5XSH4o8YADRXfLASuTK/4A4K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5XmOsBX3G7BX9gEAWDxX1VwJYfK+pWCAAJX/VypYeK+hTCA"));
}

let settings = storage.readJSON("cassiopeiaWatch.settings.json", true) || {};
// let exampleSetting = settings.evamplavalue || 700;
delete settings;

// schedule a draw for the next minute
var drawTimeout;

function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}


function clearIntervals() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = undefined;
}

function drawClock() {
  g.setFont("7x11Numeric7Seg", 4);
  g.clearRect(42, 76, 171, 120);
  g.setColor(0, 255, 255);
  //g.drawRect(80, 57, 170, 96);
  g.fillRect(42, 76, 171, 120);
  g.setColor(0, 0, 0);
  g.drawString(require("locale").time(new Date(), 1), 42, 76);
}

function drawDate() {
  g.setFont("8x12", 2);
  g.drawString(require("locale").dow(new Date(), 2).toUpperCase(), 18, 126);
  g.setFont("8x12");
  g.drawString(require("locale").month(new Date(), 2).toUpperCase(), 43, 160);
  g.setFont("8x12", 2);
  const time = new Date().getDate();
  g.drawString(time < 10 ? "0" + time : time, 18, 150);
}

function drawBattery() {
  bigThenSmall(E.getBattery(), "%", 135, 21);
}

function getTemperature() {
  try {
    var weatherJson = storage.readJSON('weather.json');
    var weather = weatherJson.weather;
    return Math.round(weather.temp - 273.15);
  } catch (ex) {
    print(ex);
    return "?";
  }
}

function getSteps() {
  return Bangle.getHealthStatus("day").steps;
}


function draw() {
  queueDraw();

  g.clear(1);
  g.setColor(0, 255, 255);
  g.fillRect(0, 0, g.getWidth(), g.getHeight());
  let background = getBackgroundImage();
  g.drawImage(background, 0, 0, { scale: 1 });
  g.setColor(0, 0, 0);

  g.setFontAlign(0, -1);
  g.setFont("8x12", 2);
  g.drawString(getTemperature(), 155, 132);
  g.drawString(Math.round(Bangle.getHealthStatus("last").bpm), 50, 55);

  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(-1, -1);
  g.drawString(getSteps(), 20, 21);

  g.setFontAlign(-1, -1);
  drawClock();
  drawDate();
  drawBattery();
}

Bangle.on("lcdPower", (on) => {
  if (on) {
    draw();
  } else {
    clearIntervals();
  }
});


Bangle.on("lock", (locked) => {
  clearIntervals();
  draw();
  if (!locked) {
    // do something if not locked
  }
});

Bangle.setUI("clock");

// Load widgets, but don't show them
Bangle.loadWidgets();
require("widget_utils").swipeOn(); // hide widgets, make them visible with a swipe
g.clear(1);
draw();