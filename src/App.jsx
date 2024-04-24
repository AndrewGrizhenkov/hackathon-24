import "./App.css";
import reposData from "../data/repos.json";
import RepoTable from "./components/RepoTable";

function App() {
  return (
    <>
      <RepoTable reposData={reposData} />
    </>
  );
}

export default App;
