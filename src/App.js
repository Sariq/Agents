import React, { Component } from 'react';
import './App.scss';
import AgentsList from './agents/agents-list/agents-list';
class App extends Component {
  render() {
    return (
      <div className="App">
        <AgentsList></AgentsList>
      </div>
    );
  }
}

export default App;
