import { readLines } from "https://deno.land/std/io/mod.ts";

const emojis = [];
const fileReader = await Deno.open("src/data/en.csv");
for await (const line of readLines(fileReader)) {
  const emoji = line.split(",")[0];
  emojis.push(emoji);
}
Deno.writeTextFileSync("fonts.lst", emojis.join());
