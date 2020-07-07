#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

// ####### custom uniforms #########
uniform sampler2D mapNW;
uniform sampler2D mapSW;
uniform sampler2D mapNE;
uniform sampler2D mapSE;
// #################################

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>

  #ifdef USE_MAP

  vec4 colorSW = mix(mix(texture2D(mapSW, vUv * 2.), vec4(0.), step(0.5, vUv.x)), vec4(0.), step(0.5, vUv.y));
  vec4 colorNW = mix(mix(texture2D(mapNW, vUv * 2. + vec2(0., -1.)), vec4(0.), step(0.5, vUv.x)), vec4(0.), 1. - step(0.5, vUv.y));
  vec4 colorSE = mix(mix(texture2D(mapSE, vUv * 2. + vec2(-1., 0.)), vec4(0.), 1. - step(0.5, vUv.x)), vec4(0.), step(0.5, vUv.y));
  vec4 colorNE = mix(mix(texture2D(mapNE, vUv * 2. + vec2(-1., -1.)), vec4(0.), 1. - step(0.5, vUv.x)), vec4(0.), 1. - step(0.5, vUv.y));

  // texelColor = mapTexelToLinear(texelColor);
  diffuseColor *= colorSW + colorNW + colorNE + colorSE;

  #endif

	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// accumulation
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	#include <envmap_fragment>

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}
