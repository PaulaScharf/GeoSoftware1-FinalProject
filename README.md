# GeoSoftware1-FinalProject
## How to start the project

aus project-folder heraus (Übersetzen in Englisch):

- with docker:
    1. install docker on your local machine
    2. run ``docker-compose up`` in the terminal
    3.  
    4.  

    (the image was built by command ``docker build -t kpoppi/geosoftware1-final_project .``)

    MUSS NOCH GEPUSHT WERDEN !!

- without docker:
    1. install node v10.xx and MongoDB v4.xx on your local machine
    2. run ``npm install`` in the terminal
    3. run ``npm start`` in the terminal
    4. open [localhost:3000](localhost:3000) in a browser
    5. ensure that your adblocker does not prevent jsnlog from working (auch bei docker hinschreiben?!)

## How to install your own API-keys
#### Geonames
1. create an account for [geonames](https://www.geonames.org/login)
2. wait for activation email
3. got to your account page
4. enable your account for free webservices
5. set the value of the variable ``usernameTerrainAPI`` in token.js to your username
#### OpenWeatherMap
1. create an account for [openweathermap](https://home.openweathermap.org/users/sign_up)
2.
3.
4.

#### Movebank
1. create an account for [movebank](https://www.movebank.org/user/register)
2.
3.
4.


## GitHub Repository
[GeoSoftware1-FinalProject](https://github.com/PaulaScharf/GeoSoftware1-FinalProject.git)

---

## Task

Mögliche Begegnungen mit Kontext

Ziel:
- Entwicklung einer Webapp zur Darstellung von Nutzer-Routen und Begegnungen verschiedener Typen, mit Kontextinformationen zu den Begegnungen.

- Motivation: Begegnungen während einer Outdoor-Aktivität mit Trackingdaten nachvollziehen. Zum Beispiel zeigt Strava-Flyby (https://labs.strava.com/flyby/) GPS-Tracks von mehreren Sportlern, die eine gleiche Teilroute zur gleichen Zeit absolvieren. Strava legt dabei den Fokus auf die Tracking-Daten und den Verlauf der Begegnung. Es gibt aber noch weitere denkbare Arten von virtuellen Begegnungen. Außerdem kann mehr Kontext zu einer Begegnung dargestellt werden.

Definition (Verschiedene Arten von Begegnungen):
- Ein Ort kann durch zwei Routen zu unterschiedlichen Zeiten aufgesucht werden.
- Ein Nutzer kann andere Nutzer, andere Wesen oder sich selbst treffen.
- Eine geplante Route kann Orte enthalten, die auch in gespeicherten Routen enthalten ist.

Definition (Begegnungen mit Tieren):
- Tatsächliche Begegnungen (abgleichen mit Animal-Tracking-APIs).
- Mögliche Begegnungen (abfragen von Datenbanken zur Verbreitung von Arten; erfordert zusätzliche Angabe zur Route durch den Nutzer).

Definition (Kontextinformationen zu Begegnungen):
- Möglich ist die Anzeige von weiteren interessanten Informationen wie Wetter, nahe POIs, oder Art der Umgebung (Stadt, Wald, Meer, …).

Anforderungen (Funktional):

- Die Webapp ermöglicht das Auffinden und Anzeigen von Routen und Begegnungen in einfacher Weise. Ein möglicher Lösungsansatz enthält z.B. Auflistungen mit Suchfunktion und/oder Filter für Nutzer, Routen und Begegnungen.

- Das Interface ist benutzerfreundlich gestaltet und alle gängigen Browser und Geräte können die Webapp korrekt ausführen.

- Die Webapp startet mit der Hauptfunktion oder einer Startseite und hat ein schnell erreichbares Impressum (z.B. im Footer-Bereich)

- Die Webapp hat einen Backend-Bereich zur Verwaltung von Routen. Routen werden mit Nutzerzugehörigkeit, Datum, Zeit und Routen-Typen (z.B. Aufnahme, Plan, …) gespeichert. Vorhandene Software zur Verwaltung von Routen darf wieder verwendet werden.

- Jede Begegnung erhält einen “Teilen”-Button, der die Begegnung eindeutig identifiziert und aufrufbar macht. Es kann sinnvoll sein, Begegnungen vorzuberechnen und zu speichern, statt diese bei einem Zugriff oder einer Suche zu berechnen.

Eingesetzt werden außerdem Docker, Git, Unit-Tests und Logging. Weitere Anforderungen an die Technik, Qualitätsmerkmale und Hinweise zur Abgabe sind in den Vorlesungsunterlagen ([Termin 13.pdf](https://www.uni-muenster.de/LearnWeb/learnweb2/pluginfile.php/2000309/mod_resource/content/1/Termin%2013.pdf#page=33)) dokumentiert.  
