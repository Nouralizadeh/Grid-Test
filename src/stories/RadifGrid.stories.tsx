import type { Meta, StoryObj } from "@storybook/react";

import Grid from "../Grid";
import { createTheme } from "@mantine/core";
import Column from "../Column";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import { Order, OrderDetail } from "../GridData";
import Northwind from "northwind-data";
import RadifGrid from "../RadifGrid";
import { notifications, Notifications } from "@mantine/notifications";

Northwind.linkOrderDetails();

type GridPropsAndCustomArgs<T> = React.ComponentProps<typeof RadifGrid<T>>;
const meta: Meta<GridPropsAndCustomArgs<OrderDetail>> = {
  component: RadifGrid,
  render: ({ ...args }: GridPropsAndCustomArgs<OrderDetail>) => (
    <MantineProvider theme={theme}>
      <div>
        <RadifGrid
                  {...args}
                  idAccessor={"Id"}>
        <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"}/>
          <Column key={"OrderId"} accessor={"OrderId"}/>
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications/>
    </MantineProvider>
  ),
};

function duplicathandler(rowIndex: number, records: OrderDetail[], setRecords: any) {
  let row = {...records[rowIndex]};
  //==========================================
  //Update rowIds if exist
  if (row.RowId) {
    row.RowId = row.RowId + 1;
    records.forEach((r : any) => {
      if (row.RowId && r.RowId > row.RowId)
        r.RowId++;
    });
  }
  //==========================================
  
  let id = -1
  do {
    id++;
  } while (records.find(d => d.Id == id.toString()))
  row.Id = id.toString()
  let newData = records.slice();
  newData.splice(rowIndex + 1 , 0 , row);
  setRecords(newData);
}

function deleteHandler(rowIndex: number, records: OrderDetail[], setRecords: any)  {
  let newData: any[] = records;
   const row = records[rowIndex]
   //==========================================
   //Update rowIds if exist
   if (row.RowId)
     newData.forEach((r: any) => {
       if (row.RowId && r.RowId > row.RowId) r.RowId--;
     });
   //==========================================
   newData.splice(rowIndex, 1);
 setRecords(newData);
}


const theme = createTheme({});
export default meta;

type Story = StoryObj<GridPropsAndCustomArgs<OrderDetail>>;

export const SimpleGrid: Story = {
  args: {
    gridData: Northwind.OrderDetails.slice(0,25),
  },
};

export const Operation = () => {
  const [order, setOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    let newOrder = {...order}
    newOrder.Details = changedCurrentDetails
    setOrder(newOrder)
  };
  return (
      <MantineProvider theme={theme}>
          <div>
              <RadifGrid
                  gridData={order.Details}
                  idAccessor={"Id"}
                  onRowDeleted={(rowIndex) =>deleteHandler(rowIndex, order.Details, setDetailHandler)}
                  onRowDuplicated={(rowIndex) => duplicathandler(rowIndex, order.Details, setDetailHandler)}
              >
                  <Column key={"Id"} accessor={"Id"} />
                  <Column key={"RowId"}  accessor={"RowId"}/>
                  <Column key={"OrderId"} accessor={"OrderId"} />
                  <Column key={"ProductId"} accessor={"ProductId"} />
                  <Column key={"UnitPrice"} accessor={"UnitPrice"} />
                  <Column key={"Quantity"} accessor={"Quantity"} />
                  <Column key={"Discount"} accessor={"Discount"} />
              </RadifGrid>
          </div>
          <Notifications />
      </MantineProvider>
  );
};

const preOP = (row: OrderDetail) => {
  if (row.OrderId == 10248) {
    notifications.show({
      message: "This row can not be operated",
      withCloseButton: true,
      autoClose: 1600,
      title: "Operation error",
      color: "red",
      style: {
        backgroundColor: "#fac7cd",
        description: { color: "darkgray" },
      },
      loading: false,
    });
    return false;
  }
  return true;
}

export const PreOperation = () => {
  const [order, setOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    let newOrder = { ...order }
    newOrder.Details = changedCurrentDetails
    setOrder(newOrder)
  };

  const onRowDuplicate = (rowIndex: number) => {
    console.log("PreOperation => This log occured before duplication")
    if(preOP(order.Details[rowIndex]))
      duplicathandler(rowIndex, order.Details, setDetailHandler)
  }

  return (
    <MantineProvider theme={theme}>
      <div>
      <div>PreOperation define on duplication </div>
        <RadifGrid  gridData={order.Details}
                    idAccessor={"Id"}
                    onRowDeleted={(rowIndex) => deleteHandler(rowIndex, order.Details, setDetailHandler)}
                    onRowDuplicated={onRowDuplicate} >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"} />
          <Column key={"OrderId"} accessor={"OrderId"} />
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications />
    </MantineProvider>
  );
};

export const PostOperation = () => {
  const [order, setOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    let newOrder = { ...order }
    newOrder.Details = changedCurrentDetails
    setOrder(newOrder)
  };

  const onRowDuplicate = (rowIndex: number) => {
    duplicathandler(rowIndex, order.Details, setDetailHandler)
    console.log("PostOperation => This log occured after duplication")
  }

  return (
    <MantineProvider theme={theme}>
      <div>
        <div>Check the console for log </div>
        <RadifGrid  gridData={order.Details}
                    idAccessor={"Id"}
                    onRowDeleted={(rowIndex) => deleteHandler(rowIndex, order.Details, setDetailHandler)}
                    onRowDuplicated={onRowDuplicate} >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"} />
          <Column key={"OrderId"} accessor={"OrderId"} />
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications />
    </MantineProvider>
  );
};

export const ConditionedOperation = () => {
  const [order, setOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    let newOrder = { ...order }
    newOrder.Details = changedCurrentDetails
    setOrder(newOrder)
  };
  return (
    <MantineProvider theme={theme}>
      <div>
        <div>The condition has defined for Product Id not to be equal to 42.</div>
        <RadifGrid  gridData={order.Details}
                    idAccessor={"Id"}
                    onRowDeleted={(rowIndex) => deleteHandler(rowIndex, order.Details, setDetailHandler)}
                    deleteRowCondition={(row: OrderDetail) => row.ProductId != 42}
                    onRowDuplicated={(rowIndex) => duplicathandler(rowIndex, order.Details, setDetailHandler)} >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"} />
          <Column key={"OrderId"} accessor={"OrderId"} />
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications />
    </MantineProvider>
  );
};


export const MasterDetail = () => {
  const [currentOrder, setCurrentOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))
  const [data] = useState<Order[]>(Northwind.Orders.slice(0, 5));

  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data}
              onRowClick={(row) => setCurrentOrder(Northwind.Orders.find((o: { Id: number; }) => o.Id == row.Id))}
              highlightedRecord={currentOrder}
              idAccessor={"Id"}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"CustomerId"} accessor={"CustomerId"} />
          <Column key={"EmployeeId"} accessor={"EmployeeId"} />
          <Column key={"OrderDate"} accessor={"OrderDate"} />
          <Column key={"RequiredDate"} accessor={"RequiredDate"} />
          <Column key={"ShippedDate"} accessor={"ShippedDate"} />
          <Column key={"ShipVia"} accessor={"ShipVia"} />
          <Column key={"Freight"} accessor={"Freight"} />
          <Column key={"ShipName"} accessor={"ShipName"} />
          <Column key={"ShipAddress"} accessor={"ShipAddress"} />
          <Column key={"ShipCity"} accessor={"ShipCity"} />
          <Column key={"ShipRegion"} accessor={"ShipRegion"} />
          <Column key={"ShipPostalCode"} accessor={"ShipPostalCode"} />
          <Column key={"ShipCountry"} accessor={"ShipCountry"} />
          <Column key={"ShipperId"} accessor={"ShipperId"} />
        </Grid>
        <RadifGrid gridData={currentOrder.Details} idAccessor={"Id"}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"} />
          <Column key={"OrderId"} accessor={"OrderId"} />
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications />
    </MantineProvider>
  );
};

export const RowDragging = () => {
  const [order, setOrder] = useState(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    let newOrder = { ...order }
    newOrder.Details = changedCurrentDetails
    setOrder(newOrder)
  };

  const moveUp = (sourceIndex: number, destinationIndex: number) => {
    const items: any[] = Array.from(order.Details);
    const destRowId = items[destinationIndex].RowId ?? destinationIndex + 1
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    if (items[destinationIndex].RowId) {
      items[destinationIndex].RowId = destRowId;
      items.forEach((item: any, index) => { if (index <= sourceIndex && index > destinationIndex) item.RowId++ });
    }
    setDetailHandler(items);
  }

  const moveDown = (sourceIndex: number, destinationIndex: number) => {
    const items: any[] = Array.from(order.Details);
    const destRowId = items[destinationIndex].RowId ?? destinationIndex + 1
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    if (items[destinationIndex].RowId) {
      items[destinationIndex].RowId = destRowId;
      items.forEach((item: any, index) => { if (index >= sourceIndex && index < destinationIndex) item.RowId-- });
    }
    setDetailHandler(items);
  }

  const draggingHandler = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex < destinationIndex)
      moveDown(sourceIndex, destinationIndex)
    else if (sourceIndex > destinationIndex)
      moveUp(sourceIndex, destinationIndex)
  };

  return (
    <MantineProvider theme={theme}>
      <div>
        <RadifGrid  gridData={order.Details}
                    idAccessor={"Id"}
                    onRowDragging={draggingHandler} >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"RowId"} accessor={"RowId"} />
          <Column key={"OrderId"} accessor={"OrderId"} />
          <Column key={"ProductId"} accessor={"ProductId"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"Quantity"} accessor={"Quantity"} />
          <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>
      </div>
      <Notifications />
    </MantineProvider>
  );
};
