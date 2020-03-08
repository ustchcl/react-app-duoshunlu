import React from "react"
import { Fn } from "../../types/Type";
import { ifNullThen } from "../../basic/BaseFunctions";

type InputType = "password" | "text";

type InputGroupConfig = {
    id: string,
    icon: string,
    placeholder: string,
    required: boolean,
    value: string,
    onChange: Fn<React.ChangeEvent<HTMLInputElement>, void>    
    type: InputType
    maxLength?: number;
    className?: string
}


export function InputGroup(config: InputGroupConfig) {
    return (
        <div className={ ifNullThen<string>(config.className, "input-group px-3 mb-3") }>
            <div className="input-group-prepend">
                <span id={`${config.id}-prepend`} className="input-group-text d-flex justify-content-center" style={{width: "50px"}}>
                    <i className={config.icon}></i>
                </span>
            </div>
            <input onChange={config.onChange} maxLength={ifNullThen<number>(config.maxLength, 8)} type={config.type} className="form-control" id={`validation-${config.id}`} required={config.required} placeholder={config.placeholder} value={config.value}></input>
            <div className="invalid-feedback"></div>
        </div>
    )
}

export function MenuSpaceDiv() {
    return (
        <div className="w-100" style={{height: "100px"}}></div>
    )
}