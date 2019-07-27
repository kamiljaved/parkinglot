
<h1 align="center">
  <br>
  Parking-Lot Web-App
  <br>
</h1>

<h4 align="center">A web application to manage assignment of parking-lots to vehicles, and track daily usage.</h4>

<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  </a>
  <a href="https://gitter.im/amitmerchant1990/electron-markdownify"><img src="https://badges.gitter.im/amitmerchant1990/electron-markdownify.svg"></a>
  <a href="https://saythanks.io/to/amitmerchant1990">
      <img src="https://img.shields.io/badge/SayThanks.io-%E2%98%BC-1EAEDB.svg">
  </a>
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>

<p align="center">
  <a href="#languages">Languages</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#notes">Notes</a>
</p>

<hr>

## Languages

* Python (Django Framework)
* HTML (Frontend)
* Javascript (jQuery & AJAX Libraries)

## Dependencies

* Required:
  - [Django Framework](https://www.djangoproject.com/)
* Optional:
  - [Celery Worker](http://www.celeryproject.org/)

## Key Features

* Extensive Compatibility
  - Cross platform.
  - Cross browser.
  - Cross device responsive design.

## How To Use

Make sure [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/installing/) is installed on your system. 
To clone this application, you'll need [Git](https://git-scm.com). From your command line:

```bash
# Clone this repository (or use the download option above)
$ git clone https://github.com/kamiljaved98/parkinglot

# Go into the repository
$ cd parkinglot

# Install dependencies
$ pip(3) install -r requirements.txt

# Run the server
$ python(3) manage.py runserver

# Go to app-page in browser (localhost)
$ http://localhost:8000/
$ http://127.0.0.1:8000/
```

## Notes

* Background-Worker Celery is NOT required for running the project, but may be used for Asynchronous performance.

* Due to polling for Notifications, a delay of max 8 seconds may occur in showing a notifcation.


