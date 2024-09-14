import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Grid from "./Grid";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
// import { DragableList } from "./DragableMenu";
// import DraggingExample from "./Draging";
// import ResizingExample from "./Resizing";
// import TogglingExample from "./Toggling";


function App() {
  return (
    <MantineProvider>
      <Grid/>
      {/* <DragableList/> */}
      {/* <TogglingExample/> */}
      {/* <DraggingExample/> */}
      {/* <ResizingExample/> */}
    </MantineProvider>
  );
}

export default App;
