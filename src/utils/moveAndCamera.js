
import { cameraToVec3, calcCenterPoint } from '@/views/fiveVR/assets/js/tools'

export function moveAndCamera(item, five, panoIndex1, position1) {
    const panoIndex = panoIndex1 || item.extra.info.panoIndex
    let position = ''
    if (position1) {
        position = position1
    } else {
        const points = item.extra.info.points
        const {x,y,z} = calcCenterPoint(points)
        position = [x,y,z]
    }
    five.moveToPano(panoIndex, {
        moveEndCallback: () => {
            setTimeout(() => {
                cameraToVec3(position, five)
            }, 200)
        }
    })
    
}