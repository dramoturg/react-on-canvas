import computeLayout from 'css-layout';

export default class Rect {
  constructor(ctx, style = {}, children) {
    this.ctx = ctx;
    this.style = style;

    // REVISIT Instead of saving the children we could also rely on React
    // to manage parent/child relations for us and just provide a
    // renderChildren() method instead.
    this.children = children;

    this.offset = {
      top: 0,
      left: 0,
    };
  }

  // Facebook's css-layout computes positions relative to the parent node.
  // Hence we have to pass the parent's absolute offset down to its children.
  updateOffset(parent) {
    const { children, layout } = this;
    this.offset = {
      top: parent.offset.top + layout.top,
      left: parent.offset.left + layout.left,
    };
    if (children) children.forEach(c => c.updateOffset(this));
  }

  // If css-layout has not been applied (could be too expensive to do it for
  // every node) return style.top / style.left instead.
  get position() {
    const { offset = { left: 0, top: 0 } } = this;
    const { top = 0, left = 0, width = 0, height = 0 } =
      this.layout || this.style;
    return {
      top: top + offset.top,
      left: left + offset.left,
      width,
      height,
    };
  }

  render() {
    const { style, position, children, ctx } = this;
    const { backgroundColor, border } = style;

    ctx.beginPath();
    ctx.rect(position.left, position.top, position.width, position.height);
    
    if (backgroundColor) {
      // solid background
      ctx.fillStyle = backgroundColor;
      ctx.fill();
    } else {
      // transparent background
      // could be a good idea to store the background in case the position/size of  
      // the children changes:
      /*
      if (this.savedBackground) {
        ctx.putImageData(this.savedBackground, position.left, position.top);
      }
      else {
        this.savedBackground = ctx.getImageData(position.left, position.top, position.width, position.height);
      }
      */
     ctx.fillStyle = '#fff';
      ctx.fill();
    }

    if (border) {
      ctx.lineWidth = border.width;
      ctx.strokeStyle = border.color;
      ctx.stroke();
    }

    this.renderChildren(children);
  }

  renderChildren(children) {
    const {style, ctx} = this;
    const {
      scrollLeft = 0,
      scrollTop = 0,
    } = style;
    ctx.save();
    if (style.overflow === 'hidden') {
      ctx.clip();
    }
    ctx.translate(-scrollLeft, -scrollTop);
    if (children) {
      children.forEach(n => n.render());
    }
    ctx.restore();
  }
}
