import { DataTable } from 'mantine-datatable';
import companies from './companies.json';

export default function BasicUsageExample() {
  return (
    <DataTable
      columns={[{ accessor: 'name', width : "15%" }, { accessor: 'streetAddress', width: "60%" }, { accessor: 'city', width: "15%" }, { accessor: 'state', width : "10%" }]}
      records={companies}
    />
  );
}