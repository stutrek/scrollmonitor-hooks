var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { useLayoutEffect, useState } from 'react';
import scrollmonitor from 'scrollmonitor';

const attrs = ['isInViewport', 'isFullyInViewport', 'isAboveViewport', 'isBelowViewport', 'top', 'bottom', 'height'];

const defaultState = {
	isInViewport: 0,
	isFullyInViewport: 0,
	isAboveViewport: 0,
	isBelowViewport: 0,
	top: 0,
	bottom: 0,
	height: 0
};

export const useScrollMonitor = (ref, { offsets = 0, scrollMonitorContainer = scrollmonitor } = {}) => {
	let { current } = ref;
	const [state, updateState] = useState(defaultState);

	const updateCheck = typeof offsets === 'number' ? [current, offsets] : [current, offsets.top, offsets.bottom];

	useLayoutEffect(() => {
		if (current === null) {
			updateState(_extends({}, defaultState));
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
//# sourceMappingURL=index.js.map