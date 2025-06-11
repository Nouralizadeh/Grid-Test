
export default function checkRecordsSelection<T>(
    records: T[],
    selectedRecords: T[],
    compareFn?: (a: T, b: T) => boolean
  ): { allSelected: boolean; someSelected: boolean; noneSelected: boolean } {
    // Handle empty records array case
    if (records.length === 0) {
      return {
        allSelected: false,
        someSelected: false,
        noneSelected: true
      };
    }
  
    // Handle empty selected records case
    if (selectedRecords.length === 0) {
      return {
        allSelected: false,
        someSelected: false,
        noneSelected: true
      };
    }
  
    // Use custom compare function if provided, otherwise use default equality check
    const defaultCompare = (a: T, b: T) => a === b;
    const compare = compareFn || defaultCompare;
  
    // Check if ALL records exist in selectedRecords
    const allSelected = records.every(record =>
      selectedRecords.some(selected => compare(record, selected))
    );
  
    // Check if ANY records exist in selectedRecords
    const someSelected = records.some(record =>
      selectedRecords.some(selected => compare(record, selected))
    );
  
    return {
      allSelected,
      someSelected,
      noneSelected: !someSelected // Derive noneSelected from someSelected
    };
  }