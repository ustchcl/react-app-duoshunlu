import React from "react"

export default abstract class BaseComponent<Props, State, Message>  extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    abstract eval(msg: Message): void;
    
    send(msg: Message) {
        return () => this.eval(msg);
    }
}