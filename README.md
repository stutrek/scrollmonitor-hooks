# scrollmonitor-hooks

These React hooks for the [scrollmonitor](http://github.com/stutrek/scrollmonitor) provide an object with the current scroll state of an element. You can painlessly create a container element for in-page scrolling containers,

[see a demo](https://stutrek.github.io/scrollmonitor-hooks)

## `useScrollState`

1. Create a ref
2. Pass it to `const scrollState = useScrollState(ref)`
3. Use the `scrollState` object to know the current scroll state.

```javascript
import { useScrollState } from 'scrollmonitor-hooks';

const WatchedElement = ({children}) => {
  const ref = useRef(null);
  const scrollState = useScrollState(ref);

  let className;
  if (!scrollState.isInViewport) {
    className = 'in';
  } else {
    className = 'out';
  }

  return <span
    className={className}
    ref={ref} // be sure to pass the ref!
  >
    {children}
  </span>;
}
```

### Arguments

```javascript
useScrollState(ref, offsets);
```
* `ref` - this should be the return value of React's `getRef` hook. It must be passed as a ref to the element you want to watch.
 * offsets - [same as scrollmonitor](http://github.com/stutrek/scrollmonitor#offsets)

### `scrollState` object

This has the same data properties as the [scrollmonitor](http://github.com/stutrek/scrollmonitor), except it is immutable.

* `scrollState.isInViewport` - true if any part of the element is visible, false if not.
* `scrollState.isFullyInViewport` - true if the entire element is visible [1].
* `scrollState.isAboveViewport` - true if any part of the element is above the viewport.
* `scrollState.isBelowViewport` - true if any part of the element is below the viewport.
* `scrollState.top` - distance from the top of the document to the top of this watcher.
* `scrollState.bottom` - distance from the top of the document to the bottom of this watcher.
* `scrollState.height` - top - bottom.

1. If the element is larger than the viewport `isFullyInViewport` is true when the element spans the entire viewport.

## `withScrollContainer`

If you need a scrolling container within your page, this makes all child components use this specific root. It uses React's context API to pass the container down.

```javascript
const BoxesInContainer = withScrollContainer(<MyContainer />);
```


## `useScrollMonitor`

If you need additional speed or access to the monitor directly, you can use `useScrollMonitor`. This lets you put callbacks directly on the monitor.

```javascript
import { useScrollMonitor } from 'scrollmonitor-hooks';

const callbacks = {
  enterViewport: (watcher) => {
    track('item entered viewport', watcher.watchItem.getAttribute('data-tracking-id'));
  }
}

const Component = ({children}) => {
  const ref = useRef(null);
  useScrollMonitor(ref, callbacks);

  return <span
    className={`box ${className}`}
    ref={ref}
  >
    {children}
  </span>;
}