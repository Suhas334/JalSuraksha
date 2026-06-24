/// <reference types="react-scripts" />

// Fix for @types/react 18.3+ — JSX namespace is now React.JSX, not global JSX
// This shim re-exports it globally so all .tsx files work without explicit React imports
import type * as React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
