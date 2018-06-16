export default class Text {
  constructor(style = {}, text) {
    this.style = style;
    this.text = text;
    this.style.measure = this.measure.bind(this);
  }

  updateOffset(parent) {
    this.offset = {
      top: parent.offset.top + this.layout.top,
      left: parent.offset.left + this.layout.left,
    };
  }

  align(left, width, lineWidth) {
    const { textAlign } = this.style;
    if (textAlign === 'center') return left + width / 2 - lineWidth / 2;
    if (textAlign === 'right') return left + width - lineWidth;
    return left;
  }

  measure(width) {
    console.log('MEASURE!', width);
    return {
      width: 200,
      height: 100,
    };
  }

  render(ctx) {
    const { left, top, width, height } = this.layout;
    const {
      fontFamily = 'sans-serif',
      fontStyle = 'regular',
      fontWeight = 'normal',
      fontSize = 16,
      lineHeight = 18,
      backgroundColor = 'transparent',
      color = '#000',
    } = this.style;

    //textMetrics = measureText(text, width, fontFace, fontSize, lineHeight);

    ctx.save();

    ctx.fillStyle = color;

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // TODO use font measurer
    const lines = this.text.split(/\n/);

    lines.forEach((line, index, lines) => {
      let text = line;
      const isLast = index == lines.length - 1;
      const y = top + lineHeight * index + fontSize;
      const x = this.align(left, width, line.width);
      /*
      if (!isLast) {
        const nextY = fontSize + lineHeight * (index + 1);
        if (nextY > height) {
          text = text.replace(/,?\s?\w+$/, '…');
        }
      }
      if (y <= height + y) {
        // Draw the background
        if (backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(x, y, line.width, lineHeight);
        }
        */
      ctx.fillText(text, this.offset.left + x, this.offset.top + y);
      //}
    });

    ctx.restore();
  }
}
