import React, { Component } from 'react';
import CanvasRenderer from './CanvasRenderer';
import { Spring } from 'react-spring/dist/universal';

class App extends Component {
  state = {
    scroll: 0,
  };
  componentDidMount() {
    document.addEventListener('keyup', ev => {
      this.setState({ scroll: this.state.scroll ? 0 : 500 });
    });
  }
  render() {
    return (
      <Spring to={{ scrollLeft: this.state.scroll }}>
        {styles => (
          <rect
            style={{
              ...styles,
              width: 600,
              height: 150,
            }}
          >
            {['silver', 'tomato', 'orange', 'gold', 'yellow', 'lime'].map(
              (color, i) => (
                <rect
                  key={i}
                  style={{
                    backgroundColor: color,
                    position: 'absolute',
                    width: 100,
                    left: 100 * i,
                    top: 0,
                    height: 150,
                  }}
                />
              )
            )}
          </rect>
        )}
      </Spring>
    );
  }
}

CanvasRenderer.render(<App />, document.body);
