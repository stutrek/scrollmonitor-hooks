import React, { Component, useRef } from 'react';
import { useScrollMonitor, withScrollContainer } from './scrollmonitor-hooks';
import './App.css';

const WatchedElement = ({index}) => {
  const ref = useRef(null);
  const scrollState = useScrollMonitor(ref);

  let className;
  if (!scrollState.isInViewport) {
    className = '';
  } else if (scrollState.isFullyInViewport) {
    className = 'in';
  } else if (scrollState.isAboveViewport) {
    className = 'partial-above';
  } else if (scrollState.isBelowViewport) {
    className = 'partial-below';
  }

  return <span className={`box ${className}`} ref={ref}>{index}</span>
}

const count = parseInt(window.location.search.substr(1)) || 300;
const inContainer = window.location.search.indexOf('boxed') !== -1;

const arr = [];
for (let i=0; i < count; i++) {
  arr.push(i);
}

const Boxes = () => <div>
  {arr.map(i => <WatchedElement key={i} index={i} />)}
</div>;

const BoxesInContainer = withScrollContainer(React.forwardRef((props, ref) => <div ref={ref} className="shorty">
  {arr.map(i => <WatchedElement key={i} index={i} />)}
</div>));


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a href="https://github.com/stutrek/scrollmonitor-hooks">scrollmonitor-hooks</a>
          (scroll down)
          <br />
          <small>add ?1000 to the end of the URL to change the number of boxes.
          <br />
          <code>{`
const WatchedElement = ({index}) => {

  const ref = useRef(null);
  const scrollState = useScrollMonitor(ref);

  let className;
  if (!scrollState.isInViewport) {
    className = '';
  } else if (scrollState.isFullyInViewport) {
    className = 'in';
  } else if (scrollState.isAboveViewport) {
    className = 'partial-above';
  } else if (scrollState.isBelowViewport) {
    className = 'partial-below';
  }

  return <span className={\`box \${className}\`} ref={ref}>{index}</span>
}`}
          </code>
</small>

        </header>
        {inContainer ? <BoxesInContainer /> : <Boxes />}
      </div>
    );
  }
}

export default App;
