const SPRING = 0.01;
const FRICTION = 0.9;
const FOCUS_POSITION = 300;

class PARTICLE {
  // x,y,z 为当前的坐标，vx,vy,vz 则是3个方向的速度
  constructor(center) {
    this.center = center;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  }

  // 设置这些粒子需要运动到的终点(下一个位置)
  setAxis(axis) {
    this.nextX = axis.x;
    this.nextY = axis.y;
    this.nextZ = axis.z;
    this.color = axis.color;
  }
  
  step() {
    // 弹力模型 距离目标越远速度越快
    this.vx += (this.nextX - this.x) * SPRING;
    this.vy += (this.nextY - this.y) * SPRING;
    this.vz += (this.nextZ - this.z) * SPRING;
    // 摩擦系数 让粒子可以趋向稳定
    this.vx *= FRICTION;
    this.vy *= FRICTION;
    this.vz *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
  }

  getAxis2D() {
    this.step();
    // 3D 坐标下的 2D 偏移，暂且只考虑位置，不考虑大小变化
    const scale = FOCUS_POSITION / (FOCUS_POSITION + this.z);
    return {
      x: this.center.x + (this.x * scale),
      y: this.center.y - (this.y * scale),
    };
  }
}

export default PARTICLE;
