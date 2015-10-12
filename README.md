# fuzzer
SWEN-331 Project

AUTHORS
------------
Justin Peterson, Keegan Parrote, and Carlos Castro

DESCRIPTION
------------
A simple fuzz tester written in javascript using the Node.js framework.

CONFIGURATION
------------
This software requires the following, please download and install these before proceeding:
* Node.js (https://nodejs.org/en/) min. v4.1.1


INSTALL THE FUZZER
------------
Ensure Node is in your system's path (although the install should add it automatically).
  1. Open you start menu/screen and search for `cmd` and hit enter to open a command prompt.
  2. Type the command `echo %path%` to display your path.
  3. Make sure you see `C:\Users\Username\AppData\Roaming\npm` (where `Username` is substituted by your own username) listed (it should be at the end if you just installed Node).
  4. If you do not see that in your path then follow the instructions [here](https://java.com/en/download/help/path.xml) to
learn how to add things to your path.  Add the above `C:\Users\Username\AppData\Roaming\npm` and make sure to double check that directory to see that the files were appropriately installed there.

After Node is set up you will need to install our dependencies for the fuzzer.
  1. Within the command prompt, navigate to the folder where `app.js` is located.  The command `cd C:\path\to\app.js` (where `path\to\app.js` is substituted with the filepath to app.js) will take you there.
  2. Run the command `npm install` on the command line once you are in the proper folder with `app.js`.  This will install all dependencies automatically for you.

OPERATION
------------
The tester is also run from the command prompt from the folder with `app.js`.  Use the command `node app.js command url` to run the fuzzer.  Details on commands and options are listed below.  Also note that `url` requires a port as well e.g. `http://localhost:8080` or `http://localhost:80`.

List of commands and their functionality:
COMMANDS:
  * `discover`: Output a comprehensive, human-readable list of all discovered inputs to the system. Techniques include both crawling and guessing.
OPTIONS:
  * `--custom-auth=string`     Signal that the fuzzer should use hard-coded authentication for a specific application (e.g. dvwa). Optional.
  *  `--common-words=file`     Newline-delimited file of common words to be used in page guessing and input guessing

OUTPUT
------------
The program will produce output like the following:
```
Properly authenticated into DVWA!
Searching for cookies!
==============================
Cookie="PHPSESSID=tpdr3bsljd9nm5vffvo04nege5; Domain=localhost; Path=/; hostOnly=?; aAge=?; cAge=1229ms"
==============================
Cookie="security=high; Domain=localhost; Path=/dvwa; hostOnly=?; aAge=?; cAge=1229ms"
==============================
Pages and input fields discovered:
{
  "http://localhost/": {
    "query-params": [],
    "form-params": {}
  },
  "http://localhost/WebGoat/attack": {
    "query-params": [],
    "form-params": {}
  },
  "http://localhost/dvwa": {
    "query-params": [],
    "form-params": {}
  },
  "http://localhost/dvwa/": {
    "query-params": [],
    "form-params": {}
  },
  "http://localhost/dvwa/instructions.php": {
    "query-params": [],
    "form-params": {}
  },
  "http://localhost/dvwa/setup.php": {
    "query-params": [],
    "form-params": {
      "0": [
        "create_db"
      ]
    }
  },
  "http://localhost/dvwa/vulnerabilities/brute/": {
    "query-params": [],
    "form-params": {
      "0": [
        "username",
        "password",
        "Login"
      ]
    }
  },
  "http://localhost/dvwa/vulnerabilities/exec/": {
    "query-params": [],
    "form-params": {
      "0": [
        "ip",
        "submit"
      ]
    }
  },
  "http://localhost/dvwa/vulnerabilities/csrf/": {
    "query-params": [],
    "form-params": {
      "0": [
        "password_current",
        "password_new",
        "password_conf",
        "Change"
      ]
    }
  },
  "http://localhost/dvwa/vulnerabilities/fi/": {
    "query-params": [],
    "form-params": {}
  }
}

Process finished with exit code 0

```
This details information regarding cookies, available paths, and any query paramaters or form paramaters that can be provided as input to those paths.
