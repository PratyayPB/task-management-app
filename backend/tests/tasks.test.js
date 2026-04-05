process.env.NODE_ENV = "test";

jest.mock("../src/models/task.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

import request from "supertest";

import { createApp } from "../src/app.js";
import Task from "../src/models/task.model.js";

describe("Task API", () => {
  let app;

  beforeAll(() => {
    app = createApp({ enableClerk: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function withAuth(req, userId = "user_test_123") {
    return req.set("x-test-user-id", userId);
  }

  it("requires authentication for task routes", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toMatch(/authentication/i);
  });

  it("creates a task and returns it in the list", async () => {
    const createdTask = {
      _id: "6800a4a969e5a1f967bb0c10",
      category: "Work",
      createdBy: "user_test_123",
      description: "Write the project README",
      dueDate: "2026-04-10T00:00:00.000Z",
      isCompleted: false,
      title: "Document the API",
    };

    Task.create.mockResolvedValue(createdTask);
    Task.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([createdTask]),
    });

    const createResponse = await withAuth(request(app).post("/api/tasks")).send(
      {
        category: "Work",
        description: "Write the project README",
        dueDate: "2026-04-10T00:00:00.000Z",
        title: "Document the API",
      },
    );

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.data.title).toBe("Document the API");
    expect(Task.create).toHaveBeenCalledWith({
      category: "Work",
      createdBy: "user_test_123",
      description: "Write the project README",
      dueDate: new Date("2026-04-10T00:00:00.000Z"),
      title: "Document the API",
    });

    const listResponse = await withAuth(request(app).get("/api/tasks"));

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.data[0].category).toBe("Work");
    expect(Task.find).toHaveBeenCalledWith({ createdBy: "user_test_123" });
  });

  it("rejects empty task titles", async () => {
    const response = await withAuth(request(app).post("/api/tasks")).send({
      title: "   ",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed.");
    expect(response.body.details).toContain("Task title cannot be empty.");
    expect(Task.create).not.toHaveBeenCalled();
  });

  it("prevents completing the same task twice", async () => {
    Task.findOne.mockResolvedValue({
      _id: "6800a4a969e5a1f967bb0c11",
      createdBy: "user_test_123",
      isCompleted: true,
      title: "Ship task API",
    });

    const response = await withAuth(
      request(app).patch("/api/tasks/6800a4a969e5a1f967bb0c11/complete"),
    );

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already marked/i);
  });
});
