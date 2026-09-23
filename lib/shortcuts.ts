export type ShortcutDefinition = {
  keys: string[];
  description: string;
  scope: "Global" | "Colors" | "Typography" | "Icons";
};

export const shortcuts: ShortcutDefinition[] = [
  { keys: ["⌘", "K"], description: "Open command palette", scope: "Global" },
  { keys: ["/"], description: "Open command palette", scope: "Global" },
  { keys: ["?"], description: "Show keyboard shortcuts", scope: "Global" },
  { keys: ["⌥", "T"], description: "Toggle dark / light theme", scope: "Global" },
  { keys: ["G", "H"], description: "Go home", scope: "Global" },
  { keys: ["G", "T"], description: "Go to Typography Studio", scope: "Global" },
  { keys: ["G", "C"], description: "Go to Color Studio", scope: "Global" },
  { keys: ["G", "I"], description: "Go to Icon Studio", scope: "Global" },
  { keys: ["G", "E"], description: "Go to Export Engine", scope: "Global" },
];
