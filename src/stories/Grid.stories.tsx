import type { Meta, StoryObj } from "@storybook/react";

import Grid from "../Grid";
import Northwind from "northwind-data";
import { createTheme } from "@mantine/core";
import Column from "../Column";
import { MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import { Product } from "../GridData";
import { DataTableSortStatus } from "mantine-datatable";
import {sortBy} from 'lodash';

type GridPropsAndCustomArgs = React.ComponentProps<typeof Grid<Product>>;

const meta: Meta<GridPropsAndCustomArgs> = {
  component: Grid,
  render: ({ ...args }) => (
    <MantineProvider theme={theme}>
      <div>
        <Grid {...args} idAccessor={"Id"}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"} accessor={"ProductName"} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  ),
};

const theme = createTheme({});
export default meta;

type Story = StoryObj<GridPropsAndCustomArgs>;
export const simpleGrid: Story = {
  args: {
    gridData: Northwind.Products.slice(0, 10),
  },
};


export const WithCustomRender = () => {
  const filterdData = Northwind.Products.slice(0, 10);
  const [data] = useState<Product[]>(filterdData);

  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data} idAccessor={"Id"} >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"}
                  accessor={"ProductName"} />
          <Column key={"SupplierId"}
                  accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"}
                  accessor={"UnitPrice"}
                  render={(cellProps?: any) => <div style={{ background: "#228be6" }}>{cellProps.value}</div>} />
          <Column key={"UnitsInStock"}
                  accessor={"UnitsInStock"}
                  render={(cellProps?: any) => <div style={{ background: "#228ff6" }}>{cellProps.value}</div>} />
          <Column key={"UnitsOnOrder"}
                  accessor={"UnitsOnOrder"}
                  render={(cellProps?: any) => <div style={{ background: "#608ff6" }}>{cellProps.value}</div>} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};


export const PaginatedGrid = () => {
  const pageSizes = [5, 10, 15, 20];
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Product[]>(getData({page, pageSize}));

  const pageChange = (page: number) => {
    setData(getData({page, pageSize}))
    setPage(page)
  }

  const pageSizeChange = (pageSize: number) => {
    setData(getData({page, pageSize}))
    setPageSize(pageSize)
  }

  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data}
              idAccessor={"Id"}
              pagination={{ totalRecords: 25,
                            page: page,
                            onPageChange: pageChange,
                            pageSize: pageSize,
                            pageSizes: pageSizes,
                            onPageSizeChange: pageSizeChange,
                          }}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"} accessor={"ProductName"} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};

export const SortableColumn = () => {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Product>>({ columnAccessor: "Id", direction: "asc" })
  const [data, setData] = useState<Product[]>(getData({ sortStatus }));

  const sortChange = (sortStatus: DataTableSortStatus<Product>) => {
    setData(getData({sortStatus }))
    setSortStatus(sortStatus)
  }
  
  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data} 
              idAccessor={"Id"} 
              sortStatus={sortStatus}
              onSortStatusChange={sortChange}>
          <Column key={"Id"} accessor={"Id"} sortable={true} />
          <Column key={"ProductName"} accessor={"ProductName"} sortable={true} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};

export const SortAndPagination = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Product>>({columnAccessor:"UnitPrice", direction:"asc"})
  const [data, setData] = useState<Product[]>(getData({sortStatus}));

  useEffect(() => {
    setData(getData({page, pageSize: pageSize, sortStatus}))
  }, [sortStatus, page]);
  
  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data} 
              idAccessor={"Id"} 
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              pagination={{
              totalRecords: 25,
              page: page,
              onPageChange: setPage,
              pageSize: pageSize}}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"} accessor={"ProductName"} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} sortable={true} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};

export const SelectableGrid = () => {
  const filterdData = Northwind.Products.slice(0, 10);
  const [data] = useState<Product[]>(filterdData);
  const [selectedRecords, setSelectedRecords] = useState<Product[]>([])
  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data} 
              idAccessor={"Id"} 
              selectedRecords={selectedRecords}
              onSelectedChange={(records) => setSelectedRecords(records)}>
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"} accessor={"ProductName"} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};

export const FilterAndSearch = () => {
  const [data, setData] = useState<Product[]>(getData({}));
  const [categoryId, setCategoryId] = useState<{value: string, label: string} | null>(null)
  const [productName, setProductName] = useState<string>("")
  const [unitsInStock, setUnitsInStock] = useState<number|null>(null)
  const [filterInfo, setFilterInfo] = useState<any[]>([])

  const addFilter = (columnName: string, value: any) => {
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
  useEffect(() => {
    console.log("Selected Category ID:", categoryId);
    setData(getData({filterInfo: filterInfo}))
  }, [filterInfo]);
  
  return (
    <MantineProvider theme={theme}>
      <div>
        <Grid gridData={data} 
              idAccessor={"Id"} 
              >
          <Column key={"Id"} accessor={"Id"} />
          <Column key={"ProductName"} accessor={"ProductName"}
                  filterState={{value: productName, 
                                label:"Product Name",
                                onValueChange: (pn) => {setProductName(pn); addFilter("ProductName", pn )} }} />
          <Column key={"SupplierId"} accessor={"SupplierId"} />
          <Column key={"CategoryId"} accessor={"CategoryId"} 
                  filterState={{value: categoryId, 
                                label:"Category Id", 
                                onValueChange: (cId) => {setCategoryId(cId); addFilter("CategoryId", cId )}, 
                                allOptions: getAllCategories()}} />
          <Column key={"QuantityPerUnit"} accessor={"QuantityPerUnit"} />
          <Column key={"UnitPrice"} accessor={"UnitPrice"} sortable={true} />
          <Column key={"UnitsInStock"} accessor={"UnitsInStock"}
                  filterState={{value: unitsInStock, 
                                label:"Units In Stock",
                                onValueChange: (us) => {setUnitsInStock(us); addFilter("UnitsInStock", us )} }} />
          <Column key={"UnitsOnOrder"} accessor={"UnitsOnOrder"} />
          <Column key={"ReorderLevel"} accessor={"ReorderLevel"} />
          <Column key={"Discontinued"} accessor={"Discontinued"} />
        </Grid>
      </div>
    </MantineProvider>
  );
};
export const ClickGridRow: Story = {
  args: {
    gridData: Northwind.Products,
    onRowClick: (row) => console.log("Clicked row : ", row)
  },
};

export const DoubleClickGridRow: Story = {
  args: {
    gridData: Northwind.Products,
    onRowDoubleClick: (row) => console.log("Double Clicked row : ", row)
  },
};

type dataInfo = {page?: never, pageSize?: never, sortStatus?: DataTableSortStatus<Product>, filterInfo?: any[]} |
                {page: number, pageSize: number, sortStatus?: DataTableSortStatus<Product>, filterInfo?: any[]}

const filterData = (data: Product[], filterInfo: any[]) => {
  let result = [...data];
  filterInfo?.forEach(filter => {
    switch (filter.column) {
      case "CategoryId":
        if (filter.value != null && filter.value.label)
          result = result.filter((product: Product) => filter.value.value == product.CategoryId);
        break;

      case "ProductName":
        if (typeof filter.value === 'string' && filter.value !== "")
          result = result.filter(product => product.ProductName === filter.value);
        break;

      case "UnitsInStock":
       if (typeof filter.value === 'number' && filter.value !== null)
          result = result.filter(product => product.UnitsInStock === filter.value);
        break;

      default:
        break;
    }
  });
  return result;

}
const getData = ({ page, pageSize, sortStatus, filterInfo }: dataInfo) => {
  const originalDataLength = 25
  let result = filterInfo ? filterData(Northwind.Products.slice(0, originalDataLength), filterInfo): Northwind.Products.slice(0, originalDataLength)
  if (sortStatus) {
    result = sortBy(result, sortStatus.columnAccessor) as Product[];
    if (sortStatus.direction === "desc") result.reverse()
  }

  if (page) {
    const from = (page - 1) * pageSize
    const to = page * pageSize
    result = result.slice(from, to)
  }

  return (result)
}

const getAllCategories = () =>  Northwind.Categories.map((category: any) => ({value: category.Id.toString(), label: category.CategoryName}))