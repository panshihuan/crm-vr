import * as THREE from "three";

// 相机朝向指定vec3
const cameraToVec3 = (position, five, limitDir) => {
    let o = 2 * Math.PI;
    let h = new THREE.Vector3(...position).sub(five.camera.position).normalize();
    let v = -Math.atan2(h.x, -h.z);
    v = (v % o + o) % o;
    var y = -Math.asin(h.y / 1), m = five.camera.fov;
    five.setState({
        ...(limitDir == 'latitude' ? null : { longitude: v }),
        ...(limitDir == 'longitude' ? null : { latitude: y }),
    })
}

// 通过多点（1, 2，4）坐标计算中心点坐标
const calcCenterPoint = (points) => {
    const twoPointCenter = (p1, p2) => {
        return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, z: (p1.z + p2.z) / 2 };
    }

    if (points.length == 4) {
        let p1 = twoPointCenter(points[0], points[2]);
        let p2 = twoPointCenter(points[1], points[3]);
        return twoPointCenter(p1, p2);
    }
    else if (points.length == 2) {
        return twoPointCenter(points[0], points[1]);
    }
    else if (points.length == 1) {
        return points[0];
    }
    throw new Error("参数数量不正确！");
}

const arrowSet = ({ arrow, start, end, percent = 0.1, opacity = 0.4 }) => {
    let x = start.standing_position[0] + (end.standing_position[0] - start.standing_position[0]) * percent;
    let z = start.standing_position[2] + (end.standing_position[2] - start.standing_position[2]) * percent;
    // arrow.rotation.x = -Math.PI / 6;
    // let x = start.standing_position[0];
    // let z = start.standing_position[2];
    for (let item of arrow.children) {
        // console.log(item);
        item.material.transparent = true;
        item.material.opacity = opacity;
        // item.up = { x: 0, y: 1, z: 1 };
    }
    arrow.scale.set(0.3, 0.3, 0.3)
    let y = start.standing_position[1] + (start.position[1] - start.standing_position[1]) * 0.3;
    arrow.position.set(x, y, z);
    arrow.lookAt(...end.standing_position);

    // start.position[1] * 2
}


const rayClick = (event) => {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    mouse.x = (event.clientX / document.body.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / document.body.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, five.camera);

    // console.log(group);
    var intersects = raycaster.intersectObjects(five.scene.children, true);
    console.log(intersects);
}

export {
    cameraToVec3,
    calcCenterPoint,
}