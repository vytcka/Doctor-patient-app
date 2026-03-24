import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [response, setResponse] = useState("");

  useEffect(() => {
    fetch("/", {
      credentials: "include"
    })
      .then(res => res.text())
      .then(data => setResponse(data))
  }, []);

  return (
    <div className="check">
      <header className="check-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <p>
          {/*Returns index.html, that means it works... */}
          {(response)} Check Page working. !!!
        </p>
        <a
          className="check-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;