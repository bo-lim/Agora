FROM leebolim0701471/haproxy:6.0
EXPOSE 80
EXPOSE 9000
RUN apt-get update && apt-get install -y keepalived

COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY keepalived.conf /etc/keepalived/keepalived.conf

# RUN echo '#!/bin/bash\n\
# service keepalived start\n\
# haproxy -f /usr/local/etc/haproxy/haproxy.cfg\n' > /start.sh && chmod +x /start.sh

# CMD ["/start.sh"]