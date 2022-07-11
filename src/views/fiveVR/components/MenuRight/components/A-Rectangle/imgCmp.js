/**
 * thressjs的图片展示
 */

 import * as THREE from "three";

 const defaultImg = 'https://vr.bookan.com.cn/backend_management/03deebbf.png'

 class ImgCmp {
    constructor(five) {
      this.five = five;
      this.mesh = null;
    }

    /**
     * 渲染方法
     */
    render(points, src) {
        let p1 = [
          points[0],
          points[1],
          points[2],
          points[0],
          points[2],
          points[3],
        ].map((it) => [it.x, it.y, it.z]);
        let p2 = [];
        for (let it of p1) {
          p2 = p2.concat(it);
        }
        let vertices = new Float32Array(p2);
      
        let geometry = new THREE.BufferGeometry();
      
        var uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      
        let texture = new THREE.TextureLoader().load(src || defaultImg);
        // let texture = new THREE.TextureLoader().load('../../../../assets/img/logo_t.png');
      
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        let material = new THREE.MeshBasicMaterial({
          map: texture,
          blending: THREE.CustomBlending,
          blendSrc: THREE.SrcColorFactor,
          depthTest: false,
          depthWrite: false,
        });
      
        this.mesh = new THREE.Mesh(geometry, material);
        this.five.scene.add(this.mesh);
    };

    remove(){
      this.five.scene.remove(this.mesh);
      this.mesh = null;
    };
   
  }
  
  export { ImgCmp };