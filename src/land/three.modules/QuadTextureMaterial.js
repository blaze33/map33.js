import {
  ShaderMaterial,
  TextureLoader,
  UniformsLib,
} from 'three'
import vertexShader from './quadtexture_vert.glsl'
import fragmentShader from './quadtexture_frag.glsl'

const loader = new TextureLoader()

const QuadTextureMaterial = (urls) => {
  return Promise.all(urls.map(url => loader.loadAsync(url))).then(maps => {
    return new ShaderMaterial({
      uniforms: {
        mapNW: {value: maps[0]},
        mapSW: {value: maps[1]},
        mapNE: {value: maps[2]},
        mapSE: {value: maps[3]},
        ...UniformsLib.common,
        ...UniformsLib.lights,
        ...UniformsLib.fog,
      },
      vertexShader,
      fragmentShader,
      defines: {
        USE_MAP: true,
        USE_UV: true,
      },
      lights: true,
      fog: true,
    })
  })
}

export default QuadTextureMaterial
