# scrollmonitor-hooks

These React hooks for the [scrollmonitor](http://github.com/stutrek/scrollmonitor) provide an object with the current scroll state of an element. Use the `withScrollContainer` HOC to create a container element for in-page scrolling,

[see a demo](https://stutrek.github.io/scrollmonitor-hooks)

## `useScrollState`

1. Create a ref
2. Pass it to `const scrollState = useScrollState(ref)`
3. Use the `scrollState` object to know the current scroll state.
4. Pass the ref to the item you want to watch.

### Example

```javascript
import { useScrollState } from 'scrollmonitor-hooks';

const WatchedElement = ({children}) => {
  // 1. Create a ref
  const ref = useRef(null);
  // 2. Pass it to `useScrollState`
  const scrollState = useScrollState(ref);
  
  // 3. Get the current scroll state.
  let className;
  if (!scrollState.isInViewport) {
    className = 'in';
  } else {
    className = 'out';
  }

  return <span
    className={className}
    ref={ref} // <----- 4. be sure to pass the ref!
  >
    {children}
  </span>;
}
```

### Arguments

```javascript
useScrollState(ref, offsets);
```
* `ref` - this should be the return value of React's `useRef` hook. It must be passed as a ref to the element you want to watch.
 * offsets - [same as scrollmonitor](http://github.com/stutrek/scrollmonitor#offsets)

### `scrollState` object

This has the same data properties as the [scrollmonitor](http://github.com/stutrek/scrollmonitor)'s watcher object, except it is immutable.

* `scrollState.isInViewport` - true if any part of the element is visible, false if not.
* `scrollState.isFullyInViewport` - true if the entire element is visible [1].
* `scrollState.isAboveViewport` - true if any part of the element is above the viewport.
* `scrollState.isBelowViewport` - true if any part of the element is below the viewport.
* `scrollState.top` - distance from the top of the document to the top of this component.
* `scrollState.bottom` - distance from the top of the document to the bottom of this component.
* `scrollState.height` - top - bottom.

1. If the element is larger than the viewport `isFullyInViewport` is true when the element spans the entire viewport.

_note: all values will be false the first render because React has not yet created the DOM._

## `withScrollContainer`

If you have a scrolling container on your page (for example, a div with overflow: auto), you must wrap it in the `withScrollContainer` HOC. This container will be passed to all child components with React's Context API.

Be sure to call `withScrollContainer` at the top level of your module and not in a render function.

```javascript
const BoxesInContainer = withScrollContainer(<MyContainer />);
```

## `useScrollMonitor`

If you need side effects or additional speed, `useScrollMonitor` will provide direct access to scrollmonitor's callbacks.

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
```
