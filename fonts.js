import { TextLineStream } from "jsr:@std/streams/text-line-stream";

const emojis = [];
const file = await Deno.open("src/data/en.csv");
const lineStream = file.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());
for await (const line of lineStream) {
  const emoji = line.split(",")[0];
  emojis.push(emoji);
}
Deno.writeTextFileSync("fonts.lst", emojis.join());
