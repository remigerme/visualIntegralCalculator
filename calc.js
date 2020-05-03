function validate() {
    if(parseFloat(document.getElementById("a").value)) {
        aLim = parseFloat(document.getElementById("a").value);
    }
    if(parseFloat(document.getElementById("b").value)) {
        bLim = parseFloat(document.getElementById("b").value);
    }
    if(document.getElementById("input_function").value) {
        var rawFunction = document.getElementById("input_function").value;
        // BIG BRAIN time
        func = rawFunction.replace("^", "**");
        func = func.replace("cos", "Math.cos");
        func = func.replace("sin", "Math.sin");
        func = func.replace("tan", "Math.tan");
        func = func.replace("pi", "Math.PI");
        func = func.replace("e", "Math.exp");
        func = func.replace("ln", "Math.log");
        func = func.replace("sqrt", "Math.sqrt");
    }
    currentIteration = MIN_ITERATION - 1;
    nextIteration()
    return;
    }

function f(x) {
    var toEval = "";
    var previousCharacter = "";
    for(const char of func) {
        if(char == "x" && previousCharacter != "e") {
            toEval += x;
        } else {
            toEval += char;
        }
        previousCharacter = char;
    }
    return eval(toEval);
}

function previousIteration() {
    if (currentIteration > MIN_ITERATION) {
        currentIteration--;
        showGraph(calcData(currentIteration, aLim, bLim));
        document.getElementById("iteration").innerHTML = currentIteration;
        return true;
    }
    return false;
}

function nextIteration() {
    currentIteration++;
    showGraph(calcData(currentIteration, aLim, bLim));
    document.getElementById("iteration").innerHTML = currentIteration;
    return true;
}

function reset() {
    isAnimationRunning = false;
    currentIteration = MIN_ITERATION - 1;
    nextIteration();
    return;
}

function startAnimation() {
    isAnimationRunning = true;
    animation();
    return;
}

function stopAnimation() {
    isAnimationRunning = false;
    return;
}

function animation() {
    if(currentIteration < MAX_ITERATION && isAnimationRunning) {
        nextIteration();
        setTimeout(() => {animation();}, 500);
    }
    return;
}

function calcData(currentIteration, a, b) {
    var nbOfShape = Math.pow(2, currentIteration);
    var widthOfShape = (b - a) / nbOfShape;
    var lineLabels = [];
    var lineData = [];
    for(var i = a; i < b; i += 0.001) {
        lineLabels.push(Math.round(i * 100) / 100);
        lineData.push(Math.round(f(i) * 100) / 100);
    }
    var barLabels = [];
    var barData = [];
    var width = []; // because there is no list comprehension
    var area = 0;
    for(var i = 0; i < nbOfShape; i++) {
        var x = widthOfShape * (i + 0.5) + a;
        var y = Math.round(f(x) * 100) / 100;
        barLabels.push(x);
        barData.push(y);
        width.push(widthOfShape);
        area += widthOfShape * y;
    }
    data = {
        line: {
            labels: lineLabels,
            data: lineData
        },
        bar: {
            labels: barLabels,
            data: barData,
            width: width
        },
        area: area
    };
    document.getElementById("area").innerHTML = Math.round(area * 10000) / 10000;
    return data;
}

function showGraph(data) {
    var chart = document.getElementById("chart");
    Plotly.newPlot(chart, [{
        x: data["line"]["labels"],
        y: data["line"]["data"],
        mode: "lines"
    }, {
        type: "bar",
        x: data["bar"]["labels"],
        y: data["bar"]["data"],
        width: data["bar"]["width"]
    }], {
        margin: {
            t: 0
        },
        showlegend: false,
    }, {
        displayModeBar: false
    });
}

var MIN_ITERATION = 2;
var MAX_ITERATION = 13;
var isAnimationRunning = false;
var func = "4 * x ** 2";
var aLim = 0;
var bLim = 7;
var currentIteration = MIN_ITERATION;
document.getElementById("iteration").innerHTML = currentIteration;
showGraph(calcData(currentIteration, aLim, bLim));