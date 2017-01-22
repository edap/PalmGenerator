import DAT from 'dat-gui';



export default class Gui extends DAT.GUI{
    constructor(){
        super();
        this.params = {
            geometry: "leaf",
            material: "standard",
            angle: 137.5,
            angle_b: 137.5,
            spread: 10,
            num: 1,
            rotate_flower: false,
            extrude_2Dflower: false,
            amplitude: 0.1,
            spherical:false,
            inc_bla: 0.5
        };

        this.add(this.params, "num").min(1).max(800).step(1);
        this.add(this.params, "geometry", ["sphere", "box", "lathe", "leaf"]);
        this.add(this.params, "material", ["standard", "wireframe", "phong"]);
        this.add(this.params, "angle").min(132.0).max(138.0).step(0.1);
        this.add(this.params, "angle_b").min(137.3).max(137.6).step(0.1);
        this.add(this.params, "spread").min(0).max(20).step(0.1);
        this.add(this.params, "amplitude").min(0).max(10).step(0.1);
        this.add(this.params, "inc_bla").min(0.1).max(1).step(0.1);
        this.add(this.params, "rotate_flower");
        this.add(this.params, "extrude_2Dflower");
        this.add(this.params, "spherical");
    }
}
