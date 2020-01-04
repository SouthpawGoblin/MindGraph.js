export interface Vec2 {
  x: number,
  y: number
}

export interface NodeStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500';
  fontStyle: 'italic' | 'normal';
  color: string;
  background: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  padding: number;
}

export type NodeType = 'ROOT' | 'PRIMARY' | 'SECONDARY';