export function vertexShader(){
    let vs =
        "precision mediump float;\n"+

        "attribute float angle;\n"+
        "varying float fAngle;\n"+
        "varying vec3 vecNormal;\n"+
        "varying vec4 vecPos;\n"+
        "uniform vec2 uResolution;\n"+
        "void main() {\n"+
        "vecNormal = normalMatrix * normal;\n"+
        // as the light later will be given in world coordinate space,
        // vPos has to be in world coordinate space too
        "vecPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n"+
        "fAngle = angle;\n"+
        "gl_Position = vecPos;\n"+
        "}";
    return vs;
}

export function fragmentShader(){
    let fs =
        "precision mediump float;\n"+
        // Comment this line to do not use the point light
        "varying vec3 vecNormal;\n"+
        "varying float fAngle;\n"+
        "varying vec4 vecPos;\n"+
        "uniform vec3 color;\n"+
        "uniform vec2 uResolution;\n"+
        "struct PointLight {\n"+
            "vec3 position;\n"+
            "vec3 color;\n"+
        "};\n"+

        "uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n"+

        "vec3 hsb2rgb( in vec3 c ){\n"+
            "vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),\n"+
            "6.0)-3.0)-1.0,\n"+
            "0.0,\n"+
            "1.0 );\n"+
            "rgb = rgb*rgb*(3.0-2.0*rgb);\n"+
            "return c.z * mix(vec3(1.0), rgb, c.y);\n"+
        "}\n"+

        "void main(){\n"+
            "vec4 addedLights = vec4(0.0,0.0,0.0, 1.0);\n"+
            "for(int l = 0; l < 3; l++){\n"+
                "vec3 adjustedLight = pointLights[l].position + cameraPosition;\n"+
                "vec3 lightDirection = normalize(vecPos.xyz - adjustedLight);\n"+
                "addedLights.rgb += clamp(dot(-lightDirection, vecNormal), 0.0, 1.0) * pointLights[l].color;\n"+
                "}\n"+
            "float angleToCol = clamp(fAngle/256.0, 0.4, 0.8);\n"+ // questi due valori definiscono il range
            "vec3 angleHSBColor = vec3(angleToCol, 0.2, 0.5);\n"+
            "vec4 col = mix(vec4(hsb2rgb(angleHSBColor), 1.0), vec4(addedLights.rgb, 1.0), 0.2);\n"+
            "gl_FragColor = col;\n"+
        "}";

        return fs;
}
