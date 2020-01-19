import mindGraph from '../src/index';

const dom = document.getElementById('app');
if (dom) {
  const graph = new mindGraph.MindMap(dom);
  graph.render();
  const rootId = graph.rootId;
  const secId = graph.addNode(rootId, 'primary');
  const p2 = graph.addNode(rootId, 'primary2');
  graph.addNode(p2, 'sec2');
  graph.addNode(rootId, 'primary3');
  const pri3Id = graph.addNode(rootId, 'primary10');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(pri3Id, 'sec3');
  graph.addNode(rootId, 'primary3');
  const pri5Id = graph.addNode(rootId, 'primary3');
  graph.addNode(pri5Id, 'sec5');
  graph.addNode(pri5Id, 'sec5');
  graph.addNode(pri5Id, 'sec5');
  graph.addNode(pri5Id, 'sec5');
  const bb = graph.addNode(pri5Id, 'sec5');
  const aa = graph.addNode(pri5Id, 'sec5');
  graph.addNode(secId, 'secondary');
  const id = graph.addNode(secId, 'secondary2');
  graph.addNode(id, 'sec');
  const ii = graph.addNode(id, 'sec');
  graph.addNode(id, 'sec');
  graph.addNode(id, 'sec');
  graph.deleteNode(ii);
  graph.deleteNode(aa);
  graph.updateNode(rootId, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrr');
  graph.updateNode(secId, 'pppppppppppppppppp');
  graph.copyNode(rootId);
  graph.pasteNode(id);
  graph.cutNode(pri3Id);
  graph.pasteNode(bb);

  console.log(graph.toJson());
}