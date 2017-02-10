import LeafGeometry from './leafGeometry.js';
import {phyllotaxisConical} from './phillotaxis.js';

export default class PalmGenerator{
    constructor(options, foliage_geometry, trunk_geometry, selected_material, radius){
        let options = this.merge_and_validate(options, this.default_options());
        console.log(options);
    }

    default_options(){
        return {
            length:20,
            length_stem:4,
            width_stem:2,
            leaf_width:0.5,
            leaf_up:1,
            density:2,
            positive_curvature: 0.05,
            positive_curvature_border: 0.05,
            leaf_inclination: 0.2

        };
    }

    merge_and_validate(options, defaults){
        let opt = Object.assign(defaults, options);
        return opt;
    }

}
