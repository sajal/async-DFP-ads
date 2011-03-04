/***
Author : Sajal Kayan
DFP Async Loader

This method uses DFP's iframe tagging method which *does not* allow expandable ad units!

IMPORTANT: This script must be called AFTER LABjs is loaded.
*/


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
      // usage of the new wrapper here "leaderboard" and "skyscraper" are target div ids
      //Wrapper_googleFillSlotWithSize(adslots[1])
      if (adslots){
        for (var x in adslots){
          Wrapper_googleFillSlotWithSize(adslots[x]);
        }
      }
      //Wrapper_googleFillSlotWithSize("ca-pub-7046344781760701", "test_async_lb", 728, 90, "leaderboard");
      //Wrapper_googleFillSlotWithSize("ca-pub-7046344781760701", "test_async_sky", 160, 600, "skyscraper");
    });
  }
}

document.write = docwrt; //intercepts document.write from below script
$LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function(){
  GS_googleAddAdSenseService(DFPpubid);
  GS_googleEnableAllServices();
});
