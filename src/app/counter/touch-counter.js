export default function touchCounterFactory() {
  let counter = 0;
  return {
    get: () => counter,
    next: () => counter++,
    reset: () => counter = 0
  };
}
