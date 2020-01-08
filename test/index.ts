import mindGraph from '../src/index';

const dom = document.getElementById('app');
if (dom) {
  const graph = new mindGraph.MindMap(dom);
  graph.render();
  const rootId = graph.rootId;
  const secId = graph.addNode(rootId, 'primary');
  graph.addNode(rootId, 'primary2');
  graph.addNode(rootId, 'primary3');
  const pri3Id = graph.addNode(rootId, 'primary3');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(rootId, 'primary3');
  graph.addNode(rootId, 'primary3');
  graph.addNode(secId, 'secondary');
  const id = graph.addNode(secId, 'secondary2');
  graph.addNode(id, 'sec');
  graph.addNode(id, 'sec');
  graph.addNode(id, 'sec');
  graph.addNode(id, 'sec');
}