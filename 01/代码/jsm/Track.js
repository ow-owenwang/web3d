// 时间轨
export default class Track {
    constructor(target) {
        this.target = target; // 时间轨上的目标对象
        this.parent = null; // 父对象，只能是合成对象
        this.start = 0; // 起始时间，即时间轨的建立时间
        this.timeLen = 5; // 时间轨总时长
        this.loop = false; // 是否循环
        this.keyMap = new Map(); // 关键帧集合
        this.onEnd = () => {
        }
        this.prevTime = 0
    }

    update(t) {
        const {keyMap, timeLen, target, loop, start, prevTime} = this;
        let time = t - start;
        if (timeLen >= prevTime && timeLen < time) {
            this.onEnd()
        }
        this.prevTime = time
        if (loop) {
            time = time % timeLen;
        }
        for (const [key, fms] of keyMap) {
            const last = fms.length - 1;
            if (time < fms[0][0]) {
                target[key] = fms[0][1];
            } else if (time > fms[last][0]) {
                target[key] = fms[last][1];
            } else {
                target[key] = getValBetweenFms(time, fms, last);
            }
        }
    }
}

/*
    - time 本地时间
    - fms 某个属性的关键帧集合
    - last 最后一个关键帧的索引位置
 */
function getValBetweenFms(time, fms, last) {
    for (let i = 0; i < last; i++) {
        const fm1 = fms[i];
        const fm2 = fms[i + 1];
        if (time >= fm1[0] && time <= fm2[0]) {
            const delta = {
                x: fm2[0] - fm1[0],
                y: fm2[1] - fm1[1],
            };
            const k = delta.y / delta.x;
            const b = fm1[1] - fm1[0] * k;
            return k * time + b;
        }
    }
}
