import React from "react"
import * as R from "ramda"
import { Fn, Unit } from "../types/Type";
import { DslRoute, routeCodec } from "../pages/Router";
import { Subscription } from "rxjs"
import { dispatch } from "./GlobalEnv";

type Picker<T, K extends keyof T> = {
    [P in K]: Fn<T[P], T[P]>;
};

export default abstract class BaseComponent<Props, State, Message = [Unit]>  extends React.Component<Props, State> {
    subs: Array<Subscription> = [];

    constructor(props: Props) {
        super(props);
    }

    abstract eval(msg: Message): void;

    onE<T>(callback: Fn<T, Message>) {
        return (e: T) => {
            this.eval(callback(e))
        }
    }

    on(msg: Message) {
        return () => this.eval(msg);
    }

    // Don’t let TypeScript slow you down
    // 暴露出来的接口是好的就行，不要在细枝末节的类型上纠结，很可能他们根本表达不了
    update<K extends keyof State>(updater: Picker<Readonly<State>, K>) {
        this.setState(state => R.evolve<any, any>(updater, R.pick(R.keys(updater) as string [], state)));
    }

    set = this.setState;

    // 跳转到指定路由
    goto(route: DslRoute) {
        let props: any = this.props;
        if (props.history) {
            props.history.push(routeCodec(route));
            dispatch(["ChangeRoute", route])
        }
    }

    // 返回上一页
    goBack() {
        let props: any = this.props;
        if (props.history) {
            props.history.goBack();
        }
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
 }