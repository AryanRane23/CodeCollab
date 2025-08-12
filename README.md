'X-RapidAPI-Key': '3d7f474beamsh8d37fc893c0d6cdp11ce22jsn808e66c48d0f',

<ins> ____Single Code Compiler____</ins>
LanguageSelector-DropDown

Basically, after selecting a language from the dropdown you will be redirected to the language page.. along with the "boiler plate" for each language

So, I would make the dropdown into multiple "language buttons" : if you click on it you would be redirected to the specific language that you want. 


<ins> ____Backend Logic - MongoDB____</ins>

**POST** → Used only by the host when creating a new room.
* Saves roomId + language into MongoDB.

**GET**→ Used when anyone tries to join a room with a roomId.
* Checks if the room exists. 
* If not, sends Invalid room ID.

<ins> ____MongoDB - Compass Vs Atlas____</ins>

Compass will connect to a MongoDB server running on your PC.
That means you must have MongoDB installed locally and running in the background.

Atlas is a Databse itself. So use it to run on anyones PC even if they don't have MongoDB

<ins> ____Security Access - MongoDB Atlas____</ins>

## Your IP address changes depending on how you connect to the internet:

*  Home Wi-Fi → usually the same IP until your ISP changes it (could be weeks or months).
   Mobile hotspot → totally different IP.
* So if you whitelist only your home IP in MongoDB Atlas and then switch to hotspot, Atlas will block the connection unless you add that hotspot’s IP too.
* If you want to avoid constantly updating IPs while still being safe, you have two main options:
1. Whitelist multiple IPs (home + hotspot) in Atlas.

2. Use 0.0.0.0/0 temporarily while developing from multiple places, but remove it when done.