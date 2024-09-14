import React, {useState} from 'react'
import { companies, type Company } from './Companies'
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Chip , Group, Button, Menu } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
const key = 'draggable-example';
import { DragableList } from './DragableMenu';


export default function Grid() {
  const mainColumn: DataTableColumn[] = [
    {
      accessor: 'name',
      draggable: true, 
      resizable: true,
      title: 'name',
      toggleable: true,
      visible: true
    },
    {
      accessor: 'streetAddress',
      draggable: true, 
      resizable: true,
      title: 'streetAddress',
      toggleable: true,
      visible: true
    },
    {
      accessor: 'city',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "city",
      visible: true

    },{
      accessor: 'missionStatement',
      textAlign: 'right',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "missionStatement",
      visible: true
    },
    {
      accessor: 'state',
      textAlign: 'right',
      title: 'state',
      visible: true
    },
  ]

  
  const [columns, setColumns] = useState<DataTableColumn[]>(mainColumn);
  // const { effectiveColumns, resetColumnsOrder, resetColumnsToggle } = useDataTableColumns<Company>({
  //   key,
  //   columns: columns
  // });

  const columnMenu = (): JSX.Element =>
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button><IconPlus /></Button>
      </Menu.Target>
      <Menu.Dropdown>
        <DragableList data={columns} setData={setColumns} onClick={toggleColumn}/>
      </Menu.Dropdown>
    </Menu>
      

  function toggleColumn(columnName: string) {
    const index = columns.findIndex(c => c.accessor == columnName)
    columns[index].visible = !columns[index].visible
    setColumns([...columns]);
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
          columns={columns.filter(c => c.visible)}
          selectedRecords={selectedRecords}
          selectionTrigger='cell'
          onSelectedRecordsChange={setSelectedRecords}
          rowColor={(r) => { if (selectedRecords.find((a => a?.name == r.name))) return "blue" }}
        />
      </>
  )
}
