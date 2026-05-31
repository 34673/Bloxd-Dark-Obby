# Bloxd-Dark-Obby
##Schematics and World/block code for work-in-progress `Dark Obby` map, made by Bored_Coyote and FrostyWeasel2334895.

Notes:
• Map currently contains two sectors with no ending.
• Teleport coordinates may be incorrect because of how the origin of the schematics works when importing. Will possibly require offsetting the map to its intended origin/position or fixing each sector code block.
• Persistent data was attempted via database (from the API) and global data, to no avail. In the current state of the code, progress will likely be lost when the lobby instance closes (no client connected) and bugs (duplicate one-off items) may happen since it wasn't thoroughly tested because of these limitations. It seems the only way to have truly persistent data is to take up inventory space with special items (what the previous approaches tried to avoid). Maybe there's a way to serialize the entire database into a single inventory item with custom attributes, but that hasn't been tested at this time.