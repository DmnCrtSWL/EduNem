import React from 'react';

export default function codegenNativeComponent(componentName) {
  return function NativeComponent(props) {
    return React.createElement('div', props);
  };
}

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => null,
};
