
//This only works if <script src="./plot.js" defer type="module"></script>
//in your HTML. To use module types locally you need to enable CORS on the localhost server
//export default Graph;

class Graph {
    constructor(figureText="", width = 500, height = 500) {
        
        //Create the boundary box around the graph
        const boundery = document.createElement('div');
        boundery.setAttribute('class', "graphContainer");
        boundery.style.display = "inline-block";
        boundery.style.border = "1px solid grey";
        boundery.style.width = width;
        boundery.style.height = height;
        //Distance between the boundary and other HTML elements
        boundery.style.margin = "10px";
        //Distance between graph screen edge and the boundary
        boundery.style.padding = "10px";

        //Create the graphing screen
        //Creates a new <canvas> element on the DOM
        this.graphScreen = document.createElement("canvas");
        //This will be the unique ID of the graph
        this.graphScreen.setAttribute('id', Math.floor(Math.random() * 50));
        this.graphScreen.width = width;
        this.graphScreen.height = height;
        this.graphScreen.style.border = "1px solid black";
        //this.graph is the reference for rendering and drawing
        this.graph = this.graphScreen.getContext("2d");
        //Turn the background white
        this.clearGraphScreen();

        //The container for the text underneath the graph
        this.textContainer = document.createElement('div');
        this.textContainer.setAttribute('class', "graphFigureTextContainer");
        this.textContainer.style.textAlign = "center";

        const graphTitle = document.createElement('p');
        graphTitle.setAttribute('class', 'graphTitle');
        graphTitle.textContent = figureText;

        //Add elements to the DOM
        document.body.appendChild(boundery);
        boundery.appendChild(this.graphScreen);
        boundery.appendChild(this.textContainer);
        this.textContainer.appendChild(graphTitle);

        //Setting up the cartesian coordinates
        this.minX = -(width * 0.5);
        this.minY = -(height * 0.5);
        this.maxX = (width * 0.5);
        this.maxY = -(height * 0.5);
        this.offsetX = 0;
        this.offsetY = 0;
        //How far in or far out the graph is zoomed
        this.zoomFactor = 1;
        //All the individual plots that can be drawn on the screen
        this.plots = [];
        //For translating screen to graph coordinates
        //this.centerX = this.CartXtoScreenX(0);
        //this.centerY = this.CartXtoScreenX(0);

        this.drawGrid(1);

        //Add event listener to the graph for handling user input
        //window.addEventListener("keyup", this.handleZoom(e).bind(e));
        window.addEventListener("keyup", (e) => {
            this.handleUserInput(e);
        });
    }

    //Removes everything from the <canvas> screen including grid itself
    clearGraphScreen() {
        //Turn the background white
        this.graph.fillStyle = "white";
        this.graph.clearRect(0, 0, this.graphScreen.width, this.graphScreen.height);
    }

    clearPlots() {
        this.plots = [];
    }

    //types:
    //"LINE" 
    //"CIRCLE"
    addPlot(name, dataX, dataY, color = "black", type="LINE") {
        this.plots.push({name: name, dataX: dataX, dataY: dataY, color: color, type: type.toUpperCase()});
        this.drawPlot(name);
    }

    removePlot(name) {
        this.plots = this.plots.filter( (plot) => 
            plot.name !== name
        );
        //Redraw all the plots again
        this.drawAllPlots();
    }

    drawAllPlots() {
        //First remove all plot labels (Except the title) so they are not doubled
        //They are re-added again 1 by 1 in the this.drawPlot(name) function
        while (this.textContainer.lastChild.getAttribute("class") !== "graphTitle") {
            this.textContainer.removeChild(this.textContainer.lastChild);
        }

        this.plots.forEach((plot) => {
            this.drawPlot(plot.name);
        });
    }
    
    drawPlot(name) {
        //Find the plot to draw
        const plotToDraw = this.plots.find((plot) =>
            plot.name === name
        );
        if (plotToDraw === undefined) {
            throw new Error(`Plot with name ${name} not found`);
        }
        //Get properties from the plot.
        const dataX = plotToDraw.dataX;
        const dataY = plotToDraw.dataY;
        const color = plotToDraw.color;
        const type = plotToDraw.type;

        //Redraw the grid again based on the maximums and minimums of the data
        //It takes the highest value from all the plots
        //and the lowest value from all the plots
        const dataMinX = [];
        const dataMinY = [];
        const dataMaxX = [];
        const dataMaxY = [];
        //Iterate over all the plots and get the min's and max's of each plot
        for (let i = 0; i < this.plots.length; i++) {
            const plot = this.plots[i];
            dataMinX.push(Math.min(...plot.dataX));
            dataMinY.push(Math.min(...plot.dataY));
            dataMaxX.push(Math.max(...plot.dataX));
            dataMaxY.push(Math.max(...plot.dataY));
        }
        //Get the total min and max of all plots combined
        this.minX = Math.min(...dataMinX);
        this.minY = Math.min(...dataMinY);
        this.maxX = Math.max(...dataMaxX);
        this.maxY = Math.max(...dataMaxY);
        //Zoom on the data so it fits the screen
        this.zoomFactor = this.graphScreen.width / Math.abs(this.maxX);
        this.drawGrid()
        
        //loop over the data to draw the plot
        let i = 0;
        while (i+1 < dataY.length)
        {
            i += 1;
            //this.graph.lineWidth() 
            switch (type) {
                case "LINE":
                    this.graph.strokeStyle = color;
                    this.graph.beginPath();
                    this.graph.moveTo(this.CartXtoScreenX(dataX[i]), this.CartYtoScreenY(dataY[i]));
                    this.graph.lineTo(this.CartXtoScreenX(dataX[i+1]), this.CartYtoScreenY(dataY[i+1]));
                    this.graph.closePath();
                    this.graph.stroke();
                    break;

                case "CIRCLE":
                    this.graph.beginPath();
                    this.graph.arc(this.CartXtoScreenX(dataX[i]), this.CartYtoScreenY(dataY[i]), 5, 0, 2 * Math.PI, false);
                    this.graph.closePath();
                    this.graph.fillStyle = color;
                    this.graph.fill();
                    break;
                
                default:
                    throw new Error(`Type: ${type} is not valid. You can only choose between LINE and CIRCLE`);
            }
        }
        //Add the plot label
        const newLabel = document.createElement('p');
        newLabel.setAttribute("class", `${plotToDraw.name} plotLabel`);
        newLabel.style.color = color;
        newLabel.textContent = `${plotToDraw.name}: ${color}`;
        this.textContainer.appendChild(newLabel);
    }

    //"Cartesian" X to Screen X coordinate
    CartXtoScreenX(cartX) {
        return (this.zoomFactor * cartX) + (this.graphScreen.width * 0.5) + this.offsetX;
    }

    //"Cartesian" Y to Screen Y coordinate
    CartYtoScreenY(cartY) {
        return (this.graphScreen.height * 0.5) - (this.zoomFactor * cartY) + this.offsetY;
    }

    //Translate computer screen coordinates to a cartesian math coordinate system
    cartToScreen(cartX, cartY) {
        return [this.CartXtoScreenX(cartX), this.CartYtoScreenY(cartY)];
    }

    drawGrid() {
        //Remove the previous grid
        this.clearGraphScreen();

        //Position the graph towards the bottom left of the screen if minimum values are 0
        if (this.minX === 0) {
            this.offsetX = -(this.graphScreen.width * 0.5);
        }
        if (this.minY === 0) {
            this.offsetY = this.graphScreen.height * 0.5
        }

        this.graph.fillStyle = "black";
        this.graph.strokeStyle = "black";
        //this.graph.lineWidth(5);
        //Draw the main axis
        //Draw the vertical line
        this.graph.beginPath();
        this.graph.moveTo(this.CartXtoScreenX(this.maxX), this.CartYtoScreenY(0));
        this.graph.lineTo(this.CartXtoScreenX(this.minX), this.CartYtoScreenY(0));
        this.graph.closePath();
        this.graph.stroke();
        //Draw the horizontal line
        this.graph.beginPath();
        this.graph.moveTo(this.CartXtoScreenX(0), this.CartYtoScreenY(this.minY));
        this.graph.lineTo(this.CartXtoScreenX(0), this.CartYtoScreenY(this.maxY));
        this.graph.closePath();
        this.graph.stroke();

        this.graph.font = "10px serif";
        //Draw maxX text
        this.graph.strokeText(`${this.maxX}`, this.CartXtoScreenX(0 + 5), this.CartYtoScreenY(this.maxY - 20));
        //Draw maxY text
        this.graph.strokeText(`${this.maxY}`, this.CartXtoScreenX(this.maxX - 30), this.CartYtoScreenY(0 + 5));
        //Draw minX
        this.graph.strokeText(`${this.minX}`, this.CartXtoScreenX(this.minX + 20), this.CartYtoScreenY(0 + 5));
        //Draw minY
        this.graph.strokeText(`${this.minY}`, this.CartXtoScreenX(0 + 5), this.CartYtoScreenY(this.minX + 5));

        //Redraw the plots
        //this.drawAllPlots();
    }

    resetView() {
        this.zoomFactor = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    //Manipulate the graph with uuser input
    handleUserInput(e) { 
        //console.log(e.key);
        switch (e.key) {
            case "+":
                this.zoomFactor *= 2;
                console.log(`crrent zoomFactor: ${this.zoomFactor}`);
                break;
            case "-":
                this.zoomFactor *= 0.5;
                console.log(`current zoomFactor: ${this.zoomFactor}`);
                break;
            case "r":
                this.resetView();
                console.log("ZOOM RESET");
                break;
            case "ArrowUp":
                this.offsetY -= 10;
                console.log(`current offsetY = ${this.offsetY}`);
                break;
            case "ArrowDown":
                this.offsetY += 10;
                console.log(`current offsetY = ${this.offsetY}`);
                break;
            case "ArrowRight":
                this.offsetX += 10;
                console.log(`current offsetX = ${this.offsetX}`);
                break;
            case "ArrowLeft":
                this.offsetX -= 10;
                console.log(`current offsetX = ${this.offsetX}`);
                break;
        }
        //Draw grid
        this.drawGrid();
        //Re-draw the plots
        this.drawAllPlots();
    }
}
