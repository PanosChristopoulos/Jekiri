
![Jekiri](https://github.com/PanosChristopoulos/Jekiri/blob/master/public/JekiriLogo.png)

Crowdsourcing Application using Google Location Data for Patras crowding issues

## Authors

* **Panos Christopoulos** - [PanosChristopoulos](https://github.com/PanosChristopoulos)
* **Dimitris Kaselouris** - [jimkaselouris](https://github.com/jimkaselouris)
* **Miltos Alimisis** - [milali21](https://github.com/milali21)

## Intoduction
Google Maps service is being used by millions of users daily for navigation and information seeking purposes. For the service's correct operation, mobile's location services(Wi-Fi, GPS or 3/4 G Network). Voluntarily, Google account settings allow Location History service to be toggled on/off. Using this service, Google periodically saves users' current location in cloud, so that they would be able to review their transport history and explore Points of Interest near their location. Through Jekiri, any Patras citizen may upload their location data so as to explore his own transportation customs. Moreover, the user voluntarily commits the information to an administrator who is able to resolve any congestion issues.

### Prerequisites

For the app's smooth initialization MongoDB and NodeJS need to be installed to your computer.

LINUX instructions:

For MongoDB:
```console
$ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
$ sudo apt-get install gnupg
$ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

For NodeJS:
```console
$ curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

## Initialization

After cloning the repository, you have to browse to the application directory and after initializing MongoDB through terminal, type:

```console
$ node app.js
```

## Instructions

After initialization, browse to  [localhost:3000](http://localhost:3000/) and register to our system. Double hashing is used for security reasons. Select Upload page and get started. Further instructions lay above the upload button.

## Visualized Usage

![LogIn Screen](https://github.com/PanosChristopoulos/Jekiri/blob/master/public/screen1.png)

![User Start Page](https://github.com/PanosChristopoulos/Jekiri/blob/master/public/user.png)


![Stats Page](https://github.com/PanosChristopoulos/Jekiri/blob/master/public/stats.png)


