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
            spread: 10,
            angle: 137.5,
            num: 742,
            z_decrease: 0.05,
            foliage_start_at: 100,

            foliage_geometry: "sphere",
            angle_y: 100,
            angle_x: 100,
            bla: 2,
            scale_x: 4,
            scale_y: 1,
            color: 0x000022,
            emissive: 0x28000,
            specular: 0x445566,
            shininess: 50,

            trunk_geometry: "box",

            anim_spread: true,
            zoetrope_rotation: 137.035,
            amplitude: 0.1,
            zoetrope:true,
            zoetrope_angle:139.71,

            backgroundColor:"#57be92",
            ambientLight:"#cf9e00"
        };
        this.remember(this.params);


        this.add(this.params, "spread").min(0).max(20).step(0.1).listen();
        this.add(this.params, "angle").min(132.0).max(138.0).step(0.01);
        this.add(this.params, "num").min(1).max(1200).step(1).listen();
        this.add(this.params, "z_decrease").min(0.04).max(0.50).step(0.01);
        this.add(this.params, "foliage_start_at").min(0).max(1200);
        this.add(this.params, "trunk_geometry", ["sphere", "box", "lathe", "cone"]);

        let foliage = this.addFolder('foliage');
        foliage.add(this.params, "foliage_geometry", ["sphere", "box", "lathe", "cone"]);
        foliage.add(this.params, "angle_y").min(-10).max(50);
        foliage.add(this.params, "bla").min(0).max(30).step(0.5);
        foliage.add(this.params, "angle_x").min(1).max(160);// questo angolo non l'hai ancora usato. Valuta.
        foliage.add(this.params, "scale_x").min(5).max(40);
        foliage.add(this.params, "scale_y").min(1).max(8);

        let mat = this.addFolder('Material');
        mat.addColor(this.params, 'color' ).onChange( this._handleColorChange( this.material.color ) );
        mat.addColor(this.params, 'emissive' ).onChange( this._handleColorChange( this.material.emissive ) );
        mat.addColor(this.params, 'specular' ).onChange( this._handleColorChange( this.material.specular ) );
        mat.add(this.params, 'shininess', 0, 100).onChange( (val)=>{this.material.shininess = val;});

        let anim = this.addFolder('animation');
        anim.add(this.params, "anim_spread");
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
