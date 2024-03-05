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
    BackSide,
    MathUtils
} from 'three';

const utils = {
    randomPointSphere(radius) {
        let theta = 2 * Math.PI * Math.random();
        let phi = Math.acos(2 * Math.random() - 1);
        return {
            dx: 0 + (radius * Math.sin(phi) * Math.cos(theta)),
            dy: 0 + (radius * Math.sin(phi) * Math.sin(theta)),
            dz: -(100 + (radius * Math.cos(phi)))
        };
    }
}

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
    static createUniverseStars(texture, size, total) {
        const starGeometry = new BufferGeometry();
        const starMaterial = new PointsMaterial({
            size,
            map: texture,
            blending: AdditiveBlending
        });

        const starVertices = new Array();
        for (let index = 0; index < total; index++) {
            let radius = MathUtils.randInt(320, 160);
            let particles = utils.randomPointSphere(radius);
            starVertices.push(particles.dx, particles.dy, particles.dz);
        }

        starGeometry.setAttribute('position',
            new Float32BufferAttribute(starVertices, 3));

        return new Points(
            starGeometry, starMaterial
        )

    }
}

export default SceneComponentBuilder;