import Grid from "./Grid";
import Column from "./Column";
import { MantineProvider, DirectionProvider, Title, ComboboxItem } from "@mantine/core";
import { useEffect, useState } from "react";
import { createTheme } from "@mantine/core";
import {Order, OrderDetail } from "./GridData";
import RadifGrid from "./RadifGrid";
import Northwind from "northwind-data";
import { Notifications } from '@mantine/notifications';
import { DataTableSortStatus } from "mantine-datatable";
import {sortBy} from 'lodash';


let totalRecords = 25
const theme = createTheme({
  fontFamily: "inherit"
});
Northwind.linkOrderDetails();

function App() {

  function duplicathandler(recordIndex: number) {
    let row = {...currentOrder.Details[recordIndex]};
    //==========================================
    //Update rowIds if exist
    if (row.RowId) {
      row.RowId = row.RowId + 1;
      currentOrder.Details.forEach((r : any) => {
        if (row.RowId && r.RowId > row.RowId)
          r.RowId++;
      });
    }
    //==========================================
    
    let id = -1
    do {
      id++;
    } while (currentOrder.Details.find(d => d.Id == id.toString()))
    row.Id = id.toString()
    let newData = currentOrder.Details.slice();
    newData.splice(recordIndex + 1 , 0 , row);
    setDetailHandler(newData);
  }

  function deleteHandler(recordIndex: number) :any {
    let newData: any[] = currentOrder.Details;
    let selectedRows = selectedRecords;
     const row = currentOrder.Details[recordIndex]
     //==========================================
     //Update rowIds if exist
     if (row.RowId)
       newData.forEach((r: any) => {
         if (row.RowId && r.RowId > row.RowId) r.RowId--;
       });
     //==========================================
     newData.splice(recordIndex, 1);
     //=========================================
     //delete record from selectedRecords
     const selectedIndex = selectedRecords.indexOf(row);
     if (selectedIndex != -1) selectedRows.splice(selectedIndex, 1);
     //=========================================
   setSelectedRecords(selectedRows);
   setDetailHandler(newData);
 }  
  const moveUp = (sourceIndex: number, destinationIndex: number) => {
    const items: any[] = Array.from(currentOrder.Details);
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
    const items: any[] = Array.from(currentOrder.Details);
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


  const [customerIds, setCustomerIds] = useState<ComboboxItem[] | null>([])
  const [shipName, setShipName] = useState<string>("")
  const [shipVia, setShipVia] = useState<number | null>(null)
  const [filterInfo, setFilterInfo] = useState<Filter[]>([])
  const addFilter = (columnName: string, value: number | string | any[]) => {
    const filterIndex = filterInfo.findIndex(filter => filter.column == columnName)
    if (filterIndex !== -1 && (value == null || value == "" || (Array.isArray(value) && value.length == 0)))
      setFilterInfo(prev => {
        const newVal = [...prev];
        newVal.splice(filterIndex, 1)
        return newVal
      }
      )
    else if (filterIndex !== -1)
      setFilterInfo(prev => {
        const newVal = [...prev];
        newVal.splice(filterIndex, 1, { ...prev[filterIndex], value: value })
        return newVal
      }
      )
    else
      setFilterInfo(prev => [...prev, { column: columnName, value: value, operator: "eq" }])

  }
  const getData = ({ page, pageSize, sortStatus, filterInfo }: DataInfo) => {
    const originalDataLength = 25;
    let result: Order[] = Northwind.Orders.slice(0, originalDataLength);

    filterInfo?.forEach(filter => {
      switch (filter.column) {
        case "CustomerId":
          if (Array.isArray(filter.value) && filter.value.length > 0)
            result = result.filter(order =>
              ((filter.value as any[]).findIndex(selectedOption => selectedOption.value == order.CustomerId) != -1)
            );
          break;

        case "ShipName":
          if (typeof filter.value === 'string' && filter.value !== "") 
            result = result.filter(order => order.ShipName === filter.value);
          
          break;

        case "ShipVia":
          if (typeof filter.value === 'number' && filter.value !== null)
            result = result.filter(order => order.ShipVia === filter.value);
          
          break;

        default:
          break;
      }
    });

    totalRecords = result.length;

    if (sortStatus) {
      result = sortBy(result, sortStatus.columnAccessor) as Order[];
      if (sortStatus.direction === "desc") result.reverse()
    }
    if (page) {
      const from = (page - 1) * pageSize
      const to = Math.min(page * pageSize, result.length)
      result = result.slice(from, to)
    }
    return (result)
  }

  const pageSizes = [5, 10, 15, 20];
  const [currentOrder, setCurrentOrder] = useState<Order>(Northwind.Orders.find((o: { Id: number; }) => o.Id == 10248))
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Order>>({ columnAccessor: "Id", direction: "asc" })
  const [data, setData] = useState<Order[]>(getData({ page, pageSize, sortStatus, filterInfo: filterInfo }));
  const [selectedRecords, setSelectedRecords] = useState<OrderDetail[]>([])

  useEffect(() => {
    setData(getData({page, pageSize, sortStatus, filterInfo: filterInfo }))
  }, [sortStatus, page, pageSize, filterInfo ]);

  const setDetailHandler = (changedCurrentDetails: OrderDetail[]) => {
    const orderIndex = data.indexOf(currentOrder);
    let newData = [...data]
    newData[orderIndex].Details = changedCurrentDetails
    setData(newData)
  };
  
  return (
    <DirectionProvider >
      <MantineProvider theme={theme}>
        <div>
          <Grid gridData={data}
                idAccessor={"Id"}
                onRowDoubleClick={(record) => console.log("Double Clicked record : ", record)}
                onRowClick={(record) => setCurrentOrder(Northwind.Orders.find((o: { Id: number; }) => o.Id == record.Id))}
                highlightedRecord={currentOrder}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                pagination={{ totalRecords: totalRecords,
                              page: page,
                              onPageChange: setPage,
                              pageSize: pageSize,
                              pageSizes: pageSizes,
                              onPageSizeChange: setPageSize,
                            }} >
            <Column key={"Id"} accessor={"Id"} sortable={true}/>
            <Column key={"CustomerId"} accessor={"CustomerId"} sortable={true} 
                    filterState={{value: customerIds, 
                                  label:"Customer Id", 
                                  onValueChange: (cId) => {setCustomerIds(cId); addFilter("CustomerId", cId )}, 
                                  allOptions: getAllCustomers()}}
                    />
            <Column key={"EmployeeId"} accessor={"EmployeeId"} />
            <Column key={"OrderDate"} accessor={"OrderDate"} />
            <Column key={"RequiredDate"} accessor={"RequiredDate"} />
            <Column key={"ShippedDate"} accessor={"ShippedDate"} />
            <Column key={"ShipVia"} accessor={"ShipVia"} 
                    filterState={{value: shipVia, 
                                  label:"Ship Via",
                                  onValueChange: (sv) => {setShipVia(sv); addFilter("ShipVia", sv )} }}/>
            <Column key={"Freight"} accessor={"Freight"} />
            <Column key={"ShipName"} accessor={"ShipName"} 
                    filterState={{value: shipName, 
                                  label:"Ship Name",
                                  onValueChange: (sn) => {setShipName(sn); addFilter("ShipName", sn )} }}/>
            <Column key={"ShipAddress"} accessor={"ShipAddress"} />
            <Column key={"ShipCity"} accessor={"ShipCity"} />
            <Column key={"ShipRegion"} accessor={"ShipRegion"} />
            <Column key={"ShipPostalCode"} accessor={"ShipPostalCode"} />
            <Column key={"ShipCountry"} accessor={"ShipCountry"} />
            <Column key={"ShipperId"} accessor={"ShipperId"} />
          </Grid>
          <RadifGrid  gridData={currentOrder.Details}
                      idAccessor={"Id"}
                      selectedRecords={selectedRecords}
                      onSelectedChange={(records: any) => setSelectedRecords(records)}
                      onRowDeleted={deleteHandler}
                      deleteRowCondition={(record: OrderDetail) => record.ProductId != 42}
                      onRowDuplicated={duplicathandler}
                      onRowDragging={draggingHandler} >
            <Column key={"Id"} accessor={"Id"} />
            <Column key={"RowId"} accessor={"RowId"} />
            <Column key={"OrderId"} accessor={"OrderId"} />
            <Column key={"ProductId"} accessor={"ProductId"} />
            <Column key={"UnitPrice"} accessor={"UnitPrice"}  />
            <Column key={"Quantity"} accessor={"Quantity"} />
            <Column key={"Discount"} accessor={"Discount"} />
          </RadifGrid>
        </div>
        <Notifications />
      </MantineProvider>
    </DirectionProvider>
  );
}

type Filter = {column: string, value: number | string | any[], operator: string}    

  // This could be an API call
type DataInfo =
  | {
      page?: never;
      pageSize?: never;
      sortStatus?: DataTableSortStatus<Order>;
      filterInfo?: Filter[];
    }
  | {
      page: number;
      pageSize: number;
      sortStatus?: DataTableSortStatus<Order>;
      filterInfo?: Filter[];
    }



const getAllCustomers = () =>  Northwind.Customers.map((customer: any) => ({value: customer.Id, label: customer.Id}))
export default App;
