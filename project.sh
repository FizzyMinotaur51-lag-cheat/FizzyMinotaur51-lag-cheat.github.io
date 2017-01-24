# Install our project's needs with our Gemfile
echo ---Installing Jekyll and dependencies---
cd /srv/www/ && bundle install

# Install any dependencies with bower
echo ---Installing node dependencies---
cd /srv/www/ && npm install

# Install any dependencies with bower
echo ---Installing bower dependencies---
cd /srv/www/ && bower install


# Setup project environment variables
if [[ -f '/srv/www/.env' ]]; then
  cd /srv/www/ && source .env
fi
