var sizeWidth   = 1920//6142;
var sizeHeight  = 1080//3425;

var gl;
var c;

var viewportData;

// Global uniforms
var timeLocation, viewportLocation, coloursLocation, colourPositionsLocation, linePositionLocation;
var oldColours;
var newColours = JSON.parse(JSON.stringify(myColours));
var newStops = JSON.parse(JSON.stringify(myStops));
var newDream = 0;
var colIdx;
var cTotal = 10;
var dataSource = [];

window.onload = loadShaders;

// Time vars
var startTime = new Date();
var elapsedTime;
var nowtime;

var shaderText = {};
var nColours = myColours.length;
var colourPositions;
var stopN = 0
var linePosition = myStops[0];
var lineDisplace = [0, 0];

var locationData = [{"location_str":"Paris","display_name":"Paris, France","timezone_str":"Europe\/Paris","lat":"48.855678","long":"2.390689","latest_json":{"blueness":0.00234375,"dreaminess":1,"coordinates":[[112,362],[204,199],[169,336],[674,559],[418,284],[687,57],[549,7],[136,337],[758,39],[654,135]],"colours":[[75,98,140],[99,56,249],[93,104,150],[0,256,158],[78,101,145],[77,110,256],[16,25,68],[156,0,92],[97,109,151],[256,0,196]],"brightness":0.00234375,"dimensions":[800,600]}},
{"location_str":"Sydney","display_name":"Sydney, Australia","timezone_str":"Australia\/Sydney","lat":"-33.851662","long":"151.285849","latest_json":{"colours": [[170, 179, 196], [46, 53, 63], [200, 179, 152], [43, 53, 65], [193, 203, 215], [167, 163, 160], [81, 88, 104], [47, 50, 57], [181, 182, 186], [212, 216, 227]], "dimensions": [5312, 2988], "coordinates": [[2367, 139], [362, 1836], [3358, 1485], [678, 1727], [1603, 416], [4863, 1055], [3010, 214], [4265, 2566], [1351, 930], [2188, 567]], "imageFile": "20200317_065848.jpg", "blueness": 0.556640625, "brightness": 0.537890625, "dreaminess": 0.0}}];

var storedData = [
  {"colours": [[170, 179, 196], [46, 53, 63], [200, 179, 152], [43, 53, 65], [193, 203, 215], [167, 163, 160], [81, 88, 104], [47, 50, 57], [181, 182, 186], [212, 216, 227]], "dimensions": [5312, 2988], "coordinates": [[2367, 139], [362, 1836], [3358, 1485], [678, 1727], [1603, 416], [4863, 1055], [3010, 214], [4265, 2566], [1351, 930], [2188, 567]], "imageFile": "20200317_065848.jpg", "blueness": 0.556640625, "brightness": 0.537890625, "dreaminess": 0.0},
  {"colours": [[59, 70, 88], [218, 217, 213], [28, 34, 46], [96, 88, 85], [41, 49, 60], [84, 73, 71], [185, 207, 220], [238, 208, 148], [221, 221, 213], [208, 208, 200]], "dreaminess": 0.0, "blueness": 0.525, "coordinates": [[860, 939], [4165, 591], [218, 2178], [4276, 2663], [1632, 2636], [5052, 2244], [1750, 240], [4617, 1698], [3853, 967], [4829, 1009]], "imageFile": "20200317_071644.jpg", "brightness": 0.5334635416666667, "dimensions": [5312, 2988]},
  {"colours": [[93, 97, 98], [131, 133, 130], [127, 127, 129], [133, 136, 129], [157, 158, 153], [123, 125, 124], [126, 128, 125], [169, 167, 170], [125, 129, 128], [82, 86, 85]], "dreaminess": 0.0, "coordinates": [[649, 571], [484, 88], [758, 224], [311, 293], [499, 238], [676, 184], [509, 80], [794, 112], [623, 143], [117, 351]], "blueness": 0.496484375, "dimensions": [800, 600], "brightness": 0.49778645833333335},
  {"imageFile": "20200317_071905.jpg", "dreaminess": 0.47829861111111116, "coordinates": [[2221, 675], [1458, 2574], [4567, 1924], [1899, 360], [5283, 1790], [2180, 2975], [4746, 824], [64, 636], [1693, 1689], [2019, 6]], "dimensions": [5312, 2988], "brightness": 0.2565104166666667, "colours": [[221, 216, 210], [0, 256, 138], [41, 45, 44], [256, 0, 140], [165, 117, 69], [55, 59, 62], [67, 60, 67], [44, 47, 56], [137, 94, 60], [44, 56, 72]], "blueness": 0.241796875},
  {"dimensions": [800, 600], "coordinates": [[61, 494], [672, 420], [183, 192], [356, 432], [352, 379], [782, 71], [44, 13], [4, 367], [51, 411], [654, 14]], "blueness": 0.09453125, "brightness": 0.15950520833333334, "colours": [[121, 0, 256], [248, 185, 154], [108, 0, 256], [191, 127, 91], [256, 0, 164], [95, 32, 23], [140, 256, 0], [2, 0, 1], [0, 1, 5],[125, 72, 82]], "dreaminess": 0.8016493055555556},
  {"coordinates": [[890, 1209], [5229, 949], [653, 1530], [4899, 875], [4085, 1918], [209, 219], [2810, 1895], [4214, 445], [2246, 2486], [3611, 326]], "dreaminess": 0.0, "imageFile": "20200317_071857.jpg", "blueness": 0.4171875, "brightness": 0.4217447916666667, "dimensions": [5312, 2988], "colours": [[59, 70, 88], [110, 110, 108], [34, 45, 63], [123, 105, 85], [98, 87, 81], [99, 125, 148], [81, 79, 82], [209, 191, 167], [38, 48, 57], [238, 222, 189]]},
  {"blueness": 0.362890625, "brightness": 0.324609375, "dreaminess": 0.2513020833333335, "colours": [[124, 67, 60], [0, 256, 30], [2, 0, 109], [64, 52, 56], [0, 0, 129], [144, 129, 110], [111, 106, 103], [107, 103, 100], [87, 73, 72], [141, 126, 107]], "coordinates": [[44, 447], [369, 537], [87, 546], [4, 413], [12, 538], [362, 407], [796, 141], [775, 169], [49, 305], [352, 425]], "dimensions": [800, 600]},
  {"colours": [[201, 197, 196], [82, 81, 79], [1, 6, 0], [21, 23, 22], [153, 156, 165], [123, 126, 143], [137, 140, 155], [30, 37, 30], [134, 117, 97], [75, 74, 72]], "imageFile": "20200317_064910.jpg", "coordinates": [[1505, 1088], [3073, 2791], [5091, 2725], [4809, 2828], [1047, 2896], [497, 2225], [668, 1175], [4461, 1556], [2734, 931], [3393, 2145]], "dimensions": [5312, 2988], "brightness": 0.37408854166666666, "blueness": 0.374609375, "dreaminess": 0.08637152777777801},
  {"brightness": 0.001953125, "blueness": 0.001953125, "dreaminess": 1.0, "coordinates": [[510, 469], [66, 156], [223, 44], [731, 384], [212, 336], [640, 207], [33, 380], [775, 569], [261, 204], [470, 146]], "dimensions": [800, 600], "colours": [[158, 154, 151],[140, 142, 141], [256, 135, 0], [120, 119, 117],  [85, 0, 256], [256, 0, 162], [85, 78, 86], [256, 0, 83], [152, 148, 147], [256, 19, 0]]},
  {"brightness": 0.5614583333333333, "dreaminess": 0.0, "coordinates": [[4159, 211], [1321, 2620], [3453, 2834], [12, 2541], [683, 2488], [136, 1729], [1017, 171], [1604, 2179], [706, 331], [2071, 645]], "blueness": 0.579296875, "imageFile": "20200317_065837.jpg", "colours": [[231, 228, 221], [80, 88, 99], [82, 91, 100], [80, 90, 102], [78, 90, 104], [101, 113, 129], [216, 213, 208], [86, 95, 110], [212, 209, 202], [227, 219, 208]], "dimensions": [5312, 2988]},
  {"brightness": 0.4513020833333333, "blueness": 0.448046875, "coordinates": [[369, 481], [69, 280], [751, 55], [18, 424], [369, 89], [310, 174], [422, 546], [55, 123], [677, 273], [321, 154]], "dreaminess": 0.0, "dimensions": [800, 600], "colours": [[124, 131, 124], [120, 122, 119], [70, 67, 74], [108, 112, 111], [130, 132, 127], [153, 152, 147], [97, 106, 103], [107, 107, 107], [97, 97, 97], [143, 144, 138]]},
  {"dimensions": [800, 600], "coordinates": [[516, 171], [647, 169], [253, 421], [495, 58], [164, 251], [602, 12], [205, 379], [267, 266], [641, 568], [455, 64]], "dreaminess": 0.0, "blueness": 0.503515625, "colours": [[85, 98, 114], [93, 98, 117], [124, 138, 151], [55, 64, 95], [86, 97, 115], [83, 82, 100], [118, 132, 145], [96, 108, 124], [244, 236, 233], [54, 68, 95]], "brightness": 0.44895833333333335},
  {"coordinates": [[2, 573], [736, 380], [81, 120], [320, 508], [21, 359], [355, 564], [16, 132], [121, 184], [783, 526], [774, 175]], "brightness": 0.33932291666666664, "blueness": 0.41953125, "colours": [[104, 121, 137], [256, 0, 167],[143, 148, 151], [9, 28, 68], [60, 79, 96], [1, 15, 52], [12, 34, 75], [255, 255, 253], [45, 59, 88],  [23, 30, 74]], "dimensions": [800, 600], "dreaminess": 0.20225694444444464},
  {"colours": [[106, 94, 130], [256, 0, 136], [84, 72, 112], [256, 192, 0], [127, 116, 158], [219, 256, 0], [101, 98, 143], [0, 256, 101], [108, 101, 145], [256, 0, 240]], "dreaminess": 1.0, "blueness": 0.000390625, "coordinates": [[292, 347], [609, 322], [216, 424], [754, 227], [511, 100], [791, 76], [309, 520], [432, 106], [98, 173], [628, 186]], "dimensions": [800, 600], "brightness": 0.000390625}
]

let cLoop = {
  'start': new Date().getTime(),
  'duration': 3000,
  'idx': 0,
  'mode': "searching",
};

function sum(arr) {
    return arr.reduce((a,b) => a + b, 0);
  }

//since we use "defer" on the script, we know the DOM has loaded
updateColours(myColours, myColours.length);

// function getLatestJson(n){
//     var http = new XMLHttpRequest();
//     // var token = document.querySelector('meta[name="csrf-token"]').content;
//     var url = "http://celeste.solimanlopez.com/api/latestJson";
    
//     http.open("GET", url, true);

//     //Send the proper header information along with the request
//     // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     http.setRequestHeader('App-Key', token);
//     http.setRequestHeader('Location', locationData[n]['location_str']);

//     http.onreadystatechange = function() {
//         // State 4 is completed
//         if(http.readyState == 4 && http.status == 200 ) {
//             locationData[n]['latest_json'] = JSON.parse(http.responseText);
//             updatePage(n+1);
//         }
//     }
//     http.send();
// }

var si = 0;
function getLatestJson(n) {
  locationData[n].latest_json = storedData[si];
  si = (si + 1) % storedData.length;
  updatePage(n+1);
}

function updatePage(n){
  let l = locationData.length;
  if (n<l){
    getLatestJson(n);
  } else {
    for (let i=0; i<cTotal/l; i++){
      for (let loc=0; loc<l; loc++){
        // alternate colours and coordinates from available locations
        let data = locationData[loc].latest_json;
        newColours[i*l+loc] = data.colours[i];
        let v = data.coordinates[i];
        newStops[i*l+loc] = [0.2 + 0.6*v[0]/data.dimensions[0], 0.2 + 0.6*v[1]/data.dimensions[1]];
        dataSource[i*l+loc] = loc;
      }
    }
    newColours.sort((a,b) => sum(a) -  sum(b));
    newDream = locationData.reduce((total, dat, idx, arr) => total + dat.latest_json.dreaminess/arr.length, 0);
    $('#dreaming').text(Math.round(newDream*100)+'%');
    $('#realLight').text(Math.round((1-newDream)*100)+'%');
  }
}

updatePage(0);
setInterval(updatePage, 60000, 0);

class Perlin {
  constructor() {
      // Quick and dirty permutation table
      this.perm = (() => {
          const tmp = Array.from({length: 256}, () => Math.floor(Math.random() * 256));
          return tmp.concat(tmp);
      })();
  }

  grad(i, x) {
      const h = i & 0xf;
      const grad = 1 + (h & 7);

      if ((h & 8) !== 0) {
          return -grad * x;
      }

      return grad * x;
  }

  getValue(x) {
      const i0 = Math.floor(x);
      const i1 = i0 + 1;

      const x0 = x - i0;
      const x1 = x0 - 1;

      let t0 = 1 - x0 * x0;
      t0 *= t0;

      let t1 = 1 - x1 * x1;
      t1 *= t1;

      const n0 = t0 * t0 * this.grad(this.perm[i0 & 0xff], x0);
      const n1 = t1 * t1 * this.grad(this.perm[i1 & 0xff], x1);

      return 0.395 * (n0 + n1); //Output is between -1 and 1.
  }
}

const noise = new Perlin();

let noiseIdx = 0;

function randomizeColours() {
  let displayColours = [];
  let loopIdx = (cLoop.idx + 1) % cTotal;
  myColours.forEach((colour, i) => {
    if (i > loopIdx){//} || (i == loopIdx && cLoop.mode == "searching")) {
      displayColours.push([
        Math.floor((noise.getValue((noiseIdx + i * 10) * 0.03) + 1) * 255 / 2),
        Math.floor((noise.getValue((noiseIdx + i * 100) * 0.03) + 1) * 255 / 2),
        Math.floor((noise.getValue((noiseIdx + i * 400) * 0.03) + 1) * 255 / 2),
      ])
    } else {
      displayColours.push(myColours[i]);
    }
  });
  let x = 0.6 * (noise.getValue((noiseIdx * 20) * 0.0002) + 1) / 2;
  let y = 0.6 * (noise.getValue((noiseIdx * 220) * 0.0002) + 1) / 2;
  lineDisplace = [x, y];
  noiseIdx++;
  updateColours(displayColours, nColours);
}

function updateColours(colours, maxColours) {

  function fmt(num) {
    return num.toString().padStart(3, '0')
  }
  
  function colPct(num) {
    return Math.floor(100*num/255)
  }

  colours.forEach((colour, i) => {
    $('#colour-vals-'+i).text("R:"+fmt(colour[0])+"/G:"+fmt(colour[1])+"/B:"+fmt(colour[2]));
    $('#colour-box-R-'+i).css(
      "background-image", 
      "linear-gradient(to top, rgba(255,0,0,1), rgba(255,0,0,1) "+ (colPct(colour[0])-5) +"%, rgba(0,0,0,0) "+colPct(colour[0])+"%)"
    );
    $('#colour-box-G-'+i).css(
      "background-image", 
      "linear-gradient(to top, rgba(0,255,0,1), rgba(0,255,0,1) "+ (colPct(colour[1])-5) +"%, rgba(0,0,0,0) "+colPct(colour[1])+"%)"
    );
    $('#colour-box-B-'+i).css(
      "background-image", 
      "linear-gradient(to top, rgba(0,0,255,1), rgba(0,0,255,1) "+ (colPct(colour[2])-5) +"%, rgba(0,0,0,0) "+colPct(colour[2])+"%)"
      );
    
      $('#colour-combined-'+i).css(
        "background-color", 
        "rgb("+colour[0]+","+colour[1]+","+colour[2]+")"
        );
      $('#colour-combined-'+i).css(
        "visibility", 
        (cLoop.idx + 1) % cTotal == i ? "visible" : "hidden"
        );
      $('#colour-lines-'+i).css(
        "visibility", 
        (cLoop.idx + 1) % cTotal == i ? "visible" : "hidden"
        );
    if (i >= maxColours) {
      $('#colour-'+i).css("display", "none");
    } else {
      $('#colour-'+i).css("display", "flex");
    }
  });
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function lerpColour(c1, c2, n) {
  return [
    Math.round(lerp(c1[0], c2[0], n)),
    Math.round(lerp(c1[1], c2[1], n)),
    Math.round(lerp(c1[2], c2[2], n)),
  ]
}

function easeInOutQuad(t) {
  return t<.5 ? 2*t*t : -1+(4-2*t)*t
}

function easeOutElastic(x, t, b, c, d) {
  var s=1.70158;var p=0;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
}

function coloursLoop() {
  let nowTime = new Date().getTime();
  let t = (nowTime - cLoop.start) / cLoop.duration;
  cLoop.mode = "found";
  if (t >= 2){
    // put in the new value
    myStops[cLoop.idx] = newStops[cLoop.idx];
    $('#location'+dataSource[cLoop.idx]).removeClass('data-active');
    //next target
    cLoop.idx++;
    cLoop.start = nowTime;
    if (cLoop.idx == cTotal){
      cLoop.idx = 0;
    }
    $('#location'+dataSource[cLoop.idx]).addClass('data-active');
  } else if (t < 1) {
    cLoop.mode = "searching";
    t = easeInOutQuad(t);
    let i2 = (cLoop.idx + 1) % cTotal;
    myColours[i2] = lerpColour(myColours[i2], newColours[i2], t);
    let x1 = myStops[cLoop.idx][0];
    let y1 = myStops[cLoop.idx][1];
    let x2, y2;
    // if ((cLoop.idx + 1) < cTotal){
      x2 = myStops[i2][0];
      y2 = myStops[i2][1];
    // } else {
    //   x2 = newStops[0][0];
    //   y2 = newStops[0][1];
    // }
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    let t2 = t < 0.5 ? t : Math.abs(1 - t);
    let xOut = lerp(x, lineDisplace[0], t2);
    let yOut = lerp(y, lineDisplace[1], t2);
    linePosition = [xOut, yOut];
    $("#hLine").attr("y1", ((linePosition[1])*100) + "%");
    $("#hLine").attr("y2", ((linePosition[1])*100) + "%");
    $("#vLine").attr("x1", ((linePosition[0])*100) + "%");
    $("#vLine").attr("x2", ((linePosition[0])*100) + "%");

    $("#celeste-middle").css("bottom", ((1-linePosition[1])*100) + "%");
    $("#celeste-top-left").css("right", ((1-linePosition[0])*100) + "%");
    $("#celeste-top-right").css("left", ((linePosition[0])*100) + "%");
  }


  
}

function loadShaders() {
  loadShader('vertex', false);
  loadShader('fragment', true);
}

function loadShader(shaderType, finished) {
  var shader = $('script[type="x-shader/x-'+shaderType+'"]');
  let url = shader.data("src");

  var onComplete = function onComplete(jqXHR,  textStatus) {
    shaderText[shaderType] = jqXHR.responseText;
    if (finished) {
      init();
    }
  }

  $.ajax(
    {
      url: url,
      dataType: "text",
      context: {
        type: shaderType,
        finished: finished
      },
      complete: onComplete
    }
  );
}

function resizeCanvas() {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = c.clientWidth;
    var displayHeight = c.clientHeight;
   
    // Check if the canvas is not the same size.
    if (c.width  != displayWidth ||
        c.height != displayHeight) {
   
      // Make the canvas the same size
      c.width  = displayWidth;
      c.height = displayHeight;
    }
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  viewportData = [gl.getParameter(gl.VIEWPORT)[2], gl.getParameter(gl.VIEWPORT)[3]];

  let containerWidth = $("#celeste-grid").width();
  let colourWidth= $("#colour-0").width();
  nColours = Math.min(Math.floor(containerWidth/colourWidth), myColours.length);
  updateColours(myColours, nColours);
  colourPositions = $.map( 
    $(".colour-div"), 
    elm => $(elm).position().left + $(elm).width()/2
    ); 
}

// function throwOnGLError(err, funcName, args) {
//   throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
// };

function init() {

  c             = document.getElementById("celeste-canvas");
//   gl            = WebGLDebugUtils.makeDebugContext(c.getContext("webgl"), throwOnGLError);
  gl            = c.getContext('webgl');
  c.width       = window.innerWidth;
  c.height      = window.innerHeight;
  
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Store current viewport data to pass it to fragment shader later
  viewportData = [gl.getParameter(gl.VIEWPORT)[2], gl.getParameter(gl.VIEWPORT)[3]];

  //console.log(viewportData);
  //console.log(gl.getParameter(gl.MAX_VIEWPORT_DIMS));
  
  // Buffer
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      -1.0, -1.0, 
      1.0, -1.0, 
      -1.0,  1.0, 
      -1.0,  1.0, 
      1.0, -1.0, 
      1.0,  1.0]), 
    gl.STATIC_DRAW
    );


  // Vertex
  shaderSource = shaderText["vertex"];
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, shaderSource);
  gl.compileShader(vertexShader);


  // Fragment
  shaderSource = shaderText["fragment"];
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, shaderSource);
  gl.compileShader(fragmentShader);
  // console.log(gl.getShaderInfoLog(fragmentShader));


  program         = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);  
  gl.useProgram(program);



  // texcoordLocation = gl.getAttribLocation(program, "a_texCoord");//is this just in here for S&Gs?
  positionLocation = gl.getAttribLocation(program, "a_position");
  // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


  // Uniforms
  timeLocation      = gl.getUniformLocation(program, "u_time" );
  viewportLocation  = gl.getUniformLocation(program, "u_viewport");
  coloursLocation = gl.getUniformLocation(program, "colours");
  colourPositionsLocation = gl.getUniformLocation(program, "colourPositions");
  linePositionLocation = gl.getUniformLocation(program, "linePosition");

  // render is called inside this function//nope.
  resizeCanvas();
  render();

}

function render() {
  

  // animateTheLine();
  randomizeColours();
  coloursLoop();
  
  // Clear
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // Pass uniforms
  nowtime = new Date().getTime();
  elapsedTime = (nowtime - startTime) / 1000;

  gl.uniform1f(timeLocation, elapsedTime);
  gl.uniform2fv(viewportLocation, viewportData);
  var coloursFlat = myColours.flat();
  coloursFlat = coloursFlat.map(x => x/255);
  gl.uniform3fv(coloursLocation, coloursFlat);

  gl.uniform1f(colourPositionsLocation, colourPositions);
  gl.uniform2fv(linePositionLocation, linePosition);
  

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 6);


  window.requestAnimationFrame(render, c);
}