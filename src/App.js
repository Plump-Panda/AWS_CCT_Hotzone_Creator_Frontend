import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './components/LoginPage';
import HotzoneCreator from './components/HotzoneCreator';
import {useState} from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? 
              (<HotzoneCreator/>) :
              (<LoginPage setIsLoggedIn={setIsLoggedIn}/>)}
    </div>
  );
}

export default App;
