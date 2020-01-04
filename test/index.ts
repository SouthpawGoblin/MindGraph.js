import mindGraph from '../src/index';

const dom = document.getElementById('app');
if (dom) {
  const graph = new mindGraph.MindMap(dom);
  graph.render();
  setTimeout(() => {
    graph.setTranslate({ x: 100, y: 100 });
    graph.setScale(1.5);
  }, 2000);
}