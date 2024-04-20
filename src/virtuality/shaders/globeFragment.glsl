uniform sampler2D globeTexture;

varying vec2 vertexUV;  // [0, 0.24]
varying vec3 vectorNormal;
uniform vec3 colorSpectrum;

void main() {
    float intensity = 1.05 - dot(vectorNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = colorSpectrum * pow(intensity, 1.5);

    gl_FragColor = vec4(
       atmosphere + texture2D(globeTexture, vertexUV).xyz, 
       1.0
    );
}