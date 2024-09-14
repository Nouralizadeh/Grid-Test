import React, {useState} from 'react'
import { companies, type Company } from './Companies'
import { DataTable, DataTableColumn, useDataTableColumns } from 'mantine-datatable';
import { Chip , Group, Button, Menu } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
const key = 'draggable-example';


export default function Grid() {
  const mainColumn: DataTableColumn[] = [
    {
      accessor: 'name',
      draggable: true, 
      resizable: true,
      title: 'name',
      toggleable: true,
    },
    {
      accessor: 'streetAddress',
      draggable: true, 
      resizable: true,
      title: 'streetAddress',
      toggleable: true,
    },
    {
      accessor: 'city',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "city",

    },{
      accessor: 'missionStatement',
      textAlign: 'right',
      draggable: true, 
      resizable: true,
      toggleable: true,
      title: "missionStatement",
    },
    {
      accessor: 'state',
      textAlign: 'right',
      title: 'state',
    },
  ]
  const [columns, setColumns] = useState<DataTableColumn[]>(mainColumn);
  const { effectiveColumns, resetColumnsOrder, resetColumnsToggle } = useDataTableColumns<Company>({
    key,
    columns: columns
  });

  const columnMenu = (): JSX.Element =>
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button><IconPlus /></Button>
      </Menu.Target>
      <Menu.Dropdown>
        {
          mainColumn.map(({ accessor }) =>
            <Menu.Item key={accessor} >
              <Chip checked={columns.findIndex(c => c.accessor == accessor) != -1} onChange={() => toggleColumn(accessor)}>
              {accessor}
              </Chip>
            </Menu.Item>
          )}
      </Menu.Dropdown>
    </Menu>
      

  function toggleColumn(columnName: string) {
    const newColumns = columns.filter((col) => col.accessor !== columnName);

    if (columns.length === newColumns.length) {
      const primaryIndex = mainColumn.findIndex(c => c.accessor == columnName)
      let previousCol = primaryIndex - 1
      let trueIndex = -1
      while (primaryIndex > 0 && previousCol > -1 && trueIndex == -1) {
        trueIndex = columns.findIndex(c => c.accessor == mainColumn[previousCol].accessor)
        previousCol--
      }
      trueIndex++;
      newColumns.splice(trueIndex, 0, mainColumn[primaryIndex]);
    }
    setColumns(newColumns);
  }

    const [selectedRecords, setSelectedRecords] = useState<Company[]>([]);


    return (
      <>
        <Group justify="right">
          <Button onClick={resetColumnsToggle}>Reset toggled columns</Button>
          <Button onClick={resetColumnsOrder}>Reset columns order</Button>
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
