const https = require("https");
const fs = require("fs");

async function main() {
  const { createLibp2p } = await import("libp2p");
  const { autoNATService } = await import("libp2p/autonat");
  const { uPnPNATService } = await import("libp2p/upnp-nat");
  const { webSockets } = await import("@libp2p/websockets");
  const { noise } = await import("@chainsafe/libp2p-noise");
  const { mplex } = await import("@libp2p/mplex");
  const { yamux } = await import("@chainsafe/libp2p-yamux");
  const { circuitRelayServer } = await import("libp2p/circuit-relay");
  const { identifyService } = await import("libp2p/identify");

  /*
openssl req -new -newkey rsa:4096 -nodes -keyout snakeoil.key -out snakeoil.csr

openssl x509 -req -sha256 -days 365 -in snakeoil.csr -signkey snakeoil.key -out snakeoil.pem

*/

  // const httpServer = https.createServer({
  //   cert: fs.readFileSync("./test_certs/snakeoil.pem"),
  //   key: fs.readFileSync("./test_certs/snakeoil.key"),
  // });

  const node = await createLibp2p({
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/3000/wss"],
      // TODO check "What is next?" section
      announce: ["/dns4/libp2p-relay-l2d1.onrender.com/tcp/443/wss", "/ip4/216.24.57.253/tcp/443/wss"],
    },
    transports: [
      webSockets({
        // server: httpServer,
        // websocket: {
        //   rejectUnauthorized: false,
        // },
      }),
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux(), mplex()],
    services: {
      identify: identifyService(),
      relay: circuitRelayServer(),
      uPnPNAT: uPnPNATService({
        /** UPnP NAT options **/
      }),
      autoNAT: autoNATService({
        /** AutoNAT options **/
      }),
    },
  });

  console.log(node.peerId);

  node.addEventListener("peer:update", (data) => {
    console.log(data);
  });

  node.addEventListener("self:peer:update", (data) => {
    console.log(data);
  });

  console.log(`Node started with id ${node.peerId.toString()}`);
  console.log("Listening on:");
  node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
}

main();
