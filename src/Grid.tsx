import React, { useState } from 'react'
import { companies, type Company } from './Companies'
import { DataTable, DataTableColumn, useDataTableColumns } from 'mantine-datatable';
import { Menu } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
const key = 'draggable-example';
import { DragableList } from './DragableMenu';


export default function Grid() {
  const columns :DataTableColumn<Company>[] = [
    {
      accessor: 'name',
      draggable: true, 
      resizable: true,
      title: 'name',
      toggleable: true
    },
    {
      accessor: 'streetAddress',
      draggable: true, 
      resizable: true,
      title: 'streetAddress',
      toggleable: true
    },
    {
      accessor: 'city',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "city"

    },
    {
      accessor: 'state',
      textAlign: 'right',
      title: 'state'
    },
    {
      accessor: 'missionStatement',
      textAlign: 'right',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "missionStatement"
    },
  ]

  const { effectiveColumns, columnsToggle, columnsOrder,  setColumnsOrder, setColumnsToggle } = useDataTableColumns<Company>({
    key,
    columns: [...columns, {
      accessor: 'Columns',
      title:  ""
    }]
  });

  const columnMenu = (): JSX.Element =>
    <Menu shadow="md" width={200}>
      <Menu.Target><IconPlus size={30}/></Menu.Target>
      <Menu.Dropdown>
        <DragableList columns={columnsToggle} order ={columnsOrder} setOrder={setColumnsOrder} onClick={toggleColumn}/>
      </Menu.Dropdown>
    </Menu>

    effectiveColumns[effectiveColumns.length -1 ].title = columnMenu()  

  function toggleColumn(columnName: string) {
    const index = columnsToggle.findIndex(c => c.accessor == columnName)
    columnsToggle[index].toggled = !columnsToggle[index].toggled
    setColumnsToggle([...columnsToggle]);
  }

    const [selectedRecords, setSelectedRecords] = useState<Company[]>([]);


    return (
      <>
        <DataTable
          striped
          highlightOnHover
          highlightOnHoverColor={"lightgray"}
          withTableBorder
          storeColumnsKey={key}
          withColumnBorders
          records={companies}
          columns={effectiveColumns}
          selectedRecords={selectedRecords}
          selectionTrigger='cell'
          onSelectedRecordsChange={setSelectedRecords}
          rowColor={(r) => { if (selectedRecords.find((a => a?.name == r.name))) return "blue" }}
        />
      </>
  )
}
