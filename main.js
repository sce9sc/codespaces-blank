async function main() {
    const { createLibp2p } = await import("libp2p");
    const { webSockets } = await import("@libp2p/websockets");
    const { noise } = await import("@chainsafe/libp2p-noise");
    const { mplex } = await import("@libp2p/mplex");
    const { yamux } = await import("@chainsafe/libp2p-yamux");
    const { circuitRelayServer } = await import("libp2p/circuit-relay");
    const { identifyService } = await import("libp2p/identify");
  
    const node = await createLibp2p({
      addresses: {
        listen: ["/ip4/0.0.0.0/tcp/0/ws","/ip4/3.75.158.163/tcp/8085/ws","/ip4/3.125.183.140/tcp/8085/ws","/ip4/35.157.117.28/tcp/8085/ws"],
        // TODO check "What is next?" section
        // announce: ['/dns4/auto-relay.libp2p.io/tcp/443/wss/p2p/QmWDn2LY8nannvSWJzruUYoLZ4vV83vfCBwd8DipvdgQc3']
      },
      transports: [webSockets()],
      connectionEncryption: [noise()],
      streamMuxers: [yamux(), mplex()],
      services: {
        identify: identifyService(),
        relay: circuitRelayServer(),
      },
    });
  
    console.log(`Node started with id ${node.peerId.toString()}`);
    console.log("Listening on:");
    node.getMultiaddrs().forEach((ma) => console.log(ma.toString()));
  }
  
  main();
  