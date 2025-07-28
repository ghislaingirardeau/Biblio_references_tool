export async function homeServer(req, res) {
  console.log(process.env.MODE ? process.env.MODE : 'prod');
  res.send({ message: 'Hello, Im your WebAuthn server for tools shop app!' });
}
