export default {
  data: {},

  get(key: string) {
    return this.data[key];
  },

  register(key: string, value) {
    this.data[key] = value;
  },
};
