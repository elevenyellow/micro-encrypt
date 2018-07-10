module.exports = function requestHandler(request, response) {
    console.log(request.url)
    response.end('Hello Node.js Server!')
}
