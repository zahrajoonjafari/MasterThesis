import React from "react";
import SmartContract from './SmartContract';
import './App.css';


const App = () => { 
 
   
  return (
  <div className='container'>
    <h4 className='display-4 text-center mb-4'>
      <i className='fab' /> Ontology-Dalicc-Connector
    </h4>
   
    <SmartContract
    />
   
  </div> 

  );
}
export default App;
