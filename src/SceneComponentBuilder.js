import globeVertexShader from './shaders/globeVertex.glsl';
import globeFragmentShader from './shaders/globeFragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';

import {
    Mesh,
    SphereGeometry,
    BufferGeometry,
    ShaderMaterial,
    PointsMaterial,
    Float32BufferAttribute,
    Points,
    AdditiveBlending,
    BackSide
} from 'three';

class SceneComponentBuilder {
    static createGlobe(texture, radius = 5, withSegments = 50, heightSegments = 50) {
        let globe = new Mesh(
            new SphereGeometry(radius, withSegments, heightSegments),
            new ShaderMaterial({
                vertexShader: globeVertexShader,
                fragmentShader: globeFragmentShader,
                uniforms: {
                    globeTexture: {
                        value: texture
                    },
                    colorSpectrum: {
                        value: [0.3, 0.6, 1.0]
                    }
                }
            })
        );
        globe.name = 'globe';
        globe.rotation.y = -Math.PI / 2;
        return globe;
    }
    static createAtmosphere(radius = 5, withSegments = 50, heightSegments = 50) {
        let atmosphere = new Mesh(
            new SphereGeometry(radius, withSegments, heightSegments),
            new ShaderMaterial({
                vertexShader: atmosphereVertexShader,
                fragmentShader: atmosphereFragmentShader,
                blending: AdditiveBlending,
                side: BackSide
            })
        );
        atmosphere.name = 'atmos';
        atmosphere.scale.set(1.1, 1.1, 1.1);
        return atmosphere;
    }
    static createUniverseStars(texture, size, total = 1000) {
        const starGeometry = new BufferGeometry();
        const starMaterial = new PointsMaterial({
            size,
            map: texture,
            blending: AdditiveBlending
        });

        const starVertices = new Array();
        const minDistance = 400;
        const maxDistance = 2000;

        for (let index = 0; index < total; index++) {
            const dx = (Math.random() - 0.5) * maxDistance;
            const dy = (Math.random() - 0.5) * maxDistance;
            const dz = -(Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance);
            starVertices.push(dx, dy, dz);
        }

        starGeometry.setAttribute('position',
            new Float32BufferAttribute(starVertices, 3));

        return new Points(
            starGeometry, starMaterial
        )

    }
}

export default SceneComponentBuilder;