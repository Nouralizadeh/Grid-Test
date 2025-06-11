
import React, { useState } from 'react'
import Column from '../Column';
import { OrderDetail } from '../GridData';
import RadifGrid from '../RadifGrid';

interface IProps {
    orderDetails: OrderDetail[],
    onChangeData?: (records: OrderDetail[]) => void,
    height?: number,
    onRowDoubleClick?: any,
    onRowClick?: any,
    selectable?: boolean
}

function OrderDetailsGrid(props: IProps) {
     const [records, setRecords] = useState(props.orderDetails);

    function duplicathandler(rowIndex: number) {
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

    return (
        <RadifGrid
            gridData={records}
            idAccessor={"Id"}
            onSelectedChange={(r) => console.log("Selected rows", r)}
            {...props}
            onRowDuplicated={duplicathandler}
        >
            <Column key={"Id"} accessor={"Id"} />
            <Column key={"RowId"} accessor={"RowId"} />
            <Column key={"OrderId"} accessor={"OrderId"} />
            <Column key={"ProductId"} accessor={"ProductId"} />
            <Column key={"UnitPrice"} accessor={"UnitPrice"} />
            <Column key={"Quantity"} accessor={"Quantity"} />
            <Column key={"Discount"} accessor={"Discount"} />
        </RadifGrid>

    )
}  

export default OrderDetailsGrid