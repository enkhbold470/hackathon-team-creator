import { prismaMock } from "./lib/__mocks__/prisma";

beforeEach(() => {
  vi.resetModules();
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(() => Promise.resolve({ id: "test-user-id" })),
}));

vi.mock("./lib/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));
