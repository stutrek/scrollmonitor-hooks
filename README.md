# scrollmonitor-hooks

React hooks for the scrollmonitor.

## Usage

```javascript
import { useScrollMonitor } from 'scrollmonitor-hooks';

const WatchedElement = ({children}) => {
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

  return <span
    className={`box ${className}`}
    ref={ref}
  >
    {children}
  </span>;
}
```