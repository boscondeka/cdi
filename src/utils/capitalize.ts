export const capitalize = (s: string) => {
  return s && String(s[0]).toUpperCase() + String(s).slice(1);
};
