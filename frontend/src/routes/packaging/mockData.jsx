export const mockClients = [
  {
    id: '1',
    name: 'Acme Corporation',
    city: 'New York',
    lastOrderDate: '2h ago',
    lastOrderPreview: 'Office supplies and equipment',
    pendingOrders: 3
  },
  {
    id: '2',
    name: 'TechStart Inc.',
    city: 'San Francisco',
    lastOrderDate: '5h ago',
    lastOrderPreview: 'Computer components and accessories',
    pendingOrders: 1
  },
  {
    id: '3',
    name: 'Green Valley Store',
    city: 'Chicago',
    lastOrderDate: '1d ago',
    lastOrderPreview: 'Retail packaging materials',
    pendingOrders: 2
  },
  {
    id: '4',
    name: 'Metro Restaurant',
    city: 'Los Angeles',
    lastOrderDate: '2d ago',
    lastOrderPreview: 'Kitchen equipment and utensils',
    pendingOrders: 0
  },
  {
    id: '5',
    name: 'Blue Ocean Hotels',
    city: 'Miami',
    lastOrderDate: '3d ago',
    lastOrderPreview: 'Hospitality supplies and linens',
    pendingOrders: 1
  }
];

export const mockOrders = {
  '1': [
    {
      id: '1001',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'pending',
      totalItems: 15,
      totalAmount: 2450.0,
      items: [
        {
          id: 'item1',
          name: 'Executive Office Chairs',
          description: 'Ergonomic leather chairs with adjustable height',
          price: 299.99,
          quantity: 5,
          instructions: 'Assemble before delivery. Place in conference room.',
          sentToBilling: false
        },
        {
          id: 'item2',
          name: 'Standing Desks',
          description: 'Electric height-adjustable desks',
          price: 599.99,
          quantity: 3,
          instructions: 'Position near windows for natural light',
          sentToBilling: true
        },
        {
          id: 'item3',
          name: 'Office Supplies Kit',
          description: 'Pens, papers, folders, and basic stationery',
          price: 49.99,
          quantity: 10,
          sentToBilling: false
        }
      ]
    },
    {
      id: '1002',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-12',
      status: 'processing',
      totalItems: 8,
      totalAmount: 1200.0,
      items: [
        {
          id: 'item4',
          name: 'Printer Paper',
          description: 'A4 size, 500 sheets per pack',
          price: 25.99,
          quantity: 20,
          sentToBilling: true
        },
        {
          id: 'item5',
          name: 'Wireless Mouse',
          description: 'Optical wireless mouse with USB receiver',
          price: 35.99,
          quantity: 15,
          instructions: 'Test all devices before shipping',
          sentToBilling: false
        }
      ]
    }
  ],
  '2': [
    {
      id: '2001',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-14',
      status: 'pending',
      totalItems: 12,
      totalAmount: 3200.0,
      items: [
        {
          id: 'item6',
          name: 'Gaming Monitors',
          description: '27-inch 4K gaming monitors',
          price: 399.99,
          quantity: 6,
          instructions: 'Handle with care - fragile electronics',
          sentToBilling: false
        },
        {
          id: 'item7',
          name: 'Mechanical Keyboards',
          description: 'RGB backlit mechanical keyboards',
          price: 149.99,
          quantity: 6,
          sentToBilling: false
        }
      ]
    }
  ],
  '3': [
    {
      id: '3001',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-13',
      status: 'completed',
      totalItems: 50,
      totalAmount: 850.0,
      items: [
        {
          id: 'item8',
          name: 'Cardboard Boxes',
          description: 'Various sizes for retail packaging',
          price: 2.5,
          quantity: 200,
          sentToBilling: true
        },
        {
          id: 'item9',
          name: 'Bubble Wrap',
          description: 'Protective packaging material',
          price: 15.99,
          quantity: 20,
          instructions: 'Store in dry place',
          sentToBilling: true
        }
      ]
    }
  ]
};
