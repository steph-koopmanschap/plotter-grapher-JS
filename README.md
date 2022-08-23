# Plotter / Grapher in Javascript

This is a simple class that creates a graph in your HTML document.


## How to use the graph.

## Initialization

First initialize the graph.

`myGraph = new Graph("add your graph title here");`

by default the graph will be 500 pixels in width and height.
You can mage the graph bigger by initializing it with a different size.
`myGraph = new Graph("add your graph title here", 800, 600);`

## Adding plots

To add a plot write
`myGraph.addPlot("your plot title", dataX, dataY, plot_color);`
dataX is an array of your X values.
dataY is an array of your Y value.
plot_color can by any valid HTML color.

You can also create a 2D array that contains your X and Y data and then seperate it out in the parameters.
For example
`const data = [dataX, dataY];`
`myGraph.addPlot("your plot title", data[0], data[1], plot_color);`
you could also use an object.
For example:
`const data = {x: dataX, y: dataY};`
`myGraph.addPlot("your plot title", data.x, data.y, plot_color);`

Finally can switch between to types of graphs.
A line graph. and an individual disconnected point graph by adding an extra parameter.
By default the graph is always a line graph, when the last parameter is not given.
`myGraph.addPlot("your plot title", dataX, dataY, plot_color, "line");`
`myGraph.addPlot("your plot title", dataX, dataY, plot_color, "circle");`

You can add any data points you want, as long as the x and y data arrays are the same size.

## Plotting functions

This class does not have the ability to plot math functions by itself, but you can make your own math functions.

For example: 
y = x;
```
const myDataX = [];
const myDataY = [];
let step = 1;
let lowerLimit = -100;
let upperLimit = 100;
for (let x = lowerLimit; x < upperLimit; x += step) {
    myDataX.push(x);
    myDataY.push(x);
}
```
y = x^2

```
for (let x = lowerLimit; x < upperLimit; x += step) { {
    myDataX.push(x);
    myDataY.push(x * x);
}
```

y = log(x)
```
for (let x = lowerLimit; x < upperLimit; x += step) { {
    myDataX.push(x);
    myDataY.push(Math.log(x));
}
```

y = sin(x)

```
for (let x = lowerLimit; x < upperLimit; x += step) { {
    myDataX.push(x);
    myDataY.push(Math.sin(x));
}
```

## Extra features

You can use the "+" and "-" buttons the zoom in and out of the graph.
You can also use the arrow keys to move the graph up, down, and sideways.
However there is a bug where this functionality does not work at the moment.

# Known bugs

You should by able to add as many plots as you want,
but there is a bug where you can only 1 plot and any extra plots override the previous one.

Keyboard controls do not work at the moment.

