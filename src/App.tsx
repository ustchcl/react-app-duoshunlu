import React from 'react';
import { Button }  from "antd-mobile"
import { PersonalCenter } from './pages/PersonalCenter';
import { Counter } from './pages/components/Counter';
import { HelloMessage } from './examples/1/HelloTaylor';
import { Timer } from './examples/2/StateComponent';
import { TodoApp } from './examples/3/TODO';

const App: React.FC = () => {
    return (
        <div>
            {/* <PersonalCenter>Start</PersonalCenter> */}
            {/* <Counter></Counter> */}
            {/* <HelloMessage name="Talor"/> */}
            {/* <Timer/> */}
            <TodoApp/>
        </div>
    )
}

export default App;
