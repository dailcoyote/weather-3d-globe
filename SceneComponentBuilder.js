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
    TextureLoader,
    Float32BufferAttribute,
    Points,
    AdditiveBlending,
    BackSide
} from 'three';

class SceneComponentBuilder {
    static createGlobe(radius = 5, withSegments = 50, heightSegments) {
        return new Mesh(
            new SphereGeometry(radius, withSegments, heightSegments),
            new ShaderMaterial({
                vertexShader: globeVertexShader,
                fragmentShader: globeFragmentShader,
                uniforms: {
                    globeTexture: {
                        value: new
                            TextureLoader()
                            .load('./textures/earth_uvmap.jpeg')
                    }
                }
            })
        );
    }
    static createAtmosphere() {
        let atmosphere = new Mesh(
            new SphereGeometry(5, 50, 50),
            new ShaderMaterial({
                vertexShader: atmosphereVertexShader,
                fragmentShader: atmosphereFragmentShader,
                blending: AdditiveBlending,
                side: BackSide
            })
        );
        atmosphere.scale.set(1.1, 1.1, 1.1);
        return atmosphere;
    }
    static createStars() {
        const starGeometry = new BufferGeometry();
        const starMaterial = new PointsMaterial({
            color: 0xffffff
        })
        const starVertices = new Array();
        const starCount = 10000;
        for (let i = 0; i < starCount; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position',
            new Float32BufferAttribute(starVertices, 3));

        return Points(
            starGeometry, starMaterial
        )
    }
}

export default SceneComponentBuilder;