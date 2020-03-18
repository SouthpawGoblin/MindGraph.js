# MindGraph.js

A pure Vanilla JS graph component based on canvas, written in Typescript.

**Currently under construction, not recommended for production environment.**

## Features

1. no 3rd-party dependencies.
2. single canvas rendering.
3. common mouse & keyboard interactions out of the box.
4. simple and full js API support for graph manipulation.

## Installation

``` bash
npm install mind-graph-js --save
```

or 

```bash
yarn add mind-graph-js
```

## Usage

1. import `mindGraph`.
```js
import mindGraph from 'mind-graph-js';
```
2. create a new `MindMap` instance, which takes a dom element as the canvas container.
```js
const dom = document.getElementById('app');
const mindMap = new mindGraph.MindMap(dom);
```