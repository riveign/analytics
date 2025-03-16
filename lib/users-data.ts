export interface User {
  id: string;
  name: string;
  connectionType:
    | "metamask"
    | "coinbase"
    | "trustwallet"
    | "phantom"
    | "google"
    | "facebook"
    | "x"
    | "email";
  identifier: string;
  lastConnected: string;
  firstConnected: string;
  status: "active" | "inactive";
}

// Generate 100 mock users
const generateMockUsers = (): User[] => {
  const users: User[] = [];
  const connectionTypes: User["connectionType"][] = [
    "metamask",
    "coinbase",
    "trustwallet",
    "phantom",
    "google",
    "facebook",
    "x",
    "email",
  ];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];

  const generateIdentifier = (type: User["connectionType"]): string => {
    switch (type) {
      case "metamask":
      case "coinbase":
      case "trustwallet":
      case "phantom":
        return `0x${Math.random().toString(16).slice(2, 42)}`;
      case "google":
        return `user${Math.floor(Math.random() * 1000)}@gmail.com`;
      case "facebook":
        return `fb/user${Math.floor(Math.random() * 1000)}`;
      case "x":
        return `@user${Math.floor(Math.random() * 1000)}`;
      case "email":
        return `user${Math.floor(Math.random() * 1000)}@example.com`;
    }
  };

  const generateFirstConnected = () => {
    // Generate a date between 1 year ago and 1 month ago
    const end = Date.now() - 30 * 24 * 60 * 60 * 1000; // 1 month ago
    const start = end - 11 * 30 * 24 * 60 * 60 * 1000; // 11 months before that
    return new Date(start + Math.random() * (end - start)).toISOString();
  };

  for (let i = 1; i <= 100; i++) {
    const connectionType =
      connectionTypes[Math.floor(Math.random() * connectionTypes.length)];
    const firstConnected = generateFirstConnected();
    const user: User = {
      id: `user-${i}`,
      name: `User ${i}`,
      connectionType,
      identifier: generateIdentifier(connectionType),
      firstConnected,
      lastConnected: new Date(
        new Date(firstConnected).getTime() +
          Math.random() * (Date.now() - new Date(firstConnected).getTime())
      ).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
    users.push(user);
  }

  return users;
};

export const mockUsers = generateMockUsers();
