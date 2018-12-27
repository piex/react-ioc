export default {
  data: {},

  get(className) {
    return this.data[className];
  },

  set(className, value) {
    if (typeof this.data[className] != 'undefined') {
      throw new Error(`${className} is already exists.`);
    } else {
      this.data[className] = value;
    }
  },
};
