import {IMiniToolPrev} from "@/lib/models/MiniToolPrev";
import {ComponentFilterFactory} from "@/lib/ToolFiltering/ComponentFilter";

export function ComponentFiltering(tools : IMiniToolPrev[] | unknown  , componentFilter:string[]): IMiniToolPrev[]
{
    if(Array.isArray(tools)){
        let filteredTools = tools; // Create a properly typed variable
        for (const filter of componentFilter) {
            filteredTools = new ComponentFilterFactory().filterTools(filteredTools , filter);
        }
        return filteredTools;
    }
    return [];
}