#!/bin/bash
set -e

# ==============================================================================
# Fixpair Dashboard (Next.js) - Nginx & SSL Configuration Script
# ==============================================================================

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./setup-nginx.sh <your-domain> [email]"
    echo "Example: ./setup-nginx.sh getfixpair.com admin@getfixpair.com"
    exit 1
fi

echo "--> Setting up Nginx for Next.js Dashboard: $DOMAIN..."

NGINX_CONF="/etc/nginx/sites-available/fixpair-dashboard"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/fixpair-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "--> Setting up SSL Certificate for $DOMAIN..."
if [ -n "$EMAIL" ]; then
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || true
else
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || true
fi

echo "=========================================================="
echo " Next.js Dashboard Nginx & SSL setup completed!"
echo " URL: https://$DOMAIN"
echo "=========================================================="
