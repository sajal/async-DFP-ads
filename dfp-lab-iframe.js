/***
Author : Sajal Kayan
DFP Async Loader

This method uses DFP's iframe tagging method which *does not* allow expandable ad units!

IMPORTANT: This script must be called AFTER LABjs is loaded.

Copyright (c) 2011, Sajal Kayan
All rights reserved.

Released under The BSD license as defined at the following URL:-
http://www.opensource.org/licenses/bsd-license.php

*/

// usage DFPasync(adslots, DFPpubid);
var DFPasync = (function(adslots, DFPpubid){
  function docwrt(str){
    var script = str.replace(/(.*)\=\"/g, '').replace(/\"(.*)/g, '');
    if (script.match(/cookie\.js/g)){
      // When user does not have a tracking cookie installed, Google writes a script 
      // tag to install the cookie.
      $LAB.script(script).wait();
    } else {
      $LAB.script(script).wait(function(){
        // (Step 4)Still bootstrapping -- no support yet(TODO) for optional step 3 i.e. setting page attributes
        GA_googleUseIframeRendering();
        // following function makes the magic happen!
        function Wrapper_googleFillSlotWithSize(targetad){
          var docwrttemp = function(str){
            // fills the html from GA_googleFillSlotWithSize into the desired element
            document.getElementById(targetad.target).innerHTML = str;
          };  
          document.write = docwrttemp; // intercepts document.write from GA_googleFillSlotWithSize()
          //step 5: The actual function with document.write()'s an iframe
          GA_googleFillSlotWithSize(targetad.pubid, targetad.slotname, targetad.width, targetad.height);
        }
        for (var x in adslots){
          //using wrapper to call GA_googleFillSlotWithSize
          Wrapper_googleFillSlotWithSize(adslots[x]);
        }
      });
    }
  }
  
  if (adslots){ //load DFP only if global adslots are loaded
    document.write = docwrt; //intercepts document.write from below script
    // iframe loader doc: http://www.google.com/support/dfp_sb/bin/answer.py?hl=en&answer=90777
    // (Step 1): The first script tag -- Execution starts here
    $LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function(){
      // (Step 2)
      GS_googleAddAdSenseService(DFPpubid); // DFPpubid = global variable ca-pub-XXXX
      GS_googleEnableAllServices(); // This has a document.write which we intercept using docwrt() function
    });
  }
});
