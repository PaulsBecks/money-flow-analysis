module.exports = {
  resolve: {
    fallback: {
      stream: false,
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
    },
  },
};
