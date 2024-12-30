
export function pathNotFoundHandler(req, res, next) {
  try {
    console.info("path not found")
      const response = {message: 'url not found'}
      return res.status(404).json(response)
  } catch (e) {
      next(e)
  }
}
