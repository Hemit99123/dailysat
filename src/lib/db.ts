// Mock database implementation
// This is a temporary solution until Prisma is properly set up

interface MockDatabase {
  // Add mock methods as needed
  studyPlan: {
    findMany: () => Promise<any[]>;
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    upsert: (args: any) => Promise<any>;
  };
  user: {
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
}

// Create a simple in-memory mock DB
export const db: MockDatabase = {
  studyPlan: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (args) => ({ id: "mock_" + Date.now(), ...args.data }),
    update: async (args) => ({ id: "mock_" + Date.now(), ...args.data }),
    upsert: async (args) => ({ id: "mock_" + Date.now(), ...args.data }),
  },
  user: {
    findUnique: async () => null,
    create: async (args) => ({ id: "user_" + Date.now(), ...args.data }),
    update: async (args) => ({ id: "user_" + Date.now(), ...args.data }),
  },
}; 