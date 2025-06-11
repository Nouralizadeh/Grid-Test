
import React from 'react'
import Column from '../Column';
import { Order } from '../GridData';
import ListGrid from '../ListGrid';

interface IProps {
  orders:Order[],
  height?: number,
  onRowDoubleClick?: (e: Order) => void,
  onRowClick?: (e: Order) => void
}
function OrderGrid(props: IProps) {
  return (
    <ListGrid
      gridData={props.orders}
      idAccessor={"Id"}
      {...props}
    >
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
    </ListGrid>

  )
}

export default OrderGrid