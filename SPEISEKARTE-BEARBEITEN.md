# Speisekarte bearbeiten

Alle Gerichte stehen in `speisekarte.json`. Für Änderungen an Gerichten musst du `index.html` nicht bearbeiten.

## Gericht ändern oder hinzufügen

Jedes Gericht steht im `items`-Array eines Bereichs. Die Felder sind:

- `name`: türkischer bzw. angezeigter Gerichtsname
- `germanName`: deutsche Beschreibung; leer lassen, wenn nicht benötigt
- `content`: Zutaten oder Beilagen als Liste; ohne Zusatzangaben `[]` verwenden
- `price`: Preis als Text, zum Beispiel `"20€"` oder `"7€ / 10€"`

Beispiel:

```json
{ "name": "Adana Kebap", "germanName": "Lammhackfleisch", "content": ["Salat", "Pommes/ Reis/ Bulgur"], "price": "20€" }
```

Kopiere ein vorhandenes Gericht im passenden `items`-Array, ändere die Werte und trenne Einträge mit einem Komma. Achte darauf, dass alle Texte in doppelten Anführungszeichen stehen.

## Bereich oder Kategorie hinzufügen

Ein Bereich ist ein Eintrag in `sections` und kann einen Namen wie `Grillteller` haben. Für eine neue Kategorie fügst du ein Objekt im obersten `categories`-Array hinzu:

```json
{
  "id": "dessert",
  "name": "Dessert",
  "icon": "extras",
  "sections": [
    {
      "name": "Desserts",
      "items": [
        { "name": "Baklava", "germanName": "Blätterteiggebäck", "content": [], "price": "5€" }
      ]
    }
  ]
}
```

Die `id` muss eindeutig sein. Für `icon` kannst du `teller`, `sandwich`, `wrap`, `teig`, `extras` oder `drinks` verwenden. Der Renderer zeigt neue Kategorien automatisch als Navigationspunkt an.

## Lokal ansehen

Weil die Seite die JSON-Datei lädt, muss sie über HTTP geöffnet werden, nicht direkt per Doppelklick auf `index.html`. Im Projektordner kannst du zum Beispiel starten:

```powershell
python -m http.server 8000
```

Dann im Browser `http://localhost:8000/index.html` öffnen.
