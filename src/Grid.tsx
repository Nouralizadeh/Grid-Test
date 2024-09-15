import React, { useEffect, useState } from 'react'
import { companies, type Company } from './Companies'
import { DataTable, DataTableColumn, useDataTableColumns } from 'mantine-datatable';
import { Chip , Group, Button, Menu } from '@mantine/core';
import { IconFileCertificate, IconPlus } from '@tabler/icons-react';
const key = 'draggable-example';
import { DragableList } from './DragableMenu';


export default function Grid() {
  const mainColumn: DataTableColumn[] = [
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

    },{
      accessor: 'missionStatement',
      textAlign: 'right',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "missionStatement"
    },
    {
      accessor: 'state',
      textAlign: 'right',
      title: 'state'
    },
  ]

  
  const [columns, setColumns] = useState<DataTableColumn[]>(mainColumn);
  const { effectiveColumns, columnsToggle, resetColumnsOrder, resetColumnsToggle, setColumnsOrder, setColumnsToggle } = useDataTableColumns<Company>({
    key,
    columns: columns
  });

  

  const columnMenu = (): JSX.Element =>
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button><IconPlus /></Button>
      </Menu.Target>
      <Menu.Dropdown>
        <DragableList columns={columnsToggle} setColumnsOrder={setColumnsOrder} onClick={toggleColumn}/>
      </Menu.Dropdown>
    </Menu>
      

  function toggleColumn(columnName: string) {
    const index = columnsToggle.findIndex(c => c.accessor == columnName)
    columnsToggle[index].toggled = !columnsToggle[index].toggled
    setColumnsToggle([...columnsToggle]);
  }

    const [selectedRecords, setSelectedRecords] = useState<Company[]>([]);


    return (
      <>
        <Group justify="right">
          {columnMenu()}
        </Group>
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
