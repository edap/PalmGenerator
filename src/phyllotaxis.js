export function phyllotaxisSimple(i, angleInRadians, spread, extrude){
    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle);
    let y = radius * Math.sin(current_angle);
    let z = 0.0;
    if (extrude) {
        z = i * -.05;
    }
    return {x, y, z};
}

export function phyllotaxisConical(i, angleInRadians, spread, extrude){
    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle);
    let y = radius * Math.sin(current_angle);
    let z = i * - extrude;
    return {x, y, z};
}

export function phyllotaxisApple(i, angle, spread, tot){
    let inc = Math.PI / tot;
    let current_angle = i * inc;
    let current_angle_b= i * angle;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
    let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
    let z = radius * Math.cos(current_angle);
    return {x, y, z};
}

export function phyllotaxisOnCurve(i, angleInRadians, spread, curve){
    let vertexOnCurve = curve.vertices[i];
    let curve_start = curve.vertices[0];
    // Keep in mind that these function is used to build Palms. Palms that grows
    // from the top to the bottom. Meaning that first I create the leaves and _then_
    // the trunk. The geometries will be orientated towards the previous geometries drawed. Meming that
    // leaf n 100 will be look at leaf 10, for example. The exact geometry it is defined by a percentage value.
    // For example the vertices of the trunk should look at a point the 10% of the curve behind them.
    let percent_of_the_curve = Math.floor(curve.vertices.length * 0.02);
    // if we are behind the percentage, let's look at the beginning of the curve
    let prev = (i < percent_of_the_curve )? curve_start : curve.vertices[i-percent_of_the_curve];

    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle)+ vertexOnCurve.x;
    let y = radius * Math.sin(current_angle)+ vertexOnCurve.y;
    let z = vertexOnCurve.z;
    return {x, y, z, prev, curve_start};
}

// this function is called Wrong because it is wrong! it was born as mistake
// while i was passing angles in degreees without converting them to radians.
// But sometimes there are strange patterns that generate a nice effect,
// and I've decided to keep it
// To use it, pass the angles in degrees
export function phyllotaxisWrong(i, angle, spread, tot){
    //let inc = Math.PI / tot;
    let inc = 180.0 / tot;
    let current_angle = i * inc;
    let current_angle_b= i * angle;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
    let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
    let z = radius * Math.cos(current_angle);
    return {x, y, z};
}
