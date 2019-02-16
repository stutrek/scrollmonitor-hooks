import React, { useLayoutEffect, useState, useRef, useContext, createContext } from 'react';
import scrollmonitor from 'scrollmonitor';

const attrs = [
	'isInViewport',
	'isFullyInViewport',
	'isAboveViewport',
	'isBelowViewport',
	'top',
	'bottom',
	'height',
];

const defaultState = {
	isInViewport: 0,
	isFullyInViewport: 0,
	isAboveViewport: 0,
	isBelowViewport: 0,
	top: 0,
	bottom: 0,
	height: 0,
};

const ScrollContainerContext = createContext(scrollmonitor);

export const useScrollMonitorRaw = (ref, callbacks, offsets=0) => {
	let { current } = ref;
	const [waitCount, updateWaitCount] = useState(0);
	const scrollMonitorContainer = useContext(ScrollContainerContext);

	const updateCheck = typeof offsets === 'number'
		? [current, callbacks, scrollMonitorContainer, offsets]
		: [current, callbacks, scrollMonitorContainer, offsets.top, offsets.bottom];

	useLayoutEffect(() => {
		if (current === null) {
			updateWaitCount(waitCount+1);
			return;
		}

		const watcher = scrollMonitorContainer.create(current, offsets);

		for (let eventName in callbacks) {
			watcher.on(eventName, () => callbacks[eventName](watcher));
			watcher.update();
			watcher.triggerCallbacks();
			if (callbacks.stateChange) {
				callbacks.stateChange(watcher);
			}
		}

		return () => {
			watcher.destroy();
		};
	}, updateCheck);

	return;
};

const createUpdatedState = (watcher) => {
	return attrs.reduce((acc, attr) => {
		acc[attr] = watcher[attr]; 
		return acc;
	}, {});
};

export const useScrollMonitor = (ref, offsets=0) => {
	const [state, updateState] = useState(defaultState);
	const [callbacks] = useState({
		stateChange: (watcher) => {
			updateState(createUpdatedState(watcher));
		}
	});

	useScrollMonitorRaw(ref, callbacks, offsets);

	return state;
};

const useScrollContainer = (ref) => {
	const [container, setContainer] = useState(scrollmonitor);
	const [waitCount, updateWaitCount] = useState(0);

	useLayoutEffect(() => {
		if (ref.current === null) {
			updateWaitCount(waitCount+1);
			return;
		}
		console.log('setting container);')
		setContainer(scrollmonitor.createContainer(ref.current));
	}, [ref.current]);

	return container;
};

export const withScrollContainer = Component => props => {
	const ref = useRef(null);
	const container = useScrollContainer(ref);
	return <ScrollContainerContext.Provider value={container}>
		<Component ref={ref} {...props} />
	</ScrollContainerContext.Provider>;
};