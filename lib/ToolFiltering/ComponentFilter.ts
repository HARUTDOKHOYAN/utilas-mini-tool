import {IMiniToolPrev} from "@/lib/models/MiniToolPrev";
import IToolFilter from "@/lib/ToolFiltering/IToolFilter";

export class ComponentFilter implements IToolFilter{
    private _componentName: string;
    constructor(componentName:string) {
        this._componentName = componentName;
    }
    filter(tools: IMiniToolPrev[]): IMiniToolPrev[] {
        console.log(tools);
        return tools.filter(tool => !tool.components?.includes(this._componentName))
    }
}


export class ComponentFilterFactory{
    dic: { [key: string]: IToolFilter } = {};

    constructor() {
        this.dic = {
            "onlyAllowed" : new ComponentFilter("hidetool"),
        };
    }

    public filterTools(tools:IMiniToolPrev[], filterType: string) : IMiniToolPrev[]
    {
            if(filterType in this.dic){
                return  this.dic[filterType].filter(tools);
            }
            return tools;
    }
}