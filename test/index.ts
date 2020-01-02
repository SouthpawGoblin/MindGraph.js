import MindGraph from '../src/index';

const graph = new MindGraph();
const appDom = document.getElementById('app');
if (appDom) {
  appDom.innerText = "MindGraph id: " + graph.id;
}