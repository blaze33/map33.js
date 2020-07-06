import getPixels from 'get-pixels'
import ndarray from 'ndarray'
import {
  PlaneBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  MeshNormalMaterial,
  TextureLoader,
  Vector3
} from 'three'

// const tileMaterial = new MeshPhongMaterial({wireframe: false})
const tileMaterial = new MeshNormalMaterial({wireframe: false})
const baseTileSize = 500.
const loader = new TextureLoader()

class Utils {
  static long2tile (lon, zoom) {
    return (lon + 180) / 360 * Math.pow(2, zoom)
  }

  static lat2tile (lat, zoom) {
    return (
      (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)
      )
  }

  static geo2tile (geoLocation, zoom) {
    const maxTile = Math.pow(2, zoom);
    return {
      x: Math.abs(Math.floor(Utils.long2tile(geoLocation[1], zoom)) % maxTile),
      y: Math.abs(Math.floor(Utils.lat2tile(geoLocation[0], zoom)) % maxTile)
    }
  }

  static tile2position(z, x, y, center, tileSize) {
    const offsetAtZ = (z) => {
      return {
        x: center.x / Math.pow(2, 10 - z),
        y: center.y / Math.pow(2, 10 - z),
      };
    };
    const offset = offsetAtZ(z);
    return {
      x: ((x - center.x) - ((offset.x % 1) - 0.5) - (1 - (center.x % 1))) * tileSize,
      y: (-(y - center.y) + ((offset.y % 1) - 0.5) + (1 - (center.y % 1))) * tileSize,
      z: 0
    }
  }

  static position2tile(z, x, y, center, tileSize) {
    const centerPosition = Utils.tile2position(z, center.x, center.y, center, tileSize)
    console.log(centerPosition)
    const deltaX = Math.round((x - centerPosition.x) / tileSize)
    const deltaY = Math.round(-(y - centerPosition.y) / tileSize)
    return {x: deltaX + center.x, y: deltaY + center.y, z}
  }
}

class MapPicker {
  constructor(camera, map, domElement) {
    this.vec = new Vector3(); // create once and reuse
    this.position = new Vector3(); // create once and reuse
    this.camera = camera
    this.map = map
    this.domElement = domElement

    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.domElement.addEventListener('click', this.onMouseClick.bind(this))
  }

  computeWorldPosition(event) {
    // cf. https://stackoverflow.com/a/13091694/343834
    this.vec.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5);

    this.vec.unproject(this.camera);

    this.vec.sub(this.camera.position).normalize();

    var distance = -this.camera.position.z / this.vec.z;

    this.position.copy(this.camera.position).add(this.vec.multiplyScalar(distance));
  }

  onMouseMove(event) {
    // this.computeWorldPosition(event)
  }

  onMouseClick(event) {
    this.computeWorldPosition(event)
    this.map.addFromPosition(this.position.x, this.position.y)
  }
}

class Tile {
  constructor(z, x, y, size=baseTileSize) {
    this.size = size;
    this.z = z;
    this.x = x;
    this.y = y;
    this.baseURL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";
    this.shape = null;
    this.elevation = null;
    this.seamX = false
    this.seamY = false
  }

  key() {
    return `${this.z}/${this.x}/${this.y}`;
  }
  keyNeighX() {
    return `${this.z}/${this.x + 1}/${this.y}`;
  }
  keyNeighY() {
    return `${this.z}/${this.x}/${this.y + 1}`;
  }

  url() {
    return `${this.baseURL}/${this.z}/${this.x}/${this.y}.png`;
  }

  mapUrl() {
    return `https://c.tile.openstreetmap.org/${this.z}/${this.x}/${this.y}.png`
  }

  computeElevation(pixels) {
    this.shape = pixels.shape;
    const elevation = new Float32Array(pixels.shape[0] * pixels.shape[1]);
    for (let i = 0; i < pixels.shape[0]; i++) {
      for (let j = 0; j < pixels.shape[1]; j++) {
        const ij = i + pixels.shape[0] * j;
        const rgba = ij * 4;
        elevation[ij] =
          pixels.data[rgba] * 256.0 +
          pixels.data[rgba + 1] +
          pixels.data[rgba + 2] / 256.0 -
          32768.0;
      }
    }
    this.elevation = elevation;
  }

  buildGeometry() {
    const geometry = new PlaneBufferGeometry(
      this.size,
      this.size,
      this.shape[0],
      this.shape[1]
    );
    const nPosition = Math.sqrt(geometry.attributes.position.count);
    const nElevation = Math.sqrt(this.elevation.length);
    const ratio = nElevation / (nPosition - 1);
    let x, y;
    for (
      // let i = nPosition;
      let i = 0;
      i < geometry.attributes.position.count - nPosition;
      i++
    ) {
      // if (i % nPosition === 0 || i % nPosition === nPosition - 1) continue;
      if (i % nPosition === nPosition - 1) continue;
      x = Math.floor(i / nPosition);
      y = i % nPosition;
      geometry.attributes.position.setZ(
        i,
        this.elevation[
          Math.round(Math.round(x * ratio) * nElevation + y * ratio)
        ] * 0.035
      );
    }
    geometry.computeVertexNormals();
    this.geometry = geometry;
  }

  buildMaterial() {
    const map = loader.load(this.mapUrl())
    return new MeshPhongMaterial({map})
    // return new MeshNormalMaterial()
  }

  buildmesh() {
    this.mesh = new Mesh(this.geometry, this.buildMaterial());
  }

  fetch() {
    return new Promise((resolve, reject) => {
      getPixels(this.url(), (err, pixels) => {
        if (err) console.error(err);
        this.computeElevation(pixels);
        this.buildGeometry();
        this.buildmesh();
        resolve(this);
      });
    });
  }

  setPosition(center) {
    const position = Utils.tile2position(this.z, this.x, this.y, center, this.size)
    this.mesh.position.set(...Object.values(position));
  }

  resolveSeamY(neighbor) {
    const tPosition = this.mesh.geometry.attributes.position.count;
    const nPosition = Math.sqrt(tPosition);
    const nPositionN = Math.sqrt(
      neighbor.mesh.geometry.attributes.position.count
    );
    if (nPosition !== nPositionN) {
      console.error(
        "resolveSeamY only implemented for geometries of same size"
      );
      return
    }
    for (let i = tPosition - nPosition; i < tPosition; i++) {
      this.mesh.geometry.attributes.position.setZ(
        i,
        neighbor.mesh.geometry.attributes.position.getZ(
          i - (tPosition - nPosition)
        )
      );
    }
  }

  resolveSeamX(neighbor) {
    const tPosition = this.mesh.geometry.attributes.position.count;
    const nPosition = Math.sqrt(tPosition);
    const nPositionN = Math.sqrt(
      neighbor.mesh.geometry.attributes.position.count
    );
    if (nPosition !== nPositionN) {
      console.error(
        "resolveSeamX only implemented for geometries of same size"
      );
      return
    }
    for (let i = nPosition - 1; i < tPosition; i += nPosition) {
      this.mesh.geometry.attributes.position.setZ(
        i,
        neighbor.mesh.geometry.attributes.position.getZ(
          i - nPosition + 1
        )
      )
    }
  }

  resolveSeams(cache) {
    let worked = false
    const neighY = cache[this.keyNeighY()]
    const neighX = cache[this.keyNeighX()]
    if (this.seamY === false && neighY && neighY.mesh) {
      this.resolveSeamY(neighY);
      this.seamY = true
      worked = true
    }
    if (this.seamX === false && neighX && neighX.mesh) {
      this.resolveSeamX(neighX);
      this.seamX = true
      worked = true
    }
    if (worked) {
      this.mesh.geometry.attributes.position.needsUpdate = true;
      this.mesh.geometry.computeVertexNormals();
    }
  }
}

class Map {
  constructor (scene, camera, geoLocation, nTiles, zoom=10, options) {
    this.scene = scene
    this.camera = camera
    this.geoLocation = geoLocation
    this.nTiles = nTiles
    this.zoom = zoom
    this.options = options
    this.tileSize = baseTileSize

    this.tileCache = {};

    this.init()
  }

  init() {
    this.center = Utils.geo2tile(this.geoLocation, this.zoom)
    console.log({center: this.center})
    const tileOffset = Math.round(this.nTiles / 2)

    for (let i = 0; i < this.nTiles; i++) {
      for (let j = 0; j < this.nTiles; j++) {
        const tile = new Tile(this.zoom, this.center.x + i - tileOffset, this.center.y + j - tileOffset)
        this.tileCache[tile.key()] = tile
      }
    }

    const promises = Object.values(this.tileCache).map(tile =>
      tile.fetch().then(tile => {
        tile.setPosition(this.center)
        this.scene.add(tile.mesh)
        return tile
      })
    )

    Promise.all(promises).then(tiles => {
      tiles.reverse().forEach(tile => {  // reverse to avoid seams artifacts
        tile.resolveSeams(this.tileCache)
      })
    })

  }

  addFromPosition(posX, posY) {
    const {
      x,
      y,
      z
    } = Utils.position2tile(this.zoom, posX, posY, this.center, this.tileSize)
    console.log({x, y, z})
    const tile = new Tile(this.zoom, x, y)

    if (tile.key() in this.tileCache) return

    this.tileCache[tile.key()] = tile
    tile.fetch().then(tile => {
      tile.setPosition(this.center)
      this.scene.add(tile.mesh)
    }).then(() => {
      Object.values(this.tileCache).forEach(tile => tile.resolveSeams(this.tileCache))
    })


  }
}

export {Map, MapPicker}
