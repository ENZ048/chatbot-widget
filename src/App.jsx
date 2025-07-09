import { Routes, Route } from "react-router-dom";
import EmbedPage from "./pages/EmbedPage";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/embed/:chatbotId" element={<EmbedPage />} />
    </Routes>
  );
}

export default App;
