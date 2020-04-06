document.addEventListener("DOMContentLoaded", function(event) { 
    var canvas = document.getElementById("draw-canvas");
    var ctx = canvas.getContext("2d");
    var hw = 5
    ctx.lineWidth = hw * 2;
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "gray";

    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("pointermove", draw, false);
    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);

    let mng = {
        drawing : false,
        flush : () => {
            if (mng.path) {
                // upload path and image 
            }
        },
        reset: (x, y) => {
            mng.drawing = true;
            mng.path = [{x, y}];
            mng.minX = x;
            mng.maxX = x;
            mng.minY = y;
            mng.maxY = y;
        },
        push: (x, y ) => {
            mng.path.push({x, y});
            if (!mng.minX || mng.minX > x) mng.minX = x;
            if (!mng.maxX || mng.maxX < x) mng.maxX = x;
            if (!mng.minY || mng.minY > y) mng.minY = y;
            if (!mng.maxY || mng.maxY < y) mng.maxY = y;
        },
        done: (image) => {
            mng.image = image;
            mng.drawing = false;
        }, 
        clear : () => {
            mng.path = undefined;
        }
    };

    function start(event) {
        mng.flush()
        mng.reset(event.offsetX, event.offsetY);       
        ctx.moveTo(event.offsetX, event.offsetY);
        ctx.beginPath();
    }
    function draw(event) {
        if (mng.drawing) {
            mng.push(event.offsetX, event.offsetY);
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        }
    }
    function stop(event) {
        if (mng.drawing) {
            var imgData = ctx.getImageData(mng.minX - hw, mng.minY - hw, mng.maxX + hw, mng.maxY + hw);
            var shapeCanvas = document.getElementById("shape-canvas");
            if (!shapeCanvas) {
                shapeCanvas = document.createElement("canvas");
                shapeCanvas.id = "shape-canvas";
                document.body.append(shapeCanvas);
            }
            var saveCanvas = document.getElementById("save-canvas");
            if (!saveCanvas) {
                saveCanvas = document.createElement("canvas");
                saveCanvas.id = "save-canvas";
                saveCanvas.width = 28;
                saveCanvas.height = 28;
                document.body.append(saveCanvas);
            }
            ctx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeCanvas.width =  mng.maxX - mng.minX + (hw * 2);
            shapeCanvas.height = mng.maxY - mng.minY + (hw * 2); 
            shapeCanvas.getContext("2d").putImageData(imgData, 0, 0);
            var imageData = shapeCanvas.toDataURL("image/jpeg");
            var image = new Image();
            image.src = imageData;
            image.onload = () => {
                saveCanvas.getContext("2d").drawImage(image, 0, 0, 28, 28);
                mng.done(saveCanvas.toDataURL("image/jpeg"));
            };
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    document.getElementById("ignore-btn").addEventListener("click", ignore, false);
    function ignore () {
        mng.clear();
        document.getElementById("shape-canvas").remove();
        document.getElementById("save-canvas").remove();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});


