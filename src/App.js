import './App.css';
import ImageGallery from './Pages/ImageGallery.js';
import DarkMode from './Theme/DarkMode.js';

function App() {
  return (
    <div className="App">
      <DarkMode/>
     <ImageGallery/>
    </div>
  );
}

export default App;
