# How do I configure a secure (i.e., password protected) server?

There are two levels of security which DODS data servers support: domain restrictions and user restrictions. In conjunction with a World Wide Web server, access to a DODS server can be limited to a specific group of users (authenticated by password), specific machine(s) or a group of machines within a given domain or domains.

NOTES:

* DAP 3.4 includes support for Digest authentication, which significantly increases the robustness of password access.
* DODS versions 3.2 and greater software contains significant improvements in the way password authentication is handled. Older versions of the DODS clients prompted for the password with each and every interaction between client and server. Now credentials may be embedded in URLs and are remembered and reused for the duration of a session.

The security features of DODS servers depend heavily on the underlying WWW daemon because we felt this was the best way to solve the thorny problem of ensuring only authorized users accessed data. By using the daemon's authorization software we are ensuring that the security checks used by DODS have been tested by many many sites. In addition, WWW daemons already support a very full set of security features and many system administrators are comfortable and confidant with them. The tradeoff with using the web daemon's security system for our servers is that two security settings must be made for each group of data to be configured and more than one DODS server may be needed even if you're serving only one type of data.

Because the security features rely almost entirely on the host machine's WWW server, the steps required to install a secure DODS server will vary depending on the WWW server used. Thus, before installing a secure DODS server, check over your WWW server's documentation to make sure it provides the following security features: access limits to files in the document root on a per user and/or per machine basis, and the ability to place CGI scripts within the document root directory. As an alternative to the second requirement, a server may provide a way to place access limits on a CGI script not within the document root directory hierarchy.

IMPORTANT

* Because security features are used to protect sensitive or otherwise important information, once set-up they should be tested until you are comfortable that they work. You should try accessing from at least one machine that is not allowed to access your data. If you would like, we will try to access your data, assuming that our machines are among those not allowed, to help you evaluate your set-up.
* Since the security features are provided by a WWW server, it is highly likely that they are functional and extensively tested. While problems with these features have shown up in the past (e.g., the Netscape SSL server bug) they are generally fixed quickly. Thus there is good reason to assume that your data are safe if you choose to set-up your DODS server as a secure one. However, there is a chance that a defect in the WWW server software will allow unauthorized people access; how big that chance is depends on the WWW server software you use and how extensively its security features are tested. That level of testing is completely beyond our control.

It is important to distinguish securing a DODS server from securing data. If data are served using DODS then those data are also also accessible through a web browser (although it might be hard to figure out the URLs, it is still possible for the data to be accessed). So the data themselves need to be stored in directories that have limited access. If all data access will take place through a DODS server this limitation can exclude all access except the local machine. This is the case because some the DODS server's function requires being able to read the data through the local host's web server. For example, if the DODS server cannot read information about the dataset as DODS objects then it cannot build the INFO document.

It bears repeating: If you're serving sensitive information with DODS, that information is accessible two ways, one via the DODS server and two through the WWW server. You need to make sure both are protected.

In the past it was possible to install two or more DODS servers on a computer and assign different protections to each one. However, in practice this has proven to be very hard for to configure correctly. In many cases where this feature was used, a secure server was setup up for one group of data while an open server was set up for another. It was often the case that all the data were accessible using the open server! Thus, if you need to secure data and serve it with DODS, it is best to host all the sensitive information on one machine and put other data on a second machine with an open-access server. If you must run two or more servers from the same physical host, we suggest that you configure your web server to see two (or more) virtual hosts. This will provide the needed separation between the groups of data.

## Using a Secure DODS Server

Using a secure DODS sever is transparent if the server is configured to allow access based on hosts or domains. Give the DODS URL to a client; the server will respond by answering the request if allowed or with an error message if access is not allowed.

Accessing a server which requires password authentication is a little different and varies depending on the type of client being used. All DODS clients support passing the authentication information along with the URL. To do this add `:@' before the machine name in a URL. For example, suppose I have a secure server set up on `www.dods.org' and the user `guest' is allowed access with the password `demo'. A URL for that server would start out:

        http://guest:demo@test.opendap.org/...

For example...

        http://guest:demo@test.opendap.org/dap/data/nc/fnoc1.nc.info

will return the info on the data set fnoc1.nc from a secure server. You cannot access the data without including the username and password 'guest' and 'demo'.

Some clients will pop up a dialog box and prompt for the username and password. Netscape, and some other web browsers, for example, will do this. Similarly, some DODS clients may also popup a dialog.

## Configuring a Server

In the following I'll use the Apache 1.3.12 server as an example (also tested on Apache 2.0.40, 07/25/03 jhrg) and describe how to install a server which limits access to a set of users. While this example is limited to the Apache server, it should be simple to perform the equivalent steps for any other WWW server that supports the set of required security features (See ABOUT DATA SECURITY).

1. Create a directory for the server.

    To limit access to a dataset to particular machine, begin by creating a special directory for the server. This maybe either an additional CGI bin directory or a directory within the web server's document root. In this example, I chose the latter.

        cd /home/httpd/html/
        mkdir secure

2. Establish access limitations for that directory.

    For the Apache server, this is done either by adding lines to the server's httpd.conf file or by using a per-directory file. Note: The use of per-directory access limit files is a configurable feature of the Apache server; look in the server's httpd.conf file for the value of the AccessFileName resource.

    I modified Apache's httpd.conf file so that it contains the following:

        # Only valid users can use the server in secure. 7/6/2000 jhrg

	    Options ExecCGI Indexes FollowSymLinks

	    Order deny,allow
	    Deny from all
	    # ALLOW SERVER (IP OF SERVER) MACHINE TO REQUEST DATA ITSELF
	    Allow from __YOUR_SERVER_HERE__ 
	    Require valid-user
	    # ALL VISITORS NEED USERNAME AND PASS BUT NOT SERVER
	    Satisfy any

	    AuthType Basic 
	    AuthUserFile /etc/httpd/conf/htpasswd.users 
	    AuthGroupFile /etc/httpd/conf/htpasswd.groups
	    AuthName "Secure server"


        # Protect the directory used to hold the secure data.

	    Options Indexes

	    Order deny,allow
	    Deny from all
	    # ALLOW SERVER (IP OF SERVER) MACHINE TO REQUEST DATA ITSELF
	    Allow from __YOUR_SERVER_HERE__ 
	    Require valid-user
	    # ALL VISITORS NEED USERNAME AND PASS BUT NOT SERVER
	    Satisfy any

	    AuthType Basic 
	    AuthUserFile /etc/httpd/conf/htpasswd.users 
	    AuthGroupFile /etc/httpd/conf/htpasswd.groups
	    AuthName "Secure data"
    and

        ScriptAlias /secure/ "/home/httpd/html/secure/"

    The first group of lines establishes the options allowed for the 'secure' directory, including that it can contain CGI programs. The lines following that establish that only users in the Apache password file can access the contents of the directory, with the exception that this server is allowed to access the directory without authentication. This last bit is important because DODS servers sometimes make requests to themselves (e.g., when generating an ASCII response) but don't pass on the authentication information.*

    Regarding the 'Satisfy any' directive, Brock Murch says:

    I thought that one needed an "Allow from all" since I want my users to connect from anywhere, which would have necessitated a "satisfy all" since I needed the passwd authentication as well. I didn't know that the "Deny from all" would still allow anyone in so long as the AuthType etc was included and authentication took place. Since this is the case a "satisfy any" will do as I have denied all ip access except for the server itself. The second group of lines secure the data itself from accesses which bypass the DODS server.

    The ScriptAlias line tells Apache that executable files in the directory are CGIs. You can also do this by renaming the nph-dods script to nph-dods.cgi and making sure httpd.conf contains the line:

        AddHandler cgi-script .cgi

    The AuthType directive selects the type of authentication used. Apache 2.0 supports 'Basic' and 'Digest' while other servers may also support GSS-Negotiate and NTLM. Version 3.4 of the DAP software supports all these authentication schemes, although only Basic and Digest have been thoroughly tested. Configuration of Apache 2.0 for Digest authentication is slightly different then for Basic authentication, but is explained well in Apache's on line documentation.

3. Copy the server into the new directory.

    Copy the CGI dispatch program and the server filter programs in to the newly created directory. Use the `installServers' script for this. The script is available in the etc directory of our source distributions and is also bundled with our binary distributions. Note that if you're using the extension `.cgi' to tell Apache that nph-dods is a CGI you must rename nph-dods to nph-dods.cgi. If you forget to do that then you will get a Not Found (404) error from the server and debugging information generated by the DODS server won't appear in Apache's error_log even if it has been turned on.

    You are done.

## Tips

Here are some tips on setting up secure servers:

* Using the per-directory limit files makes changing limits easier since the server reads those every time it accesses the directory, while changes made to the httpd.conf file are not read until the server is restarted or sent the HUP signal.

* Using httpd.conf for your security configuration seems more straightforward since all the information is in one place.

* Using the installServers script it is easy to set up a suite of DODS servers and then use symbolic links (make sure to turn FollowSymLinks on in httpd.conf) to `mount' datasets under those servers. When doing this look for `loops' in Apache's DocumentRoot that will allow users to circumvent your security by accessing data using a different path.

* If the protections are set up so that it is impossible for the server host to access the data and/or the DODS server itself, then an infinite loop can result. This can be frustrating to debug, but if you see that accesses generate an endless series of entries in the access_log file, it is likely that is the problem. Make sure that you have `allow from ' set for both the directory that holds the DODS server and that holds the data. Also make sure that the server's name is set to the full name of the host.

* Configuring a secure DODS server can be frustrating if you're testing the server using a web browser that remembers passwords. You can turn this feature off in some browers. Also, the geturl tool supplied with DODS can be useful to test the server since it will not remember passwords between runs.

## Thanks

Brock Murch worked out some thorny configuration details for securing the Apache/DODS combination.

##TAGS##
configure,secure,server,dods