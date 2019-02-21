import sys
import argparse
import socket
from Naked.toolshed.shell import execute_js, muterun_js

from packet import Packet


def run_server(port):
    conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        conn.bind(('', port))
        print('Echo server is listening at', port)
        while True:
            data, sender = conn.recvfrom(1024)
            handle_client(conn, data, sender)

    finally:
        conn.close()


def handle_client(conn, data, sender):
    try:

        # How to send a reply.
        # The peer address of the packet p is the address of the client already.
        # We will send the same payload of p. Thus we can re-use either `data` or `p`.

        p = Packet.from_bytes(data)
        # print("Router: ", sender)
        # print("Packet: ", p)
        # print("Payload: ", p.payload.decode("utf-8"))

        if(p.packet_type == 1) : 
            print("SYN Received")
            p.payload = str("SYN-ACK").encode("utf-8")
            p.packet_type = 2             
            conn.sendto(p.to_bytes(), sender)
            print("SYN-ACK Sent")


        if(p.packet_type == 0) :         
            print("DATA Received")
            with open('../request','w') as f :
                f.write(p.payload.decode("utf-8"))

            response = muterun_js('../A3_httpserver.js')
            if response.exitcode == 0:
                httpresponse = response.stdout.decode('utf-8')
            else:
                sys.stderr.write(str(response.stderr))  

            p.payload = httpresponse.encode("utf-8")
            
            conn.sendto(p.to_bytes(), sender)
            print("DATA Response sent")


    except Exception as e:
        print("Error: ", e)


# Usage python udp_server.py [--port port-number]
parser = argparse.ArgumentParser()
parser.add_argument("--port", help="echo server port", type=int, default=8007)
args = parser.parse_args()

run_server(args.port)

