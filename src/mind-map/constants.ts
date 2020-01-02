interface NodeStyle {
  fontSize: number;
  fontWeight: 'bold' | 'normal';
  fontStyle: 'italic' | 'normal';
  color: string;
  background: string;
  border: string;
  borderRadius: number;
}

export const NODE_STYLES: { [key: string]: NodeStyle } = {
  ROOT: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: '#fff',
    background: '#0000ff',
    border: '2px solid #000',
    borderRadius: 6
  } 
}

export type NodeType = 'ROOT' | 'PRIMARY' | 'SECONDARY';