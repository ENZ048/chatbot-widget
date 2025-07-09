import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmbedPage from "./pages/EmbedPage"; // 👈 create this
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/embed/:chatbotId" element={<EmbedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
