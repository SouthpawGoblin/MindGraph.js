# MindGraph.js

A pure Vanilla JS graph component based on canvas, written in Typescript.

[Demo here](https://southpawgoblin.github.io/MindGraph.js/)

**Currently under construction, not recommended for production environment.**

## Features

1. no 3rd-party dependencies.
2. single canvas rendering.
3. support common mouse & keyboard interactions out of the box.
4. full js API support for graph manipulation.

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
2. create a new `MindMap` instance, which takes a dom element as the canvas container, then render it.
```js
const dom = document.getElementById('app');
const mindMap = new mindGraph.MindMap(dom);
mindMap.render();
```
3. node operations are based on node ids, to add our first node, we need to aquire the root node id.
```js
const rootId = mindMap.rootId;
```
4. call `addNode`, which will return the id of the added node for future operations.
```js
const nodeId = mindMap.addNode(rootId, 'first node');
```
5. all `MindMap`'s instance methods are as follows:

method | description
------ | -----------
addNode(parentId: number, text?: string, position?: number): number | add a node to it's parent, return new node's id.
deleteNode(nodeId: number): number | delete a node by id, return it's parent's id.
updateNode(nodeId: number, text: string) | update a node's text.
copyNode(nodeId: number) | copy a node by id.
cutNode(nodeId: number) | cut a node by id.
pasteNode(parentId: number) | paste the copied node to a specified parent.
toJson(): MapJson | export current graph to json.
loadJson(json: MapJson) | reconstruct current graph by json.
6. default mouse & keyboard interactions:
- Drag empty space to pan.
- Use mouse wheel to scroll vertically.
- Hold "Ctrl" and use mouse wheel to zoom.
- Click a node to select it.
- Double click a node to edit it's text.
- Drag & drop a node to change it's position.
- "Enter" to add a sibling node of the selected node.
- "Ctrl + Enter" to add a child node of the selected node.
- "Ctrl + C" to copy the selected node.
- "Ctrl + X" to cut the selected node.
- "Ctrl + V" to paste copied node to the selected node. 
