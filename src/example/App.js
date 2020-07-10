import React from "react";
import "./App.css";
import {TopButton} from './topbutton'
import {BottomPane} from './bottompane'
import {Attributions} from './attributions'

function App() {
  return (
    <div className="App">
      <TopButton />
      <BottomPane />
      <Attributions />
    </div>
  );
}

export default App;
