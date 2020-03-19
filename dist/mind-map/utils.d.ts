import { MapNodeType, MapLinkStyle, MapSelectionStyle, MapNodeStyle } from "./types";
import { InsertMarkStyle } from "../common/types";
declare function getChildNodeType(parentType: MapNodeType): MapNodeType;
declare function getScaledNodeStyle(type: MapNodeType, scale: number): MapNodeStyle;
declare function getScaledLinkStyle(scale: number): MapLinkStyle;
declare function getScaledSelectionStyle(scale: number): MapSelectionStyle;
declare function getScaledInsertMarkStyle(scale: number): InsertMarkStyle;
declare const _: {
    getChildNodeType: typeof getChildNodeType;
    getScaledNodeStyle: typeof getScaledNodeStyle;
    getScaledLinkStyle: typeof getScaledLinkStyle;
    getScaledSelectionStyle: typeof getScaledSelectionStyle;
    getScaledInsertMarkStyle: typeof getScaledInsertMarkStyle;
};
export default _;
