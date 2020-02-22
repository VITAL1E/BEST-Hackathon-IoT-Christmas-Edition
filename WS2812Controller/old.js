/*******************************
    Dance
*******************************/
app.get("/dance", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("Switching to dance.");
    if ($app.Mode != MODES.DANCE) GoDance();
});

app.post('/dancespeed', function (request, response) {
    res.header("Access-Control-Allow-Origin", "*");
    if (request && request.body && request.body.speed) {

        var val = parseInt(request.body.speed);
        var mappedVal = map_range(val, 0, 100, 50, 5);
        if (typeof mappedVal === "number") {
            DanceSpeed = mappedVal;
        } else {
            DanceSpeed = 1000 / 30;
        }
    }
    response.send("DanceSpeed rsp: " + DanceSpeed);
});

/*******************************
    Twinkle
*******************************/
app.get("/twinkle", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("Switching to twinkle.");
    if ($app.Mode != MODES.TWINKLE) GoTwinkle();
});



/*******************************
    Dance
*******************************/

function GoDance() {
    $app.Mode = MODES.DANCE;
    DanceTick();
}

var DanceSpeed = 10;
function DanceTick() {
    // colorWipe( 0xff3b00 , DanceSpeed); // Red
    // theaterChase( 0xf8f9de , DanceSpeed); // White
    // colorWipe( 0x0043ff , DanceSpeed); // Blue
    // colorWipe( 0x1eff0a , DanceSpeed); // Green
    // theaterChase( 0xff3b00 , DanceSpeed); // Red
    // theaterChase( 0x0043ff , DanceSpeed); // Blue\

    rainbowCycle(0, rainbowCycle);


    setTimeout(function () {
        if (IsDancing()) {
            // DanceTick();
        }
    }, 10);

}

var rainbowCycleI, rainbowCycleJ = 0;
function rainbowCycle(wait, cb) {

    if (rainbowCycleJ < 256 * 5) {
        if (rainbowCycleI < NUM_LEDS) {
            $app.Lights[rainbowCycleI] = Wheel(((rainbowCycleI * 256 / NUM_LEDS) + rainbowCycleJ) & 255);
            rainbowCycleI++;
            setTimeout(function () {
                if (IsDancing()) {
                    rainbowCycle(wait, cb);
                }
            }, wait);
            StripRender();

        } else {
            StripRender();
            rainbowCycleI = 0;
            rainbowCycleJ++;

            setTimeout(function () {
                if (IsDancing()) {
                    rainbowCycle(wait, cb);
                }
            }, wait);

        }
    } else {
        rainbowCycleI = 0;
        rainbowCycleJ = 0;
        if (cb) cb(wait, cb);
    }

}

function IsDancing() {
    return $app.Mode == MODES.DANCE;
}



/*******************************
    Twinkle
*******************************/
var WasTwinkling = false;
var TwinkleSpeed = 500;
function GoTwinkle() {
    $app.Mode = MODES.TWINKLE;
    WasTwinkling = false;
    TwinkleTick();
}

var LastStates = [];

function GetNextColor(col, rand) {
    var ind = TwinkleColors.indexOf(col);
    if (ind == TwinkleColors.length + 1) {
        // choose the first
        return TwinkleColors[0];
    } else {
        // choose the next
        return TwinkleColors[ind + 1];
    }
}

// = [ , 0xeaeaea, 0xd8d6d6, 0xbfbfbf, 0xa8a8a8, 0xE1E2DC, 0xc1c1bf, 0xa5a5a4, 0x898988, 0x616a5d  ];
var TwinkleColors = [0xffffff, 0xFCFCFC, 0xFAFAFA, 0xF7F7F7, 0xF5F5F5, 0xF2F2F2, 0xF0F0F0, 0xEDEDED, 0xEBEBEB, 0xE8E8E8, 0xE5E5E5, 0xE3E3E3, 0xE0E0E0, 0xDEDEDE, 0xDBDBDB, 0xD9D9D9, 0xD6D6D6, 0xD4D4D4, 0xD1D1D1, 0xCFCFCF, 0xCCCCCC, 0xC9C9C9, 0xC7C7C7, 0xC4C4C4, 0xC2C2C2, 0xBFBFBF, 0xBDBDBD, 0xBABABA, 0xB8B8B8, 0xB5B5B5, 0xB3B3B3, 0xB0B0B0];

function TwinkleTick() {
    if (!WasTwinkling) {
        for (var x = 0; x < NUM_LEDS; x++) {
            // choose a random init point
            var init = getRandomInt(0, TwinkleColors.length - 1);
            LastStates[x] = TwinkleColors[init]; // deafult white color
            $app.Lights[x] = LastStates[x];
        }
        StripRender();
        WasTwinkling = true;
    } else {

        for (var x = 0; x < NUM_LEDS; x++) {
            var shouldTwinkle = getRandomInt(0, 100);
            if (shouldTwinkle > 10) {
                // only a 50% chance of twinkling
                var currentColor = LastStates[x];
                var newColor = GetNextColor(currentColor);
                LastStates[x] = newColor;
                $app.Lights[x] = LastStates[x];
            }
        }
        StripRender();
    }
    // dark color 616a5d

    // lightest color 0xE1E2DC

    setTimeout(function () {
        if ($app.Mode == MODES.TWINKLE) {
            TwinkleTick();
        }
    }, TwinkleSpeed);
}