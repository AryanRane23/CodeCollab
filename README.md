'X-RapidAPI-Key': '3d7f474beamsh8d37fc893c0d6cdp11ce22jsn808e66c48d0f',

<!-- __________________________ Single Code Compiler _____________________________ -->
LanguageSelector-DropDown

Basically, after selecting a language from the dropdown you will be redirected to the language page.. along with the "boiler plate" for each language

So, I would make the dropdown into multiple "language buttons" : if you click on it you would be redirected to the specific language that you want. 

<!-- __________________________ Backend Logic - MongoDB _____________________________ -->

"POST" → Used only by the host when creating a new room.
* Saves roomId + language into MongoDB.

"GET" → Used when anyone tries to join a room with a roomId.
* Checks if the room exists. 
* If not, sends Invalid room ID.