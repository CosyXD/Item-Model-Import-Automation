function createResourcePack() {
    var modelInput = document.getElementById('modelfile')
    var textureInput = document.getElementById('texturefile')
    var nameInput = document.getElementById('textinput').value
    var nameSpaceInput = document.getElementById('namespaceinput').value
    var texture = textureInput.files[0];
    var model = modelInput.files[0];

    var zip = new JSZip();

    const packmetaText =
`{
  "pack": {
    "pack_format": 46,
    "description": "Template for resourcepacks."
  }
}`

    var baseName =
`{
  "model": {
    "type": "minecraft:model",
    "model": "${nameSpaceInput}:item/${model.name}"
  }
}`
    var assetsF = zip.folder("assets") /* assetsF means assetsFolde */
    var namespaceF = assetsF.folder(nameSpaceInput)
    var itemsF = namespaceF.folder("items")
    var modelsF = namespaceF.folder("models")
    var texturesF = namespaceF.folder("textures")
    var MitemF = modelsF.folder("item")
    var TitemF = texturesF.folder("item")

    zip.file('pack.mcmeta', packmetaText)

    TitemF.file(texture.name, texture)
    itemsF.file(nameInput + ".json", baseName)


    const reader = new FileReader();

    reader.onload = function(e) {
      let json = JSON.parse(e.target.result);

      json.textures["0"] = nameSpaceInput + ":item/" + texture.name.replace(/\.[^/.]+$/, "");
      json.textures["particle"] = nameSpaceInput + "cavernermodels:item/" + texture.name.replace(/\.[^/.]+$/, "");

      MitemF.file(model.name, JSON.stringify(json, null, 2));

      zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, "example.zip");
      });
    };

    reader.readAsText(model);
}
