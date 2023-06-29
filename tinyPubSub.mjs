const getType = (q) => ({}.toString.call(q));
const isFunction = (q) => getType(q) === FUNCTION;
const FUNCTION = getType(() => {});

function pub(...args) {
  if (this.pub?.list?.length) {
    this.pub.list.forEach((fn) => fn(...args));
  }
}
function sub(fn) {
  if (!isFunction(fn)) {
    throw new Error(
      `To subscribe, a function must be provided: ${getType(fn)} provided.`,
    );
  }

  this.pub.list = [...(this.pub.list || []), fn];

  return () => {
    this.pub.list.splice(
      this.pub.list.findIndex((q) => q === fn),
      1,
    );
  };
}

export { pub, sub };
