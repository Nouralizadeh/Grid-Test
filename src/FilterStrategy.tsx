import { TextInput, ActionIcon, MultiSelect, NumberInput, Combobox, useCombobox, ComboboxItem } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import React from 'react';

type BaseFilterProps<T> = {
  label: string;
  description?: string;
  placeholder?: string;
  value: T;
  onValueChange: (value: T) => void;
};

type TextFilter = BaseFilterProps<string>;
type NumberFilter = BaseFilterProps<number | null>;
type SelectFilter = (BaseFilterProps<ComboboxItem | null> & {
      allOptions: ComboboxItem[];
    })
type MultiSelectFilter = (BaseFilterProps<ComboboxItem[] | null> & {
      allOptions: ComboboxItem[];
    });

export type FilterStrategyType =
  | TextFilter
  | NumberFilter
  | SelectFilter
  | MultiSelectFilter;

function isTextFilter(props: any): props is TextFilter {
  return typeof props.value === 'string';
}

function isNumberFilter(props: any): props is NumberFilter {
  return (typeof props.value === 'number' || (props.value === null &&  !('allOptions' in props))) ;
}

function isSelectFilter(props: any): props is SelectFilter {
  return 'allOptions' in props && !Array.isArray(props.value);
}

function isMultiSelectFilter(props: any): props is MultiSelectFilter {
  return 'allOptions' in props && Array.isArray(props.value);
}


function FilterStrategy(props: FilterStrategyType): { filter: React.ReactNode, filtering: boolean } {
  if (isTextFilter(props)) return { 
    filter: <TextFilter {...props} />, 
    filtering: props.value !== "" 
  };
  
  if (isNumberFilter(props)) return { 
    filter: <NumberFilter {...props} />, 
    filtering: props.value !== null 
  };
  
  if (isSelectFilter(props)) return { 
    filter: <SelectFilter {...props} />, 
    filtering: props.value != undefined && props.value !== null 
  };

  if (isMultiSelectFilter(props)) return { 
    filter: <MultiSelectFilter {...props} />, 
    filtering:  props.value != undefined && props.value !== null && props.value.length > 0 
  };

  return { filter: null, filtering: false };
}

const TextFilter = ({
  label,
  description,
  placeholder,
  value,
  onValueChange,
}: TextFilter) => (
  <TextInput
    label={label}
    description={description ?? `Show ${label} include the specified text`}
    placeholder={placeholder ?? `Search ${label}...`}
    leftSection={<IconSearch size={16} />}
    rightSection={
      value && (
        <ActionIcon
          size="sm"
          variant="transparent"
          c="dimmed"
          onClick={() => onValueChange("")}
        >
          <IconX size={14} />
        </ActionIcon>
      )
    }
    value={value}
    onChange={(e) => onValueChange(e.currentTarget.value)}
  />
);

const SelectFilter = ({
  label,
  description,
  placeholder,
  value,
  onValueChange,
  allOptions,
}: SelectFilter) => {
  const [search, setSearch] = React.useState('');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    defaultOpened: true,
    onDropdownOpen(eventSource) {
      setSearch('');
    },
  });
  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const selected = allOptions.find((o) => o.value === val);
        if (selected) {
          onValueChange(selected);
          combobox.closeDropdown();
        }
      }}
    >
      <Combobox.Target>
        <TextInput
          label={label}
          description={description ?? `Show all records ${label} which meet selected Option`}
          placeholder={placeholder ?? `Search ${label}...`}
          value={value?.label || search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            onValueChange(null); 
          }}
          onClick={() => {
            combobox.openDropdown();
          }}
          leftSection={<IconSearch size={16} />}
          rightSection={
            (value || search) && (
              <ActionIcon
                size="sm"
                variant="transparent"
                c="dimmed"
                onClick={() => {
                  onValueChange(null);
                  setSearch('');
                }}
              >
                <IconX size={14} />
              </ActionIcon>
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {allOptions
            .filter((option) =>
              search === '' || option.label.toLowerCase().includes(search.toLowerCase())
            )
            .map((option) => (
              <Combobox.Option key={option.value} value={option.value} style={{ pointerEvents: "auto" }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  const selected = allOptions.find((o) => o.value === option.value);
                  if (selected) {
                    onValueChange(selected);
                    combobox.closeDropdown();
                  }
                }}>
                {option.label}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};


const MultiSelectFilter = ({
  label,
  description,
  placeholder,
  value,
  onValueChange,
  allOptions,
}: MultiSelectFilter) => (
  <MultiSelect
    label={label}
    description={description ?? `Show all records ${label} which is in selected Options`}
    data={allOptions}
    value={value?.map(v => v.value.toString())}
    placeholder={placeholder ?? `Search ${label}...`}
    onChange={(values) => {
      const selectedOptions = allOptions.filter(o => 
        values.includes(o.value.toString())
      );
      onValueChange(selectedOptions);
    }}
    leftSection={<IconSearch size={16} />}
    comboboxProps={{ withinPortal: false }}
    clearable
    searchable
  />
);

const NumberFilter = ({
  label,
  description,
  value,
  onValueChange,
}: NumberFilter) => {
  const handleChange = (val: string | number) => {
    const numValue = typeof val === 'string' ? val !== "" ? parseFloat(val): null : val;
    onValueChange(numValue);
  };

  return (
    <NumberInput
      label={label}
      description={description ?? `Show ${label} equals this value`}
      value={value ?? ""}
      onChange={handleChange}
      hideControls
      leftSection={<IconSearch size={16} />}
      rightSection={
        value !== null && (
          <ActionIcon
            size="sm"
            variant="transparent"
            c="dimmed"
            onClick={() => onValueChange(null)}
          >
            <IconX size={14} />
          </ActionIcon>
        )
      }
    />
  );
};

export default FilterStrategy;