import type { Meta, StoryObj } from "@storybook/react";
import { createTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import OrderGrid from "../samples/OrderGrid";
import Northwind from "northwind-data";

type GridPropsAndCustomArgs = React.ComponentProps<typeof OrderGrid>;

const meta: Meta<GridPropsAndCustomArgs> = {
  component: OrderGrid,
  render: ({ ...args }) => (
    <MantineProvider theme={theme}>
      <div>
        <OrderGrid {...args} orders={Northwind.Orders.slice(0, 25)}/>
      </div>
    </MantineProvider>
  ),
};

const theme = createTheme({});
export default meta;
type Story = StoryObj<GridPropsAndCustomArgs>;

export const simpleGrid: Story = {
  args: {
    height: 300
  },
};


