<div align="center">

  <h1>
    <code>map33.js</code>
  </h1>

<strong>A JavaScript library to build 3D maps with
 <a href="https://threejs.org/">three.js</a></strong>

  <p>
    <a href="https://www.npmjs.com/package/map33"><img alt="npm version" src="https://img.shields.io/npm/v/map33"></a>
  </p>

  <img alt="from heightmap to 3D terrain" src="https://repository-images.githubusercontent.com/277697064/2cd77d00-c05e-11ea-9752-7a4ff3fe3a03">

</div>

[**Live demo**](https://map33.openbloc.com) (you can double click to add missing tiles)

### Installation

```
npm install map33
```

alternatively:

```
yarn add map33
```

### Presentation and Usage

[Map33.js](https://github.com/blaze33/map33.js) takes two slippy maps tilesets, one to fetch elevation data tiles, the other to texture the meshes built from said elevation data (currently tried with OSM and Mapbox tiles but any XYZ tileserver will do it).

[**Live demo**](https://map33.openbloc.com) (you can double click to add missing tiles)

```javascript

import { Map, Source, MapPicker } from 'map33' // now I see I can't call this export Map, TODO ;)

const position = [45.916216, 6.860973]
const source = new Source('maptiler', '<your_mapbox_token>')
const map = new Map(scene, camera, source, position, 3, 11, options)
const mapPicker = new MapPicker(camera, map, renderer.domElement)
mapPicker.go(-45, 128)
```

### Background

Long story short, I took what I liked most about [droneWorld](https://droneworld.openbloc.com) (cf. https://discourse.threejs.org/t/3d-world-engine-droneworld-prototype/1501), ie. making 3D terrain and started from scratch to build a library that, hopefully, will be much cleaner in order to build upon and reuse.

### Interesting references:

https://github.com/w3reality/three-geo

https://blog.mapbox.com/bringing-3d-terrain-to-the-browser-with-three-js-410068138357

## License and attributions

The map library code is MIT licensed.

InfiniteGridHelper.js used by the example is made by [Fyrestar](https://mevedia.com) ([Github repo](https://github.com/Fyrestar/THREE.InfiniteGridHelper))


<hr />

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
