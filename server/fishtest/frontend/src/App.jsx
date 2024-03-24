import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContextProvider } from "./Components/Context/Context";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import TestsView from "./Pages/TestsView/TestsView";
import LiveElo from "./Pages/LiveElo/LiveElo";
import TestsStats from "./Pages/TestsStats/TestsStats";

function App() {
  return (
    <ContextProvider>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="/tests" element={<Home />} />
              <Route path="/tests/view/:testId" element={<TestsView />} />
              <Route path="/tests/live_elo/:testId" element={<LiveElo />} />
              <Route path="/tests/stats/:testId" element={<TestsStats />} />
              <Route path="*" element={<div></div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Layout>
    </ContextProvider>
  );
}

export default App;
