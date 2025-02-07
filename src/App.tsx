import "@fontsource/lexend";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Play } from "@/pages/Play";
import { Game } from "@/pages/Game";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/:continent" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
