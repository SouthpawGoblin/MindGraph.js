import mindGraph from '../src/index';

const dom = document.getElementById('app');
if (dom) {
  const graph = new mindGraph.MindMap(dom);
  graph.render();
  const rootId = graph.rootId;
  const secId = graph.addNode(rootId, 'primary');
  graph.addNode(secId, 'secondary');
}