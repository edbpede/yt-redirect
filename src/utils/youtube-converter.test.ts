/**
 * Test suite for the YouTube URL converter.
 *
 * Run with: bun test
 *
 * These cases were previously a hand-rolled console script that only logged its
 * results, so it could never fail a build. The inputs and expected values are
 * carried over unchanged; only the harness became real assertions.
 */

import { describe, expect, it } from "bun:test";
import { convertYouTubeUrl, isYouTubeUrl, normalizeUrl } from "./youtube-converter";

const conversionCases = [
  {
    description: "Standard youtube.com/watch?v= URL",
    input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "youtu.be short link",
    input: "https://youtu.be/dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "Mobile YouTube URL",
    input: "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "Embedded YouTube URL",
    input: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "YouTube Shorts URL",
    input: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "YouTube Live URL",
    input: "https://www.youtube.com/live/dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    description: "URL with timestamp",
    input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ&t=42s",
  },
  {
    description: "URL with playlist",
    input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
  {
    description: "youtu.be with timestamp",
    input: "https://youtu.be/dQw4w9WgXcQ?t=42",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ&t=42",
  },
  {
    description: "YouTube Music URL",
    input: "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
    expected: "https://yout-ube.com/watch?v=dQw4w9WgXcQ",
  },
];

describe("convertYouTubeUrl", () => {
  it.each(conversionCases)("converts: $description", ({ input, expected }) => {
    const result = convertYouTubeUrl(input);

    expect(result.success).toBe(true);
    expect(result.convertedUrl).toBe(expected);
  });

  // Rejections must be reported as a failed result, not thrown and not silently
  // converted into a bogus yout-ube.com link.
  it.each([
    { description: "empty string", input: "", error: "emptyInput" },
    { description: "whitespace only", input: "   ", error: "emptyInput" },
    { description: "not a URL at all", input: "not a url", error: "invalidUrl" },
    { description: "non-YouTube host", input: "https://google.com", error: "invalidUrl" },
    { description: "other video host", input: "https://vimeo.com/123456", error: "invalidUrl" },
  ])("rejects: $description", ({ input, error }) => {
    const result = convertYouTubeUrl(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
    expect(result.convertedUrl).toBeUndefined();
  });

  it("rejects a YouTube host with no extractable video id", () => {
    const result = convertYouTubeUrl("https://www.youtube.com/feed/subscriptions");

    expect(result.success).toBe(false);
    expect(result.error).toBe("invalidUrl");
  });
});

describe("isYouTubeUrl", () => {
  it.each([
    "https://www.youtube.com/watch?v=test",
    "https://youtube.com/watch?v=test",
    "https://m.youtube.com/watch?v=test",
    "https://music.youtube.com/watch?v=test",
    "https://youtu.be/test",
  ])("accepts %s", (url) => {
    expect(isYouTubeUrl(url)).toBe(true);
  });

  it.each(["https://google.com", "not a url", "", "https://notyoutube.com/watch?v=test"])(
    "rejects %s",
    (url) => {
      expect(isYouTubeUrl(url)).toBe(false);
    },
  );
});

describe("normalizeUrl", () => {
  it.each([
    { input: "youtube.com/watch?v=test", expected: "https://youtube.com/watch?v=test" },
    { input: "www.youtube.com/watch?v=test", expected: "https://www.youtube.com/watch?v=test" },
    { input: "youtu.be/test", expected: "https://youtu.be/test" },
    { input: "https://youtube.com/watch?v=test", expected: "https://youtube.com/watch?v=test" },
  ])("normalizes $input", ({ input, expected }) => {
    expect(normalizeUrl(input)).toBe(expected);
  });

  it("leaves an existing http:// protocol alone", () => {
    expect(normalizeUrl("http://youtu.be/test")).toBe("http://youtu.be/test");
  });
});
