import Sidebar from "./Component/Sidebar/Sidebar"
import Main from './Component/Main/Main'


function App() {

  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <Main />
    </div>

  )
}

export default App
