export function phyllotaxisConical(i, angleInRadians, spread, extrude){
    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle);
    let y = radius * Math.sin(current_angle);
    let z = i * - extrude;
    return {x, y, z};
}

export function phyllotaxisOnCurve(i, angleInRadians, spread, curve){
    let index = i * 3;
    let vertexOnCurve = {
        x: curve.attributes.position.array[index],
        y: curve.attributes.position.array[index+1],
        z: curve.attributes.position.array[index+2],
    }
    let curve_start = {
        x: curve.attributes.position.array[0],
        y: curve.attributes.position.array[1],
        z: curve.attributes.position.array[2],
    };

    // Keep in mind that these function is used to build a model of palm that grows
    // from the top to the bottom. Meaning that first I create the leaves and _then_
    // the trunk. The geometries will be orientated towards the previous geometries drawed. Meaning that
    // leaf n 100 will be oriented towards leaf 10, for example. The exact geometry it is defined by a percentage value.
    // For example the vertices of the trunk should look at a point the 10% of the curve behind them.
    let percent_of_the_curve = Math.floor((curve.attributes.position.array.length / 3.0) * 0.02);
    // if we are behind the percentage, let's look at the beginning of the curve
    let prev;
    if(i < percent_of_the_curve) {
        prev = curve_start;
    }else{
        prev = curve.attributes.position.array[i*3 -percent_of_the_curve*3];
    }
    
    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);

    let x = radius * Math.cos(current_angle)+ vertexOnCurve.x;
    let y = radius * Math.sin(current_angle)+ vertexOnCurve.y;
    let z = vertexOnCurve.z;
    return {x, y, z, prev, curve_start};
}