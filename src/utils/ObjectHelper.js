export default function deepCopy(target) {
  let copiedObjects = [];
  function deepCopyPrivate(target) {
    if (typeof target !== 'object' || !target) {
      return target;
    }
    for (let i = 0; i < copiedObjects.length; i++) {
      if (copiedObjects[i].target === target) {
        return copiedObjects[i].copyTarget;
      }
    }
    let obj = {};
    if (Array.isArray(target)) {
      obj = [];
    }
    copiedObjects.push({ target: target, copyTarget: obj });
    Object.keys(target).forEach((key) => {
      if (obj[key]) {
        return;
      }
      obj[key] = deepCopyPrivate(target[key]);
    });
    return obj;
  }
  return deepCopyPrivate(target);
}
