import LeafGeometry from './leafGeometry.js';

export default class PalmGenerator{
    constructor(options, foliage_geometry, trunk_geometry, selected_material, radius){
        
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
    
}
