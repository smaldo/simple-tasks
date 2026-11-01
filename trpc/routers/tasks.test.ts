import { beforeEach, describe, expect, it } from "vitest";
import { appRouter } from "./_app";
import { resetTaskStore } from "./tasks";

const caller = appRouter.createCaller({ headers: new Headers() });

beforeEach(() => {
  resetTaskStore();
});

describe("tasks router", () => {
  it("creates a task with title and description", async () => {
    const task = await caller.tasks.create({
      title: "Buy milk",
      description: "2% or oat",
    });

    expect(task.id).toBe("1");
    expect(task.title).toBe("Buy milk");
    expect(task.description).toBe("2% or oat");
    expect(task.creationDate).toBeInstanceOf(Date);
  });

  it("creates a task with title only", async () => {
    const task = await caller.tasks.create({ title: "Title only" });

    expect(task.title).toBe("Title only");
    expect(task.description).toBeUndefined();
  });

  it("rejects creating a task without a title", async () => {
    await expect(caller.tasks.create({ title: "" })).rejects.toThrow();
  });

  it("returns all tasks", async () => {
    expect(await caller.tasks.getAll()).toEqual([]);

    await caller.tasks.create({ title: "One" });
    await caller.tasks.create({ title: "Two", description: "second" });

    const all = await caller.tasks.getAll();
    expect(all).toHaveLength(2);
    expect(all.map((t) => t.title)).toEqual(["One", "Two"]);
  });

  it("updates a task's title and description", async () => {
    const created = await caller.tasks.create({ title: "Old" });

    const updated = await caller.tasks.update({
      id: created.id,
      title: "New",
      description: "added",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.title).toBe("New");
    expect(updated.description).toBe("added");
    expect(updated.creationDate).toEqual(created.creationDate);
  });

  it("leaves untouched fields alone on partial update", async () => {
    const created = await caller.tasks.create({
      title: "Keep me",
      description: "keep me too",
    });

    const updated = await caller.tasks.update({
      id: created.id,
      title: "Changed",
    });

    expect(updated.title).toBe("Changed");
    expect(updated.description).toBe("keep me too");
  });

  it("throws NOT_FOUND when updating a missing task", async () => {
    await expect(
      caller.tasks.update({ id: "999", title: "x" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("deletes a task", async () => {
    const created = await caller.tasks.create({ title: "Temp" });

    const result = await caller.tasks.delete({ id: created.id });
    expect(result).toEqual({ id: created.id });
    expect(await caller.tasks.getAll()).toEqual([]);
  });

  it("throws NOT_FOUND when deleting a missing task", async () => {
    await expect(caller.tasks.delete({ id: "999" })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
