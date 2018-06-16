export default class Canvas {
  constructor(parent) {
    const element = document.createElement('canvas');
    const scale = window.devicePixelRatio;
    Object.assign(element.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    });
    if (parent) parent.appendChild(element);
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
    element.width = this.width * scale;
    element.height = this.height * scale;
    const ctx = element.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, element.width, element.height);
    Object.assign(this, { element, ctx });
  }
  renderChildren(children) {
    children.forEach(c => c.render());
  }
}
