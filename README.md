# CartoDB

JavaScript visualization for CartoDB with EANS (expressjs, angularjs, nodejs and socketio) & jquery for SVG dataset retrieved from CartoDB

## Motivation

1. Retrieve dataset from CartoDB
2. Streaming retrieved data from CartoDB
3. Piping data to the front end to do it in a more asynchronous way. Mainly, because some dataset are like 5mb
4. Re-rendering images as soon as data are coming.
5. Sending it from back end to front end through Socketio
6. Adding zoom and panning for SVG
7. Using last technologies, new paradigms and new and innovatives ways to solve common problems
8. Make a contribution to the community of Open Sources with some examples


## Prerequisites

Render datasets in a browser like https://rambo-test.cartodb.com/tables/mnmappluto/public/map

* no geo or rendering libraries allowed, use whatever technology you want (SVG, canvas, webgl...) but no d3, leaflet, gmaps, three.js or other mapping/rendering library. DOM, ajax and other non geo related stuff can be done with jQuery or any library you decide.
* you need to fetch the data from CartoDB (using our SQL API)
* rendering the basemap and the labels is not needed, just the data
* take all the time you need to finish it

Bonus points:

* load and rendering time is important, think how to reduce those
* panning and zooming

## Install dependencies

You should already have at least this version of Nodejs and npm if you want to run the examples on your own PC

```
$ node -v
```
 **v0.12.7**
```
$ npm -v
```
**3.5.0**
```
$ bower -v
```
**1.7.2**

Then, clone the project

```
$ git clone https://github.com/ackuser/CartoDB.git
```
And go to it
```
$ cd CartoDB
```
Moreover, I have already configured all the dependecies on this project, so you would only need to install them from the root folder with:
```
$ npm i && bower i
```
## Run the application

```
$ node index.js
```

## Conclusions

You can visualize more dataset although you would need to manually change the address in the back end and set the width and height of the svg in the front end. See lines *20 in index.html* and *78 in index.js*

It would be nice for future improvements:

* Release a feature for choosing the dataset from an input in the front end.
* Improve parsing to do it faster.
* Parsing the header of the svg to get width and height and then dinamically setting them up.


THANKS ;)  

Karim
