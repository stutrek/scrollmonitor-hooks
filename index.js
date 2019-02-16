import { useLayoutEffect, useState } from 'react';
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

export const useScrollMonitor = (ref, {offsets=0, scrollMonitorContainer=scrollmonitor}={}) => {
	let { current } = ref;
	const [state, updateState] = useState(defaultState);

	const updateCheck = typeof offsets === 'number'
		? [current, offsets]
		: [current, offsets.top, offsets.bottom];

	useLayoutEffect(() => {
		if (current === null) {
			updateState({...defaultState});
			return;
		}

		const watcher = scrollMonitorContainer.create(current, offsets);

		const createUpdatedState = () => {
			return attrs.reduce((acc, attr) => {
				acc[attr] = watcher[attr]; 
				return acc;
			}, {});
		};

		watcher.on('stateChange', () => {
			updateState(createUpdatedState());
		});

		updateState(createUpdatedState());

		return () => {
			watcher.destory();
		};
	}, updateCheck);

	return state;
};