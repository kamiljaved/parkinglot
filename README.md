
<h1 align="center">
  <br>
  Parking-Lot Web-App
  <br>
</h1>

<h4 align="center">A web application to manage assignment of parking-lots to vehicles, and track daily usage.</h4>

<p align="center">
	<a href="http://www.djangoproject.com/">
		<img src="https://www.djangoproject.com/m/img/badges/djangoproject120x25.gif" border="0" alt="A Django project." title="A Django project."/>
	</a>
  <a href="https://www.python.org/">
		<img src="http://ForTheBadge.com/images/badges/made-with-python.svg" alt=" Made with Python.">
  </a>
  <a href="https://www.w3.org/standards/webdesign/htmlcss">
		<img src="http://ForTheBadge.com/images/badges/uses-html.svg" height="30px" alt="Uses HTML.">
  </a>
  <a href="https://www.w3.org/standards/webdesign/htmlcss">
		<img src="http://ForTheBadge.com/images/badges/uses-css.svg" height="30px" alt="Uses CSS.">
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
		<img src="http://ForTheBadge.com/images/badges/uses-js.svg" height="30px" alt="Uses JavaScript.">
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
* Form for adding new Vehicle Entry in specific slot
* Notification Panel for Parking Timeout
* List-View of Vehicles in Parking Space
* Dynamic Page-Update without reload
* Record System
  - Maintains a history Of Daily Vehicle Records.
  - Provides ability to View/Download a Record in PDF form.
  - Provides ability to send Record PDF in email.
  - Provides Record Delete/Group-Delete Options
* Site and App Settings Page

## How To Use

Make sure [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/installing/) is installed on your system. 
To clone this application, you'll need [Git](https://git-scm.com). From your command line:

```bash
# Clone this repository (or download from github page)
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

---

> [kamiljaved.epizy.com](http://kamiljaved.epizy.com/) &nbsp;&middot;&nbsp;
> GitHub [@kamiljaved98](https://github.com/kamiljaved98) &nbsp;&middot;&nbsp;
> Instagram [@kamiljaved98](https://instagram.com/kamiljaved98)
