import { Link, Route, Routes } from "react-router-dom";
import Demo from "./Demo";
import Tests from "./Tests";

export default function App() {
  return (
    <>
      <Link to="/demo">Demo</Link> | <Link to="/tests">Tests</Link>
      <br/>
      <br/>
      <Routes>
        <Route path="demo" element={<Demo />} />
        <Route path="tests" element={<Tests />} />
      </Routes>
    </>
  );
}
