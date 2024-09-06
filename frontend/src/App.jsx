import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello main</h1>} />
        <Route path="/videos/" element={<h1>Hello videos</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
