import React, {useState} from 'react'
import { companies, type Company } from './Companies'
import { DataTable, DataTableColumn, useDataTableColumns } from 'mantine-datatable';
import { Text, Group, Button } from '@mantine/core';
import { IconBuildingSkyscraper, IconRoadSign, IconBuildingCommunity, IconMap } from '@tabler/icons-react';
const key = 'draggable-example';


export default function Grid() {
  const [columns, setColumns] = useState<DataTableColumn[]>([
    {
      accessor: 'name',
      draggable: true, 
      resizable: true,
      title: (
        <Group gap={4} mt={-1}>
          <IconBuildingSkyscraper size={16} />
          <Text inherit mt={1}>
            Company
          </Text>
        </Group>
      ),
      width: '40%',
      toggleable: true,
      defaultToggle: false,
    },
    {
      accessor: 'streetAddress',
      draggable: true, 
      resizable: true,
      title: (
        <Group gap={4} mt={-1}>
          <IconRoadSign size={16} />
          <Text inherit mt={1}>
            Street Address
          </Text>
        </Group>
      ),
      width: '60%',
      toggleable: true,
    },
    {
      accessor: 'city',
      draggable: true, 
      resizable: true,
      title: (
        <Group gap={4} mt={-1}>
          <IconBuildingCommunity size={16} />
          <Text inherit mt={1}>
            City
          </Text>
        </Group>
      ),
      width: 160,
      toggleable: true,
    },
    {
      accessor: 'state',
      textAlign: 'right',
      title: (
        <Group justify="right">
          <IconMap size={16} />
        </Group>
      ),
    },
  ]);
  const { effectiveColumns, resetColumnsOrder, resetColumnsToggle } = useDataTableColumns<Company>({
    key,
    columns: columns
  });

  function toggleColumnMissionStatement() {
    const newColumns = columns.filter((col) => col.accessor !== 'missionStatement');
    if (columns.length === newColumns.length) {
      newColumns.push({
        accessor: 'missionStatement',
        title: (
          <Group gap={4} mt={-1} wrap="nowrap">
            <IconBuildingSkyscraper size={16} />
            <Text inherit mt={1}>
              Mission Statement
            </Text>
          </Group>
        ),
        width: '40%',
        toggleable: true,
        defaultToggle: true,
      });
    }
    setColumns(newColumns);
  }

    const [selectedRecords, setSelectedRecords] = useState<Company[]>([]);


    return (
      <>
        <Group>
          <Button onClick={toggleColumnMissionStatement}>Toggle Mission Statement column</Button>
          <Button onClick={resetColumnsToggle}>Reset toggled columns</Button>
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
        <Group justify="right">
          <Button onClick={resetColumnsOrder}>Reset Column Order</Button>
        </Group>
      </>
  )
}
