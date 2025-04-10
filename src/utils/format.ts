import { type PathOrFileDescriptor, readFileSync as read } from "fs";

export function cleanText(value: string) {
  return (
    value
      .replace(/\_/g, "\\_")
      // .replace(/\(/g, "\\(")
      // .replace(/\)/g, "\\)")
      // .replace(/\[/g, "\\[")
      // .replace(/\]/g, "\\]")
      // .replace(/\*/g, "\\*")
      .replace(/\|/g, "\\|")
      // .replace(/\>/g, "\\>")
      .replace(/\</g, "\\<")
      .replace(/\`/g, "\\`")
      .replace(/\~/g, "\\~")
      .replace(/\#/g, "\\#")
      .replace(/\+/g, "\\+")
      .replace(/\-/g, "\\-")
      .replace(/\=/g, "\\=")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\./g, "\\.")
      .replace(/\!/g, "\\!")
  );
}

export function readFileSync(...params: Parameters<typeof read>): string;
export function readFileSync(descriptor: PathOrFileDescriptor): string;
export function readFileSync(
  descriptor: PathOrFileDescriptor,
  ...args: any[]
): string {
  if (args.length === 0) {
    const text = read(descriptor, "utf-8") as string;
    return cleanText(text);
  }

  return read(descriptor, ...args) as unknown as string;
}

export const format = <
  T extends Array<string | number | object | null | undefined>
>(
  delimiter: string,
  ...values: T
) => {
  return String(
    values.reduce(
      (result, value) =>
        String(result).replace(/(%|%d|%s)/, value ? value.toString() : ""),
      delimiter
    )
  );
};
