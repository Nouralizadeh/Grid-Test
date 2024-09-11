import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Grid from "./Grid";
import 'mantine-datatable/styles.css';
// import DraggingExample from "./Draging";
// import ResizingExample from "./Resizing";
// import TogglingExample from "./Toggling";


function App() {
  return (
    <MantineProvider>
      <Grid/>
      {/* <TogglingExample/> */}
      {/* <DraggingExample/> */}
      {/* <ResizingExample/> */}
    </MantineProvider>
  );
}

export default App;
