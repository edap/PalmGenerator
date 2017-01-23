export function phyllotaxisSimple(i, angleInRadians, spread, extrude){
    let current_angle = i * angleInRadians;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle);
    let y = radius * Math.sin(current_angle);
    let z = 0.0;
    if(extrude){
        z = i * -.05;
    }
    return {x, y, z};
}

export function phyllotaxisSphere(i, angle, angle_b, spread, tot){
    let inc = Math.PI / tot;
    let current_angle = i * inc;
    let current_angle_b= i * angle_b;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
    let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
    let z = radius * Math.cos(current_angle);
    return {x, y, z};
}

