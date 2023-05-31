async function main() {
    const { createLibp2p } = await import("libp2p");
    const { webSockets } = await import("@libp2p/websockets");
    const { noise } = await import("@chainsafe/libp2p-noise");
    const { mplex } = await import("@libp2p/mplex");
    const { yamux } = await import("@chainsafe/libp2p-yamux");
    const { circuitRelayServer } = await import("libp2p/circuit-relay");
    const { identifyService } = await import("libp2p/identify");
    const { autoNATService } = await import("libp2p/autonat");
    const { uPnPNATService } = await import("libp2p/upnp-nat");
  
    const node = await createLibp2p({
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/4410/ws","/ip4/0.0.0.0/tcp/4430/wss"],//"/ip4/3.75.158.163/tcp/8085/ws","/ip4/3.125.183.140/tcp/8085/ws","/ip4/35.157.117.28/tcp/8085/ws"],
        // TODO check "What is next?" section
        announce: ['/dns4/libp2p-relay-l2d1.onrender.com/tcp/4430/wss',"/dns4/libp2p-relay-l2d1.onrender.com/tcp/4410/ws"]
      },
      transports: [webSockets()],
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

    node.addEventListener("peer:update", (data) => {
      console.log('peer:update',data);
    });
  
    node.addEventListener("self:peer:update", (data) => {
      console.log('self:peer:update',data);
    });
  
    console.log(`Node started with id ${node.peerId.toString()}`);
    console.log("Listening on:");
    node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
  }
  
  main();
  