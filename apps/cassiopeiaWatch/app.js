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
  return require("heatshrink").decompress(atob("2GwwkEIf4A/AH4A/AH4AmkdEocQgFEoUAgM0onyAYYLBkEC+lPmAGBC4MgggEBoUEDQIGBkBWwgVEkMjiAEBocAh9CiUyAYZXCmnyiYPBC4M0oJTCKgIDBklEMwIAvig6CgEDp9EBANBBgQDCKARZBgICBAIIaBK400+lAK+EkJQZBBIoVEmUQAYZXBkVEAgP0mBXJMgMkPgYAtmiKDklAmkwgdEolCAYZXBka8BK4chmlBggPBoBXBgVEgdDV+pVBAwUj+g9BAYavHolDkCvFKoJZBCIIAudgIDBdAKnDgCVDAYSoBokgCIMgAIJTDAYcUDwQMCAFr6BkMjidPJ4UfkMTAYhXBkE0+QGEK480+DQCK976BolPj5FBdIMTSgMwAYZQCgX0p4GDKYTHCK4P0BgMkoJXwAH4A/AH4A/AH4AaogAzGrtAKwUEK/5YVK2pXfD8A3/K/4A/K/5XoMH5XWoBXZDQMEAgxXygBXYKIIbCAghXyGzQaCAAqwsJwqOCGrBXIWFgsFRrRyCK/A7DEC4bDLYxXwGjZzEK+o6DghXaDYICBaTZXXRoo2XK4RVBLQR6ZK6yKDAAY3ZK4ICBKlavNHS7KDPYRZtfoqyDG7AcCAYhXyVwYjaOYKuvK5I3aZoauuK4o4DEjiuwK5A3cD75XaErwfeK6w2goBWvK4zlvK85F/K6wA/K/5X/AH5X/K/5X/AH5XrgAA/AH4Auf9wA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AEEAAH4A/AFzNeDTNAgg6dK/5X/K/5XSgBeTK8CTaDYpWBgBDSK8VAK7lAK7QDCDwI5UGoY2TK5o4TGgYYCHqxXEHChXHDyxXCDIgBDAGAyCPAaRTK4gcBAwav4HChQBoAFCAwMEDyyNBAIRXZghACIIY4RVgQfBK7JZCZSpXFDQY/BLYRXucwTpWK5IfBK6YaCLYJX4EYpXULQZXCAwRXSCwVAH4xXXO4SvVC4Q7CK6qviK64fDAIRX7dCYECAYIGCK6gAdJ4h6CHKRNGS4ZWwK5DoTNYwdBV2JXEIAI5UfuRXOc6pX/K/5XYACxX/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5X/K/5XtOrxX5HLRX7gEADzpX2VwJYdK+5WCAAJX/VypYcK+xTCA"));
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
  g.clearRect(25, 65, 171, 120);
  g.setColor(0, 255, 255);
  g.fillRect(25, 65, 171, 120);
  g.setColor(0, 0, 0);
  g.drawString(require("locale").time(new Date(), 1), 25, 65);
}

function drawDate() {
  g.setFont("8x12", 2);
  g.drawString(require("locale").dow(new Date(), 2).toUpperCase(), 18, 126);
  g.setFont("8x12");
  g.drawString(require("locale").month(new Date(), 2).toUpperCase(), 1, 152);
  g.setFont("7x11Numeric7Seg", 2);
  const time = new Date().getDate();
  g.drawString(time < 10 ? "0" + time : time, 30, 150);
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
  g.setFont("7x11Numeric7Seg", 2);
  g.drawString(getTemperature(), 150, 130);

  // TODO info line
  g.setFont("7x11Numeric7Seg", 2);
  g.drawString(Math.round(Bangle.getHealthStatus("last").bpm), 35, 21);

  g.setFont("7x11Numeric7Seg", 2);
  g.setFontAlign(-1, -1);
  g.drawString(getSteps(), 65, 150);

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
