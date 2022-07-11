/**
 * 录制类
 */
class Recorder {
  constructor() {
    this.startTime = 0;
    this.records = [];
    this.timer = null;
  }
  /**
   * 是否已录制
   */
  hasRecords() {
    return this.records !== null;
  }
  /**
   * 录制关键帧
   * @param state five 的 state
   * @returns
   */
  record(state) {
    if (this.records === null) return;
    this.records.push({
      state: Object.assign({}, state),
      time: Date.now() - this.startTime
    });
    
  }

  /**
   * 开始录制
   */
  startRecording() {
    this.startTime = Date.now();
    // this.records = [];
  }
  /**
   * 结束录制
   */
  endRecording() {
    this.startTime = 0;
  }

  initData(list) {
    this.records = list
  }

  getRecords() {
    return this.records
  }

  clearRecords() {
    this.records = [];
    return this.records
  }

  delRecord(index) {
    this.records.splice(index, 1)
    return this.records
  }

  stopPlay() {
    clearTimeout(this.timer)
    this.timer = null
  }

  /**
   * 回放录制
   * @param callback 关键帧回调
   * @returns 当前是否有录制
   */
  play(callback) {
    if (this.records === null || this.records.length === 0) return false;
    const records = this.records.slice();
    const keyframe = keyIndex => {
      const current = records[keyIndex];
      const next = records[keyIndex + 1];
      callback(current.state, next === undefined);
      if (next) {
        const delayU = next.time - current.time;
        const delay = delayU > 4000 ? 1000*3 : delayU
        this.timer = setTimeout(() => keyframe(keyIndex + 1), delay);
      }
    }
    keyframe(0);
    return true;
  }
}

export { Recorder };