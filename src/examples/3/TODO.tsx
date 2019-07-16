import { Empty } from "../../types/Type";
import BaseComponent from "../../basic/BaseComponent";
import React from "react"
import { append, always } from "ramda"

type Item = { id: number, text: string };
type Items = Array<Item>

type State = {
    items: Items,
    text: string
}

type Props = Empty;

type Msg 
    = ["Change", string]
    | ["Submit"]


export class TodoApp extends BaseComponent<Props, State, Msg> {
    constructor(props: Props) {
        super(props);
        this.state = { items: [], text: '' };
    }

    eval (msg: Msg) {
        switch (msg[0]) {
            case "Change": {
                this.set({text: msg[1]});
                break;
            }
            case "Submit": {
                if (!this.state.text.length) {
                    break;
                }
                const newItem = {
                    text: this.state.text,
                    id: Date.now()
                };
                this.update({
                    items: append(newItem),
                    text: always('')
                })
                break;
            }
        }
    }

    render() {
        return (
            <div>
                <h3>TODO</h3>
                <TodoList items={this.state.items} />
                <form onSubmit={this.onE(e => {
                    e.preventDefault();
                    return ["Submit"]
                })}>
                    <label htmlFor="new-todo">
                        What needs to be done?
                    </label>
                    <input
                        id="new-todo"
                        onChange={this.onE(e => ["Change", e.target.value])}
                        value={this.state.text}
                    />
                    <button>
                        Add #{this.state.items.length + 1}
                    </button>
                </form>
            </div>
        );
    }
}

class TodoList extends React.Component<{ items: Items }> {
    render() {
        return (
            <ul>
                {this.props.items.map(item => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
        );
    }
}
