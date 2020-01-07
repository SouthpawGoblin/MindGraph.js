import { NodeStyle, LinkStyle } from "./types";

export const NODE_STYLES: { [key: string]: NodeStyle } = {
  ROOT: {
    fontSize: 28,
    fontFamily: 'Arial',
    fontWeight: '300',
    fontStyle: 'normal',
    color: '#fff',
    background: '#666666',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 6,
    padding: 12
  },
  PRIMARY: {
    fontSize: 18,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000',
    background: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    padding: 8
  },
  SECONDARY: {
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#000',
    background: 'transparent',
    borderWidth: 0,
    borderColor: '#000',
    borderRadius: 0,
    padding: 4
  } 
}

export const LINK_STYLE: LinkStyle = {
  lineWidth: 1,
  lineColor: '#000',
  cp1Ratio: 0.2,
  cp2Ratio: 0.2
}