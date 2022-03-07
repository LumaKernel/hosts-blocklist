FROM alpine:latest

RUN apk --no-cache add dnsmasq

COPY ./docker/space-dns/dnsmasq.conf /etc/dnsmasq.conf
COPY ./build/space-dns.hosts /space-dns.hosts

EXPOSE 5353 5353/udp

ENTRYPOINT ["dnsmasq", "-k"]
