
import './App.css';
import {Routes ,Route} from "react-router-dom";
import AddEditUser from './pages/AddEditUser';
import Home from './pages/Home';
import Navbar from './components/Navbar';


function App() {
  
  return (   
    <div className='App'>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/add' element={<AddEditUser/>} />
      <Route path='/update/:id' element={<AddEditUser/>} />
    </Routes>
    </div>
    
    
  );
}

export default App;
