import {
  ShaderMaterial,
  TextureLoader
} from 'three'
import vertexShader from './quadtexture_vert.glsl'
import fragmentShader from './quadtexture_frag.glsl'

const loader = new TextureLoader()

const QuadTextureMaterial = (urls) => {
  return new ShaderMaterial({
    uniforms: {
      mapNW: loader.load(urls[0]),
      mapSW: loader.load(urls[1]),
      mapNE: loader.load(urls[2]),
      mapSE: loader.load(urls[3]),
    },
    vertexShader,
    fragmentShader,
  })
}

export default QuadTextureMaterial
