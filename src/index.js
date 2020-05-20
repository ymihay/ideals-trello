import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
import Registration from './components/Registration';
import KanbanBoard from './components/KanbanBoard';
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'


// ReactDOM.render(
//     <KanbanBoard/>,
//     document.getElementById('root')
// );


// const store = createStore(reducers, storeEnhancer)
//
// render((
//     <Provider store={store}>
//         <Router>
//             <Switch>
//                 <Route path={'/board'} component={KanbanBoard}/>
//                 <Route path={'/login'} component={Registration}/>
//                 <Route path={'/'} exact component={Registration}/>
//             </Switch>
//         </Router>
//     </Provider>
// ), document.getElementById('root'))


ReactDOM.render(
    (<Router>
        <Switch>
            <Route path={'/board'} component={KanbanBoard}/>
            <Route path={'/login'} component={Registration}/>
            <Route path={'/'} exact component={Registration}/>
        </Switch>
    </Router>
), document.getElementById('root'))
