import * as THREE from 'three';
import React, { Component } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

class ThreeScene extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef()
    console.log(this.props)
  }

  wait_for_seconds = (second) => {
    return new Promise(resolve => setTimeout(resolve, second * 1000));
  }

  appendChildLoop = async (renderer) => {
    if (this.props.partModelPreviewScene) {
      this.props.partModelPreviewScene.appendChild( renderer.domElement )
      return
    }
    else {
      await this.wait_for_seconds(0.2)
      this.appendChildLoop(renderer)
    }
  }

  addPlyFile = async (scene, camera, renderer) => {
    const loader = new STLLoader();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));

    await loader.load(require("/root/innosale/client/src/nlp/static/4.stl"), async function (geometry) {
        console.log(geometry);
        geometry.computeVertexNormals();
        console.log(geometry);
        const material = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, flatShading: true, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.scale.multiplyScalar(0.05);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        await scene.add(mesh);
        await renderer.render(scene, camera)
        function animate() {
            requestAnimationFrame( animate );
            mesh.rotation.x += 0.01
            mesh.rotation.y += 0.01
            mesh.rotation.z += 0.01
            
            
            renderer.render( scene, camera );
        }
    
        animate();
    });

    
  }

  componentDidMount() {  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, this.props.width / this.props.height, 0.1, 2000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( this.props.width, this.props.height );

    this.appendChildLoop(renderer)
    this.addPlyFile(scene, camera, renderer)

    camera.position.z = 5;

    
  }

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    //<canvas ref={this.canvasRef} />
    return <></>;
  }
}

export default ThreeScene;
