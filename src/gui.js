import DAT from 'dat-gui';
import {Color, Fog} from 'THREE';

export default class Gui extends DAT.GUI{
    constructor(material){
        super(
            {
                load: JSON,
                preset: 'Default'
            }
        );
        this.material = material;
        this.params = {
            spread: 0.2,
            angle: 137.5,
            num: 1200,
            z_decrease: 0.05,
            foliage_start_at: 30,

            starting_angle_y: 60,
            angle_y: 29,
            bla: 2,
            scale_x: 5,
            scale_y: 1,
            scale_as_grows:true,
            color: 0x000022,
            emissive: 0x28000,
            specular: 0x445566,
            shininess: 50,

            length:50,
            length_stem:4,
            width_stem:0.5,
            leaf_width:0.5,
            density:30,
            curvature: 0.03,
            curvature_border: 0.005,
            leaf_inclination: 0.2,

            trunk_geometry: "box",

            anim_spread: false,
            anim_decrease_objects: false,
            zoetrope_rotation: 137.035,
            amplitude: 0.1,
            zoetrope:false,
            zoetrope_angle:139.71,

            backgroundColor:"#57be92",
            ambientLight:"#cf9e00"
        };
        //this.remember(this.params);


        this.add(this.params, "spread").min(0).max(0.7).step(0.1).listen();
        this.add(this.params, "angle").min(132.0).max(138.0).step(0.01);
        //this.add(this.params, "num").min(60).max(1200).step(1).listen();
        this.add(this.params, "z_decrease").min(0.04).max(0.25).step(0.01);
        this.add(this.params, "foliage_start_at").min(30).max(320);
        this.add(this.params, "trunk_geometry", ["sphere", "box"]);

        let foliage = this.addFolder('foliage');
        foliage.add(this.params, "angle_y").min(0).max(80);
        foliage.add(this.params, "starting_angle_y").min(60).max(100);
        foliage.add(this.params, "scale_x").min(5).max(17);
        foliage.add(this.params, "scale_y").min(0.1).max(1.3);
        foliage.add(this.params, "scale_as_grows");

        let leaf = this.addFolder('leaf');
        leaf.add(this.params, "length").min(20).max(90).step(1);
        leaf.add(this.params, "length_stem").min(1).max(10).step(1);
        leaf.add(this.params, "width_stem").min(0.2).max(2.4).step(0.1);
        leaf.add(this.params, "leaf_width").min(0.1).max(0.9).step(0.1);
        leaf.add(this.params, "density").min(15).max(80).step(1);
        leaf.add(this.params, "curvature").min(0.01).max(0.04).step(0.01);
        leaf.add(this.params, "curvature_border").min(0.001).max(0.008).step(0.001);
        leaf.add(this.params, "leaf_inclination").min(0.1).max(1.0).step(0.1);

        let mat = this.addFolder('Material');
        mat.addColor(this.params, 'color' ).onChange( this._handleColorChange( this.material.color ) );
        mat.addColor(this.params, 'emissive' ).onChange( this._handleColorChange( this.material.emissive ) );
        mat.addColor(this.params, 'specular' ).onChange( this._handleColorChange( this.material.specular ) );
        mat.add(this.params, 'shininess', 0, 100).onChange( (val)=>{this.material.shininess = val;});

        let anim = this.addFolder('animation');
        anim.add(this.params, "anim_spread");
        anim.add(this.params, "anim_decrease_objects");
        anim.add(this.params, "zoetrope");
        anim.add(this.params, "zoetrope_angle").min(130).max(150).step(0.01);
        anim.add(this.params, "amplitude").min(0).max(1200).step(0.01);
    }

    // credtis to these methods goes to Greg Tatum https://threejs.org/docs/scenes/js/material.js
    addScene ( scene, ambientLight, renderer ) {
	      let folder = this.addFolder('Scene');
	      let data = {
	      };

	      let color = new Color();
	      let colorConvert = this._handleColorChange( color );

	      folder.addColor( this.params, "backgroundColor" ).onChange( function ( value ) {
		        colorConvert( value );
		        renderer.setClearColor( color.getHex() );

	      } );

	      folder.addColor( this.params, "ambientLight" ).onChange( this._handleColorChange( ambientLight.color ) );
	      this.guiSceneFog( folder, scene );
    }

    guiSceneFog ( folder, scene ) {
	      let fogFolder = folder.addFolder('scene.fog');
	      let fog = new Fog( 0x3f7b9d, 0, 60 );
	      let data = {
		        fog : {
			          "THREE.Fog()" : false,
			          "scene.fog.color" : fog.color.getHex()
		        }
	      };

	      fogFolder.add( data.fog, 'THREE.Fog()' ).onChange( function ( useFog ) {
		        if ( useFog ) {
			          scene.fog = fog;
		        } else {
			          scene.fog = null;
		        }
	      } );
	      fogFolder.addColor( data.fog, 'scene.fog.color').onChange( this._handleColorChange( fog.color ) );
    }

    _handleColorChange ( color ) {
	      return ( value ) => {
		        if (typeof value === "string") {
			          value = value.replace('#', '0x');
		        }
		        color.setHex( value );
        };
    }

}
