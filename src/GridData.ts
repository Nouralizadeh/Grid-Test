export type Product ={
  Id: number,
  ProductName: string,
  SupplierId: number,
  CategoryId: number,
  QuantityPerUnit: string,
  UnitPrice: number,
  UnitsInStock: number,
  UnitsOnOrder: number,
  ReorderLevel: number,
  Discontinued: number
}
export type Order = {
  Id: number,
  CustomerId: string,
  EmployeeId: number,
  OrderDate: string,
  RequiredDate: string,
  ShippedDate: string | null,
  ShipVia: number,
  Freight: number,
  ShipName: string,
  ShipAddress: string,
  ShipCity: string,
  ShipRegion: string,
  ShipPostalCode: string | null,
  ShipCountry: string,
  ShipperId: number,
  Details: OrderDetail[]
}
export type OrderDetail = {
  Id: string,
  RowId?: number,
  OrderId: number,
  ProductId: number,
  UnitPrice: number,
  Quantity: number,
  Discount: number
}
