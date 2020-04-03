import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Chronos from './Chronos'
import Counter from './Counter'
import './App.css';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/chronos" component={Chronos} />
    <Route path="/counter/:id" component={Counter} />
  </Switch>
);

export default App;
