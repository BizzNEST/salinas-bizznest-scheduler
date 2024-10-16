export default function accuracy(val, total) {
  if (val === 0 && total === 0) {
    throw new Error("Cannot divide by 0");
  }
  return ((val / total) * 100).toFixed(2) + "%";
}
