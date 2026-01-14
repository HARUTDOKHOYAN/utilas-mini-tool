import {IMiniToolPrev} from "@/lib/models/MiniToolPrev";

// Extended interface for filtering that includes components


export default  interface IToolFilter {
    filter(tools:IMiniToolPrev[]): IMiniToolPrev[];
}