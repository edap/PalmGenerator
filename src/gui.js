import DAT from 'dat-gui';
import {Color, Fog} from 'THREE';

export default class Gui extends DAT.GUI{
    constructor(){
        super(
            {
                load: JSON,
                preset: 'Flow'
            }
        );
        this.params = {
            geometry: "leaf",
            material: "standard",
            angle: 137.5,
            angle_b: 137.5,
            spread: 10,
            anim_spread: true,
            num: 5,
            amplitude: 0.1,
            spherical:false,
            rotate_flower: false,
            rotation_speed:0.013,
            extrude_2Dflower: false
        };


        this.add(this.params, "num").min(1).max(800).step(1);
        this.add(this.params, "geometry", ["sphere", "box", "lathe", "leaf"]);
        this.add(this.params, "material", ["standard", "wireframe", "phong","lambert"]).onChange(this._updateMaterialFolder());
        this.add(this.params, "angle").min(132.0).max(138.0).step(0.01);
        this.add(this.params, "angle_b").min(137.3).max(137.6).step(0.01);
        this.add(this.params, "spread").min(0).max(20).step(0.1).listen();
        this.add(this.params, "extrude_2Dflower");
        this.add(this.params, "spherical");
        let anim = this.addFolder('animation');
        anim.add(this.params, "rotate_flower");
        anim.add(this.params, "anim_spread");
        anim.add(this.params, "rotation_speed").min(0.005).max(0.1).step(0.01);
        anim.add(this.params, "amplitude").min(0).max(9).step(0.01);

    }

    addMaterials(materials){
        this.materials = materials;
    }

    // credtis to these methods goes to Greg Tatum https://threejs.org/docs/scenes/js/material.js
    addScene ( scene, ambientLight, renderer ) {
	      let folder = this.addFolder('Scene');
	      let data = {
		        background : "#000000",
		        "ambient light" : ambientLight.color.getHex()
	      };

	      let color = new Color();
	      let colorConvert = this._handleColorChange( color );

	      folder.addColor( data, "background" ).onChange( function ( value ) {
		        colorConvert( value );
		        renderer.setClearColor( color.getHex() );

	      } );

	      folder.addColor( data, "ambient light" ).onChange( this._handleColorChange( ambientLight.color ) );
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

    _updateMaterialFolder(){
	      return ( material ) => {
            if (!this.materials){
                console.log(
                    "If you want to edit the materials in the GUI, you have to add them using gui.addMaterials"
                );
                return;
            };
            switch (material) {
                case "phong":
                    this._addPhongMaterial(this.materials[material]);
                    break;
                case "standard":
                    this._addStandardMaterial(this.materials[material]);
                    break;
                case "wireframe":
                    this._addMaterialColor(this.materials[material]);
                    break;
                case "lambert":
                    this._addLambertMaterial(this.materials[material]);
                    break;
                default:
                this._addMaterialColor(this.materials[material]);
            }
        };
    }


    _removeFolder(name) {
        let folder = this.__folders[name];
        if (!folder) {
            return;
        }
        folder.close();
        this.__ul.removeChild(folder.domElement.parentNode);
        delete this.__folders[name];
        this.onResize();
    }

    _addPhongMaterial (material) {
        this._removeFolder("Material");
        var folder = this.addFolder('Material');
        var data = {
            color : material.color.getHex(),
            emissive : material.emissive.getHex(),
            specular : material.specular.getHex()
        };

        folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
        folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
        folder.addColor( data, 'specular' ).onChange( this._handleColorChange( material.specular ) );
        folder.add( material, 'shininess', 0, 100);
        folder.add( material, 'wireframe' );
        folder.add( material, 'wireframeLinewidth', 0, 10 );
        folder.add( material, 'fog' );
    }

    _addStandardMaterial (material) {
        this._removeFolder("Material");
        var folder = this.addFolder('Material');
        let data = {
            color : material.color.getHex(),
            emissive : material.emissive.getHex()
        };

        folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
        folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
        folder.add( material, 'roughness', 0, 1 );
        folder.add( material, 'metalness', 0, 1 );
        folder.add( material, 'wireframe' );
        folder.add( material, 'wireframeLinewidth', 0, 10 );
        folder.add( material, 'fog' );
    }
    _addLambertMaterial(material){
        this._removeFolder("Material");
        let folder = this.addFolder('Material');
        let data = {
            color : material.color.getHex(),
            emissive : material.emissive.getHex()
        };

        folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
        folder.addColor( data, 'emissive' ).onChange( this._handleColorChange( material.emissive ) );
        folder.add( material, 'wireframe' );
        folder.add( material, 'wireframeLinewidth', 0, 10 );
        folder.add( material, 'fog' );
        folder.add( material, 'reflectivity', 0, 1 );
        folder.add( material, 'refractionRatio', 0, 1 );
    }

    _addMaterialColor(material){
        this._removeFolder("Material");
        var folder = this.addFolder('Material');
        let data = {
            color : material.color.getHex()
        };
        folder.addColor( data, 'color' ).onChange( this._handleColorChange( material.color ) );
    }
}
