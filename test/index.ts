import mindGraph from '../src/index';

const dom = document.getElementById('app');
if (dom) {
  const mindMap = new mindGraph.MindMap(dom);
  mindMap.render();
  const rootId = mindMap.rootId;

  const group1 = mindMap.addNode(rootId, 'group1');
  mindMap.addNode(group1, 'child1');
  mindMap.addNode(group1, 'child2');
  mindMap.addNode(group1, 'child3');

  const group2 = mindMap.addNode(rootId, 'group2');
  mindMap.addNode(group2, 'child1');
  mindMap.addNode(group2, 'child2');
  const group2_1 = mindMap.addNode(group2, 'group2-1');
  mindMap.addNode(group2_1, 'child1');
  mindMap.addNode(group2_1, 'child2');
  mindMap.addNode(group2_1, 'child3');
}