/* eslint-disable */
const TIMESTAMP_LYRIC_PATTERN = /^(\[\d+\:\d{2}\.\d*\])(.*?)$/;
const TIMESTAMP_ONLY_PATTERN = /^(\[\d+\:\d{2}\.\d*\])$/;
const TIMESTAMP_PATTERN = /(\d+)\:(\d{2}.\d*)/;
const DESCRIPTION_PATTERN = /^\[(.*?)\]$/;

interface LyricLine {
  timestamp: number;
  text: string;
}

class LyricHelper {
  constructor(private dictionary: LyricLine[] = []) {}
  public static build = (lrc?: string) => {
    if (lrc === undefined) {
      return new LyricHelper();
    }
    // convert to line list
    const lrcLines = lrc
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => !!l);
    // parse lines
    const dictionary: LyricLine[] = lrcLines
      .map((l) => {
        if (TIMESTAMP_LYRIC_PATTERN.test(l)) {
          const [_, timeMarker, text] = [
            ...(TIMESTAMP_LYRIC_PATTERN.exec(l) ?? []),
          ];
          const [__, min, sec] = TIMESTAMP_PATTERN.exec(timeMarker) ?? [];
          const timestamp = (~~min * 60 + parseFloat(sec)) as number;
          return { timestamp, text: text as string };
        } else if (TIMESTAMP_ONLY_PATTERN.test(l)) {
          const [_, timeMarker] = [...(TIMESTAMP_ONLY_PATTERN.exec(l) ?? [])];
          const [__, min, sec] = TIMESTAMP_PATTERN.exec(timeMarker) ?? [];
          const timestamp = (~~min * 60 + parseFloat(sec)) as number;
          return { timestamp, text: '...' };
        } else if (DESCRIPTION_PATTERN.test(l)) {
          const [_, text, timestamp] = [
            ...(DESCRIPTION_PATTERN.exec(l) ?? []),
            0,
          ];
          return { timestamp: timestamp as number, text: text as string };
        } else {
          return { timestamp: 0, text: '...' };
        }
      })
      .sort((prev, next) => prev.timestamp - next.timestamp);
    return new LyricHelper(dictionary);
  };

  public getLine(currentTime: number) {
    return this.dictionary.filter((line) => currentTime > line.timestamp)?.pop()
      ?.text;
  }
}

export default LyricHelper;
