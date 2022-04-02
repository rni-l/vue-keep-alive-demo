export type ItemType = {
  label: string
  value: string
  comName: string
  noCache?: boolean
  route: {
    name: string,
    query?: Record<string,any>
  }
}

export type TabType = ItemType
