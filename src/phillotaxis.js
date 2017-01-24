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

export function phyllotaxisApple(i, angle, angle_b, spread, tot){
    let inc = Math.PI / tot;
    let current_angle = i * inc;
    let current_angle_b= i * angle_b;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
    let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
    let z = radius * Math.cos(current_angle);
    return {x, y, z};
}

// this function is called Wrong because it is wrong! it was born as mistake
// while i was passing angles in degreees without converting them to radians.
// But sometimes there are strange patterns that generate a nice effect,
// and I've decided to keep it
// To use it, pass the angles in degrees
export function phyllotaxisWrong(i, angle, angle_b, spread, tot){
    //let inc = Math.PI / tot;
    let inc = 180.0 / tot;
    let current_angle = i * inc;
    let current_angle_b= i * angle_b;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
    let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
    let z = radius * Math.cos(current_angle);
    return {x, y, z};
}


