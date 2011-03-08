/***
Author : Sajal Kayan
DFP Async Loader

This method uses DFP's iframe tagging method which *does not* allow expandable ad units!

IMPORTANT: This script must be called AFTER LABjs is loaded.
*/

(function(){
  function docwrt(str){
    //console.log(str);
    var script = str.replace(/(.*)\=\"/g, '').replace(/\"(.*)/g, '');
          //console.log(script.match(/cookie\.js/g));
          if (script.match(/cookie\.js/g)){
            //console.log("cookiejs")
      $LAB.script(script).wait();
    } else {
      $LAB.script(script).wait(function(){
        GA_googleUseIframeRendering();
        // following function makes the magic happen!
        function Wrapper_googleFillSlotWithSize(targetad){
          var pubid = targetad["pubid"];
          var slotname  = targetad["slotname"];
          var width = targetad["width"];
          var height = targetad["height"];
          var target  = targetad["target"];
          var docwrttemp = function(str){
            //console.log(str);
            target = document.getElementById(target);
            target.innerHTML = str;
          };  
          document.write = docwrttemp;
          GA_googleFillSlotWithSize(pubid, slotname, width, height);
        }
        for (var x in adslots){
            // usage of the new wrapper here.see more info about adslots object in docs
          Wrapper_googleFillSlotWithSize(adslots[x]);
        }
      });
    }
  }
  
  if (adslots){
    document.write = docwrt; //intercepts document.write from below script
    $LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function(){
      GS_googleAddAdSenseService(DFPpubid);
      GS_googleEnableAllServices();
    });
  }

})();