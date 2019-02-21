# import argparse
import ipaddress
import socket
import sys

from packet import Packet


def run_client(router_addr, router_port, server_addr, server_port):
    home = str(socket.gethostbyname(server_addr))
    peer_ip = ipaddress.ip_address(home)
    conn = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    timeout = 5
    try:
        # SENDING SYN REQUEST    
        msg = "SYN"
        p = Packet(packet_type=1, # DATA = 0 SYN = 1 , ACK-SYN = 2 , ACK = 3 , NACK = 4
                   seq_num=1,
                   peer_ip_addr=peer_ip,
                   peer_port=server_port,
                   payload=msg.encode("utf-8"))
        conn.sendto(p.to_bytes(), (router_addr, router_port))
        print('Send "{}" to router'.format(msg))
        # Try to receive a response within timeout
        conn.settimeout(timeout)
        while True : 
            print('Waiting for a response')
            response, sender = conn.recvfrom(1024)
            p = Packet.from_bytes(response)
            # print('Router: ', sender)
            if(p.packet_type == 2) : 
                print('ACK-SYN received')
                break

        print("/n")

        # msg = "Hello Server"
        msg = sys.argv[1]
        p = Packet(packet_type=0,
                   seq_num=1,
                   peer_ip_addr=peer_ip,
                   peer_port=server_port,
                   payload=msg.encode("utf-8"))
        conn.sendto(p.to_bytes(), (router_addr, router_port))
        print('Send "{}" to router'.format("DATA"))

        # Try to receive a response within timeout
        conn.settimeout(timeout)
        print('Waiting for a response')
        response, sender = conn.recvfrom(1024)
        p = Packet.from_bytes(response)
        print('Router: ', sender)
        print('Packet: ', p)
        print('Payload: ' + p.payload.decode("utf-8"))
        # print("dataToSendBack")
        sys.stdout.flush()

    except socket.timeout:
        print('No response after {}s'.format(timeout))
    finally:
        conn.close()


# Usage:
# python echoclient.py --routerhost localhost --routerport 3000 --serverhost localhost --serverport 8007

# parser = argparse.ArgumentParser()
# parser.add_argument("--routerhost", help="router host", default= u'127.0.0.1')
# parser.add_argument("--routerport", help="router port", type=int, default=3000)

# parser.add_argument("--serverhost", help="server host", default= u'127.0.0.1')
# parser.add_argument("--serverport", help="server port", type=int, default=8007)
# args = parser.parse_args()

run_client(u'127.0.0.1', 3000 , u'127.0.0.1', 8007)
