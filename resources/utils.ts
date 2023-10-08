// https://stackoverflow.com/a/40200710
export const isPrime = (num: number) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if (num % i === 0) return false;
  }
  return num > 1;
}

// https://stackoverflow.com/a/21895354
export const splitLines = (str: string | undefined) => (str ?? '').split(/\r?\n/);

// https://stackoverflow.com/a/423385
export const getFilename = (path: string) => path.replace(/^.*[\\\/]/, '');
