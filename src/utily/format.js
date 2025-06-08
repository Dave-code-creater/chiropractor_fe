export function formatPhone(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 10)
    .replace(/(\d{3})(\d{3})(\d{0,4})/, (_, a, b, c) =>
      c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a
    );
}

export function formatSIN(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c) =>
      c ? `${a}-${b}-${c}` : b ? `${a}-${b}` : a
    );
}

export function formatDate(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d{2})(\d{0,4})/, (_, d, m, y) =>
      y ? `${d}/${m}/${y}` : m ? `${d}/${m}` : d
    );
}
