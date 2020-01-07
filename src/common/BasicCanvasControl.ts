import BasicGraph from "./BasicGraph";

export default class BasicCanvasControl {

  private leftDragging: boolean;
  private rightDragging: boolean;
  private graph: BasicGraph;

  constructor(graph: BasicGraph) {
    this.leftDragging = false;
    this.rightDragging = false;
    this.graph = graph;
    const canvas = this.graph.getCanvas();
    canvas.style.cursor = 'grab';
    // zooming
    canvas.addEventListener('wheel', this.handleWheel)
    // panning
    canvas.addEventListener('mousedown', this.handleMouseDown)
    canvas.addEventListener('mouseup', this.handleMouseUp)
    canvas.addEventListener('mouseleave', this.handleMouseLeave)
    canvas.addEventListener('mousemove', this.handleMouseMove)
    // prevent default context menu when rotating
    canvas.addEventListener('contextmenu', this.handleContextMenu)
  }

  dispose() {
    const canvas = this.graph.getCanvas();
    canvas.style.cursor = 'default';
    // zooming
    canvas.removeEventListener('wheel', this.handleWheel)
    // panning
    canvas.removeEventListener('mousedown', this.handleMouseDown)
    canvas.removeEventListener('mouseup', this.handleMouseUp)
    canvas.removeEventListener('mouseleave', this.handleMouseLeave)
    canvas.removeEventListener('mousemove', this.handleMouseMove)
    // prevent default context menu when rotating
    canvas.removeEventListener('contextmenu', this.handleContextMenu)
  }

  private handleWheel = (ev: WheelEvent) => {
    let scale = this.graph.getScale() + (ev.deltaY > 0 ? -0.05 : 0.05);
    if (scale < 0.1) {
      scale = 0.1;
    } else if (scale > 4) {
      scale = 4;
    }
    this.graph.setScale(scale);
  }

  private handleMouseDown = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this.leftDragging = true
    } else if (ev.button === 2) {
      this.rightDragging = true
    }
  }

  private handleMouseUp = (ev: MouseEvent) => {
    if (ev.button === 0) {
      this.leftDragging = false
    } else if (ev.button === 2) {
      this.rightDragging = false
    }
  }

  private handleMouseLeave = () => {
    this.leftDragging = false
    this.rightDragging = false
  }

  private handleMouseMove = (ev: MouseEvent) => {
    if (this.leftDragging) {
      const trans = this.graph.getTranslate();
      this.graph.setTranslate({
        x: trans.x + ev.movementX,
        y: trans.y + ev.movementY
      });
    } else if (this.rightDragging) {
      // TODO: right mouse dragging logic
    }
  }

  private handleContextMenu = (ev: MouseEvent) => {
    ev.preventDefault()
  }
}