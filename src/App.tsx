import "./App.css";
import { Button } from "./lib/components/ui/button";

function App() {
  return (
    <>
      <div className="h-full w-full flex flex-col">
        <h1>Light It</h1>
        <Button onClick={() => console.log("probando")}>Probando boton</Button>
        <Button onClick={() => console.log("probando")} variant="secondary">Probando boton</Button>
        <Button onClick={() => console.log("probando")} variant="outline">Probando boton</Button>
        <Button onClick={() => console.log("probando")} variant="ghost">Probando boton</Button>
        <Button onClick={() => console.log("probando")} variant="danger">Probando boton</Button>
      </div>
    </>
  );
}

export default App;
