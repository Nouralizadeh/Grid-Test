import type { Meta, StoryObj } from "@storybook/react";
import { createTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import OrderDetailsGrid from "../samples/OrderDetailsGrid";
import Northwind from "northwind-data";
import { OrderDetail } from "src/GridData";

type GridPropsAndCustomArgs = React.ComponentProps<typeof OrderDetailsGrid>;

const meta: Meta<GridPropsAndCustomArgs> = {
  component: OrderDetailsGrid,
  render: ({ ...args }) => (
    <MantineProvider theme={theme}>
      <div>
        <OrderDetailsGrid orderDetails={Northwind.OrderDetails.slice(2, 25)} {...args}  />
      </div>
    </MantineProvider>
  ),
};

const theme = createTheme({});
export default meta;
type Story = StoryObj<GridPropsAndCustomArgs>;

export const withOrderId: Story = {
  args: {
    height: 300,
    orderDetails: Northwind.OrderDetails.filter(((d: OrderDetail) => d.OrderId == 10248))
  },
};
