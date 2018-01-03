module.exports = (arg, ...fns) => {
  const _pipe = (f, g) => {
    return (arg) => {
      return g(f(arg))
    }
  }
  return fns.reduce(_pipe)(arg)
}
