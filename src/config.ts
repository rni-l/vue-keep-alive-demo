export const getMenu = () => ([
  {
    label: 'home',
    value: 'home',
    comName: 'Home',
    route: { name: 'home' }
  },
  {
    label: 'p1-a',
    value: '/p-one?type=a',
    comName: 'POneIndex',
    route: { name: 'p-one', query: { type: 'a'  } }
  },
  {
    label: 'p1-b',
    value: '/p-one?type=b',
    comName: 'POneIndex',
    route: { name: 'p-one', query: { type: 'b'  } }
  },
  {
    label: 'p2-a',
    value: '/p-two?type=a',
    comName: 'PTwoIndex',
    route: { name: 'p-two', query: { type: 'a'  } }
  },
  {
    label: 'p2-b',
    value: '/p-two?type=b',
    comName: 'PTwoIndex',
    route: { name: 'p-two', query: { type: 'b'  } }
  },
  {
    label: 'p3',
    value: '/p-three',
    comName: 'PThree',
    noCache: true,
    route: { name: 'p-three', query: { type: 'b'  } }
  },
])