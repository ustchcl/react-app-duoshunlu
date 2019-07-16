// 函数类型
export type Fn<F1, F2> =  (_: F1) => F2
export type Fn2<F1, F2, F3> =  (_1: F1, _2: F2) => F3
export type Fn3<F1, F2, F3, F4> =  (_1: F1, _2: F2, _3: F3) => F4
export type Fn4<F1, F2, F3, F4, F5> =  (_1: F1, _2: F2, _3: F3, _4: F4) => F5
export type Fn5<F1, F2, F3, F4, F5, F6> =  (_1: F1, _2: F2, _3: F3, _4: F4, _5: F5) => F6


export type Tuple1<F1> = [F1];
export type Tuple2<F1, F2> = [F1, F2];
export type Tuple3<F1, F2, F3> = [F1, F2, F3];
export type Tuple4<F1, F2, F3, F4> = [F1, F2, F3, F4];
export type Tuple5<F1, F2, F3, F4, F5> = [F1, F2, F3, F4, F5];
export type Tuple6<F1, F2, F3, F4, F5, F6> = [F1, F2, F3, F4, F5, F6];


export type Unit = "Symbol_Unit";
export const unit: Unit = "Symbol_Unit";

export type Empty = {};
export type Msg<TypeName, Value> = [TypeName, Value];
export type MsgUnit<TypeName> = [TypeName]

export function msg<TypeName, Value>(typename: TypeName, value: Value): [TypeName, Value] {
    return [typename, value]
}

export function unitMsg<TypeName>(typename: TypeName): Msg<TypeName, Unit> {
    return [typename, unit]
}

// export function mapMsg<T, From, To>(origialMsg: Msg<T, From>, f: Fn<From, To>): Msg<T, To> {
//     return {typename: origialMsg.typename, value: f(origialMsg.value)};
// }

// export function genMsg<T, From, To>(generator: Msg<T, Fn<From, To>>, value: From): Msg<T, To> {
//     return {typename: generator.typename, value: generator.value(value)};
// }
