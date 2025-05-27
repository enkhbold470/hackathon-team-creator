import { currentUser } from "@clerk/nextjs/server";

import {
  getPotentialMatches,
  handleMatchAction,
} from "@/app/actions/getMatches";
import { prisma } from "@/lib/prisma";

describe("getPotentialMatches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns no matches if unauthenticated", async () => {
    vi.mocked(currentUser).mockResolvedValueOnce(null);

    const result = await getPotentialMatches();

    expect(result).toBe(null);
  });

  it("returns transformed match results", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        user_id: "user2",
        full_name: "Jane Doe",
        discord: "jane#1234",
        skill_level: "Intermediate",
        hackathon_experience: "Yes",
        project_experience: "Lots",
        fun_fact: "I love cats",
        self_description: "Builder",
        what_to_build: "AI tools",
        linkedin: "https://linkedin.com/in/jane",
        github: "https://github.com/jane",
        instagram: "",
      },
    ] as Awaited<ReturnType<typeof prisma.user.findMany>>);

    const result = await getPotentialMatches();

    expect(result).toStrictEqual([
      {
        user_id: "user2",
        full_name: "Jane Doe",
        discord: "jane#1234",
        skill_level: "Intermediate",
        hackathon_experience: "Yes",
        project_experience: "Lots",
        fun_fact: "I love cats",
        self_description: "Builder",
        future_plans: "AI tools",
        links: "https://linkedin.com/in/jane https://github.com/jane",
      },
    ]);
  });

  it("returns an empty array if no potential matches", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    const result = await getPotentialMatches();

    expect(result).toEqual([]);
  });

  it("handles users with missing optional fields", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      {
        user_id: "user3",
        full_name: null,
        discord: null,
        skill_level: null,
        hackathon_experience: null,
        project_experience: null,
        fun_fact: null,
        self_description: null,
        what_to_build: null,
        linkedin: null,
        github: null,
        instagram: null,
      },
    ] as Awaited<ReturnType<typeof prisma.user.findMany>>);

    const result = await getPotentialMatches();

    expect(result).toStrictEqual([
      {
        user_id: "user3",
        full_name: "",
        discord: "",
        skill_level: "",
        hackathon_experience: "",
        project_experience: "",
        fun_fact: "",
        self_description: "",
        future_plans: "",
        links: "",
      },
    ]);
  });
});

describe("handleMatchAction", () => {
  const targetUserId = "some-user";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fails if unauthenticated", async () => {
    vi.mocked(currentUser).mockResolvedValueOnce(null);

    const { success } = await handleMatchAction(targetUserId, "interested");

    expect(success).toBe(false);
  });

  it("pass someone up", async () => {
    const { success } = await handleMatchAction(targetUserId, "pass");

    expect(prisma.match.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          user_id_1: "test-user-id",
          user_id_2: targetUserId,
          status: "passed",
        },
      })
    );

    expect(success).toBe(true);
  });

  it("no match if target user shows no interest", async () => {
    const { success } = await handleMatchAction(targetUserId, "interested");

    expect(prisma.match.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          user_id_1: "test-user-id",
          user_id_2: targetUserId,
          status: "interested",
        },
      })
    );

    expect(prisma.match.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          user_id_1: targetUserId,
          user_id_2: "test-user-id",
          status: "interested",
        },
      })
    );

    expect(prisma.match.updateMany).not.toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { user_id_1: "test-user-id", user_id_2: targetUserId },
            { user_id_1: targetUserId, user_id_2: "test-user-id" },
          ],
        },
        data: {
          status: "matched",
        },
      })
    );

    expect(success).toBe(true);
  });

  it("updates status to matched if both users are interested", async () => {
    vi.mocked(prisma.match.findFirst).mockResolvedValueOnce({
      user_id_1: targetUserId,
      user_id_2: "test-user-id",
      status: "interested",
    } as Awaited<ReturnType<typeof prisma.match.findFirst>>);

    const { success } = await handleMatchAction(targetUserId, "interested");

    expect(prisma.match.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          user_id_1: "test-user-id",
          user_id_2: targetUserId,
          status: "interested",
        },
      })
    );

    expect(prisma.match.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { user_id_1: "test-user-id", user_id_2: targetUserId },
            { user_id_1: targetUserId, user_id_2: "test-user-id" },
          ],
        },
        data: {
          status: "matched",
        },
      })
    );

    expect(success).toBe(true);
  });
});
