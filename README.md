# GeoSoftware1-Projektaufgabe
##Aufgabenstellung

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

Eingesetzt werden außerdem Docker, Git, Unit-Tests und Logging. Weitere Anforderungen an die Technik, Qualitätsmerkmale und Hinweise zur Abgabe sind in den Vorlesungsunterlagen (Termin 13.pdf) dokumentiert. 