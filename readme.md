# Installing OPeNDAP.org Node.js Server

The new OPeNDAP.org site has been developed using Angular CLI for the front-end
and Node.js for the back-end. The site is template-driven, meaning that most
content editing is done outside of HTML. This requires a server to serve
data to the front-end, which is where Node.js comes into the picture.

This tutorial will guide your installation of the OPeNDAP.org Node.js server
on an linux machine running Ubuntu 18+.

NOTE: Please note that the following tutorial
should work on other flavors of linux, with minor adjustments for package
management. (For example, CentOS uses `yum` instead of `apt`).

## 1. Install and Configure Apache

You have to configure Apache to allow secure external access to the front-end interface.
Note that much of this section was taken from [digitalocean.com](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-18-04-quickstart).

### 1.1. Install Apache

Update your local package index:

````bash
sudo apt update
````

Install the `apache2` package:

````bash
sudo apt install apache2
````

You can confirm that the Apache2 installation succeeded by entering your server's IP
into a web browser. If you see the default Apache page, you have suceeded.

### 1.2 Configure UFW (Uncomplicated Firewall)

````bash
sudo ufw app list
````

Response:

````bash
Available applications:
  Apache
  Apache Full
  Apache Secure
  OpenSSH
````

This is the most restrictive profile that will let in traffic on port
80:

````bash
sudo ufw allow 'Apache'
````

## 2. Install Node.js

sudo apt install nodejs

This allows for nodejs package installs:
sudo apt install npm

Check the nodejs version:
nodejs -v

response:
ubuntu@ip-172-31-52-254:~$ nodejs -v
v8.10.0

## 3. Configure a virtual host

````XML
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        ServerName opendap.org
        DocumentRoot /var/www/html/opendap.org-server/dist/website
        <Directory />
                AllowOverride All
        </Directory>
        ProxyRequests Off
        ProxyPreserveHost On
        ProxyVia Full
        <Proxy *>
                Require all granted
        </Proxy>
        <Location "/">
                ProxyPass http://127.0.0.1:3001/
                ProxyPassReverse http://127.0.0.1:3001/
        </Location>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        LogLevel warn
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
````

And put that in /etc/apache2/sites-available/

## 4. Clone Server Repo

Clone the server repo
 (https://github.com/alexporrello/opendap.org-server)
 into /var/www/html/opendap.org-server/dist/website.

Clone in /var/www/html/

ubuntu@ip-172-31-52-254:/var/www/html$ sudo git clone https://github.com/OPENDAP/opendap.org-server
Cloning into 'opendap.org-server'...
Username for 'https://github.com': jgallagher59701
Password for 'https://jgallagher59701@github.com': 
remote: Enumerating objects: 271, done.
remote: Counting objects: 100% (271/271), done.
remote: Compressing objects: 100% (236/236), done.
remote: Total 271 (delta 109), reused 187 (delta 28), pack-reused 0
Receiving objects: 100% (271/271), 2.71 MiB | 17.56 MiB/s, done.
Resolving deltas: 100% (109/109), done.
ubuntu@ip-172-31-52-254:/var/www/html$ 

## 5. Install NPM & PM2

Install 'pm2':
sudo npm install -g pm2

In the server directory (/var/www/html/opendap.org-server) run:

sudo npm install

Then:

Run 'pm2 start server.js --name opendap.org' in the OPeNDAP.org-server
dir. This runs server.js in the background and launches the app. pm2
is basically the most awesome process manager for node ever.

ubuntu@ip-172-31-52-254:/var/www/html/opendap.org-server$ pm2 start server.js --name opendap.org
[PM2] Starting /var/www/html/opendap.org-server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ opendap.org        │ fork     │ 0    │ online    │ 0%       │ 16.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
ubuntu@ip-172-31-52-254:/var/www/html/opendap.org-server$ 

Now enable apache2's proxy:

sudo a2enmod proxy
sudo a2enmod proxy_http