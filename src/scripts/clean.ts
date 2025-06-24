const run = async () => {
  const targets = ["./dist", "./build", "./documents", "./coverage"];
  for await (const t of targets) {
    try {
      await Deno.remove(t, { recursive: true });
    } catch {
      // No content
    }
  }
};

await run();
