1. Install Firefox Developer Edition: https://www.mozilla.org/en-US/firefox/developer/
2. Install Visual Studio Code: https://code.visualstudio.com
3. Install nodejs: https://nodejs.org/en/
4. clone and set up the project: see tutorial video
5. Install the firefox debugger for VScode: https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug


Building Artifacts:
1. Naviage into the Trawler/extension
2. Run `web-ext build -a "artifacts"`
    
    3. If this is the first time you run this command a directory called artifacts will be created /Trawler/extension/artifacts/
4. A file will created in the Trawler/extension/artifacts that ends in .zip
5. Rename this file to end with .xip instead of .zip.
6. This can now be installed as a standard firefox extension
    Note that this will only work in firefox dev edition since this artifact is not signed by Mozilla
