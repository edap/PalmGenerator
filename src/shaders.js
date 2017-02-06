export function vertexShader(){
    let vs =
        "precision mediump float;\n"+
        "varying vec3 vecNormal;\n"+
        "varying vec4 vecPos;\n"+
        "varying float screenY;\n"+
        "uniform vec2 uResolution;\n"+
        "void main() {\n"+
        "vecNormal = normalMatrix * normal;\n"+
        // as the light later will be given in world coordinate space,
        // vPos has to be in world coordinate space too
        "vecPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n"+
        "gl_Position = vecPos;\n"+
        "}";
    return vs;
}

export function fragmentShader(){
    let fs =
        "precision mediump float;\n"+
        // Comment this line to do not use the point light
        "varying vec3 vecNormal;\n"+
        "varying vec4 vecPos;\n"+
        "uniform vec3 color;\n"+
        "uniform vec2 uResolution;\n"+
        "struct PointLight {\n"+
            "vec3 position;\n"+
            "vec3 color;\n"+
        "};\n"+

        "uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n"+
        "void main(){\n"+
            "vec4 addedLights = vec4(0.0,0.0,0.0, 1.0);\n"+
            "for(int l = 0; l < 3; l++){\n"+
                "vec3 adjustedLight = pointLights[l].position + cameraPosition;\n"+
                "vec3 lightDirection = normalize(vecPos.xyz - adjustedLight);\n"+
                "addedLights.rgb += clamp(dot(-lightDirection, vecNormal), 0.0, 1.0) * pointLights[l].color;\n"+
            "}\n"+
            "vec4 col = mix(vec4(color, 1.0), vec4(addedLights.rgb, 1.0), 0.5);\n"+
            "gl_FragColor = col;\n"+
        "}";

        return fs;
}
