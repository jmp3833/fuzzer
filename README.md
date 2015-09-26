# fuzzer
SWEN-331 Project

AUTHORS
------------
Justin Peterson
Keegan Parrote
Carlos Castro

DESCRIPTION
------------
A simple fuzz tester written in javascript using the Node.js framework.

CONFIGURATION
------------
This software requires the following, please download and install these before proceeding:
    Node.js (https://nodejs.org/en/) min. v4.1.1


INSTALL
------------
After installing Node, check to see if Node is in your path(it should add it automatically). To do this, open up your
start menu/screen, type cmd inthe search bar, and run "cmd.exe". Type in "echo %path%" without the quotes to display your
path. If you see "C:\Users\Username\AppData\Roaming\npm"at the end of your path, where Username is substituted by your own
username, you're good to go! If you don't, then follow the instructions on https://java.com/en/download/help/path.xml to
learn how to add things to your path and add the above "C:\Users\Username\AppData\Roaming\npm" (replacing Username with
your own local username), and make sure to double check that directory to see that the files were appropriately installed
there.

After node is set up, navigate to the directory where fuzzer is installed (this is where app.js is stored in) and run
"npm install" in initialize the application (this will install all dependencies automatically for you).

OPERATION
------------
To run the tester, open up cmd.exe again and navigate to the directory where the fuzz tester is installed. Once there,
type in "node app.js command url", replacing "command" with your desired command(detailed list below) and url with your
target website to test's url, and the fuzzer will have begun crawling through the site. Addtionally, you can add flags
after those to use additional options for the fuzzer, also detailed below(the ones that are prefixed with "--").

List of commands and their functionality:
COMMANDS:
  * `discover`: Output a comprehensive, human-readable list of all discovered inputs to the system. Techniques include both crawling and guessing.
OPTIONS:
  * `--custom-auth=string`     Signal that the fuzzer should use hard-coded authentication for a specific application (e.g. dvwa). Optional.
  *  `--common-words=file`     Newline-delimited file of common words to be used in page guessing and input guessing

