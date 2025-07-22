export async function homeServer(req, res) {
  console.log('hello world');
  res.send({ message: 'Hello, Im your WebAuthn server for tools shop app!' });
}
