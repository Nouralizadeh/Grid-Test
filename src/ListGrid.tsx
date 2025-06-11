import React from 'react'
import Grid, { GridGeneralProps } from './Grid'

function ListGrid<T>(props: GridGeneralProps<T>) {
  return (
    <Grid {...props} />
  )
}

export default ListGrid